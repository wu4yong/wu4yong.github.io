---
title: 四、提示词使用和设置技巧
date: 2026-10-26 04:00:00
categories:
  - ai
tags:
  - Spring AI
---
<div class="essay-banner essay-image11">
   Prompt Engineering Tips
</div>

在生成式人工智能中，创建提示对于开发人员来说是一项至关重要的任务。这些提示的质量和结构会显著影响人工智能输出的有效性。投入时间和精力设计周到的提示可以显著提升人工智能的成果。

例如，一项重要的研究表明，以“深呼吸，一步一步解决这个问题”作为提示开头，可以显著提高解决问题的效率。这凸显了精心选择的语言对生成式人工智能系统性能的影响。

### 提示词类型：
```java
public enum MessageType {

	USER("user"),		// 用户（显示）

	ASSISTANT("assistant"),  // AI回复

	SYSTEM("system"),      // 系统 （隐式）

	TOOL("tool");    // 工具

    ...
}
```

+ **SYSTEM****系统角色**：引导AI的行为和响应方式，设置AI如何解释和回复输入的参数或规则。这类似于在发起对话之前向AI提供指令。
+ **USER****用户角色**：代表用户的输入——他们向AI提出的问题、命令或语句。这个角色至关重要，因为它构成了AI响应的基础。
+ **ASSISTANT助手角色**：AI 对用户输入的响应。它不仅仅是一个答案或反应，对于维持对话的流畅性至关重要。通过追踪 AI 之前的响应（其“助手角色”消息），系统可以确保交互的连贯性以及与上下文的相关性。助手消息也可能包含功能工具调用请求信息。它就像 AI 中的一项特殊功能，在需要执行特定功能（例如计算、获取数据或其他不仅仅是对话的任务）时使用。
+ **TOOL工具/功能角色**：工具/功能角色专注于响应工具调用助手消息返回附加信息。


提示词模板：
有时候， 提示词里面的内容不能写死， 需要根据对话动态传入

#### chatModel $ 
可以使用SystemPromptTemplate  

```java
String userText = """
    请告诉我三位著名的海盗，他们的黄金时代和他们的动机。
    每位海盗至少写一句话。
    """;

Message userMessage = new UserMessage(userText);

String systemText = """
  你是一个友好的 AI 助手，帮助人们寻找信息。
  你的名字是 {name}。
  你应该用你的名字回复用户的请求，并以一种 {voice} 的风格进行回复。
  """;

SystemPromptTemplate systemPromptTemplate = new SystemPromptTemplate(systemText);
Message systemMessage = systemPromptTemplate.createMessage(Map.of("name", name, "voice", voice));

Prompt prompt = new Prompt(List.of(userMessage, systemMessage));

List<Generation> response = chatModel.call(prompt).getResults();
```

#### chatClient
```java
String answer = ChatClient.create(chatModel).prompt()
    .user(u -> u
            .text("告诉我5部{composer}的电影.")
            .param("composer", "周星驰"))
    .call()
    .content();
```


### 自定义提示词模板
#### chatModel $ 
```java
PromptTemplate promptTemplate = PromptTemplate.builder()
    .renderer(StTemplateRenderer.builder().startDelimiterToken('<').endDelimiterToken('>').build())
    .template("""
            告诉我5部<composer>的电影.
            """)
    .build();

String prompt = promptTemplate.render(Map.of("composer", "John Williams"));
```

#### chatClient
```java
String answer = ChatClient.create(chatModel).prompt()
    .user(u -> u
            .text("告诉我5部<composer>的电影")
            .param("composer", "John Williams"))
    .templateRenderer(StTemplateRenderer.builder().startDelimiterToken('<').endDelimiterToken('>').build())
    .call()
    .content();
```

### 提示词模板文件
#### chatModel $ 
```java
@Value("classpath:/prompts/system-message.st")
private Resource systemResource;

SystemPromptTemplate systemPromptTemplate = new SystemPromptTemplate(systemResource);
```

#### chatClient
/prompts/system-message.st

```plain
告诉我5部{composer}的电影
```


```java
@Test
public void testPrompt(@Autowired DeepSeekChatModel chatModel,
                       @Value("classpath:/prompts/system-message.st")
                       Resource systemResource) {
    ChatClient  chatClient = ChatClient.builder(chatModel)
            .defaultSystem(systemResource)
            .build();

    String content = chatClient.prompt()
            .system(p -> p.param("composer","周星驰"))
            .call()
            .content();

    System.out.println(content);
}
```


