---
title: JavaScript周刊-34
date: 2018-03-29 16:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 791: 2026年6月23日

## [使用 Deno Desktop 构建桌面应用](https://docs.deno.com/runtime/desktop/)

![deno-desktop](@@CDN@@/assets/img/web/JavaScriptWeekly34/img-01.webp)

Deno 2.9（或现在的 'canary' 构建版）可以将 JavaScript 项目转换为 macOS、Windows 和 Linux 上的自包含应用。与 Electron 不同，你可以选择使用操作系统默认的 WebView 或捆绑的 Chromium 后端，此外还支持交叉编译，并自动支持基于 Next.js 和 SvelteKit 等框架构建的应用。

*Deno 项目*

---

<div style="float:right; margin-left:16px; margin-bottom:8px;">
  <img  src="@@CDN@@/assets/img/web/JavaScriptWeekly34/img-02.webp" width="130">
</div>

## [在你的 JS PR 合并之前捕获运行时 Bug](https://www.greptile.com?utm_source=javascriptweekly&utm_medium=paid-community&utm_campaign=javascriptweekly_primary_jun23)

有些 JavaScript Bug 只有在应用运行后才会显现。Greptile 利用完整仓库上下文审查每个 PR，在沙箱中运行代码，并返回截图、日志和追踪作为出错证据。可在 GitHub、GitLab 或终端中使用 Greptile。

*Greptile 赞助*

## [Babel 8.0 发布：JavaScript 转译器](https://babeljs.io/blog/2026/06/16/8.0.0/)

距离 [Babel 7.0](https://babeljs.io/blog/2018/08/27/7.0.0/) 已经过去了*八年*，尽管 SWC 和 Oxc 等工具崛起，`@babel` 包的每周下载量自那时起增长了 380 倍。v8.0 是一个现代化版本，仅支持 ESM，默认编译目标为 ~ES2023（而非之前的 ES5）。

*Babel 团队*

## [TypeScript 7.0 发布候选版](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-rc/)

Go 驱动的 TypeScript 编译器又近了一步，承诺约 10 倍更快的构建性能。*（我看到社交媒体上的人们对此感到非常兴奋。）*

*Daniel Rosenwasser (Microsoft)*

## 简讯

- Cloudflare 新增了[在"临时账户"上创建和部署 Workers 的能力](https://blog.cloudflare.com/temporary-accounts/)。名义上是"为 AI 智能体"设计的，但你也可以自己使用，让一个 Worker 无任何附加条件地运行 60 分钟。

- TC39 代表 Luca Casonato 提出了[为 `<time>` 添加内置本地化时间格式化的提案](https://github.com/whatwg/html/issues/12591)，类似于 GitHub 的 [`<relative-time>` 元素](https://github.com/github/relative-time-element)。

## 📖 文章和视频

### [一个被低估的重构如何节省了 90% 的内存使用](https://tanstack.com/blog/how-an-underrated-refactor-saved-90-percent-memory)

深入分析了一次看似简单的重构如何带来巨大的内存优化成果。

*Kevin Van Cott (TanStack)*

---

### [你已经掌握了足够多的 JavaScript 知识来交付真正的移动应用](https://expo.dev/)

使用 React 从一个代码库构建 iOS 和 Android 应用。Expo 处理构建、应用商店和更新。

*Expo 赞助*

---

## 🛠 代码与工具

### [FullCalendar 7.0: 全功能 JavaScript 日历](https://fullcalendar.io/)

![fullcalendar](@@CDN@@/assets/img/web/JavaScriptWeekly34/img-03.webp)

为你自己的应用提供 Google Calendar 风格的体验。支持 React、Vue 和 Angular（v7.0 新增 Angular 22 支持），也可以与原生 JavaScript 一起使用。[这里有一个演示](https://fullcalendar.io/)，你可以在其中体验主题和样式方法。MIT 许可，带有商业扩展。

*FullCalendar LLC*

---

### 🤖 [Eve: 就像 Next.js，但是用于构建智能体](https://evejs.com/)

来自 Vercel 的一个新框架，提供类似 Next.js 的结构，用于使用 TypeScript 和 Markdown 构建 AI 驱动的智能体。

*Vercel*

---

### [你的图表端点不需要第二个数据库](https://www.tigerdata.com/timescaledb?utm_source=cooperpress&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

是它背后的查询，而不是渲染。TimescaleDB 扩展了 Postgres 用于分析。获取 $1000 额度开始使用。

*Tiger Data 赞助*

---

### [ForesightJS 4: Web 预测用户意图库](https://foresightjs.com/)

根据指针和键盘提示预测用户意图，在需要之前预取内容以获得更快速的用户体验。v4.0 新增了官方的 React 和 Vue 包，v4.2 中提供了声明式的 `<Foresight>` 组件。

*ForesightJS, Inc.*

---

### [Prop For That: JS 知道的，现在 CSS 也能访问](https://propforthat.com/)

为 CSS 提供通常需要 JS 才能获取的值（例如指针位置、时间、滑块的值）。在 HTML 中添加属性后，实时值会作为自定义属性出现，桥接了 JS-CSS 之间的鸿沟。[演示页面非常精妙。](https://propforthat.com/)

*Adam Argyle*

---

### [Kage: 为离线浏览下载网站快照](https://github.com/duc-tam-nguyen/kage)

一个克隆网站并提供离线浏览的工具。与"另存为"的不同之处在于，它通过使用无头浏览器保存 DOM 来处理 JS 渲染的网站。[仓库。](https://github.com/duc-tam-nguyen/kage)

*Duc-Tam Nguyen*

---

### [goja: 纯 Go 语言实现的 ECMAScript/JavaScript 引擎](https://github.com/dop251/goja)

一个成熟的 JavaScript 引擎，用于为 Go 应用添加脚本功能，无需 CGo/V8。

*Dmitry Panov*

---

## 📢 生态系统其他动态

### 💡 [Dark Mode Toggle: 一个精妙的暗色模式实现](https://gist.github.com/GulgDev/7b113b5e971682a6512d96c9c0fdf6da)

![elsewhere](@@CDN@@/assets/img/web/JavaScriptWeekly34/img-04.webp)

一个简洁的暗色模式切换实现，展示了现代 Web 标准的最佳实践。

---

*原文链接：[JavaScript Weekly Issue 791](https://javascriptweekly.com/issues/791)*
