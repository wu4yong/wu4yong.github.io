---
title: JavaScript周刊-21
date: 2018-03-23 03:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 778: 2026年3月24日

## [TypeScript 6.0 正式发布](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/)

![typescript6](@@CDN@@/assets/img/web/JavaScriptWeekly21/img-01.webp)

经过六个多月的打磨，TypeScript 6.0 旨在桥接其自托管[编译器](https://github.com/microsoft/TypeScript/tree/main/src/compiler)与即将就绪的 [Go 驱动的 TypeScript 7.0 原生编译器](https://devblogs.microsoft.com/typescript/typescript-native-port/)。v6.0 *确实*包含新特性（Temporal 改进、`RegExp.escape` 等），但最重要的是帮助你为 7.0 做好准备的变更。

*Daniel Rosenwasser (Microsoft)*

---

<div style="float:right; margin-left:16px; margin-bottom:8px;">
  <img  src="@@CDN@@/assets/img/web/JavaScriptWeekly21/img-02.webp" width="148">
</div>

## [为你的 JavaScript 应用添加 Excel 般的电子表格功能](https://developer.mescius.com/spreadjs?utm_source=CooperPress&utm_medium=JavaScript-Weekly&utm_campaign=SpreadJS-JS-Weekly-Primary-Sponsor-March-2026)

SpreadJS 是业界领先的 JavaScript 电子表格组件，可为企业应用添加高级电子表格功能。构建财务、分析、预算等应用。支持 Excel I/O、500+ 计算函数、表格、图表等。[立即查看演示。](https://developer.mescius.com/spreadjs?utm_source=CooperPress&utm_medium=JavaScript-Weekly&utm_campaign=SpreadJS-JS-Weekly-Primary-Sponsor-March-2026)

*SpreadJS from MESCIUS 赞助*

## [JavaScript 膨胀的三大支柱](https://43081j.com/2026/03/three-pillars-of-javascript-bloat)

你的 `node_modules` 为何如此庞大的三个原因：不必要的 ES3 时代兼容包、只有单一使用者的微型库，以及为多年前就已发布的 API 提供的 [ponyfill](http://ponyfill.com/)！James 以 [e18e](https://e18e.dev/) 生态系统性能项目而闻名，他提供了一些平息混乱的方法。

*James Garbutt*

## [如何用 TypeScript 重写 Rust+WASM 解析器反而让它变得*更快*](https://www.openui.com/blog/rust-wasm-parser)

表面上看似违反直觉，但 WASM-JS 的边界传递在许多场景下会引入严重的性能损耗，留在 JS 世界中反而可以快 2-4 倍。

*Thesys 工程团队*

---

### [Clerk Chrome 扩展身份验证 — 现已支持原生 JS](https://go.clerk.com/MJXTRrd)

Chrome 扩展 SDK 现在通过 `createClerkClient()` 支持原生 JavaScript。无需 React 即可构建弹窗和侧边栏。包含全新的快速入门指南。

*Clerk 赞助*

---

### 📊 [React SSR 框架性能对决](https://blog.platformatic.dev/react-ssr-framework-benchmark-tanstack-start-react-router-nextjs)

对 TanStack Start、React Router 和 Next.js 在高负载下进行的大规模基准测试。测试结果带来了对 TanStack 和 React 都有益的补丁。

*Matteo Collina (Platformatic)*

---

### [React 开发者不喜欢但无法回避的两个设计选择](https://dev.to/playfulprogramming/two-react-design-choices-developers-dont-like-but-cant-avoid-d6g)

延迟状态提交和 Effect 上的依赖数组引发了许多问题，但 Ryan 指出，基于信号（Signal）的替代方案（如 Solid）只是通过保持同步来回避这些问题。

*Ryan Carniato*

---

## 简讯

- 🤖 Node.js 社区正在就 LLM 生成的代码在其实现中应扮演的角色进行争论，*io.js* 分支的创建者[发起了一份请愿书，对 AI 辅助的贡献说"不"。](https://github.com/indutny/no-slop-in-nodejs-core)

- 大量 [Deno](https://deno.com/) 员工上周宣布（[例](https://bsky.app/profile/marvinh.dev/post/3mhbtbl2ptk23)）离开公司。Deno 员工 Josh Collinsworth（*不代表公司立场*）[指出](https://bsky.app/profile/collinsworth.dev/post/3mhdpgmoao22j) *"Deno 不会消失，这只是一段艰难时期。"*

- 📗 [Chibivue](https://book.chibivue.land/) 是一个代码项目和配套的在线书籍，提供了并解释了如何构建一个最小的 Vue.js 实现。

## 版本发布

- [Next.js 16.2](https://nextjs.org/blog/next-16-2) – 这个 React 框架实现了更快的 `next dev` 启动速度和约 50% 的更快速渲染。

- [Storybook 10.3.0](https://github.com/storybookjs/storybook/releases/tag/v10.3.0) – 组件工坊新增 Vite 8、Next.js 16.2 和 ESLint 10 支持，以及 React 开发者 MCP 服务器的预览版。

- ⚠️ 所有受维护的 Node.js 版本*今天*晚些时候[将发布安全更新](https://nodejs.org/en/blog/vulnerability/march-2026-security-releases)，以解决九个漏洞。

- [Deno 2.7.6](https://github.com/denoland/deno/releases/tag/v2.7.6) – `deno eval` 自动检测 CJS 与 ESM，`--cpu-prof-flamegraph` 生成交互式 SVG 火焰图。

- [Bun 1.3.11](https://bun.com/blog/bun-v1.3.11)、[Valibot 1.3](https://valibot.dev/blog/valibot-v1.3-release-notes/)、[ESLint 10.1](https://eslint.org/blog/2026/03/eslint-v10.1.0-released/)

## 📖 文章和视频

### [JavaScript 膨胀的三大支柱](https://43081j.com/2026/03/three-pillars-of-javascript-bloat)

![js-bloat](@@CDN@@/assets/img/web/JavaScriptWeekly21/img-03.webp)

深入探讨 `node_modules` 为何如此庞大的三个原因，以及如何平息这种混乱。

*James Garbutt*

---

### [pnpm 11 Beta 0: 先睹为快](https://github.com/pnpm/pnpm/releases/tag/v11.0.0-beta.0)

这个[注重效率的 npm 替代方案](https://pnpm.io/)继续对 JS 包管理产生巨大影响。它正在迁移到基于 SQLite 的存储，进行配置重构，并默认采用更严格的构建安全性。还新增了四个命令，包括用于生成软件物料清单 JSON 文档的 `pnpm sbom`。

*pnpm 贡献者*

---

### [Edge.js: 在 WebAssembly 沙箱中运行 Node 应用](https://wasmer.io/posts/edgejs-safe-nodejs-using-wasm-sandbox)

一个新的、处于 alpha 阶段的运行时，通过 WebAssembly 提供完全 Node 兼容性和隔离性。现有应用/模块无需修改即可运行，系统调用被沙箱化，且使用的 JS 引擎是可插拔的（V8、JavaScriptCore 和 QuickJS 之间可切换）。[主页了解更多信息。](https://edgejs.org/)

*Syrus Akbary (Wasmer)*

---

### [断点和 `console.log` 是过去式，时间旅行才是未来](https://wallabyjs.com/?utm_source=cooperpress&utm_medium=javascriptweekly&utm_content=javascriptweekly)

比断点和 console.log 快 15 倍的 JavaScript 调试体验，支持 Vitest、Jest、Karma、Jasmine 等。

*Wallaby Team 赞助*

---

### [ArrowJS 1.0: 基于平台原生 API 构建的快速响应式 UI 运行时](https://www.arrow-js.com/)

围绕 ES 模块、模板字面量和 DOM 构建，还可以在 WASM 沙箱中隔离组件逻辑，同时直接渲染完整的内联 DOM。由 [FormKit](https://formkit.com/) 的创建者于 2022 年首次发布，如今显然已站稳脚跟。

*Justin Schroeder*

---

### [Sugar High 1.0: 轻量级 JSX 语法高亮器](https://sugar-high.vercel.app/)

不需要 React 存在，因此你可以在任何地方高亮 JSX 代码片段。也可以使用 CSS 自定义主题。[GitHub 仓库](https://github.com/huozhi/sugar-high)。

*Jiachi Liu*

---

### 更多文章

- 📄 [Node.js Worker Threads 问题不少，但对我们来说效果很好](https://www.inngest.com/blog/node-worker-threads) *Inngest*

- 📄 [将古登堡计划网站从 React 重写为 Vite+11ty](https://www.gutenberg.org/rewrite/) *Project Gutenberg*

## 🛠 代码与工具

- [htmlparser2 12.0](https://github.com/fb55/htmlparser2/releases/tag/v12.0.0) – 快速、宽松的 HTML/XML 解析器，支持流式传输。

- [Mediabunny 1.40.0](https://github.com/Vanilagy/mediabunny/releases/tag/v1.40.0) – 强大的媒体文件读取/写入/转换工具包。

- 🗓️ [EventCalendar 5.5](https://github.com/vkurko/calendar) – 全尺寸拖拽式事件日历。

- [Maz UI 4.9](https://louismazel.github.io/maz-ui/) – Vue 3 和 Nuxt 3 的轻量级 UI 组件。

- [React Joyride 3.0](https://github.com/gilbarbara/react-joyride/releases/tag/v3.0.0) – 在 React 应用中创建引导式游览。

## 📢 生态系统其他动态

### 🤖 [VS Code 如何使用 AI 构建](https://code.visualstudio.com/blogs/2026/03/13/how-VS-Code-Builds-with-AI)

![vscode-ai](@@CDN@@/assets/img/web/JavaScriptWeekly21/img-04.webp)

Microsoft Visual Studio Code 团队[分享了他们如何使用 AI 来开发 VS Code](https://code.visualstudio.com/blogs/2026/03/13/how-VS-Code-Builds-with-AI)，从组织工作、处理 issues 到推送新版本。如果你注意到 VS Code 现在每周都有新版本发布，这就是原因！

---

### 🔒 [Secretlint: 确保仓库中没有泄露的秘密](https://github.com/secretlint/secretlint)

也许比以往任何时候都更重要的是，确保没有秘密泄露到你的仓库中。[Secretlint](https://github.com/secretlint/secretlint) 是专为此任务而设计的 Linter。

---

### 📜 [Rob Pike 的编程五法则](https://www.cs.unc.edu/~stotts/COMP590-059-f24/robsrules.html)

早在 1989 年，以 Go 语言和共同创建 UTF-8 而闻名的 Rob Pike 写下了[Rob Pike 编程五法则](https://www.cs.unc.edu/~stotts/COMP590-059-f24/robsrules.html)，本周再次走红，到了 2026 年仍然适用！

---

### 🤖 [理解债务：Addy Osmani 谈智能体生成代码的挑战](https://addyosmani.com/blog/comprehension-debt/)

[Addy Osmani 向我们介绍了*"理解债务"*的概念。](https://addyosmani.com/blog/comprehension-debt/) 在智能体生成代码的世界里，问题不再是*"我们如何生成更多代码？"*，而是*"我们如何真正理解我们交付的更多东西？"*

---

###  [不喜欢 macOS 26 (Tahoe) 的新菜单图标？](https://mastodon.social/@stroughtonsmith/116262411548746327)

[有解决方法](https://mastodon.social/@stroughtonsmith/116262411548746327)：`defaults write -g NSMenuEnableActionImages -bool NO`

---

*原文链接：[JavaScript Weekly Issue 778](https://javascriptweekly.com/issues/778)*
