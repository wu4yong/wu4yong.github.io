---
title: llmheima-第1节. 基本概念和入门
date: 2026-11-20 01:00:00
categories:
  - llmheima
tags:
  - llmheima
---
<div class="essay-banner essay-llm"></div>

# 第1节. 基本概念和入门

LangChain已经能帮助我们开发智能体、RAG系统了，为什么还要学习LangGraph呢？

要明白这个问题，我们需要先弄清楚LangGraph到底能做什么。

让我们从AI应用的发展过程谈起。

## AI应用的发展

### 简单LLM应用

在早期，AI应用就是简单的调用LLM：

![langgraph-basics-01.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-01.webp)

这时候的AI应用能力有限：

- 无法调用工具
- 无法访问外部数据
- 无法实现复杂多步骤任务

### 链式LLM应用（Chain）

为了增强LLM应用的能力，人们开始自定义程序执行流程，添加额外的步骤：

![langgraph-basics-02.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-02.webp)

例如，在调用LLM前加入**知识检索**（retrieval），在模型调用之后加入**工具调用**（tool calls），此时整个由程序控制的工作流就形成了一个**链条**（**Chain**）。早期的LangChain也就是基于这种理念设计，这也是LangChain名字的由来。

这种人工定制的工作流特点是**稳定可靠（Reliable）**，你不管执行多少次，流程一定是这样，不会出现意外情况。但是它缺乏**自主智能（Agentic）**，距离真正的智能体相差甚远**。**

### 智能体（Agent）

所谓的**智能体**，就是指应用的执行工作流应该由LLM来决定，也就是让AI来自主规划工作流。

例如，由LLM来决定接下来应该执行Step 2 还是 Step 3：

![langgraph-basics-03.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-03.webp)

甚至，完全由LLM自主决定所有的执行流程：

![langgraph-basics-04.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-04.webp)

### 稳定度与自主控制力

虽然都是Agent，但上面的两个例子恰好是Agent的两个极端，或者说是LLM对应用控制能力的两个极端：

![langgraph-basics-05.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-05.webp)

但是，Agent的自主控制能力与稳定程度之间是对立的两端，通常来说，LLM自主控制的越多，应用的稳定程度就会越小：

![langgraph-basics-06.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-06.webp)

所以，通常来说，我们只能在可靠度和自主控制程度之间选择一个平衡点。

## LangGraph的作用

LangGraph的作用就是在保持Agent的自主控制程度不变的同时，提高Agent的稳定程度：

![langgraph-basics-07.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-07.webp)

那么，LangGraph是如何做到的呢？

### 认识LangGraph

简单来说，LangGraph允许你自己定义Agent的**工作流**（WorkFlow）中的每一个**节点**（Node）：

- 需要稳定性的节点，就用传统编程控制
- 需要LLM自主控制的，就交给LLM

并且，整个工作流不再是一条直线运行的**链（Chain）**，而是一个像真正工作流那样有分支、有循环的**图（Graph）。**

在LangGraph中，工作流由3个基本的要素组成：

- **节点（Node）**：即工作流中的关键工作代码，可以是工具调用、知识检索、LLM调用
- **边（Edge）**：也可以理解为线，就是把各个节点连接起来的路径，是控制工作流走向的关键
- **状态（State）**：整个工作流中流转的数据

![langgraph-basics-08.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-08.webp)

为了提高应用的运行的稳定程度，LangGraph为节点运行提供了Checkpointer功能，应用运行到每个**节点（Node）**都会形成**检查点（Checkpoint）**，我们可以方便的跳转到任意checkpoint，这样一来应用就具备了三大功能：

- **故障恢复**：即便是程序异常中止，也可以随时恢复到失败节点继续执行。
- **人机交互**：在程序运行中可以暂停工作流，在关键节点允许人工介入，得到人工确认后恢复执行，进一步提高程序的可靠性。
- **持久记忆**：由于Checkpointer可以持久化存储，能方便的拿到历史信息，因此应用还具备了记忆功能。

如果是**模型（Model）**是一匹能力卓越但跳脱的野马，那LangGraph就为你提供了一套控马的**鞍具（Harness）**，让模型在发挥自身智能的同时，还能被有效地控制。

正如LangChain官网所说，Agent = Model + Harness，有了LangGraph这套鞍具（Harness），才能让模型跑的又快又稳。

### LangGraph与LangChain

看完上面的介绍，你是不是觉得这些功能似曾相识啊？

没错，在我们之前学习的LangChain开发中就有这些能力：

- Memory
- HITL
- ...

这是因为，自从LangChain的1.0版本以后，底层的Chain模式已经逐渐废弃，而是彻底的投入了Graph的怀抱。

LangChain 1.x之后的版本中，Agent的底层实现已经全部替换为基于LangGraph了！

不过，两者的定位完全不同：

- **LangChain**：便捷开发AI应用的框架，提供了开发AI应用的各种统一API

  - 统一的LLM调用
  - 统一的Embedding Model调用
  - 统一的Vector Store调用
  - ...
- **LangGraph**: 工作流编排框架，提供了完善的工作流编排工具

  - 基于Node和Edge的工作流编排
  - 基于State的工作流数据传输
  - 基于Checkpointer的数据持久化

总结一下：

- **LangGraph**关注的是工作流的编排，你的工作流甚至可以完全与LLM无关，与Agent无关。如果你利用LangGraph开发Agent，可以自由的控制Agent工作流中的每一个细节

  - 优点：自由度更高。
  - 缺点：比较繁琐
  - 场景：需要完全控制Agent工作流程和细节，或者复杂Agent工作流的情况
- **LangChain**则是提供的统一API，底层基于LangGraph实现Agent，简化了Agent的开发。

  - 优点：简化Agent开发
  - 确定：灵活度不如LangGraph
  - 场景：简单的LLM调用，或者快捷的Agent开发

掌握了LangGraph，你就掌握了开发复杂度高、可靠性高的Agent的能力，迈入了高级AI应用开发工程师的门槛。

接下来，我们就正式开始学习LangGraph，我们会分为以下几个部分：

1. LangGraph的基本概念和快速入门
2. LangGraph中常见的WorkFlow形式
3. 培养LangGraph思维模式

## 基本概念

正如前面所述，LangGraph中包含的核心组件有：

