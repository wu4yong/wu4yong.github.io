---
title: JavaScript周刊-35
date: 2018-03-30 09:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 792: 2026年6月30日

## [Deno 2.9 发布](https://deno.com/blog/v2.9)

![deno29](@@CDN@@/assets/img/web/JavaScriptWeekly35/img-01.webp)

这个运行时的一次重磅发布：`deno desktop` 将脚本和基于框架的项目转换为原生、自包含的桌面应用，支持从 npm/pnpm/Yarn/Bun lockfile 快速迁移，测试运行器大幅改进，冷启动速度提升约 2 倍，并以 Node.js 26 兼容性为目标。

*Bartek Iwańczuk*

---

## [44 场 PostgreSQL 演讲录像现已可观看](https://posetteconf.com/2026)

探索 44 场关于 PostgreSQL 驱动的应用开发、Postgres 性能与 AI、Postgres 19、Azure HorizonDB 等主题的演讲。所有内容均可在 YouTube 上观看。按照自己的节奏向 Postgres 专家学习。[查看播放列表。](https://www.youtube.com/playlist?list=PLwF1UYfyG3sZqJVWNlpRgjLpI_JPsJWr5)

*Microsoft | AMD 赞助*

## [VS Code 使用 TypeScript 7 实现更快的迭代](https://code.visualstudio.com/blogs/2026/06/26/iterating-faster-with-ts-7)

VS Code 团队如何在使用 Go 编写的 TypeScript 7 编译器（[当前为 RC 阶段](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-rc/)）仍在构建过程中逐步采用它。类型检查源代码从 36 秒降至 5 秒，`npm run watch` 从 80 秒降至约 20 秒。

*VS Code 团队 (Microsoft)*

## 简讯

- [npm 12 的第二个预览版已可测试。](https://github.com/npm/cli/releases/tag/v12.0.0-pre.2) 这值得一试，因为 Colin McDonnell 已经注意到 [npm 12 会对 `.npmrc` 文件中无法识别的键进行硬错误处理](https://github.com/npm/cli/issues/9699)。

- 🔒 [npm 现在会锁定"高影响力账户"](https://github.blog/changelog/2026-06-25-npm-adds-preventive-account-protection-for-high-impact-accounts/)（最流行包的维护者），在其更改电子邮件或使用 2FA 恢复码时进入 72 小时只读模式。

- Svelte 团队刚刚[发布了最新的月度 Svelte 更新。](https://svelte.dev/blog/whats-new-in-svelte-july-2026) 相关消息：Rich Harris 最近被问到[▶️ 他对使用 AI 和 Svelte 工作的一些看法。](https://www.youtube.com/watch?v=SKjXE_wfdDY)

## 📖 文章和视频

### [为什么 Drizzle 一个月无法在 npm 上发布新版本](https://drizzle.org/blog/why-we-couldnt-publish-to-npm-for-a-month)

除了解释这个流行 ORM 的创建者为何遇到了这个问题之外，Evert 还分享了一些技巧，帮助你检查自己是否面临同样的风险，以及如何完全避免。

*Evert Pot*

---

### [CSS 状态与 JavaScript 事件之间不断变化的边界](https://schwarztech.net/articles/the-shifting-line-between-css-states-and-javascript-events)

一篇关于（比你想象的要多得多的）可以替代 JS 事件监听器的 CSS 伪类的探讨，以及对实验性/未来 `event-trigger` 语法的展望。

*Daniel Schwarz*

---

### [在你的生产级 Postgres 表上实现实时分析](https://www.tigerdata.com/timescaledb?utm_source=cooperpress&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

轮询只是掩盖了延迟。TimescaleDB 的连续聚合确保数据在读取时保持新鲜。获取 $1000 额度开始使用。

*Tiger Data 赞助*

---

### [阻止 Install Scripts 并非银弹](https://ulisesgascon.com/blocking-install-scripts-is-not-a-silver-bullet/)

npm v12 默认不再运行安装脚本，但 Ulises 认为这只能解决部分供应链安全问题。

*Ulises Gascon*

---

### [将 Linear 从 styled-components 迁移到 StyleX](https://linear.app/blog/moving-linear-from-styled-components-to-stylex)

从运行时 CSS-in-JS 方案迁移带来了页面导航时渲染速度提升约 30% 的成果。

*Kenneth Skovhus (Linear)*

---

## 🛠 代码与工具

### [Nub: 增强 Node.js 的全能工具包](https://github.com/nicksrandall/nub)

Bun 或 Deno 可以替代 Node，但这个由 Zod 创建者打造的项目通过一些贴心功能扩展了 Node，比如更全面的 TypeScript 支持、更快更安全的包安装、更好的 `.env` 处理以及一个 Web 标准 Worker。

*Colin McDonnell 等*

---

### [Gea: 编译器优先的响应式 UI 框架](https://github.com/dashpilot/gea)

一个完全致力于"将框架编译掉"的 UI 框架：无 VDOM、JSX 转换为字符串模板、基于 Proxy 的状态存储以及"精准"DOM 修补。最大的优势是极小的构建体积。

*Armagan Amcalar*

---

### [CI 出问题时不用再切回控制台](https://depot.dev/)

Depot CI 的新 API 和 CLI 让你无需离开终端即可查询运行、拉取日志并诊断故障。

*Depot 赞助*

---

### [`<qr-code>` 2.0: 用于生成二维码的 Web Component](https://github.com/bitjson/qr-code)

一个使用纯 JavaScript 在浏览器中显示二维码的简单方式。一个已有 13 年历史的解决方案经过现代化改造，现在仅支持 ESM。[在线演示。](https://qr-code.studio/)

*Eduard Castellano*

---

### [spartan/ui 1.0: 面向 Angular 的 shadcn/ui 风格 UI 原语](https://www.spartanui.com/)

如果你是一名 Angular 开发者，曾羡慕过 shadcn/ui 的复制粘贴简易性，这就是为你准备的。

*Robin Goetz*

---

## 📢 生态系统其他动态

### 🏃 [WebAssembly 运行时全景（2026 版）](https://00f.net/2026/06/23/webassembly-runtimes-2026/)

![wasm-runtimes](@@CDN@@/assets/img/web/JavaScriptWeekly35/img-02.webp)

一份关于当前 WebAssembly 运行时生态系统的全面概述，涵盖了各种可用选项及其适用场景。

---

*原文链接：[JavaScript Weekly Issue 792](https://javascriptweekly.com/issues/792)*
