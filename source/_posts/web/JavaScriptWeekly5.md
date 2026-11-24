---
title: JavaScript周刊-5
date: 2018-03-16 20:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## November 21, 2025

![Angular v21](@@CDN@@/assets/img/web/JavaScriptWeekly5/img-01.webp)

## 主要文章

[Google 宣布 Angular v21](https://javascriptweekly.com/link/177388/web) — Google 团队全力以赴推出了这个流行 JavaScript 框架的重大版本。他们制作了一个[复古游戏主题的冒险式新特性导览](https://javascriptweekly.com/link/177389/web)，以及展示功能的顶级视频，包括基于信号的新表单方法、用于 AI 驱动工作流的 MCP 服务器、专注于可访问性的无头组件库，甚至还有一个新的"Angular AI 导师"来快速上手。

[Authentication. Complete, Not Complex](https://javascriptweekly.com/link/177387/web) — const fusionAuth = {  builtFor: "developers", documentedFor: "humans", supportedBy: "experts"};

## 简讯：

- Devographics 的年度 [*State of React* 调查](https://javascriptweekly.com/link/177391/web)现在再次开放。这是[去年的结果](https://javascriptweekly.com/link/177392/web)
- 🎤 TypeScript 的 Daniel Rosenwasser 和 Jake Bailey [上了 TypeScript.fm 播客](https://javascriptweekly.com/link/177393/web)谈论 TypeScript 6 和 7 即将推出的内容
- 📗 TC-39 成员 James M. Snell 正在为 Manning 出版社[编写一本名为 *JavaScript in Depth* 的书](https://javascriptweekly.com/link/177394/web)。最终出版预计在 2026 年年中，但早期访问中已经有四章可用
- [CSS Grid 支持即将来到 React Native](https://javascriptweekly.com/link/177395/web)

## 发布：

- [Prisma 7.0](https://javascriptweekly.com/link/177396/web) – 流行的 Node.js 和 TypeScript ORM。无 Rust 的 Prisma Client 现在是默认设置
- [pnpm 10.23](https://javascriptweekly.com/link/177397/web) – 快速、节省空间的包管理器
- [Node.js v25.2.1 (Current)](https://javascriptweekly.com/link/177398/web)、[Astro 5.16](https://javascriptweekly.com/link/177474/web)

## 📖 文章和视频

![TC39 会议](@@CDN@@/assets/img/web/JavaScriptWeekly5/img-02.webp)

> 照片经 [Rob Palmer](https://javascriptweekly.com/link/177399/web) 许可使用

**本周的 TC39 会议：** Ecma TC39 委员会（ECMAScript / JavaScript 背后的设计团队）[本周第111次会议](https://javascriptweekly.com/link/177400/web) _（如上图）_ 讨论语言提案。会议记录将在几周后发布，但几个提案确实取得了一些进展：

- [Iterator Sequencing](https://javascriptweekly.com/link/177401/web) 进入第 4 阶段
- [Joint Iteration](https://javascriptweekly.com/link/177402/web)、[Iterator Join](https://javascriptweekly.com/link/177403/web) 和 [Await dictionary of Promises](https://javascriptweekly.com/link/177404/web) 进入第 2.7 阶段
- [Error.captureStackTrace](https://javascriptweekly.com/link/177406/web)、[import .. with {type: "text"}](https://javascriptweekly.com/link/177407/web) 和 [Object.keysLength](https://javascriptweekly.com/link/177408/web) 都进入第 2 阶段
- [Intl Unit Protocol](https://javascriptweekly.com/link/177409/web) 也达到第 1 阶段，提供了一种用单位注释数量的方法
- [Typed Array Find Within](https://javascriptweekly.com/link/177410/web) 进入第 1 阶段。想象一下 TypedArrays 的原生 indexOf 类型方法

> _注意：在这里了解更多关于 [TC39 阶段的含义](https://javascriptweekly.com/link/177412/web)。_

[Tooltip 组件不应该存在](https://javascriptweekly.com/link/177413/web) — Dominik 以其一贯的博学方式挑战了一些常见智慧。独立的 tooltip 组件与使用它们的底层 UI 功能分离时，是错误的抽象。这种思维也可以应用于许多其他 UI 功能，所以这个广泛的想法很值得考虑。

[Agentic Postgres：让你的 Agents 大展身手](https://javascriptweekly.com/link/177414/web) — 更快地构建 AI 应用：内置内存、搜索和免费可分叉数据库的 Postgres。在 Tiger 上免费试用。

[使用 JavaScript 宏在 LibreOffice 中实现 Wordle](https://javascriptweekly.com/link/177415/web) — 这是那些有趣的事情之一，真正的价值在于了解到你可以用 JavaScript 编写 LibreOffice 脚本。

[GitHub Actions 中的自动化 NPM 密钥轮换](https://javascriptweekly.com/link/177416/web) — 如果你已经构建了一个自动发布到 npm 的系统，由于[本月的 npm 安全更改](https://javascriptweekly.com/link/177417/web)，你可能不得不改变一些东西。如果你还没准备好切换到可信发布，这里有一种方法可以保持运转。

[我打赌你不知道可以用 Chrome DevTools 做的六件事](https://javascriptweekly.com/link/177418/web) — 第一部分在这里涵盖了前三个，[第二部分涵盖了最后三个](https://javascriptweekly.com/link/177419/web)。涵盖时间函数、DOM 观察、用户操作重放等。

📄 [让 TypeScript 默认不可变的实验](https://javascriptweekly.com/link/177420/web) – _"我想知道：是否可能让 TypeScript 值默认不可变？"_ Evan Hahn

📄 [如何使用 GSAP 构建电影级 3D 滚动体验](https://javascriptweekly.com/link/177422/web) Joseph Santamaria

📄 [我们如何将 76,000 个测试从 Enzyme 迁移到 React Testing Library](https://javascriptweekly.com/link/177424/web) – HubSpot 的大型 React 测试迁移故事。Charley Pugmire (HubSpot)

📄 [如何在 Node.js 代码中"正式"弃用方法](https://javascriptweekly.com/link/177426/web) – 你知道 Node 的 [deprecate 方法](https://javascriptweekly.com/link/177428/web)吗？Stefan Judis

## 🛠 代码和工具

![Webpack Bundle Analyzer](@@CDN@@/assets/img/web/JavaScriptWeekly5/img-03.webp)

[Webpack Bundle Analyzer 5.0：可视化 Webpack 的输出](https://javascriptweekly.com/link/177431/web) — 官方 Webpack 插件和 CLI 工具，以交互式可缩放树状图的形式显示 bundle 内容，这样你就可以深入了解 bundle 中占用空间的内容（然后最好进行优化）。

[TanStack DB 0.5，现在支持查询驱动同步](https://javascriptweekly.com/link/177433/web) — TanStack DB 是一个客户端优先的响应式数据存储，使用差分数据流来支持实时关系查询、亚毫秒级增量更新和无缝乐观写入。在 v0.5 中，组件的查询也成为 API 调用。_"只需编写你的查询，TanStack DB 就会准确地找出要获取什么。"_

[还在手动编写测试吗？](https://javascriptweekly.com/link/177435/web) — 了解为什么像 Dropbox、Notion 和 Lattice 这样的现代工程团队依赖 Meticulous 来运行 E2E UI 测试。

[Brimstone：用 Rust 编写的新 JavaScript 引擎](https://javascriptweekly.com/link/177436/web) — 加入[数百个可用的 JS 引擎](https://javascriptweekly.com/link/177437/web)，Brimstone 具有强大的语言支持（规范的 97%），_非常_小，但仍然是一个正在进行的工作。

[VueFinder：Vue 3 的文件管理组件](https://javascriptweekly.com/link/177438/web) — 为用户提供响应式、类原生的文件资源管理器界面来组织、预览和管理文件。

[is-online 12.0：检查互联网连接是否正常](https://javascriptweekly.com/link/177439/web) — 在 Node 和浏览器中工作，并使用各种方法来检查互联网是否真正可用。

[PlayCanvas glTF Viewer 5.7](https://javascriptweekly.com/link/177440/web) – 支持 glTF 2.0 和 PLY 的 3D 模型查看器。

[Wasp 0.19](https://javascriptweekly.com/link/177442/web) – [Wasp](https://javascriptweekly.com/link/177444/web) 是一个类似 Rails 的框架，构建在 Node、React 和 Prisma 之上。

[Neo.mjs 11.7](https://javascriptweekly.com/link/177445/web) – 用于快速、类桌面 Web 应用的多线程框架。

[Inquirer.js 13.0](https://javascriptweekly.com/link/177447/web) – 流行的 Node.js 交互式 CLI 控件库。

[Plotly.js 3.3](https://javascriptweekly.com/link/177449/web) – 独立数据可视化库。

[Rockpack 7.0](https://javascriptweekly.com/link/177451/web) – React 应用启动器/生成器。

[Fresh 2.2](https://javascriptweekly.com/link/177452/web) – Deno 驱动的 Web 框架。

## 📰 分类广告

[使用 BuildKit 和 Depot 更快地构建 Docker 镜像](https://javascriptweekly.com/link/177454/web)。并行执行、去重和自动扩展减少 CI 等待时间。

🎨 [今天免费试用 Pintura 图像编辑器](https://javascriptweekly.com/link/177455/web)，在几分钟内为你的 Web 应用添加精美的裁剪、旋转和注释体验。

_[The Road to Next](https://javascriptweekly.com/link/177473/web)_ 是 Robin Wieruch 的课程，用于学习 Next.js 15 和 React 19 的全栈 Web 开发。是准备超越前端的 JavaScript 开发者的完美搭配。

## 📢 生态系统中的其他地方

![Bach's Organ](@@CDN@@/assets/img/web/JavaScriptWeekly5/img-04.webp)

一些在更广泛领域中其他有趣故事的汇总：

- 你在周二受到 Cloudflare 长时间中断的影响了吗？如果是这样，你可能想[了解发生了什么的所有细节](https://javascriptweekly.com/link/177458/web)（这与代码有关）。尽管不便，但这是一个出色的事故报告示例
- 📗 [WebAssembly from the Ground Up](https://javascriptweekly.com/link/177461/web) 是一本新的（付费）书，引导你使用 JavaScript 构建编译器。有一个[示例 PDF](https://javascriptweekly.com/link/177462/web) 展示了三十页的内容——看起来很有前途
- 一个关于[知名字体公司如何追究另一家公司](https://javascriptweekly.com/link/177464/web)不存在的许可证违规的精彩叙述
- Josef Strzibny [研究了 Reddit 新披露的"参与度"数字](https://javascriptweekly.com/link/177465/web)，涉及各种编程 subreddit。Reddit 用户显然喜欢小众，因为 /r/node、/r/react 和 /r/nextjs 都轻松击败了 /r/javascript 的参与度数字
- 上面这个自动更正驱动的 Hacker News 标题让我笑了。如果你喜欢巴赫或一般的管风琴音乐，[▶️ 在这里听听"新"作品](https://javascriptweekly.com/link/177468/web)
- [Amazon RDS for PostgreSQL 现在支持 Postgres 18](https://javascriptweekly.com/link/177469/web)

---

_原文链接：[JavaScript Weekly #762](https://javascriptweekly.com/issues/762)_
