---
title: JavaScript周刊-22
date: 2018-03-23 18:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 779: 2026年3月31日

## [Axios 软件包被入侵；恶意版本包含木马依赖](https://github.com/axios/axios/issues/6830)

![axios](@@CDN@@/assets/img/web/JavaScriptWeekly22/img-01.webp)

Axios 是一个每周下载量超过 1 亿的 HTTP 库，这主要得益于其历史积累的广泛使用。一名攻击者利用这一点推出了一个包含恶意依赖的版本，其中包含远程访问木马（尽管 Axios 代码库本身没有问题）。这事关重大，因为即使你不在项目中直接使用 Axios，你的依赖项可能使用了它。以下是[如何检查你是否受到影响](https://github.com/axios/axios/issues/6830)。

*Ashish Kurmi*

---

<div style="float:right; margin-left:16px; margin-bottom:8px;">
  <img  src="@@CDN@@/assets/img/web/JavaScriptWeekly22/img-02.webp" width="125">
</div>

## [还在手动编写测试？Meticulous AI 来了](https://www.meticulous.ai?utm_source=jsweekly&utm_medium=newsletter&utm_campaign=26q1&utm_content=primary)

Notion、Dropbox、Wiz 和 LaunchDarkly 现在使用着一种他们离不开的测试范式。Meticulous 由前 Palantir 工程师构建，能够自动创建持续演进的 E2E UI 测试套件，以零开发者投入提供详尽覆盖率。

*Meticulous 赞助*

## [Transformers.js v4: 在浏览器中运行 AI 模型](https://github.com/huggingface/transformers.js/releases/tag/4.0.0)

将 [Hugging Face](https://huggingface.co/) 托管的 Transformer 模型引入 JavaScript，让你可以在浏览器中运行 NLP、视觉和音频模型。v4 切换至 WebGPU 运行时，并可通过 npm 安装。有[许多在线演示](https://huggingface.co/collections/webml-community/transformersjs-v4-demos)，涵盖[实时语音转录](https://huggingface.co/spaces/mistralai/Voxtral-Realtime-WebGPU)、[使用 Qwen 3.5](https://huggingface.co/spaces/webml-community/Qwen3.5-WebGPU) 和[实时视频字幕。](https://huggingface.co/spaces/LiquidAI/LFM2-VL-WebGPU)

*Hugging Face*

## 版本发布

- [Inertia.js 3.0](https://inertiajs.com/) – React、Vue 和 Svelte SPA 与 Laravel、Rails 和 Django 等非 JS 服务端框架之间的粘合剂。[v3 更多信息。](https://laravel.com/blog/inertiajs-v3-is-now-in-beta)

- [Node.js 2026 年 3 月 24 日安全更新](https://nodejs.org/en/blog/vulnerability/march-2026-security-releases) – 包括 [Node.js v25.8.2 (Current)](https://nodejs.org/en/blog/release/v25.8.2)、[v24.14.1 (LTS)](https://nodejs.org/en/blog/release/v24.14.1)、[v22.22.2 (LTS)](https://nodejs.org/en/blog/release/v22.22.2) 和 [v20.20.2 (LTS)](https://nodejs.org/en/blog/release/v20.20.2)。

- [TanStack DB 0.6](https://tanstack.com/blog/tanstack-db-0.6-app-ready-with-persistence-and-includes) – 现已支持持久化、离线支持和层级数据。

- [Astro 6.1](https://astro.build/blog/astro-610/)、[Mantine 9.0](https://mantine.dev/changelog/9-0-0/)、[Ky 2.0 预发布版](https://github.com/sindresorhus/ky/releases/tag/v2.0.0-0)、[CKEditor 48.0](https://github.com/ckeditor/ckeditor5/releases/tag/v48.0.0)、[pnpm 10.33](https://github.com/pnpm/pnpm/releases/tag/v10.33.0)

## 📖 文章和视频

### [Signals：基于 Push-Pull 的算法解析](https://willybrauner.com/journal/signal-the-push-pull-based-algorithm)

![signals](@@CDN@@/assets/img/web/JavaScriptWeekly22/img-03.webp)

一篇图文并茂、从零开始的解释，深入剖析 [Signals](https://preactjs.com/blog/introducing-signals/) 的内部工作原理，聚焦于 Solid、Vue 和 Angular 等框架核心响应式机制中的 push-pull 算法。

*Willy Brauner*

---

### 🖼️ [使用 JavaScript 预加载图片的各种选择](https://macarthur.me/posts/preloading-images/)

*"JavaScript 有多种按需预加载图片的方式，每种方式都有各自的优缺点。让我们一一探索。"*

*Alex MacArthur*

---

### ▶ [不要再猜测你的 Next.js 应用在哪里出问题了](https://youtube.com/playlist?list=PLOwEowqdeNMqf3dArAE-Mo4rVR7T2Vanr&si=tQ_vlQ4bzm_w2MXF)

7 个关于错误监控、回放、追踪和告警的视频，帮助你在 Next.js 技术栈中进行调试。[立即观看。](https://youtube.com/playlist?list=PLOwEowqdeNMqf3dArAE-Mo4rVR7T2Vanr&si=tQ_vlQ4bzm_w2MXF)

*Sentry 赞助*

---

### [npm Workspaces 的温和入门（配图）](https://wasp.sh/blog/2026/03/25/gentle-intro-npm-workspaces)

[Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces) 让你在单个仓库中管理多个包，并链接本地包使它们可以通过名称互相导入。npm 随后会在安装过程中提升和去重兼容的依赖。

*Carlos Precioso*

---

### 更多文章

- 📄 ["我反编译了白宫的新应用"](https://blog.thereallo.dev/blog/decompiling-the-white-house-app) – 这个 React Native 应用中有许多令人惊讶的发现，包括一个 Cookie/付费墙绕过注入器，以及从一个随机用户的 GitHub Pages 动态加载 JavaScript…… *Thereallo*

- 📄 [使用 Three.js、速度和情绪驱动的背景构建滚动响应式 3D 画廊](https://tympanus.net/codrops/2026/03/09/building-a-scroll-reactive-3d-gallery-with-three-js-velocity-and-mood-based-backgrounds/) *Houmahani Kane*

- 📄 [为什么我们用 Bun 替换了 Node.js，获得了 5 倍的吞吐量](https://trigger.dev/blog/firebun) *Nick at Trigger*

## 🛠 代码与工具

### [Pretext: 一个多行文本测量与布局库](https://simonwillison.net/2026/Mar/29/pretext/)

![pretext](@@CDN@@/assets/img/web/JavaScriptWeekly22/img-04.webp)

前 React 核心团队成员 Cheng Lou 三天前[在 X 上的一篇帖子](https://x.com/_chenglou/status/2037713766205608234)引起了轰动，获得了 2200 万次展示，[该仓库](https://github.com/chenglou/pretext)迅速获得了 25000 星标。为什么？人们对实时 Web 布局的潜力感到*非常*兴奋！如果你想看看为何如此兴奋，[这里有演示](https://chenglou.me/pretext/)，尽管这个库本身相对简单直白。

*Cheng Lou*

---

### [GitHub Actions 🤝 Expo CI/CD 工作流](https://try.expo.dev/js-weekly-workflows)

保留 GitHub Actions，添加 Expo Workflows 用于移动端：M4 Pro 构建、E2E 测试、OTA。让每个工具各司其职。

*Expo 赞助*

---

### [Knip v6: 清理 JS/TS 项目的利器](https://knip.dev/blog/knip-v6)

Knip 是查找和移除项目中未使用的文件、导出和依赖的首选工具。v6 集成了 oxc，性能提升 2-4 倍（处理 Astro 仅需两秒），且基本是平滑升级。

*Lars Kappert*

---

### 📺 [ArtPlayer: 现代、功能齐全的 HTML5 视频播放器](https://artplayer.org/)

一种简单直接的方式来获得你自己的高度可定制的 YouTube 风格播放器体验。[完整的在线演示/Playground 可供体验。](https://artplayer.org/)

*Harvey Zhao*

---

### [Semiotic 3.0: React + D3 数据可视化框架](https://semiotic.nteract.dev/)

不仅把基础功能做好，还有一些更独特的能力，如分级统计地图、桑基图、流图和小提琴图，以及流式数据支持。

*nteract*

---

## 📢 生态系统其他动态

### 🧠 [JetBrains IntelliJ IDEA 免费提供 JavaScript/TypeScript 支持](https://blog.jetbrains.com/idea/2026/03/js-ts-free-support/)

![elsewhere2](@@CDN@@/assets/img/web/JavaScriptWeekly22/img-05.webp)

JetBrains 的 Java/Kotlin IDE *IntelliJ IDEA* 现在[免费提供核心 JavaScript 和 TypeScript 功能](https://blog.jetbrains.com/idea/2026/03/js-ts-free-support/)（无需 *Ultimate* 订阅）。

---

### ☁️ [Next.js 跨平台适配](https://nextjs.org/blog/nextjs-across-platforms)

Vercel 解释了[正在进行的让 Next.js 更好地跨云平台运行的工作。](https://nextjs.org/blog/nextjs-across-platforms) *Adapter API* 为平台提供了一种调整应用以适应其环境的方式。OpenNext、Netlify、Cloudflare、AWS Amplify 和 Google Cloud 均已参与。

---

### 🤖 [GitHub Copilot 默认将使用用户数据训练 AI 模型](https://github.blog/news-insights/company-news/updates-to-github-copilot-interaction-data-usage-policy/)

GitHub 宣布，从 4 月底开始，Free/Pro/Pro+ Copilot 用户的数据（包括输入和代码片段）[将默认用于帮助训练未来的 AI 模型](https://github.blog/news-insights/company-news/updates-to-github-copilot-interaction-data-usage-policy/)。你可以选择退出。

---

### 🪲 [Copilot 在 PR 中编辑进了"广告"](https://notes.zachmanson.com/copilot-edited-an-ad-into-my-pr/)

一位开发者发现 [Copilot 在他的一个 PR 中编辑进了一个"广告"！](https://notes.zachmanson.com/copilot-edited-an-ad-into-my-pr/) GitHub 的 Martin Woodward [在 *X* 上解释了原因](https://x.com/martinwoodward/status/2038612131084464521)并表示该"功能"已被禁用。

---

### 🔠 [CodingFont: 视觉化地找到你的理想代码字体](https://www.codingfont.com/)

在寻找新的 IDE 字体选项吗？[CodingFont](https://www.codingfont.com/) 让你通过淘汰赛的方式*视觉化*地找到理想选择。

---

*原文链接：[JavaScript Weekly Issue 779](https://javascriptweekly.com/issues/779)*
