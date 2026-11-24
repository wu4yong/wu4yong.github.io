---
title: JavaScript周刊-33
date: 2018-03-29 04:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 790: 2026年6月16日

## [Flow 面向 TypeScript 用户（2026 版）](https://medium.com/flow-type/flow-for-typescript-users-in-2026-ad07ac0a2d92)

![flow](@@CDN@@/assets/img/web/JavaScriptWeekly33/img-01.webp)

Flow 是 Meta 为 JavaScript 打造的成熟类型化方言，多年来其语法已与 TypeScript 高度趋同。这篇文章梳理了两者目前的主要差异：Flow 更严格的默认设置拒绝了几种 TypeScript 严格模式仍然接受的易崩溃模式，同时也有自己独有的特性，比如详尽的 match 表达式。

*George Zahariev (Meta)*

---

## [来自 Anthropic + Master.Dev 的免费 Claude Code 课程](https://www.master.dev/)

编程正在快速变化，能够蓬勃发展的工程师将是那些能够指挥 AI 而不是盲目猜测的人。Anthropic 的 Lydia Hallie 在我们的 Claude Code 课程中教授的正是这一点，现在对所有人免费开放。

*Master.dev 赞助*

## [npm v12 将默认停止运行 Install Scripts](https://github.blog/changelog/2026-06-09-upcoming-breaking-changes-for-npm-v12/)

