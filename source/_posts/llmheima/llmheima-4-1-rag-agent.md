---
title: llmheima-第1节 RAG Agent
date: 2026-11-19 01:00:00
categories:
  - llmheima
tags:
  - llmheima
---
<div class="essay-banner essay-llm"></div>

# 第1节 RAG Agent

大型语言模型（LLMs）功能强大，但存在几个关键局限性：

- 知识局限性：模型的回答都来自于训练数据，对于完全未接触过的专业领域，无法给出正确的答案
- 时间局限性：模型训练数据都来自于历史数据，比如DeepSeek的训练数据截止于2026年，无法回答实时问题

而要解决这些问题，就需要用到RAG技术了。

本章，我们就学习RAG技术，以及LangChain中如何实现RAG.

## 认识RAG

**RAG**，**R**etrieval-**A**ugmented **G**eneration，就是**检索增强生成**的意思。既，通过检索加载额外的知识作为上下文信息来增强LLM的生成回答。

具体是什么意思呢？

### LLM的幻觉

举例来说，某保险公司开发了一个自己的智能客服，希望智能客服可以7\*24小时在线，回答用户与自家的保险产品、条款、理赔有关的问题。

但是，受限于知识局限性，LLM对这家保险公司的产品、理赔条款完全不知道，是没办法回答的。如果强行回答，只能说一本正经的胡说八道，也就是所谓的**幻觉**。

![rag-agent-01.webp](@@CDN@@/assets/img/llmheima/4-1/rag-agent-01.webp)

那么，怎么解决这个问题呢？

### 外挂知识库

按照RAG的思想，我们可以把LLM不知道的知识作为提示词的一部分发送给他，这样LLM就可以根据提示词中的知识来回答用户问题了。

例如：AI保险客服不知道保险合同条款，当用户提问时，我们可以把保险公司的所有保险条款和用户问题都作为提示词，一起给模型：

![rag-agent-02.webp](@@CDN@@/assets/img/llmheima/4-1/rag-agent-02.webp)

模型拿到了公司完整的保险条款文档，然后根据文档就可以回答用户问题了。

怎么样，听起来是不是还不错？

可惜，理想很丰满，现实很骨感。

要知道，模型的上下文窗口是有限制的，目前最大的上下文窗口也就1M token. 

而作为一家保险商城，保险数量众多，其保险条款文档总数据量可能达到GB级别！！远远超过了模型的上下文窗口！

而且，即便上下文没有超出，每次用户提问都输入1M的token的上下午，这也是非常浪费的，毕竟token越多，收费越贵！

那该怎么办呢？

### 知识切分

要想让模型回答超出其训练数据以外的问题，就必须在请求模型时**携带额外知识数据**（**知识库**）。但是如果知识库数量太大，就存在两个问题：

- 可能超出模型上下文限制
- 浪费大量Token，成本高

该怎么办呢？

聪明的你应该能想到了：

> 知识库虽然很大，但回答用户问题并不需要整个知识库啊，**与用户问题相关的知识其实只是一小部分**。我们可以**把知识库切分成一个个的知识片段**，当用户提问时，**只携带与问题相关的知识片段**不就可以了！

没错！

还是以保险商城智能客服为例。商城的保险条款非常多，但我们可以按照一定的规则切分：

- 按保险产品切分，每个产品一个条款文档
- 按条款内容切分，例如：投保范围、保险责任、受益人、保费缴纳、免赔策略、....
- ...

按照上述规则将庞大保险知识库切分为小知识块，然后，当用户提问时，我们找到与之相关的知识块，拼入提示词即可：

![rag-agent-03.webp](@@CDN@@/assets/img/llmheima/4-1/rag-agent-03.webp)

好了，基于文档切分，只携带知识片段的思路，我们解决了之前的两个问题：

- 知识片段体积小，不会超出上下文限制
- 知识片段Token少，成本低

但是，新的问题来了：

> 切分后知识片段那么多，我怎么知道哪一个片段是与用户问题有关的呢？

### 知识检索

知识库切分成无数的知识片段后，面临一个难题：

> 如何从海量的知识片段中找到与用户问题相关的那一个呢？

可能有同学会想：

> 这很简单啊，把知识片段存入elasticsearch，拿着用户问题，基于全文检索算法搜索就行了。

没错，这是一个办法，也能解决用户的一些问题。但并不能保证每次都能检索到正确的答案。

例如，用户问：我得过肝炎，能买这款产品呢？

这个问题的语义是想问**承保范围**问题，但是如果你用关键字全文检索，是很难找到对应条款的。所以，针对这类问题我们必须从**语义分析**来检索，找到语义上与用户问题最接近的知识片段。

用户问题、知识片段都是文字，也就是说我们需要找到一种办法判断两端文字语义是否接近。

那么，我们该如何基于语义判断两段文字是否接近呢？

#### 向量相似度

模型理解人类语言的方式就是**Word Embedding**，也就是把词转为多维向量，这些向量映射到多维空间时，不同方向、大小就具备不同的语义。

想了解词向量原理可以查看这个视频：

链接：<https://player.bilibili.com/player.html?bvid=178w1z7EHQ&p=4&share_source=copy_web&vd_source=852a7cd7a68e9348360777cc48463710>

当然，在知识检索时我们不是要把每个词转为向量，而是把用户的问题（一句话）转为向量，把知识片段（一段话）转为向量，然后就可以通过比较**向量相似度**来**判断两者的含义是否接近**了。

那么，如何衡量向量相似度呢？

向量既然是在空间中，两个向量之间就一定能计算距离。

多维空间不好理解，我们以二维向量为例，向量之间的距离常见的计算方法有：

- **余弦相似度**（Cosine similarity）：两个向量之间的夹角。
- **欧氏距离**（Euclidean distance ）：两点之间的直线距离。
- **点积**（Dot product）：一个向量在另一个向量上的投影量

![rag-agent-04.webp](@@CDN@@/assets/img/llmheima/4-1/rag-agent-04.webp)

通常，两个向量之间**距离越近**，我们认为两个向量的**相似度越高**（距离值越小，相似度越高）

所以，当我们**把文本转为向量**，就可以**通过向量距离来判断文本的相似度**了。

现在，有不少的专门的**向量模型**，就可以实现将文本向量化。一个好的向量模型，就是要**尽可能让文本含义相似的向量，在空间中距离更近**：

![rag-agent-05.webp](@@CDN@@/assets/img/llmheima/4-1/rag-agent-05.webp)

例如，阿里云百炼平台就提供了很多用于知识检索的向量模型：

