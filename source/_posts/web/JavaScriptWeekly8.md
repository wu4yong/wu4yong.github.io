---
title: JavaScript周刊-8
date: 2018-03-17 21:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## December 12, 2025

![构建 HTML 工具的实用模式](@@CDN@@/assets/img/web/JavaScriptWeekly8/img-01.webp)

## 构建 HTML 工具的实用模式

[构建 HTML 工具的实用模式](https://javascriptweekly.com/link/178407/web) — 在许多场景中，你并不需要完整的前端框架来构建实用的小工具；只用一个包含 HTML、JavaScript 和 CSS 的单文件就能搞定。Simon 通过用 LLM 快速迭代，已经做出了[很多这类工具](https://javascriptweekly.com/link/178408/web)，这里他分享了自己的流程和实践经验，非常适合想用“纯前端”+ AI 搭建实用小工具的人。

## Deno 2.6 发布

[Deno 2.6 发布](https://javascriptweekly.com/link/178409/web) — 这个流行的 JavaScript/TypeScript 运行时带来了多项升级：新增类似 `npx` 的 `dx` 工具，可以直接运行来自 npm 和 JSR 的二进制；新增 `deno audit` 工具用于扫描依赖漏洞；提供更细粒度的权限控制；并实现了[源阶段导入（source phase imports）](https://javascriptweekly.com/link/178410/web) 等新能力。

## 简讯

- ⚠️ [又有两个与 React Server Components 相关的漏洞](https://javascriptweekly.com/link/178411/web) 在昨天被披露，它们与上周的 [React2Shell](https://javascriptweekly.com/link/178412/web) 事件是不同的问题。
- 🔒 [GitHub 更新了 npm 令牌策略](https://javascriptweekly.com/link/178413/web)：本周所有“经典” npm token 都已被撤销，现在可以通过新的流程获取 2 小时会话令牌或精细权限的访问令牌。
- 🕒 [Chrome 144 Beta](https://javascriptweekly.com/link/178414/web) 已发布，支持用于处理日期和时间的 [Temporal API](https://javascriptweekly.com/link/178415/web)。
- 微软发布了 VS Code 的 [*JavaScript/TypeScript Modernizer* 预览版](https://javascriptweekly.com/link/178416/web)，它可以分析项目并给出语法和依赖升级建议。
- [Oxlint 在 alpha 版本中引入了“类型感知” lint 能力](https://javascriptweekly.com/link/178417/web)。

## 发布

- [Node.js v24.12.0 (LTS)](https://javascriptweekly.com/link/178418/web) – 第一版将“类型剥离”（type stripping）标记为稳定的 Node.js LTS 版本。
- [@platformatic/python-node v2.0](https://javascriptweekly.com/link/178419/web) – 让 Python ASGI 应用可以在 Node.js 进程中运行，现在支持 HTTP 响应流和双向 WebSocket。
- [Bun v1.3.4](https://javascriptweekly.com/link/178420/web) – 支持 `URLPattern`，测试运行器中新增可控/假定时器，`console.log` 也像 Node 一样支持 `%j` 占位符。
- [React v19.2.3](https://javascriptweekly.com/link/178421/web)、[v19.1.4](https://javascriptweekly.com/link/178422/web) 和 [v19.0.3](https://javascriptweekly.com/link/178423/web)。

## 📖 文章和视频
[西雅图时报如何防御 npm 供应链攻击](https://javascriptweekly.com/link/178424/web) — 详细介绍《西雅图时报》如何采用 [pnpm](https://javascriptweekly.com/link/178425/web) 作为 npm 的替代，以获得更强的客户端安全控制。

[让复杂 Web 应用更快的提案](https://javascriptweekly.com/link/178426/web) — 来自微软的一份早期[提案](https://javascriptweekly.com/link/178427/web)，希望通过新的 *Delayed Message Timing API*，缓解多个并行上下文（如 iframe、线程、多窗口等）带来的性能问题，目前正在征集反馈。

[CERN 数据引擎背后：更快写入与即时洞察](https://javascriptweekly.com/link/178428/web) — 介绍 CERN 如何使用 TimescaleDB 处理大规模时序数据工作负载，在写入、压缩和实时分析方面获得更好表现。

[用 JavaScript 构建一个迷你 2D 物理引擎](https://javascriptweekly.com/link/178429/web) — 一篇很有老派博客味道的文章，从零开始用 JS 写一个小型物理引擎，然后将源码"高尔夫"压缩到 2KB，并在[主页上提供了示例](https://javascriptweekly.com/link/178430/web)。

📄 [Canvas 上非阻塞、跨浏览器的图片渲染](https://javascriptweekly.com/link/178431/web) – 展示如何在复杂图片场景下提升 UI 响应性。

📄 [*Prelude of the Chambered* 重制：用 TypeScript 改写一款经典游戏](https://javascriptweekly.com/link/178432/web) – 将 Minecraft 作者在一次 Ludum Dare 比赛中写的 Java 游戏移植到 TypeScript。

📄 [Angular 小贴士](https://javascriptweekly.com/link/178433/web) – 一个聚焦于大型 Angular 应用最佳实践的文档站。

## 🛠 代码和工具

![Remix Store 开源](@@CDN@@/assets/img/web/JavaScriptWeekly8/img-02.webp)

[开源的 Remix Store](https://javascriptweekly.com/link/178434/web) — [Remix Store](https://javascriptweekly.com/link/178435/web) 是 Remix 项目的官方周边商店，其代码库展示了 Remix 核心团队如何结合 Remix 和 [Hydrogen](https://javascriptweekly.com/link/178437/web) 构建实际应用的方式。即使你不是 Remix 用户，也可以从中学到很多模式，例如[这个很酷的“故障风”404 页面](https://javascriptweekly.com/link/178465/web)，可以移植到别的项目中。

[`<relative-time>` 5.0：用自然语言展示相对时间](https://javascriptweekly.com/link/178439/web) — 这是一个 Web Component，只要给它一个标准格式的日期时间，它就会渲染成诸如"2 days ago"这样的相对时间。GitHub 在所有仓库和代码视图中都在使用它。

[还在手写测试吗？](https://javascriptweekly.com/link/178440/web) — 了解为什么 Dropbox、Notion 和 Lattice 等团队依赖 Meticulous 来运行 E2E UI 测试。

[ts-exec：使用 SWC 在 Node 中执行 TypeScript](https://javascriptweekly.com/link/178441/web) — 由 [Adonis](https://javascriptweekly.com/link/178442/web) 作者推出的另一种运行 TS 的方式。相比 Node 22.18+ 自带的[类型剥离](https://javascriptweekly.com/link/178443/web)，ts-exec 还支持 JSX 和装饰器，并且[相对 ts-node、tsx 有一些优势](https://javascriptweekly.com/link/178444/web)。

[Toastflow：Vue 3 的 Toast 通知库](https://javascriptweekly.com/link/178445/web) — 附带一个非常棒的在线 playground，可以直接在浏览器里玩转各种 toast 样式。Toastflow 在设计上是“框架无关”的，目前提供了 Vue 3 渲染器。[GitHub 仓库在此](https://javascriptweekly.com/link/178446/web)。

[Devalue：当 JSON.stringify 办不到时，交给它](https://javascriptweekly.com/link/178447/web) — 出自 Svelte 项目的一个库，功能类似 JSON.stringify，但可以处理循环引用、重复引用、正则、Map/Set，甚至自定义类型。[可在这里在线体验](https://javascriptweekly.com/link/178448/web)。

[iceberg-js：Apache Iceberg 的 JavaScript 客户端](https://javascriptweekly.com/link/178449/web) — 一个极简、供应商无关的 Apache Iceberg REST Catalog API JS 客户端，可运行在大多数运行时和环境中。

- [Inertia 2.3](https://javascriptweekly.com/link/178450/web) – 让你用传统服务端路由和控制器构建单页 React / Vue / Svelte 应用，适合与 Django、Rails、Laravel 等后端框架搭配。
- [OpenPGP.js 6.3](https://javascriptweekly.com/link/178451/web) – JavaScript 中的 OpenPGP 实现。
- 🗓️ [React Datepicker 9.0](https://javascriptweekly.com/link/178452/web) – 老牌 React 日期选择组件。
- 🎸 [SVGuitar 2.5](https://javascriptweekly.com/link/178453/web) – 用 SVG 渲染吉他和弦图表。
- [pnpm 10.25](https://javascriptweekly.com/link/178454/web) – 快速、省空间的包管理器。
- [js-tokens 10.0](https://javascriptweekly.com/link/178455/web) – 迷你的 JavaScript 源码 tokenizer。

## 📰 分类广告

- [Trigger.dev](https://javascriptweekly.com/link/178456/web) 负责队列、重试和长任务，让你可以用 TypeScript 构建生产级 agent 和工作流。
- [Aiven 新的开发者层 PostgreSQL](https://javascriptweekly.com/link/178464/web) 提供 5 美元档 Postgres，避免为大量空闲实例支付过高费用。

## 📢 生态系统中的其他地方

![TypeSlayer](@@CDN@@/assets/img/web/JavaScriptWeekly8/img-03.webp)

- 📺 今年早些时候，Dimitri Mitropoulos 曾用 TypeScript 的类型系统“跑 Doom”而惊艳众人（[相关文章](https://javascriptweekly.com/link/178459/web)），这次他带来了 [TypeSlayer 的视频演示](https://javascriptweekly.com/link/178458/web)——一个用于诊断和修复 TypeScript 性能问题的可视化工具，目前还未公开，但 3D 可视化效果非常炫。
- 想了解 2025 年 CSS 的最新进展，可以查看 Chrome 团队的 [CSS Wrapped 2025](https://javascriptweekly.com/link/178460/web)。
- GitHub 分享了其在 [GitHub Actions 平台上的改进](https://javascriptweekly.com/link/178461/web)，以及 2026 年将推出的新能力。
- 🗳️ 来自 Google Chrome 团队的 Rick Viscomi 发起了一个长期投票，邀请你[为想要的 Web 特性投票](https://javascriptweekly.com/link/178462/web)。这与 Interop 2025 的投票不同，将会长期累积社区意愿。
- 🤖 [OpenAI 发布了 GPT 5.2 模型](https://javascriptweekly.com/link/178463/web)。

---

_原文链接：[JavaScript Weekly #765](https://javascriptweekly.com/issues/765)_

## Deno 2.6 新能力补充

- `dx` 是对标 `npx` 的工具，用来直接运行来自 npm 和 JSR 包的二进制；它默认带 `--allow-all` 权限（除非传入其他权限标志），下载包前会提示，确认后自动运行生命周期脚本，尝试运行本地文件会直接报错
- `deno audit` 扫描依赖图，对照 GitHub CVE 数据库检查 JSR 与 npm 包的漏洞；加 `--socket` 标志可接入 socket.dev 的漏洞库，适合放进 CI/CD 在发现漏洞时阻断构建
- 权限控制更细粒度：`--ignore-read` 与 `--ignore-env` 可单独忽略某些文件读取或环境变量访问，被忽略的读取返回 `NotFound`，被忽略的环境变量返回 `undefined`，而不是抛 `NotCapable` 错误
- 本期还落地了源阶段导入（source phase imports）这一新的 JavaScript 导入形态

## 运行时版本与类型剥离

- Node.js v24.12.0 是 LTS 版本（代号 Krypton）；类型剥离在 v25.2.0 与 v24.12.0 标记为稳定
- 类型剥离由运行时把 TypeScript 语法替换为空白，不做类型检查；只支持可擦除语法，依赖代码生成的 enum、带运行时代码的 namespace、参数属性、导入别名会报错，装饰器目前也不会被转换
- Node 不读取 `tsconfig.json`，因此依赖 paths 等配置的能力不在支持范围内；关闭该特性可用 `--no-strip-types`
- Bun v1.3.4 支持 `URLPattern`，提供 `test()` 与 `exec()`，从 `exec()` 结果的 `pathname.groups` 取路径参数；测试运行器新增假定时器，`jest.useFakeTimers()` 后可用 `advanceTimersByTime` 等方法推进时间；`console.log` 的 `%j` 占位符按 JSON 字符串化输出，行为对齐 Node

## 本期工具库要点

- devalue 出自 Svelte 项目，能力类似 `JSON.stringify`，可处理循环引用、重复引用、正则、日期、Map/Set、BigInt、Typed Arrays、URL/URLSearchParams 和 Temporal；自定义类型通过 replacer、reducer、reviver 序列化与还原，Promise 用 `stringifyAsync` 处理
- 输出做了 XSS 缓解：用户输入里的 `</script>` 会被转义，避免把预渲染状态直接嵌进 `<script>` 时被注入执行函数
- `<relative-time>` 是 GitHub 维护的 Web Component，扩展标准 `<time>` 元素；`datetime` 属性填 ISO 8601 时间戳，内部用 `Intl.DateTimeFormat` 与 `Intl.RelativeTimeFormat` 按用户偏好本地化，相对时间在浏览器内自动更新
- 服务端可以缓存含日期的 HTML 片段，浏览器拿到后再做本地化；JavaScript 被禁用时，元素文本内容里写好的默认日期仍然显示
- Inertia 用传统服务端路由、控制器、中间件和鉴权构建 React、Vue、Svelte 单页应用，不需要单独写一套 API；后端生态适配 Laravel、Rails、Django、Phoenix 等，内置局部重载、共享数据、延迟属性和链接预取

## 参考

- https://deno.com/blog/v2.6
- https://nodejs.org/api/typescript.html
- https://nodejs.org/en/blog/release/v24.12.0
- https://bun.sh/blog/bun-v1.3.4
- https://github.com/sveltejs/devalue
- https://github.com/github/relative-time-element
- https://inertiajs.com/
