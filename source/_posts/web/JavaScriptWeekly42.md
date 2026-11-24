---
title: JavaScript周刊-42
date: 2018-04-01 13:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 799: 2026年8月25日

*与 Webflow 联合推出*

![jgkycdtzpabaibtigxfp](@@CDN@@/assets/img/web/JavaScriptWeekly42/img-01.webp)

## [Bun 1.4：Node.js 兼容性前所未有地强](https://bun.com/blog/bun-v1.4)

在最初预期的发布时间过去数周后，Bun 从 Zig 到 Rust 的[大规模 AI 驱动重写](https://bun.com/blog/bun-in-rust)终于到来，还配上了传统的[▶️ 发布视频](https://www.youtube.com/watch?v=i38DgEuaJwM)。团队在兼容性上投入了大量精力，不仅针对 Node，还包括 Next.js、Playwright、Vitest 和 Nuxt。吞吐量以及 CPU/内存占用也有巨大改善。

*Bun 团队*

☕ 如果你打算读完这篇发布文章，请先准备尽可能大的一杯咖啡。这很可能是我运营这份通讯十五年来见过的最长的一篇。

<div style="float:right"><img  src="@@CDN@@/assets/img/web/JavaScriptWeekly42/img-02.webp" width="140" height="140" alt="Webflow" style="padding-top: 12px; padding-left: 12px;"></div>

## [Webflow for Developers](https://developers.webflow.com/?utm_source=cooperpress-newsletter&utm_medium=email&utm_campaign=fy27-cooperpress-newslettter&utm_content=javascript-weekly)

大多数工具迫使你在可视化构建器和真实代码之间二选一。Webflow 让你两者兼得：提供 API、SDK、代码组件（Code Components）和用于部署自定义应用的 Webflow Cloud，另外还有可用于配合智能体构建的 MCP server。

*Webflow 赞助*

## [面向 JavaScript 开发者的乐理](https://runjs.app/blog/music-theory-for-programmers)

一场从第一性原理出发的乐理之旅：用简单的算术推导出十二个音、音阶、和弦与和弦进行，全程配有可运行的 Web Audio 示例。

*Luke Haas*

## [Solid 2.0 RC：大揭晓（The Big `<Reveal>`）](https://www.solidjs.com/blog/solid-2-0-rc-the-big-reveal)

异步现在被纳入响应式图（reactive graph）之中，因此异步数据可以流经普通的 memo。`createResource`、`batch` 和 `startTransition` 已被移除。SolidStart 被并入 Vite 插件上的 `start: true` 标志，API 现已冻结。

*Ryan Carniato*

### 简讯

- Aurora Scharff 展示了 [Next.js 16.3 如何帮助开发者构建“类应用”体验](https://nextjs.org/blog/building-app-like-experiences-with-nextjs-16-3)。

- Aviv Keller 带来了 [Node.js Interactive 2026 的全面回顾](https://nodejs.org/en/blog/events/nodejs-interactive-2026)，该活动两周前在亚特兰大举行。

- 🤖 [TanStack AI 已进入 RC 阶段](https://tanstack.com/blog/tanstack-ai-rc)，文章回顾了迄今为止的历程及其主要功能集。

- Oxlint [新增了对 React Compiler 的支持](https://blog.master.dev/react-compiler-linting-just-got-a-rust-native-speedup-in-oxlint/)。

### 版本发布

- [Electron 44](https://github.com/electron/electron/releases/tag/v44.0.0) – 尚无发布文章，但它已放弃 32 位支持，要求 macOS 13+，`clipboard` 现在与 W3C Clipboard API 对齐，并新增了 `net.WebSocket` 以及在 Linux 上设置窗口透明度的能力。

- [Waku 1.0 RC](https://waku.gg/blog/waku-v1-rc) – 极简的 RSC 优先 React 框架，现已在 v1 正式版发布前冻结 API，新增能在编译期捕获错误路由的类型安全导航，以及基于缓存路由外壳的实验性即时渲染（instant paints）。

- [SvelteKit 3 候选发布版](https://svelte.dev/blog/sveltekit-3-release-candidate)、[React Native 0.87](https://reactnative.dev/blog/2026/08/11/react-native-0.87)、[ESLint 10.9](https://eslint.org/blog/2026/08/eslint-v10.9.0-released/)（以及 [10.9.1](https://eslint.org/blog/2026/08/eslint-v10.9.1-released/)）、[Axios 1.20.0](https://github.com/axios/axios/releases/tag/v1.20.0)、[pnpm 11.23](https://pnpm.io/blog/releases/11.23)

## 📖 文章和视频

### [移除代码为何胜过更好的调度](https://infrequently.org/2026/08/notes-on-performance-remediation-strategies/)

很多性能工作都花在调整资源的加载时机上，而更大的收益通常来自根本不发送这些代码。Alex Russell 论证说，这与其说是技术问题，不如说是管理问题。

*Alex Russell*

---

### [ESM 与 CommonJS：`import` 和 `require` 究竟做了什么](https://blog.gaborkoos.com/posts/2026-08-14-Your-Modules-Are-Lying-to-You/)

它们看起来是同一种操作，但 Gabor 展示了 ESM 的 `import` 始终连接到导出方的绑定，而解构后的 `require()` 只持有一份*副本*。其后果会在循环依赖和已发布的包中显现。

*Gabor Koos*

---

### [以战略构建，以好奇引领](https://jobs.fidelity.com/en/life-at-fidelity/our-stories/tech-careers/fidelity-tech-strategy-empowers-associates/?utm_source=javascript&utm_medium=paidsocial&utm_campaign=jobssocial&utm_content=awn-tech-nl2-s)

Fidelity 正在寻找善于提问、敢于挑战惯例，并关心其产品影响力的技术人才。

*Fidelity Careers 赞助*

---

### [Cloudflare 如何将博客迁移到自家的 WordPress 替代品](https://blog.cloudflare.com/cloudflare-blog-uses-emdash/)

Cloudflare 如何将其主博客迁移到 [EmDash](https://www.emdashcms.com/)，即他们正在构建的 Astro CMS。有意思的部分包括 k6 负载测试，以及在切换期间使用代理 Worker 来逐步提升流量。

*Jackson、Carneiro 和 Dutton (Cloudflare)*

---

### 📺 [TypeScript 的创建者谈 10 倍速的 TypeScript，以及为什么 AI 不会取代软件工程师](https://www.youtube.com/watch?v=cywK3XYYJ2o)

与微软 Anders Hejlsberg 的一场坦诚的一小时访谈。

*Ryan Peterman*

---

### [在 TypeScript 对象中隐藏内部状态](https://www.carlos-menezes.com/posts/hiding-properties-typescript)

如何用一个未导出的 `unique symbol` 作为属性键，让内部状态不出现在 `Object.keys` 和 `JSON.stringify` 中。

*Carlos Menezes*

---

### [使用 TanStack Router 实现可靠的查询预取](https://tkdodo.eu/blog/reliable-query-prefetching-with-tanstack-router)

*Dominik Dorfmeister*

---

### [我修改了 TypeScript 编译器，让它能把九个数相加](https://bhugo.dev/blog/compile-time-crimes/1/)

*Hugo Vilela*

## 🛠 代码与工具

### [MicroLighter：一个不碰 DOM 的 2KB 语法高亮器](https://daverupert.com/2026/08/microlighter/)

![tcpdkzgmos3kjf4wj5mw](@@CDN@@/assets/img/web/JavaScriptWeekly42/img-03.webp)

一个小巧的客户端语法高亮器，利用了 [CSS Custom Highlights API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API)。零依赖，并提供浅色和深色主题。主页上有一些[在线演示](https://davatron5000.github.io/microlighter/)。

*Dave Rupert*

---

### [TermDOM：用 HTML、CSS 和 DOM 构建终端 UI](https://termdom.org/)

一个真实的 DOM 与布局引擎，可将内容绘制到终端，因此你可以用原生 JS（或任意框架）和 HTML 编写 TUI（而不像 [Ink](https://github.com/vadimdemedes/ink) 那样只能用 React）。本周的 [v0.1.5 版本](https://github.com/bikeshaving/termdom/releases/tag/v0.1.5)新增了 CSS grid 支持。

*Brian Kim*

---

### [无需第二套系统，在 Drizzle 中实现全文搜索](https://github.com/paradedb/drizzle-paradedb)

试试 Drizzle 的官方 ParadeDB 集成。直接在实时的 Postgres 表上搜索。无需 ETL，无需 Elasticsearch 集群。

*ParadeDB 赞助*

---

### [Formisch 1.0：框架无关、基于 Schema 的表单库](https://formisch.dev/blog/formisch-v1/)

一个无头表单库，由 [Valibot](https://valibot.dev/) schema 驱动类型与校验，覆盖八种框架。v1 新增了 Angular 和 React Native 支持，为 TanStack Form/React Hook Form/Formik 用户提供了迁移指南，还为智能体提供了 Markdown 文档。

*Formisch 团队*

---

### [Stryker Mutator 10.0：用变异测试来检验你的测试](https://stryker-mutator.io/)

Stryker 会对你的代码做出[细小而刻意的改动](https://stryker-mutator.io/docs/mutation-testing-elements/supported-mutators/)，并检查你的测试套件能否捕获它们。如果捕获不到，说明你的测试可能过于宽松，需要改进。这里是[入门指南](https://stryker-mutator.io/docs/stryker-js/getting-started/)。

*Jansen、de Lang 等*

### 版本发布

- [Ionic Framework v9](https://ionic.io/blog/announcing-ionic-framework-9) – 面向 React、Angular 和 Vue 的移动优先 UI 工具包在时隔两年后回归，支持 React Router 6、Angular 21+ 的无 Zone 变更检测等。另有[面向 v8 用户的升级指南](https://ionicframework.com/docs/updating/9-0)。

- [Papa Parse 5.7](https://www.papaparse.com/) – 快速、灵活的 CSV 转 JSON 及 JSON 转 CSV 库。

- 🌐 [MapLibre GL JS 6.6](https://github.com/maplibre/maplibre-gl-js) – 用于浏览器交互式地图的 GPU 加速矢量瓦片渲染库。

- 📊 [Plotly.js 4.0](https://github.com/plotly/plotly.js) – 用于创建交互式数据可视化的独立库。

- [GTKX 1.3](https://gtkx.dev/blog/gtkx-1-3) – 用 React 创建原生 GTK 驱动的 Linux 桌面应用。

- 📺 [YouTube.js 18.0](https://github.com/LuanRT/YouTube.js/releases/tag/v18.0.0) – YouTube 内部 API 的 JavaScript 客户端。

## 📢 生态系统其他动态

更广泛生态中的其他一些有趣动态：

- 上周，Next.js 团队[在 Reddit 上做了一场 AMA（有问必答）](https://www.reddit.com/r/nextjs/comments/1vrq0tp/were_the_nextjs_team_ask_us_anything/)，帖子里满是答案与洞见。

- 🖼️ Jake Archibald 发布了[关于 Firefox 即将支持 JPEG XL 的进展](https://hacks.mozilla.org/2026/08/intent-to-ship-jpeg-xl/)，Chrome 也计划很快跟进支持。

- 📊 Gajus Kuizinas 搭建了一个 [CSS-in-JS Arena](https://github.com/gajus/css-in-js-arena)，在同一个 React Router 8 应用上对比 StyleX、Panda CSS 和他全新推出的 [Bamboo CSS](https://bamboocss.com/docs/overview/getting-started/)。

- 你知道吗，现在拆分一个 git 提交[只需一条命令](https://blog.gnoack.org/post/git-history-split)（在 [Git 2.54+](https://github.blog/open-source/git/highlights-from-git-2-54/#h-rewrite-history-with-git-history) 中）？`git history split <ref>` 会逐块（hunk）遍历改动，并提示你为两半分别填写提交信息。

- 🕹️ [一个用 JavaScript 编写的 N64 模拟器](https://github.com/hulkholden/n64js)。如果你有可用的 ROM 文件，可以[在这里试玩](https://hulkholden.github.io/n64js/)。

*原文链接：[JavaScript Weekly Issue 799](https://javascriptweekly.com/issues/799)*
