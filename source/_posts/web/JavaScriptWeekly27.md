---
title: JavaScript周刊-27
date: 2018-03-25 19:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 784: 2026年5月5日

## [Remix 3 进入 Beta — 不再是 React 框架](https://remix.run/blog/remix-3-beta-preview)

![remix](@@CDN@@/assets/img/web/JavaScriptWeekly27/img-01.webp)

Remix 有相当丰富的背景故事。它于 2020 年由 React Router 背后的二人组创建，被视为 Next.js 的替代方案，于 2022 年被 Shopify 收购，其核心理念于 2024 年融入 React Router v7。现在，一个新的方向：一个全栈、Web 标准优先的框架，拥有自己的 UI 组件模型……而且*不再依赖 React*。

*Michael Jackson (Remix)*

---

## [构建随时间不断优化的 AI 功能](https://frontendmasters.com/courses/agentic-systems/?utm_source=email&utm_medium=javascriptweekly&utm_content=agenticsystems)

加入 Scott Moss，参加这个详细的视频课程，涵盖智能体系统、评估框架、RAG 和上下文工程——交付可靠、生产就绪 AI 功能所需的一切。

*Frontend Masters 赞助*

## [Node.js 26.0.0 (Current) 发布](https://nodejs.org/en/blog/release/v26.0.0)

