---
title: JavaScript周刊-46
date: 2018-04-03 03:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 803: 2026年9月22日

*与 ParadeDB 联合推出*

## [tinyjs：用不到 10MB 构建 JavaScript 桌面应用](https://tinyjs.app/)

![l5ejacd7rpbkelmaxdto](@@CDN@@/assets/img/web/JavaScriptWeekly46/img-01.webp)

我用它构建了一个应用，印象深刻。你能得到一个由 [txiki.js](https://github.com/saghul/txiki.js/) 驱动的后端，拥有完整的系统访问能力（包括 FFI！）、原生 webview 渲染，以及小巧的 macOS、Linux 和 Windows 构建产物。它甚至让最终应用的签名与公证变得很简单。

*Tarwin Stroh-Spijer*

不过这个领域还有很多出色的选择：

- [Electrobun](https://blackboard.sh/electrobun/) 提供更丰富的多窗口和 GPU 功能，代价是更大的 TypeScript 运行时——不过它也可以改用 Zig、Rust、Go 或 Odin 来编写体积小巧的原生主进程。
- [Perry](https://www.perryts.com/) 是一个 TypeScript 到原生 AOT 编译器，其主要 UI 模型渲染 AppKit、Win32 和 GTK4 控件，带来更传统的原生观感。
- [Electron](https://www.electronjs.org/) 和实验性的 [Deno Desktop](https://deno.com/blog/v2.9#deno-desktop) 功能强大，但它们的可执行文件通常要大好几倍。
- [Neutralinojs](https://neutralino.js.org/) 应用甚至可以比 tinyjs 的更小，但按设计你会失去通用的 JavaScript 特权后端。

<div style="float:right"><img  src="@@CDN@@/assets/img/web/JavaScriptWeekly46/img-02.webp" width="140" height="140" alt="ParadeDB" style="padding-top: 12px; padding-left: 12px;"></div>

## [在 Drizzle 中使用全文搜索，无需第二套系统](https://github.com/paradedb/drizzle-paradedb)

试试 ParadeDB 官方的 Drizzle 集成。直接搜索你正在使用的 Postgres 表。无需 ETL，无需 Elasticsearch。ParadeDB Cloud 即将推出。

*ParadeDB 赞助*

## [在浏览器中用 DuckDB-Wasm 和 OPFS 实现持久化数据库](https://duckdb.org/2026/09/18/opfs-wasm)

一篇实战演练：在浏览器中运行 [DuckDB](https://duckdb.org/)，借助如今所有主流浏览器都已支持的[源私有文件系统](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system)（OPFS），让数据库文件在页面重新加载后依然存在。

*Piovesan 和 Wielenga (DuckDB)*

## [Linear 如何重构 CI，让测试量提升 4 倍](https://linear.app/now/ci-bottleneck-reworked)

激进的智能体让 Linear 的测试套件不断膨胀，CI 成本也随之上升！他们分享了一些补救措施：把类型感知的 ESLint 规则改写为纯 AST 检查，让 lint 时间缩短了 55%，也让迁移到 [Oxlint](https://oxc.rs/docs/guide/usage/linter) 更容易；而选择性地关闭 Vitest 的隔离机制，每月又节省了 17%。

*Mufeez Amjad (Linear)*

### 简讯

- Lovable 出于性能考虑，用 Rust [重写了 Vite 的开发服务器](https://lovable.dev/blog/faster-previews-oj)（称之为 [OJ](https://rapha.land/introducing-oj/)），但 Evan You [对基准测试提出质疑](https://socket.dev/blog/oj-vite-rust)，并预测 AI 会让每个人都去维护“自己的 slop fork”。

- 📊 [npmchart.com](https://www.npmchart.com/) 可以绘制任意 npm 包的下载趋势、发布记录和仓库活跃度（例如这里是 [Svelte 的](https://www.npmchart.com/p/svelte)），还能对比不同的包。

- 🔒 npm 现在提供 [stage-only token](https://github.blog/changelog/2026-09-18-stage-only-npm-tokens-for-safer-automation/)，让自动化工作流先暂存一个发布，再由维护者通过 2FA 审批。这为那些暂时无法迁移到[可信发布](https://docs.npmjs.com/trusted-publishers)的人提供了一条迁移路径。

### 版本发布

- [Turborepo 2.11](https://turborepo.dev/blog/2-11) – 实验性的 Rust、Python 和 Go 支持加入任务图，相比 2.9 启动速度最高提升 4 倍。
- [ESLint 10.11.0](https://eslint.org/blog/2026/09/eslint-v10.11.0-released/) – 性能更新，启动和 lint 更快。
- [Node.js 26.10.0 (Current)](https://nodejs.org/en/blog/release/v26.10.0) – 新增 [`util.debounce`/`throttle`](https://github.com/nodejs/node/pull/65899)。
- 📊 [billboard.js 4.1](https://netil.medium.com/billboard-js-4-1-0-live-resizing-configurable-subchart-react-subpath-csp-safe-worker-e1a6fd0ece88)、[QuickJS-ng 0.17.0](https://github.com/quickjs-ng/quickjs/releases/tag/v0.17.0)、[VueUse 15.0](https://github.com/vueuse/vueuse/releases/tag/v15.0.0)

## 📖 文章和视频

### [一名卧底分析师潜入了 “Mini Shai-Hulud” 背后的团伙](https://www.wired.com/story/an-undercover-google-analyst-infiltrated-a-notorious-supply-chain-hacking-gang/)

对今年春天那波连环供应链攻击背后的团伙来说，这是个坏消息……Google 在他们群里安插了卧底！WIRED 讲述了该团伙是如何被监控和瓦解的，并促成了[最近的两起逮捕](https://www.afp.gov.au/news-centre/media-release/two-wa-men-charged-following-afp-fbi-wapf-disruption-alleged-global)。

*Andy Greenberg (WIRED)*

---

### [V8 运行时破坏了我的常量时间 JavaScript 库](https://soatok.blog/2026/09/12/the-v8-javascript-runtime-undermined-my-constant-time-javascript-library/)

探讨了由于 V8 处理布尔值和 `-0` 的方式，即使是无分支的 JavaScript 也可能通过 CPU 缓存行为泄露机密。

*Soatok Dreamseeker*

---

### [你的 UI 并不慢，它在等数据](https://www.tigerdata.com/go/trial?utm_source=content-syndication&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)

TimescaleDB 扩展了 Postgres，让你的 UI 背后的数据在持续增长时依然加载迅速。[立即获取 1000 美元额度开始使用](https://www.tigerdata.com/go/trial?utm_source=content-syndication&utm_medium=referral&utm_campaign=javascript-weekly-newsletter)。

*Tiger Data（TimescaleDB 的创造者）赞助*

---

### [框架还重要吗？](https://brookslybrand.com/posts/do-frameworks-matter-anymore/)

如果你在使用 AI，那么要么你在用某个框架，要么你的 agent 正在临时拼凑一个。一位 Remix 团队成员认为，这正是我们应该*想要*框架、而且想要*更好*框架的理由。

*Brooks Lybrand*

---

### 📄 [如今我们都是产品工程师](https://seldo.com/posts/we-are-all-product-engineers-now)

Laurie 认为，理解客户需求正在成为开发者的核心技能。

*Laurie Voss*

---

### 📺 [AI 正在改变 JavaScript 本身的设计方式吗？](https://www.youtube.com/watch?v=_iVDudRDS-4)

TC39 代表 Michael Ficarra 的两分钟观点。

*JetBrains*

---

### 📄 [Solid 2.0：细节之处见真章](https://www.brenelz.com/posts/solidjs-its-the-little-things/)

六处改动，改变了 [SolidJS 2.0](https://www.solidjs.com/blog/solid-2-0-rc-the-big-reveal) 的使用手感。

*Brenley Dueck*

---

### 📄 [Notion 如何用 CRDT 处理并发编辑](https://www.notion.com/blog/how-notion-handles-concurrent-editing-with-crdts)

Notion 工程团队解析其基于 CRDT 的并发编辑实现。

*Nehmzow 和 Guo (Notion)*

## 🛠 代码与工具

### [Plotly.js 4：热门图表库的大更新](https://plotly.com/blog/announcing-plotly-js-4-plotly-py-7/)

![xuy1lcdg0vlkmjacpeux](@@CDN@@/assets/img/web/JavaScriptWeekly46/img-03.webp)

如今自带 TypeScript 类型定义，新增用于绘制向量场的“quiver”图（上图，文章中有大量精彩示例），支持 CSS Color 4 颜色字符串，并移除 Mapbox GL 改用 MapLibre（无需 token！）。

*Chris Parmer*

---

### 🤖 [Transformers.js v4.3：在浏览器中运行 AI 模型](https://github.com/huggingface/transformers.js/releases/tag/4.3.0)

新增对结构化输出（如 JSON）的支持、在 Safari 26+ 上使用 WebGPU，以及对 DeepSeek v4 的支持。[文档](https://huggingface.co/docs/transformers.js/index)已全面改版，现在还提供了一个可用的 [agent skill](https://github.com/huggingface/transformers.js/blob/main/.ai/skills/transformers-js/SKILL.md)。

*Hugging Face*

💡 Hugging Face 还发布了[一个包含 207 个 Apache-2.0 WebGPU kernel 的合集](https://huggingface.co/blog/webgpu-kernels)——包括 matmul、attention 和量化算子，可用于你自己的运行时。

---

### [还在手动编写测试？Meticulous AI 来了](https://www.meticulous.ai/?utm_source=jsweekly&utm_medium=newsletter&utm_campaign=26q3&utm_content=sponsored)

不稳定的测试在拖慢开发进度？Meticulous 通过自主测试 Web 应用的每个边界情况，让工程师有信心更快地交付。

*Meticulous 赞助*

---

### [`@shadcn/lint`：面向 Tailwind 的 agent 优先 linter](https://github.com/shadcn-ui/lint)

一个 ESLint/Oxlint 插件，用于强制执行诸如“禁止使用原始颜色”、“禁止从外部重新样式化 `<Button>`”之类的规则，并通过报错引导 agent 回到你的 variants 和 tokens。

*shadcn*

---

### [Devframe：随处运行 DevTools 的构建框架](https://devfra.me/posts/pluggable-extensible-playful-devtools)

出自 Vitest 和 Nuxt DevTools 背后的开发者——“一个用于构建 DevTools 的框架，就像 Nuxt 或 Next.js 为 Web 应用提供框架那样”。只需定义一次工具，Devframe 就会把它变成 Web 标准的请求处理程序，几乎可以挂载到任何地方。

*Anthony Fu*

---

### ✉️ [Mailflare：完全构建在 Cloudflare 之上的自托管收件箱](https://github.com/hieunc229/mailflare)

一个用于自定义域名的自托管收件箱，基于 Cloudflare 的 Email Routing、Workers、D1 和 R2 构建。AGPL 3.0 许可。

*Hieu Nguyen*

### 版本发布

- [gridstack.js 14.0](https://github.com/gridstack/gridstack.js/releases/tag/v14.0.0) – 这个流行的拖拽式仪表板布局库新增了 `list` 模式，可以像可排序列表一样重排 widget。（[演示](https://gridstackjs.com/demo/index.html)。）
- 🖼️ [image-dimensions 2.6](https://github.com/sindresorhus/image-dimensions) – 通过读取最少的数据，快速获取图片的尺寸。
- [Feedsmith 3.0](https://feedsmith.dev/) – 快速解析和生成 Web feed，包括 RSS、Atom 和 JSON。

## 📢 生态系统其他动态

### [纯 CSS 的“手绘”注释](https://neat-annotations.syabro.com/)

![ybmk2nasvvasjcjmkclc](@@CDN@@/assets/img/web/JavaScriptWeekly46/img-04.webp)

我很喜欢这些纯 CSS 的“手绘”注释（上图），只需一个 `data-note` 属性，就能把它们添加到任何页面。

---

### [资深工程师的“死亡螺旋”](https://sunilpai.dev/posts/the-senior-engineer-death-spiral/)

Cloudflare 的 Sunil Pai 写道：为了在新岗位上证明自己而消失数周，最终却把自己耗到精疲力竭。

---

### 🤖 [Jev：席卷开发者社交媒体的快速“决策模型”](https://simonwillison.net/2026/Sep/21/jev/)

Simon Willison 介绍了 Jev，一个正在席卷开发者社交媒体的新型快速“决策模型”。喂给它半结构化的状态和一个或多个问题，它只返回数字（概率、选项和分数）。

---

### [GitHub Actions 新增 `cache-mode` 设置](https://socket.dev/blog/github-actions-cache-mode)

可按工作流或 job 限制缓存访问，防范今年 5 月[导致 TanStack npm 包被入侵](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem)的那类缓存投毒攻击。

*原文链接：[JavaScript Weekly Issue 803](https://javascriptweekly.com/issues/803)*
