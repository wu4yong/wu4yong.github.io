---
title: JavaScript周刊-16
date: 2018-03-21 18:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 773: 2026年2月17日

## [TanStack Hotkeys: 类型安全的跨平台快捷键库](https://tanstack.com/hotkeys/latest)

![tanstack-hotkeys](@@CDN@@/assets/img/web/JavaScriptWeekly16/img-01.webp)

[TanStack 家族](https://tanstack.com/) 迎来了新成员：*Hotkeys*，一个处于 alpha 阶段的通用键盘交互工具包。它处理跨环境的兼容性问题，支持多步骤序列（如 Vim 命令或秘籍指令），并且可以录制用户的快捷键。[这里是完整的介绍。](https://tanstack.com/hotkeys/latest/docs/overview)

*TanStack LLC*

💡 目前处于 alpha 阶段，文档主要关注 React，但它并不限于 React，他们正在寻找 Solid、Angular、Svelte 和 Vue 适配器的帮助。

---

<div style="float:right; margin-left:16px; margin-bottom:8px;">
  <img  src="@@CDN@@/assets/img/web/JavaScriptWeekly16/img-02.webp" width="110">
</div>

## [还在手动编写测试？Meticulous AI 来了](https://www.meticulous.ai?utm_source=jsweekly&utm_medium=newsletter&utm_campaign=26q1&utm_content=primary)

Notion、Dropbox、Wiz 和 LaunchDarkly 已经发现了一种新的测试范式——他们无法想象没有它的工作方式。Meticulous 由前 Palantir 工程师构建，能够自主创建持续演进的 E2E UI 测试套件，以零开发者投入提供近乎详尽的覆盖率。

*Meticulous 赞助*

## [TypeScript 6.0 Beta 发布](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0-beta/)

v6.0 在很大程度上是一个*"清理你的 tsconfig"*的版本，旨在为今年晚些时候推出的 [Go 驱动的原生 TypeScript 7](https://devblogs.microsoft.com/typescript/progress-on-typescript-7-december-2025/) 搭建过渡桥梁。需要注意一些调整，比如 `types` 默认为 `[]`，`--strict` 现在默认为 true，此外还有[更多的破坏性变更和弃用。](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0-beta/#breaking-changes-and-deprecations-in-typescript-6.0)

*Microsoft*

## 简讯

- 📊 紧随最近的 State of JS 调查结果之后，[State of React 2025 结果也发布了。](https://2025.stateofreact.com/en-US)

- 🤖 [Google 展示了 WebMCP 的预览](https://developer.chrome.com/blog/webmcp-epp)，尝试为网站提供标准方式，让 AI 智能体可以使用网站提供的能力。

## 版本发布

- [Biome 2.4](https://biomejs.dev/blog/biome-v2-4/) – 该格式化/代码检查工具现在可以处理 JS 文件中嵌入的 CSS 和 GraphQL，改进了 Vue 和 Svelte 支持，并添加了 HTML 可访问性检查规则。

- [React Native 0.84](https://reactnative.dev/blog/2026/02/11/react-native-0.84) – Hermes V1 现在是 iOS 和 Android 上的默认 JS 引擎，iOS 提供预编译的二进制文件，并搭载 React 19.2.3。

- [Node.js 25.6.1 (Current)](https://nodejs.org/en/blog/release/v25.6.1) 和 [Node.js 24.13.1 (LTS)](https://nodejs.org/en/blog/release/v24.13.1)

- [sql.js v1.14.0](https://sql.js.org/) – 编译为 JavaScript 的 SQLite。

## 📖 文章和视频

### [CodeMirror 实验](https://aziis98.com/blog/codemirror-review-tool/)

![codemirror](@@CDN@@/assets/img/web/JavaScriptWeekly16/img-03.webp)

[CodeMirror](https://codemirror.net/) 是目前最强大的代码编辑器组件之一*（我们在重建自己的通讯编辑器的过程中就在使用它！）*，而且它还具有极强的*可扩展性*，正如这篇构建类似 VSCode 的"变更审查"功能的教程所展示的那样。

*Antonio De Lucreziis*

---

### [如何在 Node.js 中发起 HTTP 请求](https://nodejsdesignpatterns.com/blog/nodejs-http-request/)

一份关于在生产环境中使用 `fetch` 的全面指南，涵盖了超时处理、流式请求和响应、重试、并发、模拟等主题。大部分内容也适用于更广泛的 JavaScript 场景。

*Luciano Mammino*

---

### [一个数据库搞定事务和分析，无需管道](https://www.tigerdata.com/timescaledb?utm_source=cooperpress&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

TimescaleDB 扩展了 Postgres，使分析可以在实时数据上运行——无需同步延迟、无数据漂移、无需第二套系统。[免费试用。](https://www.tigerdata.com/timescaledb?utm_source=cooperpress&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

*Tiger Data (TimescaleDB 的创建者) 赞助*

---

### [在十亿行规模上实现虚拟滚动](https://rednegra.net/blog/20260212-virtual-scroll/)

一篇关于构建能够处理数十亿行数据的表格组件（[HighTable](https://github.com/hyparam/hightable)）所面临诸多挑战的深入教程。

*Sylvain Lesage*

---

### [JS 重量级架构与长期性能目标不兼容](https://sgom.es/posts/2026-02-13-js-heavy-approaches-are-not-compatible-with-long-term-performance-goals/)

Automattic 的一位 Web 性能工程师论证了反对 JS 重量级架构、支持更以服务器为中心的方法的理由。

*Sérgio Gomes*

---

### 更多文章

- 📄 [TypeScript 泛型的乐趣](https://frontendmasters.com/blog/fun-with-typescript-generics/) – 不是典型的入门教程，而是深入探讨一个小众用例。 *Adam Rackis*

- 📄 [构建坚不可摧的 React 组件](https://shud.in/thoughts/build-bulletproof-react-components) – 来自 [SWR](https://swr.vercel.app/) 联合创建者的优雅、务实的技巧。 *Shu Ding*

- 📄 [Rolldown 如何工作：使用位集逻辑实现高性能代码分割](https://www.atriiy.dev/blog/rolldown-high-performance-code-splitting) *Atriiy*

- 📄 [Angular 绑定：它们是什么以及如何使用？](https://spin.atomicobject.com/what-are-angular-bindings/) *Bo French*

## 🛠 代码与工具

### [Electrobun v1: 基于 Bun 的桌面应用方案](https://blackboard.sh/blog/electrobun-v1/)

一个跨平台的 JS/TS 桌面应用运行时介绍。它使用操作系统的默认 Web 渲染器（类似 [Neutralinojs](https://neutralino.js.org/)），底层以 [Bun](https://bun.sh/) 作为引擎和打包工具。生成的打包文件小至 12MB。（[主页](https://blackboard.sh/electrobun/docs/)和 [GitHub 仓库](https://github.com/blackboardsh/electrobun)。）

*Blackboard*

💡 Electrobun 的创建者[▶️ 在这段 4 分钟的视频中进行了演示。](https://www.youtube.com/watch?v=Z4dNK1d6l6E)

---

### [Console Ninja: 内联日志与更智能的调试](https://console-ninja.com/?utm_source=cooperpress&utm_medium=javascriptweekly&utm_content=javascriptweekly)

在你的代码旁边查看控制台输出、运行时数据和错误，并与你的 AI 共享。v2 版本经过重新思考、重新设计和重新构建，提供更快的 JavaScript 调试工作流。

*Wallaby Team 赞助*

---

### [fetch-network-simulator: 拦截 `fetch` 以模拟恶劣网络条件](https://github.com/thisiskps/fetch-network-simulator)

其核心是一个拦截 `fetch` 并应用规则的库，可以实现随机丢弃请求、延迟请求或减慢请求速度等功能，让你能够测试应用的弹性。

*Karn Pratap Singh*

---

### [Peek: 一个用于智能页面头部行为的轻量级库](https://adesignl.github.io/Peek/)

你可以在页面上直接看到效果。它的"智能"之处在于能够区分微小无关的滚动和有意为之的滚动。你可以自定义阈值和延迟，并且它适用于任何框架。[GitHub 仓库](https://github.com/adesignl/Peek)。

*Chad Pierce*

---

### 🏎️ [Rari: 运行时加速渲染基础设施](https://rari.build/)

一个 React Server Components 框架，但使用 Rust 驱动的服务端运行时，旨在实现更高的吞吐量和更低的延迟。[入门指南](https://rari.build/docs/getting-started)将帮助你了解其基本思路。

*Ryan Skinner*

---

### [Broad Infinite List: 适用于 React 和 Vue 的双向无限列表](https://suhaotian.github.io/broad-infinite-list/)

平滑地双向流式加载日志、动态更新或聊天记录，不会产生布局偏移。

*suhaotian*

---

### 更多工具

- 📊 [Perspective 4.2](https://github.com/perspective-dev/perspective) – 用于大型/流式数据集的交互式分析和数据可视化组件。

- [Dockview 5.0](https://dockview.dev/) – 零依赖的布局管理器，支持选项卡、分组、网格和分割视图。

- ♟️ [Stockfish.js 18](https://github.com/nmrugg/stockfish.js) – Stockfish 国际象棋引擎的 WASM 移植版，可在 JavaScript 中使用。

- [Ohm 17.5](https://github.com/ohmjs/ohm) – 用于构建解析器、解释器等的解析工具包。

## 📢 生态系统其他动态

### 🎨 [DPaint.JS v0.2.0 发布](https://dpaint.app/)

![dpaint](@@CDN@@/assets/img/web/JavaScriptWeekly16/img-04.webp)

三年前我们曾介绍过 [DPaint.JS](https://dpaint.app/)，一个模仿传奇的 1980 年代 Amiga 和 PC 图形编辑器 *Deluxe Paint* 的 Web 图像编辑器。许多类似的业余项目最终会逐渐消失，但 DPaint 没有！经过两年的开发，[v0.2.0 已发布](https://dpaint.app/docs/#history)，支持动画、手写笔、纹理画笔等功能。

---

### 🌐 [almostnode: 浏览器中的 Node.js 运行时](https://almostnode.dev/)

[almostnode](https://almostnode.dev/) 是一个实验性项目，将 Node.js 运行时环境带入浏览器。首页的演示非常有趣。

---

### 📊 [现代 CSS 使用情况报告](https://www.projectwallace.com/the-css-selection/2026)

来自超过 10 万个网站的数据被汇总成[这份有用的现代 CSS 使用情况报告。](https://www.projectwallace.com/the-css-selection/2026) 每个网站 CSS 规则的中位数为 2,802 条，有一个页面竟然使用了 210,695 条规则！

---

### 🕹️ [Three.js 版 Descent](https://mrdoob.github.io/three-descent/)

不满足于仅仅[将 Quake 移植到浏览器中运行](https://mrdoob.github.io/three-quake/)，Three.js 的创建者现在[也尝试移植了 *Descent*](https://mrdoob.github.io/three-descent/)（[源码](https://github.com/mrdoob/three-descent)）。

---

### 🤖 [能否用一组智能体重现类似 SQLite 的东西？](https://kiankyars.github.io/machine_learning/2026/02/12/sqlite.html)

Kian Kyars 作为智能体协调实验的一部分进行了尝试。

---

### ☁️ [Cloudflare 推出面向智能体的 Markdown 功能](https://blog.cloudflare.com/markdown-for-agents/)

Cloudflare 正在推出[一项允许智能体直接从 Cloudflare 驱动的网站获取 Markdown 的功能](https://blog.cloudflare.com/markdown-for-agents/)。

---

*原文链接：[JavaScript Weekly Issue 773](https://javascriptweekly.com/issues/773)*
