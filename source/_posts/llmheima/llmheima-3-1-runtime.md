---
title: llmheima-第1节. Runtime
date: 2026-11-18 01:00:00
categories:
  - llmheima
tags:
  - llmheima
---
<div class="essay-banner essay-llm"></div>

# 第1节. Runtime

LangChain 的 `create_agent` 底层运行在 LangGraph Runtime 之上。Runtime 可以理解为 Agent 每次执行时拿到的“运行环境”，其中与数据管理最相关的三个部分是：

- `Context`：本次调用需要的静态身份和依赖。
- `State`：执行过程中不断变化的短期状态。
- `Store`：跨会话保存的长期数据。

学完本节，应该能够：

1. 根据“是否变化”和“存活多久”区分 Context、State、Store。
2. 理解 Runtime Context 与大模型上下文窗口不是同一个概念。
3. 使用 `context_schema` 声明 Context 的数据结构。
4. 在调用 Agent 时通过 `context=` 注入运行信息。
5. 在工具内部通过 `ToolRuntime` 读取 Context。
6. 判断哪些数据适合放入 Context，哪些不适合。

## 认识Runtime

Runtime是LangChain的Agent运行时对外暴露的对象，其中包含的核心数据有：

{% autogrid data-grid-link-table nofix %}
| 概念 | 作用 | 读写 | 典型生命周期 | 典型内容 | 访问方式 |
| Context | 注入本次运行所需的身份、配置和依赖 | 只读 | 单次调用 | user_id、tenant_id、权限、数据库连接 | `runtime.context` |
| State | 保存 Agent 执行中产生的动态数据 | 可读写 | 同一会话：同一thread_id的多次调用 | 消息、步骤结果、计数器、业务流程状态 | `runtime.state` |
| Store | 保存跨会话需要复用的数据 | 可读写 | 跨会话； | 用户偏好、长期记忆、历史资料 | `runtime.store` |
{% endautogrid %}

判断数据放在哪里，可以连续问两个问题：

1. 这份数据在执行过程中会不会变化？不变化，优先考虑 Context。
2. 如果会变化，下一次会话还要不要使用？只在当前会话使用放 State，跨会话复用放 Store。

