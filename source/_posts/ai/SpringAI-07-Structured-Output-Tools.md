---
title: 七、结构化输出和初代Tools实现
date: 2026-10-26 07:00:00
categories:
  - ai
tags:
  - Spring AI
---
<div class="essay-banner essay-image11">
   Structured Output & Tools
</div>

## 结构化输出
### 基础类型：
以Boolean为例 ， 在agent中可以用于判定用于的内容2个分支，  不同的分支走不同的逻辑

```java
ChatClient chatClient;
@BeforeEach
public  void init(@Autowired
                  DashScopeChatModel chatModel) {
    chatClient = ChatClient.builder(chatModel).build();
}
@Test
public void testBoolOut() {
    Boolean isComplain = chatClient
    .prompt()
    .system("""
            请判断用户信息是否表达了投诉意图?
            只能用 true 或 false 回答，不要输出多余内容
            """)
    .user("你们家的快递迟迟不到,我要退货！")
    .call()
    .entity(Boolean.class);

    // 分支逻辑
    if (Boolean.TRUE.equals(isComplain)) {
        System.out.println("用户是投诉，转接人工客服！");
    } else {
        System.out.println("用户不是投诉，自动流转客服机器人。");
        // todo 继续调用 客服ChatClient进行对话
    }
}
```

### Pojo类型：
用购物APP应该见过复制一个地址， 自动为你填入每个输入框。  用大模型轻松完成！

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch07_1749126843402-3cca89cf-d3a8-40c6-aa95-3664d526feb9_9f65c71b46.png" alt="ch07_1749126843402-3cca89cf-d3a8-40c6-aa95-3664d526feb9_9f65c71b46.png"></div>

```java

    @Test
    public void testEntityOut() {
        Address address = chatClient.prompt()
                .system("""
                        请从下面这条文本中提取收货信息
                        """)
                .user("收货人：张三，电话13588888888，地址：浙江省杭州市西湖区文一西路100号8幢202室")
                .call()
                .entity(Address.class);
        System.out.println(address);
    }
```

```java
public record Address(
    String name,        // 收件人姓名
    String phone,       // 联系电话
    String province,    // 省
    String city,        // 市
    String district,    // 区/县
    String detail       // 详细地址
) {}
```


### 原理
<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch07_1749126360371-0165c51c-79c1-4058-9b1e-32c75182f51d_6662f99fc1.jpeg" alt="ch07_1749126360371-0165c51c-79c1-4058-9b1e-32c75182f51d_6662f99fc1.jpeg"></div>

`ChatModel`或者直接使用低级API：

```java
@Test
    public void testLowEntityOut(
           @Autowired DashScopeChatModel chatModel) {
        BeanOutputConverter<ActorsFilms> beanOutputConverter =
                new BeanOutputConverter<>(ActorsFilms.class);

        String format = beanOutputConverter.getFormat();

        String actor = "周星驰";

        String template = """
        提供5部{actor}导演的电影.
        {format}
        """;

        PromptTemplate promptTemplate = PromptTemplate.builder().template(template).variables(Map.of("actor", actor, "format", format)).build();
        ChatResponse response = chatModel.call(
                promptTemplate.create()
        );

        ActorsFilms actorsFilms = beanOutputConverter.convert(response.getResult().getOutput().getText());
        System.out.println(actorsFilms);
    }
```


## 链接多个模型协调工作实战 - 初代tools： $
#### 背景：
大模型如果它无法和企业API互联那将毫无意义！  比如我们开发一个智能票务助手，  当用户需要退票， 基础大模型它肯定做不到， 因为票务信息都存在了我们系统中， 必须通过我们系统的业务方法才能进行退票。  那怎么能让大模型“调用”我们自己系统的业务方法呢？ 今天叫大家通过结构化输入连接多个模型一起协同完成这个任务：


####  票务助手<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch07_1749133561508-8d90a71e-e734-471e-a36e-5605fabc6b8c_cedfc4a752.png" alt="ch07_1749133561508-8d90a71e-e734-471e-a36e-5605fabc6b8c_cedfc4a752.png"></div>
#### 效果
<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch07_1749133770407-472b9b4b-f1a8-43f2-b3d2-86d40abb3491_d4f72b04df.png" alt="ch07_1749133770407-472b9b4b-f1a8-43f2-b3d2-86d40abb3491_d4f72b04df.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch07_1749133811144-c451d972-8ffc-4760-8b47-dfd14d4db5df_1f12e00328.png" alt="ch07_1749133811144-c451d972-8ffc-4760-8b47-dfd14d4db5df_1f12e00328.png"></div>

