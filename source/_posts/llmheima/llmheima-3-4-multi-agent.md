---
title: llmheima-第4节. Multi Agent
date: 2026-11-18 04:00:00
categories:
  - llmheima
tags:
  - llmheima
---
<div class="essay-banner essay-llm"></div>

# 第4节. Multi Agent

Multi Agent，既多智能体协作系统，专门用来处理复杂的任务流程。

## 概述

大多数情况下，使用合适的Tool、合适的提示词和模型，单智能体就能完成任务。我们也推荐大家优先使用单智能体，只有在一些特殊情况下才推荐使用多智能体系统。

### 使用场景

通常在以下几种情况下我们会使用Multi Agent：

- **上下文管理(Context Management)**：如果同时需要调用的工具很多，或者上下文内容很多，我们可以将任务拆分，交给不同的Agent处理
- **分布式开发(Distributed development)**：不同的团队独立开发和维护自己的Agent，并将他们组合成一个更大的Agent
- **并行(Parallelization)**：将任务拆分为多个子任务，并交给专门的Agent处理，并同时执行它们以加快处理速度

### 常见模式

多智能体协作的模式有很多种，比较常见的有：

- **Subagents**：**子代理模式**，一个主Agent将多个子Agent作为Tool来协调使用。所有请求都由主Agent处理，决定何时以及如何调用每个子Agent

![multi-agent-01.webp](@@CDN@@/assets/img/llmheima/3-4/multi-agent-01.webp)

- **Handoffs**：**传递模型**，随着任务的执行改变state中的任务状态，从而触发路由变更或者触发Agent的配置变更，从而切换到其它Agent或者改变Agent的工具或系统提示（类似与一个新agent）。因此每个Agent都可以与用户交互，处理用户请求并返回响应。

![multi-agent-02.webp](@@CDN@@/assets/img/llmheima/3-4/multi-agent-02.webp)

- **Skills**：**技能模式**，只有1个Agent，根据任务按需加载Skill或知识

![multi-agent-03.webp](@@CDN@@/assets/img/llmheima/3-4/multi-agent-03.webp)

- **Router**：**路由模式**，1个负责路由的Agent对用户请求进行分类，将请求导向给一个或多个专门的Agent。最后再由一个Agent负责总结结果。

![multi-agent-04.webp](@@CDN@@/assets/img/llmheima/3-4/multi-agent-04.webp)

我们从四个方面来对比这几种模式：

- Distributed development：是否支持不同团队独立开发维护
- Parallelization：是否支持并行运行多个subagent
- Multi-hop：是否支持按照特定顺序依次执行多个subagent
- Direct user interaction：是否支持subagent直接与用户对话

对比如下：

