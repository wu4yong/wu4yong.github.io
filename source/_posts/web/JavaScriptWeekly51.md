---
title: JavaScript周刊-51
date: 2018-04-04 21:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 808: 2026年10月27日

*与 Meticulous 联合推出*

![d78ifnbyoegacu1b82sf](@@CDN@@/assets/img/web/JavaScriptWeekly51/img-01.webp)

## [TanStack AI 1.0：厂商中立的 AI 工具包正式稳定](https://tanstack.com/blog/tanstack-ai-1-0)

TanStack 的框架无关 AI 工具包达到 1.0，为聊天、工具和媒体提供稳定 API，并包含 23 个提供商适配器。[新的 Agent harness](https://tanstack.com/blog/tanstack-ai-1-0#one-more-thing-the-agent-harness) 支持长时间运行的会话，但其 API 仍属实验性。

*Tuzlak、Herrington 等（TanStack）*

<div style="float:right"><img  src="@@CDN@@/assets/img/web/JavaScriptWeekly51/img-02.webp" width="140" height="140" alt="Meticulous" style="padding-top: 12px; padding-left: 12px;"></div>

## [你会让 AI Agent 给自己的作业打分吗？](https://www.meticulous.ai/?utm_source=javascript_weekly&utm_medium=newsletter&utm_campaign=26q3_1&utm_term=primary+content)

Agent 编写代码的速度前所未有，甚至会审查自己的工作。但谁来审查它们？Dropbox、Notion 和 ElevenLabs 不愿冒这个险。借助 Meticulous，每项变更都会经过详尽验证，而开发者无需付出任何精力。

*Meticulous 赞助*

## [TypeScript 7.1 Beta 发布](https://devblogs.microsoft.com/typescript/announcing-typescript-7-1-beta/)

TypeScript 7 新增了[编程式 API](https://devblogs.microsoft.com/typescript/announcing-typescript-7-1-beta/#typescript-7.1-api)，以及“内容映射器”（content mappers）——一个用于检查 Vue、Svelte 和 Astro 等组件文件中嵌入代码的插件点。此外还新增了[源阶段导入（source phase imports）](https://devblogs.microsoft.com/typescript/announcing-typescript-7-1-beta/#source-phase-imports)和 `--target es2026`。

*Daniel Rosenwasser（Microsoft）*

## [GTA.js：1997 年的《侠盗猎车手》，但用 JavaScript 写成](https://www.bram.us/2026/10/22/gta-js/)

Bramus 一直在用 JavaScript 和 WebGL 重新实现原版俯视角 GTA 的引擎，并从游戏最初的演示文件中加载自由城。[在这里试玩](https://gtajs.wtf/)。

*Bramus Van Damme*

💡 很巧的是，Pat Kerr 在 1996 年制作的 Atari ST 原型奠定了原版游戏车辆物理的基础，他最近也[用 JavaScript 重建了它](https://patkerr.co.uk/2d-vehicles/)。

### 简讯

- Deno 的 Bartek Iwańczuk 表示，团队正在[推动 Deno 加入某个基金会](https://github.com/denoland/deno/issues/37030#issuecomment-6310897867)。与此同时，一个新的分支 [Ende](https://ende.sh/) 计划放弃 Node 兼容性，重新聚焦于沙箱化。

- [Safari 27.1 预览了 Device Posture 和 Viewport Segments API](https://webkit.org/blog/18486/webkit-features-for-safari-27-1/)，这些功能以特性开关形式在 iPhone Duo 上提供，让 JavaScript 能够检测折叠并检查屏幕分段。

- [Chrome 156 已进入稳定版](https://chromestatus.com/release-notes/156)，不再缓存模块获取失败，因此因网络或 HTTP 错误而失败的动态 `import()` 可以重试。

### 版本发布

- [Node.js v26.12.1（Current）](https://nodejs.org/en/blog/release/v26.12.1)、[v24.22.1（LTS）](https://nodejs.org/en/blog/release/v24.22.1) 和 [v22.23.4](https://nodejs.org/en/blog/release/v22.23.4) – 安全版本，修复十个 CVE，其中包括 [“Node2Shell” Brotli 解码器漏洞](https://ellio.tech/en/blog/node2shell-cve-2026-111497-rce-on-stock-nodejs-builds/)，应用解压恶意数据时可能导致远程代码执行。（另外，Node 26 将于明天成为 LTS。）

- [Bun 1.4.4](https://bun.com/blog/bun-v1.4.4) – 新增 `bun fmt`，这是一个兼容 Prettier 的格式化工具，会使用你现有的 Prettier 或 oxfmt 配置。它*非常快*。

- [Electron 45](https://www.electronjs.org/blog/electron-45-0) – 升级到 Chromium 156、Node 24.22 和 V8 15.6，并新增 [Prompt API](https://developer.chrome.com/docs/ai/prompt-api) 的 Hook，让应用可以接入本地模型。

- [pnpm 12.16](https://pnpm.io/blog/releases/12.16.0)、[Remix 3.1](https://github.com/remix-run/remix/releases/tag/remix%403.1.0)、[axios 1.21](https://github.com/axios/axios/releases/tag/v1.21.0)、[Deno 2.9.8](https://github.com/denoland/deno/releases/tag/v2.9.8)

## 📖 文章和视频

### [用 TypeScript 从零构建解析器组合子](https://t3.at/blog/parser-combinators/)

解析器组合子介于正则表达式和 tree-sitter 等重量级工具之间。这篇带交互动画的分步教程展示了构建它们的基本要素，最后以一个将 `ping` 输出转换为类型化对象的示例收尾。

*Florian Schindler*

---

### [死代码不该存在：Sentry 如何削减 28,000 行](https://tkdodo.eu/blog/dead-code-shouldnt-exist)

这是 Dominik 今年在六个会议上做过的演讲，现在变成了可滑动浏览的幻灯片，并附有完整文字稿。他讲述了未使用代码的代价可能比你想象中更高，以及 Sentry 如何用 [Knip](https://knip.dev/) 删除了 28,000 行代码。

*Dominik Dorfmeister（Sentry）*

---

### [AI.js Day 2026：前端最令人恐惧的 AI 问题，11 月 13 日在 Channel 13 直播](https://lp.jetbrains.com/ai-js-day-2026/?utm_source=newsletter_js_weekly&utm_medium=cpc&utm_campaign=webstorm_javascript_day_2026_js_weekly)

没有炒作，只有前端开发者不敢问的 AI 问题。[立即报名](https://lp.jetbrains.com/ai-js-day-2026/?utm_source=newsletter_js_weekly&utm_medium=cpc&utm_campaign=webstorm_javascript_day_2026_js_weekly)。

*JetBrains 赞助*

---

### [为 AI 生成的 HTML 构建隔离预览](https://blog.master.dev/building-an-isolated-preview-for-ai-generated-html/)

在 `srcdoc` iframe 中渲染模型编写的 HTML，会让它在你自己的源（origin）上运行。一位安全工程师先攻破了这种朴素做法，再用 `sandbox` 和严格的 CSP 重建，并通过演示展示每项措施拦截了什么。

*Keshav Malik*

---

### [初探 TypeScript 7.1 的内容映射器](https://jovidecroock.com/blog/typescript-7-content-mappers/)

TypeScript 7 会忽略 tsserver 插件，但 7.1 的内容映射器可以将非 TS 文件转换为 TypeScript。本文介绍其工作原理，并应用于 CSS modules 和 `.graphql` 文件。

*Jovi De Croock*

---

### [引擎如何将动态对象转化为快速字段访问](https://bernsteinbear.com/blog/object-shapes/)

用可运行的示意图解释 Shapes 和 inline caches。

*Max Bernstein*

---

### [软件慢是因为设计差，而不是语言慢](https://seangoedecke.com/software-is-slow-because-of-bad-design-not-slow-languages/)

*Sean Goedecke（GitHub）*

## 🛠 代码与工具

### [Structs：TC39 的共享结构体提案，但现在就能用](https://structs.arv.tools/)

![lvhon6ibgjv0prddvf5z](@@CDN@@/assets/img/web/JavaScriptWeekly51/img-03.webp)

一位前 TC39 代表对 Stage 2 [structs 提案](https://github.com/tc39/proposal-structs)的实现。其思路是让 Worker 之间共享内存，这样多个线程可以直接处理同一批对象，而无需来回序列化副本。这里还有一个 [Playground](https://structs.arv.tools/playground/)。

*Erik Arvidsson*

---

### [推出 TanStack Redact：更精简的 React 运行时](https://tanstack.com/blog/introducing-tanstack-redact)

一个构建插件，可在无需修改代码的情况下，用更小的浏览器端实现替换 React 和 React DOM。它适用于 Vite、Start、Vinext 和 Next.js；TanStack 声称客户端构建体积可缩小 20–70%，但渲染*仅支持同步*。

*Tanner Linsley（TanStack）*

---

### [能捕获真实 Bug 的 AI 测试](https://wallabyjs.com/ai/?utm_source=cooperpress&utm_medium=javascriptweekly&utm_content=javascriptweekly)

AI 可能写出价值不高、没检查多少内容却能通过的测试。Wallaby 帮助你的 Agent 改进断言并捕获真实 Bug。

*Wallaby 团队赞助*

---

### [Verdaccio 7.0：自托管 npm Registry 新增分阶段发布与 2FA](https://github.com/verdaccio/verdaccio/releases/tag/v7.0.0)

一种成熟、轻量的方式，用于自托管 npm registry 和代理。v7 新增实验性的分阶段发布（新版本上线前需要审批）和 2FA，以及更严格的归属检查。

*Verdaccio 团队*

---

### [Biome 2.6 新增 Markdown、YAML 与 SCSS 支持](https://biomejs.dev/blog/biome-v2-6/)

这个由 Rust 驱动的 Prettier 和 ESLint 替代品新增了对 Markdown、YAML 和 SCSS 的格式化支持，以及初步的 lint 支持。用于自定义 lint 规则的 JavaScript 插件已作为开发者预览版提供。

*Biome 核心团队*

### 版本发布

- ☕ [CoffeeScript 2.7.1](https://github.com/jashkenas/coffeescript/releases/tag/2.7.1) – 四年半以来的首个版本，带来 Node 22+ 修复以及 `with { type: 'json' }` 导入属性。

  > 💡 如果你从未用过 [CoffeeScript](https://coffeescript.org/)，它是一门（或曾经是一门）带有 Ruby 和 Python 风格、编译为 JavaScript 的语言。[Brendan Eich 曾将其箭头函数和轻量类](https://brendaneich.com/2011/05/my-jsconf-us-presentation/)视为 ES6（ES2015）设计的范本。

- [oxlint 1.89](https://github.com/oxc-project/oxc/releases/tag/oxlint_v1.89.0) – 这个基于 Rust 的 linter 现在会把其 React、Vue、Next.js、Jest/Vitest 等插件的上游推荐规则计入“推荐”规则，因此升级后可能会看到更多报告。

- [Mutative 2.0](https://mutative.js.org/blog/releases/2.0/) – Immer 风格的高效不可变更新库。作者称在一套基准测试中比 Immer 快 3.6 倍。

- [SonicJS 3.0](https://github.com/SonicJs-Org/sonicjs/releases/tag/v3.0.0) – 面向 Cloudflare Workers、基于 Hono 的无头 CMS。v3 重建了数据层、认证和插件系统。[主页](https://sonicjs.com/)。

- [query-string 10.0](https://github.com/sindresorhus/query-string) – 解析和序列化 URL 查询字符串。[现在会对无法表示的值抛出错误](https://github.com/sindresorhus/query-string/releases/tag/v10.0.0)。

- [ShareDB 7.0](https://github.com/share/sharedb) – 基于操作变换的实时数据库后端。

## 📢 生态系统其他动态

- 🔒 **Node2Shell：** [ELLIO 现在报告称已出现实际的在野攻击流量](https://ellio.tech/en/blog/node2shell-cve-2026-111497-rce-on-stock-nodejs-builds/)，针对的是 Node 版本中修复的 Brotli RCE（如前所述）。该漏洞位于 Google 的 Brotli 库中，因此[其他地方打包的副本也需要修补](https://socket.dev/blog/emudhra-brotli-security-fix)。

- Sentry 今年已[向开源维护者捐赠 100 万美元](https://blog.sentry.io/another-year-another-1-000-000-to-open-source-maintainers/)。JavaScript 领域的受赠者包括 pnpm、TanStack、MSW、Knip 和三位 Three.js 维护者，以及 OpenJS Foundation。

- 🎉 [CSS-Tricks 这个广受欢迎的 Web 开发资源重新独立](https://css-tricks.com/css-tricks-has-a-new-owner/)，现在归其长期编辑 Geoff Graham 所有。

- Arc 这款受开发者欢迎、设计导向的 Chromium 浏览器[即将停止服务](https://arc.net/)，The Browser Company 正引导所有人转向 [Dia](https://www.diabrowser.com/)。

- 📄 Google Docs [现在可以原生打开、编辑和协作处理 Markdown 文件](https://developers.googleblog.com/preview-edit-and-collaborate-on-markdown-md-files-natively-in-google-docs-and-drive/)，Drive 也会渲染它们的预览。

*原文链接：[JavaScript Weekly Issue 808](https://javascriptweekly.com/issues/808)*
