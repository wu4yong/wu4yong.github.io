---
title: JavaScript周刊-20
date: 2018-03-23 01:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 777: 2026年3月17日

## [Temporal：修复 JavaScript 时间处理的九年征程](https://bloomberg.github.io/js-blog/post/temporal/)

![temporal](@@CDN@@/assets/img/web/JavaScriptWeekly20/img-01.webp)

JavaScript 的日期/时间处理是出了名的[混乱](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal#background_and_concepts)，诸如 [Moment.js](https://momentjs.com/) 之类的库作为变通方案广受欢迎。2017 年，Moment.js 的维护者 Maggie Johnson-Pint 提出了 [Temporal API](https://tc39.es/proposal-temporal/docs/) 来一劳永逸地修复日期/时间处理，如今我们*已经基本到达终点*（[浏览器支持正在增长](https://caniuse.com/temporal)，Safari 和 Node 也将跟上）。

*Jason Williams (Bloomberg)*

---

<div style="float:right; margin-left:16px; margin-bottom:8px;">
  <img  src="@@CDN@@/assets/img/web/JavaScriptWeekly20/img-02.webp" width="125">
</div>

## [还在手动编写测试？Meticulous AI 来了](https://www.meticulous.ai?utm_source=jsweekly&utm_medium=newsletter&utm_campaign=26q1&utm_content=primary)

Notion、Dropbox、Wiz 和 LaunchDarkly 现在使用着一种他们离不开的测试范式。Meticulous 由前 Palantir 工程师构建，能够自动创建持续演进的 E2E UI 测试套件，以零开发者投入提供详尽覆盖率。

*Meticulous 赞助*

## [Vite 8.0 发布](https://vite.dev/blog/announcing-vite8)

这个流行的构建工具迎来了一个重磅版本。设计为平滑升级，背后有许多重大变化：`@vitejs/plugin-react` v6 不再需要 Babel，[Rolldown](https://rolldown.rs/) 取代了 Rollup 和 esbuild，支持 Wasm SSR，浏览器控制台转发到终端，以及巨大的性能提升。

*Vite*

💡 VoidZero 还[开源了其 *Vite+* 工具包。](https://voidzero.dev/posts/announcing-vite-plus-alpha) Vite+ 最初计划为商业项目，它将 Vite、Vitest、Oxlint、Oxfmt、Rolldown 和 tsdown 整合为一个统一的工具链，现已进入 alpha 阶段。

## 简讯

- [Sarah Gooding 总结了上周 TC39 会议的成果](https://socket.dev/blog/tc39-advances-temporal-to-stage-4)以及推进的提案，包括 Temporal、[Import Text](https://github.com/tc39/proposal-import-text)、[Error Stack Accessor](https://github.com/tc39/proposal-error-stack-accessor) 和 [Iterator Includes](https://github.com/tc39/proposal-iterator-includes)。

- 😆 `BigInt.PI = 3`？欣赏一下 *qntm* 半开玩笑的[为 `BigInt` 添加数学常量的提案。](https://github.com/qntm/proposal-bigint-constants)

- Laurent Cazanove [总结了上周 Vue.js Amsterdam 大会的公告](https://laurentcazanove.com/blog/state-of-vue-vite-2026-amsterdam-recap)，包括 Vue Router 5、Vite 8 和 [Void Cloud。](https://void.cloud/)

## 版本发布

- [Electron 41.0](https://www.electronjs.org/blog/electron-41-0) – 这个跨平台桌面应用框架新增了 ASAR Integrity 摘要和 MSIX 自动更新支持，改进了 Wayland 支持，并更新至 Chromium 146、Node v24.14.0 和 V8 14.6。

- [Nitro v3 Beta](https://nitro.build/blog/v3-beta) – 用生产就绪的服务器扩展你的 Vite 应用，兼容任何运行时。如果你想尝试构建自己的框架，这非常方便！

- [Vitest 4.1](https://vitest.dev/blog/vitest-4-1.html) – 下一代测试框架，现已支持 Vite 8。

- [Preact 10.29.0](https://github.com/preactjs/preact/releases/tag/10.29.0)、[Prisma 7.5.0](https://github.com/prisma/prisma/releases/tag/7.5.0)、[Babel 8.0 RC3](https://github.com/babel/babel/releases/tag/v8.0.0-rc.3)、[Vue 3.6.0 Beta 8](https://github.com/vuejs/core/blob/minor/CHANGELOG.md#360-beta8-2026-03-16)

## 📖 文章和视频

### [Source Maps：通过标准推进功能演进](https://bloomberg.github.io/js-blog/post/standardizing-source-maps/)

[Source Map](https://developer.mozilla.org/en-US/docs/Glossary/Source_map) 是一种 JSON 文件，为调试器和类似工具提供压缩/转换后的代码与原始代码库之间的映射。Jon 带我们深入了解并揭示了该功能如何逐步迈向成为一项标准（[ECMA-426](https://tc39.es/ecma426/)）的幕后历程。

*Jon Kuperman (Bloomberg)*

---

### [如何在两周内将 13 万行代码从 React 重写为 Svelte](https://strawberrybrowser.com/blog/react-to-svelte)

近几个月来一个常见的说法是，LLM 和编程智能体的使用可能会将我们锁定在最流行的框架中，但实际上，它们也让*在框架之间切换*变得前所未有地容易。

*Strawberry*

---

### [你最慢的端点很可能是一个分析查询](https://www.tigerdata.com/timescaledb?utm_source=cooperpress&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

TimescaleDB 扩展了 Postgres，使分析查询在大规模下保持高速。超表、95% 压缩率、实时数据。[免费开始使用。](https://www.tigerdata.com/timescaledb?utm_source=cooperpress&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

*Tiger Data (TimescaleDB 的创建者) 赞助*

---

### [Svelte 开发者最佳实践](https://svelte.dev/docs/svelte/best-practices)

Svelte 文档中一个全新的页面，概述了编写更健壮的 Svelte 应用的一些最佳实践。

*Svelte 文档*

---

### [前端内存泄漏的实证研究](https://stackinsight.dev/blog/memory-leak-empirical-study/)

分析了 500 个 React、Vue 和 Angular 应用，寻找导致内存泄漏的模式。缺少定时器清理和事件监听器移除是造成大多数问题的原因。

*Ko-Hsin Liang*

---

### [用 TypeScript 重写一个 12 年前的 JavaScript 库](https://ifandelse.com/blog/rewriting-a-12-year-old-javascript-library-in-typescript/)

具体来说，是 [Machina](https://machina-js.org/) 有限状态机库。

*Jim Cowart*

---

### 更多文章

- 📄 [关于协同编辑我被灌输的谎言：为什么我们不使用 Yjs](https://www.moment.dev/blog/lies-i-was-told-pt-2) *Alex Clemmer*

- ▶️ [在前端中破解和保护 OAuth 2.0](https://www.youtube.com/watch?v=oGktdQ45bTg) *Philippe De Ryck*

- 📄 [如何为我的 Astro 博客添加 Bluesky 点赞功能](https://loige.co/how-i-added-bluesky-likes-to-my-astro-blog/) *Luciano Mammino*

- 📄 [为什么 Node.js 需要一个虚拟文件系统](https://blog.platformatic.dev/why-nodejs-needs-a-virtual-file-system) *Matteo Collina*

- 📄 [原生 JSON 模块终于成真了](https://allthingssmitty.com/2026/03/16/native-json-modules-are-finally-real/) *Matt Smith*

## 🛠 代码与工具

### [Nuxt 4.4: 全栈 Vue 框架](https://nuxt.com/blog/v4-4)

这个全栈 Vue 框架开箱即用地包含了路由（现由 Vue Router v5 驱动）、服务端渲染和数据获取功能，新版本新增了自定义 `useFetch`/`useAsyncData` 工厂函数、类型化布局属性、构建性能分析等。

*Daniel Roe 和 Nuxt 团队*

---

### [Reveal.js 6.0: HTML 演示文稿框架](https://revealjs.com/)

一个长期存在的优雅演示文稿创建方式，任何拥有浏览器的人都能使用。[v6.0](https://github.com/hakimel/reveal.js/releases/tag/6.0.0) 有一些破坏性变更，切换至 Vite，并引入了官方的 React 封装。

*Hakim El Hattab*

---

### [40-60% 的移动端构建其实不需要进行](https://try.expo.dev/js-weekly-workflows)

Expo Workflows 是移动端 CICD，能够检测你的更改是否涉及原生代码，并跳过你不需要的构建。

*Expo Workflows 赞助*

---

### [RedwoodSDK 1.0 发布：Cloudflare 原生的 React 框架](https://rwsdk.com/blog/redwood-v1-getting-out-of-the-weeds)

一个服务端优先的 React 框架，以 Vite 插件形式构建，深度集成 Cloudflare 平台（[为什么？](https://rwsdk.com/blog/why-cloudflare-unified-platform)）及其提供的 Workers、数据库（D1）、持久化对象、存储（R2）、AI API 等。

*Peter Pistorius*

---

### 更多工具

- [Defuddle 0.14.0](https://github.com/kepano/defuddle) – 将页面的主要内容提取为 Markdown。这是 Mozilla [Readability](https://github.com/mozilla/readability) 背后理念的现代实现。

- [Extension.js 3.9](https://extension.js.org/) – 用于开发快速、统一的跨浏览器扩展的框架，零配置。

- [React Native Sandbox 0.5](https://github.com/callstackincubator/react-native-sandbox) – 在应用中运行多个隔离的 RN 实例。

- [XO 2.0](https://github.com/xojs/xo) – 带有*"大量好东西"*的有主见、可配置的 ESLint 10 封装。

- [Poku 4.1](https://poku.io/) – 跨平台测试运行器，支持 Node、Bun 和 Deno。

- [sax js 1.6](https://github.com/isaacs/sax-js) – 用于 Node 和浏览器的 SAX 风格流式 XML 解析器。

- 📺 [YouTube.js 17.0](https://github.com/LuanRT/YouTube.js/releases/tag/v17.0.0) – YouTube 私有 API 的 JavaScript 客户端。

- [Svelte SPA Router 5.0](https://github.com/ItalyPaleAle/svelte-spa-router) – Svelte 5 单页应用的路由器。

- 📃 [PDFKit 0.18](https://github.com/foliojs/pdfkit/releases/tag/v0.18.0) – 用于 Node 和浏览器的 PDF 生成库。

- [Cypress ESLint Plugin v6.2.0](https://github.com/cypress-io/eslint-plugin-cypress) – [Cypress](https://github.com/cypress-io/cypress) 测试的 ESLint 插件。

## 📢 生态系统其他动态

### 📈 [49 MB 的网页](https://thatshubham.com/blog/news-audit)

![news-audit](@@CDN@@/assets/img/web/JavaScriptWeekly20/img-03.webp)

在《49 MB 的网页》中，Shubham Bose 惊讶地发现加载一个 *纽约时报* 页面产生了 422 个网络请求和 49 兆字节的数据传输。他反思了导致这成为新闻网站普遍体验的问题。

---

### 🔍 [Difftastic: 基于语法的代码差异对比工具](https://difftastic.wilfred.me.uk/)

[Difftastic](https://difftastic.wilfred.me.uk/) 是一个基于*语法*对代码文件进行 diff 对比的便捷工具。[支持大多数流行语言](https://difftastic.wilfred.me.uk/languages_supported.html)，包括 JavaScript 和 TypeScript。

---

### 💻 [VS Code 1.111 发布](https://code.visualstudio.com/updates/v1_111)

[VS Code 1.111 已发布。](https://code.visualstudio.com/updates/v1_111) 值得注意的是，这是 VS Code 新的每周稳定版发布节奏的第一个版本。

---

### 🪣 [Amazon S3 推出账户区域命名空间](https://aws.amazon.com/blogs/aws/introducing-account-regional-namespaces-for-amazon-s3-general-purpose-buckets/)

Amazon S3 引入了[通用存储桶的账户区域命名空间](https://aws.amazon.com/blogs/aws/introducing-account-regional-namespaces-for-amazon-s3-general-purpose-buckets/)，这一功能将有助于防止所谓的"[bucketsquatting](https://onecloudplease.com/blog/bucketsquatting-is-finally-dead)"。

---

### 🎂 [Amazon S3 20 岁了！](https://aws.amazon.com/blogs/aws/twenty-years-of-amazon-s3-and-building-whats-next/)

**觉得自己老了吗？** Amazon 的 Sébastien Stormacq 回顾了无所不在的 AWS S3 云存储系统走过的 20 年历程。

---

*原文链接：[JavaScript Weekly Issue 777](https://javascriptweekly.com/issues/777)*
