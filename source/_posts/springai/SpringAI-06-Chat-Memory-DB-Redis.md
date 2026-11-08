---
title: 六、对话记忆—数据库和Redis不同的实现
date: 2026-09-06 01:00:00
categories:
  - springai
tags:
  - SpringAi
---

<div class="essay-banner essay-image11">
   <!-- Chat Memory in DB & Redis -->
</div>
大型语言模型 (LLM) 是无状态的，这意味着它们不会保留先前交互的信息。

```java
 @Test
    public void testChatOptions() {
        String content = chatClient.prompt()
                .user("我叫SpringAI ")
                .call()
                .content();
        System.out.println(content);
        System.out.println("--------------------------------------------------------------------------");

       content = chatClient.prompt()
                .user("我叫什么 ？")
                .call()
                .content();
        System.out.println(content);
    }
```

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch06_1748870080223-31727dfd-e598-4a56-8d4a-de362b0d82e8_dd9b3235ce.png" alt="ch06_1748870080223-31727dfd-e598-4a56-8d4a-de362b0d82e8_dd9b3235ce.png"></div>

那我们平常跟一些大模型聊天是怎么记住我们对话的呢？实际上，每次对话都需要将之前的对话消息内置发送给大模型，这种方式称为多轮对话。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch06_1748870240621-6c24ff74-035a-426e-bd0f-a5e60e5c15f4_2bd890a5af.png" alt="ch06_1748870240621-6c24ff74-035a-426e-bd0f-a5e60e5c15f4_2bd890a5af.png"></div>

SpringAi提供了一个`ChatMemory`的组件用于存储聊天记录，允许您使用 LLM 跨多个交互存储和检索信息。并且可以为不同用户的多个交互之间维护上下文或状态。
可以在每次对话的时候把当前聊天信息和模型的响应存储到ChatMemory， 然后下一次对话把聊天记录取出来再发给大模型。  

```java

`

//输出 名字叫SpringAI
```

## 但是这样做未免太麻烦！ 能不能简化？ 思考一下！

 用我们之前的Advisor对话拦截是不是就可以不用每次手动去维护了。  并且SpringAi早已体贴的为我提供了`ChatMemoryAutoConfiguration`自动配置类

```xml
<dependency>
  <groupId>org.springframework.ai</groupId>
  <artifactId>spring-ai-autoconfigure-model-chat-memory</artifactId>
</dependency>
```

```java
@AutoConfiguration
@ConditionalOnClass({ ChatMemory.class, ChatMemoryRepository.class })
public class ChatMemoryAutoConfiguration {

	@Bean
	@ConditionalOnMissingBean
	ChatMemoryRepository chatMemoryRepository() {
		return new InMemoryChatMemoryRepository();
	}

	@Bean
	@ConditionalOnMissingBean
	ChatMemory chatMemory(ChatMemoryRepository chatMemoryRepository) {
		return MessageWindowChatMemory.builder().chatMemoryRepository(chatMemoryRepository).build();
	}

}
```

所以我们可以这样用：

### 使用

SpringAi提供了  `PromptChatMemoryAdvisor`   专门用于对话记忆的拦截

```java

@SpringBootTest
public class ChatMemoryTest {
    ChatClient chatClient;
    @BeforeEach
    public  void init(@Autowired
                      DeepSeekChatModel chatModel,
                      @Autowired
                      ChatMemory chatMemory) {
        chatClient = ChatClient
                .builder(chatModel)
                .defaultAdvisors(
                        PromptChatMemoryAdvisor.builder(chatMemory).build()
                )
                .build();
    }
    @Test
    public void testChatOptions() {
        String content = chatClient.prompt()
                .user("我叫SpringAI ？")
                .advisors(new ReReadingAdvisor())
                .call()
                .content();
        System.out.println(content);
        System.out.println("--------------------------------------------------------------------------");

        content = chatClient.prompt()
                .user("我叫什么 ？")
                .advisors(new ReReadingAdvisor())
                .call()
                .content();
        System.out.println(content);
    }
}


