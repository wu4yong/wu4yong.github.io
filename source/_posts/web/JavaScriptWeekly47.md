---
title: JavaScript周刊-47
date: 2018-04-03 12:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 804: 2026年9月29日

*与 Meticulous 联合推出*

## [Anthropic 如何在两周内让 Claude 应用快 3 倍](https://claude.dev/blog/how-we-made-claude-ai-faster/)

![holotoxy8ll41zticmyu](@@CDN@@/assets/img/web/JavaScriptWeekly47/img-01.webp)

一次性能冲刺的经验杂烩：p75 的“可输入时间”从 3.1s 降到 0.55s。破折号（*真是讽刺！*）把 V8 推上了更慢的正则路径，一个多余的 `location.reload()` 每天造成 50 万次隐藏刷新，等等。

*Wang、Attard 和 G (Anthropic)*

<div style="float:right"><img  src="@@CDN@@/assets/img/web/JavaScriptWeekly47/img-02.webp" width="140" height="140" alt="Meticulous" style="padding-top: 12px; padding-left: 12px;"></div>

## [还在写测试？Meticulous 来了](https://www.meticulous.ai/?utm_source=jsweekly&utm_medium=newsletter&utm_campaign=26q3&utm_content=primary)

Notion、Dropbox 和 Wiz 如今都在使用一套离开就没法发布的测试范式。Meticulous 由前 Palantir 工程师打造，会生成一套持续演进的确定性 E2E UI 测试，无需开发者投入即可实现详尽覆盖。

*Meticulous AI 赞助*

## [Vite+ 1.0：用一个 CLI 管理你的整个 JavaScript 工具链](https://voidzero.dev/posts/announcing-vite-plus-1-0)

