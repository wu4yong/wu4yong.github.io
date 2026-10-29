---
title: 一、SpringAi特性介绍
date: 2026-10-26 01:00:00
categories:
  - ai
tags:
  - Spring AI
---
<div class="essay-banner essay-image11">
    Spring AI Features
</div>

## 介绍

<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch01_springai_intro.png" alt="ch01_springai_intro.png"></div>

Spring AI 是一个面向人工智能工程的应用框架。解决了 AI 集成的基本挑战：将企业数据和API与AI 模型连接起来。

### 特性：

#### 提示词工厂
可以说是大模型应用中最简单也是最核心的一个技术。他是我们更大模型交互的媒介，提示词给的好大模型才能按你想要的方式响应。

#### 对话拦截advisors
<div class="img-wrap-left"><img class="left-img" src="/assets/img/springai/ch01_advisors_arch.png" alt="ch01_advisors_arch.png"></div>

面向切面的思想对对模型对话和响应进行增强。

#### 对话记忆
通过一个bean组件就可以让大模型拥有对话记忆功能，可谓是做到了开箱即用

```plain
@Autowired
ChatMemoryRepository chatMemoryRepository;
```

#### tools
让大模型可以跟企业业务API进行互联 ，这一块实现起来也是非常的优雅

```plain
class DateTimeTools {

    @Tool(description = "Get the current date and time in the user's timezone")
    String getCurrentDateTime() {
        return LocalDateTime.now().atZone(LocaleContextHolder.getTimeZone().toZoneId()).toString();
    }

}
```

#### RAG技术下的 ETL
让大模型可以跟企业业务数据进行互联（包括读取文件、分隔文件、向量化） 向量数据库支持 目前支持20+种向量数据库的集成 这块我到时候也会详细去讲

#### MCP
让tools外部化，形成公共工具让外部开箱即用。 原来MCP协议的JAVA SDK就是spring ai团队提供的 提供了MCP 客户端、服务端、以及[MCP认证授权方案](https://spring.io/blog/2025/05/19/spring-ai-mcp-client-oauth2) ，还有目前正在孵化的[Spring MCP Agent](https://github.com/tzolov/spring-mcp-agent) 开源项目:

#### 模型的评估
可以测试大模型的幻觉反应(`在系列课详细讲解`）

#### 可观察性
它把AI运行时的大量关键指标暴露出来， 可以提供Spring Boot actuctor进行观测(`在系列课详细讲解`）

#### agent应用
springai 提供了5种agent模式的示例

1. [Evaluator Optimizer](https://github.com/spring-projects/spring-ai-examples/tree/main/agentic-patterns/evaluator-optimizer) – The model analyzes its own responses and refines them through a structured process of self-evaluation.
2. [Routing](https://github.com/spring-projects/spring-ai-examples/tree/main/agentic-patterns/routing-workflow) – This pattern enables intelligent routing of inputs to specialized handlers based on classification of the user request and context.
3. [Orchestrator Workers](https://github.com/spring-projects/spring-ai-examples/tree/main/agentic-patterns/orchestrator-workers) – This pattern is a flexible approach for handling complex tasks that require dynamic task decomposition and specialized processing
4. [Chaining](https://github.com/spring-projects/spring-ai-examples/tree/main/agentic-patterns/chain-workflow) – The pattern decomposes complex tasks into a sequence of steps, where each LLM call processes the output of the previous one.
5. [Parallelization](https://github.com/spring-projects/spring-ai-examples/tree/main/agentic-patterns/parallelization-worflow) – The pattern is useful for scenarios requiring parallel execution of LLM calls with automated output aggregation.

 学完这5种你会对对模型下的agent应用有一个完整认识(`在系列课详细讲解`）

## langchain4j vs springAI

|   | langchain4j | SpringAI |
|---|---|---|
| 生态 | 不依赖Spring，需要单独集成Spring | Spring官方，和Spring无缝集成 |
| 诞生 | 更早，中国团队，受 LangChain 启发 | 稍晚，但是明显后来居上 |
| jdk | v0.35.0 前的版本支持jdk8 ，后支持jdk17 | 全版本jdk17 |
| 功能 | 没有mcp server, 官方建议使用[quarkus-mcp-server](https://github.com/quarkiverse/quarkus-mcp-server) | 早期落后langchain4j， 现在功能全面，并且生态活跃，开源贡献者众多 |
| 易用性 | 尚可，中文文档 | 易用，api优雅 |
| 最终 | 不需要spring选择！ | 无脑选！ |
