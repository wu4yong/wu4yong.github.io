---
title: JavaScript周刊-43
date: 2018-04-02 05:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 800: 2026年9月1日

*与 CodeRabbit 联合推出*

![bx17eefknqp64qnr1fet](@@CDN@@/assets/img/web/JavaScriptWeekly43/img-01.webp)

## [JavaScript 的深度：247 字节的扫雷](https://yui.dev/blog/minesweeper-in-247-bytes)

对一行 JavaScript 代码实现的可玩 8x8 扫雷的剖析，其中包含插旗和连锁翻开空白格。作者 658 字节的版本已经足够令人印象深刻，而本文介绍的种种技巧让体积在此基础上又缩小了 62%！

*yui 和 DNEK*

<div style="float:right"><img  src="@@CDN@@/assets/img/web/JavaScriptWeekly43/img-02.webp" width="160" height="91" alt="CodeRabbit" style="padding-top: 12px; padding-left: 12px;"></div>

## [别再按到达顺序审查 PR，按重要的顺序审查](https://coderabbit.link/ad-cooperpress-002)

CodeRabbit Triage 是为 PR 队列打造的、以审查者优先的排序层：一个自动更新、跨仓库的收件箱，告诉你接下来该审查哪个 pull request、该审查到多深，以及哪些或许可以安全关闭。

*CodeRabbit 赞助*

## [Remix 3 RC：无需 React 的全栈框架](https://remix.run/blog/remix-3-release-candidate)