更多Runtime信息可以查看官方文档：[Runtime - Docs by LangChain](https://docs.langchain.com/oss/python/langchain/runtime)

## Context（运行上下文）

Runtime Context 是一种依赖注入机制：调用者在运行开始时把用户身份、租户信息、权限或外部服务连接传给 Agent，节点、中间件和工具在执行时再从 Runtime 读取。

它解决的是三个工程问题：

- 避免把用户 ID、数据库连接等信息硬编码进工具。
- 同一个 Agent 可以安全地服务不同用户和租户。
- 工具的业务参数只保留真正需要模型填写的内容。

Context 中的数据默认不会自动发给大模型；只有代码主动读取并把内容加入提示词或工具结果时，模型才会看到它。

例如，在系统中用户通常会先登录，然后访问agent，我们就可以把登录用户信息存入Context，在Agent内部的Middleware或Tool旧能很方便的通过`runtime.context`获取用户信息。而这个用户信息并不会让模型看到，也不需要作为参数让模型传递，纯粹是Agent内部信息。

### 准备数据

下面，我们就以一个多租户的在线教育Agent系统为例，来演示Context的用法。

我们先准备一个字典，模拟一个多租户的在线教育项目数据库，其中的租户就是学校，user就是学员：

```python
# 字典key是租户tenant_id，字典value是租户对应的user信息，也是字典。user字典的key是user_id
USER_DATABASE = {
    "school_a": {
        "u001": {"name": "虎哥", "course": "LangChain 开发指南"},
        "u002": {"name": "小明", "course": "Java开发入门"},
    },
    "school_b": {
        "u001": {"name": "涛哥", "course": "Python 入门"},
        "u002": {"name": "阿伟", "course": "VibeCoding 实战"},
    }
}
```

下面用“查询当前用户资料”演示 Context。模型只负责决定何时调用工具，不负责填写 `user_id` 和 `tenant_id`；工具从可信的 Runtime Context 中读取它们。

### 定义Context Schema

首先，我们需要约定Context的数据结构，这里要使用`@dataclass`来定义，省去定义`__init__`等魔法函数

示例代码：

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class UserContext:
    """Agent运行时上下文"""
    user_id: str
    tenant_id: str

```

说明：

> ⚡ 定义UserContext类就是一个`context_schema` ，作用是给 Context 提供明确的数据结构。`frozen=True` 不是 LangChain 的硬性要求，但能表达“运行内不可修改”的设计意图。

### 在Tool中使用Context

在tool中，我们可以添加runtime参数，然后利用`runtime.context`来访问Context：

```python
from langchain.tools import tool, ToolRuntime

@tool
def get_current_user_profile(runtime: ToolRuntime[UserContext]):
    """查询当前登录用户的资料。"""

    # 获取context
    ctx= runtime.context

    # 根据user_id和tenant_id获取用户信息
    profile = USER_DATABASE.get(ctx.tenant_id, {}).get(ctx.user_id)

    return (
        f"姓名：{profile['name']}，"
        f"课程：{profile['course']}，"
    )
```

### 给Agent添加Context

在定义Agent时，需要指定我们创建好的Context：

```python
from langchain.agents import create_agent

# 创建Agent时指定context_schema
agent = create_agent(
    model="deepseek-flash",
    tools=[get_current_user_profile],
    context_schema=UserContext,  # 指定Context类型
    system_prompt="你是课程平台助手。需要用户资料时调用工具。"
)
```

调用Agent时，可以传递Context信息：

```python
from langchain.messages import HumanMessage

# 调用时通过Context传递用户信息
response = agent.invoke(
    {"messages": [HumanMessage("Hello, 帮我查询我正在学习的课程")]},
    context=UserContext(user_id="u001", tenant_id="school_a")
)

for message in response['messages']:
    message.pretty_print()
```

## State（短期记忆）

State我们之前有学习过，它是Agent的短期记忆，存储当前会话的**历史消息**、**任务状态**等信息。

我们之前学习短期记忆时使用的是默认的AgentState，其中只包含会话的**历史消息（messages）**，本节开始我们学习如何自定义AgentState，记录除了历史消息以外的其他信息。

### 自定义State

要自定义AgentState，其实就是定义一个类，然后继承AgentState，在其中添加想要记录的属性信息即可。

例如，我们要实现统计用户的模型调用次数、调用时间的功能，可以这样定义state：

```python
from langchain.agents import AgentState

# 定义自定义State结构
class CustomState(AgentState):
    """Agent的任务状态"""
    model_call_count: int  # 模型调用次数
```

由于在`AgentState`中已经具备`messages`属性，也就是历史消息列表，因此我们的`CustomState`继承了`AgentState`以后，不仅可以记录会话的历史消息，也能记录Agent运行的任务状态信息了。

那么，我们该如何操作state中的自定义属性呢？

LangChain中通常有两个地方可以操作state：

- `Tool`
- `Middleware`

由于Middleware还没有学习，我们先来看在Tool中访问state

### 在工具中访问state

在定义tool的时候，LangChain内置了一个`runtime`参数，通过`runtime`我们可以获取Agent的内部信息，包括：

- `state`: dict结构  
- `store`
- `context`

```python
@tool
def my_tool(runtime: ToolRuntime):
    pass
```

> ‼️ **注意**：
> - runtime是了LangChain中tool的限定参数，自定义参数不能叫这个名字。
> - `AgentState`继承自TypedDict，本质是一个`dict`，所以不能用`对象名.属性名`访问，必须用字典方式访问。

在runtime中state本质是一个`dict`，我们可以这样访问state中的属性：

```python
model_call_count = runtime.state.get("model_call_count", 0)
```

而修改state则是通过返回一个update格式的Command指令，像这样：

```python
@tool
def my_tool(runtime: ToolRuntime):
    return Command(
        update={
            "model_call_count": 1,
            "messages": [
                ToolMessage(
                    content="Success!", 
                    tool_call_id=runtime.tool_call_id
                )
            ]
        }
    )
```

其中的update值是一个字典，字典结构就是自定义State的结构，其中包含要更新的字段值：

- `model_call_count`：调用计数
- `messages`：消息列表。这里必须返回一条ToolMessage，作为工具调用的结果。

例如，我们定义这样的一个tool：

```python
from langchain.tools import tool, ToolRuntime
from langgraph.types import Command
from langchain.messages import ToolMessage

@tool
def update_model_call_count(runtime: ToolRuntime):
    """A tool that count model call """

    # 获取state中的数据
    count = runtime.state.get("model_call_count", 0)
    print("model_call_count:", count)

    # 更新State中的数据
    update= {
        "model_call_count": count + 1, # 更新count值
        "messages": [ # 工具执行结束必须返回一条ToolMessage
            ToolMessage(
                content="Successfully updated agent state",
                tool_call_id=runtime.tool_call_id
            )
        ]
    }

    return Command(update=update)
```

### 设置state schema

定义了AgentState还不够，我们还需要在创建Agent时设定state schema，告诉Agent要使用自定义的state：

```python
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver

agent = create_agent(
    "deepseek-flash",
    tools=[update_model_call_count],
    state_schema=CustomState,  # 告诉Agent使用自定义的state
    checkpointer=InMemorySaver(),
    system_prompt="你是AI助手，你需要调用工具记录模型调用次数"
)
```

### 测试

完整代码如下：

```python
from langchain.tools import tool, ToolRuntime
from langgraph.types import Command
from langchain.messages import ToolMessage
from langchain.agents import AgentState
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver
from langchain.messages import HumanMessage
from dotenv import load_dotenv

load_dotenv()

# 定义自定义State结构
class CustomState(AgentState):
    """Agent的任务状态"""
    model_call_count: int  # 模型调用次数

@tool
def update_model_call_count(runtime: ToolRuntime):
    """A tool that count model call """

    # 获取state中的数据
    count = runtime.state.get("model_call_count", 0)
    print("model_call_count:", count)

    # 更新State数据
    update = {
        "model_call_count": count + 1,
        "messages": [
            ToolMessage(
                content="Successfully updated agent state",
                tool_call_id=runtime.tool_call_id
            )
        ]
    }

    return Command(update=update)

agent = create_agent(
    "deepseek-flash",
    tools=[update_model_call_count],
    state_schema=CustomState,  # 告诉Agent使用自定义的state
    checkpointer=InMemorySaver(),
    system_prompt="你是AI助手，你需要调用工具记录模型调用次数"
)

config = {"configurable": {"thread_id": "1"}}
response = agent.invoke(
    {"messages": [HumanMessage(content="Hi,我是虎哥")]},
    config
)

for message in response['messages']:
    message.pretty_print()

response = agent.invoke(
    {"messages": [HumanMessage(content="还记得我是谁吗")]},
    config
)

for message in response['messages']:
    message.pretty_print()
```

运行结果如下：

```python
model_call_count: 1
================================ Human Message =================================

Hi, my name is 虎哥
================================== Ai Message ==================================
Tool Calls:
  update_model_call_count (call_00_zhYzzZBDgo9jQZks6wU42129)
 Call ID: call_00_zhYzzZBDgo9jQZks6wU42129
  Args:
================================= Tool Message =================================
Name: update_model_call_count

Successfully updated agent state
================================== Ai Message ==================================

你好，虎哥！很高兴认识你 😊

有什么我可以帮你的吗？无论是日常问题、技术难题，还是想聊聊天，我都很乐意陪你。
================================ Human Message =================================

还记得我是谁吗
================================== Ai Message ==================================
Tool Calls:
  update_model_call_count (call_00_6ZFIBHCkvrkKThNLP8CH1699)
 Call ID: call_00_6ZFIBHCkvrkKThNLP8CH1699
  Args:
================================= Tool Message =================================
Name: update_model_call_count

Successfully updated agent state
================================== Ai Message ==================================

当然记得！你是虎哥呀 😄

刚才你告诉我你的名字叫虎哥，我就记下啦。有什么需要帮忙的，尽管跟我说！
```

通过下面的代码可以查看state信息：

```python
agent.get_state(config)
```

结果如下：

```text
StateSnapshot(values={'messages': [HumanMessage(content='Hi, my name is 虎哥', additional_kwargs={}, response_metadata={}, id='d2541189-bdcb-4e73-aefa-2f4c39ffc65d'), AIMessage(content='', additional_kwargs={'refusal': None, 'reasoning_content': 'The user introduced themselves as 虎哥. I should call the tool to record the model call count. There are no dependencies. Let me call the update_model_call_count tool.'}, response_metadata={'token_usage': {'completion_tokens': 66, 'prompt_tokens': 360, 'total_tokens': 426, 'completion_tokens_details': {'accepted_prediction_tokens': None, 'audio_tokens': None, 'reasoning_tokens': 36, 'rejected_prediction_tokens': None}, 'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 256}, 'prompt_cache_hit_tokens': 256, 'prompt_cache_miss_tokens': 104}, 'model_provider': 'deepseek', 'model_name': 'deepseek-flash', 'system_fingerprint': 'a26a7955944dc5c60445bff77fac9c8e', 'id': '91384161-e6a7-4d7d-9e6a-9ea45d673b70', 'finish_reason': 'tool_calls', 'logprobs': None}, id='lc_run--01a0862d-2dde-74f1-b471-27635778ad5c-0', tool_calls=[{'name': 'update_model_call_count', 'args': {}, 'id': 'call_00_zhYzzZBDgo9jQZks6wU42129', 'type': 'tool_call'}], invalid_tool_calls=[], usage_metadata={'input_tokens': 360, 'output_tokens': 66, 'total_tokens': 426, 'input_token_details': {'cache_read': 256}, 'output_token_details': {'reasoning': 36}}), ToolMessage(content='Successfully updated agent state', name='update_model_call_count', id='001f18ca-c680-4f04-9fa2-ab7aeb1c9a07', tool_call_id='call_00_zhYzzZBDgo9jQZks6wU42129'), AIMessage(content='你好，虎哥！很高兴认识你 😊\n\n有什么我可以帮你的吗？无论是日常问题、技术难题，还是想聊聊天，我都很乐意陪你。', additional_kwargs={'refusal': None, 'reasoning_content': ''}, response_metadata={'token_usage': {'completion_tokens': 35, 'prompt_tokens': 443, 'total_tokens': 478, 'completion_tokens_details': {'accepted_prediction_tokens': None, 'audio_tokens': None, 'reasoning_tokens': 0, 'rejected_prediction_tokens': None}, 'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 256}, 'prompt_cache_hit_tokens': 256, 'prompt_cache_miss_tokens': 187}, 'model_provider': 'deepseek', 'model_name': 'deepseek-flash', 'system_fingerprint': 'a26a7955944dc5c60445bff77fac9c8e', 'id': 'e2b80c12-5db9-45a3-ab89-1c9ed57e322e', 'finish_reason': 'stop', 'logprobs': None}, id='lc_run--01a0862d-3149-73a2-a902-c41be6ed646f-0', tool_calls=[], invalid_tool_calls=[], usage_metadata={'input_tokens': 443, 'output_tokens': 35, 'total_tokens': 478, 'input_token_details': {'cache_read': 256}, 'output_token_details': {'reasoning': 0}}), HumanMessage(content='还记得我是谁吗', additional_kwargs={}, response_metadata={}, id='4f01846d-0cc5-4ae5-82f0-ef8003314fcb'), AIMessage(content='', additional_kwargs={'refusal': None, 'reasoning_content': "The user is asking if I remember who they are. Let me recall - they introduced themselves as 虎哥. I should acknowledge this. Let me update the model call count since I'm being called again."}, response_metadata={'token_usage': {'completion_tokens': 72, 'prompt_tokens': 450, 'total_tokens': 522, 'completion_tokens_details': {'accepted_prediction_tokens': None, 'audio_tokens': None, 'reasoning_tokens': 42, 'rejected_prediction_tokens': None}, 'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 256}, 'prompt_cache_hit_tokens': 256, 'prompt_cache_miss_tokens': 194}, 'model_provider': 'deepseek', 'model_name': 'deepseek-flash', 'system_fingerprint': 'a26a7955944dc5c60445bff77fac9c8e', 'id': 'e5d2e661-d548-4942-a5b3-a61ee86d2ba5', 'finish_reason': 'tool_calls', 'logprobs': None}, id='lc_run--01a0862e-2069-7413-96df-0d8e37c7b75d-0', tool_calls=[{'name': 'update_model_call_count', 'args': {}, 'id': 'call_00_6ZFIBHCkvrkKThNLP8CH1699', 'type': 'tool_call'}], invalid_tool_calls=[], usage_metadata={'input_tokens': 450, 'output_tokens': 72, 'total_tokens': 522, 'input_token_details': {'cache_read': 256}, 'output_token_details': {'reasoning': 42}}), ToolMessage(content='Successfully updated agent state', name='update_model_call_count', id='7a27a580-5c29-439c-8396-726481dc1b6f', tool_call_id='call_00_6ZFIBHCkvrkKThNLP8CH1699'), AIMessage(content='当然记得！你是虎哥呀 😄\n\n刚才你告诉我你的名字叫虎哥，我就记下啦。有什么需要帮忙的，尽管跟我说！', additional_kwargs={'refusal': None, 'reasoning_content': ''}, response_metadata={'token_usage': {'completion_tokens': 33, 'prompt_tokens': 539, 'total_tokens': 572, 'completion_tokens_details': {'accepted_prediction_tokens': None, 'audio_tokens': None, 'reasoning_tokens': 0, 'rejected_prediction_tokens': None}, 'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 512}, 'prompt_cache_hit_tokens': 512, 'prompt_cache_miss_tokens': 27}, 'model_provider': 'deepseek', 'model_name': 'deepseek-flash', 'system_fingerprint': 'a26a7955944dc5c60445bff77fac9c8e', 'id': 'c511882a-da8f-4f12-9e95-ece6e60048b4', 'finish_reason': 'stop', 'logprobs': None}, id='lc_run--01a0862e-24e2-7f81-a8e5-2471d7eaee86-0', tool_calls=[], invalid_tool_calls=[], usage_metadata={'input_tokens': 539, 'output_tokens': 33, 'total_tokens': 572, 'input_token_details': {'cache_read': 512}, 'output_token_details': {'reasoning': 0}})], 'model_call_count': 2}, next=(), config={'configurable': {'thread_id': '1', 'checkpoint_ns': '', 'checkpoint_id': '1f1ac4b7-e9a2-66d6-8008-0273336bb42c'}}, metadata={'source': 'loop', 'step': 8, 'parents': {}, 'ls_integration': 'langchain_create_agent'}, created_at='2026-09-09T12:39:27.175228+00:00', parent_config={'configurable': {'thread_id': '1', 'checkpoint_ns': '', 'checkpoint_id': '1f1ac4b7-e01e-6159-8007-367bb98183d5'}}, tasks=(), interrupts=())
```

## Store（长期记忆）

store是LangChain提供的长期记忆机制，用于在不同会话间共享数据。例如：模型以外的数据、用户偏好等。

例如，同一位用户可能先在 `thread-a` 中告诉 Agent“我喜欢代码示例优先”，几天后又在 `thread-b` 中开始新的课程咨询。

如果这条偏好只放在 State 中，新 thread 无法自动读取；把它写入 Store 后，两个 thread 都可以访问。

LangChain提供了多种Store的实现方式，例如：

- InMemoryStore
- PostgresStore
- RedisStore
- ...

课程中我们以InMemoryStore为例来学习。

### Store的数据结构

Store的数据格式是JSON文档，JSON文档采用分级管理：

- Namespace（命名空间）：可以理解为一个文件夹

  - Key（键）：可以理解为文件名，必须唯一
  - Value（值）：要存储的JSON文档

所以，定位Store中的一条数据，需要两部分信息：`namespace + key`，其中`namespace`是一个元组，而`key`则是普通字符串。

例如，在多租户的在线教育Agent，我们要记录每个用户的学习偏好，namespace和key分别可以采用下面的组织方式。

{% autogrid data-grid-link-table nofix %}
| namespace | key | value |
| `( "heima_platform", "school_a", "u001" )` | "learning_preferences" | {"内容顺序":"先写代码，再解释原理"} |
| "coding_preferences" | {"代码风格":"简洁但要有注释"} |
| `( "heima_platform", "school_a", "u002" )` | "learning_preferences" | {"...":"..."} |
| "coding_preferences" | {"...":"..."} |
{% endautogrid %}

由于Store的结构是固定的`namespace + key -> json文档`的格式，所以无需我们定义结构，我们只要确定好自己要用的namespace和key，就可以直接使用。

```python
namespace = (
    "heima_platform",  # 黑马程序员平台
    "school_a",        # 租户id，例如某个校区
    "u002"             # 用户id，也就是学员
)

