---
title: JavaScript周刊-30
date: 2018-03-27 14:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 787: 2026年5月26日

## [JS 填字游戏：所有答案都是 JavaScript](https://lyra.mirror.xyz/wZhEFFxwRjbynYHMbi0i3RgRx-HXhG9wL4JDTY2S0Eg)

![js-crossword](@@CDN@@/assets/img/web/JavaScriptWeekly30/img-01.webp)

这个手工制作的谜题将极大地考验你的 JavaScript 知识。我看到社交媒体上很多人要么在庆祝完成了它，要么在咒骂被卡住……

*Lyra Rebane*

---

<div style="float:right; margin-left:16px; margin-bottom:8px;">
  <img  src="@@CDN@@/assets/img/web/JavaScriptWeekly30/img-02.webp" width="130">
</div>

## [Expo UI 正式发布：从一个 Import 获取原生 iOS 和 Android 组件](https://expo.dev/)

只需一个 import，`@expo/ui` 就能在 iOS 上提供 SwiftUI、在 Android 上提供 Jetpack Compose，底层是真正的平台原生组件。SDK 56 还为七个常见的 React Native 社区包提供了原生的替代方案。

*Expo 赞助*

## [npm Staged Publishing 正式上线](https://docs.npmjs.com/staged-publishing)

npm 的"分阶段发布"模式提供了一个审查期，在包上线 npm 仓库之前需要获得批准。[npm 11.15.0](https://github.com/npm/cli/releases/tag/v11.15.0) 和 [pnpm 11.3](https://pnpm.io/blog/releases/11.3) 都已添加支持。

*npm 项目*

💡 [在这篇更全面的文章中](https://github.blog/changelog/2026-05-22-staged-publishing-and-new-install-time-controls-for-npm/)，GitHub 还介绍了 npm 新增的 `--allow-*` 选项，用于控制 npm 允许从何处获取包。

## [Chrome 预览声明式部分更新](https://developer.chrome.com/blog/declarative-partial-updates/)

两组新 API，用于处理乱序 HTML，无论是通过文档本身（通过 `<template for>`）还是动态插入（通过 `setHTML`/`streamHTML`）。在 Chrome 148 中实验性提供，但有 Polyfill 可供使用。

*Pollard 和 Rosenthal (Chrome)*

## 简讯

- [Firefox 在 Firefox 151 中新增了 Web Serial 支持](https://hacks.mozilla.org/2026/05/web-serial-support-in-firefox/)，你可以通过 JS 连接微控制器、3D 打印机和其他串口硬件。

- Mozilla 的 Ryan Hunt [向 asm.js 告别](https://spidermonkey.dev/blog/2026/05/20/saying-goodbye-to-asmjs.html)，Firefox 的 JS 引擎现在默认禁用对其的优化。

- 🤖 [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance) 是一套经过专家审查的技能指南，用于指导智能体构建现代 Web 体验，例如 *"当用户悬停在重要链接上时开始预加载页面。"*

- [TC39 上周举行了最新会议](https://github.com/tc39/agendas/blob/main/2026/05.md)——回顾文章即将发布。

## 版本发布

- [Storybook 10.4](https://storybook.js.org/blog/storybook-10-4/) — 前端组件工坊新增了一等的 TanStack React 支持，并赋予智能体在复杂应用中搭建 Storybook 的能力。

- [Node.js v26.2.0 (Current)](https://nodejs.org/en/blog/release/v26.2.0) 和 [v24.16.0 (LTS)](https://nodejs.org/en/blog/release/v24.16.0)

- [pnpm 11.3](https://pnpm.io/blog/releases/11.3) — 新增了 `pnpm stage` 用于[分阶段发布](https://docs.npmjs.com/staged-publishing)、`trustLockfile` 用于设置信任策略控制、原生 `pkg`、`repo` 和 `set-script` 命令等。

## 📖 文章和视频

### [从 Webpack 迁移到 Rspack 优化构建时间](https://yelp.com/engineering)

Yelp 如何使用 Rspack（一个 Rust 驱动的 Webpack 替代品）将构建时间缩短一半，以及他们在这个过程中学到的关于 Barrel 文件和重导出的经验。

*Benson Pan (Yelp)*

---

### [面向开发者及其智能体的无限 Postgres](https://ghost.org/)

ghost 为你的智能体提供无限的 Postgres 分支。无项目数量限制、无需清理、1TB 存储、每月 100 小时免费。免费试用。

*Ghost 赞助*

---

### [Microsoft 对近期 Mini Shai-Hulud 入侵事件的分析](https://www.microsoft.com/en-us/security/blog/2026/05/20/analyzing-the-mini-shai-hulud-npm-supply-chain-compromise/)

对上周"Mini Shai-Hulud"npm 供应链入侵事件的详细事后分析。

*Microsoft Defender 安全研究团队*

---

### [Deno 2.8: 迄今为止"最大的小版本"](https://deno.com/blog/v2.8)

头条新闻是 Node.js 兼容性从 Deno 2.7 的 42% 跃升至现在的 76.4%（高于 Bun）。Deno 还在各方面获得了巨大性能提升，并且在添加/安装包时不再需要 `npm:` 前缀。此外还有许多其他改进。

*Bartek Iwańczuk*

---

### [10 个已合并，还有 34 个：从上游修复 JS 可观测性](https://sentry.io/)

每个 JS APM 工具都会 Monkey-Patch 库。这在 ESM、打包器和非 Node 运行时中会出问题。以下是如何修复它。

*Sentry 赞助*

---

## 🛠 代码与工具

### 📄 [DOCX 9.7: 在 JavaScript 中构建 Word .docx 文件](https://docx.js.org/)

一个成熟、全面的库，用于在客户端和服务端生成 docx 文件。有一个[基于 CodePen 的基础示例](https://docx.js.org/)，以及[超过 100 个示例脚本。](https://docx.js.org/example-scripts/)

*Dolan Miu*

---

### [tinykeys 4.0: 一个微小的现代键绑定库](https://jamiebuilds.github.io/tinykeys/)

拥有非常简单直观的 API，页面包含[在线演示。](https://jamiebuilds.github.io/tinykeys/)

*Jamie Kyle*

---

### [官方 Node.js Codemod：从 Axios 迁移到 fetch](https://github.com/nodejs/axios-to-fetch-codemod)

一个将使用 Axios 的代码转换为使用 Fetch API 的 Codemod。

*Node.js 团队*

---

### 📱 [Hot Updater: 为 React Native 提供自托管的 OTA 更新](https://github.com/gronxb/hot-updater)

一种无需应用商店审核即可向应用部署更新的方式。

*Sungyu Kang*

---

*原文链接：[JavaScript Weekly Issue 787](https://javascriptweekly.com/issues/787)*
