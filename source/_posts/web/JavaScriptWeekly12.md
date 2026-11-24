---
title: JavaScript周刊-12
date: 2018-03-19 15:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 769: 2026年1月20日

![jQuery 4.0 发布](@@CDN@@/assets/img/web/JavaScriptWeekly12/img-01.webp)

## 📰 头条新闻

### [jQuery 4.0 正式发布](https://blog.jquery.com)

距离最初发布已经 20 年，这个依然广受欢迎（[从实际使用情况来看](https://w3techs.com/technologies/details/js-jquery)）的库迎来了 4.0 版本。新版本迁移到 ES 模块（兼容现代构建工具），同时放弃了对 IE 10 及更早版本的支持。jQuery 在我们早期的周刊中是常客，很高兴看到它再次回归。

💡 如果你正在使用 jQuery，你会发现 [jQuery Migrate](https://github.com/jquery/jquery-migrate) 这个官方工具对升级很有帮助。不过在 2026 年，jQuery 在某种程度上已经是一个传统选择，而且[你可能根本不需要 jQuery](https://youmightnotneedjquery.com/)。

### [Astro 加入 Cloudflare](https://blog.cloudflare.com)

Web 框架领域的重大新闻——[流行的 Astro 框架](https://astro.build/)（*[v6.0 的 beta 版本](https://astro.build/blog/astro-6-beta/)现已推出*）背后的团队正在加入 Cloudflare。现在几乎所有主流框架都在大公司的羽翼之下了。

## 📦 赞助商

### [为你的 JavaScript 应用添加类似 Excel 的电子表格功能](https://developer.mescius.com)

SpreadJS 是业界领先的 JavaScript 电子表格组件，可为企业应用添加高级电子表格功能。构建财务、分析、预算等应用。支持 Excel I/O、500+ 计算函数、表格、图表等。[立即查看演示](https://developer.mescius.com)。

## 📌 简讯

- 🕒 [Temporal Playground](https://tc39.es/proposal-temporal/docs/playground.html) 是一个用于体验 [Temporal API](https://tc39.es/proposal-temporal/docs/) 的在线沙盒
- Svelte 发布了[影响 Svelte 生态系统的五个漏洞](https://github.com/sveltejs/svelte/security/advisories)的补丁
- 🤖 Node.js 和 Deno 的创建者 Ryan Dahl [在 X 上表示](https://x.com/rough__sea/status/1881063601508794393)："*人类编写代码的时代已经结束*"，并且"*这并不是说软件工程师没有工作可做，但直接编写语法已经不是重点了*"。我希望不是这样，但这确实是一个有趣的时代！

## 🚀 版本发布

- [Electron 40.0](https://www.electronjs.org/blog/electron-40-0) – 流行的跨平台桌面应用框架升级到 Chromium 144、V8 14.4 和 Node 24.11.1
- [Node.js v25.4.0 (Current)](https://nodejs.org/en/blog/release/v25.4.0) – require(esm) 现在标记为稳定
- [React Native Windows 0.81](https://github.com/microsoft/react-native-windows/releases/tag/react-native-windows_v0.81.0)
- [Aurelia 2 RC](https://aurelia.io/)
- [Deno 2.6.5](https://github.com/denoland/deno/releases/tag/v2.6.5)

## 📖 文章和视频

![ASCII 渲染技术](@@CDN@@/assets/img/web/JavaScriptWeekly12/img-02.webp)

### [ASCII 字符不是像素：深入探讨 ASCII 渲染](https://alexharri.com/blog/ascii)

Alex 深入研究了如何使用 JavaScript 正确渲染基于 ASCII 的图形，包含所使用算法的示例和大量演示。这是我今年看到的技术上最精彩的博客文章。

### [JavaScript 现在是 Aspire 中的一等公民](https://devblogs.microsoft.com)

[Aspire](https://learn.microsoft.com/dotnet/aspire/) 是微软用于编排分布式应用部署的框架。最初只支持 .NET，[Aspire 13](https://devblogs.microsoft.com/dotnet/announcing-dotnet-aspire-13/) 现在让 JavaScript 成为一等公民，因此你可以运行 Vite 和全栈 JS 应用，并具备服务发现、遥测和生产就绪的容器。

### [断点和 console.log 已成过去，时间旅行才是未来](https://wallabyjs.com)

比使用断点和 console.log 快 15 倍的 JavaScript 调试，支持 Vitest、jest、Karma、Jasmine 等。

### [介绍 `<geolocation>` 元素](https://developer.chrome.com)

Chrome 144 引入了一个新的 `<geolocation>` 元素用于请求用户位置数据，摆脱了 JavaScript 触发的提示方式。

### 更多文章

- 📄 [引导 Bun](https://walters.click/bootstrapping-bun.html) – *"我在为 Bun 运行构建系统的旅程……不依赖任何常规的二进制依赖——也就是它自己"*
- 📄 [使用 GSAP 构建滚动驱动的双波浪文本动画](https://tympanus.net/codrops/2025/01/15/building-a-scroll-driven-dual-wave-text-animation-with-gsap/)
- 📄 [Electron 团队如何改进窗口调整大小行为](https://www.electronjs.org/blog/window-resize-improvements)
- 📄 [如何在 2026 年学习构建应用](https://medium.com/javascript-scene/how-to-learn-to-build-apps-in-2026-b9f6c6c3e0c5)

## 🛠 代码和工具

![Starry Night 语法高亮](@@CDN@@/assets/img/web/JavaScriptWeekly12/img-03.webp)

### [Starry Night 3.9：类似 GitHub 的语法高亮](https://github.com/wooorm/starry-night)

GitHub 自己的语法高亮器不是开源的，但这个库是一个强大的替代方案，尽可能接近 GitHub 的效果，支持数百种语言。我创建了一个[基础的 Web 演示](https://codepen.io/petercoop/pen/abYQKQy)来展示如何在 Web 上使用它。

### [Extension.js 3：浏览器扩展开发框架](https://extension.js.org)

创建跨浏览器扩展，无需手动构建配置，通过统一的工作流程在各个浏览器中开发、构建和预览。[GitHub 仓库](https://github.com/cezaraugusto/extension.js)。

### [轻松为你的 Web 应用添加图像编辑功能](https://pqina.nl)

导入 pintura，提供一张图片，立即获得裁剪、旋转和注释等功能。[立即免费试用](https://pqina.nl)。

### [React Aria：Adobe 的世界级 React 组件](https://react-aria.adobe.com)

React Aria 拥有一个出色的新网站和全新的文档，真正展示了整个体验，包含交互式 CSS 和 Tailwind 示例，让你快速上手。

### [localspace：现代 localForage 兼容存储工具包](https://github.com/mlin6436/localspace)

[localForage](https://localforage.github.io/localForage/) 是/曾是一个流行的存储库，它用简单的、类似 localStorage 的 API 封装了各种浏览器存储 API。不过它已经多年没有更新了，*"localspace 的存在就是为了填补这个空白"*。

### 更多工具

- ⭐ [p5.js v2.2](https://p5js.org/) – 强大的 JavaScript 视觉/创意编码工具包现在将 WebGPU 模式作为核心功能（[这里](https://github.com/processing/p5.js/wiki/Getting-started-with-WebGPU-in-p5.js)和[这里](https://github.com/davepagurek/p5.js-webgpu-intro)有很好的解释）
- 🎥 [Mediabunny 1.29.0](https://github.com/ThatGuySam/mediabunny) – TypeScript 媒体工具包添加了对读写 MPEG 传输流 (.ts) 文件的支持。[演示网站](https://mediabunny.dev/)
- [Prettier 3.8](https://prettier.io/blog/2025/01/13/3.8.0) – 这个固执己见的代码格式化工具添加了对上周发布的 [Angular 21.1](https://blog.angular.dev/angular-v21-1-is-now-available-5b7e2e7c0f5c) 的完整支持
- [LogTape 2.0](https://github.com/dahlia/logtape) – 适用于所有主流 JS 运行时的简单日志库。[更新日志](https://github.com/dahlia/logtape/blob/main/CHANGES.md)
- ☎︎ [vue-tel-input 9.6](https://github.com/iamstevendao/vue-tel-input) – Vue 的电话号码输入组件。（[演示](https://vue-tel-input.iamstevendao.com/)）
- [d3-3d 2.0](https://github.com/niekes/d3-3d) – 基于 D3 的可视化，但投影到 3D
- [Convert 6.0](https://github.com/jonahsnider/convert) – 小巧、快速的类型安全单位转换库
- [SuperDiff 4.0](https://github.com/kucherenko/superdiff) – 为数组和对象提供丰富可读的差异对比
- [Jasmine 6.0](https://jasmine.github.io/) – 历史悠久的 JavaScript BDD 框架

## 📰 分类广告

- 🔑 [为任何 JS 后端添加 API 密钥认证](https://clerk.com)。Clerk 处理生成、哈希、作用域和即时撤销。[公测期间免费](https://clerk.com)
- Notion、Dropbox 和 LaunchDarkly 已切换到 [Meticulous](https://www.meticulous.ai/) 进行前端测试，无需开发人员付出任何努力即可提供近乎详尽的覆盖率。[了解原因](https://www.meticulous.ai/)
- 🛠️ Auth0 for AI Agents 为开发人员提供了构建 AI 代理的基础，而不会牺牲安全性或创新性。[开始构建](https://auth0.com)

## 📢 生态系统中的其他内容

一些更广泛领域中的其他有趣花絮：

- 🔎 VS Code 团队发布了一篇引人入胜的博客文章，介绍[他们如何使用 Rust 和 WebAssembly 为 VS Code 网站实现新的、快速的客户端文档搜索系统](https://code.visualstudio.com/blogs/2025/01/13/vscode-docfind)。你也可以使用他们的 [docfind 引擎](https://github.com/microsoft/vscode-docfind)，[这里有一个实时演示](https://microsoft.github.io/vscode-docfind/)展示了它在 50,000 篇新闻文章索引上的速度有多快
- 📊 *HTTP Archive* 发布了其[2025 年最新的 Web 年鉴](https://almanac.httparchive.org/en/2025/)，其中包含了过去一年 Web 状态的原始统计数据、趋势和观察，涵盖了 [WebAssembly](https://almanac.httparchive.org/en/2025/webassembly)、[性能](https://almanac.httparchive.org/en/2025/performance)和不断增加的[页面重量](https://almanac.httparchive.org/en/2025/page-weight)等领域
- 一位开发者预测 [Microsoft 最终将停止 Windows](https://world.hey.com/dhh/microsoft-should-turn-windows-into-a-linux-distro-5e707e79)，转而支持 Windows 主题的 Linux 发行版
- [MySQL 项目的情况不太乐观](https://www.theregister.com/2025/01/16/oracle_mysql_heatwave_only/)
- [2025 年和 2026 年的 WebAssembly 状态](https://bytecodealliance.org/articles/webassembly-in-2025-and-2026)

---

*原文链接：[JavaScript Weekly Issue 769](https://javascriptweekly.com/issues/769)*