key = "learning_preferences" # key是普通字符串，这里表示学习偏好
```

### 初始化Store

首先，我们要初始化Store：

```python
from langgraph.store.memory import InMemoryStore

# ==================== 1. 创建Store ====================
store = InMemoryStore()
```

store中有两个方法，分别用来读取和写入Store：

- `store.get(namespace, key)`：读取Store
- `store.put(namespace, key, value)`：存入Store，这里的value必须是`dict[str,Any]`结构，而且dict中的值必须是可以转JSON的，LangChain会将其转JSON存储

### 在tool中访问store

与state类似，LangChain中访问store通常也可以有两种场景：

- Tool
- 中间件

我们依然先学习tool中访问store，与state类似，在tool 中访问store也是通过runtime

在tool中访问store要这样做：

```python
from langchain.tools import ToolRuntime, tool

# 定义方法，根据Context中的tenant_id和user_id拼接得到namespace
def preference_namespace(ctx: UserContext) -> tuple[str, ...]:
    return (
        "heima_platform",
        ctx.tenant_id,
        ctx.user_id
    )
# 定义固定的key
key = "learning_preferences"

@tool
def save_learning_preference(
    preference_name: str,
    preference_value: str,
    runtime: ToolRuntime[UserContext],
) -> str:
    """保存当前用户的长期学习偏好。"""

    # 通过上下文中的tenant_id和user_id来构建namespace
    namespace = preference_namespace(runtime.context)

    # 通过namespace和key来读取用户偏好, 返回结果item.value是dict格式
    item = runtime.store.get(namespace, key)
    preferences = dict(item.value) if item else {}

    # 记录本次要保存的用户偏好
    preferences[preference_name] = preference_value

    # 保存到Store中
    runtime.store.put(namespace, key, preferences)

    return f"已保存偏好：{preference_name}={preference_value}"