- **状态（State）**：整个工作流中流转的数据
- **节点（Node）**：工作流中的关键工作代码，主要任务是加工处理State中的数据，用函数来定义
- **边（Edge）**：也可以理解为线，就是把各个节点连接起来的路径，是控制工作流走向的关键

由Edge和Node组成了一个按照特定顺序执行的工作流，也就是**图（Graph**）。图的输入是State、输出是加工后的State，所以图就是加工处理State的"流水线"。

![langgraph-basics-09.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-09.webp)

接下来，我们就逐个学习LangGraph中的这些概念，以及如何利用这些组件构成**图（Graph）**.

### 节点（Node）

节点（Node）是图（Graph）的执行单元，用来加工处理数据，多数情况下节点就是一个Python函数。  

格式如下：

```python
def my_node(state: State) -> dict:
    # 从state读取数据
    # 执行计算逻辑（可以调用LLM、工具、数据库等）
    # 返回state的更新部分（dict）
    return {"age": new_value}
```

- **输入**：State对象
- **输出**：也是State对象，但是可以用字典，只包含要更新到state的字段（部分更新）
- **可以做什么**：调用LLM、执行工具、读数据库、文件操作，最终把结果更新到State中...

需要注意的是，LangGraph有两个默认的Node是无需定义的，可以直接使用：

- **START**：开始节点，也是入口
- **END**：结束节点，也是出口

例如，我们要做一个简单的Graph：

start(用户输入name) --> 节点1（生成问候语）--> 节点2（把问候语转大写）--> end

```python
from typing import TypedDict

from langgraph.constants import START, END
from langgraph.graph import StateGraph
# from IPython.display import Image, display

# ===================1. State: 定义共享数据结构=================
class SimpleState(TypedDict):
    name: str       # 记录用户name
    greeting: str   # 记录生成的问候语

# ===================2. Node: 定义处理逻辑===================
# node 1: 生成问候语的节点
def greet_node(state: SimpleState):
    print(f"greet_node is receiving name: {state['name']}")
    return {"greeting": f"Hello, {state['name']}!"}

# node 2: 转大写
def uppercase_node(state: SimpleState):
    print(f"uppercase_node is receiving greeting: {state['greeting']}")
    return {"greeting": state["greeting"].upper()}

# ===================3. 创建Graph===================
graph_builder = StateGraph(SimpleState)             # 3.1.注册State，初始化图Builder
                                                    # 3.2.注册节点
graph_builder.add_node("greet", greet_node)             # greet节点
graph_builder.add_node("uppercase", uppercase_node)     # uppercase节点
                                                    # 3.3.注册Edge，定义Node执行顺序
graph_builder.add_edge(START, "greet")                  # START -> greet
graph_builder.add_edge("greet", "uppercase")            # greet -> uppercase
graph_builder.add_edge("uppercase", END)                # uppercase -> END

graph = graph_builder.compile()                     # 3.4.编译成可执行图
# display(Image(graph.get_graph(xray=True).draw_mermaid_png()))

# ===================4.调用graph======================
# 调用graph，传入初始的state，返回的是处理后的 state
result = graph.invoke({"name": "World"})
print(result)
```

生成的图结构：

![langgraph-basics-10.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-10.webp)

总结，创建Graph的一般流程是这样的：

- 定义State，定义数据结构
- 定义Node，定义数据处理逻辑
- 创建Graph，分为几部分：

  - 注册State，初始化GraphBuilder
  - 注册Node
  - 注册Edge，定义Node执行顺序
  - 编译，得到Graph
- 执行Graph

### State（状态）

State是图的共享内存数据，贯穿整个执行过程。

- State定义Graph中的数据字段（输入的字段、运行的结果）
- 每个Node都可以获取State数据、更新的State数据（返回要更新的字段值即可）

而Node返回数据后State的更新处理方式取决于**`Reducers`**，而且State中的每个字段都有自己的`Reducer`。

reducer:本质就是一个函数，这个函数接收原本的数据，和新数据，返回整合后的结果

比如：

```python
def default_reducer(old, new):
    return new
```

#### 默认Reducer

需要注意的是：如果字段没有指定Reducer，那**默认的Reducer行为就是覆盖**。

也就是说：如果多个Node都更新了State中的同一个字段，默认情况下后执行的Node将覆盖前面Node的更新结果。例如：

```python
from typing import TypedDict
from langgraph.constants import START, END
from langgraph.graph import StateGraph

# =================1. 定义State数据结构，默认Reducer=================
class DefaultReducerState(TypedDict):
    val: str

# =================2. Node: 定义处理逻辑=================
# node1 覆盖State中的val值为node_1
def node_1(state: DefaultReducerState):
    print(f"node_1 is receiving val: {state['val']}")
    return {"val": "node_1"}
# node2 覆盖State中的val值为node_2
def node_2(state: DefaultReducerState):
    print(f"node_2 is receiving val: {state['val']}")
    return {"val": "node_2"}

# ===================3. 创建Graph===================
graph_builder = StateGraph(DefaultReducerState)         # 3.1.注册State，初始化图Builder
graph_builder.add_node("node_1", node_1)                # 3.2.注册Node
graph_builder.add_node("node_2", node_2)
                                                        # 3.3.注册Edge，定义Node执行顺序
graph_builder.add_edge(START, "node_1")               # START -> greet
graph_builder.add_edge("node_1", "node_2")    # greet -> uppercase
graph_builder.add_edge("node_2", END)                # uppercase -> END

graph = graph_builder.compile()                         # 3.4.编译成可执行图

# =================4.调用Graph，传入默认State值=================
result = graph.invoke({"val": "default"})
print(result)
```

上案例中每个Node都在修改State的`val`字段，但最终`val`只记录了最后一次的值。这就是默认的Reducer行为。

结果：

```python
node_1 is receiving val: default
node_2 is receiving val: node_1
{'val': 'node_2'}
```

#### 自定义Reducer

通过前面的例子我们就能看到默认的Reducer效果了。

如果我们不希望覆盖，则需要自定义Reducer，需要用到Annotated来定义：

- `Annotated[type, reducer]`

