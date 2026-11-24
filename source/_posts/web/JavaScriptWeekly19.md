---
title: JavaScript周刊-19
date: 2018-03-22 16:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 776: 2026年3月10日

## [Solid v2.0.0 Beta：`<Suspense>` 的时代结束了](https://github.com/solidjs/solid/releases/tag/v2.0.0-beta.0)

![solid](@@CDN@@/assets/img/web/JavaScriptWeekly19/img-01.webp)

经过漫长的实验阶段，Solid 2.0 的首个 beta 版本终于到来，带来了对异步操作的一等支持——计算属性可以返回 Promise 或异步可迭代对象，响应式图会原生地围绕它们挂起和恢复。`<Suspense>` 被废弃，取而代之的是 `<Loading>` 用于初始渲染，而数据变更则获得了具有乐观更新支持的一等 `action()` 原语。对于现有用户来说，破坏性变更是相当多的，不过有[迁移指南](https://github.com/solidjs/solid/blob/next/documentation/solid-2.0/MIGRATION.md)可供参考。

*Ryan Carniato*

💡 Ryan 还让 AI 撰写了一份 [Solid 2.0 的架构论证](https://hackmd.io/@0u1u3zEAQAO0iYWVAStEvw/rJM9ws3Kbg)，将细粒度响应式系统定位为 AI 智能体时代唯一可持续的模型。他还做了[▶️ 一场直播](https://www.youtube.com/watch?v=-VzCdz7zfPc)，尝试通过挑战极限来*压垮* Solid 2.0。

---

<div style="float:right; margin-left:16px; margin-bottom:8px;">
  <img  src="@@CDN@@/assets/img/web/JavaScriptWeekly19/img-02.webp" width="125">
</div>

## [年复一年最受喜爱的 JavaScript 课程](https://frontendmasters.com/courses/javascript-hard-parts-v3/?utm_source=email&utm_medium=javascriptweekly&utm_content=jshardpartsv3)

JavaScript: The Hard Parts 被数千名开发者平均评分 4.92。为 JavaScript 的工作原理构建真实的心智模型，从执行上下文和闭包到异步行为和现代语言特性。

*Frontend Masters 赞助*

## [TypeScript 6.0 发布候选版](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0-rc/)

v6.0 主要是为今年晚些时候推出的 Go 驱动的原生 TypeScript 7.0 搭建的过渡桥梁，所有必要的 `tsconfig.json` 变更将为未来做好充分准备。RC 版本相比近期的 beta 版本[只有少量小改动。](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0-rc/#what%E2%80%99s-new-since-the-beta)

*Daniel Rosenwasser (Microsoft)*

## 简讯

- [TC39 第 113 次会议刚刚开始](https://github.com/tc39/agendas/blob/main/2026/03.md)，其中[将 Temporal API 推进到阶段 4](https://ptomato.name/talks/tc39-2026-03/) 的议题高居议程榜首。

- 📊 [Minification Benchmarks](https://github.com/privatenumber/minification-benchmarks) 是一个频繁更新的 JavaScript 代码压缩工具对比。[SWC](https://github.com/swc-project/swc) 总体领先，但 [Minify](https://github.com/tdewolff/minify) 和 [Oxc](https://github.com/oxc-project/oxc) 的压缩器也不遑多让，而且速度更快。

- [11ty (Eleventy)](https://www.11ty.dev/) 最初是一个基于 Node.js 的静态站点生成器，但现在它正在[更名为 *Build Awesome*](https://www.11ty.dev/blog/build-awesome/)，成为 [Font Awesome](https://fontawesome.com/) 旗下的项目。

- 🇫🇷 [dotJS 大会](https://www.dotjs.io/) 将于今年 9 月 1 日重返巴黎。[其议题征集](https://www.dotjs.io/speak) 开放至 4 月 28 日。

## 版本发布

- [Node.js 25.8.0 (Current)](https://nodejs.org/en/blog/release/v25.8.0) – 新增了 [`--permission-audit` 选项](https://github.com/nodejs/node/pull/61869)，以警告模式运行 Node 的[权限模型](https://nodejs.org/api/permissions.html)。

- [Astro 6.0](https://astro.build/blog/astro-6/) – `astro dev` 现在使用 Vite 的新 Environment API，因此你可以在开发期间运行与生产环境完全相同的运行时。此外，全新的 Fonts API 负责处理自定义字体。

- [Knockout 3.5.2](https://github.com/knockout/knockout/releases/tag/v3.5.2) – 这个经典的 MVVM 库六年来首次更新！

- [ESLint v10.0.3](https://eslint.org/blog/2026/03/eslint-v10.0.3-released/) 和 [ESLint v9.39.4](https://eslint.org/blog/2026/03/eslint-v9.39.4-released/)

- [Ember 6.11](https://blog.emberjs.com/ember-released-6-11/)、[Ionic Framework 8.8](https://ionic.io/blog/announcing-ionic-framework-8-8)、[React Native 0.85 RC.0](https://github.com/facebook/react-native/releases/tag/v0.85.0-rc.0)、[pnpm v10.32.0](https://github.com/pnpm/pnpm/releases/tag/v10.32.0)、[Recharts 3.8](https://github.com/recharts/recharts/releases/tag/v3.8.0)、[Jest 30.3](https://github.com/jestjs/jest/releases/tag/v30.3.0)

## 📖 文章和视频

### [七年迁移 TypeScript：Patreon 的 11,000 个文件转型之路](https://www.patreon.com/posts/seven-years-to-typescript-152144830)

这家知名创作者平台手中有一百万行 JavaScript 代码，虽然在新代码中采用 TypeScript 进展顺利，但将*全部*代码进行转换是一项艰巨的任务。这篇回顾文章涵盖了所涉及的工具和技术。

*Gavy Aggarwal (Patreon)*

---

### [使用 Jazz 和 Vue 3 构建实时待办应用](https://alexop.dev/posts/building-real-time-todo-app-jazz-vue/)

[Jazz](https://jazz.tools/) 是一个分布式数据库，具有实时同步和本地响应式 JSON 状态。

*Alexander Opalic*

---

### [Next.js Source Maps：从压缩块到可读的堆栈跟踪](https://blog.sentry.io/setting-up-next-js-source-maps-sentry/?utm_source=javascriptweekly&utm_medium=paid-community&utm_campaign=nextjs-fy27q1-nextjs&utm_content=newsletter-sponsored-link-sourcemaps-blog-learnmore)

你的堆栈跟踪不应该指向随机的 chunk 文件。学习如何配置 Source Map，让 Sentry 显示你实际编写的代码。

*Sentry 赞助*

---

### [通过打开一个 GitHub Issue 窃取 `npm` 发布令牌的故事](https://neciudan.dev/cline-ci-got-compromised-here-is-how)

一个仓库有一个 AI 驱动的问题分类系统，当任何 issue 被打开时就会运行，issue 的标题会被直接输入到提示词中……而这只是此处解释的三阶段攻击的第一步。

*Neciu Dan*

---

### [Wikipedia 遭遇自我传播的 JavaScript 蠕虫攻击](https://www.bleepingcomputer.com/news/security/wikipedia-hit-by-self-propagating-javascript-worm-that-vandalized-pages/)

一篇关于一个休眠脚本如何被 Wikimedia 员工意外触发，利用共享的全局脚本在 Wikipedia 的 *Meta-Wiki* 上破坏近 4,000 个页面的记录。

*Lawrence Abrams (Bleeping Computer)*

---

### 更多文章

- 📄 [如何在 JavaScript 中解码 VIN](https://cardog.app/blog/vin-decoder-javascript) – VIN（[车辆识别号](https://en.wikipedia.org/wiki/Vehicle_identification_number)）是分配给各种类型机动车的标准化编码。 *Cardog*

- 📄 [使用原生 JavaScript 构建异步页面过渡](https://tympanus.net/codrops/2026/02/26/building-async-page-transitions-in-vanilla-javascript/) *Valentin Mor*

## 🛠 代码与工具

### [RevoGrid: 高性能数据表格组件](https://rv-grid.com/)

![revogrid](@@CDN@@/assets/img/web/JavaScriptWeekly19/img-03.webp)

一个为海量数据集构建的高性能数据表格控件。可与 Vue、Angular、React、Svelte 集成，也可通过原生 JS 使用。[在线演示](https://rv-grid.com/demo/) 和 [GitHub 仓库。](https://github.com/revolist/revogrid)

*Revolist OU*

---

### [Clerk Core 3: 重新设计的 Hooks、更小的包体积、面向智能体的 API](https://go.clerk.com/eOhvd0o)

重新设计了 useSignIn、useSignUp 和 useCheckout hooks，约 50KB 的包体积缩减，无密钥模式扩展至 TanStack Start、Astro 和 React Router。

*Clerk 赞助*

---

### [ArkType 2.2: 将 TypeScript 类型用作运行时验证器](https://arktype.io/docs/blog/2.2)

一个 TypeScript 优先的验证库，类型和验证器是同一回事。编写一次类型，它就同时成为静态类型和运行时验证器。在 v2.2 中，`type.fn` 带来了运行时验证的*函数*，可自动检查输入和返回值。

*ArkType*

---

### [TinyBase 8.0: 面向本地优先应用的响应式数据存储](https://tinybase.org/)

一个响应式数据存储和同步引擎，可作为多种类型应用的完整后端。它可以独立运行或[与各种服务集成](https://tinybase.org/guides/the-basics/architectural-options/)，如云存储、客户端存储、SQL 数据库等。[v8.0](https://tinybase.org/guides/releases/#v8-0) 新增了中间件功能，并支持在其"单元"中存储对象和数组。

*James Pearce*

---

### 📄 [VMPrint: 纯 JS 排版引擎，输出完美 PDF](https://github.com/cosmiciron/vmprint)

通常人们会依赖无头 Chrome 实例来完成打印到 PDF 的工作，但 VMPrint *"保证给定相同的输入就能产生完全一致的布局，精确到每个字形的亚点位置。"* [这里有一份示例 PDF。](https://github.com/cosmiciron/vmprint/blob/main/documents/readme-assets/readme.pdf)

*Cosmic Iron*

---

### 更多工具

- [SQLite JS 1.3](https://github.com/sqliteai/sqlite-js) – 用 JavaScript 编写自定义 SQLite 函数。

- [Heapify 1.0](https://github.com/luciopaiva/heapify) – 快速的 JavaScript 优先队列，使用二叉堆实现。

- 📺 [OpenPlayer.js 3.0](https://github.com/openplayerjs/openplayerjs) – 模块化、可 Tree-Shake 的 HTML5 媒体播放器。

- [Emittery 2.0](https://github.com/sindresorhus/emittery) – Sindre Sorhus 的简洁现代异步事件发射器。

- [Svelte Sonner 1.1](https://github.com/wobsoriano/svelte-sonner) – Svelte 应用的 Toast 通知组件。

- 📄 [EmbedPDF 2.8](https://github.com/embedpdf/embed-pdf-viewer) – 框架无关的 JavaScript PDF 查看器。

- [Tabulator 6.4](https://tabulator.info/) – JavaScript 应用的交互式数据表格。

- 🕹️ [melonJS 18.0](https://melonjs.org/) – 轻量级 HTML5 2D 游戏引擎。

- [flatted 3.4](https://github.com/WebReflection/flatted) – 快速、极简的循环 JSON 解析器。

- [Poku 4.0](https://poku.io/) – 跨平台测试运行器。

## 📢 生态系统其他动态

### 🖥️ [JSLinux 现已支持 x86_64](https://bellard.org/jslinux/)

![jslinux](@@CDN@@/assets/img/web/JavaScriptWeekly19/img-04.webp)

距离我们上次提到 [JSLinux](https://bellard.org/jslinux/) 已经过去了八年——这是 [Fabrice Bellard](https://bellard.org/) 在浏览器中运行的 JavaScript 驱动 Linux 虚拟机。他仍在持续开发，本周它已支持 x86_64、AVX-512 和 APX。

前往[完整的 x86_64 Alpine Linux 环境](https://bellard.org/jslinux/vm.html?cpu=x86_64&url=alpine-x86_64.cfg&mem=256)，即刻开始使用 Git、Node、Ruby、Perl、Python 等工具。Hacker News 用户[讨论了一些使用场景。](https://news.ycombinator.com/item?id=47312829)

[JSLinux 背后的技术在此处进行了说明](https://bellard.org/jslinux/tech.html)，其中最大的限制在于其网络连接需要通过一个上限为 40KB/s 的代理。

---

### 🔗 [你知道吗？URL 中可以使用换行符和制表符](https://lemire.me/blog/2026/02/28/you-can-use-newline-characters-in-urls/)

你可以在 HTML 的 URL 中[使用换行符和制表符](https://lemire.me/blog/2026/02/28/you-can-use-newline-characters-in-urls/)，它们会被忽略。

---

### ⏳ [在 NVIDIA Jetson Nano 上编译 Node.js 需要多久？](https://brtkwr.com/posts/2026-03-02-upgrading-openclaw-to-latest-node22-on-jetson-nano/)

大约 27 小时。

---

### 🐦 [纯 CSS 版 Flappy Bird](https://blog.scottlogic.com/2026/03/09/noJS-3-flappy-bird.html)

如何[仅用 CSS 而完全不用 JavaScript 来重现 Flappy Bird 游戏](https://blog.scottlogic.com/2026/03/09/noJS-3-flappy-bird.html)。

---

*原文链接：[JavaScript Weekly Issue 776](https://javascriptweekly.com/issues/776)*