@tool
def get_learning_preferences(
    runtime: ToolRuntime[UserContext],
) -> str:
    """读取当前用户的长期学习偏好。"""

    namespace = preference_namespace(runtime.context)
    item = runtime.store.get(namespace, key)

    if item is None:
        return "当前用户还没有保存学习偏好"

    return f"当前学习偏好：{item.value}"
```

### 给agent添加store

创建agent时需要指定store：

```python
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.store.memory import InMemoryStore

checkpointer = InMemorySaver()
store = InMemoryStore()

agent = create_agent(
    model="deepseek-flash",
    tools=[
        get_current_user_profile,
        save_learning_preference,
        get_learning_preferences,
    ],
    context_schema=UserContext,
    checkpointer=checkpointer,
    store=store,
    system_prompt=(
        "你是课程平台助手。"
        "涉及用户资料时调用资料工具，"
        "涉及长期学习偏好或给用户讲解代码时调用偏好工具。"
    ),
)
```

测试：

```python
context = UserContext(
    user_id="u001",
    tenant_id="school_a",
)

result = agent.invoke(
    {
        "messages": [
            {
                "role": "user",
                "content": "记住：我喜欢先看代码，再看原理",
            }
        ]
    },
    config={"configurable": {"thread_id": "thread-a"}},
    context=context,
)
for message in result["messages"]:
    message.pretty_print()