输入姓名和预定号：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch07_1749133789344-aab6fec6-8dd9-415f-98cc-1f77c7c45f60_9850f51f40.png" alt="ch07_1749133789344-aab6fec6-8dd9-415f-98cc-1f77c7c45f60_9850f51f40.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch07_1749133804610-66c41dfc-a556-49be-9353-e90eee657c20_245c5419ab.png" alt="ch07_1749133804610-66c41dfc-a556-49be-9353-e90eee657c20_245c5419ab.png"></div>


普通对话：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch07_1749133832665-d12ca731-fae6-4991-8f17-cb0039a9a1ac_39e77779b1.png" alt="ch07_1749133832665-d12ca731-fae6-4991-8f17-cb0039a9a1ac_39e77779b1.png"></div>


#### 代码：
```java
public class AiJob {
     record Job(JobType jobType, Map<String,String> keyInfos) {
    }

    public enum JobType{
        CANCEL,
        QUERY,
        OTHER,
    }
}

```


```java

/**
 * 公众号：程序员SpringAI
 */
@Configuration
public class AiConfig {

    @Bean
    public ChatClient planningChatClient(DashScopeChatModel chatModel,
                                         DashScopeChatProperties options,
                                         ChatMemory chatMemory) {
        DashScopeChatOptions dashScopeChatOptions = DashScopeChatOptions.fromOptions(options.getOptions());
        dashScopeChatOptions.setTemperature(0.7);

            return  ChatClient.builder(chatModel)
                    .defaultSystem("""
                            # 票务助手任务拆分规则
                            ## 1.要求
                            ### 1.1 根据用户内容识别任务
                            
                            ## 2. 任务
                            ### 2.1 JobType:退票(CANCEL) 要求用户提供姓名和预定号， 或者从对话中提取；
                            ### 2.2 JobType:查票(QUERY) 要求用户提供预定号， 或者从对话中提取；
                            ### 2.3 JobType:其他(OTHER)
                            """)
                    .defaultAdvisors(
                            MessageChatMemoryAdvisor.builder(chatMemory).build()
                    )
                    .defaultOptions(dashScopeChatOptions)
                    .build();
    }

    @Bean
    public ChatClient botChatClient(DashScopeChatModel chatModel,
                                    DashScopeChatProperties options,
                                         ChatMemory chatMemory) {

        DashScopeChatOptions dashScopeChatOptions = DashScopeChatOptions.fromOptions(options.getOptions());
        dashScopeChatOptions.setTemperature(1.2);
        return  ChatClient.builder(chatModel)
                .defaultSystem("""
                           你是XS航空智能客服代理， 请以友好的语气服务用户。
                            """)
                .defaultAdvisors(
                        MessageChatMemoryAdvisor.builder(chatMemory).build()
                )
                .defaultOptions(dashScopeChatOptions)
                .build();
    }

}
```

```java

@RestController
public class MultiModelsController {

    @Autowired
    ChatClient planningChatClient;

    @Autowired
    ChatClient botChatClient;


    @GetMapping(value = "/stream", produces = "text/stream;charset=UTF8")
    Flux<String> stream(@RequestParam String message) {
        // 创建一个用于接收多条消息的 Sink
        Sinks.Many<String> sink = Sinks.many().unicast().onBackpressureBuffer();
        // 推送消息
        sink.tryEmitNext("正在计划任务...<br/>");


        new Thread(() -> {
        AiJob.Job job = planningChatClient.prompt().user(message)
                .call().entity(AiJob.Job.class);

        switch (job.jobType()){
            case CANCEL ->{
                System.out.println(job);
                // todo.. 执行业务
                if(job.keyInfos().size()==0){
                    sink.tryEmitNext("请输入姓名和订单号.");
                }
                else {
                    sink.tryEmitNext("退票成功!");
                }
            }
            case QUERY -> {
                System.out.println(job);
                // todo.. 执行业务
                sink.tryEmitNext("查询预定信息：xxxx");
            }
            case OTHER -> {
                Flux<String> content = botChatClient.prompt().user(message).stream().content();
                content.doOnNext(sink::tryEmitNext) // 推送每条AI流内容
                        .doOnComplete(() -> sink.tryEmitComplete())
                        .subscribe();
            }
            default -> {
                System.out.println(job);
                sink.tryEmitNext("解析失败");
            }
        }
        }).start();

        return sink.asFlux();
    }
}
```
