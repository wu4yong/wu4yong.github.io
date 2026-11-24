---
title: JavaScript周刊-2
date: 2018-03-16 02:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## October 31, 2025

![Halloween](@@CDN@@/assets/img/web/JavaScriptWeekly2/img-01.webp)

[指令和平台边界](https://javascriptweekly.com/link/176430/web) — 首先是 "use strict" 指令用于在 JavaScript 中选择严格模式，但现在你会遇到 `use client`、`use server`、React 的新 [use no memo](https://javascriptweekly.com/link/176431/web) 等等，而它们根本不是标准的 JS 特性。Tanner 认为这种指令的激增是有代价的，会增加框架和工具锁定的风险。

[为你的 JavaScript 应用添加类 Excel 电子表格功能](https://javascriptweekly.com/link/176429/web) — SpreadJS 是业界领先的 JavaScript 电子表格组件，用于为企业应用添加高级电子表格功能。构建财务、分析、预算和其他应用。支持 Excel I/O、500+ 计算函数、表格、图表等。[立即查看演示](https://javascriptweekly.com/link/176429/web)。

## 🏆 TypeScript 跃升至 GitHub 上使用最多的语言第一名

[TypeScript 跃升至 GitHub 上使用最多的语言第一名](https://javascriptweekly.com/link/176432/web) — 作为本周 [GitHub Universe](https://javascriptweekly.com/link/176433/web) 活动的一部分，GitHub 发布了其平台上的年度活动报告。一年前，Python 跃升至第一，将 JavaScript 推到第三，但今年 TypeScript 夺冠，GitHub 认为面向 LLM 的开发起到了推动作用。然而，将 JavaScript 和 TypeScript 合在一起来看，我们的生态系统遥遥领先。

## 简讯：

- Evan You 宣布，他围绕 Vite 工具家族成立的公司 VoidZero Inc. [已完成 1250 万美元的 A 轮融资](https://javascriptweekly.com/link/176434/web)
- Lizz Parody 分享了 [Express.js 项目的最新动态](https://javascriptweekly.com/link/176435/web)及其最近的进展
- 你只剩下 24 小时来[参加 State of JS 2025 调查](https://javascriptweekly.com/link/176436/web)
- [Vercel 现在支持 Bun 运行时](https://javascriptweekly.com/link/176437/web)

## 发布：

- [Node.js v24.11.0 (LTS)](https://javascriptweekly.com/link/176438/web) – Node v24 转入活跃 LTS 发布阶段，将支持到 2028 年 4 月。[v22.21.1 (LTS)](https://javascriptweekly.com/link/176440/web) 和 [v25.1 (Current)](https://javascriptweekly.com/link/176441/web) 也在本周发布
- [Electron 39](https://javascriptweekly.com/link/176442/web) – 跨平台桌面应用框架升级到 Chromium 142、V8 14.2 和 Node 22.20
- [Ember 6.8](https://javascriptweekly.com/link/176443/web) – 这个历史悠久的框架新增了 renderComponent API，默认使用 Embroider 和 Vite 实现更快的构建
- [Rspack 1.6](https://javascriptweekly.com/link/176444/web)、[pnpm 10.20](https://javascriptweekly.com/link/176445/web)、[Vite 7.2.0 Beta 1](https://javascriptweekly.com/link/176446/web) ([更新日志](https://javascriptweekly.com/link/176447/web))、[Three.js r181](https://javascriptweekly.com/link/176448/web)

## 📖 文章和视频

[我用 10 种方式构建了同一个应用：评估移动性能的框架](https://javascriptweekly.com/link/176449/web) — 当针对移动设备开发时，小的包体积和快速的渲染时间是关键，因此 Loren 想看看不同方法的比较。Marko、SolidStart、SvelteKit、Qwik、Nuxt、Next.js 等都在这里接受了评测。

[▶ JavaScript 的起源故事](https://javascriptweekly.com/link/176450/web) — Annie 带我们回到 90 年代初 Web 的开始，讲述了使 JavaScript 得以腾飞的条件和进步，一直到我们现代以框架为导向、工具丰富的生态系统。_(25 分钟)_

[还在手动编写测试吗？](https://javascriptweekly.com/link/176451/web) — 了解为什么像 Dropbox、Notion 和 Wiz 这样的现代工程团队依赖 Meticulous 来运行 E2E UI 测试。

[为什么在 JavaScript 中 NaN !== NaN（以及背后的 IEEE 754 故事）](https://javascriptweekly.com/link/176452/web) — NaN 是一个数字，但它也是 *Not a Number*（不是数字）！这导致了一些众所周知的怪异行为，但 JavaScript _不是_罪魁祸首。

[我将 Mastro 从 Deno 移植到 Node 学到的东西](https://javascriptweekly.com/link/176454/web) — [Mastro](https://javascriptweekly.com/link/176456/web) 是一个最初只为 [Deno](https://javascriptweekly.com/link/176458/web) 设计的网站生成器。但如果 Deno 与 Node 兼容，那么让面向 Deno 的代码也在 Node 上运行容易吗？不完全是，但这是可能的。

📄 [从 Node.js v22 迁移到 v24](https://javascriptweekly.com/link/176460/web) – 现在 v24 是活跃的 LTS 版本，是时候尽可能升级了。

📄 [你知道有一个 HTML Tables API 吗？](https://javascriptweekly.com/link/176462/web)

📄 [在 TypeScript 中编写类似 Rust 的代码](https://javascriptweekly.com/link/176463/web)

## 🛠 代码和工具

![3dcat](@@CDN@@/assets/img/web/JavaScriptWeekly2/img-02.webp)

[Navcat：基于 3D 地板的寻路库](https://javascriptweekly.com/link/176464/web) — 我们很少看到一个库在首页有如此有趣的演示（它涉及猫和激光指示器！）Navcat 是一个寻路库，面向游戏和模拟，使对象能够在 3D 空间中规划路线。还有[许多其他有趣的演示](https://javascriptweekly.com/link/176466/web)。[GitHub 仓库](https://javascriptweekly.com/link/176467/web)。

[介绍 ArkRegex：带类型的 RegExp()](https://javascriptweekly.com/link/176468/web) — 想法很简单：用这个带类型的包装器替换 RegExp 构造函数或正则表达式字面量，为模式和捕获组获取类型。是 [ArkType 项目](https://javascriptweekly.com/link/176469/web)的一部分。– [GitHub 仓库](https://javascriptweekly.com/link/176470/web)。

[测量和改善 LLM 生成代码的质量](https://javascriptweekly.com/link/176471/web) — 用于微调提示、比较模型代码质量并随时间监控生成质量的开源工具。

[Slim Select 3.0：高级选择下拉控件](https://javascriptweekly.com/link/176472/web) — 一个功能丰富的选择下拉组件，无依赖。[v3.0](https://javascriptweekly.com/link/176473/web) 添加了官方 React 组件选项，修复了错误，并改善了可访问性。

🤫 [spoilerjs：框架无关的"剧透效果"](https://javascriptweekly.com/link/176474/web) — 如果你有一些文本（或者可能是敏感数据，如令牌）想要在页面上隐藏，直到有人点击它，这个受 Telegram 启发的 Web 组件适合你。

[Gasket：用于发现 JavaScript 和原生代码之间"桥梁"的 CLI 工具](https://javascriptweekly.com/link/176475/web) — 动态分析工具，检查 JavaScript 函数对象的内存布局，以识别那些跨越语言边界的函数。这相当小众，但由[一篇论文](https://javascriptweekly.com/link/176476/web)的作者构建，用于出于安全目的识别此类桥梁。

[vue-command：Vue.js 的终端模拟器组件](https://javascriptweekly.com/link/176477/web)

📊 [Recharts 3.3](https://javascriptweekly.com/link/176478/web) – 基于 D3 构建的图表库。[主页](https://javascriptweekly.com/link/176479/web)有示例和演示。v3.3 使图表能够直接处理响应式调整大小。

🦴 [Cornerstone.js 4.8](https://javascriptweekly.com/link/176480/web) – 用于构建医学影像应用的库。

🔎 [fuzzy-search 2.0](https://javascriptweekly.com/link/176481/web) – 用于前端的快速模糊搜索库。

[Immer 10.2](https://javascriptweekly.com/link/176482/web) – 流行的处理不可变状态的库。

[Dependency Cruiser 17.2](https://javascriptweekly.com/link/176483/web) – 可视化依赖关系的工具。

[Ink 6.4](https://javascriptweekly.com/link/176484/web) – 使用 React 构建 CLI 应用。

## 📰 分类广告

🔷 快速构建全功能 BPMN 编辑器 — [使用我们现成的 JointJS 模板](https://javascriptweekly.com/link/176485/web)，_专注于创新，而不是实现_。

⚡ UI 变化？在生产前捕获它们。[Vizzly = 本地 TDD + 团队审查规则](https://javascriptweekly.com/link/176486/web)，不仅仅是截图。

## 📢 生态系统中的其他地方

一些在更广泛领域中其他有趣故事的汇总：

- [vite-plugin-use-golang](https://javascriptweekly.com/link/176487/web) 是一个有趣的新 Vite 插件，可让你在 'JavaScript' 文件顶部添加 "use golang" 指令，然后实际编写 [Go](https://javascriptweekly.com/link/176488/web) 代码（然后编译为 WebAssembly）
- VoidZero 的 Alexander Lichter [总结了 ViteConf 2025 发生的所有事情](https://javascriptweekly.com/link/176489/web)，并分享了关于 Vite+、Oxlint、Vite DevTools、Nitro v3 等的更新
- Mirat Can Bayrak 在 Flippa 上发现了一个网站，[仅用 161 行 JavaScript 每月赚取 200 美元](https://javascriptweekly.com/link/176490/web)
- [Node-RED](https://javascriptweekly.com/link/176491/web) 是一个流行的"低代码" JavaScript 驱动的编程环境，[Node-RED Con 2025](https://javascriptweekly.com/link/176492/web) 是一个免费的在线活动，将于下周（11 月 4 日）举行，重点介绍它在工程、智能家居中的应用，甚至用于玩 [Factorio](https://javascriptweekly.com/link/176493/web)

---

_原文链接：[JavaScript Weekly #759](https://javascriptweekly.com/issues/759)_