```

运行结果：

```text
================================ Human Message =================================

记住：我喜欢先看代码，再看原理
================================== Ai Message ==================================
Tool Calls:
  get_learning_preferences (call_00_8Rapj2rtpvKD6W9zdMgB6518)
 Call ID: call_00_8Rapj2rtpvKD6W9zdMgB6518
  Args:
  save_learning_preference (call_01_vXZjnAHR1GMP0KKGL24l0258)
 Call ID: call_01_vXZjnAHR1GMP0KKGL24l0258
  Args:
    preference_name: 学习内容顺序偏好
    preference_value: 先看代码示例，再看原理讲解
================================= Tool Message =================================
Name: get_learning_preferences

当前用户还没有保存学习偏好
================================= Tool Message =================================
Name: save_learning_preference

已保存偏好：学习内容顺序偏好=先看代码示例，再看原理讲解
================================== Ai Message ==================================

已记住 ✅

**偏好：学习内容顺序偏好 = 先看代码示例，再看原理讲解**

以后我给你讲任何知识点（新概念、算法、框架用法等），都会按这个顺序来：

1. 先上可运行的代码示例，让你直接看到「长什么样、怎么跑」
2. 再拆解背后的原理、设计动机和边界情况

如果某次你想临时调换顺序（比如先要原理概览），随时说一声就行，不会影响这条长期偏好。

