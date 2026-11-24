---
title: JavaScript周刊-44
date: 2018-04-02 14:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 801: 2026年9月8日

*与 Greptile 联合推出*

![wq9zwktpt9rxrly3oo74](@@CDN@@/assets/img/web/JavaScriptWeekly44/img-01.webp)

## [Turbopack 如何分块打包你的 JavaScript](https://nextjs.org/blog/turbopack-chunking)

从 Network 面板入手、层层向上，审视分块策略，以及打包器在更少请求与更少代码之间所做的权衡（例如 8 个 chunk 可能比 355 个更重），并以打包 Next.js 官网本身的数据为佐证。

*Sam Poder*

<div style="float:right"><img  src="@@CDN@@/assets/img/web/JavaScriptWeekly44/img-02.webp" width="140" height="140" alt="Greptile" style="padding-top: 12px; padding-left: 12px;"></div>

## [在你的 JS PR 合并前捕获运行时 Bug](https://www.greptile.com/trex?utm_source=javascriptweekly&utm_medium=paid-community&utm_campaign=javascriptweekly_primary_sep8)

Greptile 现在会运行你的代码来查找 Bug。T-Rex 在沙箱中运行你的 PR 分支，使用浏览器智能体点遍你的 UI，并将截图和视频作为问题证据直接附在 PR 中。

*Greptile 赞助*

## [Vitest 5.0 聚焦速度与测试调试](https://vitest.dev/blog/vitest-5)