{% autogrid data-grid-link-table nofix %}
| Pattern 模式 | Distributed development | Parallelization | Multi-hop | Direct user interaction |
| [Subagents](https://docs.langchain.com/oss/python/langchain/multi-agent/subagents) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ |
| [Handoffs](https://docs.langchain.com/oss/python/langchain/multi-agent/handoffs) | - | - | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| [Skills](https://docs.langchain.com/oss/python/langchain/multi-agent/skills) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| [Router](https://docs.langchain.com/oss/python/langchain/multi-agent/router) | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | - | ⭐⭐⭐ |
{% endautogrid %}

> 💡 当然，在实际开发中不局限与这四种模式，事实上我们可以把这些模式任意的混合使用，创造出无限的可能性。

## 案例

接下来，我们就做一个多Agent案例。

现在，我们计划开发一个婚礼策划智能体，它包含以下三个核心功能：

- 旅行规划：负责为你和宾客前往婚礼目的地寻找合适的机票，制定旅行计划
- 场地规划：负责根据宾客人数在目的地寻找合适的婚礼场地
- 音乐规划：负责根据用户需求筛选合适的婚礼歌单，并计算出预算

### 需求分析

理论上说，我们只要准备好以上每一步所需的**工具**，写好包含完整流程的**系统提示词**，用一个Agent就能实现这个功能。

但是，考虑到以下几个原因：

- 要使用的工具实在是太多，航班、场地、音乐等要查询的信息非常多，这会导致单Agent的上下文非常大，有可能超出模型上下文限制。把任务拆解可以减少上下文需求，因此适合分布式开发。
- 旅行、场地、音乐的三个任务没有关联，为了提高效率，可以并行执行

综上，建议采用多Agent开发，模式可以选择Subagents模式。我们可以开发三个Subagent：

- travel agent：负责为你前往婚礼目的地寻找往返机票
- venue agent：负责根据宾客人数在网上搜索合适的婚礼场地
- playlist agent：负责在音乐数据库筛选符合用户需求的歌单，并计算出预算

最后，我们还会定义一个主Agent，负责协调（*Coordinator*）工作，以及生成最终的婚礼计划方案。

当然，我们还是在jupyter中开发测试。

首先，需要解决mcp在Windows平台运行的问题：

```python
import sys

if sys.platform == "win32":
    if "ipykernel" in sys.modules:
        sys.stderr = sys.__stderr__
```

然后是完整的依赖：

```python
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_community.utilities import SQLDatabase
from langchain.agents import AgentState
from langchain_tavily import TavilySearch
from langchain.tools import tool
from langchain.tools import ToolRuntime
from langchain.messages import HumanMessage, ToolMessage, AIMessage
from langgraph.types import Command
from langchain.agents import create_agent
from dotenv import load_dotenv

load_dotenv()
```

接下来，就是agent开发了。

### travel agent

旅行agent要查询机票信息，需要Time和Kiwi两个MCP服务。

我们先定义工具：

```python
# MCP客户端，包含Time、Kiwi两个MCP
client = MultiServerMCPClient(
    {
        "travel_server": {
                "transport": "http",
                "url": "https://mcp.kiwi.com"
        },
        "time": {
            "transport": "stdio",
            "command": "uvx",
            "args": [
                "mcp-server-time",
                "--local-timezone=Asia/Shanghai"
            ]
        }
    }
)

tools = await client.get_tools()
```

然后是agent：

```python
# Travel agent
travel_agent = create_agent(
    model="deepseek-flash",
    tools=tools,
    system_prompt="""
    你是一个旅行助手Agent。你为用户搜索到达婚礼地点的理想航班，您不能再追问任何后续问题。
    您必须根据以下标准找到最佳航班选择：
    - 价格（最低，经济舱）
    - 持续时间（最短）
    - 日期（您认为在该地点举行婚礼的最佳时间）
    为了使事情变得简单，只寻找一张票，单程。
    你不会得到额外的信息，只有出发地和目的地。你的工作是批判性地思考最佳选择。
    一旦你找到了最好的选项，让用户知道你的候选列表。
    调用搜索航班工具时，如果是地点在中国，需要使用zh-cn作为Locale参数。
    """
)
```

### venue agent

接着是负责婚礼场地的agent，这里我们简化实现方案，直接基于tavily搜索场地。

因此，首先是定义Tavily的web_search工具：

```python
# 定义Tavily web_search工具
web_search = TavilySearch(
    max_results=5,
    topic="general",
)
```

然后是agent：

```python
# 创建 Venue agent
venue_agent = create_agent(
    model="deepseek-flash",
    tools=[web_search],
    system_prompt="""
    你是场地专家，你在指定的位置搜索满足要求的场地。
    你不能再追问任何后续问题，你必须根据以下标准找到最佳的场地选择：
    - 价格（最低）
    - 容量（完全匹配）
    - 评价（最高）
    您可能需要进行多次搜索以迭代地找到最佳选项。
    """
)
```

### playlist agent

最后，是负责婚礼歌单的agent，为了方便查询，我提供好了一些模拟数据，保存在Sqlite中。db文件在notebooks的resources目录可以找到：

![multi-agent-05.webp](@@CDN@@/assets/img/llmheima/3-4/multi-agent-05.webp)

我们直接定义一个用于执行SQL语句的Tool：

```python
db = SQLDatabase.from_uri("sqlite:///resources/Chinook.db")

@tool
def query_playlist_db(query: str) -> str:

    """Query the database for playlist information"""

    try:
        return db.run(query)
    except Exception as e:
        return f"Error querying database: {e}"
```

测试一下：

```python
# 测试，查询歌单数据
query_playlist_db.invoke({"query":"SELECT * FROM Playlist"})
```

如果能查询出下面数据，说明没问题：

```python
"[(1, 'Music'), (2, 'Movies'), (3, 'TV Shows'), (4, 'Audiobooks'), (5, '90’s Music'), (6, 'Audiobooks'), (7, 'Movies'), (8, 'Music'), (9, 'Music Videos'), (10, 'TV Shows'), (11, 'Brazilian Music'), (12, 'Classical'), (13, 'Classical 101 - Deep Cuts'), (14, 'Classical 101 - Next Steps'), (15, 'Classical 101 - The Basics'), (16, 'Grunge'), (17, 'Heavy Metal Classic'), (18, 'On-The-Go 1')]"
```

接下来就是agent：

```python
# Playlist agent
playlist_agent = create_agent(
    model="deepseek-flash",
    tools=[query_playlist_db],
    system_prompt="""
    你是播放列表专家。查询sql数据库并为给定类型的婚礼策划完美的播放列表。
    一旦你有了你的播放列表，计算播放列表的总时长和成本，每首歌都有一个相关的价格。
    如果在查询数据库时遇到错误，请尝试通过更改查询来修复它们。
    不要空手而归，继续尝试查询数据库，直到你找到一个歌曲列表。
    您可能需要进行多个查询以迭代地找到最佳选项。
    """
)
```

### 主Agent

最后，就是主Agent了，也是整个Agent的核心协调者。它负责与用户交互，收集婚礼信息，调用各个Subagent，筹备婚礼计划。

#### 定义state

首先，我们需要定义一个state，记录婚礼风格有关的信息，包括：

- 婚礼人数
- 音乐风格
- 出发地
- 婚礼举办地

```python
class WeddingState(AgentState):
    origin: str         # 起点
    destination: str    # 目的地
    guest_count: str    # 宾客数量
    genre: str          # 婚礼风格
```

#### Tools

首先，要执行婚礼规划任务必须知道婚礼信息，也就是state中要记录的数据。AI通过与用户沟通可以获得这些信息，但是必须有一个tool负责更新state信息，当AI通过与用户聊天获取这些信息后，调用该tool更新到state中。

```python
@tool
def update_state(origin: str, destination: str, guest_count: str, genre: str, runtime: ToolRuntime) -> str:
    """当你询问用户，知道下列所有值时更新State：origin、destination、guest_count、genre"""
    return Command(update={
        "origin": origin,
        "destination": destination,
        "guest_count": guest_count,
        "genre": genre,
        "messages": [ToolMessage("Successfully updated state", tool_call_id=runtime.tool_call_id)]}
        )
```

接下来，按照Subagent模式，主Agent需要把Subagents当做一个个Tool来协调使用。所以，我们接下来就先定义3个Tool，分别对应3个Subagent.

这些tool读取state中的婚礼信息，然后调用对应的subagent，分别完成自己的任务。

```python
@tool
async def search_flights(runtime: ToolRuntime) -> str:
    """旅行Agent搜索飞往理想婚礼地点的航班."""
    origin = runtime.state["origin"]
    destination = runtime.state["destination"]

    content = f"查询从{origin}到{destination}的航班"
    response = await travel_agent.ainvoke({"messages": [HumanMessage(content)]})
    return response['messages'][-1].content

@tool
def search_venues(runtime: ToolRuntime) -> str:
    """场地Agent根据给定的地点和宾客数量寻找最佳的婚礼场地."""
    destination = runtime.state["destination"]
    capacity = runtime.state["guest_count"]

    content = f"在{destination}寻找适合{capacity}宾客的婚礼场地"
    response = venue_agent.invoke({"messages": [HumanMessage(content)]})
    return response['messages'][-1].content

@tool
def suggest_playlist(runtime: ToolRuntime) -> str:
    """播放列表Agent根据类型风格策划完美的播放列表."""
    genre = runtime.state["genre"]

    content = f"策划符合{genre}风格的婚礼播放列表的曲目"
    response = playlist_agent.invoke({"messages": [HumanMessage(content)]})
    return response['messages'][-1].content
```

#### Agent

接下来，就是创建主Agent了，把刚刚的4个Tools都注册给它，并给它设定核心协调者的任务。

```python
from langchain.agents import create_agent

coordinator = create_agent(
    model="deepseek-flash",
    tools=[search_flights, search_venues, suggest_playlist, update_state],
    state_schema=WeddingState,
    system_prompt="""
    你是婚礼协调员。你负责与用户沟通，找到更新状态所需的所有信息，并更新到state。
    一旦完成，你就可以委派任务了。将查找航班、搜索场地和策划播放列表的任务委派给您的专家Agent。
    当你收到他们的答案，为我设计一场完美的婚礼方案。
    """
)
```

测试：

```python
response = await coordinator.ainvoke(
    {
        "messages": [HumanMessage(content="我来自北京，我想在上海举办一场100人的婚礼，爵士风格的。")],
    }
)

for message in response["messages"]:
    message.pretty_print()
```

运行结果如下：

```markdown
================================ Human Message =================================

我来自北京，我想在上海举办一场100人的婚礼，爵士风格的
================================== Ai Message ==================================

好的！我收到了您的信息：
- 出发地：北京
- 目的地：上海
- 宾客人数：100人
- 风格：爵士

让我先更新一下状态。
Tool Calls:
  update_state (call_00_2jEH5bGpyKbztAM70n3s6586)
 Call ID: call_00_2jEH5bGpyKbztAM70n3s6586
  Args:
    origin: 北京
    destination: 上海
    guest_count: 100
    genre: 爵士
================================= Tool Message =================================
Name: update_state

Successfully updated state
================================== Ai Message ==================================

状态已更新！现在我将为您委派三位专家Agent，分别查找航班、搜索场地和策划爵士风格的播放列表。
Tool Calls:
  search_flights (call_00_x5FdAzWJOrjqPpzxW3Y81374)
 Call ID: call_00_x5FdAzWJOrjqPpzxW3Y81374
  Args:
  search_venues (call_01_gbBVksUlkFMqmS1uuaGC9994)
 Call ID: call_01_gbBVksUlkFMqmS1uuaGC9994
  Args:
  suggest_playlist (call_02_zHiDtuhz5Fu2ykYT1NYP4826)
 Call ID: call_02_zHiDtuhz5Fu2ykYT1NYP4826
  Args:
================================= Tool Message =================================
Name: search_flights

我根据当前日期（2026-09-19，周六）判断，**10 月中旬（10 月 17 日周六）**是上海办婚礼的黄金时段——秋高气爽、避开国庆高峰，机票也处于低位。以下是从北京飞上海的候选航班（单程、经济舱、1 名成人，均为直飞）：

### 💰 最低价（Cheapest）
| 路线 | 时间 & 时长 | 舱位 | 价格 | 预订 |
|---|---|---|---|---|
| PKX → PVG（MU5231 东航） | 15 Oct 22:00 → 16 Oct 00:05（2h 05m） | Economy | 533 CNY | [预订](https://kiwi.com/u/79xm3b) |

### ⚡ 最短时长（Shortest）
| 路线 | 时间 & 时长 | 舱位 | 价格 | 预订 |
|---|---|---|---|---|
| PKX → PVG（CA8341 国航） | **17 Oct 22:00 → 23:45（1h 45m）** | Economy | 536 CNY | [预订](https://kiwi.com/u/t45upg) |
| PKX → PVG（CA8341 国航） | 19 Oct 22:00 → 23:45（1h 45m） | Economy | 645 CNY | [预订](https://kiwi.com/u/tjv9ng) |
| PKX → PVG（CA8341 国航） | 18 Oct 22:00 → 23:45（1h 45m） | Economy | 645 CNY | [预订](https://kiwi.com/u/v24m4x) |

### 🌤 其他值得考虑（17 Oct 婚礼日当天）
| 路线 | 时间 & 时长 | 舱位 | 价格 | 预订 |
|---|---|---|---|---|
| PKX → PVG（CZ8882 南航） | 17 Oct 21:20 → 23:30（2h 10m） | Economy | 541 CNY | [预订](https://kiwi.com/u/z7uh7z) |
| PKX → SHA（CZ8803 南航，虹桥） | 17 Oct 20:00 → 22:10（2h 10m） | Economy | 565 CNY | [预订](https://kiwi.com/u/7pd3su) |
| PKX → PVG（HO1254 吉祥） | 17 Oct 21:25 → 23:35（2h 10m） | Economy | 565 CNY | [预订](https://kiwi.com/u/5mj366s) |
| PKX → PVG（MU5231 东航） | 19 Oct 22:00 → 20 Oct 00:05（2h 05m） | Economy | 538 CNY | [预订](https://kiwi.com/u/rr9t6f) |

---

### 🏆 我的推荐
**CA8341（国航），10 月 17 日周六 22:00 北京大兴 → 23:45 上海浦东，536 CNY。**

理由：它是**全程最短（仅 1h 45m）**，价格几乎与最低价（533 CNY）持平，只差 3 元，而且正好落在我为你选定的婚礼吉日——10 月 17 日周六。既省时又省钱，还不用为错开日期而妥协。如果你纯粹追求最低价，则可选 15 日晚的 MU5231（533 CNY）。

💰 最低价：**533 CNY**（东航 MU5231，15 日）
⚡ 最短：**1h 45m**（国航 CA8341，17 日，536 CNY）

祝旅途愉快，婚礼圆满！🎉 小趣闻：上海浦东机场的名字"浦东"意为"黄浦江以东"，它建在长江入海口的滩涂上，是**通过围海造地**从一片滩涂上"长"出来的超级枢纽哦。
================================= Tool Message =================================
Name: search_venues

我已完成多轮搜索与对比。以下是针对**上海100位宾客（约10桌）婚礼场地**的分析与最佳推荐。

---

## 📊 评估标准
1. **价格**（最低优先）
2. **容量**（完全匹配100人 = 10桌）
3. **评价**（最高优先）

---

## 🏆 最佳推荐：摩可纳婚礼艺术中心（宝山区）

| 项目 | 详情 |
|------|------|
| **容量** | ⭐**完全匹配**——馆内设"肯特庄园""璀璨之光"等**最大10桌**的宴会厅，正好容纳100位宾客 |
| **价格** | 约 **¥2,698/桌起**（10桌约 ¥2.7万起），属上海同规格中**偏低**价位 |
| **评价** | ⭐**5.0分**（婚礼纪2025上海婚礼会馆排名最高档） |
| **地址** | 宝山区呼兰西路123号 |
| **优势** | 上海单体最大婚礼殿堂（超30,000㎡），一站式服务（含婚宴+婚庆+四大金刚），花园洋房风格 |

> **三项标准综合最优**：拥有正好10桌的厅（容量完全匹配）、价格在高端婚礼会馆中最低、评分5.0最高。

---

## 🥈 其他优质候选对比

| 场地 | 容量（桌） | 价格 | 评分 | 匹配度 |
|------|-----------|------|------|--------|
| **圣诺莉婚礼艺术中心**（浦东） | 15–60桌 | ¥2,688/桌起 | 5.0分 | 价格最低、评分高，但最小15桌（偏大） |
| **曼格纳婚礼艺术中心**（大宁店/杨浦店） | 8–25桌 / 5–46桌 | ¥6,888/桌起 | 5.0分 | 容量匹配，但价格偏高 |
| **上海瑞金洲际酒店**（黄浦区） | 10–40桌 | ¥8,888/桌起 | 5.0分 | 容量匹配、花园洋房，但价格最高 |
| **静安区某五星级酒店**（雅高集团/近火车站） | 12–16桌 | ¥5,888/桌起（餐标3,988起） | — | 性价比高 |
| **上海大厦**（外滩） | 80–100人（Belle Vue西餐厅自助婚宴） | — | — | **人数精确匹配100人** |

---

## 💡 结论与建议

**首选：摩可纳婚礼艺术中心**
- 唯一同时满足「恰好10桌（100人）容量」+「5.0最高评分」+「价格处于低位」三项标准；
- 一站式的模式可省去另找婚庆、摄影、化妆的额外开支，实际总成本更低。

**备选：**
- 若更看重**绝对低价** → 圣诺莉婚礼艺术中心（¥2,688/桌起，5.0分）
- 若更看重**外滩地段/五星级酒店** → 上海瑞金洲际酒店（10桌起，¥8,888/桌起）
- 若要有**历史地标体验** → 上海大厦（Belle Vue西餐厅，80–100人自助婚宴，人数精确匹配）

⚠️ **温馨提示**：上述价格为宣传起价（通常不含酒水及服务费），实际报价因档期、菜单档位而异，建议预订前**电话确认最终每桌价格、最低桌数及是否含服务费**，并将优惠项写入合同。
================================= Tool Message =================================
Name: suggest_playlist

I've curated a jazz wedding playlist from the database. Here's your perfect jazz-style wedding playlist, organized by the flow of the evening:

## 🎷 Jazz Wedding Playlist

### Cocktail Hour — Bossa Nova (elegant, romantic, background-friendly)
| # | Track | Artist | Length |
|---|-------|--------|--------|
| 1 | Garota De Ipanema (The Girl from Ipanema) | Antônio Carlos Jobim | 4:45 |
| 2 | Corcovado (Quiet Nights Of Quiet Stars) | Antônio Carlos Jobim | 3:26 |
| 3 | Desafinado | Antônio Carlos Jobim | 3:05 |
| 4 | Dindi | Antônio Carlos Jobim | 4:13 |
| 5 | Fotografia | Antônio Carlos Jobim | 2:09 |
| 6 | Outra Vez | Antônio Carlos Jobim | 2:06 |

### Dinner — Jazz Ballads & Standards (romantic classics)
| # | Track | Artist | Length |
|---|-------|--------|--------|
| 7 | My Funny Valentine (Live) | Miles Davis | 15:08 |
| 8 | Someday My Prince Will Come | Miles Davis | 9:04 |
| 9 | 'Round Midnight | Miles Davis | 5:57 |
| 10 | Summertime | Miles Davis | 3:20 |
| 11 | Time After Time | Miles Davis | 3:41 |
| 12 | My Ship | Miles Davis | 4:28 |
| 13 | The Duke | Miles Davis | 3:35 |
| 14 | I Don't Wanna Be Kissed (By Anyone But You) | Miles Davis | 3:11 |

### First Dance / Slow Moments — Smooth Jazz
| # | Track | Artist | Length |
|---|-------|--------|--------|
| 15 | Love Is The Colour | Incognito | 4:12 |
| 16 | As We Sleep | Spyro Gyra | 5:17 |
| 17 | Believe | Spyro Gyra | 5:11 |
| 18 | Song For Lorraine | Spyro Gyra | 4:00 |
| 19 | Morning Dance | Spyro Gyra | 3:59 |

### Reception Dancing — Swing
| # | Track | Artist | Length |
|---|-------|--------|--------|
| 20 | How High The Moon | Gene Krupa | 3:21 |
| 21 | Imagination | Gene Krupa | 4:49 |
| 22 | Don't Take Your Love From Me | Gene Krupa | 4:42 |

---

## 💰 Playlist Summary

- **Total tracks:** 22 songs
- **Total duration:** 6,220,634 ms = **103.68 minutes** (≈ 1 hour 44 minutes)
- **Total cost:** 22 × $0.99 = **$21.78**

This playlist blends **bossa nova** for the elegant cocktail hour, **timeless jazz ballads** for dinner, **smooth jazz** for the intimate first-dance moments, and **upbeat swing** to get guests dancing — all drawn exclusively from the Jazz genre (GenreId 2) in the database.

Would you like me to adjust the length, swap out any tracks, or add more upbeat swing numbers for the dance floor?
================================== Ai Message ==================================

三位专家Agent都已返回结果，以下是我为您设计的**完美爵士婚礼方案** 🎷💍

---

# 💒 北京 → 上海 · 100人爵士主题婚礼方案

## ✈️ 一、宾客交通（旅行Agent）
**推荐航班：CA8341 · 国航**
| 项目 | 详情 |
|------|------|
| 航线 | 北京大兴（PKX）→ 上海浦东（PVG） |
| 时间 | 10月17日（周六）22:00 → 23:45 |
| 时长 | **1小时45分钟（全程最短）** |
| 价格 | **¥536**（经济舱，仅比最低价贵3元） |

> 💡 若纯追低价，可选 15日 MU5231（东航），¥533。

## 🏛️ 二、婚礼场地（场地Agent）
**首选：摩可纳婚礼艺术中心（宝山区呼兰西路123号）**
| 项目 | 详情 |
|------|------|
| 容量 | ⭐最大10桌宴会厅，**恰好容纳100位宾客** |
| 价格 | **¥2,698/桌起**（10桌约¥2.7万起，同规格偏低） |
| 评分 | ⭐**5.0分**（婚礼纪上海婚礼会馆排名最高档） |
| 特色 | 上海单体最大婚礼殿堂（30,000㎡+），花园洋房风，一站式服务 |

**备选方案：**
- 💰 **绝对低价** → 圣诺莉婚礼艺术中心（浦东，¥2,688/桌起，5.0分）
- 🌆 **外滩地段/五星级** → 上海瑞金洲际酒店（¥8,888/桌起）
- 🏙️ **历史地标体验** → 上海大厦 Belle Vue 西餐厅（80–100人自助婚宴）

## 🎵 三、爵士播放列表（播放列表Agent）
共 **22首**，总时长约 **1小时44分钟**，按流程编排：

| 环节 | 风格 | 代表曲目 |
|------|------|----------|
| 🍸 **鸡尾酒会** | Bossa Nova | The Girl from Ipanema、Corcovado、Desafinado |
| 🍽️ **晚宴** | Jazz Ballads | My Funny Valentine、'Round Midnight、Summertime |
| 💃 **首支舞** | Smooth Jazz | Love Is The Colour、Morning Dance |
| 🎉 **迎宾舞会** | Swing | How High The Moon、Imagination |

---

## 🎯 完美婚礼一日流程建议

| 时间 | 环节 |
|------|------|
| 10月16日晚 | 宾客搭乘航班抵达上海，入住酒店 |
| 10月17日 下午 | 摩可纳婚礼艺术中心布置、彩排 |
| 傍晚 | 宾客签到，Bossa Nova 鸡尾酒会迎宾 |
| 晚间 | 爵士晚宴 + 首支舞 + Swing 舞会 |
| 深夜 | 22:00 后航班返程方便（如需当日往返） |

---

✨ **一句话总结**：从北京直飞上海（1h45m，¥536）→ 在5.0分、恰好10桌的摩可纳艺术中心办一场爵士婚礼 → 用Bossa Nova开场、Jazz Ballad晚宴、Swing舞会收尾，优雅又浪漫！

需要我帮您**预订航班**、**联系场地**，或**调整播放列表**（比如增加更多欢快的Swing曲目）吗？🎷
```
