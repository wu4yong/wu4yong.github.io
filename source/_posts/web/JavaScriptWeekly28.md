---
title: JavaScript周刊-28
date: 2018-03-26 08:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 785: 2026年5月12日

## [TanStack npm 入侵事件剖析](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem)

![tanstack-compromise](@@CDN@@/assets/img/web/JavaScriptWeekly28/img-01.webp)

一种新的 Shai-Hulud 蠕虫变种昨天向 npm 推送了 TanStack 包的恶意版本（包含一个触发开关，一旦检测到令牌撤销就会删除文件），同时还波及了约 170 个其他包。维护者的凭证并未被盗取，攻击手段是通过链式利用 `pull_request_target` 滥用、缓存投毒和从 CI 内存中窃取 OIDC 令牌来完成的。

*Tanner Linsley*

❓ **你应该怎么做？** 考虑设置安装冷却期（例如通过 `npm config set min-release-age=7` 或 [pnpm](https://pnpm.io/) 的 `minimumReleaseAge`），因为这些包仅被入侵了 26 分钟。此外，使用 [zizmor](https://docs.zizmor.sh/) 等工具审计你的 GitHub Actions 工作流的安全问题。

---

<div style="float:right; margin-left:16px; margin-bottom:8px;">
  <img  src="@@CDN@@/assets/img/web/JavaScriptWeekly28/img-02.webp" width="155">
</div>

## [Next.js 调试 Workshop：日志、追踪、完整上下文](https://sentry.io/resources/nextjs-may-workshop/?utm_source=javascriptweekly&utm_medium=paid-community&utm_campaign=nextjs-fy27q2-nextjsworkshop&utm_content=newsletter-primary-register)

不要再在不同的工具之间跳来跳去拼凑 Next.js Bug 了。Sentry 的动手 Workshop 教你如何编写能够解释"在哪里、是什么、为什么"的日志，然后将它们连接到客户端和 Node 运行时的追踪中。[今日注册。](https://sentry.io/resources/nextjs-may-workshop/?utm_source=javascriptweekly&utm_medium=paid-community&utm_campaign=nextjs-fy27q2-nextjsworkshop&utm_content=newsletter-primary-register)

*Sentry 赞助*

## [Rolldown 1.0 发布：高性能 JS 打包器](https://voidzero.dev/posts/announcing-rolldown-1-0)

作为 Vite 8 的核心基础构建的 Rust 打包器达到了稳定的 v1.0。你可以获得巨大的性能提升，同时保持 Rollup 插件 API 兼容性：它比 Rollup 快 10-30 倍，早期采用者报告构建时间大幅下降。

*VoidZero 团队*

## 简讯

- [Node.js 近期协作峰会的笔记](https://nodejs.org/en/blog/events/collab-summit-2026-london) 值得一读，如果你想了解 Node 团队目前正在做什么的话。

- 关于 Bun 从 Zig 到 Rust 的实验性移植，Jarred Sumner 表示目前 96 万行代码的重写[通过了 Bun 原有测试套件的 99.8%](https://x.com/jarredsumner/status/2053047748191232310)。

- 🤖 一位开发者[发起了一项将 NetHack 移植到 JavaScript 的挑战。](https://mazesofmenace.ai/) LLM 能否*完美*移植这个复杂的 Roguelike 游戏？到目前为止还没有，[排行榜](https://mazesofmenace.ai/) 显示一个*转译*版本最接近成功。

- 你知道吗，[Firefox 有一个 `$$$` 辅助工具](https://remysharp.com/2026/05/01/devtools-how-to-query-through-the-shadow-dom)可以穿透 Shadow DOM 进行查询？

## 版本发布

- [Jest 30.4.0](https://github.com/jestjs/jest/releases/tag/v30.4.0) – 这个流行的 JavaScript 测试框架发布了重大更新，改进了 ESM、Temporal 和 React 19 支持。

- [Node 26.1 (Current)](https://nodejs.org/en/blog/release/v26.1.0) – 上周的 [Node 26 重大发布](https://nodejs.org/en/blog/release/v26.0.0)可能以 Temporal API 为主，但 26.1 添加了（实验性）官方 FFI 支持。

## 📖 文章和视频

### [33 个 JavaScript 概念](https://33js.dev/)

最初是一篇 Medium 文章，后来变成了一个受欢迎的 GitHub 仓库，现在成为了一个覆盖广泛 JavaScript 概念的完整网站，甚至超越了最初的 33 个。

*Leonardo Maldonado*

---

### [Web 平台 9 次被 JavaScript 库影响的时刻](https://jadjoubran.com/blog/9-times-the-web-platform-was-influenced-by-javascript-libraries/)

Lodash、Dojo 和 jQuery 等各种库如何经常为最终进入浏览器 API 的各种功能做"生产环境中的研发工作"。

*Jad Joubran*

---

### [轻松快速的 Azure 迁移：Azure Copilot 迁移智能体](https://learn.microsoft.com/)

查看 Microsoft 的《Azure Copilot 智能体入门》免费学习模块，了解更多并亲自尝试。

*Microsoft Azure Copilot 迁移智能体 赞助*

---

### [从 React 到 Web Components：一次节省 100 KB 的迁移](https://evilmartians.com/chronicles/from-react-to-web-components-a-migration-that-saved-100-kb)

"我如何将一个网站从 React 迁移到原生 Web Components，为什么效果比我预期的要好，以及我在此过程中使用的模式如何演变成一个小型库——nanotags。"

*Pavel Grinchenko (Evil Martians)*

---

### [为什么要迁移到 Valibot？](https://valibot.dev/blog/why-migrate-to-valibot/)

Valibot 是一个轻量级、模块化的 TypeScript 模式验证库，是 Zod 等工具的替代方案。v1.4.0 也刚刚发布。

*Fabian Hiller*

---

## 🛠 代码与工具

### [zero-native: 使用 Zig + WebView 构建桌面应用](https://zero-native.dev/)

![zero-native](@@CDN@@/assets/img/web/JavaScriptWeekly28/img-03.webp)

Vercel Labs 进入 [Neutralinojs](https://neutralino.js.org/)/Electron/Tauri 领域的作品，用于在 Zig 核心和系统 WebView*或*Chromium 之上构建原生 HTML+JS 桌面应用。有[示例](https://github.com/vercel-labs/zero-native/tree/main/examples)展示了如何在其上构建原生 JS、React、Svelte 和 Vue 应用。[GitHub 仓库。](https://github.com/vercel-labs/zero-native)

*Vercel*

---

### [那个 API 调用需要 3 秒，不是网络的问题](https://www.tigerdata.com/timescaledb?utm_source=cooperpress&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

是背后的分析查询的问题。TimescaleDB 扩展了 Postgres，使查询在大规模下保持快速。$1000 额度开始使用。

*Tiger Data (TimescaleDB 创建者) 赞助*

---

### [Wakaru: 拆解压缩的 JavaScript 包](https://wakaru.vercel.app/)

一个工具，你可以将压缩打包的代码输入其中，获得可读的模块——无论是用于代码恢复、逆向工程还是安全审计。[你可以在线尝试。](https://wakaru.vercel.app/)

*Pionxzh*

---

### [BlueJS: 将 JavaScript 编译为极小二进制文件](https://blue-js.pages.dev/)

将 JS 编译为极小的原生二进制文件的工具。

*BlueJS*

---

*原文链接：[JavaScript Weekly Issue 785](https://javascriptweekly.com/issues/785)*