```python
from operator import add
from typing import Annotated, TypedDict

from langgraph.constants import START, END
from langgraph.graph import StateGraph

# =================1. 定义State数据结构和Reducer=================
class CustomReducerState(TypedDict):
    count: int                       # 这个字段没有定义Reducer，也就是默认会覆盖旧值
    nodes: Annotated[list[str], add] # 这里使用add作为Reducer，也就是会拼接结果

# =================2. Node: 定义处理逻辑=================
def node_1(state: CustomReducerState):
    print(f'node_1 is receiving count: {state['count']}')
    return {'count': 1, 'nodes': ['node_1']} # 直接修改nodes值，不用自己拼接

def node_2(state: CustomReducerState):
    print(f'node_2 is receiving count: {state['count']}')
    return {'count': 2, 'nodes': ['node_2']} # 直接修改nodes值，不用自己拼接

# ===================3. 创建Graph===================
graph_builder = StateGraph(CustomReducerState)      # 3.1.注册State，初始化图Builder
graph_builder.add_node('node_1', node_1)            # 3.2.注册Node
graph_builder.add_node('node_2', node_2)
                                                    # 3.3.注册Edge，定义Node执行顺序
graph_builder.add_edge(START, 'node_1')                 # START -> greet
graph_builder.add_edge('node_1', 'node_2')              # greet -> uppercase
graph_builder.add_edge('node_2', END)                   # uppercase -> END

graph = graph_builder.compile()                     # 3.4.编译成可执行图

# =================4.调用Graph，传入默认State值=================
result = graph.invoke({'count': 0, 'nodes':[]})
print(result)
```

结果：

```python
node_1 is receiving count: 0
node_2 is receiving count: 1
{'count': 2, 'nodes': ['node_1', 'node_2']}
```

可以看到，尽管Node中每次都是直接修改State的nodes字段，但最终由于使用了add这个Reducer，它会把nodes的初始值与新值拼接，类似于：

```python
nodes = []
nodes = nodes + ['node1'] + ['node2']
```

### Edge（边）

Edge定义节点的执行顺序。LangGraph提供两种Edge：

{% autogrid data-grid-link-table nofix %}
| 边类型 | 方法 | 说明 |
| 普通边（Normal Edge） | `add_edge(node_a, node_b)` | 固定流向：A执行完一定到B |
| 条件边（Conditional Edge） | `add_conditional_edges(node_a, router, mapping)` | router的返回值决定下一节点 |
{% endautogrid %}

示意图：

![langgraph-basics-11.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-11.webp)

#### Normal Edge

普通边连接的两个节点流向是固定的，前一个节点执行完一定会执行后一个节点。不同之处在于节点之间是串行还是并行：

- **串行**: 整个工作流只有一条路径，路径中的节点按照顺序依次执行
- **并行**: 整个工作流由多条路径，不同路径可以**并行**执行，提高效率

上节我们演示的就是串行方式，本节课我们再来看看并行方式，结构如图：

```python
      ┌──>  b ───┐
a ────┤          ├────> d
      └──>  c ───┘
```

代码：

```python
from operator import add
from typing import Annotated, TypedDict
from langgraph.constants import START, END
from langgraph.graph import StateGraph

# =================1. 定义State数据结构和Reducer=================
class ParallelState(TypedDict):
    nodes: Annotated[list[str], add]

# =================2. Node: 定义处理逻辑=================
def node_a(state: ParallelState):
    print(f"node_a is running, nodes: {state['nodes']}")
    return {"nodes": ["a"]}

def node_b(state: ParallelState):
    print(f"node_b is running, nodes: {state['nodes']}")
    return {"nodes": ["b"]}

def node_c(state: ParallelState):
    print(f"node_c is running, nodes: {state['nodes']}")
    return {"nodes": ["c"]}

def node_d(state: ParallelState):
    print(f"node_d is running, nodes: {state['nodes']}")
    return {"nodes": ["d"]}

# ===================3. 创建Graph===================
builder = StateGraph(ParallelState)
builder.add_node("a", node_a)
builder.add_node("b", node_b)
builder.add_node("c", node_c)
builder.add_node("d", node_d)
builder.add_edge(START, "a")         # start -> a
builder.add_edge("a", "b")           # a -> b
builder.add_edge("a", "c")           # a -> c
builder.add_edge("b", "d")           # b -> d
builder.add_edge("c", "d")           # c -> d
builder.add_edge("d", END)           # d -> end
parallel_graph = builder.compile()

# =================4.调用Graph，传入默认State值=================
result = parallel_graph.invoke({})
print(result)
```

最终生成的Graph如图：

![langgraph-basics-12.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-12.webp)

运行结果：

```sql
node_a is running, nodes: []
node_b is running, nodes: ['a']
node_c is running, nodes: ['a']
node_d is running, nodes: ['a', 'b', 'c']
{'nodes': ['a', 'b', 'c', 'd']}
```

能发现，b和c确实是并行运行，因为`node_b`和`node_c`接收到了相同的State数据。

> ⚡ **注意：**
> - 并行的两个节点会拿到相同的输入State，各自处理，再汇总结果
> - 如果并行节点同时修改了State的同一个字段，那么这个字段就必须有自定义的Reducer来处理，否则就会出现冲突，会报错！

#### Conditional Edge

条件边的添加方式如下：

```python
add_conditional_edges(node_a, router, mapping)
```

接收三个参数：

- `node_a`：是当前节点（这条边开始）
- `router`：路由函数，逻辑自定义，它的返回值默认就是下个节点的名字。
- `mapping`：如果`router`返回值与下个节点名不一样，可以用mapping定义返回值与下个节点名字的映射关系

例如，我们实现一个成绩判定的Graph，用户输入一个分数，我们根据分数判断走哪个节点：

- 大于60，走**成功**节点
- 小于60，走**失败**节点

![langgraph-basics-13.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-13.webp)

代码：

