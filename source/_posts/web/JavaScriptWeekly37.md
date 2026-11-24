---
title: JavaScript周刊-37
date: 2018-03-30 15:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 794: 2026年7月14日

*与 CodeRabbit 联合推出*

![tanstack-charts](@@CDN@@/assets/img/web/JavaScriptWeekly37/img-01.webp)

## [📈 TanStack 的 npm 包下载量图表](https://tanstack.com/stats/npm)

一种快速查看包流行度随时间变化的方式，发现趋势，看看哪些库和工具已腾飞或衰落。默认视图将 TanStack 的包与几个常见包进行比较，但你可以输入任何你想查看的包，也可以查看预定义的集合，比如构建工具、组件库或 UI 框架。

*TanStack*

<div style="float:right"><img  src="@@CDN@@/assets/img/web/JavaScriptWeekly37/img-02.webp" width="120" height="120" alt="CodeRabbit" style="padding-top: 12px; padding-left: 12px;"></div>

## [AI 写代码，CodeRabbit 负责审查](https://coderabbit.ai/)

AI 能写代码，但最终需要为交付负责的还是你自己。CodeRabbit 是 AI 原生的审查层，能够捕获人类容易跳过的 Bug 和边界情况，确保合并的代码符合你的预期。免费试用，两键安装。

*CodeRabbit 赞助*

## [将 Bun 用 Rust 重写](https://bun.com/blog/bun-in-rust)

Bun 的创建者分享了将 JS 运行时从 Zig 移植到 Rust 的完整故事，在此过程中动用了大量 Claude Code 实例，耗费了约 $165K 的 API 使用费（按 API 价格计算）。Rust 版本将构成 Bun 1.4 的基础，预计很快发布。

*Jarred Sumner*

## [npm v12 发布：Install Scripts 默认关闭](https://github.blog/changelog/2026-07-08-npm-install-time-security-and-gat-bypass2fa-deprecation/)

