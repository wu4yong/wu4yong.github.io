---
title: JavaScript周刊-41
date: 2018-04-01 11:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 798: 2026年8月11日

*与 Render 联合推出*

## [将大型 Flow Monorepo 迁移到 TypeScript](https://engineeringblog.yelp.com/2026/08/migrating-a-large-flow-monorepo-to-typescript.html)

![hwbgtoneensejphb9l4r](@@CDN@@/assets/img/web/JavaScriptWeekly41/img-01.webp)

在数年时间里，Yelp 将 140 万行代码从 [Flow](https://flow.org/) 迁移出去。这篇总结与其说是 Flow 的故事，不如说是一份适用于*任何*长期迁移的指南。就其本身而言，这是一次巨大的胜利，类型覆盖率从 83% 提升到了 96%。

*Shawn Walton (Yelp)*

💡 如果你错过了，Yelp 还写过[从 webpack 迁移到 Rspack](https://engineeringblog.yelp.com/2026/05/optimizing-our-build-times-by-migrating-from-webpack-to-rspack.html) 的文章。

<div style="float:right"><img  src="@@CDN@@/assets/img/web/JavaScriptWeekly41/img-02.webp" width="140" height="96" alt="Render" style="padding-top: 12px; padding-left: 12px;"></div>

## [Render 从前端到后端运行 JavaScript](https://dashboard.render.com/register?utm_source=email&utm_medium=newsletter&utm_campaign=2026_newsletter_cooperpress&utm_content=js_weekly)

关联你的仓库，Render 会接手后续工作。将你的 Vite 站点、Hono API、BullMQ 任务和分布式智能体工作流全部连接在同一个平台上。通过官方 Render `/plugins` 接入 Codex 和 Claude Code 中的智能体。免费开始，并按需扩展。

*Render 赞助*

## [Kitesurf：Cloudflare 面向智能体、运行于 V8 Isolate 的浏览器](https://blog.cloudflare.com/kitesurf/)

一个运行在 *Workers* 上的浏览器引擎，每个页面一个 isolate。它面向智能体而非人类，CPU 和内存占用比 Chromium 少 3-7 倍，代价是速度较慢。你现在就可以[在测试版中试用](https://kitesurf.cloudflare.app/)，它将在适当时候开源。

*Martinho、Constant、Figueira 和 Duarte (Cloudflare)*

### 简讯

- [pnpm 12 的 Rust 重写版](https://pnpm.io/blog/whats-different-in-pnpm-12)现已进入发布候选阶段，与 pnpm 11 相比只有三处不同。
- Bun 1.4 几乎每天都在 𝕏 上[被预告](https://x.com/bunjavascript/status/2085921831819858431)，预计随时发布，不过其创建者 Jarred Sumner 最近分心去[尝试解决黎曼猜想](https://www.anthropic.com/research/riemann-zeta)了。
- 🔒 `crypto-js` 中一个存在了 12 年的弱 PRNG [被用来盗取加密钱包](https://www.coinspect.com/blog/ill-bloom-investigation/)，但前提是你曾在 4.0.0 之前（2020 年！）的版本中用它生成过密钥。

### 版本发布

- [Deno 2.9.5](https://github.com/denoland/deno/releases/tag/v2.9.5) – 为 `deno compile` 和 `deno desktop` 新增了[实验性的 QuickJS 后端](https://github.com/denoland/deno/pull/36194)。
- [Node.js 26.7.0 (Current)](https://nodejs.org/en/blog/release/v26.7.0) – 新增 `--test-coverage-include-all`，修复 FFI 和 SQLite 崩溃问题，并初步支持 Perfetto 跟踪。
- [SolidStart v2](https://github.com/solidjs/solid-start/discussions/2281) – [SolidJS](https://www.solidjs.com/) 生态中相当于 Next.js 或 SvelteKit 的框架。
- [Preact 11 发布候选版](https://github.com/preactjs/preact/releases/tag/11.0.0-rc.0)、[Astro 7.2](https://astro.build/blog/astro-720/)、[Motion 13.1](https://motion.dev/)

## 📖 文章和视频

### [Baseline 如何帮助你交付更少的 JavaScript](https://www.smashingmagazine.com/2026/08/how-baseline-can-help-ship-less-javascript/)

一套针对依赖项的实用审计方法。它将依赖分组为多个集群（`Intl`、HTTP、UI 原语、`lodash`），给出在删除某个依赖前应问的问题，并通过一个替换反而让打包体积*变大*的案例（[Day.js](https://day.js.org/) → Temporal）进行演示。一个熟悉的主题被发展成严谨、可复用的审计方法。

*Jad Joubran*

---

### [让更多 npm 包在 jsDelivr ESM 模式下工作](https://www.jsdelivr.com/blog/making-more-npm-packages-work-with-jsdelivr-esm/)

[jsDelivr](https://www.jsdelivr.com/) 是一个流行的 CDN，用于在无需构建步骤的情况下将 npm 包加载到页面中。这是一次深入的技术之旅，讲解将包转换为浏览器 ESM（通过其 `/+esm` 端点）时会发生什么，以及 CommonJS 让这件事变得困难的各种方式。

*Martin Kolárik (jsDelivr)*

---

### [参加 Sentry Live：Etsy 如何保持零崩溃](https://sentry.io/resources/etsy-workshop/?utm_source=javascriptweekly&utm_medium=paid-community&utm_campaign=ecommerce-fy27q3-etsyworkshop&utm_content=newsletter-sponsored-link-register)

Sentry 和 Etsy 详细拆解他们如何为流量高峰做准备并实时调试。

*Sentry 赞助*

---

### [JavaScript 内部的渐进增强](https://remysharp.com/2026/08/05/progressive-enhancement-inside-of-javascript)

在一次火车旅程中，时断时续的数据连接让 Remy 注意到，用户可以在页面的 JavaScript 准备就绪之前就与之交互，一个巧妙的修复方法是提前绑定处理器，稍后重放用户的意图。

*Remy Sharp*

---

### 📄 [Astro 团队如何构建“软件工厂”以大幅削减 Issue 数量](https://blog.cloudflare.com/astro-issue-triage/)

由智能体驱动的分类处理让 Astro 的开放 Issue 从 200 多个减少到 30 个。

*Matthew Phillips*

---

### 📄 [调试卡住的 Node.js 进程](https://engineering.myhoai.com/posts/debugging-stuck-node-js-processes/)

一个用于捕捉事件循环中从不主动让出的阻塞的技巧。

*Winona Schroeer-Smith*

---

### 📺 [别再审查 Diff，开始审查系统](https://www.youtube.com/watch?v=Xs-U7SY2uNE)

*Kent C. Dodds*

## 🛠 代码与工具

### [celld：运行在自有 S3 存储桶上的 Durable Objects](https://celld.dev/)

来自 Deno 的、自托管的 Cloudflare Workers 和 Durable Objects 方案。V8 加 SQLite，以及 Litestream 的 LTX，通过 S3 存储桶协调，无需共识层。[GitHub 仓库](https://github.com/denoland/celld)。

*Ryan Dahl (Deno)*

😅 关于用 `workerd` 自托管 Durable Objects，Durable Objects 的创造者 Kenton Varda [在 Hacker News 上](https://news.ycombinator.com/item?id=49190321)说：“你们抢先了一步！”随后又补充道：“在这方面 celld 显然走在我们前面。毫无疑问。”

---

### [那个慢标签页不是 UI 的问题，而是查询](https://www.tigerdata.com/go/trial?utm_source=content-syndication&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

TimescaleDB 扩展了 Postgres，让查询在数据持续增长时依然快速，直接查询实时数据。[获取 $1000 额度开始使用](https://www.tigerdata.com/go/trial?utm_source=content-syndication&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)。

*Tiger Data（TimescaleDB 创建者）赞助*

---

### [hucre 1.0：零依赖的电子表格引擎](https://github.com/productdevbook/hucre)

一个 MIT 许可、可 tree-shake 的引擎，用于读写常见的电子表格格式，支持嵌入图片、超链接、密码保护和数据透视表等功能。

*Wind*

---

### [vlt 1.0：支持类 CSS 选择器的 `npm` 替代品](https://www.vlt.io/blog/1-0)

一个可直接替换 `npm` 的替代品，主要亮点是 `vlt query`，它允许你在依赖图上使用 60 多个类 CSS 选择器（其中一半与安全相关）。vlt 还提供托管的私有包注册表。

*Darcy Clarke*

---

### [TanStack Table v9：更快、更模块化的基础](https://tanstack.com/blog/announcing-tanstack-table-v9)

这个无头表格库获得了可 tree-shake 的架构，状态管理迁移到 [TanStack Store](https://tanstack.com/store/latest) 以实现[细粒度响应式](https://tanstack.com/blog/tanstack-table-v9-reactivity)，并且针对大型数据集取得了[显著的内存优化](https://tanstack.com/blog/tanstack-table-v9-memory-performance)。

*Kevin Van Cott*

### 版本发布

- [devalue 5.9](https://github.com/sveltejs/devalue) – Svelte 项目更强大的 `JSON.stringify`，支持更多 JS 语言特性。
- [Svelte Select 6.0](https://github.com/rob-balfre/svelte-select) – 一个 select/自动补全/typeahead 的 Svelte 组件。现在要求 Svelte 5。
- [fuzzysort 4.0](https://github.com/farzher/fuzzysort) – 快速、小巧的模糊搜索库，支持排名和自定义评分。
- [GTKX 1.0](https://github.com/gtkx-org/gtkx) – 用 React 和 TypeScript 构建原生 GTK4 桌面应用。
- [Belgie 0.40](https://mplemay.github.io/belgie/) – 将带权限控制的 [Deno](https://deno.com/) 运行时嵌入 Python。

## 📢 生态系统其他动态

![kkcqg7kjmncbzeusexlr](@@CDN@@/assets/img/web/JavaScriptWeekly41/img-03.webp)

- [js1024](https://js1024.fun/) 代码高尔夫大赛已结束，我们有了[三位获胜者](https://js1024.fun/results/2026)！类似*超级猴子球*（Super Monkey Ball）体验的 [Skydreams](https://js1024.fun/demos/2026/25/bar) 获得第一名。如果你想了解所用技巧，可以阅读[可读版](https://js1024.fun/demos/2026/25/source)和[压缩版](https://js1024.fun/demos/2026/25/source/m)源码。
- Docker 携 [Docker Sandboxes](https://www.docker.com/products/docker-sandboxes/) 进入智能体沙箱领域，这是一种免费方式，可以在自带 Docker 守护进程的独立 microVM 中运行编码智能体。
- MCP 随 [2026-07-28 规范](https://blog.modelcontextprotocol.io/posts/2026-07-28/)走向*无状态*，不再需要粘性会话或持续打开的流。[Cloudflare 介绍了有哪些变化](https://blog.cloudflare.com/mcp-v2/)以及迁移需要做什么。
- [scriptc](https://scriptc.dev/) 是 Vercel Labs 推出的一个实验性 TypeScript 到原生代码编译器。使用 `--dynamic` 时，不受支持或动态的部分会在内置的 QuickJS 引擎中运行。
- 📊 [_State of CSS 2026_ 调查结果](https://2026.stateofcss.com/en-US/)已发布。

本周结束后我就要去度假了，所以 8 月 25 日再见！如果你订阅了 [Node Weekly](https://nodeweekly.com/) 和 [React Status](https://react.statuscode.com/)，也可以在那里见到我…… ;-)

*原文链接：[JavaScript Weekly Issue 798](https://javascriptweekly.com/issues/798)*