```

### 配置聊天记录最大存储数量

你要知道， 我们把聊天记录发给大模型， 都是算token计数的。
大模型的token是有上限了，  如果你发送过多聊天记录，可能就会导致token过长。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch06_1748871034319-bcb8f5e9-b1bb-431e-8776-f54d93d6ff85_45c2fb393a.png" alt="ch06_1748871034319-bcb8f5e9-b1bb-431e-8776-f54d93d6ff85_45c2fb393a.png"></div>

并且更多的token也意味更多的费用， 更久的解析时间.  所以不建议太长
（DEFAULT_MAX_MESSAGES默认20即10次对话）
  一旦超出DEFAULT_MAX_MESSAGES只会存最后面N条（可以理解为先进先出），参考`MessageWindowChatMemory`源码

```java
   @Bean
   ChatMemory chatMemory(ChatMemoryRepository chatMemoryRepository) {
        return MessageWindowChatMemory
                .builder()
                .maxMessages(10)
                .chatMemoryRepository(chatMemoryRepository).build();
    }
```

### 配置多用户隔离记忆

如果有多个用户在进行对话， 肯定不能将对话记录混在一起， 不同的用户的对话记忆需要隔离

```java
@Test
    public void testChatOptions() {
        String content = chatClient.prompt()
                .user("我叫SpringAI ？")
                .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID,"1"))
                .call()
                .content();
        System.out.println(content);
        System.out.println("--------------------------------------------------------------------------");

        content = chatClient.prompt()
                .user("我叫什么 ？")
                .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID,"1"))
                .call()
                .content();
        System.out.println(content);


        System.out.println("--------------------------------------------------------------------------");

        content = chatClient.prompt()
                .user("我叫什么 ？")
                .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID,"2"))
                .call()
                .content();
        System.out.println(content);
    }
```

会发现， 不同的CONVERSATION_ID，会有不同的记忆

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch06_1748871907406-385208ea-02bf-40d8-ab33-48ee834f59a4_d603e8c94e.png" alt="ch06_1748871907406-385208ea-02bf-40d8-ab33-48ee834f59a4_d603e8c94e.png"></div>

### 原理源码$

主要有前置存储
`MessageWindowChatMemory`
具体存储实现
`ChatMemoryRepository`

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch06_1748936717843-1c2d02a4-1b8a-4e14-89c8-e6809b240893_d17c1e4d47.png" alt="ch06_1748936717843-1c2d02a4-1b8a-4e14-89c8-e6809b240893_d17c1e4d47.png"></div>

### 数据库存储对话记忆

默认情况， 对话内容会存在jvm内存会导致：
1. 一直存最终会撑爆JVM导致OOM。
2. 重启就丢了， 如果已想存储到第三方存储进行持久化
springAi内置提供了以下几种方式（例如 Cassandra、JDBC 或 Neo4j）， 这里演示下JDBC方式
1. 添加依赖

```xml

        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-starter-model-chat-memory-repository-jdbc</artifactId>
        </dependency>

        <!--jdbc-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>


        <!--mysql驱动-->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
```

2. 添加配置

```properties
spring.ai.chat.memory.repository.jdbc.initialize-schema=always
spring.ai.chat.memory.repository.jdbc.schema=classpath:/schema-mysql.sql
```

```yaml
spring:
  datasource:
    username: root
    password: 123456
    url: jdbc:mysql://localhost:3306/springai?characterEncoding=utf8&useSSL=false&serverTimezone=UTC&
    driver-class-name: com.mysql.cj.jdbc.Driver
```

3. 配置类

```java
@Configuration
public class ChatMemoryConfig {


    @Bean
    ChatMemory chatMemory(JdbcChatMemoryRepository chatMemoryRepository) {
        return MessageWindowChatMemory
        .builder()
        .maxMessages(1)
        .chatMemoryRepository(chatMemoryRepository).build();
    }

}

```

4. resources/schema-mysql.sql（目前1.0.0版本需要自己定义，没有提供脚本）

```java
CREATE TABLE IF NOT EXISTS SPRING_AI_CHAT_MEMORY (
    `conversation_id` VARCHAR(36) NOT NULL,
    `content` TEXT NOT NULL,
    `type` VARCHAR(10) NOT NULL,
    `timestamp` TIMESTAMP NOT NULL,

    INDEX `SPRING_AI_CHAT_MEMORY_CONVERSATION_ID_TIMESTAMP_IDX` (`conversation_id`, `timestamp`)
    );
