---
title: JavaScript周刊-23
date: 2018-03-24 02:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 780: 2026年4月7日

## [JSIR：Google 开源的 JavaScript 高级中间表示](https://discourse.llvm.org/t/rfc-jsir-a-high-level-ir-for-javascript/90456)

![jsir](@@CDN@@/assets/img/web/JavaScriptWeekly23/img-01.webp)

Google 开源了一个新工具（JSIR），并提出了一个用于 JavaScript 的行业标准 IR（中间表示——如果说 AST 告诉你代码*长什么样*，IR 则告诉你代码*做什么*）。该工具已在 Google 内部用于代码分析和代码转换，其底层理念可能成为新一代工具链的基础。

*Zhixun Tan (Google)*

---

## [免费 Workshop：Claude Code 深度解析 — 4 月 21 日](https://www.addevent.com/event/8n58y7bjwqmr)

Anthropic 的 Lydia Hallie 将于 4 月 21 日在 Frontend Masters 教授一整天的 Claude Code Workshop。免费参加，无需订阅。

*Frontend Masters 赞助*

## [JavaScript 须知（2026 版）](https://frontendmasters.com/blog/what-to-know-in-javascript-2026-edition/)

一份 JavaScript 全景的最新概览，包括最新的 ECMAScript 新增特性、值得关注的框架、运行时、构建工具等。这是一个跟上时代的好方式。

*Chris Coyier*

## 简讯

