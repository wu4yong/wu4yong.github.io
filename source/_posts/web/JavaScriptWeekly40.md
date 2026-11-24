---
title: JavaScript周刊-40
date: 2018-03-31 21:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 797: 2026年8月4日

*与 Master.dev 联合推出*

## [Next.js 16.3 发布](https://nextjs.org/blog/next-16-3)

![sk9fe6nujcbnpxh2pkor](@@CDN@@/assets/img/web/JavaScriptWeekly40/img-01.webp)

新近扩充的 Next.js 团队（现在包括 [Dan Abramov](https://bsky.app/profile/danabra.mov/post/3mp5b3nd3ws2k) 和 [Pete Hunt](https://x.com/rauchg/status/2077870043833229692)！）发布了这款流行 React 框架的最新版本，带来更快的构建、可选的 TypeScript 7 类型检查、更快的 SSR、[Instant Navigations](https://nextjs.org/blog/next-16-3-instant-navigations)、[AI 改进](https://nextjs.org/blog/next-16-3-ai-improvements) 等。

*Next.js 团队*

<div style="float:right"><img  src="@@CDN@@/assets/img/web/JavaScriptWeekly40/img-02.webp" width="140" height="140" alt="Master.dev" style="padding-top: 12px; padding-left: 12px;"></div>

## [前端架构：从单体到微前端](https://master.dev/courses/frontend-architecture/?utm_source=email&utm_medium=javascriptweekly&utm_content=frontendcooper)

Maxi Ferreira 带你走查模块化单体、monorepo 和微前端方案，帮助你为代码库选择正确的结构，并在做出决定前了解真正的成本。

*Master.dev 赞助*

## [来做一个史上最糟糕的 `htmx`](https://zserge.com/posts/worst-htmx-ever/)

在做出“最糟糕”的 [React](https://zserge.com/posts/worst-react-ever/) 和 [Vue.js](https://zserge.com/posts/worst-vuejs-ever/) 实现之后，Serge 这次从零开始重建 [htmx](https://htmx.org/) 的精髓。这是理解 htmx 底层究竟在做什么的一种有趣方式。

*Serge Zaitsev*

## [2026 年安全发布 `npm` 包的方法](https://evilmartians.com/chronicles/the-secure-way-to-release-an-npm-package)

一份更安全地发布 `npm` 包的实用指南，由众多流行包（如 [postcss](https://www.npmjs.com/package/postcss)）的作者撰写。他不仅展示了*如何*使用分阶段发布（staged publishing）和可信发布（trusted publishing），还解释了*为什么*这些做法有帮助。

*Andrey Sitnik*

💡 GitHub 正持续[聚焦 npm 安全](https://github.blog/security/supply-chain-security/disrupting-supply-chain-attacks-on-npm-and-github-actions/)，并开始在发布时[扫描每个 npm 包以查找恶意软件](https://github.blog/changelog/2026-07-28-npm-publish-time-malware-scanning-and-dual-use-metadata/)。这会带来一些影响，包括发布与可供安装之间出现延迟。

### 简讯

- 🚨 **事件仍在发展：** 流行的 `keyv` 和 `cacheable` 包[今天遭到一个窃取凭证的蠕虫入侵](https://socket.dev/blog/popular-npm-packages-in-the-keyv-and-cacheable-namespaces-compromised-in-active-supply-chain)。影响仍在持续，目前已有[数百个包](https://github.com/wiz-sec-public/wiz-research-iocs/blob/main/reports/keyv-packages.csv)受到波及。
- Astro 团队和 Svelte 团队发布月度更新：前者见[这里](https://astro.build/blog/whats-new-july-2026/)，后者见[这里](https://svelte.dev/blog/whats-new-in-svelte-august-2026)。SvelteKit 3 的首批预览版现已可用。
- ⚖️ *Deno 诉 Oracle* 的 JavaScript™ 商标案仍在继续，随着取证推进，Deno [同意第五次延期请求](https://ttabvue.uspto.gov/ttabvue/v?pno=92086835&pty=CAN&eno=26)。
- 以高产 JS 库著称的 [*TanStack* 已完成品牌焕新](https://tanstack.com/blog/tanstack-has-a-new-look)，并推出了[新的 “Markdown” 和 “Highlight” 库](https://tanstack.com/blog/introducing-tanstack-markdown-and-highlight)。

### 版本发布

- [MobX 7.0](https://github.com/mobxjs/mobx/releases/tag/mobx%407.0.0) – 这个流行的状态管理器瘦身了，移除了废弃项，[更新了 React 绑定](https://github.com/mobxjs/mobx/releases/tag/mobx-react%4010.0.0)，现在始终使用由 Proxy 支持的 observable 对象和数组。
- [Javy 9.1](https://github.com/bytecodealliance/javy) – 用于将 JavaScript 编译为 WebAssembly、供 WASM 运行时使用的工具链。
- [Node.js v26.6.0 (Current)](https://nodejs.org/en/blog/release/v26.6.0) 和 [v24.19.0 (LTS)](https://nodejs.org/en/blog/release/v24.19.0)
- [Vite 8.2](https://github.com/vitejs/vite/blob/v8.2.0/packages/vite/CHANGELOG.md)、[React Three Fiber 9.7](https://github.com/pmndrs/react-three-fiber/releases/tag/v9.7.0)、[Lerna 10.0](https://github.com/lerna/lerna/releases/tag/v10.0.0)、[Hono 4.13.0](https://github.com/honojs/hono/releases/tag/v4.13.0)

## 📖 文章和视频

### [你的 SPA 正在泄漏内存：给它做一次“浸泡测试”](https://denodell.com/blog/your-spa-is-leaking-memory-soak-test-it)

如何运行一个 Playwright“浸泡测试”（soak test）：在同一个浏览器上下文中循环执行用户流程，观察 DOM 节点和监听器数量，并在内存泄漏悄然出现时让 CI 失败。

*Den Odell*

---

### [你的 JSON 正在对你说谎](https://blog.gaborkoos.com/posts/2026-08-03-Your-JSON-Is-Lying-to-You/)

提醒你：`JSON.parse`/`JSON.stringify` 往返远非无损，大整数、`undefined`、`Date` 等都会在途中被改变或丢失。Gabor 介绍了更棘手的陷阱，以及让转换边界变得明确的实用方法。

*Gabor Koos*

---

### [不要只写代码——成长为技术专家](https://jobs.fidelity.com/en/technology-careers/?utm_source=javascript&utm_medium=paidsocial&utm_campaign=jobssocial&utm_content=awn-tech-nl1-s)

在 Fidelity 从事技术工作，探索新技术、磨练现有技能并培养新技能。

*Fidelity Careers 赞助*

---

### [cdnjs 每天处理 90 亿次请求：一次迁移的故事](https://blog.cloudflare.com/cdnjs-dev-platform-migration/)

[cdnjs](https://cdnjs.com/) 是一个流行且免费的 CDN，可用于加载 JavaScript 库而无需打包或自托管（LLM 似乎特别喜欢它）。Cloudflare 解释了它现在如何完全运行在 Workers 和 R2 上。

*Simona Badoiu (Cloudflare)*

---

### [为 TypeScript 编译器添加 Go 的 `defer`](https://healeycodes.com/adding-defer-to-the-typescript-compiler)

在 Go 中，`defer` 会将函数调用的执行延迟到外围函数结束。你能直接 fork TypeScript 并添加语言特性吗？可以！但你应该这样做吗？大概不应该，因为 [`using`](https://www.totaltypescript.com/typescript-5-2-new-keyword-using) 已经很适合这个用例。

*Andrew Healey*

---

### 📄 [学习 Remix 3](https://malstrom.me/blog/learning-remix-3)

通过将一个 Solid 2.0 演示移植到 Remix 3 的服务器优先模型来学习。

*Mark Malstrom*

---

### 📄 [为什么 npm 依赖树如此庞大](https://nesbitt.io/2026/07/28/why-npm-dependency-trees-are-so-big.html)

*Andrew Nesbitt*

## 🛠 代码与工具

### [TanStack Charts：新的图表语法选项](https://tanstack.com/charts/latest)

![zzctbd5nks5jg4ur4cir](@@CDN@@/assets/img/web/JavaScriptWeekly40/img-03.webp)

过去几周，TanStack 一直在快速迭代一种新的、框架无关的方式，用声明式语法在 JavaScript 中指定大量图表相关可视化。输出可渲染为 SVG 或 canvas，并可按需设置样式。这里有一份与其它成熟方案的[对比](https://tanstack.com/charts/latest/docs/comparison)。

*TanStack*

---

### [一个开源 PR 审查工具在 Code-Review-Bench 的 42 个工具中排名第 2](https://agentfield.ai/github/pr-af/?utm_source=javascript&utm_medium=newsletter&utm_campaign=javascript-260804&utm_id=javascript-260804-pr-af&utm_content=pr-af)

PR-AF 的排名超过了商业工具。只保留经过验证的发现，成本约低 10 倍，可自托管。可直接接入 GitHub Actions。

*Agentfield.ai 赞助*

---

### [MicroDiff 1.6：快速的对象与数组比较库](https://github.com/AsyncBanana/microdiff)

给定两个对象或数组，它返回差异（可以理解为针对 JS 对象的 `diff`）。本周发布的版本增加了对 Temporal 类型的支持。

*Jacob Jackson*

💡 Jacob 有一篇 2022 年的文章，介绍了 [microdiff 为何如此之快](https://byteofdev.com/posts/microdiff/)。

---

### [Virtua：面向多种框架的虚拟列表与网格组件](https://github.com/inokawa/virtua)

一个快速、小巧的虚拟列表/网格组件，适用于 React、Vue、Solid、Svelte 和 Angular。这里有一个[演示](https://inokawa.github.io/virtua/?path=/story/basics-vlist--default)，还有与其他方案对比的[比较表](https://github.com/inokawa/virtua#comparison)。

*inokawa*

---

### 📊 [Perspective 5：交互式分析与数据可视化组件](https://perspective-dev.github.io/)

最初由 JP Morgan 构建，是一个由 WASM 驱动的数据可视化组件，适合大型和/或实时流式数据集。5.0/5.1 刚刚发布，包含大量修复、`wasm64` 构建以及[窗口列](https://github.com/perspective-dev/perspective/pull/3207)。

*OpenJS Foundation*

### 版本发布

- [Neutralinojs 6.9](https://github.com/neutralinojs/neutralinojs/releases/tag/v6.9.0) – 这个轻量级 Electron 替代品新增了 C++ 网络 API，发起 HTTP 请求时不再受 webview 的 CORS 限制。
- [DukPy 0.6](https://github.com/amol-/dukpy/releases/tag/0.6.0) – 面向 Python 的简单 JavaScript 解释器。现在使用 QuickJS-NG 引擎，以支持更多现代 JavaScript 特性和 Promise。
- [isomorphic-git 1.40.0](https://github.com/isomorphic-git/isomorphic-git) – 适用于 Node 和浏览器的纯 JS Git 实现。
- [better-result 3.0](https://github.com/dmmulroy/better-result) – 面向 TypeScript 的轻量级 `Result` 类型，支持基于生成器的组合。
- [ip-address 10.4](https://github.com/beaugunderson/ip-address) – 解析、验证和操作 IP（v4 和 v6）地址。

## 📢 生态系统其他动态

- 你知道 JavaScript 支持第三种注释类型（除了 `//` 和 `/* */`）吗？[▶️ Mat Marquis 在一段简短的 YouTube 视频中展示了 hashbang 注释](https://www.youtube.com/watch?v=o98XmRVjxWs)。没错，[它们就在语言规范里！](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-hashbang)
- 🤖 GitHub 的 Sean Goedecke 表示，[LLM 会奖励专业知识](https://www.seangoedecke.com/llms-reward-expertise/)，最重要的提示词技巧就是你所提示领域的专业知识。
- 微软正在预览[一种从 Node 调用原生 Windows API](https://devblogs.microsoft.com/ifdef-windows/a-new-way-to-bring-native-windows-apis-to-javascript-introducing-dynamic-api-projections-for-node-js/)（因此也适用于 Electron）的方式，无需原生插件，而是通过新的动态 Windows Runtime API（WinRT）投影实现。
- Cloudflare *Workers* 已新增[对入站 TCP 连接和 gRPC 的支持](https://blog.cloudflare.com/grpc-workers/)（*私有测试版*）。
- GitHub 上的[堆叠 Pull Request 现已进入公开预览](https://github.blog/changelog/2026-07-30-stacked-pull-requests-are-now-in-public-preview/)。

*原文链接：[JavaScript Weekly Issue 797](https://javascriptweekly.com/issues/797)*
