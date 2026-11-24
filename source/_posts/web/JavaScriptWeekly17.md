---
title: JavaScript周刊-17
date: 2018-03-22 01:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 774: 2026年2月24日

## [Oxfmt Beta: 基于 Rust 的极速 JavaScript 代码格式化工具](https://oxc.rs/blog/2026-02-24-oxfmt-beta)

![oxfmt](@@CDN@@/assets/img/web/JavaScriptWeekly17/img-01.webp)

一个**100% 兼容 [Prettier](https://prettier.io/)** 的 JavaScript 代码格式化工具（也是 [Oxlint](https://oxc.rs/blog/2025-06-10-oxlint-stable.html) 的姊妹项目），号称比 Prettier 快 30 倍，比 [Biome](https://biomejs.dev/) 快 3 倍。自 alpha 版本以来，现已支持嵌入式语言格式化（JSX、YAML、HTML 等）、Tailwind CSS [类名排序](https://oxc.rs/docs/guide/usage/formatter/sorting.html#sort-tailwind-css-classes)、[import 排序](https://oxc.rs/docs/guide/usage/formatter/sorting.html#sort-imports)等功能。

*Boshen、Dunqing 和 Sugiura (VoidZero)*

---

<div style="float:right; margin-left:16px; margin-bottom:8px;">
  <img  src="@@CDN@@/assets/img/web/JavaScriptWeekly17/img-02.webp" width="148">
</div>

## [Wijmo 出品的 FlexGrid: 业界领先的 JavaScript 数据表格](https://developer.mescius.com/wijmo/flexgrid-javascript-data-grid?utm_source=CooperPress&utm_medium=JavaScript-Weekly&utm_campaign=Wijmo-JS-Weekly-Primary-Sponsor-Feb-2026)

一个用于构建现代 Web 应用的快速灵活的 DataGrid。核心网格模块包含关键功能和虚拟化渲染。可按需选择特殊功能以保持应用体积小巧。为 JavaScript 构建，并可扩展至 Angular、React 和 Vue。

*Wijmo From MESCIUS 赞助*

## 简讯

- Martin Kleppe（以 [tixy.land](https://tixy.land/) 等创意实验而闻名）用仅 666 个字符的 HTML 和 JavaScript 创建了一个[滚动位图 quine](https://aem1k.com/bitquine/)。[这里有带注释的源码](https://github.com/aemkei/aemkei.github.io/blob/master/bitquine/annotated.html)，可以一探究竟。

- 在 Oracle 与 Deno 的 JavaScript 商标案中，Oracle 已[请求将诉讼程序延长两个月](https://ttabvue.uspto.gov/ttabvue/v?pno=92086835&pty=CAN&eno=22)，[Deno 已同意。](https://x.com/rough__sea/status/2026054678669414832)

- Patrick Brosset 指出，随着上个月 Firefox 147 的发布，[你现在可以在所有主流浏览器中](https://bsky.app/profile/patrickbrosset.com/post/3mfloileyvs27)于 Service Worker 中使用 JS 模块了。

- 一个巧妙的技术技巧：[使用浏览器的 `canvas` 元素从 JavaScript 压缩文本数据。](https://jstrieb.github.io/posts/canvas-compress/)

## 版本发布

- [Vuetify 4.0](https://v4.vuetifyjs.com/en/) – 用于构建响应式 UI 的 Vue 框架。（[升级文档。](https://vuetifyjs.com/en/getting-started/upgrade-guide/#quick-start-with-vuetify-mcp)）

- [npm v11.10.0](https://github.blog/changelog/2026-02-18-npm-bulk-trusted-publishing-config-and-script-security-now-generally-available/) – 维护者现在可以跨多个包同时添加/更新可信发布配置。还新增了 `--min-release-age` 选项。

- [Node.js v25.7.0 (Current)](https://nodejs.org/en/blog/release/v25.7.0) 和 [v24.14.0 (LTS)](https://nodejs.org/en/blog/release/v24.14.0)

- [ESLint 10.0.2](https://eslint.org/blog/2026/02/eslint-v10.0.2-released/)、[Hono 4.12](https://github.com/honojs/hono/releases/tag/v4.12.0)、[Deno 2.6.10](https://github.com/denoland/deno/releases/tag/v2.6.10)、[Electron 40.6](https://github.com/electron/electron/releases/tag/v40.6.0)、[Three.js r183](https://github.com/mrdoob/three.js/releases/tag/r183)

## 📖 文章和视频

### [面向人类和 AI 的最快前端工具链](https://cpojer.net/posts/fastest-frontend-tooling)

![fastest-tooling](@@CDN@@/assets/img/web/JavaScriptWeekly17/img-03.webp)

Christoph（Jest 的知名作者）介绍了他的首选工具，让你的 JavaScript 工具栈以最快速度运行。这篇文章也面向 LLM，可通过[此 Markdown 版本](https://cpojer.net/posts/fastest-frontend-tooling.md)进行处理。

*Christoph Nakazawa*

---

### [告别 `innerHTML`，迎接 `setHTML`：更强的 XSS 防护](https://hacks.mozilla.org/2026/02/goodbye-innerhtml-hello-sethtml-stronger-xss-protection-in-firefox-148/)

从 v148 开始，Firefox [支持](https://caniuse.com/mdn-api_sanitizer) [Sanitizer API](https://wicg.github.io/sanitizer-api/)。与其通过 `innerHTML` 将 HTML 赋值给 DOM 节点，不如使用 [`setHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML) 以获得默认的安全性。这是一项前沿特性，Chrome 146（beta）也已添加支持，但 Safari 尚未跟进，因此 [DOMPurify](https://github.com/cure53/DOMPurify) 在一段时间内仍将有用。

*Mozilla Hacks*

---

### [Clerk 免费层现已覆盖 50,000 MRU](https://go.clerk.com/pmEwWZh)

从 10K 提升至 50K。Pro 版包含 MFA。所有计划均支持无限应用，不再需要按应用升级。

*Clerk 赞助*

---

### [通过指针压缩将 Node.js 内存使用减半](https://blog.platformatic.dev/we-cut-nodejs-memory-in-half)

Cloudflare、Igalia 和 Node 项目合作开发了 `node-caged`，一个启用了 V8 指针压缩的 Node.js 25 Docker 镜像，可节省高达 50% 的内存。Matteo 深入探讨了所有细节。

*Matteo Collina*

---

### 更多文章

- 📺 [我的 2026 Angular 技术栈](https://www.youtube.com/watch?v=tT5xMfHb4Gg) – 如果现在启动一个新的 Angular 项目，作者会选择哪些工具的见解。 *Rainer Hahnekamp*

- 📄 [如何从 GitHub Actions 发布到 npm](https://glebbahmutov.com/blog/npm-publish-from-github/) – 使用新的 npm OIDC 可信发布工作流。 *Gleb Bahmutov*

- 📄 [使用 Three.js 和 WebGL 构建无尽程序化贪吃蛇](https://tympanus.net/codrops/2026/02/10/building-an-endless-procedural-snake-with-three-js-and-webgl/) *Sujen Phea*

## 🛠 代码与工具

### [OpenSeadragon 6.0: 高分辨率图像 Web 查看器](http://openseadragon.github.io/)

![openseadragon](@@CDN@@/assets/img/web/JavaScriptWeekly17/img-04.webp)

这是一个将近 15 年历史的项目的重大进步，也是为数不多的稳定可靠的选择之一，用于渲染超高分辨率图像，供用户缩放和平移浏览。[版本 6](https://github.com/openseadragon/openseadragon/releases/tag/v6.0.0) 引入了新的异步和缓存管理管道，在大规模场景下效率*大幅*提升。

*OpenSeadragon 贡献者*

💡 OpenSeadragon 最近被用作 [Isometric NYC](https://cannoneyed.com/projects/isometric-nyc)（本身就非常值得一读！）项目的基础。

---

### [SurveyJS: 用于动态 Web 表单的 JavaScript 库](https://surveyjs.io/?utm_source=jsweekly&utm_medium=email&utm_campaign=feb2)

在应用中（React/Angular/Vue）构建 JSON 驱动的表单，不受 SaaS 限制。完全拥有你的数据。

*SurveyJS 赞助*

---

### [bignumber.js 10.0: 任意精度算术库](https://mikemcl.github.io/bignumber.js/)

解决了 JavaScript `Number` 和 `BigInt` 类型的局限性，例如需要处理非常大的非整数时。方便的是，该库在页面上直接提供，你可以在 JS 控制台中试用。

*Michael Mclaughlin*

---

### ⏳ [Slowmo: 减慢、暂停或加速时间](https://slowmo.dev/)

一个既可作为库也可作为浏览器扩展使用的工具，用于在浏览器中减慢时间以进行调试和测试。它可以减慢[多种事物](https://github.com/seflless/slowmo?tab=readme-ov-file#what-it-works-with)，包括 CSS 动画、过渡效果和 `requestAnimationFrame`。

*Francois Laberge*

---

### [React Doctor: 给你的 React 代码做个快速体检](https://www.react.doctor/)

来自 [React Scan](https://react-scan.com/) 和 [React Grab](https://www.react-grab.com/) 创建者的最新工具，扫描你的代码库并给出 0-100 的评分。（[GitHub 仓库。](https://github.com/millionco/react-doctor)）

*Aiden Bai*

💡 [Angular Doctor](https://github.com/antonygiomarxdev/angular-doctor) 是一个受 *React Doctor* 启发的 Angular 应用类似项目。

---

### [Vue Scrollama 3.0: 用于滚动驱动交互的 Vue 组件](https://vue-scrollama.pages.dev/)

[Scrollama](https://pudding.cool/process/introducing-scrollama/) 是一个用于实现所谓"滚动叙事"的库，其中滚动位置会影响视口中某些元素的存在状态。这个项目使其更易于在 Vue 中使用。

*Vignesh Shenoy*

---

### 更多工具

- [Beautiful Mermaid 1.0](https://github.com/lukilabs/beautiful-mermaid#readme) – 从 JavaScript 将 Mermaid 图表标记渲染为 SVG 或 ASCII/Unicode 输出。

- 📊 [Plotly.js 3.4](https://github.com/plotly/plotly.js/releases/tag/v3.4.0) – 独立的数据可视化库，涵盖图表、图形、地图等。[示例。](https://plotly.com/javascript/)

- [pnpm v10.30.0](https://github.com/pnpm/pnpm/releases/tag/v10.30.0) – [`pnpm why`](https://pnpm.io/cli/why) 现在显示*反向*依赖树。

- 📄 [DOCX 9.6.0](https://docx.js.org/) – 从 JavaScript 生成/修改 `.docx` 文件。

## 📢 生态系统其他动态

### 🖥️ [在浏览器中体验 Windows 3.11 环境](https://pieter.com/)

![windows311](@@CDN@@/assets/img/web/JavaScriptWeekly17/img-05.webp)

在浏览器中玩转完整的 Windows 3.11 环境非常有趣！有 90 年代搜索引擎 *Altavista* 的再现，有连接到真实 IRC 服务器的 mIRC 版本，还有各种经典游戏。

---

### 📁 [Git 的"魔法"文件](https://nesbitt.io/2026/02/05/git-magic-files.html)

Andrew Nesbitt 分享了[关于 Git"魔法"文件的一些有用指引](https://nesbitt.io/2026/02/05/git-magic-files.html)，包括 `.gitignore`、`.gitmessage` 以及其他影响 Git 行为的文件。

---

### 🎨 [用 CSS 实现的 x86 CPU 模拟器](https://lyra.horse/x86css/)

曾经用 JavaScript 模拟 CPU 和游戏机是很酷的事情。但现在[有人用 CSS 做了一个 x86 CPU 模拟器！](https://lyra.horse/x86css/)

---

### 🔮 [Hologram: 将 Elixir 编译为 JavaScript 的 Web 框架](https://hologram.page/)

[Hologram](https://hologram.page/) 是一个有趣的 Elixir 语言 Web 框架，它将 Elixir 前端代码编译为 JavaScript，并[取得了惊人的成功。](https://hologram.page/blog/porting-initiative-delivers-hologram-v0-7-0)

---

### 🎨 [Tailwind CSS v4.2 发布](https://github.com/tailwindlabs/tailwindcss/releases/tag/v4.2.0)

[Tailwind CSS v4.2](https://github.com/tailwindlabs/tailwindcss/releases/tag/v4.2.0) 在默认主题中引入了全新的 mauve、olive、mist 和 taupe 调色板。

---

### ⭐ [Angular GitHub 星标突破 10 万！](https://github.com/angular/angular)

🎉 [Angular 在 GitHub 上的星标刚刚突破了 10 万！](https://github.com/angular/angular)

---

*原文链接：[JavaScript Weekly Issue 774](https://javascriptweekly.com/issues/774)*