npm 12 现已成为正式版，带来[许多破坏性变更](https://github.com/npm/cli/releases/tag/v12.0.0)。最大的变化是生命周期脚本默认不再运行，但这里有[更多实际影响值得关注](https://socket.dev/blog/npm-12)。另外，建议[先通过 11.18.0 升级](https://github.com/npm/cli/releases/tag/v11.18.0)。

*GitHub*

### 简讯

- TC39 第 115 次会议将于下周举行。[这是议程](https://github.com/tc39/agendas/blob/main/2026/07.md)，其中包括 [Await Dictionary](https://github.com/tc39/proposal-await-dictionary) 争取进入 Stage 3，以及 [Decimal](https://github.com/tc39/proposal-decimal/)、Import Defer 和 [Map.take](https://github.com/dcrousso/proposal-Map-take)。

- [Next.js 现在拥有正式的安全发布计划](https://nextjs.org/blog/next-security-release-program)，每月发布公告并按计划发布版本。首次安全发布预计在 7 月 20 日。

- ⚠️ `jscrambler` npm 包[在周末遭遇了供应链攻击](https://socket.dev/blog/jscrambler-supply-chain-attack)，Socket 在六分钟内检测到了这次攻击。

- [Porffor](https://porffor.dev/) 提前编译 JS 编译器[现在已实现自托管](https://bsky.app/profile/honk.foo/post/3mq5u64sl4k27)（可以用自身编译自身）。

- [Vercel 已收购](https://vercel.com/blog/vercel-acquires-better-auth) 流行的身份验证库 [Better Auth](https://better-auth.com/) 背后的团队。

## 📖 文章和视频

### [Proxy 和 Reflect：重新定义对象的基本运作方式](https://matmarquis.com/)

深入探讨拦截 JavaScript 对象的内部操作，涵盖了为什么 Reflect 会存在，并以构建一个小型响应式状态系统作为结尾（本质上就是 Vue 3 响应式系统的工作原理）。

*Mat Marquis*

---

### [为 Polyfill 辩护](https://lea.verou.me/blog/2026/in-defense-of-polyfills/)

资深标准编辑 Anne van Kesteren 表示 polyfill 是有害的。Lea 不同意，认为"ponyfill 只是用户空间库换了一个更好听的名字"，一个没有 polyfill 的 Web 将是一个停滞不前的 Web。

*Lea Verou*

---

### [Sentry + GitHub：实时诊断和修复 Bug](https://sentry.io/)

Sentry 捕获 Bug，Seer 诊断问题，Copilot 编写修复。在 7 月 15 日的直播中观看 Sentry 和 GitHub 联手现场破解一个脚本。

*Sentry 赞助*

---

### [Wordgard 中的协同编辑](https://marijnhaverbeke.nl/blog/wordgard-ops.html)

Marijn 最近发布了全新的 Wordgard 富文本编辑器（ProseMirror 的继任者）。这是他在十一年里对协同编辑的第三次探索，仍然基于操作变换（OT）而非 CRDT。

*Marijn Haverbeke*

---

### [逆向工程 ChatGPT 的 Web 技术栈](https://djbrotzky.com/chatgpt-web-stack)

作者花了数天时间拆解了 ChatGPT 的页面源码、打包文件和网络请求。React Router 7、TanStack Query、Radix 和 ProseMirror 均在技术栈中占有一席之地。

*Dennis Brotzky*

---

- 📄 [LiteRT.js：来自 Google 的高性能 Web AI 推理](https://developers.googleblog.com/litertjs-googles-high-performance-web-ai-inference/) — 在浏览器内部直接运行 AI 的 JavaScript 绑定，性能优于 TensorFlow.js 方案。[这里有一个 CodePen 演示](https://codepen.io/),使用它进行图片超分辨率处理（出奇地快！）。*Yu、Ristić、Soulanille、Parikh (Google)*

- 📄 [Drizzle 中的全文搜索，无需第二个系统](https://paradedb.com/) — 试用 Drizzle 的官方 ParadeDB 集成。搜索你的实时 Postgres 表，无需 ETL，无需 Elasticsearch 集群。*ParadeDB 赞助*

## 🛠 代码与工具

![litert](@@CDN@@/assets/img/web/JavaScriptWeekly37/img-03.webp)

### [Babylon Lite：更快、更小、仅支持 WebGPU 的 3D 引擎](https://babylonjs.com/)

Babylon.js 是一个功能强大、历史悠久的 3D 引擎，但如果从头开始重建会是什么样子？就是这个！Lite 版更快、更小，但有一些权衡取舍。

*Babylon.js 团队*

---

### [Ant：9MB 二进制文件的 JavaScript 运行时](https://github.com/theMackabu/ant)

不涉及 V8、JavaScriptCore 或 SpiderMonkey，这是用 C 构建的 JS 运行时，以 9MB 二进制文件的形式发布，可以运行 npm 包，并拥有极短的冷启动时间。

*theMackabu*

## 📢 生态系统其他动态

### [FracturedJson：让 JSON 更易读](https://j-brooke.github.io/FracturedJson/)

![fracturedjson](@@CDN@@/assets/img/web/JavaScriptWeekly37/img-04.webp)

一个将 JSON 格式化为紧凑但可读形式的工具，采用了一种新颖的方式来展示嵌套数据结构。

### [Geist Pixel：专为像素完美爱好者设计的编程字体](https://fonts.google.com/specimen/Geist+Pixel?preview.script=Latn)

![geist-pixel](@@CDN@@/assets/img/web/JavaScriptWeekly37/img-05.webp)

Google 推出的一款全新像素风格编程字体，在 Google Fonts 上免费提供。

---

- 🎉 [PGlite](https://pglite.dev/) 是一个用于 JavaScript 环境的 Postgres WebAssembly 构建，本周[下载量突破 1000 万次](https://electric.ax/blog/2026/06/25/pglite-reaches-10-million-weekly-downloads)。

- 📈 [Commit History](https://commit-history.com/) 是一个在线工具，根据 GitHub 用户的提交记录生成随时间变化的图表，适合添加到你的 GitHub Profile README 中。

---

*原文链接：[JavaScript Weekly Issue 794](https://javascriptweekly.com/issues/794)*
