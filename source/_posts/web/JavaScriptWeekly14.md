---
title: JavaScript周刊-14
date: 2018-03-20 09:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 771: 2026年2月3日

![header](@@CDN@@/assets/img/web/JavaScriptWeekly14/img-01.webp)

## 四大重量级项目发布更新

本周,JavaScript 生态系统中的四个支柱项目都发布了重要更新,你很可能至少在使用其中一个:

- [**Gatsby v5.16**](https://javascriptweekly.com/link/180162/web) 证明了 Gatsby 并非"已死"(曾被认为与 Next.js 在 React 世界中不相上下)。其主要特性是支持 React 19。

- [**Babel 7 刚刚发布了最终版本**](https://javascriptweekly.com/link/180164/web)。*"经过多年努力,Babel 8 终于准备好了"*,至少是[候选发布版本](https://javascriptweekly.com/link/180166/web)的形式。

- [**Rspress 2.0**](https://javascriptweekly.com/link/180167/web) 是这个高性能的 Rust 驱动、面向 JavaScript 的静态站点生成器的重大版本。

- [**Lodash 4.17.23**](https://javascriptweekly.com/link/180168/web) 听起来是个小版本,但这是一次"安全重置",针对这个仍被大量使用的[实用工具库](https://javascriptweekly.com/link/180169/web),旨在为更长远的未来提供基础。

---

## [只有傻瓜才写测试](https://javascriptweekly.com/link/180111/web)

现代工程团队如 Notion、Dropbox、Wiz 和 LaunchDarkly 使用 Meticulous 来维护[覆盖所有边缘情况](https://javascriptweekly.com/link/180111/web)的端到端 UI 测试。

*Meticulous 赞助*

---

## 🦀 [OpenClaw: 失控的 AI 助手](https://openclaw.ai)

一个新的开源 TypeScript 项目经历了疯狂的一周:[GitHub 上获得 15 万颗星](https://javascriptweekly.com/link/180172/web),大量用户购买 Mac Mini 来运行它,*两次*品牌重塑(最初叫 *Clawdbot*),以及一个智能体自主使用的项目生态系统(例如[一个完整的社交网络](https://javascriptweekly.com/link/180173/web))。这是 TypeScript 处于 AI 热潮核心的又一个例子。

*Peter Steinberger*

---

## 简讯

- 流行的 [JSBin](https://javascriptweekly.com/link/180112/web) 协作式 JavaScript pastebin 宕机了几天,Remy Sharp [分享了发生了什么的战斗故事](https://javascriptweekly.com/link/180113/web)。

- 🔒 [OpenJS 基金会分享了年度报告](https://javascriptweekly.com/link/180175/web),涵盖其在保护 JS 生态系统方面的努力。

- Angular 正在[更改组件的默认变更检测策略](https://javascriptweekly.com/link/180114/web)。

- [Astro](https://javascriptweekly.com/link/180115/web) 和 [Svelte](https://javascriptweekly.com/link/180116/web) 都分享了最新动态的月度综述。

---

## 版本发布

- [**Node.js v25.6.0 (Current)**](https://javascriptweekly.com/link/180118/web) – async_hooks 现在可以跳过 Promise 钩子以减少开销。此外,URL 解析现在支持 Unicode 17。

- [**jQuery UI 1.14.2**](https://javascriptweekly.com/link/180119/web) – 这个传统 UI 库在一年多后首次更新,现在可与 jQuery 4.0 配合使用。

- [**Bun v1.3.8**](https://javascriptweekly.com/link/180176/web) – 原生 Markdown 解析来了。

- [Astro 5.17](https://javascriptweekly.com/link/180177/web)
- [ESLint 10.0.0-rc2](https://javascriptweekly.com/link/180178/web)
- [tRPC v11.9.0](https://javascriptweekly.com/link/180120/web)
- [Lexical 0.40.0](https://javascriptweekly.com/link/180121/web)
- [Reka UI 2.8](https://javascriptweekly.com/link/180180/web) (原 Radix Vue)

---

## 📖 文章和视频

### ⁉️ [如何在 JavaScript 中错误地解析数字](https://thedailywtf.com)

![parse-numbers](@@CDN@@/assets/img/web/JavaScriptWeekly14/img-02.webp)

为什么要使用合适的区域感知 API 来解析数字,当你可以手工制作一个由字符串分割、分隔符交换和隐式类型强制转换组成的迷宫,而这些在边缘情况下会悄无声息地失败?

*Remy Porter (The Daily WTF)*

### 📉 [Node.js 16 到 25 逐版本基准测试](https://www.repoflow.io)

各个领域的性能跃升令人印象深刻(特别是 Node 25),而其他领域的提升则更为温和。

*RepoFlow*

### [B2B 企业就绪的实用检查清单](https://hello.descope.com)

衡量身份验证、管理用户体验、安全性、监控和架构方面的差距,以获取企业客户。[立即下载!](https://hello.descope.com)

*Descope 赞助*

### [JavaScript 中的显式资源管理](https://allthingssmitty.com)

你可以使用 `using` 进行确定性清理,在作用域退出时调用 `Symbol.dispose`/`asyncDispose`,而无需 try/finally。这是对流、观察者、锁和类似 API 中泄漏和遗忘清理的小修复。

*Matt Smith*

### [C# 和 TypeScript 的历史与 Anders Hejlsberg 对话](https://github.blog)

GitHub 采访了 C# 和 TypeScript 的创造者,谈论他的职业生涯、为什么首先创建 TypeScript、一些微软内部政治,以及正在进行的 TypeScript 编译器的 Go 移植。有完整采访的视频,以及总结为书面形式的"七点学习"。

*GitHub*

### 更多文章

- 📄 [我对 Vue 项目的主观 ESLint 设置](https://javascriptweekly.com/link/180127/web) – 包含大量可供选择的示例。*Alexander Opalic*

- 📄 [使用 GSAP、Three.js、Astro 和 Barba.js 制作滚动显示的 WebGL 画廊](https://javascriptweekly.com/link/180128/web) – 引人注目的视觉图像显示效果,[有在线演示](https://javascriptweekly.com/link/180129/web)。*Chakib Mazouni*

- 📄 [使用 Z3 SMT-Solver 预测 Firefox 中的 Math.random()](https://javascriptweekly.com/link/180130/web) *Dennis Yurichev*

- 🎤 [保护 npm 是基础](https://javascriptweekly.com/link/180131/web) *Nicholas C. Zakas (Changelog Podcast)*

- 📄 [使用 Astro 构建简单的 RSS 聚合器](https://javascriptweekly.com/link/180132/web) *Raymond Camden*

---

## 🛠 代码与工具

### [Heat.js 5.0: 灵活的热力图渲染解决方案](https://www.heatjs.com)

![heatjs](@@CDN@@/assets/img/web/JavaScriptWeekly14/img-03.webp)

生成可自定义的交互式热力图(类似 GitHub 贡献图),或将热力图渲染为[线条图](https://javascriptweekly.com/link/180134/web)和[柱状图](https://javascriptweekly.com/link/180135/web)。网站上[有大量演示](https://javascriptweekly.com/link/180136/web)可供欣赏。[GitHub 仓库](https://javascriptweekly.com/link/180137/web)。

*William Troup*

### [构建 MCP 服务器?不要自己实现认证](https://workos.com)

WorkOS AuthKit 处理 OAuth 2.1 流程,因此你的 MCP 服务器只需验证令牌。控制 AI 智能体访问哪些工具。

*WorkOS 赞助*

### 🕒 [Croner 10.0: Cron 风格的触发器和评估](https://croner.56k.guru)

使用 [cron 语法](https://javascriptweekly.com/link/180140/web)在任何 cron 计划上触发函数。它还可以评估 cron 表达式,为你提供即将到来的时间列表。[v10.0](https://javascriptweekly.com/link/180141/web) 带来了完全的 OCPS(开放 Cron 模式规范)1.4 合规性以及更多调度选项。

*Hexagon*

### 🗓️ [DayFlow: React 的全功能日历组件](https://dayflow-js.github.io)

一个仅限 React 的功能丰富的日历组件,具有拖放、多视图和所有常见的 GCal 风格丰富功能。其无限滚动功能很巧妙。[GitHub 仓库](https://javascriptweekly.com/link/180143/web)。

*DayFlow Contributors*

### [Tsonic: TypeScript 到 C# 的转译器](https://tsonic.org)

这个想法是用于创建在 .NET 上运行的本机可执行文件。我没有测试过,因为我不在那个生态系统中,但这是一个有趣的想法。

*Jeswin*

### 更多工具

- 📄 [EmbedPDF 2.4](https://javascriptweekly.com/link/180145/web) – 框架无关的 JavaScript PDF 查看器。([演示](https://javascriptweekly.com/link/180146/web))

- [JavaScriptKit v0.40](https://javascriptweekly.com/link/180147/web) – 用于通过 WASM 与 JS 交互的 Swift 框架。

- [StackBlur.js 3.0](https://javascriptweekly.com/link/180148/web) – 长期存在的高斯模糊库;现在使用 ESM。

- [Knip 5.83](https://javascriptweekly.com/link/180149/web) – 查找并修复未使用的文件、依赖项和导出。

- 📄 [jsPDF 4.1](https://javascriptweekly.com/link/180150/web) – 直接在 JavaScript 中生成 PDF。([演示](https://javascriptweekly.com/link/180151/web))

- [qrcode.vue 3.8](https://javascriptweekly.com/link/180152/web) – 生成二维码的 Vue.js 组件。

- [focus-trap 8.0](https://javascriptweekly.com/link/180153/web) – 在 DOM 节点内捕获焦点。([演示](https://javascriptweekly.com/link/180154/web))

---

## 📢 生态系统其他动态

一些更广泛领域的其他有趣消息:

![github-cat](@@CDN@@/assets/img/web/JavaScriptWeekly14/img-04.webp)

- [GitHub 正在探索解决低质量贡献的方案](https://javascriptweekly.com/link/180155/web),可能包括让你完全禁用 PR 或至少将其限制为协作者。有意见?加入讨论。

- [如何在 Chrome 中限制单个网络请求](https://javascriptweekly.com/link/180156/web),而不是在全局级别。非常适合测试当你的依赖项加载*非常慢*时会发生什么......

- 🤖 OpenAI 发布了其智能编码 *Codex* 应用的[桌面版本](https://javascriptweekly.com/link/180157/web)。目前仅支持 macOS,不过有人[使用 Codex 将其自身移植到 Linux](https://javascriptweekly.com/link/180158/web)...😂

- ⚠️ 如果你是使用流行的 [Notepad++](https://javascriptweekly.com/link/180159/web) 编辑器的 Windows 用户,你可能想仔细检查你的安装,因为该项目在 2025 年[遭受了疑似国家支持的劫持](https://javascriptweekly.com/link/180160/web)。

- [svelteesp32](https://javascriptweekly.com/link/180161/web) 是一个有趣的项目,用于将 Svelte、React、Angular 或 Vue 前端嵌入到 ESP32 微控制器应用程序中。
