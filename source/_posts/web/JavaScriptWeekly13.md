---
title: JavaScript周刊-13
date: 2018-03-19 22:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 770: 2026年1月27日

![LibPDF](@@CDN@@/assets/img/web/JavaScriptWeekly13/img-01.webp)

## 📰 头条新闻

### [介绍 LibPDF: 使用 TypeScript 解析和生成 PDF](https://documenso.com)

[LibPDF](https://github.com/documenso/libpdf) 自称为 *"TypeScript 应有的 PDF 库"*,支持在 Node、Bun 和浏览器中使用现代 API 解析、修改、签名和生成 PDF。[GitHub 仓库](https://github.com/documenso/libpdf)。

### [JavaScript 框架 – 迈向 2026 年](https://dev.to)

[SolidJS](https://www.solidjs.com/) 的创建者对 JS 框架了如指掌,在过去几年中每年都会撰写一篇场景回顾。在这里,他挑选了四个演进领域,并表示 *"这是一个令人难以置信的激动人心的时代来开发 JavaScript 框架。"*

## 📦 赞助商

### [还在手动编写测试吗?](https://www.meticulous.ai/)

Notion、Dropbox、Wiz 和 LaunchDarkly 已经找到了一种新的测试范式——他们无法想象没有它的工作。由前 Palantir 工程师打造,Meticulous 自主创建一个持续演进的端到端 UI 测试套件,无需开发人员付出任何努力即可提供近乎详尽的覆盖率。

## 📌 简讯

- Lea Verou 庆祝她倡导的两个 ECMAScript 提案本周在 TC39 达到第一阶段:[可组合访问器](https://github.com/tc39/proposal-composable-accessors)和[别名访问器](https://github.com/tc39/proposal-alias-accessors)。Rob Palmer 也分享了[最新 TC39 全体会议的更多提案更新](https://github.com/tc39/notes/tree/main/meetings/2025-01)
- 🕹️ Three.js 的创建者(被称为 mrdoob)创建了[一个基于 Three.js 的 1996 年 *Quake* 移植版](https://mrdoob.com/projects/chromeexperiments/quake/)——[这里是源代码](https://github.com/mrdoob/three.js/tree/dev/examples/jsm/libs/quake)。你可以在[这个 X 帖子](https://x.com/mrdoob/status/1883176839850725847)中了解更多关于这个项目的信息
- 📊 [JSBenchmarks.com](https://jsbenchmarks.com/) 是一个新的尝试,用于对几个流行的 JavaScript 框架进行基准测试。与所有基准测试一样,请保持批判性眼光,但[示例应用](https://github.com/JSBenchmarks/jsbenchmarks)是开放的,可以阅读或贡献

## 🚀 版本发布

- [Node.js 25.5.0 (Current)](https://nodejs.org/en/blog/release/v25.5.0) – 引入了 `--build-sea` 选项,简化了构建单可执行应用程序的过程
- [Bun v1.3.7](https://bun.sh/blog/bun-v1.3.7) – 这个流行的运行时更新了其 JavaScriptCore 引擎,使 async/await 速度提升 35%,ARM64 性能也有所改进。它还推出了一个新选项,可以生成 Markdown 格式的性能分析数据以便于分享,并支持原生 JSON5 和 JSONL 解析
- [Rolldown 1.0 RC](https://rolldown.rs/blog/rolldown-v1-rc) – 基于 Rust 的快速打包器,具有与 Rollup 兼容的 API 和 esbuild 功能对等
- [npm v11.8.0](https://github.com/npm/cli/releases/tag/v11.8.0)
- [Emscripten 5.0](https://github.com/emscripten-core/emscripten/blob/main/ChangeLog.md#500-01172025)
- [Neutralinojs 6.5.0](https://github.com/neutralinojs/neutralinojs/releases/tag/v6.5.0)

## 📖 文章和视频

![TypeScript 移植到 Rust](@@CDN@@/assets/img/web/JavaScriptWeekly13/img-02.webp)

### [在一个月内将 10 万行代码从 TypeScript 移植到 Rust](https://blog.vjeux.com)

一位多产的 JavaScript 开发者将一个[宝可梦对战模拟器](https://github.com/smogon/pokemon-showdown)移植到 Rust,并分享了他的经验和用于解决 Claude Code 在如此大型任务中陷入困境的技术。他指出 *"基于 LLM 的编码代理是一个很好的新工具"*,但需要 *"工程专业知识和持续的监督"*。

### [在一个月内构建 JavaScript 运行时](https://themackabu.dev)

*"如果我能构建一个足够小的 JavaScript 引擎以嵌入到 C 程序中,但又足够完整以实际运行真实代码,会怎样?"* 最终结果是 [Ant](https://github.com/themackabu/ant)。

### [用于 AI 编码助手的 Clerk MCP 服务器](https://go.clerk.com)

将 Claude、Cursor 或 Copilot 连接到 Clerk 的文档。获取可用的认证代码,而不是过时的模式。

### [深入 Turbopack: 通过减少构建来加快构建速度](https://nextjs.org)

如果你正在处理大型代码库,更快的热重载、更好的扩展性和持久化缓存都是非常理想的。以下是这些功能在 Turbopack 中的实现方式。

### [100 秒解释 Bun](https://www.youtube.com/watch?v=dWqNgzZwVJQ)

流行的快速开发解释频道在高层次上讲解 [Bun](https://bun.sh/)。

### 更多文章

- 📄 [修复 Google Cloud Function 中 6 年之久的 JavaScript 内存泄漏](https://www.debugbear.com/blog/javascript-memory-leak)
- 📄 [使用 Deno 构建恐龙跑酷游戏,第 4 部分](https://deno.com/blog/build-a-dinosaur-runner-game-with-deno-part-4) – Deno 官方博客上正在进行的系列的第四部分
- 📄 [Vercel vs Netlify vs Cloudflare: 无服务器冷启动对比](https://punit.dev/blog/vercel-vs-netlify-vs-cloudflare-serverless-cold-starts-compared/)
- 📄 [SPA 是性能的死胡同](https://www.yegor256.com/2025/01/21/spa-performance-dead-end.html)

## 🛠 代码和工具

### [Midscene.js: 使用视觉模型远程控制 Web、移动和桌面](https://midscenejs.com)

提供了一种使用 JavaScript 驱动众多平台([包括 iOS](https://midscenejs.com/automate-ios-app.html))的方法,通过使用各种集成和具有视觉能力的模型,你可以用 JavaScript 和自然语言的混合编写操作并执行它们。

### [Travels 1.0: 快速、框架无关的撤销/重做库](https://github.com/unadlib/travels)

允许你为文本编辑器、绘图工具或其他交互式软件等应用添加撤销/重做功能。使用内存高效的技术,只存储更改,而不是每次更改的完整快照。

### [基于 Postgres 构建的 #1 时序数据库](https://www.tigerdata.com)

TimescaleDB 通过超表、95% 压缩和连续聚合扩展 Postgres。[免费开始构建](https://www.tigerdata.com)。

### [SonicJS 2.7: 专为 Cloudflare Workers 打造的性能优先边缘原生无头 CMS](https://sonicjs.com)

专为边缘构建的生产就绪 CMS。[GitHub 仓库](https://github.com/lane711/sonicjs)。

### [Mastra 1.0: 来自前 Gatsby 团队的 AI 框架](https://mastra.ai)

一个用于构建 AI 驱动应用和代理的一体化框架([主页](https://mastra.ai))。

### [Storybook 10.2](https://storybook.js.org/blog/storybook-10-2/)

用于构建 UI 组件的前端工作坊获得了一些 UI 和故事创作改进。

### 更多工具

- 🎥 [Mediabunny 1.31.0](https://github.com/ThatGuySam/mediabunny) – 用于在浏览器中直接读取、写入和转换视频和音频文件的媒体工具包
- [Cheerio v1.2](https://github.com/cheeriojs/cheerio/releases/tag/v1.2.0) – 快速、灵活的 HTML 和 XML 解析器和 DOM 操作库
- [eslint-plugin-regexp 3.0](https://github.com/ota-meshi/eslint-plugin-regexp/releases/tag/v3.0.0) – 用于查找正则表达式错误和样式违规的插件
- [React Timeline Editor 1.0](https://github.com/xzdarcy/react-timeline-editor) – 用于构建基于时间轴的编辑器的组件。([示例](https://xzdarcy.github.io/react-timeline-editor/))
- 📊 [Billboard.js 3.18.0](https://naver.github.io/billboard.js/) – 基于 D3.js 的灵活 JavaScript 图表库
- [Feedsmith 2.9](https://github.com/shgysk8zer0/feedsmith) – 流行 feed 格式的 feed 解析器和生成器
- [Typed.js v3.0](https://github.com/mattboldt/typed.js/) – 打字动画库。(GPL 许可)
- [Regle v1.17](https://reglejs.dev/) – Vue 的无头表单验证库

## 📰 分类广告

- 🎉 [聆听塑造 Web 的思想!](https://jsnation.com/) 数千名开发者、美食车和阿姆斯特丹氛围。不要错过 [JSNation](https://jsnation.com/) — 使用 JSWEEKLY 享受 10% 折扣
- 🚀 Auth0 for AI Agents 是构建 AI 代理更安全的完整认证解决方案。[立即开始构建](https://auth0.com)
- The Code 教授 15 万+ AI 和 ML 工程师如何使用 AI 进行编码。[注册并获取终极 Claude Code 指南](https://thecode.substack.com/)(100+ 技巧)以实现 5 倍更快的交付

## 📢 生态系统中的其他内容

一些更广泛领域中的其他有趣花絮:

![Midscene.js](@@CDN@@/assets/img/web/JavaScriptWeekly13/img-03.webp)

- OpenAI 的 Michael Bolin 撰写了一篇详尽的[技术评论,介绍其 OpenAI Codex 代理的工作原理](https://bolin.dev/blog/openai-codex-technical-review/)。对于任何试图实现自己的编码代理的人来说,这是宝贵的阅读材料,即使你只是想知道他们是如何做到的
- 🕹️ 一群开发者已经[将 Super Monkey Ball 移植到 Web](https://monkeyball.dev/)。如果你感兴趣,这里是[源代码](https://github.com/thesmartwon/OpenSMBU) - 它的依赖项出奇地少
- [Mystral Native.js](https://github.com/mystral-org/native.js) 是一个早期实验性运行时,用于使用 WebGPU 原生运行 JavaScript 游戏: *"把它想象成'游戏的 Electron',但没有 Chromium。"*
- 怀念使用 telnet 连接到远程服务? [仍然有一些基于文本的服务可以访问](https://gist.github.com/mikalv/294a2cfa0ff9a89c7d8f92e47c7c8f0e)
- [如何在 2026 年制作 Favicon: 适合大多数需求的三个文件](https://evilmartians.com/chronicles/how-to-favicon-in-2026-three-files-that-fit-most-needs)

---

*原文链接: [JavaScript Weekly Issue 770](https://javascriptweekly.com/issues/770)*
