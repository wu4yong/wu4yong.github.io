---
title: JavaScript周刊-38
date: 2018-03-30 20:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 795: 2026年7月21日

*与 xyOps 联合推出*

![fake-interview](@@CDN@@/assets/img/web/JavaScriptWeekly38/img-01.webp)

## [虚假面试的编程挑战如何窃取凭证](https://www.elastic.co/security-labs/contagious-interview-malware-svg-steganography)

对一场朝鲜黑客活动的深度剖析，他们将恶意软件隐藏在 SVG 图片中，并通过虚假求职面试中的 JavaScript"编程挑战"进行分发。针对求职开发者的攻击正在增加，Roman Imankulov 最近就亲自遭遇了此类攻击。

*Daniel Stepanic (Elastic)*

<div style="float:right"><img  src="@@CDN@@/assets/img/web/JavaScriptWeekly38/img-02.webp" width="120" height="120" alt="xyOps" style="padding-top: 12px; padding-left: 12px;"></div>

## [xyOps：来自 Cronicle 团队的开源运维自动化](https://xyops.com/)

在集群中运行任务、构建可视化操作手册、监控实时指标，并触发告警、工单、快照或后续操作。自托管，BSD 许可，所有应用功能全包含。支持从 Cronicle 自动导入。

*xyOps 赞助*

## [Nuxt 4.5 发布：全栈 Vue 框架](https://nuxt.com/blog/v4-5)

Daniel Roe 称其为近期最大的版本：Vite 8、Rspack 2、实验性 SSR 流式渲染、新的 `useLayout` 组合式函数，以及大量为 Nuxt 5 做准备的改动。Nuxt 3 用户注意：7 月 31 日终止支持。

*Nuxt 团队*

### 简讯

- [Vue 3.6 已进入 Release Candidate 阶段](https://github.com/vuejs/core/releases/tag/v3.6.0-rc.1) – 两年多前首次预告的 Vapor Mode，现已功能完整，准备就绪。

- [Angular 将切换为年度发布节奏](https://github.com/angular/angular/pull/69817)，v23 计划于 2027 年 6 月发布，距离 [v22 发布](https://blog.angular.dev/announcing-angular-v22-c52bb83a4664)整整一年。

- ESLint 现在提供[官方的"codemod"来自动化 ESLint 版本迁移](https://eslint.org/blog/2026/07/eslint-codemod-migrations/)，目前提供 v8→v9 和 v9→v10 版本。

- 🇫🇷 [官方的 Three.js 大会](https://tympanus.net/codrops/2026/07/16/meet-the-speakers-of-the-first-three-js-conference/) 将于 9 月 10-11 日在法国巴黎举行。[Mr.doob](https://mrdoob.com/) 当然会到场。

## 📖 文章和视频

### [框架基准测试：前端框架对比](https://framework-benchmarks.as93.net/)

![framework-benchmarks](@@CDN@@/assets/img/web/JavaScriptWeekly38/img-03.webp)

一位经验丰富的开发者在多个框架（如 Angular、Solid、React、Alpine.js 等）中构建了相同的应用并进行了基准测试。结果涵盖了打包体积、构建时间、UX 指标等。

*Alicia Sykes*

---

### [10 分钟内创建你的第一个流式 3D 资源](https://miris.com/)

生成可流式传输的 3D 资源，在浏览器中预览并分享。无需代码，无需下载查看器。

*Miris 赞助*

---

### [使用 Web Locks API 在 Web 上处理并发](https://blog.cesarcontreras.com/web-locks-api/)

Web Locks API 是一个广泛可用浏览器 API，允许同源的标签页或 Worker 持有和释放锁。

*Cesar Contreras*

---

### [使用数据导向设计构建高性能解析器](https://arshadyaseen.com/yuku-parser-data-oriented-design/)

深入探讨数据导向设计如何帮助构建 Yuku——一个比 Oxc、SWC 或 Babel 等替代方案更快的 JavaScript 解析器（[你可以在这里试用](https://arshadyaseen.com/yuku-parser-data-oriented-design/)）。

*Arshad Yaseen*

---

- 📄 [Flint：编译为 Vega-Lite、ECharts 或 Chart.js 的图表规范](https://microsoft.github.io/flint-chart/) — 微软的一个项目，将简单的声明式 JSON 数据可视化规范编译为 Vega-Lite、ECharts 或 Chart.js 可渲染的格式。面向智能体使用场景，但作为一种简洁的中间格式，人类开发者也同样能从中受益。*Microsoft Research*

## 🛠 代码与工具

![flint-chart](@@CDN@@/assets/img/web/JavaScriptWeekly38/img-04.webp)

### [查询实时数据，跳过分析管道](https://www.tigerdata.com/timescaledb?utm_source=cooperpress&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

TimescaleDB 扩展了 Postgres，用于大规模实时分析。无需第二个系统，无需管道。获取 $1000 额度开始使用。

*Tiger Data (TimescaleDB 创建者) 赞助*

---

### [unwasm: 像导入普通 ES 模块一样导入 .wasm 文件](https://unjs.io/packages/unwasm)

构建时工具，用于在打包应用中使用 WASM 并希望它表现得像一个普通模块（例如 `import { sum } from "sum.wasm"`）。

*unjs*

---

### [BotKit: 构建独立的 ActivityPub 机器人](https://github.com/fedify-dev/botkit)

一种运行 Mastodon 用户可以看到并关注的机器人（或多个机器人）的方式，而无需在任何地方注册账号。完全用 JavaScript 编写，可在 Deno、Node.js 甚至 Cloudflare Workers 上自托管。

*Fedify*

---

### 🎨 [Color.js 0.7: "让我们认真对待色彩"](https://colorjs.io/)

一个出色的色彩处理库，遵循最新规范。v0.7 是一次重大更新，支持新的色彩空间、新的色域映射方法，以及针对浏览器原生不支持的颜色提供更智能的 `display()` 回退。

*Lea Verou 和 Chris Lilley*

---

*原文链接：[JavaScript Weekly Issue 795](https://javascriptweekly.com/issues/795)*