```

5. 测试

```java

@SpringBootTest
public class ChatMemoryTest {


    ChatClient chatClient;
    @BeforeEach
    public  void init(@Autowired
                      DeepSeekChatModel chatModel,
                      @Autowired
                      ChatMemory chatMemory) {
        chatClient = ChatClient
                .builder(chatModel)
                .defaultAdvisors(
                        PromptChatMemoryAdvisor.builder(chatMemory).build()
                )
                .build();
    }
    @Test
    public void testChatOptions() {
        String content = chatClient.prompt()
                .user("你好，我叫SpringAI！")
                .advisors(new ReReadingAdvisor())
                .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID,"1"))
                .call()
                .content();
        System.out.println(content);
        System.out.println("--------------------------------------------------------------------------");

        content = chatClient.prompt()
                .user("我叫什么 ？")
                .advisors(new ReReadingAdvisor())
                .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID,"1"))
                .call()
                .content();
        System.out.println(content); 
    }
}

```

可以看到由于我设置`.maxMessages(1)`数据库只存一条

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch06_1748937116139-c2400662-b5af-4f98-8c37-cce47407912a_8c5b279922.png" alt="ch06_1748937116139-c2400662-b5af-4f98-8c37-cce47407912a_8c5b279922.png"></div>

### Redis存储

如果你想用redis ， 你需要自己实现ChatMemoryRepository接口（自己实现增、删、查）
但是alibaba-ai有现成的实现：（还包括ES）
[https://github.com/alibaba/spring-ai-alibaba/tree/main/community/memories](https://github.com/alibaba/spring-ai-alibaba/tree/main/community/memories)

```java
<properties>
    <jedis.version>5.2.0</jedis.version>
</properties>

<dependency>
    <groupId>com.alibaba.cloud.ai</groupId>
    <artifactId>spring-ai-alibaba-starter-memory-redis</artifactId>
</dependency>


    <dependency>
        <groupId>redis.clients</groupId>
        <artifactId>jedis</artifactId>
        <version>${jedis.version}</version>
    </dependency>
```

```java
 
spring:
  ai:
    memory:
      redis:
        host: localhost
        port: 6379
        timeout:  5000
        password:
```

```java

@Configuration
public class RedisMemoryConfig {

    @Value("${spring.ai.memory.redis.host}")
    private String redisHost;
    @Value("${spring.ai.memory.redis.port}")
    private int redisPort;
    @Value("${spring.ai.memory.redis.password}")
    private String redisPassword;
    @Value("${spring.ai.memory.redis.timeout}")
    private int redisTimeout;

    @Bean
    public RedisChatMemoryRepository redisChatMemoryRepository() {
        return RedisChatMemoryRepository._builder_()
                .host(redisHost)
                .port(redisPort)
                // 若没有设置密码则注释该项
//           .password(redisPassword)
                .timeout(redisTimeout)
                .build();
    }
}
```

### **多层次记忆架构 ****痛点**

记忆多=聪明， 记忆多会触发token上限
要知道， 无论你用什么存储对话以及， 也只能保证服务端的存储性能。  
但是一旦聊天记录多了依然会超过token上限， 但是有时候我们依然希望存储更多的聊天记录，这样才能保证整个对话更像“人”。  
**多层次记忆架构（模仿人类）**
    - **近期记忆**：保留在上下文窗口中的最近几轮对话，每轮对话完成后立即存储（可通过ChatMemory）；   10 条
    - **中期记忆**：通过RAG检索的相关历史对话(每轮对话完成后，异步将对话内容转换为向量并存入向量数据库）    5条
    - **长期记忆**：关键信息的固化总结
        * **方式一：定时批处理**
            + 通过定时任务（如每天或每周）对积累的对话进行总结和提炼
            + 提取关键信息、用户偏好、重要事实等
            + 批处理方式降低计算成本，适合大规模处理
        * **方式二：关键点实时处理**
            + 在对话中识别出关键信息点时立即提取并存储
            + 例如，当用户明确表达偏好、提供个人信息或设置持久性指令时
            + 采用"写入触发器"机制，在特定条件下自动更新长期记忆
