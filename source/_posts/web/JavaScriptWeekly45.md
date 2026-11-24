---
title: JavaScript周刊-45
date: 2018-04-02 23:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 802: 2026年9月15日

*与 Master.dev 联合推出*

![yasnr77llfxhnd7g3ffz](@@CDN@@/assets/img/web/JavaScriptWeekly45/img-01.webp)

## [函数式编程术语：可视化图谱与解释](https://hemanth.github.io/functional-programming-jargon/)

柯里化、纯粹性、函子、单子……？如果 FP 术语曾让你一头雾水，TC39 代表 Hemanth HM [广受欢迎的术语参考](https://github.com/hemanth/functional-programming-jargon)现已变成一张可探索的概念地图，展示这些概念之间的关系，每个概念都配有简单定义和 JavaScript 示例。

*Hemanth HM*

<div style="float:right"><img  src="@@CDN@@/assets/img/web/JavaScriptWeekly45/img-02.webp" width="140" height="140" alt="Master.dev" style="padding-top: 12px; padding-left: 12px;"></div>

## [在 AI 时代保持敏锐](https://master.dev/sale/?utm_source=javascriptweekly&utm_medium=newsletter&utm_campaign=buildersale)

Master.dev 的讲师在 Anthropic、OpenAI、Netflix、Google 和 Stripe 工作。通过数百门课程、实时工作坊和扩展后的 AI 学习路径向他们学习。[新会员可享受年度会员立减 100 美元](https://master.dev/sale/?utm_source=javascriptweekly&utm_medium=newsletter&utm_campaign=buildersale)。

*Master.dev 赞助*

## [现代 Web 类型：为更新的 Web API 提供 TypeScript 支持](https://philipwalton.com/articles/modern-web-types/)

TypeScript 的 DOM 类型只包含已在多个浏览器引擎中发布的 API，因此像元素级 `startViewTransition` 和 `fetchLater` 这样的东西会报错。[modern-web-types](https://github.com/philipwalton/modern-web-types) 是一个可直接替换 `lib.dom` 的库，补充了在任一浏览器引擎中已发布的缺失接口和成员。

*Philip Walton (Google)*

## [React 19.3 发布](https://react.dev/blog/2026/09/09/react-19-3)

一次重要的次要版本发布，让视图过渡和 Fragment Refs 稳定，新增 Trusted Types 支持，等等。我们在[上周的 *React Status*](https://react.statuscode.com/issues/490) 中做了更深入的报道。

*React 团队*

### 简讯

- 🔒 攻击者正在[扫描暴露的 Vite 开发服务器](https://www.f5.com/labs/articles/cloud-takeover-mass-scanning-for-exposed-vite-endpoints-cve-2026-39364)，利用 `server.fs.deny` 绕过漏洞（今年早些时候已在 Vite 7.3.2 和 8.0.5 中修复），从 `.env` 文件中窃取凭证。Vite 默认监听 localhost，但请再次检查你的配置。
- [Safari 27](https://developer.apple.com/documentation/safari-release-notes/safari-27-release-notes) 昨天发布（同时还有 macOS/iOS 27），带来了[我们上周报道过的](https://webkit.org/blog/18227/fixing-top-level-await-in-safari/)模块加载器重写，因此顶层 `await` 现在能在所有主流浏览器中可靠工作。
- TC39 两周后将在东京召开会议。[这是议程](https://github.com/tc39/agendas/blob/main/2026/09.md)：三个迭代器辅助方法的后续提案（[join](https://github.com/tc39/proposal-iterator-join)、[includes](https://github.com/tc39/proposal-iterator-includes) 和 [chunking](https://github.com/tc39/proposal-iterator-chunking)）都将争取进入 Stage 4，此外还有更多内容。
- 🔒 从本周四开始，[OpenJS 基金会的 CVE 团队将休息一段时间](https://openjsf.org/blog/the-openjs-foundation-cna-is-taking-a-coordinated-break)，直到 10 月 6 日，原因是 AI 生成报告激增导致的倦怠。正在被积极利用的问题仍会得到响应。
- 🔒 [npm 现在会在任何账户通过恢复代码成功登录后](https://github.blog/changelog/2026-09-09-npm-extends-recovery-code-security-holds-to-all-accounts/)，对其施加为期 72 小时的临时“安全冻结”。

### 版本发布

- [pnpm 12.4](https://pnpm.io/blog/releases/12.4) – 这个包管理器现在可以在同一个 workspace 中，与 npm 包一起管理 Rust crate 和 Python 包。
- [Playwright 1.63](https://github.com/microsoft/playwright/releases/tag/v1.63.0) – 测试现在可以声明一个具名 `lock`，这样共享同一资源的测试就永远不会并发运行。
- [Node.js v26.8.2（Current）](https://nodejs.org/en/blog/release/v26.8.2) 和 [v24.21.0（LTS）](https://nodejs.org/en/blog/release/v24.21.0) – 两者都包含 Undici 的安全版本，修复了多个漏洞。
- [React Router 8.4](https://reactrouter.com/changelog#v840)、[Vite 8.3](https://github.com/vitejs/vite/releases/tag/v8.3.0)、[Moment.js 2.31.0](https://github.com/moment/moment/releases/tag/v2.31.0)（安全版本）。

## 📖 文章和视频

### [探索 `async`/`await` 的设计空间](https://cel.cs.brown.edu/blog/design-space-async-await/)

一个简单的 `async`/`await` 示例在 JavaScript、Rust、Python 和 Swift 中会产生不同结果。通过一个小测验检验你的心智模型，然后了解这些差异背后的设计选择。

*Gavin Gray*

---

### [原生开发现在是 Shopify 移动端的未来](https://shopify.engineering/back-to-native)

Shopify 正在用 Swift/Kotlin 重写其 React Native 移动应用。主要论点是编码智能体降低了把所有东西写两遍的成本，而原生开发的优势依然存在。

*Mustafa Ali (Shopify)*

---

### [工作坊：从一条错误到能解释它的日志](https://sentry.io/resources/beyond-logs-basics-workshop/?utm_source=javascriptweekly&utm_medium=paid-community&utm_campaign=logs-fy27q3-logsworkshop&utm_content=newsletter-sponsored-link-beyond-basics-register)

将日志与 trace 和错误放在一起阅读，跨服务保持上下文，并减少噪音。

*Sentry 赞助*

---

### [深入剖析 StyleX](https://flaviocopes.com/stylex/)

一次动手实践之旅，介绍 Meta 的 [StyleX](https://stylexjs.com/)——它在构建时将 JavaScript 样式对象转换为纯原子 CSS，以及为什么它尤其适合编码智能体。

*Flavio Copes*

---

### 📄 [“没人愿意为开源付费：我们可以迫使他们付费”](https://seldo.com/posts/nobody-pays-for-open-source-we-can-force-them-to/)

Laurie Voss 运营了 npm 五年，他认为注册中心是资助维护者的一个尚未开发的杠杆。

*Laurie Voss*

---

### 📄 [据观察，程序员不喜欢 `reduce`](https://evanhahn.com/posts/2026-09-13-programmers-dislike-reduce/)

`map` 和 `filter` 能顺利通过代码审查，但 `reduce` 却招来抱怨。Evan 对此有几个理论。

*Evan Hahn*

## 🛠 代码与工具

### [SnapDOM 3.0：将 DOM 元素转换为图像、Canvas 等](https://snapdom.dev/)

零依赖的 [html2canvas](https://github.com/niklasvh/html2canvas) 替代品，支持伪元素和 Shadow DOM。[v3.0](https://github.com/zumerlab/snapdom/releases/tag/v3.0.0) 新增“增量重捕获”以加快重复截图，自动嵌入 Web 字体，以及用于将原始 HTML 标记转换为图像的 `fromString()`。

*Zumerlab*

---

### [你的应用没有变慢，是你的数据变大了](https://www.tigerdata.com/go/trial?utm_source=content-syndication&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

TimescaleDB 扩展 Postgres，让查询在规模增长时依然快速，即使数据不断增长。[开始使用即获 1000 美元额度](https://www.tigerdata.com/go/trial?utm_source=content-syndication&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)。

*Tiger Data（TimescaleDB 的创造者）赞助*

---

### [Fallow：面向 TypeScript 和 JavaScript 的代码库智能分析](https://docs.fallow.tools/)

一个快速、零配置的 Rust 二进制文件，用于发现 JS/TS 项目中的死代码、重复代码、循环依赖和复杂度热点。它也被定位为 AI 智能体编码循环的确定性检查。[GitHub 仓库](https://github.com/fallow-rs/fallow)。

*Bart Waardenburg*

---

### 🎨 [category-colors：为图表生成“错得最少”的调色板](https://mattstromawn.com/writing/the-least-wrong-colors-version-2/)

Matt 在 2022 年担任 Stripe 设计总监时设计了[这套挑选分类图表颜色的算法](https://mattstromawn.com/writing/how-to-pick-the-least-wrong-colors/)。它现在已作为 [npm 包](https://github.com/ilikescience/category-colors)提供，你也可以[在网页上试用](https://categorycolors.com/)。

*Matt Ström-Awn*

---

### 版本发布

- [React DevTools 8.0](https://github.com/react/react/blob/main/packages/react-devtools/CHANGELOG.md#800)（[Chrome 应用商店](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)）– Suspense 标签页现在默认开启，Timeline 性能分析器已被移除（请改用浏览器的 *Performance* 面板），检查 DOM 节点时现在会显示其匹配的 React 组件。
- [Zod 4.6](https://zod.dev/blog/zod-4-6) – 新增 `.validate()`，这是一种布尔检查，会跳过构建错误对象；在输入无效并使用编译后的 schema 时，比 `.safeParse().success` 快最多 35 倍。
- [Javet 6.0](https://www.caoccao.com/Javet/) – 将 Node.js v26 的运行时嵌入 JVM，实现与 Java 的完全互操作。
- [parse-xml 5.0](https://rgrove.github.io/parse-xml/) – 这个快速、合规的 XML 解析器[现在仅支持 ESM](https://github.com/rgrove/parse-xml/releases/tag/v5.0.0)。
- 🕹️ [n64js 1.0](https://github.com/hulkholden/n64js) – 一个纯 JavaScript 编写的 Nintendo 64 模拟器。

## 📢 生态系统其他动态

![wwfey07te8tmpqvviapc](@@CDN@@/assets/img/web/JavaScriptWeekly45/img-03.webp)

- 🕹️ 今年 [js13kGames](https://js13kgames.com/2026/) 的参赛作品已经提交，创纪录地有 [317 款游戏，每款压缩到 13KB 以内](https://js13kgames.com/2026/blog/voting-open)。Frank Force 的赛车游戏 [SP13KTRA](https://js13kgames.com/2026/games/sp13ktra) 和 roguelike 游戏 [Hornbound](https://js13kgames.com/2026/games/hornbound) 是不错的入门选择，你也可以翻看每个项目的公开仓库。
- Chris Coyier 汇总了[值得了解的新兴 HTML 特性](https://blog.master.dev/new-things-you-should-know-about-html-here-in-mid-2026/)，比如 `<geolocation>` 和 `<install>` 元素，以及 HTML-in-Canvas 和对 `<select>` 自定义的改进。
- 第一届 [Three.js 大会](https://threejs.paris/)上周在巴黎举行，Codrops 有[两天的实时博客报道](https://tympanus.net/codrops/2026/09/10/inside-the-first-three-js-conference-in-paris/)，包括 Mr.doob 的演讲。目前还没有录像。
- Tailwind Labs（Tailwind CSS 背后的团队）[将加入 Shopify](https://tailwindcss.com/blog/tailwind-is-joining-shopify)。Tailwind CSS 将继续维护并保持开源——松了口气！😅

*原文链接：[JavaScript Weekly Issue 802](https://javascriptweekly.com/issues/802)*