- 🔓 Axios 团队发布了[上周 npm 供应链入侵事件的事后分析](https://github.com/axios/axios/issues/10636)。还有对[社会工程部分如何运作](https://github.com/axios/axios/issues/10636#issuecomment-4180237789)的深入探讨。

- 📊 WebKit、Google 和 Mozilla [联合推出了 *JetStream 3*](https://webkit.org/blog/17899/introducing-the-jetstream-3-benchmark-suite/)，这是面向浏览器的 JS 和 WASM 性能基准测试套件的最新版本。

- [Cloudflare 发布了 *EmDash*](https://blog.cloudflare.com/emdash-wordpress/)，一个带有 JavaScript 特色的 *"WordPress 精神继承者"*。

- [Svelte 团队发布了最新的月度回顾。](https://svelte.dev/blog/whats-new-in-svelte-april-2026)

## 版本发布

- [ESLint v10.2.0](https://eslint.org/blog/2026/04/eslint-v10.2.0-released/) – 通过新的 `meta.languages` 属性添加了对语言感知规则的支持。`Temporal` 现已获得支持。

- [Node.js 25.9.0 (Current)](https://nodejs.org/en/blog/release/v25.9.0) – 新增 `--max-heap-size` 用于设置进程的最大堆大小，并包含 [`stream/iter`](https://nodejs.org/docs/latest/api/stream_iter.html#iterable-streams)，一个新的实验性可迭代流 API。

## 📖 文章和视频

### [最低发布时限：被低估的供应链防御手段](https://daniakash.com/posts/simplest-supply-chain-defense/)

越来越多的包管理器支持指定最小"包龄"。其理念是，如果你等待一段时间，维护者和安全工具等将会处理最恶意的供应链攻击。这并非银弹，但可能适合你的场景，本文将介绍如何设置。

*Dani Akash*

---

### ▶ [TanStack Start: 一个客户端优先的 Web 框架](https://www.youtube.com/watch?v=8XGcc-FRPuo)

TanStack 创始人 30 分钟的演讲，展示了 [TanStack Start](https://tanstack.com/start/latest) 对 React 和 Solid 开发者的价值主张，面向寻求完整 SSR 框架的开发者。

*Tanner Linsley*

---

### [一个扩展替代你的整个分析管道](https://www.tigerdata.com/timescaledb?utm_source=cooperpress&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

TimescaleDB 为 Postgres 添加超表、95% 压缩率和连续聚合功能。在实时数据上运行分析。免费试用。

*Tiger Data (TimescaleDB 创建者) 赞助*

---

### [开源维护者的职业倦怠是真实存在的](https://openjsf.org/blog/burnout-is-real-for-open-source-maintainers)

一篇 40 分钟的音频采访（附有精彩的文字总结），采访对象是 Lodash 的创建者 John-David Dalton，Lodash 是 JavaScript 最受欢迎的项目之一。

*OpenJS 基金会*

---

### [CSS 的大扩张](https://blog.gitbutler.com/the-great-css-expansion)

一篇全面回顾，审视那些曾经是 JavaScript 天然领域（如工具提示、对话框、滚动动画）但现代 CSS 如今已能出色完成的 Web 任务。

*Pavel Laptev*

---

### 更多文章

- 📄 [使用 Three.js 构建双场景流体"X 光揭示"效果](https://tympanus.net/codrops/2026/03/23/building-a-dual-scene-fluid-x-ray-reveal-effect-in-three-js/) *Cullen Webber*

- 📄 [小技巧：`Intl` 也能本地化单位](https://www.stefanjudis.com/today-i-learned/intl-can-localize-units-too/) *Stefan Judis*

- 📄 [迁移到 Solid 2.0 的实践经验](https://www.brenelz.com/posts/migrating-to-solid-2/) *Brenley Dueck*

## 🛠 代码与工具

### [Fuse.js 7.3: 轻量级模糊搜索](https://fusejs.io/)

![fusejs](@@CDN@@/assets/img/web/JavaScriptWeekly23/img-02.webp)

需要一个容错模糊输入且无需专门后端的搜索功能吗？v7.3 新增了逐词模糊匹配和用于单字符串匹配的静态方法，而 v7.4 beta 则新增了基于 Worker 的分布式搜索以处理超大规模数据集。[演示展示了基本功能。](https://fusejs.io/)

*Kiro Risk*

---

### [你的 CI 不必这么慢](https://depot.dev/)

Depot CI：2-3 秒的任务启动、并行步骤、SSH 调试。运行 `depot ci migrate` 在几分钟内迁移你的 GitHub Actions。

*Depot 赞助*

---

### [Babylon.js 9.0 发布](https://www.babylonjs.com/)

Microsoft 广受欢迎的交互式 3D Web 体验渲染引擎，现在拥有基于节点的粒子编辑器、体积光照、高级高斯散点渲染等新功能。

*Carter & Lucchini (Microsoft)*

---

### [Marked.js 18.0: 快速的 Markdown 解析器与编译器](https://marked.js.org/)

一个为速度而构建的低级 Markdown 编译器。[演示展示了基本功能。](https://marked.js.org/) v18 主要是一个 Bug 修复版本，同时升级到 TypeScript 6。[GitHub 仓库。](https://github.com/markedjs/marked)

*Christopher Jeffrey*

---

### [TinyBase v8.1: 面向本地优先应用的响应式数据存储](https://tinybase.org/)

一个响应式数据存储和同步引擎，可作为多种类型应用的完整后端，现已原生支持 Svelte 5。

*James Pearce*

---

### [xdk-typescript: X API 的官方 SDK](https://www.npmjs.com/package/xdk-typescript)

社交媒体平台 X 的新官方 API SDK。

*X Dev Platform*

---

## 📢 生态系统其他动态

### 🎮 [CSS 注定完蛋？用 CSS 进行 3D 渲染的末日预感](https://nielsleenheer.com/articles/2026/css-is-doomed-rendering-doom-in-3d-with-css/)

![css-doom](@@CDN@@/assets/img/web/JavaScriptWeekly23/img-03.webp)

用 CSS 3D 渲染致敬经典游戏 *Doom*——这是一项让人难以置信的纯 CSS 实验，展示了现代 CSS 令人惊叹的渲染能力。

---

*原文链接：[JavaScript Weekly Issue 780](https://javascriptweekly.com/issues/780)*
