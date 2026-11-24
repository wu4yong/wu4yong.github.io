---
title: JavaScript周刊-49
date: 2018-04-04 02:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 806: 2026年10月13日

*与 agentfield.ai 联合推出*

## [Deno 将加入 Cloudflare（但是……）](https://deno.com/blog/cloudflare)

![m1xxxsvconnhew26d4uh](@@CDN@@/assets/img/web/JavaScriptWeekly49/img-01.webp)

也许 David Bushell [早就看出了不祥之兆](https://dbushell.com/2026/10/03/deno-to-node/)：Deno 团队加入 Cloudflare 并不是为了继续开发 *Deno*，而是要把 [celld](https://celld.dev/) 并入 `workerd`，从而让 Durable Objects 可以自托管（[更多内容见此](https://blog.cloudflare.com/deno-joins-cloudflare/)）。Deno 运行时还将获得最后一年的官方修复支持，Deno Deploy 将在六个月后关闭，而 [JSR](https://jsr.io/) 将迁移到 Cloudflare 的基础设施。

*Ryan Dahl*

💡 在 [Hacker News](https://news.ycombinator.com/item?id=50023277) 上，Ryan Dahl 指出 Deno *"已被卷入 Node 兼容性的引力井"*，并反问道：*"为什么要重新实现 Node？它本来就能用。"* 不过我不禁想问，[JavaScript™ 商标案](https://javascript.tm/)又会怎样呢……？

<div style="float:right"><img  src="@@CDN@@/assets/img/web/JavaScriptWeekly49/img-02.webp" width="140" height="140" alt="AgentField AI" style="padding-top: 12px; padding-left: 12px;"></div>

## [CodeAF：DeepSWE 十大编程 Harness 中的第一名](https://agentfield.ai/github/codeaf/?utm_source=javascript&utm_medium=newsletter&utm_campaign=javascript-261013&utm_id=javascript-261013-codeaf&utm_content=codeaf)

十个编程 harness 用同一个开放模型处理了 113 个真实的 GitHub issue。CodeAF 解决的问题最多，每个已解决 issue 的花费却最低：比 Claude Code 低 3.4 倍，比 OpenCode 低 4.8 倍。一个为开放模型打造的全新开源编程 harness。

*AgentField AI 赞助*

## [Bun 1.4.3 新增 `bun check`：内置的 TypeScript 类型检查器](https://bun.com/blog/bun-v1.4.3)

`bun check` 是 TypeScript 7 检查器的移植版，它会读取你的 `tsconfig.json`，报告与 `tsc` 相同的错误，而且据 Jarred 称运行速度快 3-6 倍。它还能接入 `bun run`/`test`/`build`。空闲的服务器进程现在占用的 CPU 大幅减少，JavaScriptCore 的升级也带来了[大量性能提升](https://bun.com/blog/bun-v1.4.3#javascriptcore-upgrade)。

*Jarred Sumner*

### 简讯

- AWS 推出了 [Lambda Web Functions](https://aws.amazon.com/blogs/aws/announcing-aws-lambda-web-functions-for-fast-consistent-web-app-performance-anywhere/)，它可以在 Lambda 上运行普通的监听端口的 Node 服务器（Express、Hono、Fastify 等），无需重写 handler，并按活跃 CPU 时间和内存分别计费。

- 📊 [2026 年 Stack Overflow 开发者调查结果](https://survey.stackoverflow.co/2026)已出炉（共有 30,903 人参与），JavaScript 连续第 12 年成为第一语言（TypeScript 位列第 6）。

- 🔒 尽管本周[又掀起波澜](https://news.ycombinator.com/item?id=50052814)，但并没有任何恶意的 Zod 版本进入 npm。[9 月推送到其仓库的恶意提交](https://github.com/colinhacks/zod/releases/tag/v4.6.6)当天就被回滚了，[Colin McDonnell 对此作了解释](https://news.ycombinator.com/item?id=50057591)。

- 🔒 [Next.js 将于明天发布一次非常规的安全更新](https://nextjs.org/blog/upcoming-nextjs-security-update-october-2026)。

### 版本发布

- **最后时刻补充：**[TanStack Start 1.0](https://tanstack.com/blog/tanstack-start-1-0) 刚刚发布。对全栈 React 和 Solid 爱好者来说是大新闻！ :-)

- 🎉 [Partytown 1.0](https://partytown.qwik.dev/) – 一种流行的将第三方脚本迁移到 Web Worker 中运行（而非主线程）的方案，在开发五年后终于结束 beta。

- [Marionette 5.0](https://marionettejs.com/news/introducing-marionette-5/) – 六年之后，这个 Backbone 时代的框架回归，核心不再依赖 Backbone、jQuery 和 Underscore……而且他们解释了原因！

- [Bootstrap 6 Alpha](https://blog.getbootstrap.com/2026/10/08/bootstrap-6-alpha/) – 抢先一睹 Bootstrap 自 2021 年以来的首个大版本：依托现代 CSS，并让其 JavaScript 插件仅支持 ESM。

- [Express 5.3.0](https://github.com/expressjs/express/releases/tag/v5.3.0) – 一个值得升级的维护版本，修补后的 `qs`、`proxy-addr` 和 `body-parser` 依赖修复了五个 CVE。

## 📖 文章和视频

### 📊 [JavaScript 中的 WebSocket 服务器：Node.js、Bun 和 Deno](https://lemire.me/blog/2026/10/10/websocket-servers-in-javascript-node-js-bun-and-deno-in-2026/)

![gacrsvr1mipjqdooocro](@@CDN@@/assets/img/web/JavaScriptWeekly49/img-03.webp)

2023 年，Daniel [发现 Bun 在转发 WebSocket 消息方面比 Node 快得多](https://lemire.me/blog/2023/11/25/a-simple-websocket-benchmark-in-javascript-node-js-versus-bun/)，但他的 Bun 服务器里有个 bug。这次新的尝试以 C 客户端/中继作为基准，Node 26 现在的延迟已接近 C，领先于 Bun 和 Deno。

*Daniel Lemire*

---

### [Sindre Sorhus 的个人网站如今用 Swift 构建](https://sindresorhus.com/blog/swift-website)

JavaScript 最多产的开发者之一讲述了他如何弃用 Astro，改用 Swift 构建个人网站——包括样式和标记——让失效链接和样式拼写错误在编译时就报错（[源码](https://github.com/sindresorhus/sindresorhus.github.com)）。

*Sindre Sorhus*

---

### [智能体追踪太多读不完？10 月 14 日直播，找出真正重要的那些](https://sentry.io/resources/agent-tracing-series/?utm_source=javascriptweekly&utm_medium=paid-community&utm_campaign=agenttracing-fy27q3-agenttracingseries&utm_content=newsletter-sponsored-link-workshop-2-register)

糟糕的回答、错误的工具调用、过多的追踪记录。看看 Sentry 工程师如何找出值得修复的故障。[立即注册](https://sentry.io/resources/agent-tracing-series/?utm_source=javascriptweekly&utm_medium=paid-community&utm_campaign=agenttracing-fy27q3-agenttracingseries&utm_content=newsletter-sponsored-link-workshop-2-register)。

*Sentry 赞助*

---

### [用 TinyJS 打造迷你应用](https://www.raymondcamden.com/2026/10/08/tiny-apps-with-tinyjs)

快速看一看[几周前我们介绍过](https://tinyjs.app/)的一种制作 JS 驱动迷你桌面应用的新方式。

*Raymond Camden*

---

### 📄 [又一种不用括号调用函数的方法](https://blog.ikaes.de/yet-another-way-to-invoke-functions-without-parentheses/)

在 JavaScript 中，不用括号调用任意函数的方法有很多，但这一种尤其冷门！

*bartosz*

---

### 📄 [用 Remix 3 构建应用的六个月](https://sergiodxa.com/articles/the-remix-way)

聊聊后 React 时代的 Remix（v3 已于本月早些时候发布）在日常开发中的体验。

*Sergio Xalambrí*

---

### 📄 [React 父子树与所有者树的可视化记法](https://julesblom.com/writing/react-visual-notation)

附带一个可从你的代码中绘制这些树的[演练场](https://julesblom.com/react-trees)。

*Jules Blom*

---

### 📄 [如何测试 `iframe` 的 `postMessage` 处理器](https://blog.master.dev/testing-an-iframes-postmessage-handler/)

*Keshav Malik*

## 🛠 代码与工具

### 🤖 [OpenCode 2.0：开放编程智能体的一次大更新](https://anoma.ly/notes/opencode-2-0/)

![yyyvmcrgd42zwknefp1s](@@CDN@@/assets/img/web/JavaScriptWeekly49/img-04.webp)

一个基于 Bun 构建的全功能智能体编程应用，比起 [Pi](https://github.com/earendil-works/pi)，它更像是 Claude Code。v2.0 进行了全面改造：后台子智能体、让模型用脚本调用 MCP 工具的"代码模式"，以及用于驱动它的原生 JS 客户端和 Effect 客户端。

*Anomaly / The OpenCode Team*

💡 如果你还没试过 OpenCode，可以从[这里开始](https://opencode.ai/)。

---

### [Tamagui 3：一套 React UI 代码库，同时用于 Web 和原生](https://tamagui.dev/blog/version-three)

一个样式系统和组件套件，可在 React Web 应用与 React Native 之间共享 UI，其编译器让两端都保持快速。v3 新增了 Tailwind 风格的 props 和对 React Strict DOM 的支持。

*Nate Wienert*

---

### [为使用智能体编程的 Web 开发者打造的移动 AI 基础设施](https://try.expo.dev/3VoRZKA)

把你用于 Web 的智能体指向 iOS 和 Android。Expo 负责原生构建以及上架应用商店的全过程。

*Expo 赞助*

---

### [H3 v2：基于 Web 标准重建的 UnJS HTTP 框架](https://h3.dev/blog/v2)

Nitro 和 Nuxt 服务器层背后的极简 HTTP 框架 v2 现已稳定，这是一次围绕标准 `Request` 和 `Response` 的重写，使同一个应用可以运行在 Node、Bun、Deno、Workers，甚至浏览器中。[迁移指南](https://h3.dev/migration)。

*Pooya Parsa*

---

### [Shaders：190 多个 WebGPU 特效组件现已开源](https://shaders.com/updates/shaders-is-open-source)

涟漪、辉光，以及溶解为 ASCII 的效果——以组件方式组合，而不是手写 shader 代码，适用于 React、Vue、Svelte、Solid 或原生 JS。引擎、框架绑定以及[组件本身](https://shaders.com/docs/components)现在全部采用 MIT 许可。

*Simon Le Marchant*

💡 如果你喜欢这种风格，提供*"236 个用于网页的动画 ASCII 作品"*的 [ascii.rest](https://ascii.rest/)也值得一看。

### 版本发布

- [Node.js v26.11.0 (Current)](https://nodejs.org/en/blog/release/v26.11.0) – 新增 `--process-timeout` 标志，可在设定时间后结束进程，并为 `node:sqlite` 增加虚拟表支持。

- [Hono 5.0 RC](https://hono.dev/docs/guides/migrating-to-v5) – 这个基于 Web 标准的服务器框架转为仅 ESM，并将运行时适配器移入独立的包。

- 🔒 [Handlebars 4.7.10](https://github.com/handlebars-lang/handlebars.js/releases/tag/v4.7.10) – 这个模板库修复了两个严重的 JavaScript 注入漏洞，影响可追溯至 3.0 的版本。

- [he 2.0](https://github.com/mathiasbynens/he) – 健壮的 HTML 实体编码/解码库。八年来的首个版本，现在为 ESM 并支持命名导出。

- [React Aria 1.22](https://react-aria.adobe.com/releases/v1-22-0) – 新增 [Sheet 组件](https://react-aria.adobe.com/Sheet)。

- [pnpm 12.12](https://pnpm.io/blog/releases/12.12.0)

## 📢 生态系统其他动态

- 在 [Fingerprints are the New Cookies](https://royfish.dev/fingerprints-are-the-new-cookies) 一文中，Roy Fish 演示了网页利用 JavaScript 为你分配一个（大致）唯一身份的种种方式。

- 🤖 Theo Browne 让 AI 智能体放手把 TypeScript 7 编译器移植到 Rust，成果就是（非常实验性的）[ts-rust](https://github.com/pingdotgg/ts-rust)。

- 📱 继 Shopify 之后，[Coinbase 正在将其应用从 React Native 迁出](https://www.linkedin.com/posts/adamawolf_senior-software-engineer-native-mobile-activity-7511201803389186048-JV6b)，称智能体让"每个功能构建两次"变得足够便宜，因此完全可以转向纯原生。

- 想在网页体验中加入复古机器人语音？[Klattsch](https://crashunited.itch.io/klattsch/devlog/1580425/klattsch-engine-is-free-software-put-it-in-your-game) 是一个语音合成器，可在 Web 中使用，也可作为 npm 包在 Node.js 中使用。*Daiiisy, daiiisy…*

- 三年前我们提到过 Linus Groh 用 Zig 编写的 [Kiesel](https://kiesel.dev/) JavaScript 引擎。当时它通过了 25% 的 test262 测试，而如今 [v0.4.0 已经发布](https://linus.dev/posts/kiesel-devlog-15/)，通过率达到 94.7%（与 V8 相差不远），并支持 await dictionary 和众多 iterator 提案等现代语言提案。

*原文链接：[JavaScript Weekly Issue 806](https://javascriptweekly.com/issues/806)*