Remix 从昔日的 React 框架彻底重写为独立的全栈框架，这项大工程已基本完成。这篇文章的推介已经不错，但[全新的主页](https://remix.run/)更胜一筹，它说明了 Remix 如何用“单个包”提供构建现代 Web 应用所需的一切。

*Brooks Lybrand*

💡 最终版本定于 10 月 2 日发布，但它现在已经完全可以上手使用。

## [pnpm 12：用 Rust 重写，命令与 lockfile 保持不变](https://pnpm.io/blog/releases/12.0)

Rust 重写版已稳定，v11 的几乎所有命令、标志和 lockfile 格式都得以沿用，只有[少量改动](https://pnpm.io/blog/whats-different-in-pnpm-12)。不过 npm 的 `latest` 标签仍指向 pnpm 11，因此你需要执行 `pnpm self-update next-12` 才能升级。

*Zoltan Kochan*

### 简讯

- TypeScript 已[支持能感知 import attribute 的环境模块（ambient modules）](https://github.com/microsoft/TypeScript/pull/63931)。像 `declare module "*" with { type: "css" }` 这样的声明，现在可以匹配带有该属性的 import。

- Dani Sandoval 汇总了[本月 Svelte 世界的新动态](https://svelte.dev/blog/whats-new-in-svelte-september-2026)，包括 Svelte 5.57 新增的 `SvelteMap` 方法、SvelteKit 3 进入 RC，以及 `sv` CLI 的 `ai-tools` 附加组件。

- Sarah Rainsberger 也汇总了[本月 Astro 的新动态](https://astro.build/blog/whats-new-august-2026/)，包括 Matthew Phillips 接任“Project Steward”，以及全新的 [Astro Playground](https://play.astro.build/)。

### 版本发布

- ⭐ [Rspack 2.2、Rsbuild 2.2 和 Rslint 0.9](https://rspack.rs/blog/announcing-2-2) – 更快的构建与 HMR、更短的模块 ID，Rsbuild 默认开启 Node.js chunk 拆分。值得一提的是，Rslint 现已实现 `@typescript-eslint` 的全部规则和预设。

- [Cypress 16](https://www.cypress.io/blog/cypress-16-faster-tests-starting-with-http2-support)、[NestJS 12](https://trilon.io/blog/nestjs-12-is-now-available)、[Vue 3.6 RC6](https://github.com/vuejs/core/blob/minor/CHANGELOG.md#360-rc6-2026-08-28)、[Deno 2.9.6](https://github.com/denoland/deno/releases/tag/v2.9.6)、[Mocha 12.0](https://github.com/mochajs/mocha/releases/tag/v12.0.0)、[Electron 44](https://www.electronjs.org/blog/electron-44-0)（上周提到过，但现在有了正式文章）。

- [Node.js v26.8.0 (Current)](https://nodejs.org/en/blog/release/v26.8.0) 和 [Node.js v24.20.0 (LTS)](https://nodejs.org/en/blog/release/v24.20.0)

## 📖 文章和视频

### [浏览器新的邮箱验证 API](https://resend.com/blog/email-verification-api)

介绍一项 WICG 提案：浏览器与邮件提供商使用一个由服务器在提交时验证的令牌，从而摆脱“去查收你的收件箱”的烦恼。目前仅支持 Chrome 源试用（origin trial）和 Gmail。

*Phil Nash*

---

### [Lovable 从 Next.js 迁移到 TanStack Start](https://lovable.dev/blog/how-we-migrated-lovable-dev-away-from-nextjs)

Lovable 如何将一个约 85 万行代码的应用从 Next.js 迁移到 TanStack Start，在此期间通过代理让两者并行运行，并在两者之间共享一个代码文件夹。

*Alexander Lebedev (Lovable)*

---

### [在 React、Vue 和 Svelte 中构建数据网格的经验](https://svar.dev/blog/building-data-grid-in-react-vue-svelte/)

SVAR 为 React、Vue 和 Svelte 提供相同的数据网格，并表示无论采用哪种框架，最关键、最影响性能的部分都保持不变。

*Maksim Kozhukh (SVAR)*

---

### [同时应用多个 Linter 自动修复带来的问题](https://jfmengels.net/concurrent-linter-fixes/)

一次性应用多个自动修复，可能产生“先修复再重新分析”循环不会出现的错误代码。

*Jeroen Engels*

---

### [为你的 JavaScript 库升级大版本是对用户不友好的](https://yob.id.au/2026/09/01/major-version-bumps.html)

*James Healy*

## 🛠 代码与工具

### [Uppy 6.0：模块化的 JavaScript 文件上传器](https://uppy.io/blog/uppy-6.0/)

![eo9krbjjdoksfuqz7faw](@@CDN@@/assets/img/web/JavaScriptWeekly43/img-03.webp)

支持从磁盘、Dropbox 或 GDrive 进行可恢复上传（断点续传），并为 React、Vue、Svelte 和 Angular 提供封装。此版本侧重于清理工作：重写了 S3 插件，并减少了需要管理的包。

*Transloadit*

---

### [Zod 4.5：解析更快，每个 schema 的内存占用降低 9 倍](https://zod.dev/blog/zod-4-5)

这个流行的 TypeScript 优先 schema 校验库迎来一次重要的性能版本。在一篇深度文章中，Colin 解释了[方法记忆化如何帮助](https://zod.dev/blog/reducing-memory-footprint)将一个裸 `z.string()` 的堆内存占用从 7.5KB 降到仅 784 字节。

*Colin McDonnell*

---

### [会 JavaScript？你就能发布移动应用了](https://try.expo.dev/3Suxknb)

你的 React 技能已经足以发布移动应用。Expo 负责构建、应用商店提交和更新。无需 Xcode。

*Expo 赞助*

---

### [htmx 4.0：这个反 SPA 库两年来的首个大版本](https://four.htmx.org/announcements/2026-08-28-htmx-4.0.0-is-released)

这个仅凭属性就能把 HTML 片段换入页面的库，已从 `XMLHttpRequest` 迁移到 Fetch API。属性继承现在改为按需启用（opt-in），事件已被标准化/重命名，[morphing swaps](https://four.htmx.org/docs/morphing-swaps-guide) 与 [`<hx-partial>`](https://four.htmx.org/announcements/2026-08-28-htmx-4.0.0-is-released#hx-partial) 是新特性。还有一份完整的 [htmx 4 新特性指南](https://four.htmx.org/docs/whats-new-in-htmx-4)。

*Carson Gross*

💡 如果你刚接触 htmx，[这页常见用例模式](https://four.htmx.org/patterns)提供了很棒的动手入门。

---

### [Svelte Bits：面向 Svelte 的动画 UI 组件](https://sveltebits.xyz/)

[React Bits](https://reactbits.dev/)（出自同一位作者）的 Svelte 移植版，后者是广受欢迎的 React 动画组件套件。

*David Haz*

### 版本发布

- 🗓️ [Schedule-X 4.7](https://schedule-x.dev/) – 适用于 React、Vue、Angular、Svelte 和 Preact 应用的大型日程式日历控件。

- [Mantine 9.6](https://mantine.dev/changelog/9-6-0/) – 流行且功能丰富的 React 组件套件。新增了媒体“灯箱”（lightbox）组件等。

- 🖼️ [Cropper.js 2.2](https://fengyuanchen.github.io/cropperjs/) – 成熟的图片裁剪控件，附有[演练场](https://fengyuanchen.github.io/cropperjs/playground.html)，可以亲自试一试。

- [noble-curves 2.4](https://github.com/paulmillr/noble-curves) – 经审计的、极简的椭圆曲线密码学 JavaScript 实现。

## 📢 生态系统其他动态

- 🤖 Addy Osmani 表示，[精通仍然来自“反复练习”](https://addyo.substack.com/p/agentic-skill-decay)，而智能体替你完成任务，意味着积累专业能力必须成为一项更有意识的行为。

- ∑ [Lean](https://lean-lang.org/) 是一门用于编写机器可验证数学证明的语言，它的验证器“只不过是”一个类型检查器，所以这里改用 [TypeScript 演示了这一概念](https://gruhn.me/blog/2026-08-29/)！

- 🚫 [Google 已从 Chrome 应用商店下架所有剩余的 Manifest V2 扩展](https://webiterate.dev/google-removed-extensions-ublock-origin-108/)……包括 uBlock Origin。

- AWS Lambda 推出了[处于预览阶段的 Node.js 26 运行时](https://aws.amazon.com/blogs/compute/introducing-public-preview-runtimes-on-aws-lambda-starting-with-node-js-26-and-python-3-15/)。

- 一篇详细介绍[现代 HTML 样板（boilerplate）应包含哪些内容](https://www.matuzo.at/blog/2026/html-boilerplate)的文章。

*原文链接：[JavaScript Weekly Issue 800](https://javascriptweekly.com/issues/800)*
