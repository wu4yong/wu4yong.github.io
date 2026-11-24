---
title: JavaScript周刊-39
date: 2018-03-31 09:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 796: 2026年7月28日

*与 Master.dev 联合推出*

![rust-eating-js](@@CDN@@/assets/img/web/JavaScriptWeekly39/img-01.webp)

## [Rust 仍在吞噬 JavaScript（2026 年版）](https://leerob.com/rust)

我们 2021 年阅读量最高的文章迎来了 2026 年更新。Lee Robinson（当时在 Vercel，现在在 Cursor）曾预测 Rust 将被用于重写越来越多 JavaScript 生态系统的工具，而 Rspack、Biome、Turbopack 以及 Bun 近期的重写不断印证着他的正确性。

*Lee Robinson*

<div style="float:right"><img  src="@@CDN@@/assets/img/web/JavaScriptWeekly39/img-02.webp" width="140" height="140" alt="Master.dev" style="padding-top: 12px; padding-left: 12px;"></div>

## [前端架构：从单体到微前端](https://master.dev/)

Maxi Ferreira 带你走查模块化单体、monorepo 和微前端方案，帮助你为代码库选择正确的结构，并在做出决定前了解真正的成本。

*Master.dev 赞助*

## [Octane：React 的编程模型，但是编译式的](https://octanejs.dev/)

[Inferno](https://www.infernojs.org/) 创建者带来的继任者：一个编译式的类 React 框架（[与 React 的差异详见此处](https://octanejs.dev/docs/differences-from-react)），提前生成响应式能力，无 VDOM。支持 TSX/JSX 和 TSRX，集成了 TanStack Query 和 Router，以及其它常见的 React 库。

*Dominic Gannaway*

### 简讯

- 😄 [htmx 4.0](https://four.htmx.org/) 有趣地将自己标榜为*"第一个独家在 Game Boy 上发布的 JavaScript 库"*，并配有纪念版卡带。

- 在上周的 TC39 会议上，[Await Dictionary](https://github.com/tc39/proposal-await-dictionary)（`Promise.allKeyed`）推进到了 Stage 3。

- Ryan Dahl [表示](https://x.com/rough__sea/status/2081809131548389636) `deno compile` 很快将[支持使用 QuickJS 替代 V8](https://github.com/denoland/deno/pull/36194)，为 JS/TS 项目生成体积极为小巧的二进制文件。

- Node.js [新的 API 文档网站已提供预览版](https://nodejs.org/en/blog/announcements/new-api-docs-beta)（现已支持搜索！）

- [Oxlint 的类型感知 Lint 功能已稳定](https://oxc.rs/blog/2026-07-22-type-aware-linting-stable)。

## 📖 文章和视频

### ▶ [TypeScript 创建者展示 TypeScript 7](https://www.youtube.com/watch?v=OytpXXeNmTQ)

![ts7-demo](@@CDN@@/assets/img/web/JavaScriptWeekly39/img-03.webp)

Anders Hejlsberg 在 VS Code 130 万行的代码库上演示了由全新 Go 驱动 TypeScript 编译器带来的 10 倍速度提升。他还介绍了新的 LSP 语言服务器，以及为什么编译器 API 用户（Vue、Astro、Svelte）必须留在 TypeScript 6。

*Anders Hejlsberg (Microsoft)*

---

### [Domenic Denicola 的 AI 编程配置](https://blog.domenic.me/agentic-coding-setup/)

当一位高产开发者（Domenic 曾是 JavaScript Promises 采纳过程中的关键人物、jsdom 的创建者等等）分享他们的工作流时，总是非常吸引人。本文也不例外，涵盖了一次性虚拟机、Tailscale 和 worktree 等内容。

*Domenic Denicola*

---

### [还在手动编写测试？Meticulous AI 来了](https://www.meticulous.ai/?utm_source=jsweekly&utm_medium=newsletter&utm_campaign=26q3&utm_content=primary)

不稳定的测试在拖慢开发进度？Meticulous 通过自主测试 Web 应用的每个边界情况，让工程师有信心更快地交付。

*Meticulous 赞助*

---

### [Medium 如何构建其全新的"目录"功能](https://blog.medium.com/building-a-table-of-contents-widget-for-every-medium-story-a-tale-of-migration/)

内容网站 Medium 如何为其所有文章构建动态目录小组件的故事，灵感来自一款做了同样事情的第三方 Chrome 扩展。

*Scott Batson (Medium)*

## 🛠 代码与工具

### 🌐 [MapLibre GL JS 6.0: Web 交互式矢量地图](https://maplibre.org/maplibre-gl-js/docs/)

![maplibre](@@CDN@@/assets/img/web/JavaScriptWeekly39/img-04.webp)

一个基于 WebGL 的库，用于渲染交互式矢量瓦片地图，在 2020 年 Mapbox GL JS 变更许可后从其中 fork 而来。v6 仅支持 ESM、要求 WebGL 2，并带来全面的性能提升。[发布说明](https://github.com/maplibre/maplibre-gl-js/releases/tag/v6.0.0)和 [v5→v6 迁移指南](https://maplibre.org/maplibre-gl-js/docs/)。

*MapLibre*

---

### [无需重新部署即可交付翻译内容。i18next 团队出品](https://locize.com/)

来自 i18next 团队的云端 TMS。saveMissing、上下文编辑器、AI 翻译、CDN。免费层可用，瑞士制造。

*Locize 赞助*

---

### [Bruno 4.0: 开源 HTTP API 客户端](https://www.usebruno.com/)

一个开源的、JavaScript 驱动的轻量级 Postman 替代品，用于测试和对 HTTP API 发起请求。

*Anoop M D、Anusree P S 及贡献者*

---

### [tslog 5: 适用于 Node、Deno、Bun 和浏览器的零依赖 Logger](https://github.com/nicobao/tslog)

从头重写，现在仅支持 ESM，也覆盖 Worker 和 React Native。默认输出美观，可选 JSON 格式，还有中间件、文件/HTTP/Worker 传输、密钥掩码，以及能够通过 Source Map 解析回原始 .ts 行号的错误堆栈。[GitHub 仓库。](https://github.com/nicobao/tslog)

*Eugene Terehov*

---

### [eslint-package-json: 针对 package.json 的强大 ESLint 规则](https://github.com/sindresorhus/eslint-package-json)

一个 ESLint 插件，可以捕获 package.json 中的错误，如无效的名称、错误的版本范围、损坏的 exports、冗余的 files 条目等，并能自动修复其中许多问题。

*Sindre Sorhus*

---

### [Shadscan: 面向 shadcn 应用的确定性 UI 审计](https://github.com/OrcDev/shadscan)

一个静态分析你的 shadcn 组件的工具，使用近 60 条确定性检查（无需 AI 或 API Key），涵盖可访问性、状态和组合方面的基本最佳实践。

*OrcDev*

## 📢 生态系统其他动态

### 🕹️ [js1024 2026：年度 1KB 代码高尔夫大赛结果揭晓](https://js1024.fun/demos/2026)

![js1024](@@CDN@@/assets/img/web/JavaScriptWeekly39/img-05.webp)

今年的主题是"Dreaming"——来看看开发者们如何用仅仅 1,024 字节创造出令人惊叹的视觉和交互体验。

---

### 📊 [Datatype 字体：将文本变成迷你图表](https://franktisellano.github.io/datatype/)

一种 OpenType 可变字体，可以将 `{l:10,50,30}` 这样的文本直接渲染为内联迷你走势图——无需任何 JavaScript。

---

*原文链接：[JavaScript Weekly Issue 796](https://javascriptweekly.com/issues/796)*