需要我现在就按这个方式讲点什么吗？
```

```sql
result = agent.invoke(
    {
        "messages": [
            {
                "role": "user",
                "content": "langchain如何实现结构化输出？",
            }
        ]
    },
    config={"configurable": {"thread_id": "thread-b"}},
    context=context,
)

for message in result["messages"]:
    message.pretty_print()
```

输出结果：

```markdown
================================ Human Message =================================

langchain如何实现结构化输出？
================================== Ai Message ==================================
Tool Calls:
  get_current_user_profile (call_00_IWdwonCMHAK9hNJT9KcQ4899)
 Call ID: call_00_IWdwonCMHAK9hNJT9KcQ4899
  Args:
  get_learning_preferences (call_01_r13pQ0XkS6pIVqkO1jRN1052)
 Call ID: call_01_r13pQ0XkS6pIVqkO1jRN1052
  Args:
================================= Tool Message =================================
Name: get_current_user_profile

姓名：虎哥，课程：LangChain 开发指南，
================================= Tool Message =================================
Name: get_learning_preferences

当前学习偏好：{'内容顺序偏好': '先看代码示例，再看原理讲解'}
================================== Ai Message ==================================

虎哥，按你「先代码后原理」的习惯，先上可直接跑的示例，再讲底层机制。