即将发布的 npm v12 将不再执行 `preinstall`/`install`/`postinstall` 脚本，除非你明确允许它们。你现在就可以使用 [npm 11.16.0](https://github.com/npm/cli/releases/tag/v11.16.0) 做好准备，它会针对 v12 将阻止的任何内容打印警告。

*GitHub*

## [🤖 代码变得更廉价了](https://htmx.org/essays/code-is-cheap/)

htmx 的创建者表示，虽然代码越来越容易生成，但*理解*仍然很昂贵，*"复杂性始终是我们最大的天敌"*。

*Carson Gross*

## 简讯

- pnpm 团队创建了一个[全新的 GitHub Action，可同时设置 `pnpm` 和 JS 运行时](https://github.com/marketplace/actions/setup-pnpm-with-runtime)（Node、Deno 或 Bun）。

- 🐈 [Compilecat](https://isaac-mason.github.io/compilecat/)（[仓库](https://github.com/isaac-mason/compilecat)）是一个全新的实验性 JavaScript 性能编译器，执行 [Closure](https://github.com/google/closure-compiler) 风格的优化。

- 多个重要项目正在 Beta/预发布阶段推进，包括 [SvelteKit 3.0](https://github.com/sveltejs/kit/releases/tag/%40sveltejs%2Fkit%403.0.0-next.4)、[Vue 3.6](https://github.com/vuejs/core/blob/minor/CHANGELOG.md#360-beta15-2026-06-11)、[Vite 8.1](https://github.com/vitejs/vite/blob/v8.1.0-beta.0/packages/vite/CHANGELOG.md#810-beta0-2026-06-15) 和 [Astro 7.0](https://github.com/withastro/astro/releases/tag/astro@7.0.0-beta.4)。

## 📖 文章和视频

### [TanStack 如何将 TypeScript 类型检查工作量削减高达 86%](https://tanstack.com/blog/announcing-tanstack-table-v9-beta)

TanStack Table v9（现已 Beta）将其功能模块化，但背后的泛型类型在 Alpha 阶段引入了明显的编辑器延迟。这篇深度文章展示了团队如何使用 `tsc` 诊断工具将类型检查工作量削减 62-86%，对任何编写类型密集型库的开发者都有借鉴意义。

*Kevin Van Cott (TanStack)*

---

### 🛠️ [2026 年 React 库和工具推荐](https://www.robinwieruch.de/react-libraries/)

每年 Robin 都会更新这篇文章，涵盖他对 React 生态系统核心库的有主见推荐清单。

*Robin Wieruch*

---

### [你的 AI 编写的测试能通过但证明不了任何东西。修复它](https://wallabyjs.com/)

Wallaby CLI 利用实时覆盖率和运行时数据，使测试生成智能化程度提升 10 倍，并且 Token 用量减少 3 倍。只需安装一个 Skill。

*Wallaby Team 赞助*

---

### [通过编辑 Hermes 字节码来修改 Kindle 的主页](https://blog.nicholastarta.com/changing-the-kindles-homepage-by-editing-hermes-bytecode/)

Kindle 的 UI 现在运行在 Hermes 驱动的 JavaScript 技术栈上。以下是你可以如何编辑 Hermes 生成的字节码来改变 Kindle UI 的行为。

*Nicholas Tarta*

---

### 📈 [让 numpy-ts 跑得和原生一样快](https://numpyts.dev/)

一个 TypeScript NumPy 移植版如何从比原生慢 15 倍提升到与原生持平——通过改变的并非是否使用 WASM，而是谁拥有字节的所有权。

*Nico Dupont*

---

## 🛠 代码与工具

### [eslint-plugin-unicorn 67.0: 超过 200 条强大的 ESLint 规则](https://github.com/sindresorhus/eslint-plugin-unicorn)

Sindre 精心策划的规则集大幅增长，仅在过去几周就新增或更新了近 100 条规则。例如强制要求更好的注释、限制嵌套调用的深度、优先使用 Temporal 而非 Date、以及在 URL 中优先使用 HTTPS 而非 HTTP。这些规则将真正挑战（并改善！）你的代码。

*Sindre Sorhus 等*

---

### [zod-compiler: 将 Zod Schema 编译为零开销的验证器](https://github.com/gajus/zod-compiler)

一个构建时编译器，可接入 Vite、webpack 等，并将现有 Schema 重写为优化过的、可 Tree-Shake 的验证器。声称验证速度快 2-75 倍，无需修改源代码，完整保留 Zod API。

*Gajus Kuizinas*

---

### [那个慢分析查询端点？这是数据库的问题](https://www.tigerdata.com/timescaledb?utm_source=cooperpress&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

管道、同步延迟、过期数据——这就是分离技术栈的代价。TimescaleDB 扩展了 Postgres，让你的应用保持快速。

*Tiger Data (TimescaleDB 创建者) 赞助*

---

### 📊 [billboard.js 4.0: 基于 D3 的 JavaScript 图表库](https://naver.github.io/billboard.js/)

即将满九年的 billboard.js 现在拥有全新的、可选的 Canvas 渲染模式（SVG 仍为默认），更小的包体积，以及在大数据集上更好的性能。有数百个演示，从甜甜圈图和漏斗图到重叠柱状图和雷达图。

*Jae Sung Park (NAVER)*

---

### [PolyCSS: DOM 的 CSS 3D 引擎](https://polycss.js.org/)

完全使用 CSS `matrix3d()` 变换在 DOM 中渲染带纹理的 3D 多边形网格——无需 WebGL 或 `<canvas>`。支持原生 JS、React 和 Vue。有[画廊](https://polycss.js.org/gallery)可供探索，还有[在线构建器](https://polycss.js.org/builder)可以亲自体验。

*LayoutitStudio*

---

## 📢 生态系统其他动态

### 🗺️ [MapKit JS 6：为现代 Web 开发者重建](https://webkit.org/blog/18027/discover-mapkit-js-6-rebuilt-for-todays-web-developer/)

![mapkit](@@CDN@@/assets/img/web/JavaScriptWeekly33/img-02.webp)

Apple 的地图服务 JavaScript SDK 进行了重大重构，为 Web 开发者带来了更好的性能和更现代的 API。

---

### 📊 [Tabulator: 交互式数据表格库](https://www.tabulator.info/)

![tabulator](@@CDN@@/assets/img/web/JavaScriptWeekly33/img-03.webp)

一个功能丰富的交互式数据表格库，适用于 JavaScript 应用。

---

*原文链接：[JavaScript Weekly Issue 790](https://javascriptweekly.com/issues/790)*
