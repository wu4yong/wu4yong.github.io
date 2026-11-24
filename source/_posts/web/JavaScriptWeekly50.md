---
title: JavaScript周刊-50
date: 2018-04-04 14:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 807: 2026年10月20日

*与 Svix 联合推出*

![nuezexh7haulvsllbugt](@@CDN@@/assets/img/web/JavaScriptWeekly50/img-01.webp)

## [tsrs：Cloudflare 与 VoidZero 打造的 TypeScript Rust 移植版](https://blog.cloudflare.com/typescript-rust-port/)

这是一个将基于 Go 的 TypeScript 7 编译器移植到 Rust 的项目，构建过程中[得到了 TypeScript 团队的一些意见](https://news.ycombinator.com/item?id=50167925)，并将进入 [Oxc](https://oxc.rs/)。基准测试声称其速度最高可达 TypeScript 7.0 的 8 倍，而且可以运行在 WebAssembly 中。目前仍是实验性项目，但 `npx tsrs` 已经可用。

*Chen、Mitropoulos 与 Nakazawa（Cloudflare / VoidZero）*

💡 Max Schwenk 启动了这次移植，最初由 Agent 编写代码；他[在这里讲述了完整故事](https://building.owner.com/tsrs)，包括如何将公司的类型检查时间从 80 秒缩短到 7 秒。

<div style="float:right"><img  src="@@CDN@@/assets/img/web/JavaScriptWeekly50/img-02.webp" width="140" height="140" alt="Svix" style="padding-top: 12px; padding-left: 12px;"></div>

## [几分钟内从你的 TypeScript API 发送 Webhook](https://link.svix.com/cooper-p-01)

一个带类型的 npm 包，每个事件只需一次调用。Svix 负责重试、签名、投递日志，以及面向客户的门户，你无需自行构建这些。Resend 每年通过它发送超过 2 亿个 Webhook。

*Svix 赞助*

## [谢谢你，Deno：竞争推动 JavaScript 不断前进](https://www.vlt.io/blog/competition-keeps-javascript-moving)

上周我们报道了 [Deno 加入 Cloudflare](https://deno.com/blog/cloudflare) 以及 Deno 运行时的未来。Darcy 表示，Deno 很有价值，因为它（以及 Bun）推动 Node 和 npm 采纳其最佳创意，让整个生态变得更好。

*Darcy Clarke（vlt）*

### 简讯

- 🔒 [Next.js 已修复两个严重 RCE 漏洞](https://nextjs.org/blog/nextjs-security-update-october-14-2026)：一个位于 `use cache` 函数中，源于[上游 React Server Components 的 Bug](https://github.com/react/react/security/advisories/GHSA-xqc2-xf4c-x3h3)；另一个位于图片优化器的 SVG 处理逻辑中。请升级到 16.4.1 或 15.5.28；[公开 PoC](https://hash-sec.com/blog/the-use-cache-rce-how-a-typed-array-bug-in-nextjs-became-remote-code-execution) 已经发布。

- 🔒 [Node.js 安全版本将于明天发布](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)，覆盖 26.x、24.x 和 22.x 版本线，其中最高严重级别为“高”。

- Bun 的 JavaScript 提前编译功能[几周前已预览](https://x.com/jarredsumner/status/2104739495895781679)，现在又有[一份 PR 草案](https://github.com/oven-sh/bun/pull/45631)，可生成不含 JIT 或字节码的二进制文件。

### 版本发布

- [Node.js v26.12.0（Current）](https://nodejs.org/en/blog/release/v26.12.0) 和 [v24.22.0（LTS）](https://nodejs.org/en/blog/release/v24.22.0) – 26.12 现在可以同步加载大多数 ES 模块，并将配置文件标记为稳定；24.22 新增了 `util.throttle` 和 `util.debounce`。

- [Astro 7.4](https://astro.build/blog/astro-740/) – 为 `astro build` 新增 `--timings` 参数，可查看构建时间花在哪里；此外还加入了跨 Worker 线程并行预渲染的实验性支持。

- [React Router 8.5](https://reactrouter.com/changelog#v850) – 废弃自身的 View Transition API，改用 React 的 `<ViewTransition>` 组件，并新增实验性的“仅 API”模式。

- [Pretext 1.0](https://github.com/chenglou/pretext/releases/tag/v1.0.0) – 无需操作 DOM 的多行文本布局。1.0 移植了浏览器自身的换行算法，因此结果更接近实际渲染。

- [React Native 0.88](https://reactnative.dev/blog/2026/10/19/react-native-0.88)、[Elysia 2.0 RC](https://next.elysiajs.com/blog/elysia-20-rc/)、[ESLint 10.13](https://eslint.org/blog/2026/10/eslint-v10.13.0-released/)、[tsup 9.0](https://github.com/egoist/tsup/releases/tag/v9.0.0)、[Vuetify 4.3](https://github.com/vuetifyjs/vuetify/releases/tag/v4.3.0)

## 📖 文章和视频

### [当 Prettier 格式化后，那段俄罗斯方块脚本竟变成了《贪吃蛇》？](https://trustsig.eu/blog/javascript-divergence/)

你可能会以为美化工具和反混淆器至少不会改变脚本的*逻辑*，但事实并非如此。看看这些工具中一连串语义怪癖如何把“清理后”的输出变成另一个程序！

*Robert Vähhi（TrustSig）*

---

### [如果没人写 Web Components，它们还有未来吗？](https://nolanlawson.com/2026/10/19/do-web-components-have-a-future-if-nobody-is-writing-them/)

Nolan 多年来一直构建并捍卫 Web Components，因此这篇思考深入、略带忧伤的文章颇具分量。

*Nolan Lawson*

---

### [你的 CI 是为人类构建的，而你的 Agent 需要别的东西](https://try.expo.dev/3VoRZKA)

Expo 是移动端的 AI 基础设施。你的 Agent 可以在后台构建、测试并发布 iOS 和 Android 应用。

*Expo 赞助*

---

### [▶ ViteConf 2026：完整回放](https://www.youtube.com/watch?v=PfyIEgLzNYI)

上周的 ViteConf 带来了约 30 场演讲，包括 Evan You 关于 Agent 时代工具链的主题演讲，以及 Vitest 5、Vite DevTools 和 Oxc 即将推出的更快解析器的更新。视频长达 10 小时，但评论区有一个带时间戳的导航。

*ViteConf*

💡 更重磅的公告之一：[Vite 团队的全栈 SDK 与部署平台 Void 现已开源](https://blog.cloudflare.com/deploy-with-void/)。

---

### [如何用 Proxy 糊弄 JavaScript 程序员](https://www.bryanpg.com/articles/pragma-twice/proxy.html)

`Proxy` 最初作为 ES6 的一部分引入，有许多实际用途，也能让对象表现出古怪、出人意料的行为。文中配有可直接编辑的实时示例。

*Bryan Gillespie*

---

### [Miro 如何将 70,000 个测试从 Jest 迁移到 Vitest](https://nothing-else.blog/blog/we-migrated-70000-tests-from-jest-to-vitest-yes-in-2-months)

这是一个在拥有 800 个包的 monorepo 中，将约 70,000 个测试迁移到 Vitest 的故事；大部分繁琐工作由 AI Agent 完成。

*Sergey Nikitin*

---

### [升级到 Zod 4 后，我们的 Worker CPU 占用减少了三分之一](https://trigger.dev/blog/zod-4-got-rid-of-a-bunch-of-cpus-for-us)

一次每天处理 1 亿次解析的 Zod 3 到 4.5 迁移。

*Chris Arderne*

---

### [将 `replace()` 用作迭代器](https://www.lazutkin.com/blog/2026-10-13-replace-as-an-iterator)

一种古老的、通过正则回调执行副作用的惯用写法，并与替代方案进行了基准测试。

*Eugene Lazutkin*

---

### [递归已死，是 HTML 杀死了它](https://daverupert.com/2026/10/html-recursion/)

动手体验 Chromium 实验性的[声明式局部更新（Declarative Partial Updates）](https://developer.chrome.com/docs/web-platform/declarative-partial-updates)提案。

*Dave Rupert*

---

### [📺 NightMonkey：将 JavaScript 提前编译为 WebAssembly](https://vimeo.com/1234257957)

来自一位 Wasmtime 工程师、在 VMIL 2026 上的一小时演讲。

*Chris Fallin*

## 🛠 代码与工具

### [Maplair：功能齐全、可 Tree-Shake 的 Leaflet 分支](https://maplair.org/2026/10/19/maplair-4.0.0.html)

![ywzqx0owlyt7kwf7wgrk](@@CDN@@/assets/img/web/JavaScriptWeekly50/img-03.webp)

这个项目去年以来一直处于 alpha 阶段。Leaflet 的一位贡献者将其 fork，并整合了 2.0 的工作，以及旋转、全屏、搜索、热力图等功能，而且全部可 Tree-Shake。

*Simon Legner*

💡 同一天，Leaflet 的创建者[发布了一篇坦诚的更新](https://github.com/Leaflet/Leaflet/issues/10435)，讲述他在乌克兰的生活经历，以及发布 Leaflet 2.0 的计划。

---

### [面向用户和 AI 的可嵌入 DOCX、XLSX 与 PPTX 编辑器](https://playground.developers.thinkfree.com/playground/editor-ai-sdk/?utm_source=jsweekly&utm_medium=newsletter&utm_campaign=sdklaunch2026&utm_content=261020)

让 AI 通过对象级 API 编辑现有文件。用户可以审阅并继续编辑同一个文件。[试用 Playground](https://playground.developers.thinkfree.com/playground/editor-ai-sdk/?utm_source=jsweekly&utm_medium=newsletter&utm_campaign=sdklaunch2026&utm_content=261110)。

*Thinkfree 赞助*

---

### [📊 Chartist 2.0：轻量级 SVG 图表库回归](https://chartist.dev/)

一个始于 2014 年、由 CSS 驱动样式的 SVG 图表库——曾“在过去几年逐渐停滞”——如今携组合式 API、服务端渲染为 SVG、终端图表等功能回归；折线图经 gzip 压缩后仍约为 12KB。1.x 用户可参考[迁移指南](https://chartist.dev/docs/coming-from-1x/)。

*Gion Kunz 等*

---

### [Pele：将 Mermaid 图表渲染为轻量、可主题化的 SVG](https://pele.run/)

一个用于 Mermaid 图表语法的零依赖渲染器，支持响应式布局，并可通过 CSS 变量为 SVG 设置主题。体积约为 Mermaid.js 的六分之一。[试试 Playground](https://pele.run/playground)。

*Steph Ango（Obsidian）*

---

### [`<rich-input>`：带 GitHub 风格搜索过滤器的富输入框](https://rich-input.netlify.app/)

![anvwoxijoc5lx7t5nnkh](@@CDN@@/assets/img/web/JavaScriptWeekly50/img-04.webp)

一个用于 GitHub 风格搜索框的 Web Component：自由文本与自动补全的 `key:value` 过滤器混合输入，并在原位高亮。

*Bramus Van Damme*

### 版本发布

- [Chokidar 6.0](https://github.com/paulmillr/chokidar) – JS 工具链背后广泛使用的文件监视器。[现已重写为在报告变更前先核对磁盘](https://github.com/paulmillr/chokidar/releases/tag/6.0.0)，以避免例如连续编辑后出现误报事件。

- [Happy DOM 21.0](https://github.com/capricorn86/happy-dom) – 用纯 JavaScript 实现的无头浏览器环境，在测试中很受欢迎。[现在默认阻止样式表和 `iframe` 加载](https://github.com/capricorn86/happy-dom/releases/tag/v21.0.0)。

- [p-queue 10.0](https://github.com/sindresorhus/p-queue) – 支持并发控制的 Promise 队列。[现在零依赖](https://github.com/sindresorhus/p-queue/releases/tag/v10.0.0)，并且是一个 `EventTarget`。

- [Paper.js 0.13](https://github.com/paperjs/paper.js/releases/tag/v0.13.0) 和 [0.14](https://github.com/paperjs/paper.js/releases/tag/v0.14.0) – 面向 canvas 的矢量图形脚本框架。多年来首次值得关注的版本。（[主页](https://paperjs.org/)及[示例](https://paperjs.org/examples/)。）

- 🕹️ [LittleJS 1.27](https://frankforce.com/littlejs-is-2d-and-3d-now/) – 无依赖的 HTML5 游戏引擎，现在还支持 3D。

- 🖼️ [Skia Canvas 4.0](https://skia-canvas.org/) – 面向 Node 的 Canvas API，基于 Skia 构建。

## 📢 生态系统其他动态

![t1yy7vc2vsopynkoyvrc](@@CDN@@/assets/img/web/JavaScriptWeekly50/img-05.webp)

- 🖼️ **JPEG XL：** 这种现代图片格式现已得到所有主流浏览器支持，最新默认启用它的是 [Firefox 158](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/158)。Jake Archibald 在[这篇详尽评测](https://jakearchibald.com/2026/jpeg-xl-vs-avif/)中将其与 AVIF 对比。我觉得最惊人的是[它能在不到 100 字节内渲染出什么](https://jpegxl.info/art/big_gallery.html)。

- **NodeConf EU 2026：** [▶️ 最新的 NodeConf EU 演讲](https://www.youtube.com/playlist?list=PLHJJhUxJCR0c)已经上线，包括 James Snell 关于[每个运行时都应支持的通用最小 API](https://www.youtube.com/watch?v=cKjSAh7wuyw)的论述，以及关于 [V8 堆管理](https://www.youtube.com/watch?v=dYvGvWPcEYk&list=PLHJJhUxJCR0c&index=25)和 [Emscripten 与 WebAssembly](https://www.youtube.com/watch?v=nNlqco5xd20&list=PLHJJhUxJCR0c&index=23)的演讲。

- **一个新的社交网络：** [/dev/null](https://dev-null.sh/) 是一个面向 GitHub 用户的开发者社交网络，在 48 小时内从零构建。它已经有超过 8000 名成员，[包括我](https://dev-null.sh/@peterc)。目前玩起来很有趣！

*原文链接：[JavaScript Weekly Issue 807](https://javascriptweekly.com/issues/807)*
