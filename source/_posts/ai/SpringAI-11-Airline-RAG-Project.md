---
title: 十一、《基于航空智能客服+RAG》实战
date: 2026-10-26 11:00:00
categories:
  - ai
tags:
  - Spring AI
---
<div class="essay-banner essay-image11">
   Airline Smart Customer Service (RAG)
</div>

### 《基于航空智能客服+RAG》实战
1. 配置向量数据库
2. 写入数据（Embedding）
3. 查询

[terms-of-service.txt](https://www.yuque.com/attachments/yuque/0/2026/txt/22309163/1768368649569-6df9cfa2-b281-4abf-82f6-10252267d731.txt)

```plain
本服务条款适用于您对 Funnair 的体验。预订航班，即表示您同意这些条款。
1. 预订航班
- 通过我们的网站或移动应用程序预订。
- 预订时需要全额付款。
- 确保个人信息（姓名、ID 等）的准确性，因为更正可能会产生 25 的费用。
2. 更改预订
- 允许在航班起飞前 24 小时更改。
- 通过在线更改或联系我们的支持人员。
- 改签费：经济舱 50，豪华经济舱 30，商务舱免费。
3. 取消预订
- 最晚在航班起飞前 48 小时取消。
- 取消费用：经济舱 75 美元，豪华经济舱 50 美元，商务舱 25 美元。
- 退款将在 7 个工作日内处理。
```


#### 向量数据库
```java
	@Bean
	public VectorStore vectorStore(EmbeddingModel embeddingModel) {
		return new SimpleVectorStore(embeddingModel);
	}

```

写入向量数据库
<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch11_1730894384826-1fc20e94-3ba1-4514-b20f-bb04a24dc3e1_8d06c771f0.webp" alt="ch11_1730894384826-1fc20e94-3ba1-4514-b20f-bb04a24dc3e1_8d06c771f0.webp"></div>


```java
@Bean
CommandLineRunner ingestTermOfServiceToVectorStore(EmbeddingModel embeddingModel, VectorStore vectorStore,
                                                   @Value("classpath:rag/terms-of-service.txt") Resource termsOfServiceDocs) {

    return args -> { 
        vectorStore.write(                                  // 3.写入
            new TokenTextSplitter().transform(          // 2.转换
                new TextReader(termsOfServiceDocs).read())  // 1.读取
        );

    };
}
```


**配置Advisor：**

new QuestionAnswerAdvisor(vectorStore, SearchRequest.defaults()), // RAG

`QuestionAnswerAdvisor`可以在用户发起的提问时，先向数据库查询相关的文档，再把相关的文档拼接到用户的提问中，再让模型生成答案。那就是`RAG`的实现了。

```java
 this.chatClient = chatClientBuilder
                .defaultSystem("""
					   您是“图灵”航空公司的客户聊天支持代理。请以友好、乐于助人且愉快的方式来回复。
                       您正在通过在线聊天系统与客户互动。
                       
                        在提供有关预订或取消预订的信息之前，您必须始终
                        从用户处获取以下信息：预订号、客户姓名。
                        在询问用户之前，请检查消息历史记录以获取此信息。
                        在更改或退订之前，请先获取预订信息待用户回复确定之后才进行更改或退订的function-call。 
                       请讲中文。
                       今天的日期是 {current_date}.
					""")
                .defaultAdvisors(
                        new PromptChatMemoryAdvisor(chatMemory),
    						new QuestionAnswerAdvisor(vectorStore, SearchRequest.defaults()), // RAG
                        new LoggingAdvisor())
				.defaultFunctions("getBookingDetails", "changeBooking", "cancelBooking") // FUNCTION CALLING
				.build();
```


#### 文档嵌入
在上面的`VectorStore`配置中我们提供了`EmbeddingModel`，调用`vectorStore.add(splitDocuments)`底层会把文档给`EmbeddingModel`把文本变成向量然后再存入向量数据库。

```java
private final VectorStore vectorStore;
   /**
     * 嵌入文件
     *
     * @param file 待嵌入的文件
     * @return 是否成功
     */
    @SneakyThrows
    @PostMapping("embedding")
    public Boolean embedding(@RequestParam MultipartFile file) {
        // 从IO流中读取文件
        TikaDocumentReader tikaDocumentReader = new TikaDocumentReader(new InputStreamResource(file.getInputStream()));
        // 将文本内容划分成更小的块
        List<Document> splitDocuments = new TokenTextSplitter()
                .apply(tikaDocumentReader.read());
        // 存入向量数据库，这个过程会自动调用embeddingModel,将文本变成向量再存入。
        vectorStore.add(splitDocuments);
        return true;
    }
```

#### 文档查询
调用`vectorStore.similaritySearch(query)`时同样会先把用户的提问给`EmbeddingModel`，将提问变成向量，然后与向量数据库中的文档向量进行相似度计算（cosine值）。

要注意：此时向量数据库不会回答用户的提问。要回答用户的提问需要指定advisor

```java
/**
     * 查询向量数据库
     *
     * @param query 用户的提问
     * @return 匹配到的文档
     */

    @GetMapping("query")
    public List<Document> query(@RequestParam String query) {
        return vectorStore.similaritySearch(query);
    }
```

指定advisor

```java
return chatClient.prompt()
                .user(prompt)
                // 2. QuestionAnswerAdvisor会在运行时替换模板中的占位符`question_answer_context`，替换成向量数据库中查询到的文档。此时的query=用户的提问+替换完的提示词模板;
                .advisors(new QuestionAnswerAdvisor(vectorStore, prompt))
                .stream()
                // 3. query发送给大模型得到答案
                .content()
                .map(chatResponse -> ServerSentEvent.builder(chatResponse)
                        .event("message")
                        .build());
```