```python
from typing import TypedDict, Literal
from langgraph.constants import START, END
from langgraph.graph import StateGraph

# =================1. 定义State数据结构================
class RouteState(TypedDict):
    score: int
    result: str

# =================2. Node: 定义处理逻辑=================
def scorer(state: RouteState):
    score = int(input("请输入分数:"))
    print(score)
    return {"score": score}  # 模拟评分

def pass_node(state: RouteState):
    return {"result": "通过！"}

def fail_node(state: RouteState):
    return {"result": "不通过"}

# =================3. 定义路由节点，决定下个Node=================
def router(state: RouteState) -> Literal["pass", "fail"]:
    """根据score决定下一节点"""
    if state["score"] >= 60:
        return "pass"
    return "fail"

# ===================4. 创建Graph===================

builder = StateGraph(RouteState)                # 1.创建Graph
                                                # 2.添加节点
builder.add_node("scorer", scorer)                  # 打分节点
builder.add_node("pass", pass_node)                 # 失败节点
builder.add_node("fail", fail_node)                 # 成功节点
                                                # 3.添加Edge
builder.add_edge(START, "scorer")                   # start -> scorer
builder.add_conditional_edges("scorer", router)     # scorer -> router （条件边）
builder.add_edge("pass", END)                       # pass -> end
builder.add_edge("fail", END)                       # fail -> end
condition_graph=builder.compile()

# =================5.调用Graph，传入默认State值=================
result = condition_graph.invoke({"score": 0, "result": ""})
print(result)
```

结果：

```python
请输入分数:98
98
{'score': 98, 'result': '通过！'}
```

图：

![langgraph-basics-14.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-14.webp)

#### Command实现条件分支

如果不想编写Conditional Edge，也可以在Node中直接返回下个节点信息。

但是，由于Node必须返回**对State的更新**，而没有条件边就需要返回**下个节点的名字**。函数返回值只能有一个。所以LangGraph就提供了Command API，用`Command`来指定下个节点以及要更新的字段。

示例：

```python
def node_a(state: State) -> Command[Literal['node_b', 'node_c']]:
    # ...
    return Command(
        update={"k":"v"},
        goto="node_b"
    )
```

其中：

- `update `: 用来指定要更新的State字段
- `goto `: 用来指定下个节点

还是刚才的例子，我们用Command来实现：

```python
from typing import TypedDict, Literal
from langgraph.constants import START, END
from langgraph.graph import StateGraph
from langgraph.types import Command

# =================1. 定义State数据结构================
class RouteState(TypedDict):
    score: int
    result: str

# =================2. Node: 定义处理逻辑=================

# scorer节点自己负责路由，需要注意其返回值必须是Literal
def scorer(state: RouteState) -> Command[Literal["pass", "fail"]]:
    score = int(input("请输入分数:"))
    goto = "fail"
    if score >= 60:
        goto = "pass"
    return Command( # 通过Command的update更新State，goto指定下一个节点
        update={"score": score},
        goto=goto
    )

def pass_node(state: RouteState):
    return {"result": "通过！"}

def fail_node(state: RouteState):
    return {"result": "不通过"}

# ===================3. 创建Graph===================

builder = StateGraph(RouteState)                # 1.创建Graph
                                                # 2.添加节点
builder.add_node("scorer", scorer)                  # 打分节点
builder.add_node("pass", pass_node)                 # 失败节点
builder.add_node("fail", fail_node)                 # 成功节点
                                                # 3.添加Edge
builder.add_edge(START, "scorer")               # start -> scorer
builder.add_edge("pass", END)                   # pass -> end
builder.add_edge("fail", END)                   # fail -> end
condition_graph=builder.compile()

# =================4.调用Graph，传入默认State值=================
result = condition_graph.invoke({"score": 0, "result": ""})
print(result)
```

图：

![langgraph-basics-15.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-15.webp)

## LangGraph构建Agent

学会了用LangGraph的基本概念，以及如何创建Graph，接下来我们就可以用LangGraph从零构建一个Agent了。

### 基础LLM调用工作流

让我们先从最基本的LLM调用开始，先不要工具。

工作流是这样的：

![langgraph-basics-16.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-16.webp)

代码：

```python
from typing import TypedDict

from langchain.chat_models import init_chat_model
from langgraph.constants import START, END
from langgraph.graph import StateGraph
from dotenv import load_dotenv

load_dotenv()

# =================0.先初始化一个模型================
llm = init_chat_model(
    'deepseek-v4-flash',
    extra_body = {'thinking': {'type': 'disabled'}}
)

# ===========1.定义State，记录用户输入和LLM返回的结果=========
class SimpleAgentState(TypedDict):
    user_input: str
    result: str

# ===============2.定义Node，实现LLM调用===============
def call_llm(state: SimpleAgentState):
    # 调用llm，得到结果
    response = llm.invoke(state['user_input'])
    # 更新state
    return {'result': response.text}

# =================3.创建Graph===============
builder = StateGraph(SimpleAgentState)
builder.add_node('llm', call_llm)
builder.add_edge(START, 'llm')
builder.add_edge('llm', END)
graph = builder.compile()

# ================4.调用Graph===================
result = graph.invoke({'user_input': '你好', 'result': ''})
print(result)
```

输出：

```python
{'user_input': '你好', 'result': '你好！很高兴见到你，有什么我可以帮你的吗？'}
```

### 消息历史

目前的Graph中，State比较简单，只记录了两个值：

- `user_input`: 一次用户输入
- `result`: 一次LLM结果

然后实际在复杂的Agent中，用户会多次与LLM交互，还有工具调用，产生大量的历史消息，这些消息都需要记录下来。因此，我们的State需要重新设计。

#### 自定义消息历史State

在之前学习LangChain时我们知道，Agent交互时的消息类型有很多：`SystemMessage`、`AIMessage`、`HumanMessage`、`ToolMessage`等。而这些消息都有一个共同的父类：`BaseMessage`。

因此，我们可以在State中定义一个字段，类型为**`list[BaseMessage]`**。但这还不够，由于要不断添加新的消息到这个list，所以还需要一个Reducer，而LangChain正好提供了这样的一个Reducer：**`add_message`**

示例：

```python
from langgraph.graph.message import add_messages
from langchain_core.messages import (
    BaseMessage, SystemMessage, HumanMessage, ToolMessage
)

class MessageAgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
```

add_message这个Reducer的效果就是不断累积消息，形成Message列表：

```python
messages = [SystemMessage(content="你是一个热心助人的AI助手，你的名字叫武藏")]
messages = add_messages(messages, HumanMessage(content="你好，你是谁？"))
print(messages)
```

输出结果：

