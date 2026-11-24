---
title: JavaScript周刊-4
date: 2018-03-16 16:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## November 14, 2025

![JavaScript 引擎动物园](@@CDN@@/assets/img/web/JavaScriptWeekly4/img-01.webp)

## 主要文章

[JavaScript 引擎动物园：了解100多个 JS 引擎](https://javascriptweekly.com/link/177056/web) — 我对大型数据表格情有独钟，这是关于 JavaScript 引擎的最全面的表格。看看各种引擎如何比较，按性能排序，或者点击引擎名称以了解更多关于其开发、历史和最终用户的信息。该[项目仓库](https://javascriptweekly.com/link/177057/web)还有用于尝试每个引擎的 [Dockerfiles](https://javascriptweekly.com/link/177059/web)。

> 💡 顺便说一下，我一直很喜欢[这个 ECMAScript 兼容性表](https://javascriptweekly.com/link/177060/web)，你可以在其中查看不同 JavaScript 特性的跨浏览器和运行时支持。

[FlexGrid by Wijmo：业界领先的 JavaScript 数据网格](https://javascriptweekly.com/link/177055/web) — 用于构建现代 Web 应用的快速灵活的数据网格。关键功能和虚拟化渲染包含在核心网格模块中。选择特殊功能以保持应用小巧。为 JavaScript 构建，扩展到 Angular、React 和 Vue。

## 🎯 Valdi：Snap 新开源的跨平台 UI 框架

[Valdi：Snap 新开源的跨平台 UI 框架](https://javascriptweekly.com/link/177061/web) — Snapchat 背后的团队开源了这个跨平台 UI 框架，它在生产应用中已使用了八年：_"用声明式 TypeScript 编写一次 UI，它直接编译为 iOS、Android 和 macOS 上的原生视图——无 Web 视图，无 JavaScript 桥接。"_

> 💡 [Valdi 的常见问题](https://javascriptweekly.com/link/177063/web)回答了你可能有的几个问题，包括它如何工作以及为什么你可能选择 Valdi 而不是 React Native。

## 简讯：

- 负责 ECMAScript 的 TC39 委员会下周将举行第111次会议，并有[一个紧凑的议程要讨论](https://javascriptweekly.com/link/177064/web)。_(感谢 [Rob Palmer](https://javascriptweekly.com/link/177065/web) 的提醒)_
- 在 Stack Overflow 上，Tanya Janca 分享了[编写更安全 JavaScript 的几个技巧](https://javascriptweekly.com/link/177066/web)
- 出色的在线 JavaScript 平台 [Val Town](https://javascriptweekly.com/link/177067/web) 的联合创始人分享了[过去三年的回顾](https://javascriptweekly.com/link/177068/web)，以及他们正在招聘的两个职位
- [Visual Types](https://javascriptweekly.com/link/177069/web) 是一个方便的视觉导向指南/教程，介绍类型是什么以及它们如何工作，重点关注 TypeScript

## 发布：

- [Bun v1.3.2](https://javascriptweekly.com/link/177070/web) – 隔离包安装在 v1.3 中作为默认引入，但给一些现有项目带来了问题，所以现在提升安装重新成为这些项目的默认设置。bun install 也变得更快，你可以通过 --cpu-prof 运行来进行 CPU 性能分析
- [Node.js v25.2.0 (Current)](https://javascriptweekly.com/link/177071/web) – 现在**[类型剥离](https://javascriptweekly.com/link/177072/web)已标记为稳定**
- [esbuild 0.27](https://javascriptweekly.com/link/177073/web) – 流行的打包工具。这是一个值得注意的版本，因为它有破坏性更改（所以提醒你适当地固定 esbuild 版本）
- [TanStack DB 0.5](https://javascriptweekly.com/link/177074/web)、[Node.js v24.11.1 (LTS)](https://javascriptweekly.com/link/177075/web)、[MikroORM 6.6](https://javascriptweekly.com/link/177076/web)

## 📖 文章和视频

![Node.js 现状](@@CDN@@/assets/img/web/JavaScriptWeekly4/img-02.webp)

▶ [2025 年 Node.js 现状解读](https://javascriptweekly.com/link/177077/web) — 今年早些时候 *JSNation* 上的一个30分钟演讲，TSC 成员 Matteo Collina 介绍了 Node 持续增长的受欢迎程度、发布时间表、安全性、最近的性能增强、权限系统等。

[V8 垃圾回收器近年来的发展](https://javascriptweekly.com/link/177078/web) — Andy 曾参与过 V8 和 JavaScriptCore 的开发，他回顾了过去几年 V8 引擎垃圾回收器的主要发展。非常技术性，但是一段有价值的历史。

[为你的 JS 应用构建类型安全的 API：Protobuf 研讨会](https://javascriptweekly.com/link/177079/web) — 了解 Protobuf 如何在从 Node.js API 到前端客户端的整个堆栈中带来类型安全。与 Buf 工程师的现场问答。

[比较 Electron vs. Tauri 构建和分发桌面应用](https://javascriptweekly.com/link/177080/web) — 一个使用 JavaScript 和 Electron 构建开源桌面应用的团队转而研究基于 Rust 的 [Tauri](https://javascriptweekly.com/link/177081/web)，结果喜忧参半，但大多是积极的。

[在2025年使用 Expo 进行 React Native 开发：一个视角](https://javascriptweekly.com/link/177082/web) — [Expo](https://javascriptweekly.com/link/177083/web) 基本上已经成为 React Native 中的 Next.js。但它适合_你_吗？Jack 权衡了利弊。

📄 [我们如何通过视觉回归测试尽早捕获 UI 错误](https://javascriptweekly.com/link/177084/web) – 使用 Playwright 及其[视觉比较](https://javascriptweekly.com/link/177085/web)功能。Tommaso Ruscica

📺 [通过构建"马里奥"学习 JavaScript](https://javascriptweekly.com/link/177086/web) – Ania 一贯易于跟随的综合教程之一。Ania Kubow

📄 [构建具有响应式背景渐变的 3D 无限轮播](https://javascriptweekly.com/link/177087/web) Clément Grellier

📄 [JS 中的错误链：使用 Error 的 cause 进行更清晰的调试](https://javascriptweekly.com/link/177088/web) Matt Smith

## 🛠 代码和工具

![imgui-react-runtime](@@CDN@@/assets/img/web/JavaScriptWeekly4/img-03.webp)

[imgui-react-runtime：React + Dear ImGui + Static Hermes](https://javascriptweekly.com/link/177089/web) — 当作者几周前在 X 上[预告这个演示](https://javascriptweekly.com/link/177090/web)时，我不确定它是否会发布，但它来了。一种使用 React 和流行的轻量级 GUI 库 [Dear ImGui](https://javascriptweekly.com/link/177091/web) 组合原生应用的新方法。

[Baseline JavaScript 的 ESLint 插件](https://javascriptweekly.com/link/177092/web) — 上个月 [Baseline 工具黑客马拉松](https://javascriptweekly.com/link/177093/web)的获胜者是一个 ESLint 插件，它标记使用比你配置的 [Baseline](https://javascriptweekly.com/link/177094/web) 目标（现代浏览器广泛支持的功能）更新的功能的代码。

[可定制的表单和调查 JavaScript 库](https://javascriptweekly.com/link/177095/web) — 创建品牌化的动态表单，完全控制设计、逻辑和数据存储。

[pnpm 10.21：更安全的安装和更智能的运行时管理](https://javascriptweekly.com/link/177096/web) — 现在安装依赖项所需的 Node 版本（在其 engines.runtime 字段中声明），这意味着 CLI 应用和 postinstall 脚本将使用指定版本运行。trustPolicy 设置还通过在包的信任级别下降时拒绝安装来增加对供应链攻击的保护。

[Ink 6.5：使用 React 构建交互式 CLI 应用](https://javascriptweekly.com/link/177097/web) — 一个[使用非常广泛](https://javascriptweekly.com/link/177098/web)的基于终端的 React 渲染器，用于使用组件构建响应式终端应用。v6.5 值得注意的是添加了[增量渲染选项](https://javascriptweekly.com/link/177099/web)。

![vis-timeline](@@CDN@@/assets/img/web/JavaScriptWeekly4/img-04.webp)

[vis-timeline 8.4](https://javascriptweekly.com/link/177100/web) – 跨时间可视化数据的交互式控件，如上所示。[这里有很多示例](https://javascriptweekly.com/link/177102/web)。

[rasterizeHTML.js 1.4](https://javascriptweekly.com/link/177103/web) – 将 HTML 渲染到 canvas 元素中。现在也支持 [OffscreenCanvas](https://javascriptweekly.com/link/177104/web)。

[file-type 21.1](https://javascriptweekly.com/link/177105/web) – 检测 Node 和浏览器中文件、流或数据的文件类型。

[Svelte SEO 2.0](https://javascriptweekly.com/link/177106/web) – 为搜索引擎和社交媒体优化你的 Svelte 应用。

[isomorphic-git 1.35](https://javascriptweekly.com/link/177107/web) – Node 和浏览器的纯 JS git 实现。

## 📰 分类广告

使用 [STRICH](https://javascriptweekly.com/link/177108/web) 为你的 Web 应用添加闪电般快速的设备端 1D/2D 条码扫描。简单集成，简单定价，[免费试用和演示！](https://javascriptweekly.com/link/177108/web)

[还在手动编写测试吗？](https://javascriptweekly.com/link/177109/web)了解为什么像 Dropbox、Notion 和 Lattice 这样的现代工程团队依赖 [Meticulous](https://javascriptweekly.com/link/177109/web) 来运行 E2E UI 测试。

[使用 Next.js 在几分钟内启动你的 Shopify 店面](https://javascriptweekly.com/link/177110/web) - 开源启动器，具有动态 OG 图像、AI 向量搜索和 Vercel 工具栏。

🎨 [今天免费试用 Pintura 图像编辑器](https://javascriptweekly.com/link/177111/web)，在几分钟内为你的 Web 应用添加精美的裁剪、旋转和注释体验。

## 📢 生态系统中的其他地方

![OWASP Top 10](@@CDN@@/assets/img/web/JavaScriptWeekly4/img-05.webp)

一些在更广泛领域中其他有趣故事的汇总：

- 🔒 OWASP（开放 Web 应用安全项目）发布了[2025年十大 Web 应用安全威胁列表](https://javascriptweekly.com/link/177112/web)
- 🤖 一位 LLM 的激烈批评者[花了一个月时间进行"聊天导向编程"](https://javascriptweekly.com/link/177116/web)，虽然他发现这个体验"令人沮丧"，但他承认它有价值，并且是一个可行的选择_"如果你对痛苦的容忍度足够高的话"_
- 🧊 想过[实现一个基于体素的引擎](https://javascriptweekly.com/link/177115/web)来获得类似 Minecraft 的体验吗？使用（非常 Rust 风格的）伪代码，以保持永恒性，让你享受自己实现的乐趣
- 关于 [Git 中 monorepos、multi-repo、submodule 和 subtree 设置之间的区别](https://javascriptweekly.com/link/177113/web)的解释
- 💻 如果你喜欢收集会议贴纸，你可能会喜欢[这个数百人贴满贴纸的笔记本电脑画廊](https://javascriptweekly.com/link/177118/web)，甚至可能想提交你自己的。我花了一些时间才找到任何 JavaScript 贴纸，但它们在那里...

## 🎂 生日快乐！

P.S. *JavaScript Weekly* 本周满十五岁了！感谢你们所有人的阅读，特别是从第一期开始仍然订阅的人。我们有一段时间没有查看统计数据了，但我们知道你们中有一些人！:-)

---

_原文链接：[JavaScript Weekly #761](https://javascriptweekly.com/issues/761)_
