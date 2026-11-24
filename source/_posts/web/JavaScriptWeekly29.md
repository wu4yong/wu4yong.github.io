---
title: JavaScript周刊-29
date: 2018-03-26 20:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 786: 2026年5月19日

## [RFC：是时候让 npm 的 Install Scripts 变为可选加入了](https://github.com/npm/rfcs/pull/868)

![npm-install-scripts](@@CDN@@/assets/img/web/JavaScriptWeekly29/img-01.webp)

npm 是唯一一个默认运行依赖安装脚本（如 `postinstall`）的主流包管理器，而这已经成为了太大的安全弱点，GitHub（npm 的维护者）的 Jamie 如是说。此 RFC 进一步讨论了这一想法及其涉及的各种权衡。

*Jamie Magee*

---

<div style="float:right; margin-left:16px; margin-bottom:8px;">
  <img  src="@@CDN@@/assets/img/web/JavaScriptWeekly29/img-02.webp" width="120">
</div>

## [Depot 如何在 AWS Lambda 上构建 CI 编排器](https://fandf.co/4tkTepn)

长时间运行的 CI 编排无需长驻服务器。Depot 使用 AWS Lambda 持久函数重建了他们的 CI 引擎——有状态、回调驱动且可崩溃恢复。深入探讨了驱动 Depot CI 的 run-workflow-job 层级结构。

*Depot 赞助*

## [Mini Shai-Hulud 再次来袭：300+ 个恶意 npm 包被发布](https://safedep.io/mini-shai-hulud-strikes-again-314-npm-packages-compromised/)

