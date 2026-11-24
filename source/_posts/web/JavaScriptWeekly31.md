---
title: JavaScript周刊-31
date: 2018-03-27 23:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 788: 2026年6月2日

## [Hocuspocus 4: 为任何应用添加实时协作功能](https://tiptap.dev/docs/hocuspocus/getting-started/overview)

![hocuspocus](@@CDN@@/assets/img/web/JavaScriptWeekly31/img-01.webp)

一个基于 [Yjs](https://yjs.dev/) 的即插即用实时协作后端，让你可以快速、安全地在 JavaScript 应用中接入多用户协作体验。它可以在 Node、Bun、Deno 或 Cloudflare Workers 上运行。[GitHub 仓库。](https://github.com/ueberdosis/hocuspocus)

*Tiptap*

---

<div style="float:right; margin-left:16px; margin-bottom:8px;">
  <img  src="@@CDN@@/assets/img/web/JavaScriptWeekly31/img-02.webp" width="130">
</div>

## [还在手动编写测试？Meticulous AI 来了](https://www.meticulous.ai/?utm_source=jsweekly&utm_medium=newsletter&utm_campaign=26q2&utm_content=primary)

Notion、Dropbox、Wiz 和 LaunchDarkly 现在使用着一种他们离不开的测试范式。Meticulous 由前 Palantir 工程师构建，能够自动创建持续演进的 E2E UI 测试套件，以零开发者投入提供详尽覆盖率。

*Meticulous 赞助*

## [如何评估一个 npm 包：2026 版](https://blog.gaborkoos.com/posts/2026-05-29-How-to-Evaluate-an-npm-Package-2026-Edition/)

一份超越 Star 数量的实用审查清单，涵盖来源证明、安装脚本、CI 质量和维护者响应速度。学会在你 `npm install` 之前识别红旗信号。

*Gabor Koos*

## 简讯

- 🕒 流行的 [date-fns](https://date-fns.org/) 日期工具库正在[为 `Temporal` 驱动的未来做准备](https://date-fns.org/you-dont-need-date-fns)，将成为一个"Temporal 优先的库"。目前，一个更加精简的 [v4.4](https://github.com/date-fns/date-fns/releases/tag/v4.4.0) 已经可用，[v5.0 刚刚进入 alpha 阶段。](https://github.com/date-fns/date-fns/releases/tag/v5.0.0-alpha.0)

- 🔒 在 [Shai-Hulud 的最新爆发](https://socket.dev/blog/mini-shai-hulud-campaign-hits-red-hat-cloud-services-npm-packages)中，[数十个 Red Hat npm 包被植入了后门。](https://arstechnica.com/security/2026/06/dozens-of-red-hat-packages-backdoored-through-its-offical-npm-channel/)

- [npm 11.16.0 已发布](https://github.com/npm/cli/releases/tag/v11.16.0)，初步支持（目前仅为警告）使用 `allowScripts` 的*可选加入*安装脚本策略。[更多详情。](https://github.com/npm/cli/pull/9360)

- Svelte 团队发布了[最新的月度更新。](https://svelte.dev/blog/whats-new-in-svelte-june-2026)

## 📖 文章和视频

### 🤖 [使用 AI 以更慢的速度编写更好的代码](https://nolanlawson.com/2026/05/26/using-ai-to-write-better-code-more-slowly/)

一位多产的 JavaScript 开发者表示，LLM 不仅仅是为了快速输出糟糕的代码，它们确实可以帮助你以更慢的速度编写更高质量的代码。

*Nolan Lawson*

---

### [每个人都应该知道的 TypeScript 技巧](https://allthingssmitty.com/2026/05/27/typescript-tips-everyone-should-know/)

一组简洁的技巧，帮助你编写更安全、更干净的代码，同时也提醒你虽然 TypeScript 可以提升正确性，但它并不能保证良好的架构，也不能消除运行时 Bug。

*Matt Smith*

---

### [你的分区方案曾经很合理，然后数据变得很大](https://www.tigerdata.com/timescaledb?utm_source=cooperpress&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

TimescaleDB 扩展了 Postgres，使分析查询在大规模下保持快速。无需管道、无需第二个数据库。$1000 额度。

*Tiger Data (TimescaleDB 创建者) 赞助*

---

### [故意用 JavaScript 阻塞渲染](https://www.jayfreestone.com/writing/intentionally-blocking-rendering/)

"有时候，一个内联阻塞渲染的脚本是避免激进布局偏移的小小代价。"

*Jay Freestone*

---

### [为什么 tsgo 使用这么多内存？](https://zackradisic.substack.com/p/why-does-tsgo-use-so-much-memory)

对 Go 驱动的 TypeScript 7 编译器（tsgo）内存特性的深入分析。

*Zack Radisic*

---

## 🛠 代码与工具

### [Hocuspocus 4: 实时协作后端](https://tiptap.dev/docs/hocuspocus/getting-started/overview)

![hocuspocus2](@@CDN@@/assets/img/web/JavaScriptWeekly31/img-03.webp)

即插即用的实时协作后端，基于 Yjs，支持 Node、Bun、Deno 和 Cloudflare Workers。

*Tiptap*

---

### 📊 [Plotly 3.6: 声明式图形库](https://plotly.com/javascript/)

![plotly](@@CDN@@/assets/img/web/JavaScriptWeekly31/img-04.webp)

一个历史悠久、在 Python 和 R 生态系统中也被广泛使用的库，提供超过 50 种可视化类型，从基础图表到地图、图形和热力图。

*Plotly, Inc.*

---

### [Expo UI 正式发布：从 JS 获得真正的 SwiftUI 和 Compose](https://expo.dev/)

一个 Import。iOS 上的 SwiftUI，Android 上的 Jetpack Compose。外加 7 个社区包的原生替代方案。

*Expo 赞助*

---

### [Component Party: UI 库的罗塞塔石碑](https://component-party.dev/)

一个并排代码片段对比网站，涵盖 React、Vue、Svelte、Angular、Ember 以及更多小众选择。最近的更新扩展了 Angular 和 Svelte 的覆盖范围，并新增了 Ripple 和 Ember Polaris。

*Mathieu Schimmerling*

---

### 🎉 [tsParticles 4: Web 粒子特效引擎](https://particles.js.org/)

如果你想要在你的页面上添加五彩纸屑大炮、烟花、彩带、萤火虫、雪花或类似效果，这就是你需要的工具。支持所有主流框架和原生 JS。[你可以在这里查看在线演示。](https://particles.js.org/)

*Matteo Bruni*

---

*原文链接：[JavaScript Weekly Issue 788](https://javascriptweekly.com/issues/788)*