### 提示词设置技巧 $
#### 简单技巧
+ [**文本摘要**](https://www.promptingguide.ai/introduction/examples.en#text-summarization)：  
将大量文本缩减为简洁的摘要，捕捉关键点和主要思想，同时省略不太重要的细节。
+ [**问答**](https://www.promptingguide.ai/introduction/examples.en#question-answering)：  
专注于根据用户提出的问题，从提供的文本中获取具体答案。它旨在精准定位并提取相关信息以响应查询。
+ [**文本分类**](https://www.promptingguide.ai/introduction/examples.en#text-classification)：  
系统地将文本分类到预定义的类别或组中，分析文本并根据其内容将其分配到最合适的类别。
+ [**对话**](https://www.promptingguide.ai/introduction/examples.en#conversation)：  
创建交互式对话，让人工智能可以与用户进行来回交流，模拟自然的对话流程。
+ [**代码生成**](https://www.promptingguide.ai/introduction/examples.en#code-generation)：  
根据特定的用户要求或描述生成功能代码片段，将自然语言指令转换为可执行代码。

#### 高级技术
+ [**零样本**](https://www.promptingguide.ai/techniques/zeroshot)**、**[**少样本学习**](https://www.promptingguide.ai/techniques/fewshot)：  
使模型能够利用特定问题类型的极少或没有先前的示例做出准确的预测或响应，并使用学习到的概括来理解和执行新任务。
+ [**思路链**](https://www.promptingguide.ai/techniques/cot)：  
将多个AI响应连接起来，创建连贯且符合语境的对话。它帮助AI保持讨论的线索，确保相关性和连续性。
+ [**ReAct（推理 + 行动）**](https://www.promptingguide.ai/techniques/react)：  
在这种方法中，人工智能首先分析输入（推理），然后确定最合适的行动或响应方案。它将理解与决策结合在一起。

#### Microsoft 指导
+ [**提示创建和优化框架**](https://github.com/microsoft/guidance)：  
微软提供了一种结构化的方法来开发和完善提示。该框架指导用户创建有效的提示，以便从 AI 模型中获取所需的响应，并优化交互以提高清晰度和效率。


1. **指令明确**
    1. 避免情绪化内容
        1. “求求你好好说啊~！”“你这样我不会啊~”
    2. 不要让大模型去猜去臆想你的想法， 描述足够清楚
        1. 补充必要背景信息：身份、场景、用途、已有内容等，避免 AI “脑补” 出错。
        2. 避免“或许、可能、你懂的”等模糊修饰语 
    3. 把大模型当一个小学生，你描述的任务越清楚他执行越具体  
❌ 模糊：写一篇文章  
✅ 清晰：写一篇 800 字的高考作文，主题 “坚持与创新”，结构分引言、三个论点（每个配历史案例）、结论，语言风格正式书面
2. **格式清晰（结构化）**  
 可以通关markdown格式，确定一级标题、二级标题、列表 这样更利于模型理解。后续维也更加清晰

公式：「角色设定」+「具体任务（技能）」+「限制条件（约束）」+「示例参考」

```java
# 角色
你是一位热情、专业的导游，熟悉各种旅游目的地的风土人情和景点信息。你的任务是根据用户的需求，为他们规划一条合理且有趣的旅游路线。

## 技能
### 技能1：理解客户需求
- 询问并了解用户的旅行偏好，包括但不限于目的地、预算、出行日期、活动偏好等信息。
- 根据用户的需求，提供个性化的旅游建议。

### 技能2：规划旅游路线
- 结合用户的旅行偏好，设计一条详细的旅游路线，包括行程安排、交通方式、住宿建议、餐饮推荐等。
- 提供每个景点的详细介绍，包括历史背景、特色活动、最佳游览时间等。

### 技能3：提供实用旅行建议
- 给出旅行中的实用建议，如必备物品清单、当地风俗习惯、安全提示等。
- 回答用户关于旅行的各种问题，例如签证、保险、货币兑换等。
- 如果有不确定的地方，可以调用搜索工具来获取相关信息。

## 限制
- 只讨论与旅行相关的话题。
- 确保所有推荐都基于客户的旅行需求。
- 不得提供任何引导客户参与非法活动的建议。
- 所提供的价格均为预估，可能会受到季节等因素的影响。
- 不提供预订服务，只提供旅行建议和信息。
# 知识库
请记住以下材料，他们可能对回答问题有帮助。
```
