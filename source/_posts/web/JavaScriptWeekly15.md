---
title: JavaScript周刊-15
date: 2018-03-21 04:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 772: 2026年2月10日

![header](@@CDN@@/assets/img/web/JavaScriptWeekly15/img-01.webp)

## [npmx: 全新的 npm 包浏览器](https://npmx.dev)

一个快速、流畅的方式来浏览官方 npm 仓库中的包。它确实快速、流畅,并且在前端和中心展示了更多信息 - 例如查看 [axios 页面](https://javascriptweekly.com/link/180449/web)。*"我们不是要取代 npm 仓库,而是通过快速、现代的 UI 提供提升的开发者体验。"*

💡 一个特别巧妙的功能是[快速比较包的能力](https://javascriptweekly.com/link/180450/web),可以在大小、依赖项、模块格式、许可证等方面进行比较。

---

<div style="float:right; margin-left:16px; margin-bottom:8px;">
  <img  src="@@CDN@@/assets/img/web/JavaScriptWeekly15/img-02.webp" width="100">
</div>

## [最受喜爱的 JavaScript 课程](https://frontendmasters.com)

JavaScript: The Hard Parts 年复一年被数千名开发者平均评分 4.92。为 JavaScript 的工作原理构建真实的心智模型,从执行上下文和闭包到异步行为和现代语言特性。

*Frontend Masters 赞助*

---

## 📊 [State of JS 2025 调查结果](https://2025.stateofjs.com)

年度调查结果发布了,将超过 12,000 名 JavaScript 开发者的意见汇编成一系列图表,涵盖的领域包括[语言痛点](https://javascriptweekly.com/link/180452/web)、[前端框架选择](https://javascriptweekly.com/link/180453/web)、[构建工具使用](https://javascriptweekly.com/link/180454/web)、[有多少代码是 AI 生成的](https://javascriptweekly.com/link/180455/web),以及[他们使用哪些非 JS/TS 语言](https://javascriptweekly.com/link/180456/web)。

*Devographics*

---

## [ESLint v10.0.0 发布](https://eslint.org)

这个期待已久的里程碑版本完成了对传统 eslintrc 配置系统的移除,引入了从被检查文件开始的新配置查找算法(对 monorepo 非常友好),添加了 JSX 引用跟踪以修复作用域分析问题等等。

*ESLint Team*

---

## 简讯

- webpack 分享了其 [2026 路线图](https://javascriptweekly.com/link/180458/web)。主题包括支持通用目标以将代码编译到多个运行时、无需加载器构建 TypeScript、无需插件的 CSS 模块等。

- VoidZero 分享了其 [2026 年 1 月回顾](https://javascriptweekly.com/link/180459/web),涵盖 Oxlint、Oxfmt、Vitest 等的更新。

- [Deno Deploy 现已正式发布](https://javascriptweekly.com/link/180460/web),作为轻松将 JS/TS 应用部署到 Web 的平台。还有一个 45 分钟的视频展示 Ryan Dahl 的演示。

- 🤯 *Promethee* 提供 [JavaScript 的 UEFI 绑定](https://javascriptweekly.com/link/180461/web)。用 JavaScript 而不是 C 编写 UEFI 引导加载程序?是的。

---

## 版本发布

- 🤖 [Transformers.js v4 预览版](https://javascriptweekly.com/link/180462/web) – 在新的 WebGPU 运行时上*在浏览器中*运行 ML 模型。

- [Bun v1.3.9](https://javascriptweekly.com/link/180463/web) – 使用 --parallel/--sequential 并发/顺序运行多个 package.json 脚本,更快的 Bun.markdown.react(),正则表达式获得 SIMD 提升等。

- [Ink 6.7](https://javascriptweekly.com/link/180464/web) – 使用 React 构建丰富的终端应用。v6.7 添加了并发渲染和同步更新(更少闪烁!)

- [Ember 6.10](https://javascriptweekly.com/link/180465/web) – 稳定、久经考验的框架的清理和现代化。

---

## 📖 文章和视频

### [JavaScript 清理资源即将变得更容易](https://piccalil.li)

![symbol-dispose](@@CDN@@/assets/img/web/JavaScriptWeekly15/img-03.webp)

对 Symbol.dispose 和 using 这两个新特性的有趣技术探索,它们将缓解许多关于清理的头痛问题:关闭连接、释放资源等。只是要小心布偶们……

*Mat Marquis*

---

### ▶ [Evan You 谈 Vite、Rust 和 JS 工具的未来](https://www.youtube.com)

Vue.js 创建者加入 Better Stack 播客,讨论他从构建 Vite 到创立 VoidZero 和开发基于 Rust 的 JS 工具链的历程。

*Evan You 和 Better Stack*

---

### [使用 Sentry 日志而非仅错误调试 Next.js 生产问题](https://blog.sentry.io)

从一个 Next.js 生产调试会话中学到的教训,在这个会话中,理解行为比堆栈跟踪更重要。

*Sentry 赞助*

---

### 🤖 [使用 AI 调试 React: 它能替代经验丰富的开发者吗?](https://www.developerway.com)

Nadia 建立了一个充满微妙 bug 的应用,释放了 Claude 来处理它,然后……看着它未能给人留下深刻印象。

*Nadia Makarevich*

---

### 更多文章

- 📄 [为什么 Inngest 从 Next.js 迁移到 TanStack Start](https://javascriptweekly.com/link/180470/web) *Jacob Heric*

- 📄 [在 JavaScriptCore 中实现 Temporal 提案](https://javascriptweekly.com/link/180471/web) *Tim Chevalier (Igalia)*

- 📄 [Angular 22 中的新特性展望](https://javascriptweekly.com/link/180472/web) *Kelly Vatter (Mescius)*

- 📄 [Solid.js 最佳实践](https://javascriptweekly.com/link/180473/web) *Brenley Dueck*

---

## 🛠 代码与工具

### [Shovel.js: 如果你的服务器只是一个 Service Worker 会怎样?](https://shovel.js.org)

一个围绕 [Service Worker](https://javascriptweekly.com/link/180475/web) 模型构建的全栈框架和元框架,尽可能使用 Web API 在 Node、Bun 和边缘运行时提供一致的服务器表面。

*Brian Kim*

---

### [VerifyFetch: 具有恢复和验证功能的获取大文件](https://verifyfetch.com)

想象一下 fetch,但具有恢复下载的能力,检查你下载的是否是你想要下载的内容,并在任何损坏时快速失败。[GitHub 仓库](https://javascriptweekly.com/link/180477/web)。

*Hamza Ezzaydia*

---

### [教你的 AI 编码智能体如何实现 Clerk 身份验证](https://go.clerk.com)

一条命令为 Claude Code、Cursor、Copilot 等安装 Clerk Skills。你的智能体学习身份验证,所以你可以更快地发布。

*Clerk 赞助*

---

### 🔐 [OTPAuth: 一次性密码 (HOTP/TOTP) 库](https://github.com)

Node、Deno、Bun 和浏览器库,用于生成和验证双因素身份验证中使用的 TOTP 和 HOTP 一次性密码。

*Héctor Molinero Fernández*

---

### 📺 [Shaka Player 5.0: 播放自适应媒体的库](https://github.com)

在浏览器中*无需*插件播放 DASH 和 HLS 等格式。支持通过 IndexedDB 离线存储和播放。([演示](https://javascriptweekly.com/link/180481/web))

*Shaka Project*

---

### 更多工具

- [Meriyah 7.1](https://javascriptweekly.com/link/180482/web) – 长期存在的 100% 兼容 (ES2024)、自托管的 JavaScript 解析器,你可以[在这里试用](https://javascriptweekly.com/link/180483/web)。

- [React Grab 1.0](https://javascriptweekly.com/link/180484/web) – 在浏览器中选择组件的工具,[用于提供给智能体进行编辑](https://javascriptweekly.com/link/180485/web)。

- [Downshift 9.3](https://javascriptweekly.com/link/180486/web) – 构建 WAI-ARIA 兼容的 React 自动完成、组合框和选择下拉组件的原语。

- [Js_of_ocaml 6.3](https://javascriptweekly.com/link/180487/web) – OCaml 到 JS 的转译器。

- [VuePDF 2.0](https://javascriptweekly.com/link/180488/web) – 在 Vue 3 应用中渲染 PDF。

- [Lume 3.2](https://javascriptweekly.com/link/180489/web) – Deno 的静态站点生成器。

---

## 📢 生态系统其他动态

### ⭐ [半色调的色彩](https://blog.maximeheckel.com)

![halftone](@@CDN@@/assets/img/web/JavaScriptWeekly15/img-04.webp)

Maxime Heckel 对像素化、抖动以及使用 [React Three Fiber](https://javascriptweekly.com/link/180493/web) 创建 GLSL 驱动的半色调效果的全面介绍。这是一种在现代网页设计和数字艺术中越来越流行的美学。

---

### 😬 [Heroku](https://heroku.com) 采用"维持工程模式"

云托管/PaaS 先驱 Heroku [采用了"维持工程模式"](https://javascriptweekly.com/link/180495/web),没有新功能在计划中。开发者社区[听到了"死亡警钟"](https://javascriptweekly.com/link/180496/web),迁移离开 Heroku 加入了许多待办事项列表。

---

### 🎥 使用 Remotion 构建视频

如果你对使用智能体通过 [Remotion](https://javascriptweekly.com/link/180497/web) 构建视频的热议感到不知所措,Remotion 现在有[▶️ 一个 5 分钟的教程,将其简化为基础知识](https://javascriptweekly.com/link/180498/web)。

---

### 📗 Node.js 官方文档新设计预览

[这是 Node.js 官方文档的新设计预览](https://javascriptweekly.com/link/180499/web)。如果遇到任何问题,你可以[提交问题](https://javascriptweekly.com/link/180500/web)。

---

*原文链接: [JavaScript Weekly Issue 772](https://javascriptweekly.com/issues/772)*
