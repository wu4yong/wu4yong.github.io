---
title: JavaScript周刊-25
date: 2018-03-24 20:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 782: 2026年4月21日

## [HyperFrames: 使用 HTML 和 JavaScript 创建视频](https://hyperframes.heygen.com/)

![hyperframes](@@CDN@@/assets/img/web/JavaScriptWeekly25/img-01.webp)

一个开源框架，用于使用 HTML 和 JavaScript 创建和渲染视频。本质上是 Remotion 的一个更简单的非 React 替代方案。它包含各种内置的块/组件用于常见视频效果和元素，也可以合成现有的视频和音频片段。[GitHub 仓库。](https://github.com/HeyGen/HyperFrames)

*HeyGen*

---

<div style="float:right; margin-left:16px; margin-bottom:8px;">
  <img  src="@@CDN@@/assets/img/web/JavaScriptWeekly25/img-02.webp" width="125">
</div>

## [还在手动编写测试？Meticulous AI 来了](https://www.meticulous.ai?utm_source=jsweekly&utm_medium=newsletter&utm_campaign=26q1&utm_content=primary)

Notion、Dropbox、Wiz 和 LaunchDarkly 现在使用着一种他们离不开的测试范式。Meticulous 由前 Palantir 工程师构建，能够自动创建持续演进的 E2E UI 测试套件，以零开发者投入提供详尽覆盖率。

*Meticulous 赞助*

## [始于一个 Roblox 作弊器的 Vercel 安全入侵事件](https://vercel.com/kb/bulletin/vercel-april-2026-security-incident)

一家 Vercel 员工使用的 AI 工具提供商的员工，被恶意软件（[捆绑在一个 Roblox 作弊器中！](https://webmatrices.com/post/how-a-roblox-cheat-and-one-ai-tool-brought-down-vercel-s-entire-platform)）入侵，攻击者利用这个立足点，通过 Google Workspace 访问到了一部分 Vercel 客户的环境变量。

*Vercel*

💡 Vercel 用户应[遵循这些步骤](https://vercel.com/kb/bulletin/vercel-april-2026-security-incident#recommendations)，但即使你不是 Vercel 用户，其薄弱环节是向第三方工具授予的 OAuth 授权，而这种模式几乎是普遍存在的。

## 简讯

- [Node.js 正在迈向默认支持 Temporal API](https://github.com/nodejs/node/pull/61806)，很可能在 [下周即将发布的](https://github.com/nodejs/node/pull/62526#issuecomment-4282061307) Node v26 中实现。

- Salesforce 生态系统的开发者习惯在其围墙花园内使用特定的框架；现在[你可以在 Salesforce 上构建原生 React 应用了。](https://developer.salesforce.com/blogs/2026/04/build-with-react-run-on-salesforce-introducing-salesforce-multi-framework)

- Rust 的官方包/包仓库 [crates.io](https://crates.io/) 正在[从 Ember.js 迁移到 Svelte 5。](https://blog.rust-lang.org/inside-rust/2026/04/17/crates-io-svelte-public-testing/)

## 版本发布

- [Node.js 24.15.0 (LTS)](https://nodejs.org/en/blog/release/v24.15.0) – `require(esm)` 和模块编译缓存被标记为稳定，并添加了 `--max-heap-size`。

- [Fable 5.0](https://fable.io/) – 一个成熟的 F# 转译器，目标语言为 JavaScript（及其他语言）。[v5.0](https://github.com/fable-compiler/Fable/releases/tag/5.0.0) 添加了 .NET 10 和 F# 10 支持。

- [uuid 14.0](https://github.com/uuidjs/uuid) – 创建符合 RFC9562 标准的 UUID（v1 至 v7）。

## 📖 文章和视频

### ▶ [Evan You 的 Vue 2026 年度演讲](https://www.youtube.com/watch?v=a9_Ud5MFTjU)

![state-of-vue](@@CDN@@/assets/img/web/JavaScriptWeekly25/img-03.webp)

一个月前，Evan You（Vue.js 和 VoidZero 的知名人物）发表了他的年度演讲。比以往更少聚焦于 Vue 本身（尽管 Vapor Mode"几乎准备就绪"），演讲重点涵盖了 Vite 生态系统的更新，包括 Vite 8、Vite+ 和 Void。

*Evan You / Vue.js Amsterdam*

---

### [如何在 700 万行 TypeScript 中解决 15,000 个循环依赖](https://www.linkedin.com/pulse/how-i-resolved-15k-circular-dependencies-type-script-stefan-haas-udhke/)

一位微软高级工程师回顾了如何从 700 万行（！）TypeScript monorepo 中清理约 15,000 个项目级别的循环依赖，并提供了可供任何管理大型 TS 工作区的开发者复用的思路。

*Stefan Haas*

---

### [你的智能体每天交付 10 个创意，你却只有 2 个数据库？](https://ghost.org/)

你的智能体构建速度快于 2 项目免费层所允许的速度。ghost 为它提供无限的 Postgres。1TB 存储。免费试用。

*ghost 赞助*

---

### [垂直代码库架构](https://www.dorfmeister.cc/blog/the-vertical-codebase)

将应用组织成 `components/`、`hooks/` 和 `utils/` 这样的文件夹起初感觉很整洁，但随着时间推移会变得越来越难以维护。Dominik 论证了垂直、领域优先的方法的理由。

*Dominik Dorfmeister*

---

### 🔒 [OWASP NPM 安全最佳实践速查表](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html)

一份有用且长期维护的检查清单，持续更新，最新更新涉及禁用生命周期脚本、拼写仿冒攻击、可信发布和依赖混淆等主题。

*OWASP 速查表系列*

---

### [我们如何利用 AI 让 Angular 编译器更快](https://voidzero.dev/posts/how-we-made-the-angular-compiler-faster-using-ai)

VoidZero 的两位开发者想看看他们能做出多快的 Angular 编译器。结果证明，非常快。

*Brooklyn 和 Michael Dong (VoidZero)*

---

## 🛠 代码与工具

### [Bun v1.3.13: 更智能的测试、流式安装和更少的内存占用](https://bun.com/blog/bun-v1.3.13)

![bun](@@CDN@@/assets/img/web/JavaScriptWeekly25/img-04.webp)

Bun 运行时的发布节奏一直很不错，包括上周内置浏览器自动化的 v1.3.12。现在，`bun test` 获得了众多增强功能：`--isolate`、`--parallel`、`--shard` 和 `--changed` 选项，分别用于测试环境隔离、并行化以及仅运行受近期更改影响的测试文件。运行时内存使用减少了 5%，`bun install` 变得更快，还有更多改进。

*Jarred Sumner*

---

### [推出 B2B 身份验证](https://clerk.com/)

Clerk 结合了组织管理、SCIM、SSO、RBAC、邀请和计费功能，用于构建企业级应用。

*Clerk 赞助*

---

### [Animata: 超过 100 个动画 React 组件](https://animata.design/)

一套新颖的以动画为重点的 React 组件，你在其他地方很少见到，包括动画光束、展开卡片和 Slack 风格的启动画面。

*Codse*

---

### 📄 [officeParser: 解析常见办公格式的库](https://github.com/harshankur/officeParser)

处理 docx、pptx、xlsx、odt 等办公套件使用的格式，可在浏览器和服务端使用。[GitHub 仓库。](https://github.com/harshankur/officeParser)

*Harsh Ankur*

---

### 🎵 [tiks: 为 Web 生成程序化 UI 音效](https://tiksjs.baguskawaii.my.id/)

使用 Web Audio API 合成的点击、弹跳和提示音效（因此体积非常小巧）。

*Rexa*

---

## 📢 生态系统其他动态

### 🔧 [Git 2.54 发布亮点](https://github.blog/open-source/git/highlights-from-git-2-54/)

![git254](@@CDN@@/assets/img/web/JavaScriptWeekly25/img-05.webp)

Git 2.54 带来了多项改进，包括更快的性能、更好的合并策略和增强的调试能力。

---

*原文链接：[JavaScript Weekly Issue 782](https://javascriptweekly.com/issues/782)*