这个 Vite 原生测试运行器迎来重大版本，其基准测试仓库显示，在依赖繁重的应用上运行速度最高提升 53%。新的 [Trace View](https://vitest.dev/guide/browser/trace-view) 可以逐步回放*浏览器模式*下的测试，[`vitest doctor`](https://vitest.dev/guide/cli#vitest-doctor) 则会推荐一些设置，让你的测试套件跑得更快。

*Vitest 团队*

## [Safari 如何修复顶层 `await`](https://webkit.org/blog/18227/fixing-top-level-await-in-safari/)

Safari 的模块加载器最初构建在一个已被放弃的规范提案之上，加入顶层 `await` 后引发了持续数年的 *"cannot access before initialization"* 错误。Safari 27 让它完全符合规范，但这需要一次彻底重写，本文解释了其中的复杂性。

*Kai Tamkun (WebKit)*

### 简讯

- 🎂 [jQuery 1.0 已经 20 岁了](https://www.infoq.com/news/2026/09/jquery-20-years/)。InfoQ 回顾了 `$()` 如何帮助我们避开浏览器大战，以及为什么许多网站仍在使用它。再往前十年，微软为了规避商标问题，以 [JScript](https://en.wikipedia.org/wiki/JScript) 的名义[在 *Internet Explorer* 中发布了 JavaScript](https://bsky.app/profile/webdesignmuseum.org/post/3muu3c4wy222g)。

- [两名男子因 TeamPCP npm 供应链攻击被捕](https://www.aikido.dev/blog/teampcp-arrested-supply-chain)。TeamPCP 被怀疑克隆了 Shai-Hulud 蠕虫，从而引发了 ["Mini Shai-Hulud"](https://www.stepsecurity.io/blog/a-mini-shai-hulud-has-appeared) 攻击浪潮。

- [VoidZero 的最新进展](https://voidzero.dev/posts/whats-new-aug-2026)庆祝 Vitest 周下载量突破 1 亿、React Compiler 支持进入 Vite，以及 Rolldown、Vite+ 和 [ViteConf](https://viteconf.org/) 的最新消息（后者将于今年 10 月 15 日在线举行）。

### 版本发布

- [deck.gl 9.4](https://deck.gl/docs/whats-new#deckgl-v94) – 这个 GPU 驱动的数据可视化库扩展了实验性的 WebGPU 支持，预计这将是 v9 系列的最后一个版本。
- [Bun 1.4.1](https://bun.com/blog/bun-v1.4.1) 和 [1.4.2](https://bun.com/blog/bun-v1.4.2) – 大幅降低空闲内存占用，`bun build` 产物体积更小，`Bun.serve` 可在同一端口上同时支持 HTTP/2 与 HTTP/1.1，等等。
- [NVM for Windows 2.0](https://docs.nvm-windows.com/features/newv2/) – Windows 上的 Node 版本管理器。v2 不再需要管理员权限。
- [Astro 7.3](https://astro.build/blog/astro-730/)、[ESLint 10.10.0](https://eslint.org/blog/2026/09/eslint-v10.10.0-released/)、[Storybook 10.6](https://github.com/storybookjs/storybook/releases/tag/v10.6.0)、[Vuetify 4.2](https://github.com/vuetifyjs/vuetify/releases/tag/v4.2.0)

## 📖 文章和视频

### ▶ [VS Code 的故事](https://www.youtube.com/watch?v=kHL3XzjpT5w)

![ayffabov5k9i9tii8xeb](@@CDN@@/assets/img/web/JavaScriptWeekly44/img-03.webp)

一部官方出品的电影长度纪录片，讲述 [Visual Studio Code](https://code.visualstudio.com/) 从瑞士的一个秘密项目一路走到今天的历程。创始工程师们讲述了在 Electron、LSP 和扩展 API 等领域做出的决策，也坦诚地谈到了如今涌现的各种分支。

😅 我们还了解到，在 2015 年发布时，他们每获得 100 个 Hacker News 点赞就喝一杯啤酒……最后不得不停在 1,400（指的是票数，不是啤酒！）

*Microsoft 与 Stefan Kingham*

---

### [Fetch 点半：`await fetch()` 到底在等什么](https://blog.gaborkoos.com/posts/2026-09-08-Half-Past-Fetch/)

你知道 `await fetch(url)` 等待的是响应头，而不是完整的响应体吗？Gabor 深入探讨了这一点在连接、`clone()`、中止和超时方面带来的一些令人惊讶的后果。

*Gábor Koós*

---

### [你的 AI 写出的测试能通过，却证明不了任何东西。来修复它](https://wallabyjs.com/whatsnew/cli.html?utm_source=cooperpress&utm_medium=javascriptweekly&utm_content=javascriptweekly)

Wallaby CLI 借助实时覆盖率和运行时数据，让测试生成智能程度提升 10 倍，同时少用 3 倍的 token。[安装一个 skill 即可](https://wallabyjs.com/whatsnew/cli.html?utm_source=cooperpress&utm_medium=javascriptweekly&utm_content=javascriptweekly)。

*Wallaby 团队赞助*

---

### [前端项目对抗 AI 敷衍代码的 10 个举措](https://evilmartians.com/chronicles/ten-anti-ai-slop-moves-for-frontend-projects-going-faster-than-humans-can-review)

逐一介绍一套自动化检查，减少你需要人工审查的代码量，涵盖 OpenAPI 代码生成、分层边界、变异测试，以及用 CI 让这一切真正落地。

*Yuri Mikhin (Evil Martians)*

---

### [浏览器主线程很昂贵](https://kciter.so/posts/the-expensive-main-thread/en/)

一篇详尽且配有演示的探讨，讲述如何合理利用主线程时间，包括拆分、批处理、排定优先级和延迟任务，最终把工作完全移出主线程。

*Lee Sun-Hyoup*

---

### 📄 [我为什么把 Moonshine 移植到 JavaScript](https://petewarden.com/2026/08/15/why-i-ported-moonshine-to-javascript/)

Pete 的低延迟语音转文本运行时现在可以在浏览器中运行，从而避免与服务器之间的往返。

*Pete Warden*

---

### 📺 [一个人究竟怎样才能改变 JavaScript？](https://www.youtube.com/watch?v=OkuNJo9tTtg)

来自一位 TC39 代表的两分钟讲解。

*Mikhail Barash*

## 🛠 代码与工具

### [Dropzone.js 6.x：拖拽上传库回归](https://www.dropzone.dev/)

![jtleeynffjs0yrixzyqg](@@CDN@@/assets/img/web/JavaScriptWeekly44/img-04.webp)

这个负责浏览器端拖拽上传的库迎来重大更新。经过长达 5 年（！）的 beta，v6.0、6.1 和 6.2 在两天内相继发布，带来零依赖、更小的包体积，并修复了可能损坏文件的分块上传问题。

*Mat Simon*

---

### [Rslib 1.0：用于发布 JavaScript 库的构建工具](https://rslib.rs/blog/v1-0)

来自 Rspack 团队的统一构建流水线，处理发布软件包时那些令人头疼的部分，比如让 ESM 和 CJS 并存、输出 Module Federation，以及跨 React、Vue、Svelte 和 Solid 的组件 CSS。

*Chenwei Dai、Elecmonkey 等*

---

### [让构建时间与你的时间取得平衡](https://jobs.fidelity.com/en/technology-careers/?utm_source=javascript&utm_medium=paidsocial&utm_campaign=jobssocial&utm_content=awn-tech-nl4-s)

我们的技术专家从事有意义的工作，我们也为他们提供支持，让他们拥有有意义的生活。

*Fidelity Careers 赞助*

---

### [vgpu：在浏览器或 Node.js 中渲染 WebGPU 着色器](https://vgpu.sh/)

提供了一种方式，让同一份着色器既能在浏览器中使用，也能通过 Node 无头渲染（输出高分辨率 PNG 或 MP4 视频）。WGSL 模块可以像 TypeScript 那样导入和导出。

*Vercel*

---

### [SimpleWebAuthn 14.0：现已支持后量子 Passkey](https://github.com/MasterKale/SimpleWebAuthn/releases/tag/v14.0.0)

这个 passkey 库现在可以验证后量子 ML-DSA passkey，并且在 Node 24.7 及以上版本中，注册时默认优先使用 ML-DSA-44。

*Matthew Miller*

---

### 版本发布

- [ESLint Config Inspector 3.4](https://github.com/eslint/config-inspector) – 新增耗时分析，让你更容易找出拖慢 lint 运行的规则。
- [GPUIX 0.7](https://gpuix.dev/) – 在 [Zed](https://zed.dev/) 所用的框架之上，用 React 和 TypeScript 构建原生 GPU 加速桌面应用。
- [memlab 2.0.5](https://facebook.github.io/memlab/) – Meta 用于发现浏览器和 Node.js JavaScript 应用中内存泄漏的框架。
- 🎵 [Astro LilyPond](https://lilypond.ky.fyi/) – 为 Astro 提供在构建时将文本渲染为乐谱的功能。
- 📊 [vue-echarts 8.3](https://vue-echarts.dev/) – Apache ECharts 的 Vue.js 组件。

## 📢 生态系统其他动态

![r4xavp1sxq6ebnecqxkd](@@CDN@@/assets/img/web/JavaScriptWeekly44/img-05.webp)

- ✨ GitHub 推出了[一项隐私安全的 star 历史 API](https://github.blog/changelog/2026-09-04-new-api-endpoint-provides-privacy-safe-star-history-data/)，因此绘制仓库随时间增长的趋势图不再需要抓取数据或进行估算。[Star-History](https://www.star-history.com/) 分享了[更多背景](https://www.star-history.com/blog/new-github-star-history-api)，你可以用它绘制项目的 star 数，如上图（[示例](https://www.star-history.com/?repos=solidjs%2Fsolid&type=date&legend=top-left)）。
- Robin Wieruch 认为，由于智能体编程的出现，[从基础原语而非高层库开始构建](https://www.robinwieruch.de/agentic-coding-bet-on-primitives/)更有意义，并以 D3 与 Recharts 为例。
- Declan Chidlow 称，[你不需要在 viewport meta 标签中使用 `initial-scale=1.0`](https://vale.rocks/micros/20260902-1350)，它只是为了绕过旧版 iOS 的怪异行为。
- 遇到浏览器兼容性痛点？[把它提交为 Interop 2027 的想法](https://webkit.org/blog/18283/submit-your-ideas-for-interop-2027/)（截止 9 月 23 日）。
- 👕 今天才知道可以[购买官方 Vue.js 周边](https://commitgoods.com/collections/vue-js)！

*原文链接：[JavaScript Weekly Issue 801](https://javascriptweekly.com/issues/801)*
