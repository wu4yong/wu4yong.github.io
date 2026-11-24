---
title: JavaScript周刊-32
date: 2018-03-28 14:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 789: 2026年6月9日

## [VoidZero 加入 Cloudflare](https://voidzero.dev/posts/voidzero-cloudflare)

![voidzero-cloudflare](@@CDN@@/assets/img/web/JavaScriptWeekly32/img-01.webp)

今年 JS 工具链领域的重大变动之一，由 Evan 本人亲自讲述。他创立来构建 Vite、Vitest、Rolldown、Oxc 等的公司正在加入 Cloudflare。他坦率地解释了原因（商业化很难）。好消息是：所有项目保持 MIT 许可，Evan 和团队继续掌舵。

*Evan You*

---

## [POSETTE：PostgreSQL 演讲盛会 — 虚拟且免费](https://posetteconf.com/2026)

参加 POSETTE: An Event for Postgres 2026（6 月 16-18 日）中关于 PostgreSQL 支持的应用程序开发的演讲。在线参与，直接与 PostgreSQL 演讲者、其他开发者和用户聊天。还有小礼物等着你。注册获取更新。

*Microsoft | AMD 赞助*

## [Angular v22 发布](https://blog.angular.dev/announcing-angular-v22-c52bb83a4664)

Google 的"全家桶"框架将三大功能推进到稳定/生产就绪状态：[Signal 表单](https://angular.dev/essentials/signal-forms)、[Angular Aria](https://angular.dev/guide/aria/overview) 和[异步响应式编程](https://angular.dev/guide/signals/resource)。路由器还新增了对原生浏览器 [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API) 的实验性支持。

*Angular 团队*

## 简讯

- Safari 27（beta）在 WWDC 上宣布，[包含一个符合标准的 ESM 加载器重写](https://webkit.org/blog/17967/news-from-wwdc26-webkit-in-safari-27-beta/#javascript)，改进了顶层 `await` 支持，并[新增了 WebAssembly 中的 JSPI](https://webkit.org/blog/17967/news-from-wwdc26-webkit-in-safari-27-beta/#webassembly)（JavaScript Promise 集成）支持。

- [Electron 43 进入 Beta 阶段](https://github.com/electron/electron/releases/tag/v43.0.0-beta.1)，性能大幅提升，得益于嵌入式 Node.js 快照、缓存为 V8 字节码的包以及主二进制文件的链接时优化。

- [*React Compiler* 的 Rust 移植版](https://github.com/facebook/react/pull/36173#issuecomment-4608356402)已准备好测试（Meta 已经看到了*"极好的结果*"）——即将被合并。

## 版本发布

- [TanStack Table v9 Beta](https://tanstack.com/blog/tanstack-table-v9-taking-form) – 用于创建数据表格的强大无头引擎，支持 React、Preact、Solid、Vue、Angular、Svelte 和 Lit。

## 📖 文章和视频

### [现代工程价值观](https://cpojer.net/blog/modern-engineering-values)

*"我简直不敢相信我曾经是手写代码的！"* Jest 和 Fate 的创建者表示，随着智能体编写更多软件，重要的工程价值观也在发生变化，所有权、品味以及严格但快速的反馈循环成为了核心。

*Christoph Nakazawa*

---

### ["我希望 Deno 能继续做它最擅长的事"](https://blog.hongminhee.org/i-wish-deno-would-keep-doing-what-it-does-best/)

一位 Deno 粉丝认为，追逐 Node.js/npm 兼容性正在让这个运行时失去其作为零配置、Web 标准优先、一体化二进制文件的优势。

*Hong Minhee*

---

### [你的应用在生产环境中的表现如何？](https://expo.dev/)

今天上午发布一个版本。到了今晚，你就能知道应用对任何特定用户群体是变快了、变慢了还是变差了。

*Expo 赞助*

---

### [Bun 告诉我们关于 AI 和开源的什么](https://redmonk.com/sogrady/2026/05/29/bun-ai-open-source/)

一位分析师将 Bun（其代码越来越多地由 AI 生成而非人工编写）视为一个风向标，观察 AI 编写的核心基础设施是否具有可持续性。

*Stephen O'Grady (RedMonk)*

---

## 🛠 代码与工具

### [Geometric.js: 用于几何计算的库](https://www.harryjstevens.com/geometric/)

![geometric](@@CDN@@/assets/img/web/JavaScriptWeekly32/img-02.webp)

由一位为《纽约时报》开发图形内容的人创建，这个优雅的库让你可以处理多边形、边界框、反射、插值、旋转等几何计算（[示例](https://www.harryjstevens.com/geometric/#examples)）。一个多边形是否与另一个相交？有一个专门的函数来处理。

*Harry Stevens (纽约时报)*

---

### [发布实时功能，无需第二个数据库](https://www.tigerdata.com/timescaledb?utm_source=cooperpress&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

TimescaleDB 扩展了 Postgres，用于事件数据的实时分析。无需管道、无需额外基础设施。$1000 额度。

*Tiger Data (TimescaleDB 创建者) 赞助*

---

### [Micromodal.js: 一个用于无障碍模态对话框的微型库](https://micromodal.vercel.app/)

无依赖、符合 WAI-ARIA 准则的模态对话框库。相比 `<dialog>` 提供了额外的润色，包括 Hooks、滚动锁定、进出过渡动画和点击背景关闭功能。

*Ghosh 和 Singh*

---

### 📝 [PDFSlick 4.0: 在 JS 应用中查看和交互 PDF](https://pdfslick.dev/)

一个适用于 React、Solid、Svelte 和原生 JS 应用的 PDF 查看器，从简单的 PDF 查看到处理多个大型文档及注释。[演示。](https://pdfslick.dev/)

*Vancho Stojkov*

---

### [babel-plugin-zod-hoist: 将 Zod Schema 定义提升到文件顶部](https://github.com/gajus/babel-plugin-zod-hoist)

来自 Slonik 创建者的作品，使 Zod 验证显著更快。

*Gajus Kuizinas*

---

## 📢 生态系统其他动态

### 🧬 [Mitos y Pied: 一个交互式的生物可视化实验](https://mitos-pied.vercel.app/)

![elsewhere](@@CDN@@/assets/img/web/JavaScriptWeekly32/img-03.webp)

一个有趣的 Web 实验，汇集了交互式可视化——在浏览器中即可探索的精彩内容。

---

*原文链接：[JavaScript Weekly Issue 789](https://javascriptweekly.com/issues/789)*