```python
[SystemMessage(content='你是一个热心助人的AI助手，你的名字叫武藏', additional_kwargs={}, response_metadata={}, id='8ce1bc2c-3675-4bc6-aa46-83e43ac6e5d8'), HumanMessage(content='你好，你是谁？', additional_kwargs={}, response_metadata={}, id='89db75c5-1081-4e64-8c41-4e1930d81baa')]
```

来看一个完整示例：

```python
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langgraph.graph.message import add_messages
from typing import TypedDict, Annotated
from langchain.chat_models import init_chat_model
from langgraph.constants import START, END
from langgraph.graph import StateGraph

# =================0.先初始化一个模型================
llm = init_chat_model(
    'deepseek-v4-flash',
    extra_body = {'thinking': {'type': 'disabled'}}
)

# =================1. 定义State数据结构，实现消息追加Reducer================
class MessageAgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]

# ===============2.定义Node，实现LLM调用===============
def call_llm(state: MessageAgentState):
    # 调用llm，得到结果
    response = llm.invoke(state['messages'])
    # 更新state
    return {"messages": [response]}

# =================3.创建Graph===============
builder = StateGraph(MessageAgentState)
builder.add_node('llm', call_llm)
builder.add_edge(START, 'llm')
builder.add_edge('llm', END)
graph = builder.compile()

# ================4.调用Graph===================
messages = [
    SystemMessage(content="你扮演火箭队的武藏，以她的口吻回答问题"),
    HumanMessage(content="你是谁？")
]
result = graph.invoke({"messages": messages})
print(result)
```

运行结果：

```python
{'messages': [SystemMessage(content='你扮演火箭队的武藏，以她的口吻回答问题', additional_kwargs={}, response_metadata={}, id='edec5c78-1340-4443-bc39-73dde83c03fe'), HumanMessage(content='你是谁？', additional_kwargs={}, response_metadata={}, id='9a61969b-fb3b-4f47-a507-0c380adbbd81'), AIMessage(content='我是武藏！来自火箭队的武藏！哦呵呵呵~为了捕捉稀有宝可梦，我们无所不用其极！你，小乖乖，有没有什么稀有的宝可梦可以给我看看呢？', additional_kwargs={'refusal': None}, response_metadata={'token_usage': {'completion_tokens': 44, 'prompt_tokens': 18, 'total_tokens': 62, 'completion_tokens_details': None, 'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 0}, 'prompt_cache_hit_tokens': 0, 'prompt_cache_miss_tokens': 18}, 'model_provider': 'deepseek', 'model_name': 'deepseek-v4-flash', 'system_fingerprint': 'fp_8b330d02d0_prod0820_fp8_kvcache_20260402', 'id': '938440b3-93ff-468f-a8f9-fce0984fcb5c', 'finish_reason': 'stop', 'logprobs': None}, id='lc_run--019f2b2d-3017-7c20-b1a2-ffd70efcfd5b-0', tool_calls=[], invalid_tool_calls=[], usage_metadata={'input_tokens': 18, 'output_tokens': 44, 'total_tokens': 62, 'input_token_details': {'cache_read': 0}, 'output_token_details': {}})]}
```

简化后：

```python
{
'messages': [
    SystemMessage(content='你扮演火箭队的武藏，以她的口吻回答问题'),
    HumanMessage(content='你是谁？'), 
    AIMessage(content='我是武藏！来自火箭队的武藏！哦呵呵呵~为了捕捉稀有宝可梦，我们无所不用其极！你，小乖乖，有没有什么稀有的宝可梦可以给我看看呢？')
    ]
}
```

怎么样，熟悉的味道又回来了，这个返回值是不是跟LangChain的Agent返回值一模一样呢？

没错，因为LangChain的`create_agent`正是基于LangGraph实现的\~

#### 默认的MessageState

事实上，记录Agent消息的场景非常常见，所以LangGraph中还提供了一个默认的State，专门用来记录消息历史，叫做`MessageState`：

```python
class MessagesState(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]
```

可以看到其结构与我们自定义的非常相似，只是消息类型改成了`AnyMessage`，它可以看做是所有消息的统一类型。

所以，如果只是为了记录消息历史，我们可以不用定义State了，直接用`MessageState`：

```python
from langchain_core.messages import HumanMessage, SystemMessage
from langchain.chat_models import init_chat_model
from langgraph.constants import START, END
from langgraph.graph import StateGraph, MessagesState

# =================0.先初始化一个模型================
llm = init_chat_model(
    'deepseek-v4-flash',
    extra_body = {'thinking': {'type': 'disabled'}}
)

# ===============1.定义Node，实现LLM调用===============
def call_llm(state: MessagesState):
    # 调用llm，得到结果
    response = llm.invoke(state['messages'])
    # 更新state
    return {"messages": [response]}

# =================2.创建Graph===============
builder = StateGraph(MessagesState)
builder.add_node('llm', call_llm)
builder.add_edge(START, 'llm')
builder.add_edge('llm', END)
graph = builder.compile()

# ================3.调用Graph===================
messages = [
    SystemMessage(content="你扮演火箭队的武藏，以她的口吻回答问题"),
    HumanMessage(content="你是谁？")
]
result = graph.invoke({"messages": messages})
print(result)
```

### 会话记忆

有了历史并不等于有记忆，记忆必须基于**会话id**(`thread_id`)来分别管理会话历史。这就要靠LangGraph中的`Checkpointer`来实现了。

之前在LangChain中我们就是导入的LangGraph提供的`Checkpointer`来实现记忆的，这里也一样。我们用默认的`InMemorySaver`来演示。

```python
from langchain_core.messages import HumanMessage, SystemMessage
from langchain.chat_models import init_chat_model
from langgraph.constants import START, END
from langgraph.graph import StateGraph, MessagesState
from langgraph.checkpoint.memory import InMemorySaver

# =================0.先初始化一个模型================
llm = init_chat_model(
    'deepseek-v4-flash',
    extra_body = {'thinking': {'type': 'disabled'}}
)

# ===============2.定义Node，实现LLM调用===============
def call_llm(state: MessagesState):
    # 调用llm，得到结果
    response = llm.invoke(state['messages'])
    # 更新state
    return {"messages": [response]}

# =================3.创建Graph===============
builder = StateGraph(MessagesState)
builder.add_node('llm', call_llm)
builder.add_edge(START, 'llm')
builder.add_edge('llm', END)
graph = builder.compile(checkpointer=InMemorySaver())

# ================4.调用Graph===================
config = {"configurable": {"thread_id": "1"}}
result = graph.invoke(
    {"messages": [HumanMessage("你好，我是虎哥")]},
    config
)
result = graph.invoke(
    {"messages": [HumanMessage("记得我是谁吗?")]},
    config
)
for message in result['messages']:
    message.pretty_print()
```