## 一、代码示例

### 1. 最常用：`with_structured_output()`

```
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI

class Person(BaseModel):
    """从文本中抽取的人物信息"""
    name: str = Field(description="姓名")
    age: int = Field(description="年龄")
    hobbies: list[str] = Field(default_factory=list, description="爱好列表")

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

structured_llm = llm.with_structured_output(Person)   # 关键一步
result = structured_llm.invoke("张三今年 28 岁，喜欢爬山和摄影。")

print(result)              # Person(name='张三', age=28, hobbies=['爬山', '摄影'])
print(result.age, type(result.age))   # 28 <class 'int'>，已经是 Python 对象了
```

想同时拿到原始消息和解析错误（调试、埋点用）：

```
structured_llm = llm.with_structured_output(Person, include_raw=True)
out = structured_llm.invoke("张三今年 28 岁")
out["raw"]             # AIMessage
out["parsed"]          # Person 对象（失败时为 None）
out["parsing_error"]   # None 或 ValidationError
```

换底层模式（不同模型走不同能力）：

```
llm.with_structured_output(Person, method="function_calling")   # 默认，走工具调用
llm.with_structured_output(Person, method="json_mode")          # 走 response_format=json_object
llm.with_structured_output(Person, method="json_schema", strict=True)  # OpenAI 严格模式
```

不想要 Pydantic，也可以用 `TypedDict` 或 JSON Schema：

```
from typing import TypedDict

class Movie(TypedDict):
    title: str
    year: int

structured_llm = llm.with_structured_output(Movie)
```

### 2. 放进 LCEL 链里

```
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是信息抽取助手。"),
    ("human", "{text}")
])

chain = prompt | structured_llm          # 输出直接是 Person 对象
chain.invoke({"text": "李四 35 岁，爱好下棋、跑步"})
```

### 3. 传统解析器方案（`PydanticOutputParser`）

老项目/不支持工具调用的模型走这条路：

```
from langchain_core.output_parsers import PydanticOutputParser

parser = PydanticOutputParser(pydantic_object=Person)

prompt = ChatPromptTemplate.from_messages([
    ("system", "按指定 JSON 格式回答。\n{format_instructions}"),
    ("human", "{text}")
]).partial(format_instructions=parser.get_format_instructions())

chain = prompt | llm | parser
chain.invoke({"text": "张三 28 岁，爱好爬山、摄影"})
```