"Shai-Hulud"类 npm 生态系统攻击持续发酵。今天，又有[数百个包](https://safedep.io/mini-shai-hulud-strikes-again-314-npm-packages-compromised/#full-list-of-compromised-packages)遭入侵——包括 `antv` 家族和 `timeago.js` 等流行包。

*SafeDep 团队*

## 简讯

- 😱 Dr. Axel Rauschmayer（JavaScript 传奇人物、前 JS Weekly 编辑）[将他的博客和 JavaScript 书籍从 Web 上撤下](https://2ality.com/)，原因是被 AI 爬虫搞得不堪重负。不过，你仍然可以在[这里购买](https://payhip.com/rauschma)他出色的书籍。

- Bun 的传奇继续。尽管曾[淡化其重要性](https://news.ycombinator.com/item?id=48019226)，[基于 Rust 的 Bun 重写已被合并](https://github.com/oven-sh/bun/pull/30412)，但[对 AI 移植代码质量的质疑](https://github.com/oven-sh/bun/issues/30719)也随之而来。Hacker News 上[引发了大量讨论。](https://news.ycombinator.com/item?id=48150900)

- [Deno 团队正在预告 Deno 2.8](https://bsky.app/profile/deno.land/post/3mm6clkq5uc22)，预计本周发布。显著的 Node.js 兼容性改进、`import defer` 和 TypeScript 6.0.3 支持即将到来。

- Chrome 和 Edge 团队正在开发[一个新的 `<install>` HTML 元素](https://developer.chrome.com/blog/install-element-ot)，让浏览器能够为 PWA 渲染"受信任的安装按钮"。

- *Express.js* 项目[换上了全新的外观](https://expressjs.com/en/blog/2026-05-18-a-new-look-for-express/)，包括新网站、新 Logo 和[改进的文档。](https://expressjs.com/en/5x/starter/installing/)

## 版本发布

- [Angular 22 发布候选版](https://github.com/angular/angular/releases/tag/v22.0.0-rc.0) – 正式版预计 6 月初发布。值得期待的有[基于 Signal 的表单](https://angular.dev/guide/forms/signals/overview)和 [OnPush](https://github.com/angular/angular/discussions/66779) 变更检测策略成为默认。

- [Bun 1.3.14](https://bun.com/blog/bun-v1.3.14) – 这个替代性 JS 运行时获得了 `Bun.Image`、更多 HTTP/2 和 HTTP/3 支持，以及更多 Node 兼容性改进。

- [ESLint Config Inspector 3.0](https://github.com/eslint/config-inspector) – 一个用于检查和理解你的 ESLint 扁平配置的可视化工具。

- [TypeORM 1.0](https://typeorm.io/docs/releases/1.0/release-notes/)、[ESLint 10.4.0](https://eslint.org/blog/2026/05/eslint-v10.4.0-released/)、[Relay 21.0](https://github.com/facebook/relay/releases/tag/v21.0.0)、[Rolldown 1.0.1](https://github.com/rolldown/rolldown/releases/tag/v1.0.1)

## 📖 文章和视频

### 🤖 [Mark Erikson 的智能体配置、工作流和工具](https://blog.isquaredsoftware.com/2026/05/ai-thoughts-part-2-agent-workflow-tools/)

![agent-workflow](@@CDN@@/assets/img/web/JavaScriptWeekly29/img-03.webp)

以维护 Redux 和创建 Redux Toolkit 而闻名的 Mark，深入介绍了他的日常开发工作流，包括他使用 OpenCode（一款开源的 JavaScript 驱动编程智能体）的方式，以及他如何管理知识库、任务等。

*Mark Erikson*

---

### [Clerk API Keys 现已正式发布](https://clerk.com/)

让你的用户创建委托访问你 API 的凭证。通过后端 SDK 进行服务端验证、即时撤销。

*Clerk 赞助*

---

### 📗 [NodeBook: Node.js 内部原理进阶指南](https://github.com/ishtms/learn-nodejs-hard-way)

八个深入章节，帮助你理解 Node.js 内部原理，涵盖事件循环内部机制、V8 的作用、流、模块解析和 async/await 等主题。

*Ishtmeet Singh*

---

### [很快我们就可以终于将 JavaScript 放逐到 ShadowRealm 中](https://matmarquis.com/)

一篇关于正在推进中的 TC39 提案的解读，该提案用于在一个拥有自己全局变量和内置对象的隔离"伪 Realm"中运行 JavaScript。对于第三方代码或任何你希望远离全局作用域的内容来说非常有用。

*Mat Marquis*

---

## 🛠 代码与工具

### [Orval: 从 OpenAPI/Swagger 规范生成类型安全的客户端](https://orval.dev/)

![orval](@@CDN@@/assets/img/web/JavaScriptWeekly29/img-04.webp)

给定一个有效的 OpenAPI v3 或 Swagger v2 规范，为 React、Vue、Svelte、Solid 和 Hono 应用生成模型、请求、Hooks 和 Mock，甚至可以直接生成纯 `fetch` 调用。

*Victor Bury*

---

### [Brownies: 将浏览器存储作为普通对象使用，带变更事件](https://francisco.io/brownies/)

一个微小的 API，覆盖 cookies、localStorage、sessionStorage 和 IndexedDB。类型化值自动保留，并且你可以使用 `subscribe()` 监听变更事件。

*Francisco Presencia*

---

### [查询十亿行数据不应该让你的 API 卡死](https://www.tigerdata.com/timescaledb?utm_source=cooperpress&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

TimescaleDB 扩展了 Postgres，使分析查询在大规模下保持快速。无需管道、无数据漂移。$1000 额度开始使用。

*Tiger Data (TimescaleDB 创建者) 赞助*

---

### 🖼️ [Pica 10.0: 高质量浏览器端图片缩放](https://github.com/nodeca/pica)

高质量的浏览器端图片缩放，基于 WASM 和 Web Workers，必要时回退到纯 JS。v10 是一次现代化重构（2021 年以来首次），添加了 ESM 和分离构建，并迁移到 TypeScript。[GitHub 仓库。](https://github.com/nodeca/pica)

*Vitaly Puzrin*

---

### 🗓️ [SVAR Calendar: 适用于 React、Svelte 和 Vue 的日历组件](https://svar.dev/calendar/)

一个灵活的日历组件，核心采用 MIT 许可，另有扩展商业版本。[这里有开源版本的在线演示。](https://svar.dev/calendar/)

*XB Software Sp.*

---

### [Fate 1.0: 面向 React 的现代数据框架](https://fatejs.dev/)

来自前 Jest 负责人、前 Meta 工程师 Christoph Nakazawa 的全新数据框架。

*Christoph Nakazawa*

---

### [Alien Signals: "最轻量的信号库"](https://github.com/stackblitz/alien-signals)

将 Vue、Preact 和 Svelte 信号方法中最精华的部分提炼为目前最轻量的信号库。其 push-pull 响应式核心调校得如此出色，甚至被合并回了 Vue。

*Johnson Chu*

---

## 📢 生态系统其他动态

### 📋 [JSON Registry：为 JSON 生态带来品牌化实例](https://es.discourse.group/t/jsonregistry-allows-branded-instances-in-regular-json/2569)

![jsonregistry](@@CDN@@/assets/img/web/JavaScriptWeekly29/img-05.webp)

JSON Registry 是一个新兴提案，允许在常规 JSON 中嵌入品牌化/类型化实例，为 JSON 生态系统带来类似注册表的互操作性。

---

*原文链接：[JavaScript Weekly Issue 786](https://javascriptweekly.com/issues/786)*
