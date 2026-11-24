---
title: JavaScript周刊-11
date: 2018-03-19 08:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## January 13, 2026

![Web 依赖管理问题](@@CDN@@/assets/img/web/JavaScriptWeekly11/img-01.webp)

## Web 依赖管理已经崩溃，我们能修复吗？

[Web 依赖管理已经崩溃，我们能修复吗？（Web Dependencies are Broken; Can We Fix Them?）](https://javascriptweekly.com/link/179113/web) — Lea 多年来一直在 Web 标准的核心工作，她提出了一个引人注目的（且具有教育意义的）行动呼吁，关于每个 JavaScript 开发者都遇到过的问题：为什么管理依赖项并将它们引入代码如此不必要地混乱，我们能做些什么？Lea Verou

## 像 Apple 一样构建营销网站（赞助）

[像 Apple 一样构建营销网站（Build Marketing Sites Like Apple）](https://javascriptweekly.com/link/179112/web) — 从在最高水平上做这件事的人那里学习如何构建现代、高影响力的营销网站。Vercel 的设计工程师 Matias Gonzales 教授 GSAP 动画、滚动驱动的叙事、Three.js 3D 以及在获奖网站上使用的性能优先技术。Frontend Masters 赞助

**简讯：**

- 📺 [React Conf 2025 的完整视频集](https://javascriptweekly.com/link/179114/web) 现已上线，包括 25 场演讲和 23 场访谈，其中包括 [与核心团队四位成员的访谈](https://javascriptweekly.com/link/179115/web)。
- 在 Deno 与 Oracle 的 JavaScript 商标争议中有 [一个小更新](https://javascriptweekly.com/link/179116/web)，Oracle 请求并 Deno 同意延期 60 天。目前来看，这个案件将拖到 2027 年。
- 📘 [《简明 TypeScript 手册》（The Concise TypeScript Book）](https://javascriptweekly.com/link/179117/web) 是一本简短、专注的 TypeScript 指南，开放且免费阅读。

**发布：**

- [Node.js 2026 年 1 月 13 日安全发布](https://javascriptweekly.com/link/179118/web) – 期待已久的 Node.js v20.x、22.x、24.x 和 25.x 的安全版本，解决了五个不同的漏洞。
- [Bun v1.3.6](https://javascriptweekly.com/link/179119/web) – Bun.Archive 现在可以处理 tar 归档，Bun.JSONC 支持解析带注释的 JSON，还有许多性能优化和调整。
- [pnpm 10.28](https://javascriptweekly.com/link/179120/web) – 这个高效的包管理器添加了 beforePacking 钩子，可以在发布时自定义 package.json 的内容。
- Angular 21.1 预计本周发布。[v21.1 rc0 上周发布](https://javascriptweekly.com/link/179121/web)，预告了一些更新。
- [Ember 6.9](https://javascriptweekly.com/link/179122/web)、[ESLint v10.0.0 RC0](https://javascriptweekly.com/link/179123/web)、[Rspack 1.7](https://javascriptweekly.com/link/179124/web)

## 📖 文章和视频

[Date 已过时，Temporal 来了](https://javascriptweekly.com/link/179125/web) — [Temporal API](https://javascriptweekly.com/link/179126/web) [多年来](https://javascriptweekly.com/link/179127/web) 一直被承诺作为解决 JavaScript Date 弱点的未来 API，但最终这个未来正在到来。Mat 通过大量示例展示了 Date 的弱点并推广 Temporal 的优势。Mat "Wilto" Marquis

💡 Temporal 的 [浏览器支持](https://javascriptweekly.com/link/179128/web) 仍然看起来很弱，但 [Chrome 144](https://javascriptweekly.com/link/179129/web) – 本周正式推出 – 带来了完整支持。[Temporal Polyfill](https://javascriptweekly.com/link/179130/web) 也提供了一个权宜之计，同时原生支持在增长。

[JavaScript 日期计算能错到什么程度？](https://javascriptweekly.com/link/179131/web) — _"这是我遇到的一个问题的故事，一旦 Temporal 更广泛，处理起来会容易得多。"_ Phil Nash

[无需重建 OAuth 即可添加 GitHub、Slack 和 Google 集成](https://javascriptweekly.com/link/179132/web) — WorkOS Pipes 处理 OAuth 流程、令牌刷新和存储。用户通过小部件连接，您的应用只需一个 API 调用。WorkOS 赞助

[停止将所有东西转换为数组（并减少工作量）](https://javascriptweekly.com/link/179133/web) — 一篇展示 [_迭代器助手_](https://javascriptweekly.com/link/179134/web) 的文章，这是一组广泛支持的用于处理 Iterator 对象的方法，作为以迭代（而不是随机访问）方式惰性处理数据的更高效方式。Matt Smith

[如何"窃取"任何 React 组件](https://javascriptweekly.com/link/179135/web) — 探讨如何在没有原始源代码的情况下，使用 React 的内部数据结构（通过 [Fiber](https://javascriptweekly.com/link/179136/web)）和 LLM 重建生产 React 应用中的组件。David Fant

📄 [JavaScript 的 for-of 循环实际上很快](https://javascriptweekly.com/link/179137/web) Suren Enfiajyan

📄 [为什么 ARM 有一个"JavaScript 指令"](https://javascriptweekly.com/link/179138/web) – 具体来说是 FJCVTZS。NotNotP

📄 [我如何使用 lit-html 编写自定义元素](https://javascriptweekly.com/link/179139/web) Dave Samaniego

📄 [document.currentScript 比我想象的更有用](https://javascriptweekly.com/link/179140/web) Chris Coyier

📄 [WebAssembly 发生了什么（以及正在发生什么）](https://javascriptweekly.com/link/179141/web) Emnudge

## 🛠 代码和工具

![memlab 2.0](@@CDN@@/assets/img/web/JavaScriptWeekly11/img-02.webp)

[memlab 2.0：用于查找 JavaScript 内存泄漏的框架](https://javascriptweekly.com/link/179142/web) — 一个用于识别内存泄漏和优化机会的测试和分析框架，源自 [Facebook 自己的方法](https://javascriptweekly.com/link/179143/web) 来优化其主应用。编写场景，memlab 比较堆快照，过滤内存泄漏，并汇总结果。Facebook Open Source

[平衡简单性和性能的时序数据库](https://javascriptweekly.com/link/179144/web) — 保持 Postgres 原生，具有自动分区、95% 压缩和生产规模的连续聚合。Tiger Data（TimescaleDB 的创建者）赞助

[Fabric.js 7.1：强大的 SVG 抽象库](https://javascriptweekly.com/link/179145/web) — 在 HTML5 canvas 之上提供交互式对象模型，使处理多个视觉元素更容易。非常适合浏览器，但也适用于 Node。Fabric.js

[Ohm：JavaScript 和 TypeScript 的解析工具包](https://javascriptweekly.com/link/179166/web) — 自从我们上次介绍这个项目以来已经过去几年了，它已经有了很大进展。这是一个用于构建基于 PEG 的解析器的库，您可以在解释器、编译器、分析工具等中使用，您甚至可以 [在线使用其语法](https://javascriptweekly.com/link/179167/web)。Warth、Dubroy 等人

[Superdiff 3.2：比较两个数组或对象并返回差异](https://javascriptweekly.com/link/179146/web) — 有两个相似的对象或数组，想要查看底层差异？Superdiff 最近的更新提升了性能，增加了对流式输入的支持，并使用 worker 在单独的线程中进行更高效的差异比较。antoine

[JavaScriptKit 0.38](https://javascriptweekly.com/link/179147/web) – 通过 WebAssembly 与 JavaScript 交互的 Swift 框架。

🎵 [alphaTab 1.8](https://javascriptweekly.com/link/179148/web) – 乐谱和吉他谱渲染库。

[Neo.mjs v11.20](https://javascriptweekly.com/link/179149/web) – Web 的多线程应用引擎。

[Monio 0.70.0](https://javascriptweekly.com/link/179150/web) – Kyle Simpson 的 IO monad 实现。

[Ant Design 6.2](https://javascriptweekly.com/link/179151/web) – UI 设计语言和 React UI 库。

[xstyled 4.1](https://javascriptweekly.com/link/179152/web) – React 的实用优先 CSS-in-JS 框架。

[Jint 4.5](https://javascriptweekly.com/link/179153/web) – .NET 的 JavaScript 解释器。

## 📰 分类广告

⚡️使用 [STRICH](https://javascriptweekly.com/link/179154/web) 为您的 Web 应用添加超快的条形码和二维码扫描，这是一个精简的 JS 库。简单、可预测的定价。[免费试用和演示！](https://javascriptweekly.com/link/179154/web)

只有傻瓜才手写测试 – Notion、Dropbox 和 Lattice 等现代工程团队使用 [Meticulous](https://javascriptweekly.com/link/179155/web) 来维护 E2E UI 测试，[覆盖 Web 应用的每个边缘情况](https://javascriptweekly.com/link/179155/web)。

🚀 Auth0 for AI Agents 是构建更安全的 AI 代理的完整身份验证解决方案。[今天开始构建](https://javascriptweekly.com/link/179156/web)。

## 📢 生态系统中的其他地方

🤖 [即使 Linus Torvalds 现在也在"氛围编码"](https://javascriptweekly.com/link/179157/web)。他一直在使用 Google 的 Antigravity 工具来 [创建一些数字音效](https://javascriptweekly.com/link/179158/web)。

[GitHub 计划在 2026 年为 npm 包实现"分阶段发布"](https://javascriptweekly.com/link/179168/web)，作为在发布上线之前引入审查步骤的一种方式。

🗓️ [Astro 团队分享](https://javascriptweekly.com/link/179159/web) 了一篇完整的 2025 年回顾文章。对于这个流行的框架来说，这是重要的一年。

Anil Dash 分享了 [Markdown 如何占领世界的故事](https://javascriptweekly.com/link/179160/web)。

[*State of HTML 2025* 调查的结果](https://javascriptweekly.com/link/179161/web) 现已公布。

TIL JavaScript 运行时 Deno [正在 Python 的 PyPI 上分发](https://javascriptweekly.com/link/179162/web)，以便 Python 应用在需要时更容易调用 JavaScript。

2025 年，[Bun 是 JavaScriptCore 的第三大贡献者](https://javascriptweekly.com/link/179163/web)，JavaScriptCore 是为 Safari 和 Bun 提供动力的 JavaScript 引擎。

---

_原文链接：[JavaScript Weekly #768](https://javascriptweekly.com/issues/768)_