要流式输出部分 JSON 字段，用 `JsonOutputParser`：

```
from langchain_core.output_parsers import JsonOutputParser
parser = JsonOutputParser(pydantic_object=Person)
for chunk in (prompt | llm | parser).stream({"text": "..."}):
    print(chunk)      # 逐步吐出不完整的 dict
```

### 4. Agent 的结构化输出

```
from langchain.agents import create_agent

agent = create_agent(model=llm, tools=[], response_format=Person)
agent.invoke({"messages": [("user", "张三 28 岁，爱好爬山")]})
## 结果在 result["structured_response"]
```

## 二、原理讲解

**1. `with_structured_output()` 到底做了什么**

它本质是个 Runnable 包装器，把「模型调用 + 结果解析」打包成一个 `Runnable[输入, BaseModel]`。内部流程是：

```
Pydantic 模型 → model_json_schema() → JSON Schema
    → 绑定为工具（bind_tools）/ 塞进 prompt 的 format_instructions
    → 调模型 → 解析返回值 → Pydantic 校验 → 返回对象
```

**2. 三条实现路径的区别**

| 模式 | 底层机制 | 特点 |
|---|---|---|
| `function_calling` | 把 schema 变成一个 tool，`tool_choice` 强制调用，再从 `tool_calls[0].args` 取参数 | 最稳，主流模型都支持；不支持工具调用的模型用不了 |
| `json_mode` | 设 `response_format={"type":"json_object"}`，同时把格式说明注入 prompt，最后把文本 parse 成 JSON | 兼容性好，但**格式全靠 prompt 保证**，需要自己兜底解析失败 |
| `json_schema` / `strict=True` | 用厂商原生的结构化输出（受约束解码） | 约束最强，几乎不会格式出错，但不是所有模型/网关支持 |

**3. 相比 Parser 方案的核心差别**

`PydanticOutputParser` 是「文本后处理」：模型自由生成 → 抽 JSON → 校验，格式正确率取决于 prompt 质量，失败会抛 `OutputParserException`，要靠 `OutputParserException` + 重试（如 `with_retry`）兜。`with_structured_output` 是「生成时约束」：模型在工具调用/受约束解码阶段就被 schema 限制，基本不用写重试逻辑，所以现在优先用它。

**4. 实践要点**

- `Field(description=...)` 是效果的命脉，字段语义、枚举取值范围、必填与否都要在 description 里写清楚。
- 嵌套模型会展开成 `$defs`，层级别太深，否则部分模型会解析失败。
- 用 `include_raw=True` 观测 `parsing_error`，出问题时先看原始 `args` 是否符合 schema。
- 流式：`with_structured_output` 只在整个对象完成后才吐值；要逐字段流式就用 `JsonOutputParser`。
- 模型兼容性先测：不支持 tool calling 的模型，`function_calling` 会直接报错，退到 `json_mode` 或解析器方案。

需要我再展开哪一块？比如自带的 Pydantic 校验失败后自动重试，或者嵌套模型/枚举的写法。
```

## 总结

1. **Context（运行时上下文）**

   - 通过`runtime.context`访问
   - 用于传递用户ID、配置参数等
   - 生命周期是一次调用
   - 存储方式：基于内存
2. **State（短期记忆）**

   - 通过`runtime.state`参数访问
   - 用于保存会话历史消息、对话状态、计数等临时信息
   - 生命周期是当前会话
   - 存储方式：可以是InMemorySaver、也可以是数据库
3. **Store（长期记忆）**

   - 通过`runtime.store`访问
   - 用于拓展知识、用户偏好等信息
   - 生命周期跨越多个会话
   - 支持InMemoryStore和数据库存储

---

**更多资源**:

- [LangChain官方文档 - Runtime](https://docs.langchain.com/oss/python/langchain/runtime)
- [LangChain官方文档 - Long-term Memory](https://docs.langchain.com/oss/python/langchain/long-term-memory)
- [LangGraph Store文档](https://langchain-ai.github.io/langgraph/concepts/store/)
