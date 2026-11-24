---
title: JavaScript周刊-48
date: 2018-04-03 22:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 805: 2026年10月6日

*与 Master.dev 联合推出*

## [为什么没有更多开发者"使用平台"？](https://nolanlawson.com/2026/10/03/why-dont-more-developers-use-the-platform/)

![hnza9nriyhgnntkp2aa7](@@CDN@@/assets/img/web/JavaScriptWeekly48/img-01.webp)

一篇颇具洞察力的文章，探讨我们为何常常重新实现浏览器已经提供的东西——而作者本身通常是站在"平台"这一边的。文章在 Hacker News 上引发了[热烈的讨论](https://news.ycombinator.com/item?id=49950554)，许多人认为原生控件和 API 过于有限或笨拙，难以依赖。

*Nolan Lawson*

<div style="float:right"><img  src="@@CDN@@/assets/img/web/JavaScriptWeekly48/img-02.webp" width="140" height="140" alt="Master.dev" style="padding-top: 12px; padding-left: 12px;"></div>

## [免费课程：使用 OpenAI Codex 更快构建雄心勃勃的现代界面](https://master.dev/courses/codex/?utm_source=email&utm_medium=javascriptweekly&utm_content=codexcooper)

跟随 Katia Gil Guzman 一起学习这门免费的 Codex 课程，了解智能体编程如何改变前端开发。课程涵盖环境搭建、提示词、反馈、技能、自动化、部署等内容。

*Master.dev 赞助*

## [Preact 11 发布](https://preactjs.com/blog/preact-11/)

距离 [Preact 11 之路](https://github.com/preactjs/preact/issues/2621)启程已过去六年，这个广受欢迎的"拥有相同现代 API 的 React 替代品"终于迎来最新版本：改进了 hydration，支持自动 ref 转发，并提供仅 ESM 的包。[升级指南](https://preactjs.com/guide/v11/upgrade-guide/)涵盖了所有变更。

*Preact 团队*

## [Nuxt 4.6：朝着服务器无关的 Nuxt 迈出一大步](https://nuxt.com/blog/v4-6)

这个全栈 Vue 框架的一次重磅发布：服务器层不再将你绑定到 Nitro（纯 Vite 服务器构建现已成为实验性选项）、内置会话（sessions）、支持 Vue Vapor，以及全新的 CLI（[Nuxt CLI 4.0](https://github.com/nuxt/cli/releases/tag/v4.0.0)）。

*Daniel Roe*

### 简讯

- 多产的包维护者 [Sindre Sorhus 已关闭外部 pull request](https://bsky.app/profile/sindresorhus.com/post/3mwtgzhv7uk2t)，原因是 AI 贡献垃圾太多，不过他仍会继续维护自己的项目。[SWC 现在也将 PR](https://github.com/swc-project/swc/pull/12463)限制为受信任的贡献者。

- 📊 [JavaScript Framework Benchmark](https://krausest.github.io/js-framework-benchmark/) 网站新增了 [Chrome 154 的测试结果](https://krausest.github.io/js-framework-benchmark/2026/chrome154.html)，涵盖 196（！）种应用实现方式、每种方式的性能表现及其体积大小。

- [`npm stage publish` 现在可以创建新包](https://github.blog/changelog/2026-10-02-npm-staged-publishing-now-supports-creating-new-packages/)，因此自动化工作流不再需要手动完成首次发布。

### 版本发布

- [Remix 3.0](https://github.com/remix-run/remix/releases/tag/remix%403.0.0) – 尚无官方公告，但这是重建版全栈框架的新稳定版本，不再需要 React。不过 [RC 发布公告](https://remix.run/blog/remix-3-release-candidate)里有更多信息。

- [Ink 8.0](https://github.com/vadimdemedes/ink/releases/tag/v8.0.0) – 这个流行的 TUI 渲染器现在要求 React 19.3，并新增滚动偏移，用于构建可滚动视图——这在如今的编程智能体 UI 中已很常见。

- [Inferno 10](https://github.com/infernojs/inferno/releases/tag/v10.0.0) – 为极致渲染速度而生的类 React UI 库。现在将更多工作从运行时转移到其 JSX 编译器。

- [Qwik 2.0 RC](https://next.qwik.dev/blog/qwik-2-rc/)、[pnpm 12.10](https://pnpm.io/blog/releases/12.10.0)、[Ember 7.3](https://blog.emberjs.com/ember-released-7-3/)、[Video.js 10](https://videojs.org/blog/videojs-10)、[ESLint 10.12](https://eslint.org/blog/2026/10/eslint-v10.12.0-released/)

## 📖 文章和视频

### [开始使用 Claude Code *Mods*](https://claude.dev/blog/getting-started-with-claude-code-mods/)

![ta6jwcu6syxtrqcq4xb4](@@CDN@@/assets/img/web/JavaScriptWeekly48/img-03.webp)

Claude Code 刚刚新增了对 [Mods](https://claude.com/resources/articles/claude-code-mods) 的支持——这是一种用 JavaScript 扩展智能体编程工具的方式，可以监听事件、改变行为并绘制自定义 UI。Addy 在这里用大约 80 行代码构建了一个 mod，实时"预报"你的上下文窗口用量。

*Addy Osmani*

---

### [与 Deno 友情破裂，如今 Node 是我最好的朋友](https://dbushell.com/2026/10/03/deno-to-node/)

David 在 2021 年[曾对 Deno 感觉良好](https://dbushell.com/2021/03/12/built-with-deno/)，但如今他回到了 Node，并对它的进步之大感到惊讶。他几乎没做什么改动就把自己的站点生成器移植了回来，也毫不留情地谈了自己认为 Deno 错在哪里。

*David Bushell*

---

### [100 多个搜索引擎，一个简单的 API](https://serpapi.com/cooperpress-newsletter)

用来自 Google、YouTube、Amazon 等的实时数据构建应用。SerpApi 为 AI 智能体和你的应用提供结构化的 JSON 与 Markdown。告别抓取的各种烦恼。

*SerpApi 赞助*

---

### [我测试了 11 个 HTTP 弹性库](https://blog.gaborkoos.com/posts/2026-10-04-I-Tested-11-Http-Resilience-Libraries/)

如果你在重试过程中中止请求，[Ky](https://github.com/sindresorhus/ky)、[ofetch](https://github.com/unjs/ofetch) 和 [Wretch](https://elbywan.github.io/wretch/) 这些 fetch 封装库会如何表现？[ffetch](https://github.com/fetch-kit/ffetch) 的作者测试了十一种方案，发现其中五种在取消后仍会尝试重试。

*Gabor Koos*

---

### 📄 [Booking.com 如何将其 Node.js 服务的成本降低 38%](https://medium.com/booking-com-development/node-js-at-scale-rebalanced-how-we-cut-cost-by-38-62ce247a3002)

通过从 PM2 迁移到 [Watt](https://docs.platformatic.dev/docs/getting-started/quick-start) 的 worker 线程，并重新设计负载均衡和 worker 配置。

*Ilya Malyavin*

---

### 📄 [受 Emacs 启发，为 TypeScript 编写可读的正则表达式](https://www.rahuljuliato.com/posts/emacs-rx-in-typescript)

用命名的、可组合的片段重新构建 SemVer 正则表达式。

*Rahul M. Juliato*

---

### 📄 [关于自动类型收窄](https://radekmie.dev/blog/on-automatic-type-refinements/)

哪些 `filter` 回调能让 TypeScript 收窄数组类型，哪些不能。

*Radosław Miernik*

## 🛠 代码与工具

### [TanStack Charts 1.0：可组合、类型化的图表库](https://tanstack.com/blog/tanstack-charts-1-0)

![hh9exzpq3o95k5zdqmyd](@@CDN@@/assets/img/web/JavaScriptWeekly48/img-04.webp)

一种与框架无关的方式，用类型化、可 tree-shake 的 JavaScript 以声明式指定可视化，然后通过 SVG 或 Canvas 渲染。内容丰富的[示例目录（附代码）](https://tanstack.com/charts/catalog)展示了折线图、柱状图、饼图和面积图，以及热力图、箱线图、直方图等。

*Tanner Linsley*

---

### [SvelteKit 3："同一个框架，只是更精致了一些"](https://svelte.dev/blog/sveltekit-3-is-here)

Svelte 官方应用框架迎来一次清理/打磨式发布。新功能不多，[远程函数（remote functions）](https://svelte.dev/docs/kit/remote-functions)仍处于实验阶段，但现有用户需要做一些迁移工作（不过 [`sv migrate` 能处理其中大部分](https://svelte.dev/docs/kit/migrating-to-sveltekit-3)）。

*Svelte 团队*

---

### [直接从 Adobe Substance 3D Painter 发布到 Miris](https://www.miris.com/blog/from-substance-to-browser?utm_source=web_referral&mrls=web_referral&utm_medium=public_relations&mrlc=public_relations&utm_campaign=raz-pr&utm_content=plugin&prg=fidelity&utm_term=javascript&dp=dp)

别再分享被降质的 3D 内容了。通过 Miris 插件流式传输你高保真的 Adobe Substance 3D Painter 资源。

*Miris 赞助*

---

### [Effect 4.0：更小的核心，重建的运行时](https://effect.website/blog/releases/effect/40)

这个用于构建可靠应用的流行库经历了一次彻底重写，可处理资源管理、并发、重试、类型化错误等棘手问题。v4.0 号称最小包体积缩小 5 倍，每个并发任务占用的内存减少 86%。

*Sebastian Lorenz*

---

### [Lightpanda 1.0：面向自动化的无头浏览器](https://lightpanda.io/blog/posts/lightpanda-1-0)

一个用 Zig 从零构建的无头浏览器。由于不做图形渲染，它的 CPU 和内存占用只是 Chrome 的一小部分（我刚跑的一次只用了约 35MB 内存！）。可以用 Puppeteer/Playwright 驱动它，更有趣的是，还可以[用纯 JavaScript 为它编写脚本](https://lightpanda.io/docs/usage/pandascript)。

*Francis Bouvier*

### 版本发布

- [eslint-cssicorn 0.1](https://github.com/sindresorhus/eslint-cssicorn) – Sindre Sorhus 将其庞大的 [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn/releases/tag/v77.0.0) ESLint 规则集中的纯 CSS 规则移入了一个新的专注 CSS 的包。

- [pixelmatch 8.0](https://github.com/mapbox/pixelmatch) – 小巧、快速的像素级图像比较库。改用更符合感知的颜色度量，因此差异计数会发生变化。

- [PR Comment Inbox](https://humanwhocodes.com/blog/2026/09/introducing-pr-comment-inbox/) – Nicholas Zakas 的 GitHub 评审评论收件箱，采用电子邮件式界面，支持会话线索和已读/未读状态。

- [Electron Forge 8](https://github.com/electron/forge/releases/tag/v8.0.1) – 用于构建、打包和发布 Electron 应用的工具包。

- [Redux Toolkit 2.13](https://github.com/reduxjs/redux-toolkit/releases/tag/v2.13.0) – Redux 官方工具集新增对 TypeScript 7 的支持。

## 📢 生态系统其他动态

![niw2deybmislnoi07vqf](@@CDN@@/assets/img/web/JavaScriptWeekly48/img-05.webp)

- 📊 [State of Devs 2026 调查结果已公布](https://2026.stateofdevs.com/en-US/)，超过 5,000 名开发者分享了他们对软件开发职业安全感、[AI 使用与看法](https://2026.stateofdevs.com/en-US/ai/)、[业余爱好](https://2026.stateofdevs.com/en-US/hobbies/)以及[工作场所](https://2026.stateofdevs.com/en-US/workplace/)（包括收入）的看法。

- [为什么 `example.com` 现在会加载 JavaScript？](https://www.oliverdunk.com/2026/09/30/iana-reply) IANA 表示，由于访问该站点的大多数客户端都是自动化的、不会加载 JavaScript，这是一种节省带宽的方式。关于该站点近期改版的更多内容[见此](https://www.debugbear.com/blog/example-dot-com-redesign-history)。

- Netlify 解释了[它如何将 Edge Function 的调用延迟降低约 5 倍](https://www.netlify.com/blog/edge-functions-firecracker-microvms/)：从托管的 V8 isolate 切换到其自有边缘网络上的 Unikraft MicroVM。

- 🤖 [Pi 1.0](https://earendil.com/posts/pi-1-0/)，这个基于 Node.js 的极简编程智能体，通过"Codemode"新增了对 MCP 和非 LLM 模型的支持。他们还推出了实验性的 [Pi Durable](https://earendil.com/posts/pi-durable/) 运行时，用于运行具备韧性的长期智能体流程。

*原文链接：[JavaScript Weekly Issue 805](https://javascriptweekly.com/issues/805)*
