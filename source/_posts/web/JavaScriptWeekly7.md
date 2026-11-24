---
title: JavaScript周刊-7
date: 2018-03-17 18:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## December 5, 2025

![JavaScript 30周年](@@CDN@@/assets/img/web/JavaScriptWeekly7/img-01.webp)

## 🎉 JavaScript 迎来 30 周岁 🎉

1995 年 5 月，33 岁的 Brendan Eich [仅用十天就构建了 JavaScript 的第一个原型](https://javascriptweekly.com/link/178085/web)，最初代号为 *Mocha*（后来改名为 *LiveScript*）。1995 年 12 月 4 日，Netscape 和 Sun Microsystems [在新闻稿中正式宣布了 "JavaScript"](https://javascriptweekly.com/link/178086/web)，将其描述为 _"一种易于使用的对象脚本语言，旨在创建将客户端和服务器上的对象和资源链接在一起的实时在线应用程序"_。

三十年来，JavaScript 已经巩固了其在 Web 平台核心的地位，并更广泛地应用于桌面应用、操作系统（例如 Windows 使用 React Native）、移动应用，甚至[微控制器](https://javascriptweekly.com/link/178087/web)上。祝愿 JavaScript 再续辉煌三十年，同时也希望[围绕 JavaScript 商标的混乱和诉讼能够得到解决](https://javascriptweekly.com/link/178088/web)。拜托了 Larry，给我们一个难忘的圣诞礼物吧？😅

## TypeScript 7 的进展

[TypeScript 7 的进展](https://javascriptweekly.com/link/178089/web) — TypeScript 项目最近几个月在公开场合比较沉默，但在幕后他们一直在努力开发 TypeScript 6.0 和 7.0。v6.0 将是最后一个基于 JavaScript 的版本，作为原生 Go 移植版本（v7.0）的过渡版本，后者已经初具规模，速度提升约 10 倍。

## Anthropic 收购了 Bun JavaScript 运行时

[Anthropic 收购了 Bun JavaScript 运行时](https://javascriptweekly.com/link/178090/web) — [Bun](https://javascriptweekly.com/link/178091/web) 这个由 JavaScriptCore 驱动的 JS/TS 运行时度过了紧张的几年。以 Claude LLM 闻名的 Anthropic 正在押注 Bun 来驱动其 Claude Code 代理开发工具等。Jarred 在这里讲述了 Bun 的完整故事，并向我们保证 Bun 将保持开放，并因此变得更好。

## 简讯

- ⚠️ React 团队[宣布了 React Server Components 中的一个关键安全漏洞](https://javascriptweekly.com/link/178136/web)，该漏洞影响支持 RSC 的应用程序，[包括（部分）Next.js 应用](https://javascriptweekly.com/link/178137/web)。

- 🎄 [Advent of Code](https://javascriptweekly.com/link/178092/web) 正在进行中，有 12 天的谜题等你来解。如果你更喜欢 JavaScript 特定的内容，[AdventJS](https://javascriptweekly.com/link/178093/web) 有一些可以直接在浏览器中解决的 JavaScript 特定谜题。[Advent of Svelte](https://javascriptweekly.com/link/178094/web) 将在本月分享 25 个不同的 Svelte 相关技巧。

- [WebGPU 现已在所有主流浏览器中得到支持](https://javascriptweekly.com/link/178095/web)。

## 发布

- [Vite 8 Beta](https://javascriptweekly.com/link/178096/web) – 现由 Rolldown 驱动，承诺显著加快生产构建速度，并为未来开发提供更好的平台。
- [Oxfmt: Oxc Formatter Alpha](https://javascriptweekly.com/link/178097/web) – 一个由 Rust 驱动的、兼容 Prettier 的代码格式化器。
- [ESLint v10.0.0 Alpha 1](https://javascriptweekly.com/link/178098/web)

## 📖 文章和视频

### 不再有令牌：锁定 npm 发布工作流

[不再有令牌：锁定 npm 发布工作流](https://javascriptweekly.com/link/178099/web) — 在最近一系列 npm 安全事件之后，[11ty](https://javascriptweekly.com/link/178100/web) 的创建者 Zach 对他的 npm 安全足迹进行了审计，并分享了一些我们都可以使用的技巧。

💡 Liran Tal 也分享了一些[npm 安全最佳实践](https://javascriptweekly.com/link/178101/web)供采用。

### 使用 JSDoc 的 JavaScript 类型化细节

[使用 JSDoc 的 JavaScript 类型化细节](https://javascriptweekly.com/link/178102/web) — 如果你更喜欢 JavaScript 而不是 TypeScript（我知道你们中有很多人！）但仍想获得一些类型的好处，JSDoc 提供了一个有趣的替代方案。

### 浏览器处理 Base64 数据有多快？

[浏览器处理 Base64 数据有多快？](https://javascriptweekly.com/link/178104/web) — 在大多数情况下，现代硬件上每秒可达数千兆字节，除了 Firefox 和 Servo。

### 用 JavaScript 制作"无人机环境噪音"合成器

[用 JavaScript 制作"无人机环境噪音"合成器](https://javascriptweekly.com/link/178105/web) — 一篇有趣的文章，介绍了一个使用 Web Audio API 和粒度合成将任何文件转换为声音的工具。你可以[在这里尝试在线演示](https://javascriptweekly.com/link/178106/web)。

### 其他文章

📊 [比较 AWS Lambda Arm 与 x86 在各运行时的性能](https://javascriptweekly.com/link/178107/web) – 不同版本的 Node.js 经过测试。在 Lambda 上，Arm 似乎比 x86 有很大优势。

📄 [Angular Pipes：重新思考的时候](https://javascriptweekly.com/link/178108/web) – 我们这些天很少看到高质量的 Angular 文章，所以这是一种享受。

📄 [TypeScript 严格性是非单调的：strictNullChecks 和 noImplicitAny 如何交互](https://javascriptweekly.com/link/178109/web)

📄 [如何用 TypeScript 测试 Vue Composable](https://javascriptweekly.com/link/178110/web)

📄 [面向 JavaScript 开发者的范畴论](https://javascriptweekly.com/link/178111/web)

## 🛠 代码和工具

### TanStack AI：LLM/AI 提供商的统一接口

[TanStack AI：LLM/AI 提供商的统一接口](https://javascriptweekly.com/link/178112/web) — 快速增长的 *TanStack* 库家族的最新成员，提供了一个统一的、框架无关的接口来连接多个 AI API，完整支持流式传输和 Zod schema 推断。目前处于 _alpha_ 阶段。[GitHub 仓库](https://javascriptweekly.com/link/178113/web)。

💡 另一个新成员是 [TanStack Pacer](https://javascriptweekly.com/link/178114/web)，它提供框架无关的防抖、节流、速率限制、队列和批处理实用工具。

### Remend：自动修复损坏的流式 Markdown

[Remend：自动修复损坏的流式 Markdown](https://javascriptweekly.com/link/178116/web) — 为你的应用带来智能的不完整 Markdown 处理，特别适用于与 LLM 配合使用。它是从 Vercel 的 [Streamdown](https://javascriptweekly.com/link/178117/web) 库中提取的，这是一个为 AI 驱动的流式传输设计的 react-markdown 替代品。

### Tinybench 6.0：一个小巧简单的基准测试库

[Tinybench 6.0](https://javascriptweekly.com/link/178118/web) — 使用任何可用的精确计时功能（例如 process.hrtime 或 performance.now）。你可以对任何函数进行基准测试，指定运行时间或次数，并获得各种统计数据——它可以跨多个运行时运行。[GitHub 仓库](https://javascriptweekly.com/link/178118/web)。

### Ruby2JS：Ruby 到 JavaScript 的转译器

[Ruby2JS](https://javascriptweekly.com/link/178119/web) — 一个旨在保持结果代码看起来像"手工制作"而不仅仅是转译的转译器。在主页上试用在线演示来感受一下。

### 其他工具更新

- [Chokidar 5.0](https://javascriptweekly.com/link/178120/web) – Node.js 高效的跨平台文件监视库。
- [Prisma 7.1](https://javascriptweekly.com/link/178121/web) – Node.js 和 TypeScript 的流行 ORM。
- [Neutralinojs 6.4](https://javascriptweekly.com/link/178122/web) – Electron 的更轻量替代方案。
- [Express v5.2.0](https://javascriptweekly.com/link/178123/web) 和 [v5.2.1](https://javascriptweekly.com/link/178124/web)

## 📰 分类广告

- [还在手动编写测试？](https://javascriptweekly.com/link/178125/web) 看看为什么 Dropbox、Notion 和 Lattice 等现代工程团队依赖 [Meticulous](https://javascriptweekly.com/link/178125/web) 来运行 E2E UI 测试。

- 🎨 [今天免费试用 Pintura 图像编辑器](https://javascriptweekly.com/link/178126/web)，几分钟内为你的 Web 应用添加精美的裁剪、旋转和注释体验。

## 📢 生态系统中的其他地方

更广泛领域中的其他有趣话题：

- 🤖 Colin Eberhardt [探讨了使用 GitHub 的 *Spec Kit*](https://javascriptweekly.com/link/178127/web) 通过规范驱动开发（SDD）构建现代 Svelte 应用，其中人类和 AI 代理协同工作。

- DebugBear 团队对 [2025 年 Web 性能话题进行了回顾](https://javascriptweekly.com/link/178128/web)，包括 DevTools 增强、TTFB、LCP 和 INP 测量方式的变化，以及 Firefox 对 [Scheduler API](https://javascriptweekly.com/link/178129/web) 的支持。

- Brian 'Beej' Hall，以其各种[指南](https://javascriptweekly.com/link/178130/web)（如[网络编程](https://javascriptweekly.com/link/178131/web)和 [Git](https://javascriptweekly.com/link/178132/web)）而闻名，发布了 [Beej 的计算机科学学习指南](https://javascriptweekly.com/link/178133/web)。这是高层次的内容，更多关于问题解决的心智模型和哲学，而不是实际的编码或数学。

- [DepX 的徽章生成器](https://javascriptweekly.com/link/178134/web) 为你提供一个图形徽章，你可以将其包含在 README 或项目网站中，以显示你的 npm 包有多少（或多少）依赖项。

- 想尝试理解椭圆曲线密码学是如何工作的吗？[这里有一个简化解释](https://javascriptweekly.com/link/178135/web)。

---

_原文链接：[JavaScript Weekly #764](https://javascriptweekly.com/issues/764)_
