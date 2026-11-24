---
title: JavaScript周刊-1
date: 2018-03-15 10:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## October 24, 2025

![Vitest](@@CDN@@/assets/img/web/JavaScriptWeekly1/img-01.webp)

[Vitest 4.0 发布：Vite-Native 测试框架](https://javascriptweekly.com/link/176085/web) — 这款由 Vite 驱动、兼容 Jest 的测试框架引入了[视觉回归测试](https://javascriptweekly.com/link/176086/web)，使其 ["浏览器模式"](https://javascriptweekly.com/link/176087/web) 稳定（用于直接在浏览器中运行测试），增加 Playwright Traces 支持，以及更多改进。依然不确定吗？[你可以在这里与其他测试运行器进行比较](https://javascriptweekly.com/link/176088/web)。

> 💡 从 Angular 21 开始，[Vitest 将成为 Angular 的默认测试运行器](https://javascriptweekly.com/link/176089/web)，取代 Karma 和 Jasmine。

[为 JavaScript 开发者提供最可定制的身份验证方案](https://javascriptweekly.com/link/176084/web) — 看看 FusionAuth 如何让您在无需从头构建的情况下获得完全的定制自由。创建完全符合品牌风格的登录体验并且能够与任何 JavaScript 技术栈集成。可下载并且自托管。[观看免费的、随时可用的网络研讨会](https://javascriptweekly.com/link/176084/web)。

[Next.js 16 发布](https://javascriptweekly.com/link/176090/web) — 与本周的 Next.js Conf 同时发布（[你可以在这里观看▶️直播](https://javascriptweekly.com/link/176091/web)），这款热门的 React 框架新增了显性缓存组件、用于 AI 辅助调试的 MCP 服务器，同时 Turbopack 和 React Compiler 的支持均已趋于稳定，此外还有更多功能更新。

[▶ Nordic.js 2025 演讲视频](https://javascriptweekly.com/link/176092/web) — [Nordic.js](https://javascriptweekly.com/link/176093/web) 在这个月早些时候举行了会议，他们刚刚分享了精彩的演讲视频。亮点包括 Christoph Porteneuve [讲解 ES2026 和 ES2027 相关内容](https://javascriptweekly.com/link/176094/web)，Kyle Simpson [探讨密码钥匙（passkeys）](https://javascriptweekly.com/link/176095/web)相关话题，以及 Sara Vieira 深入讲解如何[用 JavaScript 编写模拟器](https://javascriptweekly.com/link/176096/web)。

## 简讯：

- 我们已经十年没有经常提及 [Backbone.js](https://javascriptweekly.com/link/176097/web) 了，但是在 React 时代之前，它可是一项非常重要的技术。Panphora 在 [2025 年对比 React 和 Backbone](https://javascriptweekly.com/link/176098/web)，并思考了我们在 15 年里取得了多大的进步
- Deno 团队分享了其 [Deno Deploy 平台的最新动态](https://javascriptweekly.com/link/176099/web)
- 距离[参加 State of JavaScript 2025 调查](https://javascriptweekly.com/link/176100/web)只剩下一周时间了
- [URL Pattern API 现在已作为基础版全新上线](https://javascriptweekly.com/link/176101/web)

## 发布：

- [Boa v0.21](https://javascriptweekly.com/link/176102/web) – 这是一款基于 Rust 开发的 JavaScript 引擎的重大版本更新，其中包含了对 Temporal 的支持
- [Bun v1.3.1](https://javascriptweekly.com/link/176103/web) – 在重大更新的 [Bun 1.3 版本](https://javascriptweekly.com/link/176104/web)之后推出的一个点发布版本，对各方面进行了幅度较小的改进
- [Biome v2.3](https://javascriptweekly.com/link/176105/web) – 快速格式化/代码检查工具增加了对 Vue、Svelte 和 Astro 的支持
- [ESLint v9.38.0](https://javascriptweekly.com/link/176106/web)、[Astro 5.15](https://javascriptweekly.com/link/176107/web)、[pnpm 10.19](https://javascriptweekly.com/link/176108/web)、[Rspack 1.6.0 Beta 1](https://javascriptweekly.com/link/176148/web)

## 📖 文章和视频

![import json](@@CDN@@/assets/img/web/JavaScriptWeekly1/img-02.webp)

[导入 VS 获取 JSON](https://javascriptweekly.com/link/176110/web) — 你已经使用 `import` 来导入代码，但是如何加载 JSON 呢？[导入属性](https://javascriptweekly.com/link/176111/web)，现在在浏览器中得到广泛支持，用它加载 JSON 成为了可能，但是这比用 `fetch` 有什么优势吗？Jake 正在调查。

[重新思考 JavaScript 中的异步循环](https://javascriptweekly.com/link/176112/web) — 在循环中使用 await 会使你的异步操作一个接一个地运行，而不是一次性全部运行。而使用 `map()` 搭配 await？它甚至不会等待。Matt 分解了一些真正有效的模式，以及为什么 forEach 配合 async 容易出错。

[使用现成的后端更快地构建你的应用](https://javascriptweekly.com/link/176113/web) — 忘掉 DevOps 的烦恼。OneEntry 为前端开发者提供了一个现成的云后端，配有内置数据库、直观的管理面板和适应任何项目的灵活数据模型。

[使用 Ace 构建 CLI：在 Node 和 Bun 中创建书签应用](https://javascriptweekly.com/link/176114/web) — [Ace](https://javascriptweekly.com/link/176115/web)（[GitHub 仓库](https://javascriptweekly.com/link/176116/web)）是一个由 [AdonisJS](https://javascriptweekly.com/link/176117/web) 团队构建的 CLI 应用框架，你可能之前没有遇到过。

[用 TypeScript 解决纽约时报的 Pips 谜题](https://javascriptweekly.com/link/176118/web) — 我喜欢玩纽约时报的各种谜题，尽管我不太喜欢他们最新的谜题：Pips。尽管如此，考虑如何用算法来解决它是一个有趣的谜题。

📄 [React 和 Remix 选择了不同的未来](https://javascriptweekly.com/link/176119/web)

📄 [使用 Next.js App Router 一年 — 为什么我们要转向其他方案](https://javascriptweekly.com/link/176120/web)

📄 [TypeScript 中的 4 种非常规类型转换方法](https://javascriptweekly.com/link/176121/web)

## 🛠 代码和工具

[Ky 1.13：适用于浏览器的小巧、优雅的基于 Fetch 的 HTTP 客户端](https://javascriptweekly.com/link/176124/web) — 使 Fetch API 更易于使用（[如此处所示](https://javascriptweekly.com/link/176125/web)），也是 Axios 的一个很好的现代替代品。[v1.13](https://javascriptweekly.com/link/176126/web) 添加了[一个"上下文"特性](https://javascriptweekly.com/link/176127/web)，使创建可以接受自定义参数的可重用 API 客户端变得更容易。

[JustGage 2.0：绘制和动画化仪表盘风格的 SVG 仪表](https://javascriptweekly.com/link/176122/web) — 这是一个十多年前启动的项目的重大版本更新，现在已经进入现代化，使用原生 SVG API。有一个 playground 让你可以尝试选项和仪表样式。

[Wallaby v3：通过结果流和缓存结果实现更智能的测试](https://javascriptweekly.com/link/176128/web) — 新的 Wallaby v3 流式传输实时结果，使用缓存执行实现即时启动，并优先处理活动文件，使 JS 和 TS 测试反馈比以往更快、更智能。

[Solito 5.0：结合 React Native 和 Next.js 的方式](https://javascriptweekly.com/link/176129/web) — [Solito](https://javascriptweekly.com/link/176130/web) 是 React Navigation 和 Next.js 的包装器，让你在构建跨平台应用时共享导航代码。v5.0 支持 Next.js 16 和 Expo 54，并且不再依赖 React Native Web。

[MaxIntervalCover：计算不重叠区间的最优子集](https://javascriptweekly.com/link/176131/web)

[p-limit 7.2](https://javascriptweekly.com/link/176132/web) – 以有限并发运行多个返回 promise 的和 async 函数。现在 `.map()` 可以接受可迭代对象，而不仅仅是数组。

[Repomix 1.8](https://javascriptweekly.com/link/176133/web) – 将整个仓库打包成一个对 LLM 友好的文件。现在有了 *Claude Code* 的官方插件。

[ESLint Markdown Language Plugin 7.5](https://javascriptweekly.com/link/176134/web) – 在 Markdown 文档中检查 JS/TSX 代码块。

## 📰 分类广告

🕳️ 🥊 [正在招聘：](https://javascriptweekly.com/link/176135/web) 加入 Holepunch 构建点对点互联网。无需服务器。开源、隐私优先。塑造应用的未来。全球远程。

[Meticulous 为你编写和维护 E2E UI 测试](https://javascriptweekly.com/link/176136/web)。专为高速团队打造，无法承受不稳定的测试。被 Notion、Dropbox、Wiz、Lattice 等公司所依赖。

## 📢 生态系统中的其他地方

一些在更广泛领域中其他有趣故事的汇总：

- Dr. Axel Rauschmayer 继续他的"面向初学者的 Web 开发"系列，[对 CSS 布局进行了相当宏大的概述](https://javascriptweekly.com/link/176137/web)，涵盖了 Flexbox、CSS Grid、媒体查询和容器查询。这是一个很棒的现代入门教程，即使你_不是_初学者
- 虽然还没有视频，但 Node.js TSC 成员 Ruy Adorno 上周在 [JSConf](https://javascriptweekly.com/link/176138/web) 上做了关于 [Node.js 的新特性和未来展望](https://javascriptweekly.com/link/176139/web)的演讲，并分享了他的幻灯片，这些幻灯片本身就很有价值
- 在 *X* 上，Tzvetan Milkov [展示了一个有趣的概念验证](https://javascriptweekly.com/link/176140/web)，用 React 驱动 [Dear ImGui](https://javascriptweekly.com/link/176141/web) GUI 库，使用 [Hermes](https://javascriptweekly.com/link/176142/web) JS 引擎来创建完全原生的应用
- [SpacetimeDB](https://javascriptweekly.com/link/176143/web) 是一个由 Rust 驱动的数据库/服务器组合，用于支持实时多人游戏，[其最新版本](https://javascriptweekly.com/link/176144/web)增加了对 TypeScript 模块的支持
- Dan Abramov 分享了[如何修复代码中任何 bug 的一些见解](https://javascriptweekly.com/link/176145/web)。这对大多数开发者来说是日常任务，但 Dan 很好地解释了简化 bug 复现的技巧
- [/dev/null 是符合 ACID 标准的数据库吗？](https://javascriptweekly.com/link/176146/web) 如果你_非常_努力地想象的话。

---

_原文链接：[JavaScript Weekly #758](https://javascriptweekly.com/issues/758)_

## 测试框架与框架发布补充

- Vitest 4.0 把 Browser Mode 移出实验阶段；provider 拆成独立包 `@vitest/browser-playwright`、`@vitest/browser-webdriverio`、`@vitest/browser-preview`，不再需要 `/// <reference>` 类型注释
- 视觉回归测试通过 `toMatchScreenshot` 断言完成，截图与基线图对比以发现样式和布局的意外变化；另有 `toBeInViewport` matcher 基于 IntersectionObserver 检查元素是否在视口内
- Playwright Traces 由 `test.browser.trace` 配置项或 `--browser.trace` 开启，追踪文件默认放在测试文件旁的 `__traces__` 目录，可用 Playwright Trace Viewer 打开；该能力仅在 Playwright provider 下可用
- Next.js 16 的 Cache Components 围绕 `"use cache"` 指令工作，缓存完全 opt-in，编译器在使用处自动生成缓存键；动态代码默认在请求时执行
- Next.js 16 同时带来 DevTools MCP，向 AI agent 提供路由、缓存、渲染行为知识，以及浏览器与服务端统一日志、错误堆栈和当前页面上下文；Turbopack 在开发与生产构建中均趋于稳定并成为新默认打包器，React Compiler 转为稳定但仍需显式开启

## HTTP 客户端与并发工具补充

- Ky 是基于 Fetch API 的轻量 HTTP 客户端，提供 `ky.post()` 等方法快捷方式、非 2xx 状态码按错误处理、失败重试、JSON 选项、超时与实例化自定义默认值等能力
- `context` 选项把用户自定义数据传给各个 hook，不污染请求本身；它保证始终是对象，顶层属性浅合并，可用来在 hook 里读取认证令牌或请求元数据
- p-limit 的 `limit.map(iterable, mapperFunction)` 以受限并发处理可迭代输入，mapper 接收元素值和索引，等价于对可迭代对象逐项调用受限后的函数并汇总结果

## 浏览器标准条目补充

- URLPattern 用声明式模式匹配 URL，提供构造器、`test()` 与 `exec()` 方法；MDN 兼容性表显示 Chrome 95、Edge 95、Firefox 142、Safari 26 起支持，Bun 1.3.4、Node.js 24、Deno 1.15 也已实现
- 导入 JSON 模块依赖导入属性，写法为 `import data from "./data.json" with { type: "json" }`；`type` 属性校验响应的媒体类型，若不是 JSON MIME 类型则导入失败
- 导入属性可用于静态 `import`、`export...from` 和动态 `import()`；未写 `type: "json"` 时，浏览器默认按 JavaScript 模块解析，JSON 响应会被严格 MIME 检查拦下

## 参考

- https://vitest.dev/blog/vitest-4
- https://nextjs.org/blog/next-16
- https://github.com/sindresorhus/ky
- https://github.com/sindresorhus/p-limit
- https://developer.mozilla.org/en-US/docs/Web/API/URLPattern
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with