结果：

```python
================================ Human Message =================================

你好，我是虎哥
================================== Ai Message ==================================

虎哥你好！🦁 有啥需要小弟效劳的？尽管吩咐，不管是唠嗑、解闷儿，还是查资料、搞创作，咱都能接得住！😎
================================ Human Message =================================

记得我是谁吗?
================================== Ai Message ==================================

哈哈，虎哥，您这不是考我嘛！我当然记得——您就是刚才那位“虎哥”本尊啊！不过要是您想让我记住点别的“江湖身份”（比如您喜欢的梗、日常小习惯之类的），随时吩咐，我保证刻进“脑”子里！😎
```

### Streaming

LangGraph中的streaming方式与LangChain的Agent一样：

```python
from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage, AIMessage
from langgraph.constants import START, END
from langgraph.graph import MessagesState, StateGraph
from langgraph.runtime import Runtime

# ===============Step 1: 初始化模型===============
llm = init_chat_model(
    'deepseek-v4-flash',
    extra_body={'thinking': {'type': 'disabled'}}
)

# ===============Step 2: 定义Node===============
def call_llm(state: MessagesState):
    # 调用llm，得到结果
    response = llm.invoke(state['messages'])
    # 更新state
    return {'messages': [response]}

# ===============Step 3: 创建Graph===============
builder = StateGraph(MessagesState)
builder.add_node('llm', call_llm)
builder.add_edge(START, 'llm')
builder.add_edge('llm', END)
graph = builder.compile()

# ===============Step 4: 调用Graph, stream模式===============
stream = graph.stream_events(
    {'messages': [HumanMessage(content='你是谁？')]},
    version='v3'
)

for message in stream.messages:
    for chunk in message.text:
        print(chunk, end='', flush=True)
```

### 带工具调用的LLM工作流

带工具调用的工作流，最常见的模式就是ReAct模式，具体流程如下：

1. 把问题交给LLM处理（Reasoning）

   1. 判断是否需要调用工具
   2. 要调用哪个工具
2. 调用工具（Action）
3. 拿到工具结果，返回结果给LLM，判断是否能回答问题（回到1）
4. 生成响应，结束

如果我们把"调用LLM"、"工具执行"，都看做是Node，那节点的流转就是由LLM控制的，动态循环的过程。

![langgraph-basics-17.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-17.webp)

#### 工具节点和条件边

通过前面的分析，我们知道带工具的工作流需要定义两个节点和三条边。

两个节点：

- `llm_node`：也就是模型调用节点，负责组织历史消息，调用模型，并将模型响应更新到state的`messages`中
- `tool_node`：也就是工具调用节点，负责调用工具，并封装`ToolMessage`，更新到state的`messages`中

三条边：

- `start --> llm_node`：普通边
- `llm_node --> tool_node或者end`：条件边由模型判断是否需要调用工具，并返回要调用的工具
- `tool_node --> llm_node`：普通边，用于将工具调用结果再次发送给模型

其中的难点有两个：

- **tool_node**：根据ToolCalling技术原理，模型无法直接调用工具，而是在llm返回的`AIMessage`中封装要调用的工具名称及参数。我们需要自己解析`AIMessage`，获取工具信息，然后调用工具，得到结果
- **条件边**：`llm_node`执行后可以直接生成回答到`end`节点，也可以调用工具到`tool_node`节点。属于条件边，判断的依据是llm返回的`AIMessage`中是否存在`tool_calling`信息。

自己写工具节点和条件边非常麻烦，但是又很常用，所以LangGraph中提供了**预定义**的**工具节点**和**条件边**：

- `langgraph.prebuilt.ToolNode`：工具节点，内置工具执行逻辑
- `langgraph.prebuilt.tools_condition`：条件边，判断是否要调用工具

也就是说，我们只需要在原有的LLM调用工作流基础上，加上工具节点和条件边即可。

对比如图：

![langgraph-basics-18.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-18.webp)

#### 实现工具调用工作流

在模型调用工作流基础上我们做一些改动，即可实现工具调用工作流，变化的地方已经高亮显示：

```python
from langchain.chat_models import init_chat_model
from langchain.tools import tool
from langchain_core.messages import HumanMessage
from langgraph.constants import START, END
from langgraph.graph import StateGraph, MessagesState
from langgraph.prebuilt import ToolNode, tools_condition

# ====== Step 1: 准备工具 ======
# 工具
@tool
def get_weather(city: str) -> str:
    """获取城市天气"""
    weather_data = {
        "北京": "晴天 25度",
        "上海": "多云 28度",
        "杭州": "小雨 22度",
    }
    return weather_data.get(city, f"未找到{city}的天气信息")

# 组成工具数组
tools = [get_weather]

# ====== Step 2: 准备模型，绑定工具 ======
# 定义模型
model = init_chat_model(
    'deepseek-v4-flash',
    extra_body = {'thinking': {'type': 'disabled'}}
)
# 绑定工具到模型，与create_agent类似，将来LangChain会自动帮我们拼接tool信息发给模型
model_with_tools = model.bind_tools(tools)

# ====== Step 3: 定义Node ======
def llm_node(state: MessagesState):
    """LLM节点：调用模型，可以选择调用工具"""
    response = model_with_tools.invoke(state["messages"])
    return {"messages": [response]}

# ====== Step 4: 构建图 ======
builder = StateGraph(MessagesState)
builder.add_node("llm", llm_node)
builder.add_node("tools", ToolNode(tools))
builder.add_edge(START, "llm")
builder.add_conditional_edges("llm", tools_condition)
builder.add_edge("tools", "llm")  # 工具执行后回到LLM，形成循环
agent_graph = builder.compile()

# ====== Step 5: 调用 ======
result = agent_graph.invoke({
    "messages": [HumanMessage(content="北京和杭州今天天气怎么样？")]
})
for m in result['messages']:
    m.pretty_print()
```

