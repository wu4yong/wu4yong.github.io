---
title: 十、RAG全链路讲解
date: 2026-09-10 01:00:00
categories:
  - ai
tags:
  - Spring AI
---

<div class="essay-banner essay-image11">
   RAG Full Pipeline
</div>

## RAG简介

检索增强生成（Retrieval-augmented Generation）
对于基础大模型来说， 他只具备通用信息，他的参数都是拿公网进行训练，并且有一定的时间延迟，  无法得知一些具体业务数据和实时数据， 这些数据往往在各种文件中（比如txt、word、html、数据库...）
虽然function-call、SystemMessage可以用来解决一部分问题
但是它只能少量，并且针对的场景不一样
如果你要提供大量的业务领域信息，  就需要给他外接一个知识库：
比如
1. 我问他退订要多少费用
2. 这些资料可能都由产品或者需求编写在了文档中：  [terms-of-service.txt](https://www.yuque.com/attachments/yuque/0/2026/txt/22309163/1768368533038-fb0469c4-2f38-48dc-a214-a193199934ff.txt)
    1. 所以需要现在需求信息存到向量数据库（这个过程叫Embedding， 涉及到文档读取、分词、向量化存入）
3. 去向量数据库中查询“退订费用相关信息”
4. 将查询到的数据和对话信息再请求大模型
5. 此时会响应退订需要多少费用

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1741158263487-85d26245-bcab-48ee-8d0c-45322c292687_65187bac56.png" alt="ch10_1741158263487-85d26245-bcab-48ee-8d0c-45322c292687_65187bac56.png"></div>

## 概念

### 向量：

向量通常用来做相似性搜索，比如语义的一维向量，可以表示词语或短语的语义相似性。例如，“你好”、“hello”和“见到你很高兴”可以通过一维向量来表示它们的语义接近程度。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1741703979687-3dfe46b9-8bbc-4c8a-8ff7-11a63cd32800_5c8f045b5e.png" alt="ch10_1741703979687-3dfe46b9-8bbc-4c8a-8ff7-11a63cd32800_5c8f045b5e.png"></div>

然而，对于更复杂的对象，比如小狗，无法仅通过一个维度来进行相似性搜索。这时，我们需要提取多个特征，如颜色、大小、品种等，将每个特征表示为向量的一个维度，从而形成一个多维向量。例如，一只棕色的小型泰迪犬可以表示为一个多维向量 [棕色, 小型, 泰迪犬]。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1741703733774-aafd18f8-6d1c-4f9c-ac0a-55eb5c2ef03e_558367f605.png" alt="ch10_1741703733774-aafd18f8-6d1c-4f9c-ac0a-55eb5c2ef03e_558367f605.png"></div>

如果需要检索见过更加精准， 我们肯定还需要更多维度的向量， 组成更多维度的空间，在多维向量空间中，相似性检索变得更加复杂。我们需要使用一些算法，如余弦相似度或欧几里得距离，来计算向量之间的相似性。**向量数据库**会帮我实现。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1752672648271-7cafe1a1-33e0-4c4d-8f70-d8c3fb819cd6_e1415275c9.png" alt="ch10_1752672648271-7cafe1a1-33e0-4c4d-8f70-d8c3fb819cd6_e1415275c9.png"></div>

### 文本向量化

通过向量模型即可向量化,  这里我们学到了一种新的模型， 叫“向量模型” 专门用来做文本向量化的。
大语言模型不能做向量化， 所以需要单独找一个向量模型
1. deepseek不支持向量模型
2. 阿里百炼有大量向量模型
    1. 默认模型`DashScopeEmbeddingProperties#DEFAULT_EMBEDDING_MODEL="text-embedding-v1"`

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1749557877276-e1c0b9b2-feed-410d-92e4-f6fb41b98775_804f9c772b.png" alt="ch10_1749557877276-e1c0b9b2-feed-410d-92e4-f6fb41b98775_804f9c772b.png"></div>

```properties
spring.ai.dashscope.embedding.options.model= text-embedding-v4
```

3. ollama有大量向量模型, 自己拉取

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1749557970769-1073e1ca-eee5-4275-ba03-6c46f03ba9f2_f6d3f2c6db.png" alt="ch10_1749557970769-1073e1ca-eee5-4275-ba03-6c46f03ba9f2_f6d3f2c6db.png"></div>

以ollama为例：

```properties
spring.ai.ollama.embedding.model= nomic-embed-text
```

```java
@SpringBootTest
public class EmbaddingTest {

    @Test
    public void testEmbadding(@Autowired OllamaEmbeddingModel ollamaEmbeddingModel) {

        float[] embedded = ollamaEmbeddingModel.embed("我叫SpringAI");
        System.out.println(embedded.length);
        System.out.println(Arrays.toString(embedded));

    }
}

```

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1749559505646-45b28c7e-2599-4f11-a628-d99b1c872573_f5cb43feae.png" alt="ch10_1749559505646-45b28c7e-2599-4f11-a628-d99b1c872573_f5cb43feae.png"></div>

从结果可以知道"我叫SpringAI"这句话经过OllamaEmbeddingModel向量化之后得到的一个长度为768的float数组。注意，768是向量模型nomic-embed-text-v1.5固定的，不会随着句子长度而变化，不同的向量模型提供了不同的维度。
那么，我们通过这种向量模型得到一句话对应的向量有什么作用呢？非常有用，因为我们可以基于向量来判断两句话之间的相似度，举个例子：
查询跟秋田犬类似的狗，  在向量数据库中根据每个狗的特点进行多维向量， 你会发现秋田犬的向量数值和柴犬的向量数值最接近， 就可以查到类似的狗。    （当然我这里只是举例，让你对向量数据库有一个印象）

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1741159536310-23b0c084-513b-4801-9436-f63790fe47dc_72d4078c2d.png" alt="ch10_1741159536310-23b0c084-513b-4801-9436-f63790fe47dc_72d4078c2d.png"></div>

+ 向量模型的本质目标，就是把**语义相似**的内容用“相近”的向量表示，把“不相关”内容尽量拉远。  
+ 所以好的向量模型能够更好的识别语义， 进行向量化.

### 向量数据库

对于向量模型生成出来的向量，我们可以持久化到向量数据库，并且能利用向量数据库来计算两个向量之间的相似度，或者根据一个向量查找跟这个向量最相似的向量。
在SpringAi中，VectorStore 表示向量数据库，目前支持的向量数据库有
+ [Azure Vector Search](https://docs.spring.io/spring-ai/reference/api/vectordbs/azure.html) - The [Azure](https://learn.microsoft.com/en-us/azure/search/vector-search-overview) vector store.
+ [Apache Cassandra](https://docs.spring.io/spring-ai/reference/api/vectordbs/apache-cassandra.html) - The [Apache Cassandra](https://cassandra.apache.org/doc/latest/cassandra/vector-search/overview.html) vector store.
+ [Chroma Vector Store](https://docs.spring.io/spring-ai/reference/api/vectordbs/chroma.html) - The [Chroma](https://www.trychroma.com/) vector store.
+ [Elasticsearch Vector Store](https://docs.spring.io/spring-ai/reference/api/vectordbs/elasticsearch.html) - The [Elasticsearch](https://www.elastic.co/) vector store. 可以“以向量+关键词”方式做混合检索。深度优化更多针对文本，不是专门“向量搜索引擎”。向量存储和检索容量有限制，查询延迟高于 Milvus。
+ [GemFire Vector Store](https://docs.spring.io/spring-ai/reference/api/vectordbs/gemfire.html) - The [GemFire](https://tanzu.vmware.com/content/blog/vmware-gemfire-vector-database-extension) vector store.
+ [MariaDB Vector Store](https://docs.spring.io/spring-ai/reference/api/vectordbs/mariadb.html) - The [MariaDB](https://mariadb.com/) vector store.
+ [Milvus Vector Store](https://docs.spring.io/spring-ai/reference/api/vectordbs/milvus.html) - The [Milvus](https://milvus.io/) vector store.
+ [MongoDB Atlas Vector Store](https://docs.spring.io/spring-ai/reference/api/vectordbs/mongodb.html) - The [MongoDB Atlas](https://www.mongodb.com/atlas/database) vector store.
+ [Neo4j Vector Store](https://docs.spring.io/spring-ai/reference/api/vectordbs/neo4j.html) - The [Neo4j](https://neo4j.com/) vector store.可以结合结构化图谱查询与向量检索， **大规模嵌入检索（如千万—亿级高维向量）性能明显落后于 Milvus**
+ [OpenSearch Vector Store](https://docs.spring.io/spring-ai/reference/api/vectordbs/opensearch.html) - The [OpenSearch](https://opensearch.org/platform/search/vector-database.html) vector store.
+ [Oracle Vector Store](https://docs.spring.io/spring-ai/reference/api/vectordbs/oracle.html) - The [Oracle Database](https://docs.oracle.com/en/database/oracle/oracle-database/23/vecse/overview-ai-vector-search.html) vector store.
+ [PgVector Store](https://docs.spring.io/spring-ai/reference/api/vectordbs/pgvector.html) - The [PostgreSQL/PGVector](https://github.com/pgvector/pgvector) vector store.
+ [Pinecone Vector Store](https://docs.spring.io/spring-ai/reference/api/vectordbs/pinecone.html) - [PineCone](https://www.pinecone.io/) vector store.
+ [Qdrant Vector Store](https://docs.spring.io/spring-ai/reference/api/vectordbs/qdrant.html) - [Qdrant](https://www.qdrant.tech/) vector store.
+ [Redis Vector Store](https://docs.spring.io/spring-ai/reference/api/vectordbs/redis.html) - The [Redis](https://redis.io/) vector store.  低门槛实现小规模向量检索。对于高维大规模向量（如几百万到上亿条），性能和存储效率不如专用向量库。
+ [SAP Hana Vector Store](https://docs.spring.io/spring-ai/reference/api/vectordbs/hana.html) - The [SAP HANA](https://news.sap.com/2024/04/sap-hana-cloud-vector-engine-ai-with-business-context/) vector store.
+ [Typesense Vector Store](https://docs.spring.io/spring-ai/reference/api/vectordbs/typesense.html) - The [Typesense](https://typesense.org/docs/0.24.0/api/vector-search.html) vector store.
+ [Weaviate Vector Store](https://docs.spring.io/spring-ai/reference/api/vectordbs/weaviate.html) - The [Weaviate](https://weaviate.io/) vector store.
+ [SimpleVectorStore](https://github.com/spring-projects/spring-ai/blob/main/spring-ai-vector-store/src/main/java/org/springframework/ai/vectorstore/SimpleVectorStore.java) - A simple implementation of persistent vector storage, good for educational purposes.
其中有我们熟悉的几个数据库都可以用来存储向量，比如Elasticsearch、MongoDb、Neo4j、Pgsql、Redis。
视频中我会讲解2种：
1. [SimpleVectorStore](https://github.com/spring-projects/spring-ai/blob/main/spring-ai-vector-store/src/main/java/org/springframework/ai/vectorstore/SimpleVectorStore.java) 教学版向量数据库
2. [Milvus Vector Store](https://docs.spring.io/spring-ai/reference/api/vectordbs/milvus.html)  Milvus（国产团队）、文档友好、社区国内活跃、性能最佳、市场占用率大。 实战中使用的向量数据库.

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1749561837608-0462ab68-315f-4da5-89e5-17ee84dd843b_8617bc5de9.png" alt="ch10_1749561837608-0462ab68-315f-4da5-89e5-17ee84dd843b_8617bc5de9.png"></div>

### 匹配检索

在这个示例中， 我分别存储了`预订航班`和`取消预订`2段说明到向量数据库中
然后通过"退票要多少钱" 进行查询

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1741702267256-ccae55e5-3820-4f1a-8f52-feffc37affe7_2ef724da97.png" alt="ch10_1741702267256-ccae55e5-3820-4f1a-8f52-feffc37affe7_2ef724da97.png"></div>

代码执行结果为：
OllamaEmbedding结果

```java
 @Bean
    public VectorStore vectorStore(OllamaEmbeddingModel embeddingModel) {
        SimpleVectorStore.SimpleVectorStoreBuilder builder = SimpleVectorStore.builder(embeddingModel);
        return builder.build();
    }
```

### SearchRequest

可以利用searchRequest设置检索请求：
+ query 代表要检索的内容
+ topK  设置检索结果的前N条  
    - 通常我们查询所有结果查出来， 因为查询结果最终要发给大模型， 查询过多的结果会：
        * 1. 过多的token意味着更长延迟，  更多的费用，  并且过多上下文会超限；
        * 2. 研究表明过多的内容会降低 LLM 的*_**召回性能*；**_
+ similarityThreshold  设置相似度阈值， 可以通关设置分数限制召回内容相似度.  从而过滤掉废料。  （中文语料要适当降低分数）  ， 所以应遵循**始终以“业务召回效果”为主，而不是追求网上常说的高分阈值。**

```java
@BeforeEach
public void init( @Autowired
                  VectorStore vectorStore) {
    // 1. 声明内容文档
    Document doc = Document.builder()
    .text("""
          预订航班:
          - 通过我们的网站或移动应用程序预订。
          - 预订时需要全额付款。
          - 确保个人信息（姓名、ID 等）的准确性，因为更正可能会产生 25 的费用。
          """)
    .build();
    Document doc2 = Document.builder()
    .text("""
          取消预订:
          - 最晚在航班起飞前 48 小时取消。
          - 取消费用：经济舱 75 美元，豪华经济舱 50 美元，商务舱 25 美元。
          - 退款将在 7 个工作日内处理。
          """)
    .build();


    // 2. 将文本进行向量化，并且存入向量数据库（无需再手动向量化）
    vectorStore.add(Arrays.asList(doc,doc2));
}

@Test
void similaritySearchTest(
    @Autowired
    VectorStore vectorStore) {
    // 3. 相似性查询
    SearchRequest searchRequest = SearchRequest
    .builder().query("预定航班")
    .topK(5)
    .similarityThreshold(0.3)
    .build();
    List<Document> results = vectorStore.similaritySearch(searchRequest);

    // 4.输出
    System.out.println(results);

}
```

可以看到明显阿里的向量模型归类的更加准确，Ollama的向量模型查出来后结果并不正确。  所以为了你的准确性，请选择性能更好的向量模型。  想要更快更相似的搜索，用好的向量数据库。

## 接入ChatClient

1. 依赖

```json
<dependency>
   <groupId>org.springframework.ai</groupId>
   <artifactId>spring-ai-advisors-vector-store</artifactId>
</dependency>
```

2. 代码

```java
  @Bean
    public VectorStore vectorStore(DashScopeEmbeddingModel embeddingModel) {
        SimpleVectorStore.SimpleVectorStoreBuilder builder = SimpleVectorStore.builder(embeddingModel);
        return builder.build();
    }
```

3. 测试
实际你会发现， 最核心的是通过拦截器：QuestionAnswerAdvisor  . 你应该能猜到底层肯定会通过拦截对话将相似内容发给大模型。   可以结合SimpleLoggerAdvisor 查看日志内容.

```java

@SpringBootTest
public class SimpleVectorStoreTest {

    @BeforeEach
    public void init( @Autowired
            VectorStore vectorStore) {
        // 1. 声明内容文档
        Document doc = Document.builder()
                .text("""
                预订航班:
                - 通过我们的网站或移动应用程序预订。
                - 预订时需要全额付款。
                - 确保个人信息（姓名、ID 等）的准确性，因为更正可能会产生 25 的费用。
                """)
                .build();
        Document doc2 = Document.builder()
                .text("""
                取消预订:
                - 最晚在航班起飞前 48 小时取消。
                - 取消费用：经济舱 75 美元，豪华经济舱 50 美元，商务舱 25 美元。
                - 退款将在 7 个工作日内处理。
                """)
                .build();


        // 2. 将文本进行向量化，并且存入向量数据库（无需再手动向量化）
        vectorStore.add(Arrays.asList(doc,doc2));
    }
 

    @Test
    void chatRagTest(
            @Autowired
            VectorStore vectorStore,
            @Autowired DashScopeChatModel chatModel
            ) {

        ChatClient chatClient = ChatClient.builder(chatModel)
                .build();

        String message="退费需要多少费用?";
        String content = chatClient.prompt().user(message)
                .advisors(
                        new SimpleLoggerAdvisor(),
                        QuestionAnswerAdvisor.builder(vectorStore)
                                .searchRequest(
                                        SearchRequest
                                        .builder().query(message)
                                                .topK(5)
                                                .similarityThreshold(0.3)
                                                .build())
                                .build()
                ).call().content();

        System.out.println(content);

    }

}
```

## RetrievalAugmentationAdvisor

+ 查询空时扩展策略  ：

```java
.queryAugmenter(ContextualQueryAugmenter.builder()
                        .allowEmptyContext(false)
                        .emptyContextPromptTemplate(PromptTemplate.builder().template("用户查询位于知识库之外。礼貌地告知用户您无法回答").build())
                        .build())
```

+ 查询检索器
    - 检索提示词重写

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1766997521123-373d6486-ca66-4b34-a3da-91c69f3be502_25e4560fd4.png" alt="ch10_1766997521123-373d6486-ca66-4b34-a3da-91c69f3be502_25e4560fd4.png"></div>

用户查询可能存在表述模糊、语义不完整、关键词缺失等问题，通过查询改写可优化查询的语义表征，让检索更精准：

```java
.queryTransformers(RewriteQueryTransformer.builder()
                        .chatClientBuilder(ChatClient.builder(dashScopeChatModel))
                        .targetSearchSystem("航空票务助手")
                        .build())
```

    - **翻译重写**

```java
.queryTransformers(TranslationQueryTransformer.builder()
                                    .chatClientBuilder(ChatClient.builder(dashScopeChatModel))
                                    .targetLanguage("中文")
                                    .build())
```

+ 后置处理器：需要文档后处理和重排序
+ 实现复杂的 RAG 流水线

```java
@Test
    public void testRag3(@Autowired VectorStore vectorStore,
                        @Autowired DashScopeChatModel dashScopeChatModel) {


        chatClient = ChatClient.builder(dashScopeChatModel)
                .defaultAdvisors(SimpleLoggerAdvisor.builder().build())
                .build();

        // 增强多
        Advisor retrievalAugmentationAdvisor = RetrievalAugmentationAdvisor.builder()
                // 查 = QuestionAnswerAdvisor
                .documentRetriever(VectorStoreDocumentRetriever.builder()
                        .similarityThreshold(0.50)
                        .vectorStore(vectorStore)
                        .build())
                // 检索为空时，返回提示
                /*.queryAugmenter(ContextualQueryAugmenter.builder()
                        .allowEmptyContext(false)
                        .emptyContextPromptTemplate(PromptTemplate.builder().template("用户查询位于知识库之外。礼貌地告知用户您无法回答").build())
                        .build())*/
                // 相似性查询内容转换
                /*.queryTransformers(RewriteQueryTransformer.builder()
                        .chatClientBuilder(ChatClient.builder(dashScopeChatModel))
                        .targetSearchSystem("航空票务助手")
                        .build())*/
                // 检索后文档监控、操作
                /*.documentPostProcessors((query, documents) -> {
                    System.out.println("Original query: " + query.text());
                    System.out.println("Retrieved documents: " + documents.size());
                    return documents;
                })*/
                .build();

        String answer = chatClient.prompt()
                .advisors(retrievalAugmentationAdvisor)
                .user("退一张票大概要多少费用？希望别扣太多啊")
                .call()
                .content();

        System.out.println(answer);
    }

    @TestConfiguration
    static class TestConfig {

        @Bean
        public VectorStore vectorStore(DashScopeEmbeddingModel embeddingModel) {
            return SimpleVectorStore.builder(embeddingModel).build();
        }
    }
```

## ELT

在之前，我们主要完成了数据检索阶段，  但是完整的RAG流程还需要有emedding阶段， 即：
提取（读取）、转换（分隔）和加载（写入）

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1752825687770-5d5b57f7-8aa6-48f9-aa9d-bfc071a044bb_9e7ab4a115.jpeg" alt="ch10_1752825687770-5d5b57f7-8aa6-48f9-aa9d-bfc071a044bb_9e7ab4a115.jpeg"></div>

### [Document Loaders](https://docs.langchain4j.dev/category/document-loaders) 文档读取器

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1741186496899-c89b21c0-6e7b-4503-853f-9c0e109d3b1b_1e627e5a33.png" alt="ch10_1741186496899-c89b21c0-6e7b-4503-853f-9c0e109d3b1b_1e627e5a33.png"></div>

**springai提供了以下文档阅读器**
+ [JSON](https://docs.spring.io/spring-ai/reference/api/etl-pipeline.html#_json)
+ [文本](https://docs.spring.io/spring-ai/reference/api/etl-pipeline.html#_text)
+ [HTML（JSoup）](https://docs.spring.io/spring-ai/reference/api/etl-pipeline.html#_html_jsoup)
+ [Markdown](https://docs.spring.io/spring-ai/reference/api/etl-pipeline.html#_markdown)
+ [PDF页面](https://docs.spring.io/spring-ai/reference/api/etl-pipeline.html#_pdf_page)
+ [PDF段落](https://docs.spring.io/spring-ai/reference/api/etl-pipeline.html#_pdf_paragraph)
+ [Tika（DOCX、PPTX、HTML……）](https://docs.spring.io/spring-ai/reference/api/etl-pipeline.html#_tika_docx_pptx_html)
**alibaba ai也提供了很多阅读器**
[https://github.com/alibaba/spring-ai-alibaba/tree/main/community/document-parsers](https://github.com/alibaba/spring-ai-alibaba/tree/main/community/document-parsers)
+ **document-parser-apache-pdfbox**：用于解析 PDF 格式文档。
+ **document-parser-bshtml**：用于解析基于 BSHTML 格式的文档。
+ **document-parser-pdf-tables**：专门用于从 PDF 文档中提取表格数据。
+ **document-parser-bibtex**：用于解析 BibTeX 格式的参考文献数据。
+ **document-parser-markdown**：用于解析 Markdown 格式的文档。
+ **document-parser-tika**：一个多功能文档解析器，支持多种文档格式。
以及**网络来源**文档读取器：
[https://github.com/alibaba/spring-ai-alibaba/tree/main/community/document-readers](https://github.com/alibaba/spring-ai-alibaba/tree/main/community/document-readers)
****

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1749974735407-b036f47f-1eb5-46fa-9a77-092eaa246fce_0c50681dfa.png" alt="ch10_1749974735407-b036f47f-1eb5-46fa-9a77-092eaa246fce_0c50681dfa.png"></div>

### 读取Text

```java
 @Test
    public void testReaderText(@Value("classpath:rag/terms-of-service.txt") Resource resource) {
        TextReader textReader = new TextReader(resource);
        List<Document> documents = textReader.read();

        for (Document document : documents) {
            System.out.println(document.getText());
        }
    }
```

### 读取markdown

```java
<dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-markdown-document-reader</artifactId>
        </dependency>
```

```java
@Test
    public void testReaderMD(@Value("classpath:rag/9_横店影视股份有限公司_0.md") Resource resource) {
        MarkdownDocumentReaderConfig config = MarkdownDocumentReaderConfig.builder()
                .withHorizontalRuleCreateDocument(true)     // 分割线创建新document
                .withIncludeCodeBlock(false)                // 代码创建新document
                .withIncludeBlockquote(false)               // 引用创建新document
                .withAdditionalMetadata("filename", resource.getFilename())    // 每个document添加的元数据
                .build();

        MarkdownDocumentReader markdownDocumentReader = new MarkdownDocumentReader(resource, config);
        List<Document> documents = markdownDocumentReader.read();
        for (Document document : documents) {
            System.out.println(document.getText());
        }
    }

```

### pdf

+ `PagePdfDocumentReader`一页1个document
+ `ParagraphPdfDocumentReader` 按pdf目录分成一个个document

```java
  <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-markdown-document-reader</artifactId>
        </dependency>
```

```java

    @Test
    public void testReaderPdf(@Value("classpath:rag/平安银行2023年半年度报告摘要.pdf") Resource resource) {

        PagePdfDocumentReader pdfReader = new PagePdfDocumentReader(resource,
                PdfDocumentReaderConfig.builder()
                        .withPageTopMargin(0)
                        .withPageExtractedTextFormatter(ExtractedTextFormatter.builder()
                                .withNumberOfTopTextLinesToDelete(0)
                                .build())
                        .withPagesPerDocument(1)
                        .build());

        List<Document> documents = pdfReader.read();
        for (Document document : documents) {
            System.out.println(document.getText());
        }
    }


    // 必需要带目录，  按pdf的目录分document
    @Test
    public void testReaderParagraphPdf(@Value("classpath:rag/平安银行2023年半年度报告.pdf") Resource resource) {
        ParagraphPdfDocumentReader pdfReader = new ParagraphPdfDocumentReader(resource,
                PdfDocumentReaderConfig.builder()
                        // 不同的PDF生成工具可能使用不同的坐标系 ， 如果内容识别有问题， 可以设置该属性为true
                        .withReversedParagraphPosition(true)
                       .withPageTopMargin(0)       // 上边距
                        .withPageExtractedTextFormatter(ExtractedTextFormatter.builder()
                                // 从页面文本中删除前 N 行
                                .withNumberOfTopTextLinesToDelete(0)
                                .build())
                        .build());

        List<Document> documents = pdfReader.read();
        for (Document document : documents) {
            System.out.println(document.getText());
        }
    }
```

### B站：

```plain

        <dependency>
            <groupId>com.alibaba.cloud.ai</groupId>
            <artifactId>spring-ai-alibaba-starter-document-reader-bilibili</artifactId>
        </dependency>
```

```java
    @Test
    void bilibiliDocumentReaderTest() {
        BilibiliDocumentReader bilibiliDocumentReader = new BilibiliDocumentReader(
                "https://www.bilibili.com/video/BV1C5UxYuEc2/?spm_id_from=333.1387.upload.video_card.click&vd_source=fa810d8b8d6765676cb343ada918d6eb");
        List<Document> documents = bilibiliDocumentReader.get();
        System.out.println(documents);
    }
```

### [DocumentSplitter‌](https://docs.langchain4j.dev/tutorials/rag#document-splitter) 文档拆分器（转换器）

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1741186628965-bab8cbb0-71d6-4cd5-bfab-0287b13a2540_fcbb88d487.png" alt="ch10_1741186628965-bab8cbb0-71d6-4cd5-bfab-0287b13a2540_fcbb88d487.png"></div>

由于文本读取过来后， 还需要分成一段一段的片段(分块chunk)， 分块是为了更好地拆分语义单元，这样在后面可以更精确地进行语义相似性检索，也可以避免LLM的Token限制。
SpringAi就提供了一个文档拆分器：
+ [TextSplitter](https://docs.spring.io/spring-ai/reference/api/etl-pipeline.html#_textsplitter)    抽象类
+ [TokenTextSplitter](https://docs.spring.io/spring-ai/reference/api/etl-pipeline.html#_tokentextsplitter)   按token分隔

### TokenTextSplitter

1. `**chunkSize**` (默认值: 800)      100
    - 每个文本块的目标大小，以token为单位
2. `**minChunkSizeChars**` (默认值: 350)     建议小一点
    - 如果块超过最小块字符数( 按照块的最后. ! ? \n  符号截取)
    - 如果块没超过最小块字符数，  不会按照符号截取(保留原块）。

```java
本服务条款适用于您对图灵航空 的体验。预订航班，即表示您同意这些条款。
1. 预订航班
- 通过我们的网站或移动应用程序预订。
- 预订时需要全额付款。  \n
- 确保个人信息（姓名、ID 等）的准确性，因为更正可能会产生 25  
```

3. `**minChunkLengthToEmbed**` (默认值: 5)  5
    - 丢弃短于此长度的文本块(如果去掉\r\n， 只剩5个有效文本， 那就丢掉）

```java
本服务条
```

4. `**maxNumChunks**` (默认值: 10000)
    - 最多能分多少个块， 超过了就不管了
5. `**keepSeparator**` (默认值: true)
    - 是否在块中保留分隔符、换行符 \r\n

```java
 @Test
    public void testTokenTextSplitter(@Value("classpath:rag/terms-of-service.txt") Resource resource) {
        TextReader textReader = new TextReader(resource);
        textReader.getCustomMetadata().put("filename", resource.getFilename());
        List<Document> documents = textReader.read();


        TokenTextSplitter splitter = new TokenTextSplitter(1000, 400, 10, 5000, true);
        List<Document> apply = splitter.apply(documents);

        apply.forEach(System.out::println);
    }
```

整个流程如下：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1749993911885-95202323-3010-46cb-8bc7-e69fe606b220_142b375b85.png" alt="ch10_1749993911885-95202323-3010-46cb-8bc7-e69fe606b220_142b375b85.png"></div>

### 自定分割器：

**支持中英文**：同时支持中文和英文标点符号

```java
package com.xushu.springai.rag.ELT;

 

public class ChineseTokenTextSplitter extends TextSplitter {

	private static final int DEFAULT_CHUNK_SIZE = 800;

	private static final int MIN_CHUNK_SIZE_CHARS = 350;

	private static final int MIN_CHUNK_LENGTH_TO_EMBED = 5;

	private static final int MAX_NUM_CHUNKS = 10000;

	private static final boolean KEEP_SEPARATOR = true;

	private final EncodingRegistry registry = Encodings.newLazyEncodingRegistry();

	private final Encoding encoding = this.registry.getEncoding(EncodingType.CL100K_BASE);

	// The target size of each text chunk in tokens
	private final int chunkSize;

	// The minimum size of each text chunk in characters
	private final int minChunkSizeChars;

	// Discard chunks shorter than this
	private final int minChunkLengthToEmbed;

	// The maximum number of chunks to generate from a text
	private final int maxNumChunks;

	private final boolean keepSeparator;

	public ChineseTokenTextSplitter() {
		this(DEFAULT_CHUNK_SIZE, MIN_CHUNK_SIZE_CHARS, MIN_CHUNK_LENGTH_TO_EMBED, MAX_NUM_CHUNKS, KEEP_SEPARATOR);
	}

	public ChineseTokenTextSplitter(boolean keepSeparator) {
		this(DEFAULT_CHUNK_SIZE, MIN_CHUNK_SIZE_CHARS, MIN_CHUNK_LENGTH_TO_EMBED, MAX_NUM_CHUNKS, keepSeparator);
	}

	public ChineseTokenTextSplitter(int chunkSize, int minChunkSizeChars, int minChunkLengthToEmbed, int maxNumChunks,
			boolean keepSeparator) {
		this.chunkSize = chunkSize;
		this.minChunkSizeChars = minChunkSizeChars;
		this.minChunkLengthToEmbed = minChunkLengthToEmbed;
		this.maxNumChunks = maxNumChunks;
		this.keepSeparator = keepSeparator;
	}

	public static Builder builder() {
		return new Builder();
	}

	@Override
	protected List<String> splitText(String text) {
		return doSplit(text, this.chunkSize);
	}

	protected List<String> doSplit(String text, int chunkSize) {
		if (text == null || text.trim().isEmpty()) {
			return new ArrayList<>();
		}

		List<Integer> tokens = getEncodedTokens(text);
		List<String> chunks = new ArrayList<>();
		int num_chunks = 0;
		// maxNumChunks多能分多少个块， 超过了就不管了
		while (!tokens.isEmpty() && num_chunks < this.maxNumChunks) {
			// 按照chunkSize进行分隔
			List<Integer> chunk = tokens.subList(0, Math.min(chunkSize, tokens.size()));
			String chunkText = decodeTokens(chunk);

			// Skip the chunk if it is empty or whitespace
			if (chunkText.trim().isEmpty()) {
				tokens = tokens.subList(chunk.size(), tokens.size());
				continue;
			}

			// Find the last period or punctuation mark in the chunk
			int lastPunctuation =
					Math.max(chunkText.lastIndexOf('.'),
					Math.max(chunkText.lastIndexOf('?'),
					Math.max(chunkText.lastIndexOf('!'),
					Math.max(chunkText.lastIndexOf('\n'),
					Math.max(chunkText.lastIndexOf('。'),
					Math.max(chunkText.lastIndexOf('？'),
					chunkText.lastIndexOf('！')
					))))));

			// 按照句子截取之后长度 > minChunkSizeChars
			if (lastPunctuation != -1 && lastPunctuation > this.minChunkSizeChars) {
				// 保留按照句子截取之后的内容
				chunkText = chunkText.substring(0, lastPunctuation + 1);
			}
			// 按照句子截取之后长度 < minChunkSizeChars 保留原块


			// keepSeparator=true 替换/r/n   =false不管
			String chunkTextToAppend = (this.keepSeparator) ? chunkText.trim()
					: chunkText.replace(System.lineSeparator(), " ").trim();

			// 替换/r/n之后的内容是不是<this.minChunkLengthToEmbed 忽略
			if (chunkTextToAppend.length() > this.minChunkLengthToEmbed) {
				chunks.add(chunkTextToAppend);
			}

			// Remove the tokens corresponding to the chunk text from the remaining tokens
			tokens = tokens.subList(getEncodedTokens(chunkText).size(), tokens.size());

			num_chunks++;
		}

		// Handle the remaining tokens
		if (!tokens.isEmpty()) {
			String remaining_text = decodeTokens(tokens).replace(System.lineSeparator(), " ").trim();
			if (remaining_text.length() > this.minChunkLengthToEmbed) {
				chunks.add(remaining_text);
			}
		}

		return chunks;
	}

	private List<Integer> getEncodedTokens(String text) {
		Assert.notNull(text, "Text must not be null");
		return this.encoding.encode(text).boxed();
	}

	private String decodeTokens(List<Integer> tokens) {
		Assert.notNull(tokens, "Tokens must not be null");
		var tokensIntArray = new IntArrayList(tokens.size());
		tokens.forEach(tokensIntArray::add);
		return this.encoding.decode(tokensIntArray);
	}

	public static final class Builder {

		private int chunkSize = DEFAULT_CHUNK_SIZE;

		private int minChunkSizeChars = MIN_CHUNK_SIZE_CHARS;

		private int minChunkLengthToEmbed = MIN_CHUNK_LENGTH_TO_EMBED;

		private int maxNumChunks = MAX_NUM_CHUNKS;

		private boolean keepSeparator = KEEP_SEPARATOR;

		private Builder() {
		}

		public Builder withChunkSize(int chunkSize) {
			this.chunkSize = chunkSize;
			return this;
		}

		public Builder withMinChunkSizeChars(int minChunkSizeChars) {
			this.minChunkSizeChars = minChunkSizeChars;
			return this;
		}

		public Builder withMinChunkLengthToEmbed(int minChunkLengthToEmbed) {
			this.minChunkLengthToEmbed = minChunkLengthToEmbed;
			return this;
		}

		public Builder withMaxNumChunks(int maxNumChunks) {
			this.maxNumChunks = maxNumChunks;
			return this;
		}

		public Builder withKeepSeparator(boolean keepSeparator) {
			this.keepSeparator = keepSeparator;
			return this;
		}

		public ChineseTokenTextSplitter build() {
			return new ChineseTokenTextSplitter(this.chunkSize, this.minChunkSizeChars, this.minChunkLengthToEmbed,
					this.maxNumChunks, this.keepSeparator);
		}

	}

}
```

### 分隔经验：

**过细分块的潜在问题**
1. ‌**语义割裂**‌： 破坏上下文连贯性，影响模型理解‌ 。
2. ‌**计算成本增加**‌：分块过细会导致向量嵌入和检索次数增多，增加时间和算力开销‌。
3. ‌**信息冗余与干扰**‌：碎片化的文本块可能引入无关内容，干扰检索结果的质量，降低生成答案的准确性‌。
**分块过大的弊端**
1. ‌**信息丢失风险**‌：过大的文本块可能超出嵌入模型的输入限制，导致关键信息未被有效编码‌。
2. ‌**检索精度下降**‌：大块内容可能包含多主题混合，与用户查询的相关性降低，影响模型反馈效果‌。

| ‌**场景**‌ | ‌**分块策略**‌ | ‌**参数参考**‌ |
| :--- | :--- | :--- |
| 微博/短文本 | 句子级分块，保留完整语义 | 每块100-200字符‌ |
| 学术论文 | 段落级分块，叠加10%重叠 | 每块300-500字符‌ |
| 法律合同 | 条款级分块，严格按条款分隔 | 每块200-400字符‌ |
| 长篇小说 | 章节级分块，过长段落递归拆分为段落 | 每块500-1000字符‌ |

 不要过分指望按照文本主题进行分隔，  因为实战中的资料太多而且没有规律，  根本没办法保证每个chunk是一个完整的主题内容， 哪怕人为干预也很难。  所以实战中往往需要结合资料来决定分割器，大多数情况就是按token数分， 因为没有完美的， 还可以加入人工干预,或者大模型分隔。

### 分块五种策略

以下是 RAG 的五种分块策略：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1753853837683-32cb032f-28d9-406e-b3e5-cc7ec87038ed_298a8307bc.gif" alt="ch10_1753853837683-32cb032f-28d9-406e-b3e5-cc7ec87038ed_298a8307bc.gif"></div>

---

#### 1）固定大小分块

生成块的最直观和直接的方法是根据预定义的字符、单词或标记数量将文本分成统一的段。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1753853836122-f0cc462f-5950-4cba-b11d-e1bce7eb52e6_053b489b7a.png" alt="ch10_1753853836122-f0cc462f-5950-4cba-b11d-e1bce7eb52e6_053b489b7a.png"></div>

由于直接分割会破坏语义流，因此建议在两个连续的块之间保持一些重叠（上图蓝色部分）。
这很容易实现。而且，由于所有块的大小相同，它简化了批处理。
但有一个大问题。这通常会打断句子（或想法）。因此，重要的信息很可能会分散到不同的块之间。

---

#### 2）语义分块

这个想法很简单。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1753853837572-b20e461c-2dac-44d1-8edb-d3e2ae6ced7b_692398d163.gif" alt="ch10_1753853837572-b20e461c-2dac-44d1-8edb-d3e2ae6ced7b_692398d163.gif"></div>

+ 根据句子、段落或主题部分等有意义的单位对文档进行细分。
+ 接下来，为每个片段创建嵌入。
+ 假设我从第一个片段及其嵌入开始。
    - 如果第一个段的嵌入与第二个段的嵌入具有较高的余弦相似度，则这两个段形成一个块。
    - 这种情况一直持续到余弦相似度显著下降。
    - 一旦发生这种情况，我们就开始新的部分并重复。
输出可能如下所示：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1753853836031-5db335da-e799-4a83-bc13-8f90a05c7dcb_9b564c1e96.png" alt="ch10_1753853836031-5db335da-e799-4a83-bc13-8f90a05c7dcb_9b564c1e96.png"></div>

与固定大小的块不同，这保持了语言的自然流畅并保留了完整的想法。
由于每个块都更加丰富，它提高了检索准确性，进而使 LLM 产生更加连贯和相关的响应。
一个小问题是，它依赖于一个阈值来确定余弦相似度是否显著下降，而这个阈值在不同文档之间可能会有所不同。

---

#### 3）递归分块

这也很简单。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1753853836600-2acd37dd-3cb8-4714-8688-72fd216e58ee_a70a46af01.gif" alt="ch10_1753853836600-2acd37dd-3cb8-4714-8688-72fd216e58ee_a70a46af01.gif"></div>

首先，根据固有分隔符（如段落或章节）进行分块。
接下来，如果每个块的大小超出了预定义的块大小限制，则将其拆分成更小的块。但是，如果块符合块大小限制，则不再进行进一步拆分。
输出可能如下所示：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1753853837553-448a3d2b-1cf7-4036-955f-6efc28f602bf_1a6579a135.png" alt="ch10_1753853837553-448a3d2b-1cf7-4036-955f-6efc28f602bf_1a6579a135.png"></div>

如上图：
+ 首先，我们定义两个块（紫色的两个段落）。
+ 接下来，第 1 段被进一步分成更小的块。
与固定大小的块不同，这种方法还保持了语言的自然流畅性并保留了完整的想法。
然而，在实施和计算复杂性方面存在一些额外的开销。

---

#### 4）基于文档结构的分块

这是另一种直观的方法。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1753853838253-c6ae6f8e-08eb-41a8-83c0-c39e4b6ce25d_14de1ef793.gif" alt="ch10_1753853838253-c6ae6f8e-08eb-41a8-83c0-c39e4b6ce25d_14de1ef793.gif"></div>

它利用文档的固有结构（如标题、章节或段落）来定义块边界。
这样，它就通过与文档的逻辑部分对齐来保持结构完整性。
输出可能如下所示：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1753853839556-9ea8dab6-5905-4fef-9469-7151da720546_857750566e.png" alt="ch10_1753853839556-9ea8dab6-5905-4fef-9469-7151da720546_857750566e.png"></div>

也就是说，这种方法假设文档具有清晰的结构，但事实可能并非如此。
此外，块的长度可能会有所不同，可能会超出模型令牌的限制。您可以尝试使用递归拆分进行合并。

---

#### 5）基于LLM的分块

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1753853841393-bfd2a2be-2db9-4b40-b723-4dfd1aaf3de6_aca087ba96.gif" alt="ch10_1753853841393-bfd2a2be-2db9-4b40-b723-4dfd1aaf3de6_aca087ba96.gif"></div>

既然每种方法都有优点和缺点，为什么不使用 LLM 来创建块呢？
可以提示 LLM 生成语义上孤立且有意义的块。
显然，这种方法将确保较高的语义准确性，因为 LLM 可以理解超越简单启发式方法（用于上述四种方法）的上下文和含义。
唯一的问题是，它是这里讨论的所有五种技术中计算要求最高的分块技术。
此外，由于 LLM 通常具有有限的上下文窗口，因此需要注意这一点。

---

每种技术都有其自身的优势和劣势。
我观察到语义分块在很多情况下效果很好，但同样，您需要进行测试。
选择将在很大程度上取决于内容的性质、嵌入模型的功能、计算资源等。
我们很快就会对这些策略进行实际演示。
同时，如果您错过了，昨天我们讨论了构建依赖于成对内容相似性的强大 NLP 系统的技术（RAG 就是其中之一）。

### ContentFormatTransformer

检索到的内容最终会发给大模型，  由该组件决定发送到模型的RAG内容

```java
	private static final String DEFAULT_TEXT_TEMPLATE = String.format("%s\n\n%s", TEMPLATE_METADATA_STRING_PLACEHOLDER,
			TEMPLATE_CONTENT_PLACEHOLDER);
```

即：假设：
+ 文本内容：`**"The World is Big and Salvation Lurks Around the Corner"**`
+ 元数据：`**Map.of("fileName", "xushu.pdf")**`
最终发送给大模型的格式化内容是：

```plain
source: xushu.pdf
  
The World is Big and Salvation Lurks Around the Corner
```

很少会去改， 了解即可

### KeywordMetadataEnriching

使用生成式AI模型从文档内容中提取关键词并将其添加为元数据,为文档添加关键词标签，提升检索精度
`new KeywordMetadataEnricher(chatModel, 5);`  
1. chatModel 需要提取关键字的模型
2. 关键字数量

```java
 @Test
    public void testKeywordMetadataEnricher(
            @Autowired DashScopeChatModel chatModel,
            @Value("classpath:rag/terms-of-service.txt") Resource resource) {
        TextReader textReader = new TextReader(resource);
        textReader.getCustomMetadata().put("filename", resource.getFilename());
        List<Document> documents = textReader.read();


        ChineseTokenTextSplitter splitter = new ChineseTokenTextSplitter();
        List<Document> apply = splitter.apply(documents);
    
            KeywordMetadataEnricher enricher = new KeywordMetadataEnricher(chatModel, 5);
            apply=  enricher.apply(apply);

        for (Document document : apply) {
            System.out.println(document.getText());
            System.out.println(document.getText().length());
        }
        apply.forEach(System.out::println);
    }

```

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1749997147499-7bafe6d5-bcaa-47cb-ae35-8489d3102d7c_fbf0e2ff5c.png" alt="ch10_1749997147499-7bafe6d5-bcaa-47cb-ae35-8489d3102d7c_fbf0e2ff5c.png"></div>

**作用**：  
帮助做元数据过滤。    并不参数向量数据库的相似性检索
**问题**：
KeywordMetadataEnriching 生成出来的关键字无法进行元数据过滤
在SpringAi1.0.1 中已支持KeywordMetadataEnriching 自定义模版：
+ Enhanced KeywordMetadataEnricher with custom template functionality to provide more flexible metadata enrichment capabilities [2082a59](https://github.com/spring-projects/spring-ai/commit/2082a594a40b6552b57cdbc51cae7c2112efd0f9)

### SummaryMetadataEnricher

使用生成式AI模型为文档创建摘要并将其添加为元数据。它可以为当前文档以及相邻文档（前一个和后一个）生成摘要，以提供更丰富的上下文信息 。
场景： 有顺序关联的文档，比如西游记小说的RAG，‘三打白骨精的故事以及后续剧情’。
+ **技术文档**：前后章节有依赖关系
+ **教程内容**：步骤之间有逻辑顺序
+ **法律文档**：条款之间有关联性
+ **学术论文**：章节间有逻辑递进

```java
 @Test
    public void testSummaryMetadataEnricher(
            @Autowired DashScopeChatModel chatModel,
            @Value("classpath:rag/terms-of-service.txt") Resource resource) {
        TextReader textReader = new TextReader(resource);
        textReader.getCustomMetadata().put("filename", resource.getFilename());
        List<Document> documents = textReader.read();


        ChineseTokenTextSplitter splitter = new ChineseTokenTextSplitter();
        List<Document> apply = splitter.apply(documents);

        SummaryMetadataEnricher enricher = new SummaryMetadataEnricher(chatModel,
                List.of(SummaryMetadataEnricher.SummaryType.PREVIOUS,
                        SummaryMetadataEnricher.SummaryType.CURRENT,
                        SummaryMetadataEnricher.SummaryType.NEXT));


        apply = enricher.apply(apply);
    }
```

Document{id='66e859b2-f719-43ca-8466-d97f1880b530', text='更改预订
- 允许在航班起飞前 24 小时更改。
- 通过在线更改或联系我们的支持人员。
- 改签费：经济舱 50，豪华经济舱 30，商务舱免费。
3.
取消预订
- 最晚在航班起飞前 48 小时取消。', media='null', metadata={prev_section_summary=The key topics and entities of the section include:
1. **Service Terms Agreement**: The terms apply to the user's experience with 图灵航空 (Turing Airlines).
2. **Acceptance of Terms**: By booking a flight, the user agrees to these terms.
3. **Flight Booking**:
   - Bookings can be made via the website or mobile application.
   - Full payment is required at the time of booking.
   - Personal information must be accurate to avoid a correction fee of 25 units.
Entities:
- 图灵航空 (Turing Airlines)
- Website and mobile application
- Flight bookings
- Payment process
- Personal information (name, ID), charset=UTF-8, filename=terms-of-service.txt, source=terms-of-service.txt, section_summary=The key topics and entities of the section are as follows:
1. **更改预订 (Modifying Reservations)**:
   - Allowed within 24 hours before the flight departure.
   - Can be done either online or by contacting support personnel.
   - Change fees:
     - Economy class: 50
     - Premium economy class: 30
     - Business class: Free
2. **取消预订 (Canceling Reservations)**:
   - Must be done at least 48 hours before the flight departure.
Summary: The section outlines the policies for modifying and canceling reservations, including timeframes and associated fees for different classes (economy, premium economy, and business)., next_section_summary=The section outlines the **cancellation fees** for different cabin classes and the **refund processing time**. Key entities include:  
- Cancellation fees: **Economy class (75 USD)**, **Premium Economy class (50 USD)**, **Business class (25 USD)**.  
- Refund processing time: **7 business days**.}, score=null}

### 文本向量化

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1741188324988-536ef32b-5a6d-4999-9e08-df15d488a342_3f5d814df0.png" alt="ch10_1741188324988-536ef32b-5a6d-4999-9e08-df15d488a342_3f5d814df0.png"></div>

向量化存储之前在“文本向量化”介绍了， 就是通过向量模型库进行向量化
代码：
依然通过Qwen向量模型进行向量化：  将第分割的chunk进行向量化

```java
 @Test
    public void testTokenTextSplitter( 
            @Autowired DashScopeEmbeddingModel embeddingModel,
            @Value("classpath:rag/terms-of-service.txt") Resource resource) {
     
        TextReader textReader = new TextReader(resource);
        textReader.getCustomMetadata().put("filename", resource.getFilename());
        List<Document> documents = textReader.read();


        ChineseTokenTextSplitter splitter = new ChineseTokenTextSplitter(100);
        List<Document> apply = splitter.apply(documents);

        for (Document document : apply) {
            float[] embedded = embeddingModel.embed(document);
        }
 
    }
```

### 存储向量

但是我告诉你其实 ，  我们通过向量数据库存储document， 可以省略向量化这一步， 向量数据库会在底层自动完成向量化

```java
for (Document document : apply) {
    float[] embedded = embeddingModel.embed(document);
}


// 替换为： 写入=向量化+存储
vectorStore.write(apply);
```

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1750055863649-e1a58a18-23f4-482d-9c0d-123ee5a893fc_5e965e66db.png" alt="ch10_1750055863649-e1a58a18-23f4-482d-9c0d-123ee5a893fc_5e965e66db.png"></div>

```java
@Test
    public void testTokenTextSplitter(
            @Autowired VectorStore vectorStore,
            @Value("classpath:rag/terms-of-service.txt") Resource resource) {
        TextReader textReader = new TextReader(resource);
        textReader.getCustomMetadata().put("filename", resource.getFilename());
        List<Document> documents = textReader.read();


        ChineseTokenTextSplitter splitter = new ChineseTokenTextSplitter(100);
        List<Document> apply = splitter.apply(documents);

        vectorStore.add(apply);
    }
```

### 向量数据库检索

代码：
需要先将文本进行向量化， 然后去向量数据库查询，  

```java
// 3. 相似性查询
        SearchRequest searchRequest = SearchRequest
                .builder().query("预定航班")
                .topK(5)
                .similarityThreshold(0.3)
                .build();
        List<Document> results = vectorStore.similaritySearch(searchRequest);

        // 4.输出
        System.out.println(results);
```

完整代码：

```java

    @Test
    public void testRag(
            @Autowired VectorStore vectorStore,
            @Value("classpath:rag/terms-of-service.txt") Resource resource) {
        // 1. 读取
        TextReader textReader = new TextReader(resource);
        textReader.getCustomMetadata().put("filename", resource.getFilename());
        List<Document> documents = textReader.read();

        // 2.分隔
        ChineseTokenTextSplitter splitter = new ChineseTokenTextSplitter(100);
        List<Document> apply = splitter.apply(documents);
        // 3. 向量化+写入
        vectorStore.write(apply);

        // 3. 相似性查询
        SearchRequest searchRequest = SearchRequest
                .builder().query("退费需要多少费用")
                .topK(5)
                .similarityThreshold(0.3)
                .build();
        List<Document> results = vectorStore.similaritySearch(searchRequest);

        // 4.输出
        System.out.println(results);
    }
```

### 对话阶段

如果结合ChatClient 可以直接将检索和Advisor整合在一起

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1741847699874-61b078b9-8d57-4f61-ac3d-5927d7bad5f6_ea91eaca47.png" alt="ch10_1741847699874-61b078b9-8d57-4f61-ac3d-5927d7bad5f6_ea91eaca47.png"></div>

```java
@Test
    public void testRagToLLM(
            @Autowired VectorStore vectorStore,
            @Autowired DashScopeChatModel chatModel,
            @Value("classpath:rag/terms-of-service.txt") Resource resource) {
        TextReader textReader = new TextReader(resource);
        textReader.getCustomMetadata().put("filename", resource.getFilename());
        List<Document> documents = textReader.read();


        ChineseTokenTextSplitter splitter = new ChineseTokenTextSplitter(100);
        List<Document> apply = splitter.apply(documents);

        vectorStore.write(apply);

        // 3. 相似性查询  
        ChatClient chatClient = ChatClient.builder(chatModel)
                .build();

        String message="退费需要多少费用?";
        String content = chatClient.prompt().user(message)
                .advisors(
                        new SimpleLoggerAdvisor(),
                        QuestionAnswerAdvisor.builder(vectorStore)
                                .searchRequest(
                                        SearchRequest
                                                .builder().query(message)
                                                .topK(5)
                                                .similarityThreshold(0.3)
                                                .build())
                                .build()
                ).call().content();

        System.out.println(content);
    }
```

SpringAI整个过程原理：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1750057895102-987392e8-f52a-417d-9df1-35764077748c_fbeee54166.png" alt="ch10_1750057895102-987392e8-f52a-417d-9df1-35764077748c_fbeee54166.png"></div>

## 提升检索精度—rerank(重排序）

### 为什么需要 rerank

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1753779425195-b3fcc518-dd15-40cb-ac6d-fb5e77285348_71e6d7dcc6.png" alt="ch10_1753779425195-b3fcc518-dd15-40cb-ac6d-fb5e77285348_71e6d7dcc6.png"></div>

传统的向量检索存在几个关键问题：
**语义相似度的局限性**：向量检索主要基于余弦相似度等数学计算，但相似的向量表示不一定意味着内容一定绝对相关。单纯的向量相似度无法充分理解查询的真实意图和上下文。
**排序质量不佳**：初始检索的排序往往不是最优的，可能将不太相关的文档排在前面，尤其性能差的向量模型更为明显。
**上下文理解缺失**：传统检索（完全依赖向量数据库和向量模型）缺乏对查询和文档完整上下文的深度理解，容易出现语义漂移问题。

### 重排序：

主要在检索阶段进行改进：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1753779476732-44858afa-eacb-4758-8362-411138c71e97_c6a316794a.png" alt="ch10_1753779476732-44858afa-eacb-4758-8362-411138c71e97_c6a316794a.png"></div>

**二阶段优化架构**：rerank 采用"粗排+精排"的两阶段架构。第一阶段快速检索大量候选文档，第二阶段使用专门的重排序模型进行精确评分。
**专业化模型**：重排序模型（如 `**gte-rerank-hybrid**`）专门针对文档相关性评估进行训练，能够更准确地计算查询与文档的语义匹配度。
**分数阈值过滤**：通过设置最小分数阈值，可以过滤掉低质量的文档，确保只有高相关性的内容被保留。在实现中可以看到这个过滤逻辑：  
**动态参数调整**：支持根据实际效果动态调整 `**topN**` 等参数，优化最终返回的文档数量和质量。

### 代码

说明：
为了更好的测试
1. 我这里用的事ollama一个性能较差的向量模型， 这样才能更好体现他瞎排的顺序
2. 我分隔的比较小new ChineseTokenTextSplitter(80,10,5,10000,true);为了有更多的document；
3. 粗排需要设置数量较大的topk(建议200） ， 精排（默认topN5）

```java
@SpringBootTest
public class RerankTest {

    @BeforeEach
    public void init(
            @Autowired VectorStore vectorStore,
            @Value("classpath:rag/terms-of-service.txt") Resource resource) {
        // 读取
        TextReader textReader = new TextReader(resource);
        textReader.getCustomMetadata().put("filename", resource.getFilename());
        List<Document> documents = textReader.read();


        // 分隔
        ChineseTokenTextSplitter splitter = new ChineseTokenTextSplitter(80,10,5,10000,true);
        List<Document> apply = splitter.apply(documents);


        // 存储向量（内部会自动向量化)
        vectorStore.add(apply);
    }

    @TestConfiguration
    static class TestConfig {

        @Bean
        public VectorStore vectorStore(OllamaEmbeddingModel embeddingModel) {
            return SimpleVectorStore.builder(embeddingModel).build();
        }
    }


    @Test
    public void testRerank(
            @Autowired DashScopeChatModel dashScopeChatModel,
            @Autowired VectorStore vectorStore,
            @Autowired DashScopeRerankModel rerankModel) {

        ChatClient chatClient = ChatClient.builder(dashScopeChatModel)
                .build();


        RetrievalRerankAdvisor retrievalRerankAdvisor =
                new RetrievalRerankAdvisor(vectorStore, rerankModel
                        , SearchRequest.builder().topK(200).build());

        String content = chatClient.prompt().user("退票费用")
                .advisors(retrievalRerankAdvisor)
                .call()
                .content();


        System.out.println(content);

    }
}
```

重排前：
排第一的doucment跟退费并没有关系：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1752846171180-c3491a36-4fe2-451a-b3df-d7354e7423c9_0fc3a1c986.png" alt="ch10_1752846171180-c3491a36-4fe2-451a-b3df-d7354e7423c9_0fc3a1c986.png"></div>

重排后：
排第一的document:

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch10_1752846203397-eba6baeb-fe2b-4a00-8ad1-c1cc17ccc841_dc3e7673a3.png" alt="ch10_1752846203397-eba6baeb-fe2b-4a00-8ad1-c1cc17ccc841_dc3e7673a3.png"></div>
