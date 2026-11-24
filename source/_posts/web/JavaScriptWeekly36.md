---
title: JavaScript周刊-36
date: 2018-03-30 11:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 793: 2026年7月7日

*与 Meticulous 联合推出*

![vite-plus](@@CDN@@/assets/img/web/JavaScriptWeekly36/img-01.webp)

## [Vite+ Beta：一条命令搞定 Web 开发工具链](https://voidzero.dev/posts/announcing-vite-plus-beta)

Vite+ 是 [Vite](https://vite.dev/) 团队打造的"统一工具链"，将 Vite、Vitest、Oxlint 以及类似工具整合到一条 `vp` 命令下，无论是启动开发服务器、运行测试、格式化代码还是打包构建。

*VoidZero*

> 💡 Vite+ 最初计划作为一个商业项目，为 Vite 及相关项目的开发提供资金支持，但在今年早些时候已以 MIT 许可协议开源。

---

<div style="float:right"><img  src="@@CDN@@/assets/img/web/JavaScriptWeekly36/img-02.webp" width="110" height="110" alt="Meticulous" style="padding-top: 12px; padding-left: 12px;"></div>

## [还在手动编写测试？Meticulous AI 来了](https://www.meticulous.ai/?utm_source=jsweekly&utm_medium=newsletter&utm_campaign=26q3&utm_content=primary)

Notion、Dropbox、Wiz 和 LaunchDarkly 现在都在使用一种他们已离不开的测试范式。由前 Palantir 工程师打造的 Meticulous 能自动创建一套持续演进的端到端 UI 测试套件，无需开发者费心即可提供全面的测试覆盖。

*Meticulous 赞助*

---

## [ECMAScript 2026 有哪些新特性](https://pawelgrzybek.com/whats-new-in-ecmascript-2026/)

长达 876 页的 [ECMAScript 2026 规范](https://ecma-international.org/publications-and-standards/standards/ecma-262/)已于上周获批，本文汇总了本次入选的几项主要新特性，从 `Array.fromAsync` 到原生的 `Uint8Array` Base64/Hex 转换，每项都附带了示例。所有这些特性在浏览器和运行时中均已可用（除了 `Math.sumPrecise` 在 Node 中尚不可用），因此你现在大概就能用上它们。

*Pawel Grzybek*

---

### 简讯

- 🕹️ [js1024 年度 1KB 代码高尔夫大赛现已开放参赛](https://js1024.fun/#2026)。本届主题是"dreaming"，你有 1024 个字节来做出一些酷炫的东西。可以看看[去年的获胜作品](https://js1024.fun/demos/2025/11/bar)感受一下水平。

- [一项 TC39 提案正在推动标准化 `Error` 上的 `code` 属性](https://github.com/tc39/proposal-error-code-property)（长期以来 Node 的事实约定）。提案发起人 James Snell 希望在本月的全体会议上推动其进展。

### 发布

- [vinext 1.0 Beta](https://github.com/cloudflare/vinext) — Cloudflare 的 Vite 插件，重新实现了 Next.js 的 API 接口。
- [webpack-dev-server 6.0](https://github.com/webpack/webpack-dev-server/releases/tag/v6.0.0) — 官方 webpack 开发服务器（带热重载）升级至 Express 5 和原生 ESM。
- [Dependency Cruiser 18.0](https://github.com/sverweij/dependency-cruiser) — 验证和可视化项目依赖关系的工具。
- [npm 11.18.0](https://github.com/npm/cli/releases/tag/v11.18.0)、[pnpm 11.10](https://pnpm.io/blog/releases/11.10)

---

## 📖 文章和视频

### [与 AI 协作：一个具体实例](https://htmx.org/essays/working-with-ai/)

[htmx](https://htmx.org/) 的创建者通过一个使用 Claude 排查 Bug 的实际案例，反思了 AI 在他工作中的角色。他还谈到了 AI 与"年长开发者"之间的关系——这是一个我很少看到有人提及的话题。

*Carson Gross*

---

### [Medal 如何将其 Electron 前端打包体积从 40MB 降至 2.7MB](https://medal.tv/blog/posts/w-key-in-frontend-synergizing-technology-and-product)

一个充满游戏比喻的故事，讲述了如何利用 Vite、Rolldown、代码分割和激进的无用代码消除，将 Electron 应用的打包体积从 40MB+ 削减到 2.7MB。

*Rick Zhang (Medal)*

---

### [使用 Miris 向所有设备流式传输实时 HDR 反射效果](https://www.miris.com/blog/streaming-real-time-hdr-reflections-to-the-web?utm_source=web_referral&mrls=web_referral&utm_medium=public_relations&mrlc=public_relations&utm_campaign=raz-pr&utm_content=sign_up&prg=scale&utm_term=javascript&dp=dp)

Miris 构建了一个 WebXR 汽车配置器，能够在任意设备上实时流式传输 1.2GB 的资源并呈现 HDR 反射效果。

*Miris 赞助*

---

- 📄 [水合与渲染策略指南](https://neciudan.dev/hydration-and-rendering-strategies) — SSR、流式渲染、孤岛架构、可恢复性和 RSC 的全面对比。*Neciu Dan*
- 📄 [无需 GPU 的 WebGL](https://microlink.io/blog/webgl-without-a-gpu) — 测试或截取 WebGL 渲染体验的实用技巧。*Kiko Beats*
- 📄 [理解 TypeScript 的分发条件类型](https://tejasbubane.github.io/posts/2026-07-04-typescript-distributive-union-types/) *Tejas Bubane*

---

## 🛠 代码与工具

![wordgard](@@CDN@@/assets/img/web/JavaScriptWeekly36/img-03.webp)

### [Wordgard：来自 ProseMirror 创建者的全新富文本编辑器库](https://wordgard.net/)

凭借 [Eloquent JavaScript](https://eloquentjavascript.net/) 和 [ProseMirror](https://prosemirror.net/) 两款作品，没有多少人比 Marijn 更了解 JavaScript *和*如何制作优秀的编辑器控件。模块化设计、支持协同编辑、架构深思熟虑。[在线演示](https://wordgard.net/try/) 和 [入门指南](https://wordgard.net/examples/basic/)。

*Marijn Haverbeke*

---

### [Agentfield.ai：面向自主软件开发的 TypeScript 原生 AI 后端](https://agentfield.ai/github/?utm_source=javascript&utm_medium=newsletter&utm_campaign=javascript-260707&utm_id=javascript-260707-github-cta&utm_content=github-cta)

将 AI Agent 编排为类型化 API — 然后组建能够交付生产级 PR 的软件工厂。[开源](https://agentfield.ai/github/?utm_source=javascript&utm_medium=newsletter&utm_campaign=javascript-260707&utm_id=javascript-260707-github-cta&utm_content=github-cta)。

*Agentfield.ai 赞助*

---

### [Astryx：Meta 开源其设计系统](https://astryx.atmeta.com/)

Meta 内部 13,000+ 应用使用的设计系统现已开源，包含 150+ React 组件、主题选项、暗色模式和 CLI 工具链。

*Meta*

---

### [Driver.js v1.6：在应用中展示引导、高亮和上下文帮助](https://driverjs.com/)

一个用于创建页面引导和上下文帮助系统的库。已存在数年之久，维护良好，官网提供了众多演示。

*Kamran Ahmed*

---

### [✉️ Upyo 0.5：跨运行时邮件发送库](https://upyo.org/)

一个统一的类型安全 API，支持从 Node、Deno、Bun 或边缘函数运行时通过 SMTP 和基于 HTTP 的服务商（如 SendGrid 或 Amazon SES）发送邮件。

*Hong Minhee*

---

- 📄 [不再需要用 JavaScript 实现的事情](https://aarontgrogg.github.io/NoLoJS/) — 一份现代 HTML 和 CSS 已能独立处理的模式清单。*Aaron T. Grogg*
- [ESLint Plugin Perfectionist 5.10](https://github.com/azat-io/eslint-plugin-perfectionist) — 当你对对象、导入和类型的排序*极其*讲究时（无论是按字母顺序还是按长度等）。
- [TinyBase 9.0](https://tinybase.org/guides/releases/#v9-0) — 响应式数据存储与同步引擎后端的 Bug 修复和稳定性版本。
- [wavesurfer.js 7.12.10](https://github.com/katspaugh/wavesurfer.js) — 用于音频播放的交互式波形渲染。
- [React Google Maps 1.9](https://visgl.github.io/react-google-maps/) — 将 Google 地图用作响应式组件。

---

## 📢 生态系统其他动态

- 🤖 [Safari 在最新预览版中引入了 MCP Server](https://webkit.org/blog/18136/introducing-the-safari-mcp-server-for-web-developers/)，为 AI Agent 提供了连接 Safari 窗口并在调试时模拟用户体验的途径。

- [`shadcn/ui` 已切换至 Base UI 作为其默认组件库](https://ui.shadcn.com/docs/changelog)（此前为 Radix）。Radix 并不会消失，但[Base UI](https://base-ui.com/) 被推荐用于新项目。

- [PocketJS](https://pocketjs.dev/) 是一个将 JavaScript 虚拟机、Vue Vapor 和 Solid UI 塞进 8MB 内存预算的项目，有趣的是，它可以在索尼 PSP 上运行，同时也支持 WASM 和 macOS 原生运行。

- 📈 [Commit History](https://commit-history.com/) 是一个在线工具，能够根据 GitHub 用户的提交记录生成随时间变化的图表。非常适合添加到你 [GitHub Profile README](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme) 中——不妨看看 [Sindre Sorhus 的图表](https://commit-history.com/sindresorhus)，感受一下这位传奇维护者多年来始终如一的提交记录。

- 🎉 [PGlite](https://pglite.dev/)，一个用于 JavaScript 环境的 Postgres WebAssembly 构建，[其每周下载量突破 1000 万次](https://electric.ax/blog/2026/06/25/pglite-reaches-10-million-weekly-downloads)，文章同时介绍了使用场景以及如何亲自上手使用。

---

*原文链接：[JavaScript Weekly Issue 793](https://javascriptweekly.com/issues/793)*