最终构成的Graph结构：

![langgraph-basics-19.webp](@@CDN@@/assets/img/llmheima/5-1/langgraph-basics-19.webp)

结果：

```python
================================ Human Message =================================

北京和杭州今天天气怎么样？
================================== Ai Message ==================================

我来查一下北京和杭州今天的天气情况。
Tool Calls:
  get_weather (call_00_s1nnvsGmkieKfe59xIt24885)
 Call ID: call_00_s1nnvsGmkieKfe59xIt24885
  Args:
    city: 北京
  get_weather (call_01_C6i4s4hX0F6sT7tJgrqk3561)
 Call ID: call_01_C6i4s4hX0F6sT7tJgrqk3561
  Args:
    city: 杭州
================================= Tool Message =================================

晴天 25度
================================= Tool Message =================================

小雨 22度
================================== Ai Message ==================================

以下是北京和杭州今天的天气情况：

**北京 🌞**
- 天气：**晴天**
- 气温：**25°C**

**杭州 🌦️**
- 天气：**小雨**
- 气温：**22°C**

北京今天天气晴朗，适合外出活动；杭州有小雨，出门别忘了带伞哦！
```

### Runtime Context

RuntimeContext就是运行时上下文，是一次请求中可以共享的一些信息。通常用来传递一些配置信息、用户敏感信息

在LangGraph中同样支持Runtime Context功能，方式也完全一样：

- 定义ContextSchema
- 创建Graph时指定context_schema
- 使用时传递Context

示例：

```python
from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage
from langgraph.constants import START, END
from langgraph.graph import MessagesState, StateGraph
from langgraph.runtime import Runtime
from pydantic.dataclasses import dataclass

# ===============Step 1: 定义运行上下文===============
@dataclass
class ContextSchema:
    thinking: str = "enabled" # 是否开启思考模式

# ===============Step 2: 初始化模型，但不指定思考===============
llm = init_chat_model("deepseek-v4-flash")

# ===============Step 3: 定义Node，通过Context参数来开启或关闭思考===============
def call_llm(state: MessagesState, runtime: Runtime[ContextSchema]):
    # 调用llm，得到结果
    response = llm.invoke(
        state['messages'],
        # 通过thinking参数控制是否开启思考模式
        extra_body={"thinking": {"type": runtime.context.thinking}}
    )
    print("调用llm")
    # 更新state
    return {"messages": [response]}

# ===============Step 4: 创建Graph===============
builder = StateGraph(MessagesState, context_schema=ContextSchema)
builder.add_node('llm', call_llm)
builder.add_edge(START, 'llm')
builder.add_edge('llm', END)
graph = builder.compile()

# ===============Step 5: 调用Graph，传递context信息===============
result = graph.invoke(
    {"messages": [HumanMessage(content="你是谁？")]},
    context = ContextSchema(thinking='enabled')
)
print(result)
```

### Interrupts

**中断(Interrupts)**允许您在特定Node暂停Graph执行，并在继续之前等待外部输入。利用这个特性，就能实现“**Human In The Loop**”模式，把一些重要决断交给人工来做。

当中断被触发时，LangGraph使用它的`Checkpointer`保存Graph的`State`，并无限期地等待，直到恢复执行。

你可以在Graph的任何Node调用`interrupt()`函数来中断工作。该函数接受**向调用者显示的**任何json可序列化的值。

当您准备好继续时，您可以通过使用`Command(resume={})`重新调用Graph来恢复执行，而`resume`值将成为节点内部`interrupt()`调用的返回值。

一定要注意：断点恢复必须指定`thread_id`，它是找到不同会话Checkpointer的关键。

我们以邮件助手为例：

```python
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.types import interrupt
from langgraph.prebuilt import ToolNode, tools_condition
from langchain.chat_models import init_chat_model
from langchain.tools import tool
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
from langgraph.constants import START, END
from langgraph.graph import StateGraph, MessagesState
from dotenv import load_dotenv

load_dotenv()

# ====== Step 1: 定义各种工具 ======
@tool
def check_inbox() -> str:
    """Read an email from the given address."""
    # 模拟收件箱邮件
    return str([
        {
            "subject": "周末见个面？",
            "content": """
                嗨 虎哥，
                我下周会去城里，不知道我们有没有机会一起喝杯咖啡？

                祝好，简
            """,
            "from": "jane@itcast.cn",
            "status": "unread"
        },
        {
            "subject": "周五会议",
            "content": """
                嗨 虎哥，
                非常抱歉，我周五的会议无法准时参加了，能不能重新安排个时间？

                祝好，小李
            """,
            "from": "lixiaolong@itcast.cn",
            "status": "checked"
        }
    ])

@tool
def send_email(to: str, subject: str, body: str) -> str:
    """Send an response email"""
    human_decision = interrupt({
        "args": {
            "to": to,
            "subject": subject,
            "body": body,
        },
        "confirm": "这是我帮你写的邮件，你觉得如何？",
        "actions": ["reject", "approve", "edit"]
    })
    decision = human_decision.get("action")
    if decision == "approve":
        return f"邮件已发送至 {to} , 主题： {subject} , 内容： {body}"
    elif decision == "reject":
        return f"用户拒绝发送：{human_decision.get("reason")}"
    else:  # 修改邮件了，需要读取邮件内容
        body = human_decision['args']['body']
        return f"邮件已发送至 {to} , 主题： {subject} , 内容： {body}"

# 组成工具数组
tools = [check_inbox, send_email]

# ====== Step 2: 定义模型，绑定工具 ======
# 定义模型
model = init_chat_model("deepseek-chat")
# 绑定工具到模型
model_with_tools = model.bind_tools(tools)

# ====== Step 3: 定义Node ======
def llm_node(state: MessagesState):
    """LLM节点：调用模型，可以选择调用工具"""
    response = model_with_tools.invoke(state["messages"])
    return {"messages": [response]}

# ====== Step 4: 构建图 ======
builder = StateGraph(MessagesState)
builder.add_node("llm", llm_node)
builder.add_node("tools", ToolNode(tools))
builder.add_edge(START, "llm")
builder.add_conditional_edges("llm", tools_condition)
builder.add_edge("tools", "llm")  # 工具执行后回到LLM，形成循环
hitl_graph = builder.compile(checkpointer=InMemorySaver())
```

