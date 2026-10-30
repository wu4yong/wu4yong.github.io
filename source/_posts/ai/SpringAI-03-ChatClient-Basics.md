---
title: 三、ChatClient的基本使用及实战
date: 2026-10-26 03:00:00
categories:
  - ai
tags:
  - Spring AI
---

<div class="essay-banner essay-image11">
   ChatClient Basics
</div>

## ChatClient

ChatClient 基于ChatModel进行了封装提供了通用的 API，它适用所有的大模型， 使用ChatClient可以让你面向SpringAi通用的api 而无需面向为每一种不同的模型的api来进行编程，
虽然您仍然可以使用 ChatModel 来实现某些模型更加个性化的操作（ChatModel更偏向于底层），但 ChatClient 提供了灵活、更全面的方法来构建您的客户端选项以与模型进行交互：
比如系统提示词、格式式化响应、聊天记忆 、tools 都更加易用和优雅，所以除非ChatClient无法实现，
否则我们**优先考虑用ChatClient**。
所以我们后续基于ChatClient来进行学习应用。   基于ChatModel来学习源码，因为ChatClient底层依然还是ChatModel的封装。

### 基本使用

+ **必须通过ChatClient.Builder 来进行构造**

```java
 @SpringBootTest
public class ChatClientTest {
    @Test
    public void testChatClient(ChatClient.Builder builder) {

        ChatClient chatClient =builder.build();
        String content = chatClient.prompt()
                .user("Hello")
                .call()
                .content();
        System.out.println(content);
    }
}
```

这种方式会在底层自动注入1个`ChatModel `， 如果你配置了多个模型依赖，  会无法注入。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch03_1748589278091-50435556-59e5-4967-8bba-c7aded90781a_aa8bc4b9f9.png" alt="ch03_1748589278091-50435556-59e5-4967-8bba-c7aded90781a_aa8bc4b9f9.png"></div>

可以通过这种方式动态选择ChatModel：

```java
@SpringBootTest
public class ChatClientTest {

    @Test
    public void testChatOptions(@Autowired
                                    DeepSeekChatModel chatModel) {

        ChatClient chatClient = ChatClient.builder(chatModel).build();
        String content = chatClient.prompt()
                .user("Hello")
                .call()
                .content();
        System.out.println(content);
    }
}

```

### 流式

```java
@Test
    public void testChatStream() {
        Flux<String> content = chatClient.prompt()
                .user("Hello")
                .stream()
                .content();

        // 阻塞输出
        content.toIterable().forEach(System.out::println);
    }
```

## 《多个模型动态切管理实战》

1）application.properties

```properties
# DeepSeek 配置
spring.ai.deepseek.chat.api-key=你的APIKey
spring.ai.deepseek.chat.options.model=deepseek-chat

# Ollama 配置，模型暂定qwen3:4b已拉取到本地
spring.ai.ollama.chat.base-url=http://localhost:11434
spring.ai.ollama.chat.options.model=qwen3:4b
```

```xml
<!-- DeepSeek -->
 <dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-starter-model-deepseek</artifactId>
</dependency>
<!-- Ollama -->
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-starter-model-ollama</artifactId>
</dependency>
```

定义3个ChatClient的bean。  也可以根据请求动态创建， 看需求

```java

/**
 * 公众号：程序员SpringAI
 */
@Configuration
public class AiConfig {

    @Bean
    public ChatClient deepseekR1(DeepSeekChatProperties chatProperties) {

        DeepSeekApi deepSeekApi = DeepSeekApi.builder()
                .apiKey(System.getenv("DEEP_SEEK_KEY"))
                .build();


        DeepSeekChatModel deepSeekChatModel = DeepSeekChatModel.builder()
                .deepSeekApi(deepSeekApi)
                .defaultOptions(DeepSeekChatOptions.builder().model(DeepSeekApi.ChatModel.DEEPSEEK_REASONER).build())
                .build();

        return ChatClient.builder(deepSeekChatModel).build();
    }

    @Bean
    public ChatClient deepseekV3() {

        DeepSeekApi deepSeekApi = DeepSeekApi.builder()
                .apiKey(System.getenv("DEEP_SEEK_KEY"))
                .build();


        DeepSeekChatModel deepSeekChatModel = DeepSeekChatModel.builder()
                .deepSeekApi(deepSeekApi)
                .defaultOptions(
                        DeepSeekChatOptions.builder()
                                .model(DeepSeekApi.ChatModel.DEEPSEEK_CHAT)
                                .build()
                )
                .build();

        return ChatClient.builder(deepSeekChatModel).build();
    }

    @Bean
    public ChatClient ollama(@Autowired OllamaApi ollamaApi, @Autowired OllamaChatProperties options) {
        OllamaChatModel ollamaChatModel = OllamaChatModel.builder()
                .ollamaApi(ollamaApi)
                .defaultOptions(OllamaOptions.builder().model(options.getModel()).build())
                .build();

        return ChatClient.builder(ollamaChatModel).build();
    }

}

```

请求：

```java
@RestController
public class MultiModelsController {

    @Autowired
    private Map<String, ChatClient> chatClientMap;

    @GetMapping("/chat")
    String generation(@RequestParam String message,
                      @RequestParam String model) {
        ChatClient chatClient = chatClientMap.get(model);
        String content = chatClient.prompt().user(message).call().content();
        return content;
    }
}
```
