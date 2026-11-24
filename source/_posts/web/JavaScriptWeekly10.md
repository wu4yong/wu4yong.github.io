---
title: JavaScript周刊-10
date: 2018-03-18 17:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## January 6, 2026

🎉 **新年快乐。JavaScript Weekly 现在改为每周二发布**，所以我们现在来了！让我们看看 2026 年会带来什么。

![2025 年 JavaScript 明星项目](@@CDN@@/assets/img/web/JavaScriptWeekly10/img-01.webp)

## 2025 年 JavaScript 明星项目

[2025 年 JavaScript 明星项目（The 2025 JavaScript Rising Stars）](https://javascriptweekly.com/link/178794/web) — 每年年初，Michael 都会汇总前一年在 GitHub 上最受欢迎的 JavaScript 项目。在连续两年位居榜首后，shadcn/ui 被 [n8n](https://javascriptweekly.com/link/178795/web) 和 [React Bits](https://javascriptweekly.com/link/178796/web) 超越，降至第三位。这是一个精彩的汇总，现在已经是第十年了，还包含了一些行业专家的评论。Michael Rambeau 等人

## 让不稳定的测试成为过去

[让不稳定的测试成为过去（Make Flaky Tests a Last-Year Problem）](https://javascriptweekly.com/link/178793/web) — Meticulous 创建并维护一个不断演进的端到端 UI 测试套件，开发者无需额外工作。基于 Chromium 构建，具有确定性引擎，它是唯一能够消除测试不稳定性的测试工具。受到 Dropbox、Notion 和 Lattice 的信赖。Meticulous Ai 赞助

## MicroQuickJS：Fabrice Bellard 的新 JavaScript 引擎

[MicroQuickJS：Fabrice Bellard 的新 JavaScript 引擎（MicroQuickJS: A New JavaScript Engine from Fabrice Bellard）](https://javascriptweekly.com/link/178797/web) — [Fabrice](https://javascriptweekly.com/link/178798/web)，世界上最多产的开发者之一，以创建 FFmpeg、QEMU 和 [QuickJS](https://javascriptweekly.com/link/178799/web) 而闻名，他带着一个新的 JavaScript 引擎回来了，这个引擎面向嵌入式系统，可以在仅 10KB 的 RAM 上运行。Fabrice Bellard

💡 [关于 MicroQuickJS 在 Hacker News 上的讨论](https://javascriptweekly.com/link/178800/web) 特别丰富。Redis 的创建者 Salvatore Sanfilippo 甚至指出，如果这个在 2010 年就存在，Redis 会使用 JavaScript 作为其脚本语言，而不是 Lua。

**简讯：**

- [pnpm](https://javascriptweekly.com/link/178855/web) 的主要维护者 Zoltan Kochan 回顾了 [2025 年对该项目来说是变革性的一年](https://javascriptweekly.com/link/178801/web)。
- 如果您错过了 [我们 2025 年的最后一期](https://javascriptweekly.com/link/178854/web)，请务必查看。我们对 JavaScript 世界进行了月度回顾，并分享了年度十大链接。
- [WebF](https://javascriptweekly.com/link/178802/web) 是一个新的符合 WHATWG 标准的 Flutter Web 运行时，因此您可以使用更典型的 JS 技术栈（React、Vue 等）构建 Flutter 应用的部分内容。

**发布：**

- [pnpm 10.27](https://javascriptweekly.com/link/178803/web) – 这个高效（且日益注重安全）的替代包管理器进行了一些调整，包括一个设置，允许忽略发布超过指定时间的包的信任策略检查。
- [Ink 6.6](https://javascriptweekly.com/link/178804/web) – 使用 React 构建 CLI 应用，被 Claude Code、Gemini CLI [以及许多其他项目](https://javascriptweekly.com/link/178805/web) 使用。
- 🎨 [Color.js v0.6](https://javascriptweekly.com/link/178806/web) – 这个流行的符合标准的颜色转换和操作库接近其最终的 1.0 版本。
- [Prisma 7.2](https://javascriptweekly.com/link/178807/web)、[Deno 2.6.4](https://javascriptweekly.com/link/178808/web)

## 📖 文章和视频

[如何使用静态 Hermes 将 JavaScript 编译为 C](https://javascriptweekly.com/link/178809/web) — [Parcel](https://javascriptweekly.com/link/178810/web) 的创建者正在将项目的部分内容移植到 Rust，但这在与现有 JavaScript 插件交互时带来了一些挑战，特别是在没有运行时 JS 解释器的情况下。将 JavaScript 编译为可直接调用的 C 库是可能的！Devon Govett

[使用 Deno 构建恐龙跑酷游戏](https://javascriptweekly.com/link/178811/web) — Deno 官方博客上的一系列文章（[第二部分](https://javascriptweekly.com/link/178812/web) 和 [第三部分](https://javascriptweekly.com/link/178813/web) 也可用），您可以自己重现类似于 Chrome 的 [恐龙游戏](https://javascriptweekly.com/link/178814/web) 的项目。Jo Franchetti

[CERN 如何通过 TimescaleDB 将存储减少 95%，查询速度提高 40 倍](https://javascriptweekly.com/link/178816/web) — 了解 CERN 工程师如何通过现代化大型强子对撞机的时间序列数据来提高性能、扩展性和成本效率。Tiger Data（TimescaleDB 的创建者）赞助

[修复 TypeScript 性能问题：一个案例研究](https://javascriptweekly.com/link/178817/web) — 一个基于大型 monorepo 的 TypeScript 项目在智能感知、类型检查时间和构建速度方面遇到了问题，但 Solomon 的团队找到了一些显著改进的方法。Solomon Hawk

[为什么数组的对象（SoA 模式）优于交错数组](https://javascriptweekly.com/link/178818/web) — 深入探讨 JavaScript 性能的一个话题。Royal Bhati

📄 [Brendan Eich 警告不要“急于用 Web UX 替代原生”，因为 Windows 11 更依赖 WebView2 和 Electron](https://javascriptweekly.com/link/178819/web) Windows Latest

📄 [仅用 200 行 JavaScript 实现流式 JSON](https://javascriptweekly.com/link/178820/web) Krasimir Tsonev

📄 [Signals vs 基于查询的编译器](https://javascriptweekly.com/link/178821/web) Marvin Hagemeister

📄 [JavaScript 依赖地狱的九个级别](https://javascriptweekly.com/link/178822/web) Andrew Nesbitt

📄 [如何使用 Three.js 和 Rapier 创建像素到体素的视频掉落效果](https://javascriptweekly.com/link/178823/web) Junichi Kasahara

## 🛠 代码和工具

![Schedule-X 3.6](@@CDN@@/assets/img/web/JavaScriptWeekly10/img-02.webp)

[Schedule-X 3.6：Material Design 风格的日历和日期选择器](https://javascriptweekly.com/link/178824/web) — 提供 React/Preact、Vue、Svelte、Angular 或纯 JS 组件形式。开源，但有包含额外功能的高级版本。[GitHub 仓库](https://javascriptweekly.com/link/178825/web)。Tom Österlund

📄 [jsPDF 4.0：客户端 JavaScript PDF 生成](https://javascriptweekly.com/link/178826/web) – 可以动态创建票据、文档、证书等。提供[实时演示](https://javascriptweekly.com/link/178827/web) 以及[详细文档](https://javascriptweekly.com/link/178828/web)。Parallax

[SurveyJS：用于自定义 Web 表单的 JavaScript 库](https://javascriptweekly.com/link/178856/web) – 完全拥有您的数据。在您的应用中构建 JSON 驱动的表单，不受 SaaS 限制。SurveyJS 赞助

[Bruno 3.0：一个开源的 HTTP API 客户端应用](https://javascriptweekly.com/link/178830/web) — 有很多具有不同功能级别的“API 客户端”工具，但这个是开源的，完全用 JavaScript 构建。v3.0 对 UI 进行了全面改进，添加了用于分组的工作区等功能。[GitHub 仓库](https://javascriptweekly.com/link/178831/web)。Bruno Software Inc.

[JoltPhysics.js 1.0](https://javascriptweekly.com/link/178832/web) – 一个流行的 C++ 物理库现在可以通过 Emscripten 在 JavaScript 中使用。在这里查看[众多演示](https://javascriptweekly.com/link/178833/web)。

🎶 [ChordSheetJS 13.0](https://javascriptweekly.com/link/178834/web) – 用于解析和格式化和弦与和弦表的库。（[演示](https://javascriptweekly.com/link/178835/web)）

[Middy 7.0](https://javascriptweekly.com/link/178836/web) – 用于 AWS Lambda 的 Node.js 中间件引擎。现在支持 Durable Functions。

[PlayCanvas glTF Viewer 5.8](https://javascriptweekly.com/link/178837/web) – 支持 glTF 2.0 和 PLY 的 3D 模型查看器。

[k6 1.5](https://javascriptweekly.com/link/178838/web) – 现代 Go + JavaScript 驱动的负载测试工具。（[主页](https://javascriptweekly.com/link/178839/web)）

📊 [Recharts 3.6](https://javascriptweekly.com/link/178840/web) – 流行的基于 D3 的 React 图表库。

[NATS.js 3.3](https://javascriptweekly.com/link/178841/web) – NATS 消息系统的 JavaScript 客户端。

## 📰 分类广告

🔑 让用户使用 [Clerk](https://javascriptweekly.com/link/178842/web) 创建自己的 API 密钥。内置 UI 组件、范围、过期和撤销功能。[现已公开测试](https://javascriptweekly.com/link/178842/web)。

[Trigger.dev](https://javascriptweekly.com/link/178843/web) 处理队列、重试和长时间运行的任务，让您能够可靠地构建生产级的代理和 TypeScript 工作流，在规模化场景下保持可靠性。

## 📢 生态系统中的其他地方

![CSS Grid Lanes](@@CDN@@/assets/img/web/JavaScriptWeekly10/img-03.webp)

多年来，Mozilla、Apple 和 CSS 工作组一直致力于将“masonry”布局（如上图）原生引入 CSS。这个概念现在被称为 *CSS Grid Lanes*，[这里是它的工作原理](https://javascriptweekly.com/link/178844/web)。您可以在 Safari Technology Preview 234 中尝试。

Addy Osmani 分享了 [在 Google 工作 14 年的 21 条宝贵经验](https://javascriptweekly.com/link/178846/web)。对于长期保持有能力和投入的工程师来说，这是一些很好的通用建议。

Andy Pavlo 整理了一份关于 [2025 年数据库领域的动态](https://javascriptweekly.com/link/178847/web) 的精彩回顾。Simon Willison 对 [2025 年的大型语言模型](https://javascriptweekly.com/link/178848/web) 也进行了类似的回顾。

🤖 Mattias Geniar 解释了 [AI 如何让 Web 开发重新变得有趣](https://javascriptweekly.com/link/178849/web)（至少对他而言）。

*Ultimate Linux* 是一个有趣的实验，旨在 [完全用 JavaScript 构建一个最小的 Linux 用户空间](https://javascriptweekly.com/link/178850/web)。

---

_原文链接：[JavaScript Weekly #767](https://javascriptweekly.com/issues/767)_