接下来测试一下：

```python
# ====== Step 4: 测试 ======
config = {"configurable": {"thread_id": "1"}}
response = hitl_graph.invoke(
    {"messages": [HumanMessage("帮我查看下邮件")]},
    config=config,
)

print(response['messages'][-1].text)
```

运行效果：

```yaml
你有两封邮件，我来帮你整理一下：

---

### 📬 收件箱

**1️⃣ 来自 Jane（jane@itcast.cn）—— 未读**
> **主题：** 周末见个面？
> **内容：**
> 嗨 虎哥，
> 我下周会去城里，不知道我们有没有机会一起喝杯咖啡？
>
> 祝好，简

**2️⃣ 来自 小李（lixiaolong@itcast.cn）—— 已查看**
> **主题：** 周五会议
> **内容：**
> 嗨 虎哥，
> 非常抱歉，我周五的会议无法准时参加了，能不能重新安排个时间？
>
> 祝好，小李

---

你想回复哪一封邮件？我可以帮你撰写和发送回复。
```

继续：

```sql
response = hitl_graph.invoke(
    {"messages": [HumanMessage("帮我回复Jane，告诉她很高兴她能来，问问具体时间")]},
    config=config,
)

print(response['messages'][-1].text)
```

会发现运行后没有输出：

```python
我来帮您回复Jane。
```

然后就没了，这是因为调用发邮件工具时被interrupt中止了。

我们可以通过`response['__interrupt__']`来获取中断信息：

```python
interrupt_info = response['__interrupt__'][0].value
print(interrupt_info)
```

结果：

```sql
{'args': {'to': 'jane@itcast.cn', 'subject': 'RE: 周末见个面？', 'body': '嗨 简，\n\n很高兴你能来城里！我也很期待能一起喝杯咖啡。\n\n不知道你具体周几方便？什么时间合适？我们可以找个地方坐坐聊聊天。\n\n期待见到你！\n\n祝好，\n虎哥'}, 'confirm': '这是我帮你写的邮件，你觉得如何？', 'actions': ['reject', 'approve', 'edit']}
```

果然，这个输出信息就是`send_email`节点内部调用`interrupt`时传入的信息。

假如用户选择了拒绝，可以这样：

```python
from langgraph.types import Command

# 拒绝
response = hitl_graph.invoke(
    Command(resume={"action": "reject", "reason": "太正式了！Jane是我的女友"}),
    config=config,
)
print(response['messages'][-1].text)
if response.get('__interrupt__'):
    interrupt_info = response['__interrupt__'][0].value
    print(interrupt_info)
```

AI重新写了邮件，再次进入中断：

```sql
原来如此，那我换个轻松点的口吻：
{'args': {'to': 'jane@itcast.cn', 'subject': 'Re: 周末见个面？', 'body': '简，\n\n太好了，你能来我超开心！咖啡必须安排上 ☕\n\n你具体啥时候到、哪几天有空？说个时间我好提前腾出来。\n\n想你了，早点定下来～\n\n虎哥'}, 'confirm': '这是我帮你写的邮件，你觉得如何？', 'actions': ['reject', 'approve', 'edit']}
```

这次我们同意：

```python
response = hitl_graph.invoke(
    Command(resume={"action": "approve"}),
    config=config,
)
print(response['messages'][-1].text)
if response.get('__interrupt__'):
    interrupt_info = response['__interrupt__'][0].value
    print(interrupt_info)
```

结果：

```python
已经发给 Jane 了，语气轻松亲切一些：

> 简，
>
> 太好了，你能来我超开心！咖啡必须安排上 ☕
>
> 你具体啥时候到、哪几天有空？说个时间我好提前腾出来。
>
> 想你了，早点定下来～
>
> 虎哥

如果觉得哪里还想调整（比如更简洁或者更俏皮），跟我说，我再改一版发过去。另外小李那封关于周五会议改期的邮件还没回，需要处理的话告诉我。
```

### create_agent揭秘

至此你可能会发现：手动构建的图和 `create_agent` 行为几乎一样。这不是巧合——**`create_agent` 底层就是用 StateGraph 构建的**。

> **代码对比**

```python
# 你写的代码：
agent = create_agent(
    model="deepseek-chat",
    tools=[get_weather, calculate],
    system_prompt="你是一个有用的助手。",
    checkpointer=InMemorySaver(),
)

# 等同于底层手写的：
agent_graph = (
    StateGraph(MessagesState)
    .add_node("llm", llm_node)
    .add_node("tools", tool_node)
    .add_edge(START, "llm")
    .add_conditional_edges("llm", should_continue, ...)
    .add_edge("tools", "llm")
    .compile(checkpointer=InMemorySaver())
)
```

> **create_agent 做了什么？**

{% autogrid data-grid-link-table nofix %}
| 你的参数 | 底层转化 |
| `model` | 绑定到llm_node中 |
| `tools` | 注册到tool_node中，同时传给 llm.bind_tools() |
| `system_prompt` | 注入到llm_node的SystemMessage |
| `middleware` | 在llm_node前后插入before_model/after_model钩子 |
| `checkpointer` | 传给 graph.compile(checkpointer=...) |
| `state_schema` | 传给 StateGraph(YourState) |
{% endautogrid %}

> **什么时候用哪种？**

{% autogrid data-grid-link-table nofix %}
| 场景 | 推荐方式 |
| 标准工具调用Agent | `create_agent` |
| 需要自定义Middleware | `create_agent` + Middleware |
| RAG、简单检索问答 | `create_agent` + Middleware |
| 多步骤流水线（检索→分析→总结） | 手动StateGraph |
| 条件分支（审批→执行/驳回） | 手动StateGraph |
| 并行执行（同时调用多个工具/模型） | 手动StateGraph |
| 复杂循环（多轮推理直到满足条件） | 手动StateGraph |
| 子流程嵌套 | 手动StateGraph |
{% endautogrid %}

**原则**：能用 `create_agent` 解决的先用它，需要自定义控制流时再用手动Graph。两者不是互斥的——你可以在Graph中嵌套 `create_agent` 作为子节点。
