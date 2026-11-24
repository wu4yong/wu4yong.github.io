---
title: JavaScript周刊-18
date: 2018-03-22 03:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 775: 2026年3月3日

## [Bun v1.3.10 发布：一个出人意料的大更新](https://bun.com/blog/bun-v1.3.10)

![bun](@@CDN@@/assets/img/web/JavaScriptWeekly18/img-01.webp)

Bun 的 REPL 已完全重写，带来了许多改进（实用和外观兼具），新增了 `--compile --target=browser` 选项，用于构建包含所有 JS、CSS 和资源的自包含 HTML 文件（非常适合简单的 JS 驱动单页应用），完整支持 TC39 阶段 3 的 [ES 装饰器](https://github.com/tc39/proposal-decorators)，更快的事件循环，barrel import 优化等等。

*Jarred Sumner*

---

<div style="float:right; margin-left:16px; margin-bottom:8px;">
  <img  src="@@CDN@@/assets/img/web/JavaScriptWeekly18/img-02.webp" width="110">
</div>

## [还在手动编写测试？Meticulous AI 来了](https://www.meticulous.ai?utm_source=jsweekly&utm_medium=newsletter&utm_campaign=26q1&utm_content=primary)

Notion、Dropbox、Wiz 和 LaunchDarkly 现在使用着一种他们离不开的测试范式。Meticulous 由前 Palantir 工程师构建，能够自动创建持续演进的 E2E UI 测试套件，以零开发者投入提供详尽覆盖率。

*Meticulous 赞助*

## [外部 Import Map，就在今天！](https://lea.verou.me/blog/2026/external-import-maps-today/)

几周前，Lea 发表了一篇关于 [Web 依赖管理存在问题的文章](https://lea.verou.me/blog/2026/web-deps/)，现在她有了解决方案。用于模拟外部 import map 支持的核心技术虽然简单但不太显而易见，不过已经[由 JSPM 4.0 提供支持。](https://jspm.org/jspm-4.0-release#import-map-package-management)

*Lea Verou*

## 简讯

- [*React 基金会*已正式成立](https://react.dev/blog/2026/02/24/the-react-foundation)，接管了 React、React Native 和 JSX 的所有权。基金会设有八位创始成员组成的董事会（包括 Meta），由 Meta 前 React 负责人 Seth Webster 担任执行董事。

- 虽然尚未正式确定，但[这篇预览文章揭示了 Node.js 发布计划将如何在今年晚些时候进行调整](https://nodejs-org-git-fork-ulisesgascon-release-announcement-openjs.vercel.app/en/blog/announcements/evolving-the-nodejs-release-schedule)（每年一个主要版本，每个版本都是 LTS，不再区分奇偶版本号）。

- 📢 [Svelte](https://svelte.dev/blog/whats-new-in-svelte-march-2026)、[ViteLand / VoidZero](https://voidzero.dev/posts/whats-new-feb-2026) 和 [Astro](https://astro.build/blog/whats-new-february-2026/) 的月度回顾已发布。

- 🔒 Angular 团队[解释了 Angular 中最近修复的两个漏洞。](https://blog.angular.dev/security-advisory-addressing-recent-vulnerabilities-in-angular-c2656249b799)

- [Navigation API 现已在所有主流浏览器中达到 Baseline Newly Available 状态。](https://web.dev/blog/baseline-navigation-api?hl=en)

## 版本发布

- [Deno 2.7](https://deno.com/blog/v2.7) – 这个替代运行时稳定了 Temporal API 支持，支持 Windows on ARM，添加了 `package.json` `overrides` 支持等。

- [Expo SDK 55](https://expo.dev/changelog/sdk-55) – 流行的 React Native 框架/工具链。

- [Shiki 4.0](https://shiki.style/) – 基于 TextMate 语法驱动的、类似 VS Code 的语法高亮器。

- [Angular 21.2](https://github.com/angular/angular/releases/tag/v21.2.0)、[Mediabunny 1.35](https://github.com/Vanilagy/mediabunny/releases/tag/v1.35.0)、[Neo.mjs 12.0](https://github.com/neomjs/neo/releases/tag/12.0.0)

## 📖 文章和视频

### [让 WebAssembly 成为 Web 的一等公民](https://hacks.mozilla.org/2026/02/making-webassembly-a-first-class-language-on-the-web/)

WASM 已经走过了很长的路，但在 Web 上使用仍然很棘手，即使是执行 `console.log` 也需要大量的胶水代码。Ryan 论证了 [WebAssembly 组件模型](https://component-model.bytecodealliance.org/)可以通过让模块直接绑定到浏览器 API、直接从 `script` 标签加载等方式改变这一现状。

*Ryan Hunt*

---

### [我们值得拥有更好的 JavaScript Streams API](https://blog.cloudflare.com/a-better-web-streams-api/)

*"我发布这篇文章是为了开启一场对话，"* James 说道，他展示了一种替代 Web Streams 的方法，解决了当前标准的*"根本性可用性和性能问题"*。最终的效果和 James 在该领域的丰富经验构成了一个令人信服的论点。

*James M Snell*

---

### [`npx workos:` 一个直接为你的代码库编写身份验证的 AI 智能体](https://workos.com/docs/authkit/cli-installer?utm_source=cpjavascript&utm_medium=newsletter&utm_campaign=q12026)

读取你的项目，检测你的框架，编写集成代码，然后类型检查并修复自己的构建错误。

*WorkOS 赞助*

---

### [JavaScript 驱动的"DRM"的幻觉](https://www.therantydev.com/javascript-drms-are-stupid)

解释了为什么纯粹用 JavaScript 构建 DRM/版权保护系统（而不是基于 [EME](https://en.wikipedia.org/wiki/Encrypted_Media_Extensions) 的方案）最终充其量只是*"复杂的摩擦手段"*，并讲述了一个破解某（NSFW）平台保护机制的故事来佐证。

*Ahmed Arat*

---

### [Cloudflare 如何在一周内用 AI 重建 Next.js](https://blog.cloudflare.com/vinext/)

[vinext](https://github.com/cloudflare/vinext) 是一个实验性的、基于 Vite 的 Next.js API 接口重实现，让现有应用可以在更多环境中运行，不过存在[一些权衡。](https://github.com/cloudflare/vinext#whats-not-supported-and-wont-be)

*Steve Faulkner (Cloudflare)*

---

### [使用 Val Town 帮我去看电影](https://www.raymondcamden.com/2026/03/01/using-val-town-to-get-me-to-the-movies)

[Val Town](https://www.val.town/) 是一个用于快速编写和部署 JavaScript 驱动服务的绝佳平台。就像这一个！

*Raymond Camden*

---

### 更多文章

- 📄 [Sticky Grid Scroll: 构建滚动驱动的动画网格](https://tympanus.net/codrops/2026/03/02/sticky-grid-scroll-building-a-scroll-driven-animated-grid/) – 虽然不是每个人都喜欢滚动驱动的效果，但[这个确实看起来很精巧。](https://tympanus.net/Tutorials/StickyGridScroll/) *Theo Plawinski*

- 📄 [从 `instanceof` 到 `Error.isError`：更安全的 JavaScript 错误检查](https://allthingssmitty.com/2026/02/23/from-instanceof-to-error-iserror-safer-error-checking-in-javascript/) *Matt Smith*

- 📄 [在服务端 JavaScript 中代理 Fetch 请求](https://humanwhocodes.com/blog/2026/03/proxying-fetch-requests-server-side-javascript/) *Nicholas C. Zakas*

- ▶️ [为什么我选择 Electron 而非原生（而且我还会再这么做）](https://syntax.fm/show/983/why-i-chose-electron-over-native-and-i-d-do-it-again) *Syntax 播客*

- 📄 [使用 React Native 创建 Meta Quest VR 应用](https://reactnative.dev/blog/2026/02/24/react-native-comes-to-meta-quest) *Chludziński、Jaworski 和 Leyendecker*

## 🛠 代码与工具

### [txiki.js: 一个小巧而强大的 JavaScript 运行时](https://txikijs.org/)

站在 QuickJS-ng 和 libuv 的肩膀上，旨在支持最新的 ECMAScript 特性，同时保持 [WinterTC](https://wintertc.org/) 兼容。[GitHub 仓库。](https://github.com/saghul/txiki.js)

*Saúl Ibarra Corretgé*

---

### [numpy-ts: TypeScript 版 NumPy 实现](https://numpyts.dev/)

[NumPy](https://numpy.org/) 是 Python 科学计算生态系统的基石，而这个实现在浏览器、Node、Bun 和 Deno 中都能工作。目前已覆盖 94% 的 NumPy API，还有[在线 Playground](https://numpyts.dev/v1.0.x/playground) 可以试用。

*Nicolas Dupont*

---

### [发布实时功能，无需实时复杂性](https://www.tigerdata.com/timescaledb?utm_source=cooperpress&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

TimescaleDB 扩展了 Postgres：超表、95% 压缩率、连续聚合。在实时数据上运行分析。[免费试用。](https://www.tigerdata.com/timescaledb?utm_source=cooperpress&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

*Tiger Data (TimescaleDB 的创建者) 赞助*

---

### [Yoopta Editor 6.0: React 的无头富文本编辑器](https://yoopta.dev/)

MIT 许可的库，用于创建基于块的、Notion 风格的富文本编辑体验。核心是无头的，但附带各种 UI 组件以便快速上手。[Playground](https://yoopta.dev/playground) 提供了在线示例。

*Akhmed Ibragimov*

---

### [AdonisJS v7 发布："全家桶"式 Node.js 框架](https://adonisjs.com/blog/v7)

一个流行的框架，包含身份验证、ORM、队列、测试等功能。v7 带来了[全新的网站](https://adonisjs.com/)、OpenTelemetry 集成、新的入门套件以快速构建应用等。

*Harminder Virk*

---

### 🎨 [Color Thief 3.0: 从图片中提取调色板](https://lokeshdhakar.com/projects/color-thief/)

给定一张图片，使用 `canvas` 返回主要颜色列表。可在浏览器或 Node 中使用。现已支持 OKLCH、Web Worker 卸载、针对视频/canvas/图片元素的"实时提取"等。[GitHub 仓库。](https://github.com/lokesh/color-thief)

*Lokesh Dhakar*

---

### 📊 [ng2-charts: 基于 Chart.js 的 Angular 图表库](https://valor-software.com/ng2-charts/)

现已支持 Angular 20。

*Valor Labs*

---

### [vue-superselect: Vue 3 的无头选择器/组合框](https://github.com/nemanjamalesija/vue-superselect)

*Nemanja Malesija*

---

### 更多工具

- 📄 [React PDF 10.4](https://projects.wojtekmaj.pl/react-pdf/) – 在 React 应用中显示 PDF。[v10.4](https://github.com/wojtekmaj/react-pdf/releases/tag/v10.4.0) 新增了覆盖渲染颜色的能力。

- 🕹️ [JSNES 2.0](https://github.com/bfirsh/jsnes/releases/tag/v2.0.0) – JavaScript NES 模拟器，支持浏览器和 Node。（[演示。](https://jsnes.org/)）

- [Milkdown 7.19](https://github.com/Milkdown/milkdown) – 插件驱动的 WYSIWYG Markdown 编辑器框架。

- [Peggy 5.1](https://github.com/peggyjs/peggy) – 简单的解析器生成器。

## 📢 生态系统其他动态

### 🎉 [npmx.dev Alpha 发布引发社区热潮](https://npmx.dev/blog/alpha-release)

![npmx](@@CDN@@/assets/img/web/JavaScriptWeekly18/img-03.webp)

三周前我们介绍了 [npmx.dev](https://npmx.dev/)，一个用于浏览和搜索官方 npm 仓库的快速新方式。本周事情变得更加正式，发布了[关于网站 alpha 版本的完整公告文章](https://npmx.dev/blog/alpha-release)，社区也涌现了[大量](https://piccalil.li/blog/finding-an-accessibility-first-culture-in-npmx/)[热情洋溢](https://johnnyreilly.com/npmx-with-a-little-help-from-my-friends)的[博客](https://voidzero.dev/posts/npmx-alpha)[文章](https://roe.dev/blog/virtuous-circle)[为之庆祝。](https://patak.cat/npmx/converging-communities.html) 我已经记不得上一次有哪个 JavaScript 项目同时吸引如此多博客文章是什么时候了。

---

### 🌐 [Locutus: 15 种语言的 TypeScript 标准库移植](https://locutus.io/)

[Locutus](https://locutus.io/) 是一个有趣的项目，提供了来自 15 种其他编程语言（如 PHP、Go、Python、Ruby）的标准库 TypeScript 移植版。

---

### 📊 [State of React Native 2025 调查结果](https://results.stateofreactnative.com/en-US/)

[Software Mansion 和 Devographics 发布了 *State of React Native 2025* 调查结果。](https://results.stateofreactnative.com/en-US/)

---

### 📝 [TypeScript 5.x 到 6.0 迁移详细笔记](https://gist.github.com/privatenumber/3d2e80da28f84ee30b77d53e1693378f)

[这份详细的迁移笔记](https://gist.github.com/privatenumber/3d2e80da28f84ee30b77d53e1693378f) 作者建议可以将其提供给 AI 智能体使用。

---

### 🎨 [关于单人依赖的交互式 xkcd 漫画](https://editor.p5js.org/isohedral/full/vJa5RiZWs)

使用 [p5.js](https://p5js.org/) 制作的[那幅著名 xkcd 漫画](https://xkcd.com/2347/)的[交互式版本](https://editor.p5js.org/isohedral/full/vJa5RiZWs)，关于现代软件中的单人依赖问题。

---

### 🤝 [Drizzle ORM 团队加入 PlanetScale](https://planetscale.com/blog/drizzle-joins-planetscale)

[Drizzle ORM](https://orm.drizzle.team/) 团队[已加入 PlanetScale。](https://planetscale.com/blog/drizzle-joins-planetscale)

---

### 📋 [一份有趣的小型编程语言列表](https://taylor.town/scrapscript-000)

---

*原文链接：[JavaScript Weekly Issue 775](https://javascriptweekly.com/issues/775)*
