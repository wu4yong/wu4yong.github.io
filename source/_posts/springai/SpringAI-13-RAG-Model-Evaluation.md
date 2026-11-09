---
title: 十三、模型RAG评测
date: 2026-09-13 01:00:00
categories:
  - springai
tags:
  - SpringAi
---

<div class="essay-banner essay-image11">
   <!-- RAG Model Evaluation -->
</div>

## 模型理解力评测

RAG 之所以广受欢迎，是因为它（**基于检索到的真实资料**）能够减少幻觉。然而， RAG 并不一定意味着幻觉会被完全消除。

### 现实中出现事实性幻觉的常见场景

1. **上下文提供了明确事实，但模型未读取或匹配，凭常识胡乱生成。**
2. **模型“看”到的背景信息有限，但它仍然自信地“虚构”细节回答问题。**

**问：马云在阿里巴巴创办初期遇到了哪些具体困难？**

**RAG:**马云，著名企业家，阿里巴巴创始人。

**答A（幻觉）：**

马云在阿里巴巴创立初期曾因办公楼失火导致数据全部丢失，团队一度陷入危机。

3. **多个相似案例混淆，模型输出了正确格式但内容错误的事实**

****

怎么你确定是否有这些问题：

**事实性的评估    **

****

评估器主要用于以下场景：

1. **开发和测试阶段**：在集成测试中验证 RAG 系统的质量
2. **批量质量检查**：对一批历史对话进行离线评估
3. **系统监控**：定期抽样评估生产环境中的对话质量，比如每100次对话评估1次
4. **模型验证**：当更换 AI 模型或调整 RAG 配置时，用于验证新配置的效果

```java
@SpringBootTest
public class FactCheckingTest {

    @Test
    void testFactChecking(@Autowired OllamaChatModel chatModel) {


        // 创建 FactCheckingEvaluator
        var factCheckingEvaluator = new FactCheckingEvaluator(ChatClient.builder(chatModel));

        // 示例上下文和声明
        String context = "地球是仅次于太阳的第三颗行星，也是已知唯一孕育生命的天文物体。";
        String claim = "地球是距离太阳第三大行星。";

        // 创建 EvaluationRequest
        EvaluationRequest evaluationRequest = new EvaluationRequest(context, Collections.emptyList(), claim);

        // 执行评估
        EvaluationResponse evaluationResponse = factCheckingEvaluator.evaluate(evaluationRequest);


        Assertions.assertTrue(evaluationResponse.isPass(), "The claim should not be supported by the context");

    }

}

```

解决：

+ 高风险领域（医疗、法律、金融等）必须进行事实性幻觉定期评估
+ **限定上下文范围**：通过系统提示词让模型明确只能在指定背景或文档内容中作答，禁止引用未检索到的信息。
+ **"回答不确定"机制 **
+ **调整分数、定义精确RAG相似性搜索能力**

## RAG幻觉评测

当我们发现大模型回答的内容并没有按照检索的documents进行有效回答， 就可以通过这种方式进行测试，评估 AI 生成的响应的事实准确性。该评估器通过验证给定的语句（responseContent）是否在逻辑上得到提供的上下文（文档）的支持，帮助检测并减少 AI 输出中的错觉。

“responseContent”和“document”将提交给人工智能模型进行评估。目前已有更小、更高效的人工智能模型专门用于此目的，例如 Bespoke 的 Minicheck，与 GPT-4 等旗舰模型相比，它有助于降低执行这些检查的成本。Minicheck 也可通过 Ollama 使用。

**什么时候需要用到：**

+ 验证已构建的RAG系统的响应质量
+ 在集成测试中自动化质量检查
+ 调试和优化RAG配置时评估效果

```java

@SpringBootTest
public class RagEvalTest {
    @Test
    public void testRag(
            @Autowired VectorStore vectorStore,
    @Autowired DashScopeChatModel dashScopeChatModel) {

        List<Document> documents = List.of(
                new Document("""
                        1. 预订航班
                        - 通过我们的网站或移动应用程序预订。
                        - 预订时需要全额付款。
                        - 确保个人信息（姓名、ID 等）的准确性，因为更正可能会产生 25 的费用。
                        """),
                new Document("""
                        2. 更改预订
                        - 允许在航班起飞前 24 小时更改。
                        - 通过在线更改或联系我们的支持人员。
                        - 改签费：经济舱 50，豪华经济舱 30，商务舱免费。
                        """),
                new Document("""
                        3. 取消预订
                        - 最晚在航班起飞前 48 小时取消。
                        - 取消费用：经济舱 75 美元，豪华经济舱50美元，商务舱25美元。
                        - 退款将在 7 个工作日内处理。
                        """));

        vectorStore.add(documents);


        RetrievalAugmentationAdvisor retrievalAugmentationAdvisor = RetrievalAugmentationAdvisor.builder()
                .documentRetriever(VectorStoreDocumentRetriever.builder()
                        .vectorStore(vectorStore)
                        .build())
                .build();

        String query = "退票费用";
        ChatResponse chatResponse = ChatClient.builder(dashScopeChatModel)
                .build().prompt(query).advisors(retrievalAugmentationAdvisor).call().chatResponse();

        EvaluationRequest evaluationRequest = new EvaluationRequest(
                // The original user question
                query,
                // The retrieved context from the RAG flow
                chatResponse.getMetadata().get(RetrievalAugmentationAdvisor.DOCUMENT_CONTEXT),
                // The AI model's response
                chatResponse.getResult().getOutput().getText()
        );

        RelevancyEvaluator evaluator = new RelevancyEvaluator(ChatClient.builder(dashScopeChatModel));
        EvaluationResponse evaluationResponse = evaluator.evaluate(evaluationRequest);
        System.out.println(evaluationResponse);
        System.out.println(chatResponse.getResult().getOutput().getText());
    }
}

```

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/springai/ch13_1750393171415-ab39fd5d-e127-4c49-94eb-0af9f51be3c3_e269d1aa8f.png" alt="ch13_1750393171415-ab39fd5d-e127-4c49-94eb-0af9f51be3c3_e269d1aa8f.png"></div>

`query = "我叫什么名字";`

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/springai/ch13_1750393227492-de8a71f7-a330-4466-8e2e-6578cea525f7_f0ab495ee1.png" alt="ch13_1750393227492-de8a71f7-a330-4466-8e2e-6578cea525f7_f0ab495ee1.png"></div>