macOS 构建问题将发布日期推迟到了今天，但最新版本的 Node.js 终于到来，默认启用了 [Temporal API](https://bloomberg.github.io/js-blog/post/temporal/)，搭载 V8 14.6 和 Undici 8。v26 是"Current"前沿版本，将在 10 月份升级为 LTS。

*Rafael Gonzaga*

## 简讯

- [Vitest](https://vitest.dev/) 与 Vite 紧密耦合，但其维护者[提议将其变得"框架无关"](https://github.com/vitest-dev/vitest/discussions/10271)，以支持其他构建工具和运行时。

- Hacker News 上的用户[非常兴奋地](https://news.ycombinator.com/item?id=48016880)讨论 Bun 的 Jarred Sumner [将 Bun 从 Zig 移植到 Rust 的努力。](https://github.com/oven-sh/bun/commit/46d3bc29f270fa881dd5730ef1549e88407701a5) Jarred [在讨论串中现身](https://news.ycombinator.com/item?id=48019226)安抚了情绪。Rust 移植*确实在进行*，但目前没有长期*切换*的意图。

- Svelte 团队[分享了最新的月度回顾](https://svelte.dev/blog/whats-new-in-svelte-may-2026)，包括 Svelte [出现在 ThoughtWorks 最新的《技术雷达》中的消息。](https://www.thoughtworks.com/radar/languages-and-frameworks/summary/svelte)

- Deno 正在获得[实验性的 `import defer` 支持](https://github.com/denoland/deno/pull/32360)（[TC39 提案](https://github.com/tc39/proposal-defer-import-eval)），可能是首个支持该特性的运行时。

## 版本发布

- [PM2 7.0](https://github.com/Unitech/pm2/releases/tag/v7.0.0) – Node.js 进程管理器进行了重构，大幅削减了依赖数量，并将集群模式和监控代理扩展到 Bun 应用。

- [Astro v7 Alpha](https://astro.build/blog/astro-620/#astro-v7-alpha) – 面向内容驱动网站的 Web 框架预览了其基于 Vite 8、Rust 编译器驱动的版本，同时发布了 [v6.2。](https://astro.build/blog/astro-620/)

- [Electron 41.5](https://github.com/electron/electron/releases/tag/v41.5.0) – 跨平台桌面应用框架在 macOS 上为 WebAuthn 添加了 Touch ID 支持。

- [Ember 6.12](https://blog.emberjs.com/ember-released-6-12/) – 为 Ember 7.0 做准备的最后一个 6.x 版本。

- [ESLint 10.3](https://eslint.org/blog/2026/05/eslint-v10.3.0-released/)、[Zod 4.4](https://github.com/colinhacks/zod/releases/tag/v4.4.0)、[Babylon.js 9.5](https://github.com/BabylonJS/Babylon.js/releases/tag/9.5.0)

## 📖 文章和视频

### [在浏览器中测试 Vue 组件](https://jvns.ca/blog/2026/05/02/testing-vue-components-in-the-browser/)

Julia 为她的组件设置了完全在浏览器中运行的集成测试，绕过了额外的工具链，并分享了她在挂载组件、等待 DOM 更新、填写表单和测量覆盖率方面遇到的问题。

*Julia Evans*

---

### [开放 Web 的可信 JavaScript](https://discourse.mozilla.org/t/web-application-integrity-and-transparency/143645)

Web 应用完整性与透明度（WAICT）是一个新兴规范，用于通过加密方式验证用户浏览器中运行的 JavaScript 是否与网站发布的一致（[这里有完整解释](https://discourse.mozilla.org/t/web-application-integrity-and-transparency/143645)）。原型已在 Firefox Nightly 中上线。

*Firefox 安全团队 (Mozilla)*

---

### [断点和 `console.log` 是过去式，时间旅行才是未来](https://wallabyjs.com/?utm_source=cooperpress&utm_medium=javascriptweekly&utm_content=javascriptweekly)

比断点和 console.log 快 15 倍的 JavaScript 调试体验，支持 Vitest、Jest、Karma、Jasmine 等。

*Wallaby Team 赞助*

---

## 🛠 代码与工具

### [Anime.js 4.4: 灵活的 JavaScript 动画引擎](https://animejs.com/)

![animejs](@@CDN@@/assets/img/web/JavaScriptWeekly27/img-02.webp)

这个已有十年历史的"用 JavaScript 为任何东西添加动画"的库继续变得更好，新增了 `scrambleText` 效果和用于交错网格的自动网格布局模式。Anime 的文档堪称一流，充满了示例。

*Julian Garnier*

---

### [使用 Vonage Video API 和 React 进行视频归档](https://developer.vonage.com/en/blog/video-archiving-with-the-vonage-video-api-and-react)

掌握四种录制方式：仅捕获音频、分离流录制，或使用 Experience Composer 实现自定义品牌布局。

*Vonage 赞助*

---

### [Formisch: 模块化、类型安全的表单库](https://formisch.dev/)

一个基于 Schema 的无头表单库，适用于 Preact、Qwik、React、SolidJS、Svelte 和 Vue，使用 Valibot 管理表单状态和验证。[在 Playground 中试用演示。](https://formisch.dev/)

*Open Circle*

---

### [opentype.js: 读写 OpenType 字体](https://opentype.js.org/)

在浏览器和 Node.js 中直接访问字形。广泛支持 WOFF、OTF 和 TTF，支持连字、字距调整和表情符号。你还可以从零开始创建自己的字体。新版 v1.3.5 是即将发布的 2.0 的预览版。[GitHub 仓库。](https://github.com/opentypejs/opentype.js)

*Frederik De Bleser*

---

### [View Transitions Mock: 同文档视图过渡的非视觉 Polyfill](https://github.com/GoogleChromeLabs/view-transitions-mock)

一个 JS 实现的同文档视图过渡，不含视觉效果。编写一个干净的代码路径：支持的浏览器获得过渡效果，不支持的获得即时 DOM 替换，但 Promise 行为保持一致。

*Google Chrome Labs*

---

### 更多工具

- [pnpm v11.0.5](https://github.com/pnpm/pnpm/releases/tag/v11.0.5) – 自上周 [11.0 大版本发布](https://pnpm.io/blog/releases/11.0)以来部署了许多 Bug 修复。

- [Electrobun 1.18](https://blackboard.sh/electrobun/docs/) – 在 Bun 之上构建小型跨平台桌面应用。（[更新日志](https://docs.electrobunny.ai/electrobun/guides/changelog/v1-18-0/)）

- [useHotkeys 5.3](https://github.com/JohannesKlauss/react-hotkeys-hook) – 在组件中使用键盘快捷键的 React Hook。

- [RxDB 17.2.0](https://github.com/pubkey/rxdb/releases/tag/17.2.0) – 快速、本地优先、响应式 JavaScript 应用数据库。

## 📢 生态系统其他动态

### 🐱 [Crashcat: 3D 刚体物理库](https://crashcat.dev/)

![crashcat](@@CDN@@/assets/img/web/JavaScriptWeekly27/img-03.webp)

怎么能不爱一个你的角色是坐在敞篷车里的猫、穿过无尽障碍物大军的项目首页？[Crashcat](https://crashcat.dev/) 是一个为游戏、模拟和 Web 体验构建的 JavaScript 3D 刚体物理库，附有[许多有趣的示例。](https://crashcat.dev/examples/)

---

*原文链接：[JavaScript Weekly Issue 784](https://javascriptweekly.com/issues/784)*
