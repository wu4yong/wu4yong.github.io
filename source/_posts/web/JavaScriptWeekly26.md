---
title: JavaScript周刊-26
date: 2018-03-25 11:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 783: 2026年4月28日

## [pnpm 11.0 发布](https://pnpm.io/blog/releases/11.0)

![pnpm](@@CDN@@/assets/img/web/JavaScriptWeekly26/img-01.webp)

你已经听过它的好处，现在这个流行的包管理工具变得更好了。v11 默认将 `minimumReleaseAge` 设置为一天，采用 SQLite 支持的存储索引（安装更快！），原生包发布功能，`pack-app` 等。有面向 v10 用户的[迁移指南](https://pnpm.io/migration/10-to-11)。同时，名为 [Pacquet](https://github.com/pnpm/pacquet) 的 Rust 移植版项目也已恢复开发。

*Zoltan Kochan*

---

<div style="float:right; margin-left:16px; margin-bottom:8px;">
  <img  src="@@CDN@@/assets/img/web/JavaScriptWeekly26/img-02.webp" width="130">
</div>

## [还在手动编写测试？Meticulous AI 来了](https://www.meticulous.ai/?utm_source=jsweekly&utm_medium=newsletter&utm_campaign=26q2&utm_content=primary)

Notion、Dropbox、Wiz 和 LaunchDarkly 现在使用着一种他们离不开的测试范式。Meticulous 由前 Palantir 工程师构建，能够自动创建持续演进的 E2E UI 测试套件，以零开发者投入提供详尽覆盖率。

*Meticulous 赞助*

## [TypeScript 7.0 Beta：10 倍速 TypeScript 编译](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-beta/)

Go 驱动的移植版，编译器性能*"约快 10 倍"*。[TypeScript 6.0](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) 的弃用项和[配置变更](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-beta/#updates-since-5.x-and-new-behaviors-from-6.0)将帮助你从 v5 平滑升级到 v7。还需要审阅[代码编写方式的变化](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-beta/#javascript-differences)。虽然 v7 被认为*"接近生产就绪"*，但稳定的程序化 API 要到 v7.1 才会到来。

*Microsoft*

## 简讯

- *Node.js v26.0 (Current)* 预计今天晚些时候发布，将在升级到 V8 14.6 后默认启用 Temporal API 支持。这里是[发布说明的预览。](https://github.com/nodejs/node/pull/62526)

- 注意到 GitHub 最近比以前更不稳定？Vlad Fedorov 发布了[关于 GitHub 可靠性的最新官方更新](https://github.blog/news-insights/company-news/an-update-on-github-availability/)（包括上周的[合并队列事件](https://github.blog/news-insights/company-news/an-update-on-github-availability/#h-recent-incidents)）。

- 🇪🇺 [NodeConf EU](https://www.nodeconf.eu/) 回归。将于今年 9 月 29-30 日在意大利博洛尼亚举办。门票已开售，如果你想演讲，[这里有 CFP。](https://docs.google.com/forms/d/e/1FAIpQLSdhxLUxB5kW8NU5Dv6PM7vvQqKLcKed45AXvsXPGN8tIkzfkg/viewform)

## 版本发布

- [Rspack 2.0](https://rspack.rs/blog/announcing-2-0) – 这个快速、基于 Rust 的 webpack 兼容打包工具比 v1.7 快 10%，拥有[更好的静态分析能力](https://rspack.rs/blog/announcing-2-0#better-tree-shaking)，并添加了[实验性 RSC 支持](https://rspack.rs/blog/announcing-2-0#rsc-support)。[Rsbuild 2.0](https://rsbuild.rs/blog/v2-0) 也同步发布。

- [Nuxt UI 4.7](https://ui.nuxt.com/) – Vue UI 库，拥有 125+ 组件。[v4.7](https://github.com/nuxt/ui/releases/tag/v4.7.0) 添加了 [Listbox](https://ui.nuxt.com/docs/components/listbox) 和用于显示可复制粘贴 AI 提示词的 [Prompt](https://ui.nuxt.com/docs/typography/prompt) 组件。

- 🌐 [Lingui 6.0](https://lingui.dev/blog/2026/04/22/announcing-lingui-6.0) – 流行的框架和运行时无关的 JS 国际化和本地化库。

- [Transformers.js 4.2.0](https://github.com/huggingface/transformers.js/releases/tag/4.2.0)、[Electron 41.3.0](https://github.com/electron/electron/releases/tag/v41.3.0)、[Etherpad v2.7.0](https://github.com/ether/etherpad/releases/tag/v2.7.0)

## 📖 文章和视频

### [JavaScript 真正新增了什么（以及接下来会有什么）](https://neciudan.dev/whats-new-in-javascript)

你可以去阅读规范和无数关于每个新语言特性的文章，或者……读这一篇，它将 ES2025 和 ES2026 中所有相关和有用的内容汇集一处。涵盖了 Iterator Helpers、`Promise.try`、`Map.getOrInsert`、`using`、Temporal 等等。

*Neciu Dan*

---

### [不要再猜测你的 Next.js 应用在哪里出问题了 [Workshop]](https://sentry.io/resources/nextjs-may-workshop/?utm_source=javascriptweekly&utm_medium=paid-community&utm_campaign=nextjs-fy27q1-nextjsworkshop&utm_content=newsletter-sponsored-link-register)

学习使用日志和追踪将 Next.js 错误追溯回其源头。免费 Workshop，今日注册。

*Sentry 赞助*

---

### [TSRX: 面向声明式 UI 的 TypeScript 语言扩展](https://tsrx.dev/)

![tsrx](@@CDN@@/assets/img/web/JavaScriptWeekly26/img-03.webp)

来自 Svelte 维护者和前 React 核心工程师对 JSX 改进的新尝试。包含控制流、作用域样式和局部变量，可编译为 React、Preact、Solid 和 Ripple。

*Dominic Gannaway*

---

### 更多文章

- 📄 [在 Chrome DevTools 中调试 WASM](https://eli.thegreenplace.net/2026/debugging-wasm-in-chrome-devtools/) – 使用 Chrome DevTools *"非常强大的 WASM 调试器"* 的技巧。 *Eli Bendersky*

- 📄 [使用 .NET Native AOT 编写 Node.js Addons](https://devblogs.microsoft.com/dotnet/writing-nodejs-addons-with-dotnet-native-aot/) – 你现在可以用 C# 等 .NET 语言编写原生 Node Addons。 *Drew Noakes (Microsoft)*

- 📄 [最简单的 C 函数→WebAssembly→JS 管道](https://github.com/peterc/webassembly-simplest-demo) *Peter Cooper*

- 📄 [将 Cypress 升级到 TypeScript 6.0](https://glebbahmutov.com/blog/upgrade-cypress-to-typescript-v6/) *Gleb Bahmutov*

## 🛠 代码与工具

### 📊 [Lightweight Charts™ 5.2: 快速金融数据图表](https://www.tradingview.com/lightweight-charts/)

一个已有七年历史的 Canvas 驱动图表库，针对金融数据场景进行了优化，如圆角蜡烛图、箱须图和双范围直方图。主页上满是交互式演示。[GitHub 仓库。](https://github.com/tradingview/lightweight-charts)

*TradingView*

---

### [Clerk CLI: 从终端管理身份验证](https://clerk.com/)

检测你的框架，搭建身份验证脚手架，并以代码形式管理登录方式和会话策略。开源。

*Clerk 赞助*

---

### [Nano Stores 1.3: 一个极小的（286 字节）状态管理器](https://github.com/nanostores/nanostores)

适用于所有主要框架（包括 React）和原生 JS 的原子存储和派生存储。如果你对极小体积和框架无关的设计感兴趣，值得一看。

*Andrey Sitnik (Evil Martians)*

---

### [BWIP-JS 4.10: 纯 JavaScript 条码生成器](https://bwip-js.metafloor.com/)

一个使用超过 100 种不同标准生成条码的库。在[在线演示](https://bwip-js.metafloor.com/)中你会发现，存在的条码类型比你想象的要多得多。

*Mark Warren*

---

### 🍋 [Fresh 2.3: 默认零 JS、视图过渡等](https://fresh.deno.dev/)

Deno 全栈 Web 框架（[这里有介绍](https://fresh.deno.dev/docs)）新增了一等 WebSocket 支持，不再为不需要 JS 的页面传输任何 JavaScript，以及通过在视图中使用单个属性即可轻松使用 View Transitions API。

*Bartek Iwańczuk (Deno)*

---

## 📢 生态系统其他动态

### 🎵 [Chip Player JS：在线复古游戏音乐播放器](https://chiptune.app/)

![chiptune](@@CDN@@/assets/img/web/JavaScriptWeekly26/img-04.webp)

一个基于 JavaScript 的在线播放器和仓库，收藏了超过 300,000 个 MIDI、Tracker、Chiptune 和视频游戏音乐文件。作为背景音乐非常棒，如果你能想起一款游戏，它很可能就在这里。[《时空之轮》的配乐](https://chiptune.app/browse/Nintendo%20SNES/Chrono%20Trigger/)是我的最爱之一。

---

### 📊 [Datatype: 将文本转为内联图表的字体](https://franktisellano.github.io/datatype/)

[Datatype](https://franktisellano.github.io/datatype/) 是一种 OpenType 可变字体，可以将简单的文本表达式渲染为内联图表，无需 JavaScript 或图片。例如输入 `{l:10,50,30,80,20}` 就会被渲染为内联迷你走势图。

---

*原文链接：[JavaScript Weekly Issue 783](https://javascriptweekly.com/issues/783)*