单个 `vp` 命令现在可以（如果你愿意）管理你的 Node 运行时、包管理器、开发服务器、lint、格式化、测试、构建和任务运行，全部通过 `vite.config.ts` 配置。[`vp migrate`](https://viteplus.dev/guide/migrate) 可以把现有的 Vite、Vitest、ESLint、tsup 等配置迁移到 Vite+。

*VoidZero*

💡 Evan You 还[回顾了 VoidZero 在 Cloudflare 的四个月](https://blog.cloudflare.com/voidzero-update/)，包括 Oxc React Compiler、Vitest 5、稳定的类型感知 lint 等方面的工作。

### 简讯

- [最新的 TC39 会议](https://github.com/tc39/agendas/blob/main/2026/09.md)正在东京举行，已有三个 iterator 提案推进到 stage 4：[chunking](https://github.com/tc39/proposal-iterator-chunking/)、[join](https://github.com/tc39/proposal-iterator-join) 和 [includes](https://github.com/tc39/proposal-iterator-includes)（后者刚刚[在 Chrome 154 中发布](https://developer.chrome.com/release-notes/154#javascript)）。

- Jarred Sumner 在 𝕏 上分享了 [Bun 提前编译 JavaScript 的预览](https://x.com/jarredsumner/status/2104739495895781679)：Claude Code 启动快 24%、内存占用少 48%，但二进制体积约为 2 倍。

- 🎉 Cloudflare *终于*有了[一个统一所有 API 的 CLI](https://blog.cloudflare.com/cloudflare-cf-cli-launch/)。`cf` 用 TypeScript 编写，覆盖全部功能，而 Wrangler 一直只覆盖其中一部分。

- Angular 团队正在[构建一个部分由 Rust 驱动的编译器](https://blog.angular.dev/an-update-on-angulars-typescript-7-powered-compiler-9619a35e2b0a)，因为 TypeScript 7 的 Go 移植版缺少当前版本所依赖的 API。

### 版本发布

- [MSW (Mock Service Worker) 3.0](https://github.com/mswjs/msw/releases/tag/v3.0.0) – 这个流行的 API mock 库现在仅支持 ESM，新增 Vite 插件，支持 GraphQL 订阅，并能拦截页面导航和表单提交。
- [Vinext 1.0](https://blog.cloudflare.com/vinext-nextjs-on-vite/) – Cloudflare 基于 Vite 的 Next.js 重实现，现已支持 Pages 和 App Router，并为现有应用提供迁移路径。
- [Mermaid 12.0](https://github.com/mermaid-js/mermaid/releases/tag/mermaid%4012.0.0) – 这个图表工具现在对流程图、类图、状态图等默认使用 ELK 布局引擎，因此现有图表外观会发生变化，除非你设置 `layout: dagre`。还新增了 [UML 用例图](https://mermaid.ai/open-source/syntax/usecase.html)。
- [pnpm 12.8](https://github.com/pnpm/pnpm/releases/tag/v12.8.0)、[Angular 22.2](https://github.com/angular/angular/releases/tag/v22.2.0)、[TinyBase 10](https://tinybase.org/guides/releases/#v10-0)、[QUnit 3.0](https://qunitjs.com/upgrade-guide-3.x/)

## 📖 文章和视频

### [前端的宏大统一架构](https://dev.to/playfulprogramming/the-grand-unifying-architecture-of-frontend-bhk)

![q97l6jlstbu4nz3us8ex](@@CDN@@/assets/img/web/JavaScriptWeekly47/img-03.webp)

SolidJS 的创建者认为，HTMX、React、LiveView 等框架的主要差异，在于如何把同样三件事（导航、内容和即时 UI 反馈）在客户端与服务端之间划分。随后他展示了 [Solid 2.0](https://www.solidjs.com/blog/solid-2-0-rc-the-big-reveal) 如何力图覆盖整个光谱。

*Ryan Carniato*

---

### [打造帮助人们构建自己生活的产品](https://jobs.fidelity.com/en/technology-careers/?utm_source=javascript&utm_medium=paidsocial&utm_campaign=jobssocial&utm_content=awn-tech-nl3-s)

Fidelity 的技术人员可以改变客户的投资方式——为了更好，也为了每一个人。

*Fidelity Careers 赞助*

---

### [优化 `null` 原型的对象](https://adventures.nodeland.dev/archive/optimizing-objects-with-null-prototypes/)

在 V8 中，通过 `{ __proto__: null }` 或 `Object.create(null)` 创建的对象会从较慢的“字典模式”开始。Matteo 展示了如何先创建一个普通对象、再把它的原型设为 `null`，从而保留快速属性。

*Matteo Collina*

💡 如果想深入，[Fast properties in V8](https://v8.dev/blog/fast-properties) 是 V8 团队 2017 年的解释文章，讲的是对象如何在快速模式与“字典”模式之间切换。

---

### [可替代 npm 包的 Node.js 内置模块](https://flaviocopes.com/node-builtins/)

巡览 12 个可替代常见生态包的 Node 内置模块，并介绍它们的稳定性等级，以及一些可能让你继续使用成熟替代方案的问题。

*Flavio Copes*

---

### 📄 [JavaScript 最妙的双关？<code v-pre>${{ }}</code>](https://shukla.io/blog/2026-09/pun.html)

看起来像 Mustache，但 <code v-pre>${{ name }}</code> 会通过简写属性把一个对象传给标签函数，同时保留变量的名字和值。

*Nishant Shukla*

---

### 📄 [GitHub 如何通过摆脱 CSS-in-JS 提升性能](https://github.blog/engineering/architecture-optimization/improving-site-performance-by-shipping-more-css/)

GitHub 工程团队分享其架构与优化实践：通过输出更多的 CSS 来提升站点性能。

*Josh Black 和 Marie Lucca (GitHub)*

## 🛠 代码与工具

### [Size Limit：JavaScript 性能预算工具](https://github.com/ai/size-limit)

![yvxogbuz6gl1ubyguxml](@@CDN@@/assets/img/web/JavaScriptWeekly47/img-04.webp)

为代码设定体积或加载时间预算，一旦变更超出预算，这个工具就能让 CI 失败（或在 PR 上标记）。你也可以做一次性检查，并查看字节都花在哪里的可视化。它与框架无关，也不在乎你用什么打包器或 CI。

*Andrey Sitnik*

---

### [你的 UI 背了慢查询的锅](https://www.tigerdata.com/go/trial?utm_source=content-syndication&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

TimescaleDB 扩展了 Postgres，让你的 UI 背后的查询在数据增长时依然快速返回。[立即获取 1000 美元额度开始使用](https://www.tigerdata.com/go/trial?utm_source=content-syndication&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)。

*Tiger Data（TimescaleDB 的创造者）赞助*

---

### [EmDash 1.0：Cloudflare 的 *WordPress* “继任者”现已稳定](https://blog.cloudflare.com/emdash-cms-plugin-registry/)

一个基于 Astro 的 WordPress 替代方案，现在拥有基于 AT Protocol 的去中心化插件注册表，插件运行在沙箱中。它也并非只能在 Cloudflare 上运行，同样可以跑在 Node.js 上。

*Buscemi、Kane 和 Pham (Cloudflare)*

---

### 📝 [DOCX 9.8：用 JavaScript 生成 Word `.docx` 文件](https://github.com/dolanmiu/docx/releases/tag/9.8.0)

一个用于生成 `docx` 文件的全面库。距我们上次链接它才几个月，但这次是个*大*版本：支持图表、形状和水印，还有更多的数学公式支持。（[主页](https://docx.js.org/)。）

*Dolan Miu*

### 版本发布

- 🔊 [wavesurfer 8.0](https://github.com/katspaugh/wavesurfer.js) – 流行的音频波形渲染与播放器。经过重构以提升效率，并修复了大量 bug。
- [pretty-bytes 7.2](https://github.com/sindresorhus/pretty-bytes) – 将字节数量转换为人类可读的字符串。
- ✉️ [postal-mime 4.0](https://github.com/postalsys/postal-mime) – 一个在任何环境都能用的邮件解析库。
- [Typia 15.0](https://typia.io/) – 把纯 TypeScript 类型变成运行时校验器。

## 📢 生态系统其他动态

### 🎵 [用纯 JavaScript 重现 A-ha 的《Take on Me》](https://dittytoy.net/ditty/2dd99fc839)

![jilmudkfxkr6xbomw3gi](@@CDN@@/assets/img/web/JavaScriptWeekly47/img-05.webp)

Tonny Espeset 在总是很有趣的 [Dittytoy](https://dittytoy.net/) 在线 JavaScript 音乐游乐场里，用纯 JavaScript 重现了 80 年代金曲《Take on Me》（**还带合成人声！**）。

---

### [Git 2.56 发布](https://github.blog/open-source/git/highlights-from-git-2-56/)

新增 `git add --resolved` 以安全地暂存合并冲突修复，`git branch --delete-merged` 用于批量清理分支，等等。文章中有详细说明。

---

### [Redact：一种替代性的 React 逻辑投影](https://tannerlinsley.com/posts/projecting-react)

TanStack 的 Tanner Linsley 构建了 Redact，“一种替代性的 React 逻辑投影”，目标是完整 API 兼容，同时实现更简单、包更小、性能更好。现已[上 GitHub](https://github.com/TanStack/redact)。

---

### [为什么是 3000、8080 这些端口号？一段意外的历史](https://smarmelling.com/posts/the-accidental-history-of-3000-8080-and-other-port-numbers.html)

为什么 3000 和 8080 等端口号在开发中如此常用，一段简短的历史。

*原文链接：[JavaScript Weekly Issue 804](https://javascriptweekly.com/issues/804)*