[大模型服务平台百炼控制台](https://bailian.console.aliyun.com/cn-beijing?tab=doc#/doc/?type=model&url=2842587)

![rag-agent-06.webp](@@CDN@@/assets/img/llmheima/4-1/rag-agent-06.webp)

仅仅有向量模型还不够，假如知识切分后有成千上万的知识块（chunk），每一块都有自己的向量值，要在这么多知识块中找出与用户问题相关的向量，需要大量的计算，很麻烦。

那么，我们该如何简单、高效的检索知识片段呢？

#### 向量数据库

向量数据库的主要作用有两个：

- 存储向量数据（知识片段）
- 基于相似度检索向量数据（知识片段）

LangChain中支持市面上常见的各种向量数据库，具体可查看官方文档：

[Vector store integrations - Docs by LangChain](https://docs.langchain.com/oss/python/integrations/vectorstores)

目前，企业常用向量数据库可以分为三类：

- **专用的向量数据库**：这些产品从底层专为向量检索设计，在高并发、低延迟、海量数据场景下表现最佳。
- **传统数据库集成向量功能**：通过插件或新增模块支持向量检索，优点是复用现有运维能力和生态
- **云原生向量数据库**：运维成本较低

新兴专用向量数据库：

{% autogrid data-grid-link-table nofix %}
| 数据库名称 | 核心特点 | 典型企业场景 |
| Pinecone | 全托管、无需运维、索引优化强 | 适合不希望管理基础设施的SaaS公司、初创企业。 |
| Milvus | 最流行的开源向量数据库，功能全面（支持多种索引、混合查询）。 | 适合有数据安全要求、需要自建或私有化部署的中大型企业。 |
| Qdrant | 用Rust编写，性能极高，支持丰富的过滤条件（Payload）。 | 适合需要复杂元数据过滤的场景（如电商、社交推荐）。 |
| Weaviate | 内置ML模型（可直接向量化数据），支持GraphQL接口。 | 适合希望简化数据预处理流程、使用GraphQL的团队。 |
| Chroma | 轻量级、嵌入式使用（类似SQLite），与LangChain集成最紧密。 | 适合原型验证、AI应用快速开发、个人/小团队项目。 |
{% endautogrid %}

传统数据库新增向量功能：

{% autogrid data-grid-link-table nofix %}
| 产品名称 | 向量功能特点 | 常见用途 |
| Elasticsearch | 通过 `dense_vector` 字段和 `knn` 查询支持向量搜索。 | 已有ES集群的企业、日志+向量混合搜索场景。 |
| Pgvector (PostgreSQL扩展) | 最流行的关系型数据库向量扩展，简单稳定，支持精确/近似搜索。 | 技术栈以PostgreSQL为主、不想引入新组件的企业。 |
| Redis | 通过 RediSearch 模块提供向量相似度搜索。 | 需要超低延迟（缓存级）、实时推荐场景。 |
| ClickHouse | 通过余弦/欧氏距离函数支持向量检索 | 大规模数据分析+向量检索结合的OLAP场景。 |
{% endautogrid %}

企业开发，首推**Milvus**数据库，性能最好，而且开源免费

个人测试，用Milvus lite（不支持Windows）或Chroma都可以，都支持本地嵌入（类似Sqlite）

有了向量数据库，我们就无需自己检索向量了，全部交给向量数据库即可。

### 最终蓝图

到这里为止，RAG所需要的核心技术和原理就清楚了，这个时候你也能理解RAG名字的由来了。

**RAG，R**etrieval-**A**ugmented **G**eneration，关键词：

- 检索：就是利用向量相似度检索知识片段
- 增强：用检索到的知识片段增强模型，减少幻觉
- 生成：模型基于知识片段生成答案

#### RAG核心流程

综上所述，RAG分为两大阶段：

- **离线阶段**：负责构建知识库

  1. **知识加载**：读取各种来源的知识库数据，解析、清洗数据，形成文档（Documents）。
  2. **知识切分**：把清洗后的知识文档切分成一个个的知识片段（Chunks）
  3. **向量化**：利用向量模型将知识片段转为向量，使得语义相近的文本在该向量空间中彼此邻近
  4. **存储向量**：将处理好的向量及对应的知识片段存入向量数据库
- **在线阶段**：负责检索知识，生成回答

  1. **问题向量化**：利用向量模型（必须与离线阶段同一个模型）将用户问题转为向量
  2. **知识召回**：在向量数据库中检索与问题向量最相似的文档的TopN
  3. **生成回答**：把检索到的知识片段与用户提问组织为新提示词，发给大模型，生成回答

![rag-agent-07.webp](@@CDN@@/assets/img/llmheima/4-1/rag-agent-07.webp)

#### LangChain的RAG组件

LangChain为了简化RAG的开发，为我们提供了大量组件，满足RAG每一个流程的实现。

主要的组件包括：

- **离线阶段**

  1. **知识加载：**LangChain提供了**Document Loader**组件
  2. **知识切分**：LangChain提供了**Text Splitter**组件
  3. **向量化**：LangChain提供了**Embeddings**接口，兼容各类向量模型
  4. **存储向量**：LangChain提供了**VectorStore**接口，兼容各类向量数据库
- **在线阶段**：负责检索知识，生成回答

  1. **问题向量化**：同样基于Embeddings模型接口
  2. **知识召回**：LangChain提供了**`VectorStore`**组件，简化知识片段的检索操作
  3. **生成回答**：拼接召回知识片段和用户问题，调用模型即可

为了使用LangChain的RAG组件，我们需要安装一些依赖：

```python
uv add langchain-ollama langchain-text-splitters langchain-community pypdf
```

接下来我们就分为2阶段逐一学习这些RAG组件的用法，以及其中的优化细节：

- **第1节. 构建知识库**：核心关注**离线阶段**的每个组件用法及企业优化方案
- **第2节. RAG Agent**: 核心关注如何利用LangChain构建RAG Agent，实现**在线阶段**的知识检索和问答

#### RAG代码预览

最后，我们一起先看看LangChain实现RAG的代码流程，有一个整体的认知。

完整代码如下：

```python
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.embeddings import DashScopeEmbeddings
from langchain_core.vectorstores import InMemoryVectorStore
from langchain.tools import tool
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent

import os
from dotenv import load_dotenv
load_dotenv()
# ===============一、构建知识库阶段====================
# =============1.加载文档===============
loader = PyPDFLoader(
    "resources/贵州茅台研报.pdf",
    mode="single", # single \ page
)
docs = loader.load()
print(f"文档数量:{len(docs)}")

# =============2.切分文档===============
# 创建递归切分器
splitter = CharacterTextSplitter(separator="\n", chunk_size=1000, chunk_overlap=150)
# 切分文档
chunks = splitter.split_documents(docs)
print(f"分块数量：{len(chunks)}")

# =============3.向量化===============
# 向量模型，这里用阿里云的向量模型
embeddings = DashScopeEmbeddings(
    model="text-embedding-v3",
    dashscope_api_key=os.getenv("DASHSCOPE_API_KEY")
)

# 创建向量库，需要指定向量模型，存储文档时会自动调用向量模型完成向量化
vectorstore = InMemoryVectorStore(embedding=embeddings)
# 添加文档
vectorstore.add_documents(chunks)

# ==============二、在线问答阶段================
llm = init_chat_model("deepseek-chat")

def try_rag(query: str):
    # 1.检索文档（VectorStore会自动把问题向量化，召回相关知识片段）
    retrieved_docs = vectorstore.similarity_search(query, k=2)
    # 2.拼接上下文提示词
    content = "\n\n".join(doc.page_content for doc in retrieved_docs)
    prompt = f"""你基于我提供的报告回答用户问题，报告中没提及的就说不知道，不要自己编造答案.
    report: ```{content}```
    query: {query}"""
    # 3.调用模型，生成答案
    response = llm.invoke(prompt)
    return response.content
```

测试：

```cpp
print(try_rag("茅台收盘价多少"))
```

回答：

```python
根据您提供的报告，贵州茅台的收盘价为1458.49元。
```

可以发现，一些简单问题RAG Agent可以正常回答。但如果问题复杂一些，就会出问题：

```cpp
print(try_rag("茅台2025年的市盈率和市净率是多少"))
```

回答：

```python
根据您提供的报告，其中提及了贵州茅台2025年的市盈率（PE）为22.2倍（见表格2“2025A/E”列），但报告中未提及2025年的市净率（PB）数据。因此，无法回答市净率的问题。
```

文档中明明有相关信息，但是回答却没有，这就是说现在这个RAG系统在知识检索上存在问题。

可见，LangChain尽管提供了组件能帮助我们快速搭建RAG系统，但要想开发出一个稳定、可靠的RAG系统，还有很多需要优化的地方。

## 构建知识库

知识库构建的完整流程如图：

![rag-agent-08.webp](@@CDN@@/assets/img/llmheima/4-1/rag-agent-08.webp)

主要包含4个步骤：

- 文档加载
- 文档切分
- 向量化
- 存入向量库

我们接下来就逐一学习每个步骤对应的工具。

### 文档加载（Document Loaders）

企业真实业务场景中，需要加载的文档类型多种多样，例如：

- PDF
- Word
- Text
- CSV
- Html
- ...

这些不同来源的数据格式、文档结构存在很大的差异，更离谱的是PDF文档中还有很多的扫描件。而RAG系统更擅长的是处理普通文本，因此不管是哪种文档来源，都需要经过处理变成普通文本才能存入向量库。

但是，如此多不同种类的文档，我们该如何处理呢？

LangChain提供了丰富的**文档加载器**（**Document Loaders**），支持从各种来源加载文档，例如：

- **Webpages**: 将网页内容加载为Document，例如WebBaseLoader
- **PDFs**: 将PDF文件加载为Document，例如PyPDF、OpenDataLoader PDF
- **CommonFiles**: 各种常见文件类型加载为Document，例如TextLoader、CSVLoader
- **Social platforms**: 从社交媒体加载文档，例如Twitter、Reddit
- **Messaging services**: 从消息平台加载文档，例如Telegram、WhatsApp、Discord
- **Productivity tools**: 从常用的生产力工具中加载文档，例如Figma、Github、Slack

更多文档加载器参考LangChain官网：https://docs.langchain.com/oss/python/integrations/document_loaders#all-document-loaders

#### BaseLoader和Document

LangChain提供的所有加载器都继承了`BaseLoader`，因此都具有通用的文档加载方法：

- `load()` : 一次性加载所有文档

`BaseLoader`的部分源码如下：

```python
class BaseLoader(ABC):  # noqa: B024
    """Interface for document loader. """

    def load(self) -> list[Document]:
        """Load data into `Document` objects.

        Returns:
            The documents.
        """
        return list(self.lazy_load())

     # ... 略
```

可以看到，`load()`方法加载数据后返回的list，其中是 `Document` 对象，是LangChain中用来表示文档片段的对象。包含两个核心字段：

- `page_content`: 文档内容
- `metadata`: 元数据（如来源、页码等）

下面，我们以PDF文档加载为例，看看LangChain的Document Loader如何使用。

#### PyPDFLoader

PyPDFLoader顾名思义，是加载PDF文件的加载器，依赖于pypdf，在LangChain的Community社区对其提供了支持。

> ‼️ **注意**：langchain-community不再被langchain官方维护，也不再推荐使用，这里只做演示，不做推荐。

先安装对应依赖：

```python
uv add langchain-community pypdf
```

PyPDF 支持两种模式：

- `single`：整个文档作为一个Document，但是可以自定义文档页与页之间的分隔符
- `page`：每页作为一个Document

它可以把PDF加载为多种格式：json、Markdown、html、文本等。

示例：

```python
from langchain_community.document_loaders import PyPDFLoader

# 初始化并配置文档加载器
loader = PyPDFLoader(
    file_path='resources/贵州茅台研报.pdf',
    mode="page" # single: 整个文件作为1页文档. page：按PDF分页
)

# 加载PDF文件，得到list[Document]
docs = loader.load()
print(f'文档数量:{len(docs)}')

# 遍历，得到每一个Document，都包含page_content和metadata两个属性
for i, doc in enumerate(docs):
    print(f"==============Doc_{i}=================")
    print("metadata = ", doc.metadata)
    print("page_content = ", doc.page_content)
```

把文档保存到本地看看：

```python
# 写到本地看看
with open("./resources/r1.md", "w", encoding="utf-8") as f:
    f.write(docs[0].page_content)
```

会发现整篇文档格式混乱，毫无格式可言。显然，pypdf对于复杂的pdf处理起来并不拿手。

#### MinerU

某些行业的PDF文件结构非常复杂，可能包含：左右分栏、复杂表格、图文混排、图片扫描件等情况。针对这样的PDF文件就需要用到诸如：文档结构识别模型、多模态模型、表格处理、OCR等专用工具，非常复杂。

用LangChain默认的PDF加载工具就不行了。

好在市面上已经有很多专业的工具，帮我们实现了这些功能。

##### 常见PDF处理工具

常见的复杂PDF处理工具有：

{% autogrid data-grid-link-table nofix %}
| **维度** | **Docling (IBM)** | **Marker** | **MinerU (上海AI实验室)** | **Unstructured** |
| 核心定位 | 企业级多格式文档处理与AI集成平台 | 轻量、快速的PDF/图像转Markdown工具 | 高精度中文及复杂文档解析专家 | 非结构化数据的通用ETL预处理平台 |
| 开发背景 | IBM苏黎世研究院，现为Linux基金会项目 | 个人开发者Vik Paruchuri创建，后获商业支持 | 上海人工智能实验室 (OpenDataLab) | Unstructured Technologies Inc. (商业公司) |
| **开源协议** | MIT (极其宽松，商用友好) | GPL-3.0 / 商业授权 (商用受限) | Apache-2.0 (商用友好) | Apache-2.0 (核心库开源，高级功能闭源) |
| **多格式支持** | 极强。原生支持 PDF、Word、PPT、Excel、HTML、图片等 | 专注于 PDF 及部分图片 | 原生支持 PDF、Word、PPT、Excel、HTML、图片等 | 全能型。支持数十种文件格式（Epub, EML, Docx 等） |
| **公式识别 (\$LaTeX\$)** | 支持（通过内置模型解析） | 极强。专门针对论文公式进行了大量黑盒优化 | 顶级。内置专门的公式识别模型，学术论文还原度极高 | 较弱，通常只做普通文本提取或依赖第三方 |
| **表格提取能力** | 优秀（采用 IBM 专门的 Table Transformer 模型） | 良好 | 极强。能精准识别复杂表格并转为 HTML/Markdown | 良好（但开源版本较基础，高级提取需付费 API） |
| **多栏/复杂排版** | 极强（对多栏阅读顺序的恢复非常精准） | 优秀（基于启发式规则和模型结合） | 极强。对双栏、多栏论文的去页眉页脚及版面分析极佳 | 良好（依赖分区模型，但在极端复杂排版下可能错序） |
| **性能与速度** | 综合性能均衡，一篇学术基准论文中表现最优（RAG准确率达94.1%） | 速度最快，在H100 GPU批处理模式下可达25页/秒，单页约0.6秒 | 处理速度较快，约为200页/分钟，私有化部署下200页文档解析需18秒 | 速度一般，但通过API和多种分割策略，可在速度与质量间权衡 |
| **RAG 生态对接** | 原生深度集成 LangChain 和 LlamaIndex | 需要手动处理输出的 Markdown | 适合作为预处理流，生态对接需自行封装 | 管道（Pipeline）生态极其成熟，原生适配各种向量数据库 |
{% endautogrid %}

RAG Flow(RAG的服务器) --> DeepDoc

总结一下，对于商业友好的开源产品有三款：

- Docling
- MinerU
- Unstructured

这三款中，文档处理能力最强的有两个：

- Docling
- MinerU

而这两个里，MinerU是国人开发，不管是处理速度还是精度都非常优秀。推荐使用。

另外，需要说明的是，无论是MinerU还是Docling都是可以本地部署使用的，要追求最佳性能需要本地GPU加速、部署本地视觉模型、OCR、Cuda工具。对于数据隐私要求较高的用户，可以选择本地部署。

MinerU提供了公共的API服务、桌面客户端、SDK等工具，每天可以免费处理5000个不超过200页的文档，小于20页的文档则不限数量。如果对数据隐私要求不高，而且希望降低运维成本的企业非常友好。

接下来我们就以MinerU为例来看看这种高级工具的PDF处理能力。

##### 注册MinerU

MinerU的公共API服务提供两种模式：

- 🎯 精准解析 API — 需申请 Token，支持单文件/批量、表格/公式/多格式输出，限制页数<=200
- ⚡ Agent 轻量解析 API — 免登录，IP 限频防滥用，专为 AI Agent 工作流设计，限制页数<=20

如果要使用**精准解析**模式，就必须注册账号，开通API Token，不过不用担心，并不需要收费\~嘿嘿

注册地址：https://mineru.net/

[MinerU | 一站式 PDF 文档解析工具](https://mineru.net/)

登录后，访问【**API**】页面，点击【**API管理**】菜单，然后点击【**创建 Token**】按钮，即可生成一个Token，它是你的访问凭证。

![rag-agent-09.webp](@@CDN@@/assets/img/llmheima/4-1/rag-agent-09.webp)

##### 配置TOKEN

为了使用方便，我们需要把刚刚注册TOKEN配置到项目的`.env`中，像这样：

```python
# MinerU
MINERU_TOKEN=sk-your_mineru_token
```

##### 使用MinerU的SDK

MinerU的API是基于Http协议，理论上我们可以直接基于Http请求调用。不过，这样做太麻烦了。

MinerU还提供了多种不同的访问API接口的方式，例如：

- 基于Skills和MCP
- 基于CLI
- 基于SDK，支持Python、JS、TS、GO
- 基于RAG框架，支持LangChain、Dify、RAGFlow、LlamaIndex等
- ...

详见官方文档：https://mineru.net/ecosystem?tab=cli

这里重点说两种：

- **SDK** : 原生SDK，兼容性最好，可以自由的处理MinerU解析好的markdown、images、json
- **LangChain** : 完美适配LangChain，但解析PDF时只能得到markdown，其它内容无法获取

MinerU的其它用法可以参考官方教学文档：《03课：MinerU 在线 API 实战教程》

MinerU的本地部署可以参考官方教学文档：《02课：MinerU 多环境部署实践：从开源容器化到信创生态适配》

官方提供的SDK更加灵活，这里我们学习官方sdk的用法。

###### SDK用法

首先来说SDK方式，我们先安装依赖：

```text
uv add mineru-open-sdk
```

然后就可以使用了：

- 初始化客户端：

```python
from mineru import MinerU
import os
from dotenv import load_dotenv
load_dotenv()

# 1.创建客户端
client = MinerU(token = os.getenv("MINERU_TOKEN"))
```

- Flash（快速模式）：

```python
# 解析文件
result = client.flash_extract("./resources/sample.pdf")

# 获取markdown
print(result.markdown)
```

- Precision（精准模式）：

```python
# 解析文件
result = client.extract("./resources/sample.pdf")

# 获取markdown
print(result.markdown)

# 保存数据到本地
result.save_all("resources/output")
```

###### OCR功能

对于扫描件类型的PDF，MinerU处理起来也毫不费力，只需要把OCR参数改为True即可：

```python
# 解析文件，支持各种自定义参数，例如：ocr、
result = client.extract('./resources/small_ocr.pdf', ocr=True)

# 获取markdown
print(result.markdown)
# 输出到本地
result.save_markdown('./resources/output/ocr.md')
```

MinerU不仅处理PDF是一把好手，它也能处理Html、ppt、pptx、doc、docx、xls、xlsx、图片等多种格式，理论上有这一种加载器就能满足99%的企业需求了。

更何况还免费，真香！

![rag-agent-10.webp](@@CDN@@/assets/img/llmheima/4-1/rag-agent-10.webp)

##### **基于LangChain**

基于SDK方式虽然可以读取到图片，但输出格式只是普通文本。如果你的项目是基于LangChain，后续就需要我们自己把markdown封装为LangChain的Document.

所以，如果你的PDF不包含图片，或者图片中不包含重要信息，完全可以直接使用MinerU官方提供的LangChain版本SDK，解析完成后直接得到LangChain的Document对象。

首先，同样是安装依赖：

```text
uv add langchain-mineru
```

接着，需要将MinerU的API Token配置到你的.env文件，key必须是 MINERU_TOKEN:

```text
MINERU_TOKEN=your_mineru_token
```

###### 2.1.3.5.1.基本用法

然后就可以用代码调用了：

```python
from langchain_mineru import MinerULoader

# 初始化客户端
loader = MinerULoader(
    source="./resources/贵州茅台研报.pdf",
    mode="flash" # 可选: flash 、 precision
)
# 解析文档，返回值直接是LangChain的 Document集合
docs = loader.load()

print(docs[0].metadata) # 元数据
# print(docs[0].page_content) # 文档内容

# 写到本地看看
with open("./resources/output/r1.md", "w", encoding="utf-8") as f:
    f.write(docs[0].page_content)
```

###### OCR功能

对于扫描件类型的PDF，MinerU处理起来也毫不费力，只需要把OCR参数改为True即可：

```python
from langchain_mineru import MinerULoader

# 初始化客户端
loader = MinerULoader(
    source="./resources/small_ocr.pdf",
    mode="precision",
    ocr= True
)
# 解析文档，返回值直接是LangChain的 Document集合
docs = loader.load()

print(docs[0].metadata) # 元数据
print(docs[0].page_content) # 文档内容

# 写到本地看看
with open("./resources/output/r2.md", "w", encoding="utf-8") as f:
    f.write(docs[0].page_content)
```

### 文本切分（Text Splitters）

LLM的上下文窗口有限，不能将加载的整个文档扔进去，需要将文档切分成合适大小的块（chunk）。

但是到底该切多大呢？这可不能随意，因为我们要考虑两点：

- **检索精准度**：能精准找到与问题最相关的chunk（知识片段）
- **语义完整度**：检索到的chunk必须能覆盖回答用户问题的所有信息

而这两点是矛盾的，RAG是根据**整个chunk的语义生成一个向量**，

- chunk越大，噪音越多，语义越不精准，检索精度就低；但同时语义完整度就越高
- chunk越小，噪音越少，语义越精准，检索精度就高；但同时语义完整度就越低

总结：

- **太大**: 包含过多无关信息，检索精度下降
- **太小**: 丢失上下文，语义不完整

那么，该如何切分出合适大小的chunk呢？

常见的文档切分策略如下：

{% autogrid data-grid-link-table nofix %}
| 策略名称 | 核心原理 | ✅ 优点 | ❌ 缺点 | 适用场景 |
| **语义切分** | 用嵌入模型计算相邻句子相似度，在低于阈值时切分，识别主题转折点。 | 最大限度保持语义连贯性，分块质量高。 | 计算成本高，依赖嵌入模型精度。 | 对语义完整性要求极高的场景，如学术论文、法律文件。 |
| **固定长度切分** | 按预设字符数或Token数切分 | 实现简单，速度快，可预测。 | 易在句子中间截断，严重破坏语义完整性。或者出现超大块。 | 日志、代码等结构不敏感文本；或作为性能基线。 |
| **递归切分** | 按优先级分隔符（如段落`\n\n` > 句子`。`）逐级递归分割，直至满足大小要求。 | 尊重文档结构，语义完整性好，能动态调整。 | 对无标准分隔符的文本效果下降。 | **通用首选**，适用于报告、文章等大多数规范文档。 |
| **滑动窗口切分** | 固定窗口，通过高重叠率（如20%）滑动生成连续分块，保留上下文。 | 上下文连接紧密，避免信息断裂。 | 冗余度高，存储和计算开销大。 | 可以与其它策略结合 |
| **结构感知切分** | 利用文档元数据（如Markdown/HTML标题）识别逻辑区块进行切分。 | 天然符合文档组织逻辑，结构清晰准确。 | 需要格式良好的文档，灵活性受限。 | Markdown、网页等有清晰原生结构的文档。 |
{% endautogrid %}

LangChain对常见的切分策略都有支持，接下来我们就来学习这些切分策略。

#### TextSplitter接口

首先，我们需要安装`langchain-text-splitters`依赖：

```python
uv add langchain-text-splitters
```

LangChain中提供了各种不同的切分策略，并且提供了统一的接口：`TextSplitter`，其部分源码如下：

```python
class TextSplitter(BaseDocumentTransformer, ABC):

    @abstractmethod
    def split_text(self, text: str) -> list[str]:
        """ Split text.
        Args:
            text: The text to split.

        Returns:
            A list of text chunks.
        """

    def split_documents(self, documents: Iterable[Document]) -> list[Document]:
        """Split documents.
        Args:
            documents: The documents to split.

        Returns:
            A list of split documents.
        """
        # ... 略
```

其中最常用的两个函数：

- `split_text`：接收普通文本，返回的是切分好的文本列表
- `split_documents`：接收的是`Document`列表，返回的是切分后的`Document`列表

因此，LangChain中大部分的切分器都实现了`TextSplitter`接口，提供了这两个方法，虽然**切分规则不同，但用法是大同小异**。

#### 固定长度切分（不推荐）

先看最简单的一种，就是固定长度切分，在LangChain里提供了两个实现：

- 根据字符大小切分
- 根据token大小切分

不管哪种都需要用到`CharacterTextSplitter`这个类。

##### CharacterTextSplitter - 按字符切分

最简单的切分方式，属于固定长度切分策略的一种，常见的三个参数：

- `separator `: 分隔符，以此作为分隔的基本单元
- `chunk_size `: 每一块的理想大小
- `chunk_overlap `: 下一块与上一块重叠的大小，也就是滑动窗口切分

我们先准备一段文本：

```python

# 准备一段较长的文本
doc = """
大型语言模型是近年来人工智能领域最令人瞩目的突破性技术之一。GPT-3、GPT-4、BERT、T5等模型的出现，彻底改变了自然语言处理领域的研究范式。

这些模型基于深度学习架构，通过在海量文本数据上进行预训练，学习到了丰富的语言知识和世界知识。

检索增强生成是近年来兴起的一种重要技术范式，它通过将大型语言模型与外部知识检索系统相结合，有效解决了模型知识更新困难、事实性错误、缺乏专业领域知识等问题。在这种范式中，当用户提出一个问题时，系统首先从外部知识库中检索相关的文档片段，然后将这些片段与用户问题一起作为输入传递给大型语言模型进行答案生成。这种方法不仅提高了模型回答的准确性，还增强了模型的可解释性和可控性。文本分割是构建检索增强生成系统的关键预处理步骤，因为检索的对象通常是文本片段，而分割的质量直接影响后续检索的精确度和召回率。如果分割策略不合理，会带来一系列严重的问题，比如当分割过于粗粒度时检索到的内容可能包含大量无关信息，当分割过于细粒度时则可能丢失关键的上下文信息。

LangChain提供了多种文本分割器实现。CharacterTextSplitter使用指定的单个分隔符对文本进行分割，实现简单高效。RecursiveCharacterTextSplitter则持有一个分隔符优先级列表，能够递归地尝试不同粒度的分隔符。这个分割器因此在处理结构复杂、格式多样的文本时表现更佳，也是LangChain官方推荐的默认分割器。在实际的工程实践中，选择合适的文本分割策略需要综合考虑文本本身的特征和下游任务的具体需求。

通过合理的实验设计和评估，开发者可以找到最适合特定场景的分割策略。
"""
```

示例：

```python
from langchain_text_splitters import CharacterTextSplitter

# 创建字符切分器
text_splitter = CharacterTextSplitter(
    separator="",        # 分隔符，空就是任意位置都可分隔
    chunk_size=200,     # 每块最大200字符
    chunk_overlap=40,   # 块之间重叠40字符
)

# 切分文本
chunks = text_splitter.split_text(doc)

print(f"原始文本长度: {len(doc)} 字符")
print(f"切分为 {len(chunks)} 个块:\n")
for i, chunk in enumerate(chunks):
    print(f"--- Chunk {i+1} ({len(chunk)}字符) ---")
    print(chunk)
    print()
```

##### CharacterTextSplitter - 按Token切分

使用OpenAI开源的tiktoken计算token数量，按token数量切分，更精确地控制发送给LLM的token数。

```python
from langchain_text_splitters import CharacterTextSplitter

# 创建字符切分器
# 使用from_tiktoken_encoder，LangChain自带，无需额外安装tiktoken
token_splitter = CharacterTextSplitter.from_tiktoken_encoder(
    encoding_name="cl100k_base",    # token分词器编码名
    chunk_size=200,                # 每块最多200 token
    chunk_overlap=40,              # 块之间重叠40 token
)

chunks = token_splitter.split_text(doc)

print(f"原始文本长度: {len(doc)} 字符")
print(f"切分为 {len(chunks)} 个块:\n")
for i, chunk in enumerate(chunks):
    print(f"--- Chunk {i+1} ({len(chunk)}字符) ---")
    print(chunk)
    print()
```

#### 递归字符切分（推荐）

LangChain中提供了一个`RecursiveCharacterTextSplitter`类，实现了递归字符切分。

这是LangChain推荐的通用文本切分器，在不超过目标块大小的前提下，尽可能保持段落和句子的完整性。

关键参数如下：

{% autogrid data-grid-link-table nofix %}
| 参数 | 作用 | 默认值 (通常情况) |
| `chunk_size` | 目标块大小 (以字符/token计)。分割器努力让每个块的文本长度不超过这个值。 | `4000` |
| `chunk_overlap` | 块间重叠长度。为了让块与块之间保留一些共同上下文，避免在关键信息处被切断。 | `200` |
| `separators` | 自定义分隔符优先级列表。这是控制分割行为的核心，你可以根据文档格式（如代码、Markdown）调整顺序。 | `["\n\n", "\n", "。", ""]` |
| `length_function` | 长度计算函数。决定用何种方式测量文本长度（例如 `len` 计字符数，或 `tiktoken` 计token数）。 | `len` |
{% endautogrid %}

其切割流程如下：

1. 输入：原始长文本 `T`，目标块大小 `size`，一个有序的字符列表 `separators` (例如：`["\n\n", "\n", "。", " ", ""]`，优先级从高到低)。
2. 第一步（用最高级分隔符尝试）：使用当前优先级最高的分隔符（例如段落分隔符 `\n\n`）尝试将 `T` 分割成若干块。
3. 检查与判断：

   - 遍历刚分割出的每一个块。
   - 如果这个块的长度小于等于 `chunk_size`，则将其保留为一个最终的文本块。
   - 如果这个块的长度大于 `chunk_size`，则不能接受它。
4. 递归降级：对于所有大于 `chunk_size` 的“超大块”，放弃使用当前分隔符，改用下一个优先级更低的分隔符（例如换行符 `\n`）来对这个“超大块”再次进行分割。
5. 重复：重复第 3 步和第 4 步，直到所有块都小于等于 `chunk_size`。
6. 最终手段：如果尝试了所有分隔符，仍然有块大于 `chunk_size`，那么它会在最后一级分隔符（通常是空字符串 `""`，即按字符切分）上，强制将文本按 `chunk_size` 的长度进行硬截断。

示例代码：

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

# 创建递归切分器
recursive_splitter = RecursiveCharacterTextSplitter(
    chunk_size=200,
    chunk_overlap=40,
    separators=["\n\n", "\n", "。"]  # 优先级从高到低
)

# 切分文档
chunks = recursive_splitter.split_text(doc)

print(f"切分为 {len(chunks)} 个块:\n")
for i, chunk in enumerate(chunks):
    print(f"--- Chunk {i+1} ({len(chunk)}字符) ---")
    print(chunk)
    print()
```

#### 结构感知切分

所谓**结构感知切分**，就是利用文档元数据识别文档本身的逻辑区块进行切分。

例如：**markdown**中的多级标题、**JSON**结构中的字段、**Html**中的标签等等。

LangChain都提供了对应不同文档类型的结构感知切分器，例如：

- MarkdownHeaderTextSplitter
- RecursiveJsonSplitter
- HTMLHeaderTextSplitter
- RecursiveCharacterTextSplitter.from_language()
- ...

此处，我们以markdown为例来演示。

示例代码：

```python
from langchain_text_splitters import MarkdownHeaderTextSplitter

# 准备一段较长的文本
with open('./resources/评估.md', 'r', encoding='utf-8') as f:
    doc = f.read()

# 切分依据，这里是按照三级标题
headers_to_split_on = [
    ("#", "Header 1"),
    ("##", "Header 2"),
    ("###", "Header 3"),
]

# 创建切分器
markdown_splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on,
    strip_headers=False # 文本中是否携带标题
)

# 切分文档，接收str，返回值是list[Document]
chunks = markdown_splitter.split_text(doc)

for chunk in chunks:
    print(chunk.model_dump_json(indent=2))
```

> ⚡ **注意**：
> - 由于`MarkdownHeaderTextSplitter`并未实现`TextSpliter`接口，它与前面的切分器不一样。只有一个`split_text`方法。
> - `split_text`方法只接收字符串，返回值一定是`list[Document]`。

#### 总结

没有绝对正确的文档切分方式，一定要根据具体文档来具体判断。

如果你采用了MinerU这样的文本加载器，由于其输出的格式通常是Markdown，有严谨的文档结构，那我的建议切分方式是：

- 优先采用Markdown的**文档结构切分**，不仅语义完整度高，而且还能记住自己所处的章节
- 当基于文档结构切分的块太大时，可以对超过目标size的块采用**递归字符切分**，但要保留header到每一个分块

也就是说，可以**把多种切分器混合使用**。

### 向量化（Embeddings）

文档切分成块后，下一步就是把文本向量化了。

向量化是将文本转换为高维向量的过程。语义相似的文本在向量空间中距离更近，这是语义检索的基础。

目前比较常见的**小规模、开源**文本向量模型有：

{% autogrid data-grid-link-table nofix %}
| 模型 | 参数量 | 维度 | 最大长度 | 核心特点 |
| Qwen3-Embedding-0.6B | 0.6B | 1024 | 32K | MTEB多语言榜64.34分，支持MRL维度压缩，多语言能力强 |
| jina-code-embeddings-0.5B | 0.5B | 896 | 32K | 代码检索SOTA，MTEB Code平均78.72%，支持15+编程语言，Last-token池化 |
| jina-embeddings-v5-omni-nano | \~1.0B | 768 | 8K | 全模态(文本/图像/音频/视频/PDF)，冻结底座仅训练0.35%参数，支持MRL维度压缩 |
| jina-embeddings-v5-omni-small | \~1.6B | 1024 | 32K | 全模态四模态平均53.93分，文本侧与v5-text逐字节兼容，MMTEB文本67.0分 |
| jina-code-embeddings-1.5B | 1.5B | 1536 | 32K | 代码检索AVG 79.04%，匹配voyage-code-3闭源模型，支持GGUF量化 |
| BGE-M3 | 0.56B | 1024 | 8K | 支持稠密+稀疏+多向量混合检索，MIT协议，多语言表现优异 |
| all-MiniLM-L6-v2 | \~0.08B | 384 | 512 | 纯英文优化，仅80M参数，推理速度比12层快50%，STS英文表现优 |
{% endautogrid %}

还有一些**参数规模大**一点的向量模型，性能更强：

{% autogrid data-grid-link-table nofix %}
| 模型名称 | 开发方 | 参数量 | 维度 | 最大长度 | 权威基准表现 (MTEB) | 核心特点与适用场景 |
| Llama-Embed-Nemotron-8B | NVIDIA | 8B | 4096 | 32K | MMTEB 排名第 1 (截至2025.10)  | 当前的性能之王。基于Llama-3.1-8B，采用了创新的注意力池化机制，在多语言和跨语言任务上表现极佳。 |
| Qwen3-Embedding-8B | 阿里通义 | 8B | 4096 | 32K | MMTEB 排名第 3 (70.58分)  | 综合性能极强，紧随NVIDIA之后，是目前开源社区最流行、最成熟的顶级模型之一。 |
| C2LLM-7B | 蚂蚁集团 & 上海交大 | 7B | - | - | MTEB-Code榜单第 1 (80.75分)  | 代码检索专用，专为代码理解和检索设计，号称“代码检索新王”。 |
| gte-Qwen2-7B-instruct | 阿里达摩院 | 7B | 3584 | 8K | 优秀 (62.51分)  | 阿里上一个世代的代表作，性能依然强劲且成熟稳定。 |
| Gemini Embedding 2 | Google DeepMind | 未公开 | - | - | MMTEB 69.9分 (纯文本)  | 谷歌官方多模态王牌。原生支持文本、图像、视频、音频的统一向量化，多模态检索能力最强。 |
| OpenAI text-embedding-3-large | OpenAI | - | 3072 | 8K | MTEB约64.8分 | 商业API首选，性能强大且稳定，按量付费，适合不想自己部署、追求省心的团队。 |
{% endautogrid %}

其中的开源模型我们可以本地部署，也可以使用模型平台提供的服务。

LangChain支持多种Embedding模型平台，你可以自由选择：

{% autogrid data-grid-link-table nofix %}
| 模型 | 提供方 |
| `OpenAIEmbeddings` | OpenAI |
| `DashScopeEmbeddings` | 阿里云百炼 |
| `HuggingFaceEmbeddings` | 本地开源模型 |
| `OllamaEmbeddings` | 本地开源模型 |
{% endautogrid %}

更多LangChain支持的向量模型参考官方文档：https://docs.langchain.com/oss/python/integrations/embeddings

> ‼️ **注意**：
> 生产中本地模型通常采用vLLM部署，不过由于vLLM只支持Linux系统，所以我们就不用了，本地暂时用Ollama代替。

#### 基础API

为了便于开发，降低学习成本，LangChain提供了向量化模型的统一接口`Embeddings`，并且提供了向量化的两个核心方法：

```python
class Embeddings(ABC):
    """Interface for embedding models."""

    @abstractmethod
    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        """Embed search docs.

        Args:
            texts: List of text to embed.

        Returns:
            List of embeddings.
        """

    @abstractmethod
    def embed_query(self, text: str) -> list[float]:
        """Embed query text.

        Args:
            text: Text to embed.

        Returns:
            Embedding.
        """
```

其中：

- `embed_query`：问题向量化函数，一次处理一个字符串

  - 参数：接收一个字符串（一个问题）
  - 返回值：一个浮点数数组（多维向量）
- `embed_documents`：是文档向量化函数，一次处理多个字符串

  - 参数：接收一个字符串列表（一批文档片段）
  - 返回值：一个浮点数数组的列表（多个多维向量）

后续学习的所有向量模型，都具备这两个函数，操作方式也都统一。

#### Ollama Embeddings

ollama只是模型服务，关键是你基于ollama部署的模型是什么。

> ⚡ **注意：**
> 使用Ollama之前一定要启动你的Ollama服务！！！
> 使用Ollama之前一定要启动你的Ollama服务！！！
> 使用Ollama之前一定要启动你的Ollama服务！！！

比如，我们采用阿里提供的`qwen3-embedding:0.6b`这个模型，它在小模型中算是效果比较好的一个，不管是Huggingface还是Ollama都支持下载和部署这个模型。

首先，你可以通过命令下载安装这个模型：

```python
ollama pull qwen3-embedding:0.6b
```

接着，你需要安装LangChain的Ollama依赖：

```text
 uv add langchain-ollama
```

然后就可以使用了：

```python
from langchain_ollama import OllamaEmbeddings

# 创建Embedding模型
ollama_embeddings = OllamaEmbeddings(
    model="qwen3-embedding:0.6b",  # 性价比高的模型
    dimensions=1024  # 可选：减少维度以节省存储
)

# 向量化单条文本
text = "我爱上班"
vector = ollama_embeddings.embed_query(text)

# 批量向量化
texts = ["我要躺平", "我爱工作", "拒绝加班"]
vectors = ollama_embeddings.embed_documents(texts)
print(f"\n批量向量化: {len(vectors)} 条, 维度: {len(vectors[0])}")

print('==============衡量相似度===============')
import numpy as np

def cosine_similarity(vec1, vec2):
    """余弦相似度函数"""
    dot = np.dot(vec1, vec2)
    return dot / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

# 比较向量相似度
for i, v in enumerate(vectors):
    similarity = cosine_similarity(vector, v)
    print(f"{texts[i]}:", similarity)
```

输出结果：

```python
Cosine Similarity: 0.40952704102474247
Cosine Similarity: 0.8738909040875059
Cosine Similarity: 0.42264466004701556
```

效果不错，“我爱工作”与“我要上班”的相似度值是0.8738909040875059，相似度最高。

#### 阿里云Embedding

阿里云百炼平台也提供了很多文本向量化模型，比如qwen的`text-embedding-v3`、`text-embedding-v4`模型。只要注册并配置了阿里云保留的API_KEY，就都能使用。

LangChain的社区(langchain-community)提供了对阿里云模型的支持，使用需要引入下面的依赖：

```python
uv add langchain-community dashscope
```

> ‼️ **注意**：langchain-community不再被langchain官方维护，也不再推荐使用，这里只做演示，不做推荐。

示例代码：

```python
from langchain_community.embeddings import DashScopeEmbeddings
from dotenv import load_dotenv

load_dotenv()

# 初始化DashScopeEmbeddings，只需要指定模型名，会自动取.env读取DASHSCOPE_API_KEY
embeddings = DashScopeEmbeddings(
    model="text-embedding-v4"
)

# 向量化单条文本
text = "我爱上班"
# 向量化后返回的是 list[float]
vector = embeddings.embed_query(text)

print(f"文本: {text}")
print(f"向量维度: {len(vector)}")
print(f"向量前5维: {vector[:5]}")

# 批量向量化
texts = ["我要躺平", "我爱工作", "拒绝加班"]
# 批量向量化，可以理解成处理很多个知识片段，返回 list[list[float]]
vectors = embeddings.embed_documents(texts)

print(f"\n批量向量化: {len(vectors)} 条, 维度: {len(vectors[0])}")

print('==============衡量相似度===============')
import numpy as np

def cosine_similarity(vec1, vec2):
    """余弦相似度函数"""
    dot = np.dot(vec1, vec2)
    return dot / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

# 比较向量相似度
for i, v in enumerate(vectors):
    similarity = cosine_similarity(vector, v)
    print(f"{texts[i]}:", similarity)
```

### 向量库（Vector Stores）

向量库用于存储和检索向量化后的文档。LangChain支持多种向量库：

{% autogrid data-grid-link-table nofix %}
| 向量库 | 特点 | 适用场景 |
| `InMemoryVectorStore` | 内存存储，零配置 | 测试学习 |
| `Chroma` | 轻量级，支持持久化 | 中小规模 |
| `FAISS` | 高性能，支持GPU | 大规模检索 |
| `Milvus` | 高性能，支持GPU | 大规模检索 |
{% endautogrid %}

更多支持的向量库参考LangChain官方文档：https://docs.langchain.com/oss/python/integrations/vectorstores

LangChain提供了统一的`VectorStore`接口，使你可以用统一的方式调用任意向量库：

- `add_documents`: 添加文档到向量库（不用自己做文本向量化，只要提供好向量模型即可）
- `delete`: 根据id删除某个文档
- `similarity_search`: 基于相似度检索与用户问题有关的文档

也就是说，LangChain的`VectorStore`把向量数据库与EmbeddingModel合并在一起了：

- 存储文档时，VectorStore会自动把文档转向量，写入向量数据库
- 检索文档时，VectorStore会自动把用户问题转向量，再去向量数据库搜索

![rag-agent-11.webp](@@CDN@@/assets/img/llmheima/4-1/rag-agent-11.webp)

接下来，我们以`InMemoryVectorStore`为例讲解VectorStore的用法。

#### 准备文档

我们先准备好要存入向量库的文档：

```python
from langchain_text_splitters import MarkdownHeaderTextSplitter

# =============1.准备文档================
with open('./resources/评估.md', 'r', encoding='utf-8') as f:
    doc = f.read()

# =============2.切分文档================
# 切分依据，这里是按照三级标题
headers_to_split_on = [
    ("#", "h1"),
    ("##", "h2"),
    ("###", "h3"),
]

# 创建切分器
markdown_splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on,
    strip_headers=False # 在正文中是否去除标题，False，不去除
)

# 切分文档, 返回的是 list[Document]
docs = markdown_splitter.split_text(doc)

for i, doc in enumerate(docs, start=1):
    doc.id = f'doc_{i}'
```

#### 初始化VectorStore

`InMemoryVectorStore`是LangChain提供的用于测试的轻量级向量库，基于内存实现，使用非常简单。

只需要两步：

- 1.初始化向量模型
- 2.初始化`InMemoryVectorStore`，传入向量模型

示例：

```python
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_ollama import OllamaEmbeddings

# 1.初始化向量模型
ollama_embeddings = OllamaEmbeddings(
    model="qwen3-embedding:0.6b",  # 性价比高的模型
    dimensions=1024  # 可选：减少维度以节省存储
)

# 2.初始化向量数据库
vector_store = InMemoryVectorStore(embedding=ollama_embeddings)
```

#### 添加/删除文档

添加和删除方法：

- `add_documents`：*接收*`list[Document]`，可以批量添加文档
- `delete`：接收list[str]，也就是id集合，可以根据id批量删除文档

示例代码：

```python
# 保存文档到向量数据库
ids = vector_store.add_documents(docs)

print(ids)
```

删除文档：

```python
# 删除旧文档
vector_store.delete(["doc_1", "doc_2"])
```

#### 检索文档

VectorStore提供了多个检索文档的方法，例如：

- `search`: 通用搜索方法，支持最多样化的参数
- `similarity_search`: 基于相似度的搜索
- `similarity_search_with_relevance_scores`: 基于相似度搜索，并且会返回相似度得分
- ...

大多数情况下我们都希望使用相似度搜索，也就是`similarity_search`，而且`similarity_search`与`similarity_search_with_relevance_scores`的参数基本一致。

下面我们`similarity_search`为例来学习用法。

`similarity_search`方法实现文档相似度检索，其核心参数为：

- `query`: 查询条件（用户的问题）

其它参数(并不是所有向量库都支持):

- `k`: 要返回的文档最大数量（默认值：4）
- `score_threshold`: 相似度打分的最小阈值，低于这个分值的文档会被丢弃
- `filter`: 按文档元数据（metadata）筛选

##### 相似度检索

先来演示`similarity_search`方法，只返回文档，没有得分。返回值类型是`list[Document]`:

```python
# 用户问题
query = "论语中教育的目的是什么"

# 相似度检索，返回值是list[Document]
results = vector_store.similarity_search(
    query=query,
    k = 5,
)

# 打印结果
for doc in results:
    print(doc.model_dump_json(indent=2))
```

结果：

```json
{
  "id": "doc_3",
  "metadata": {
    "h2": "第一节 中外教育家及其教育思想",
    "h3": "（三）孔子及《论语》主要思想",
    "h1": "第一章 教育概述"
  },
  "page_content": "### （三）孔子及《论语》主要思想  \n**教育作用**：庶、富、教；性相近，习相远。  \n**教育对象**：“有教无类”，教育民主思想。  \n**教育目的**：以完善人格为教育的首要目的，培养士和君子。  \n**教学内容**：文、行、忠、义。  \n**教学过程**：学、思、习、行。  \n**教学原则**：因材施教、启发诱导、学思结合、谦虚笃实。  \n**教师观**：其身正，不令而行；其身不正，虽令不从。",
  "type": "Document"
}
{
  "id": "doc_4",
  "metadata": {
    "h3": "（四）孟子主要思想",
    "h1": "第一章 教育概述",
    "h2": "第一节 中外教育家及其教育思想"
  },
  "page_content": "### （四）孟子主要思想  \n**人性论**：人性本善，人先天具有仁、义、礼、智四个“善端”。  \n**教育作用**：发扬善端，培养道德完人，得天下英才而教育之。  \n**教学原则**：循序渐进，专心有恒。",
  "type": "Document"
}
{
  "id": "doc_5",
  "metadata": {
    "h2": "第一节 中外教育家及其教育思想",
    "h3": "（五）荀子主要思想",
    "h1": "第一章 教育概述"
  },
  "page_content": "### （五）荀子主要思想  \n**人性论**：性恶论，化性起伪，善德是后天习得的，重视教育的作用。  \n**教学原则**：学以致用，锲而不舍。",
  "type": "Document"
}

```

##### 带相似度得分的检索

如果希望在返回结果中带上得分，就要用到`similarity_search_with_score`方法。但需要注意的是：

- `similarity_search`的返回值是`list[Document]`
- `similarity_search_with_score`的返回值是`list[tuple[Document, float]]`

示例代码：

```python
# 相似度搜索并返回分数，结果是list[tuple[Document, float]]
results = vector_store.similarity_search_with_score(
    query,
    k = 5,
)

# 遍历结果，
for doc, score in results:
    print(f"==========score: {score}=============")
    print(doc.model_dump_json(indent=2))
```

结果中不仅有文档，还有分数：

```json
==========score: 0.6077842937433189=============
{
  "id": "doc_3",
  "metadata": {
    "h1": "第一章 教育概述",
    "h3": "（三）孔子及《论语》主要思想",
    "h2": "第一节 中外教育家及其教育思想"
  },
  "page_content": "### （三）孔子及《论语》主要思想  \n**教育作用**：庶、富、教；性相近，习相远。  \n**教育对象**：“有教无类”，教育民主思想。  \n**教育目的**：以完善人格为教育的首要目的，培养士和君子。  \n**教学内容**：文、行、忠、义。  \n**教学过程**：学、思、习、行。  \n**教学原则**：因材施教、启发诱导、学思结合、谦虚笃实。  \n**教师观**：其身正，不令而行；其身不正，虽令不从。",
  "type": "Document"
}
==========score: 0.48631210300679806=============
{
  "id": "doc_4",
  "metadata": {
    "h3": "（四）孟子主要思想",
    "h1": "第一章 教育概述",
    "h2": "第一节 中外教育家及其教育思想"
  },
  "page_content": "### （四）孟子主要思想  \n**人性论**：人性本善，人先天具有仁、义、礼、智四个“善端”。  \n**教育作用**：发扬善端，培养道德完人，得天下英才而教育之。  \n**教学原则**：循序渐进，专心有恒。",
  "type": "Document"
}
==========score: 0.4439771109641514=============
{
  "id": "doc_5",
  "metadata": {
    "h2": "第一节 中外教育家及其教育思想",
    "h3": "（五）荀子主要思想",
    "h1": "第一章 教育概述"
  },
  "page_content": "### （五）荀子主要思想  \n**人性论**：性恶论，化性起伪，善德是后天习得的，重视教育的作用。  \n**教学原则**：学以致用，锲而不舍。",
  "type": "Document"
}
```

### 总结

**知识库构建核心组件：**

{% autogrid data-grid-link-table nofix %}
| 组件 | 作用 | 常用选择 |
| Document Loader | 加载原始文档 | MinerU, Docling |
| Text Splitter | 切分文档为chunk | RecursiveCharacterTextSplitter |
| Embeddings | 文本转向量 | DashScopeEmbeddings  , BGE-M3, qwen3-embedding:0.6b |
| Vector Store | 存储和检索向量 | InMemory(开发), Chroma(中小), Milvus(大规模) |
{% endautogrid %}

关键参数建议：

- **chunk_size**: 建议 200\~1000，取决于文档类型和模型上下文长度
- **chunk_overlap**: 建议 chunk_size 的 10%\~20%
- **k (检索数量)**: 建议 3\~10，太少可能遗漏，太多可能引入噪声

## RAG 知识检索

上节课我们学习了RAG的第一阶段：**构建知识库**。

有了知识库，下一步就是**知识检索**了，要想办法找出与用户问题最相关的知识，发送给模型，生成增强答案，这就是所谓的RAG.

### RAG Agent架构

之前我们说过，RAG检索的基本流程是这样的：

![rag-agent-12.webp](@@CDN@@/assets/img/llmheima/4-1/rag-agent-12.webp)

简化一下，就是这样：

![rag-agent-13.webp](@@CDN@@/assets/img/llmheima/4-1/rag-agent-13.webp)

不难发现，RAG对话就是在**每次调用模型前多了知识检索**的步骤。

不过，在实际开发中并不是每次回答用户问题都需要知识检索，用户打招呼、询问简单问题，都可以由模型直接回答。所以，RAG系统在设计时就有三种常见的架构方式。

{% autogrid data-grid-link-table nofix %}
| 架构 | 介绍 | 可控性 | 拓展性 | 延迟 | 场景 |
| **2-Step RAG** | 每次调用模型前都做知识检索，流程简单、可控 | ✅ High | ❌ Low | ⚡ Fast | FAQs, 文档问答机器人 |
| **Agentic RAG** | 由LLM来思考何时进行知识检索 | ❌ Low | ✅ High | ⏳ Variable | 绑定了很多工具的研究助手 |
| **Hybrid** | 结合两种方式的特点，并加入答案验证环节 | ⚖️ Medium | ⚖️ Medium | ⏳ Variable | 对回答质量要求非常高的特殊领域 |
{% endautogrid %}

接下来我们重点学习前两种架构。

### 2-Step RAG

2-Step架构非常简单，就是严格遵循RAG流程：

![rag-agent-14.webp](@@CDN@@/assets/img/llmheima/4-1/rag-agent-14.webp)

把RAG的流程固化为两步：

1. **Retrieve**：检索知识库，返回知识片段
2. **Generate**：增强生成，基于知识片段增强Prompt和用户问题，调用模型生成答案

简单来说：就是每次发送请求给LLM之前，都修改提示词，拼接检索到的知识片段。

在LangChain中，提供了一个`@dynamic_prompt`装饰器，用来实现动态修改提示词。

示例代码：

```python
from langchain.agents.middleware import dynamic_prompt, ModelRequest
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
load_dotenv()

# 0.定义动态提示词中间件
@dynamic_prompt
def rag_prompt(request: ModelRequest):
    # 1.拿到用户问题，也就是消息列表中的最后一条消息
    print("================User Message================")
    user_input = request.state['messages'][-1].text
    print(user_input, "\n")

    # 2.检索知识片段, list[Document], 拼接为字符串
    docs = vector_store.similarity_search(user_input, k=2)
    context = "\n\n".join(doc.page_content for doc in docs)
    print('=============== Context ====================')
    print(context, "\n")

    # 3.拼接新系统提示词
    return f'''
    你是一个教资考试专家，你根据上下文回答用户问题，不能自己编造答案。答案要简短，直接引用原文。
    Context: {context}
    '''
# 1.初始化模型
model = init_chat_model(
    "deepseek-v4-flash",
    extra_body={'thinking': {'type': 'disabled'}}
)

# 2.定义Agent
agent = create_agent(
    model,
    middleware=[rag_prompt],
)
```

测试：

```python
from langchain.messages import HumanMessage
# 测试
response = agent.invoke({"messages":[HumanMessage("论语中教育的目的是什么？")]})
print("==============AI Message================")
print(response["messages"][-1].text)
```

结果：

```markdown
================User Message================
论语中教育的目的是什么？ 

=============== Context ====================
### （三）孔子及《论语》主要思想  
**教育作用**：庶、富、教；性相近，习相远。  
**教育对象**：“有教无类”，教育民主思想。  
**教育目的**：以完善人格为教育的首要目的，培养士和君子。  
**教学内容**：文、行、忠、义。  
**教学过程**：学、思、习、行。  
**教学原则**：因材施教、启发诱导、学思结合、谦虚笃实。  
**教师观**：其身正，不令而行；其身不正，虽令不从。

### （四）孟子主要思想  
**人性论**：人性本善，人先天具有仁、义、礼、智四个“善端”。  
**教育作用**：发扬善端，培养道德完人，得天下英才而教育之。  
**教学原则**：循序渐进，专心有恒。 

==============AI Message================
以完善人格为教育的首要目的，培养士和君子。
```

我们再次调用，这次只打招呼：

```python
# 测试
response = agent.invoke({"messages":[HumanMessage("你好")]})
print("==============AI Message================")
print(response["messages"][-1].text)
```

运行结果：

```js
================User Message================
你好 

=============== Context ====================
### （二）教育的属性  
教育的本质属性是有目的地培养人的社会活动。  
教育的永恒性。  
教育的历史性。  
教育的相对独立性。  
教育的长期性。  
教育的生产性。  
教育的民族性。

## 第二节 教育的定义  
### （一）教育的定义  
广义的教育是指一切有目的地增进人的知识和技能，发展人的智力和体力，影响人的思想品德的社会活动，具有目的性和社会性。广义教育包括社会教育、家庭教育、学校教育。广义的教育是人类社会有史以来就有的教育活动。  
狭义的教育就是指学校教育。  
教育的要素：教育者、受教育者、教育影响（主要是教育内容）。 

==============AI Message================
你好！请问有什么教资考试相关的问题需要我帮忙解答吗？
```

可以发现，尽管是发送一个简单问候语：“你好”，RAG完整流程还是执行了，检索了大量文档回来，这完全是浪费时间和资源。

### Agentic RAG

Agent自主决定**何时检索、检索什么、用不用其他工具**。实现方式就是将检索器包装为Tool，Agent可以自主判合适调用工具来获取文档，甚至是多次检索，多轮迭代。

![rag-agent-15.webp](@@CDN@@/assets/img/llmheima/4-1/rag-agent-15.webp)

**适用**: 研究助手、复杂多步问答 —— 需要灵活组合多种能力的场景。

优缺点如下：

{% autogrid data-grid-link-table nofix %}
| ✅ 好处 | ⚠️ 缺点 |
| **只在需要时搜索**—LLM可以处理问候、跟进和简单查询，而不会触发不必要的搜索。 | **两次LLM调用**——在执行搜索时，需要一个调用生成查询，另一个调用生成最终响应。 |
| **上下文搜索查询** -通过将检索作为“查询”的工具，LLM可以根据会话上下文的自定义查询。 | **可能失控** - LLM可能在实际需要时跳过搜索，或者在不必要时发出额外的搜索。 |
| **允许多次搜索** - LLM可以执行多个搜索来寻找答案。 |  |
{% endautogrid %}

示例：

```python
from langchain_core.tools import tool
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
# ================Agentic RAG===================

# 1.加载环境变量
from dotenv import load_dotenv
load_dotenv()

# 2.初始化模型
model = init_chat_model(
    "deepseek-flash",
    extra_body = {"thinking": {"type": "disabled"}}
)

# 3.定义工具
@tool
def retrieve_docs(query: str):
    """检索知识库，获取与用户提问相关的知识片段"""

    # 1.根据问题检索知识片段
    documents = vector_store.similarity_search(query)

    # 2.拼接知识片段
    context = "\n".join([doc.page_content for doc in documents])

    return context

# 4.定义Agent，绑定model和Tool
agent = create_agent(
    model,
    tools=[retrieve_docs],
    system_prompt="你是一个教资考试专家，回答与教资相关问题时，必须调用工具检索文档，根据文档回答用户的问题，不能自己编造答案。答案要简短，直接引用原文。"
)
```

测试，询问知识问题：

```python
# 测试
from langchain_core.messages import HumanMessage

response = agent.invoke(
    {"messages": [HumanMessage("论语中教育的目的是什么？")]} # 查询重写
)
for message in response['messages']:
    message.pretty_print()
```

输出：

```text
================================ Human Message =================================

论语中教育的目的是什么
================================== Ai Message ==================================
Tool Calls:
  retrieve_docs (call_00_DR796WqUSbaUH30KiWky4118)
 Call ID: call_00_DR796WqUSbaUH30KiWky4118
  Args:
    query: 论语 教育目的
================================= Tool Message =================================
Name: retrieve_docs

### （三）孔子及《论语》主要思想  
**教育作用**：庶、富、教；性相近，习相远。  
**教育对象**：“有教无类”，教育民主思想。  
**教育目的**：以完善人格为教育的首要目的，培养士和君子。  
**教学内容**：文、行、忠、义。  
**教学过程**：学、思、习、行。  
**教学原则**：因材施教、启发诱导、学思结合、谦虚笃实。  
**教师观**：其身正，不令而行；其身不正，虽令不从。

### （四）孟子主要思想  
**人性论**：人性本善，人先天具有仁、义、礼、智四个“善端”。  
**教育作用**：发扬善端，培养道德完人，得天下英才而教育之。  
**教学原则**：循序渐进，专心有恒。

### （五）荀子主要思想  
**人性论**：性恶论，化性起伪，善德是后天习得的，重视教育的作用。  
**教学原则**：学以致用，锲而不舍。
================================== Ai Message ==================================

根据文档记载，**《论语》中教育的目的是**：**以完善人格为教育的首要目的，培养士和君子。**
```

测试一下，仅问候：

```python
# 测试
from langchain_core.messages import HumanMessage

response = agent.invoke(
    {"messages": [HumanMessage("你好")]} # 查询重写
)
for message in response['messages']:
    message.pretty_print()
```

输出：

```python
================================ Human Message =================================

你好
================================== Ai Message ==================================

你好！我是教资考试助手，可以帮你解答教师资格证考试相关的问题，包括报考条件、考试科目、备考建议等。请问有什么可以帮你的？
```

Agentic RAG可以自主思考，只在必要的时候调用RAG 。
