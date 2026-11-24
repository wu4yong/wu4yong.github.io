---
title: JavaScript周刊-24
date: 2018-03-24 11:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-jsweekly"></div>

# JavaScript Weekly

## JavaScript Weekly Issue 781: 2026年4月14日

## [深入 MDN 全新前端的幕后](https://developer.mozilla.org/en-US/blog/mdn-front-end-deep-dive/)

![mdn](@@CDN@@/assets/img/web/JavaScriptWeekly24/img-01.webp)

极为有用的 MDN 从头开始重建了其前端技术栈，放弃了 React，转而使用 Web Components 和自研的服务端组件系统。这是一篇关于构建现代、内容密集型网站而不在每个页面上传输不必要 JavaScript 的精彩文章。

*Leo McArdle (MDN)*

---

## [像发布网站一样发布移动应用](https://expo.dev/)

Expo 为 JavaScript 开发者提供了类似 Web 工作流的原生移动开发体验。设备上的热重载、跳过应用商店审核的 OTA 更新、像 Vercel 一样工作的云构建。从 `npx create-expo-app` 开始。

*Expo 赞助*

## 🕹️ [Phaser 4.0: 2D WebGL 和 Canvas 游戏框架](https://phaser.io/)

这个广受欢迎的游戏框架庆祝其 13 岁生日，发布了[一个主要版本](https://github.com/phaserjs/phaser/releases/tag/v4.0.0)，重点在于性能/效率改进，并包含[技能文件](https://github.com/phaserjs/phaser/tree/master/skills)，让 AI 智能体也能够很好地构建 Phaser 4.0 应用。有[大量演示](https://labs.phaser.io/)，包括[这些游戏](https://labs.phaser.io/?path=games)，现有用户可参考 [v3 到 v4 迁移指南。](https://github.com/phaserjs/phaser/blob/master/changelog/v4/4.0/MIGRATION-GUIDE.md)

*Phaser Studio Inc.*

## 简讯

- Google 将从 6 月起[惩罚"劫持"浏览器后退按钮的网站](https://developers.google.com/search/blog/2026/04/back-button-hijacking)。*"确保你没有做任何干扰用户浏览历史导航的事情，"* Chris Nelson 说道。

- [TanStack Start](https://tanstack.com/start/latest) 现已[（实验性地）支持 React Server Components。](https://tanstack.com/blog/react-server-components)

- 🇫🇷 [dotJS](https://www.dotjs.io/) 将于 9 月 18 日重返法国巴黎——[其议题征集](https://www.dotjs.io/speak)还有两周时间，如果你想演讲的话。

- 🇷🇴 [*JSHeroes* 大会](https://jsheroes.io/) 将于 5 月 14-15 日在罗马尼亚回归。

## 版本发布

- [Bun v1.3.12](https://bun.com/blog/bun-v1.3.12) – 这个 JS 运行时现在内置了原生无头浏览器自动化功能，[`Bun.cron`](https://bun.com/blog/bun-v1.3.12#in-process-bun-cron-scheduler) 提供了进程内任务调度器。

- ⚠️ [React 19.2.5](https://github.com/facebook/react/releases/tag/v19.2.5)、[19.1.6](https://github.com/facebook/react/releases/tag/v19.1.6) 和 [19.0.5](https://github.com/facebook/react/releases/tag/v19.0.5) 已发布，修复了一个 React Server Components 漏洞。

- [React Native 0.85](https://reactnative.dev/blog/2026/04/07/react-native-0.85) – 新的动画后端和开发者工具改进。

- [pnpm v11.0 RC 0](https://github.com/pnpm/pnpm/releases/tag/v11.0.0-rc.0)、[React Three Fiber 9.6](https://github.com/pmndrs/react-three-fiber/releases/tag/v9.6.0)、[Electron 41.2](https://github.com/electron/electron/releases/tag/v41.2.0)、[DOMPurify 3.4](https://github.com/cure53/DOMPurify/releases/tag/3.4.0)

## 📖 文章和视频

### [安装每一个 Firefox 扩展](https://jack.cab/blog/every-firefox-extension)

![firefox-ext](@@CDN@@/assets/img/web/JavaScriptWeekly24/img-02.webp)

一个人使用 JavaScript 探索 Firefox 扩展生态系统的有趣而英勇的故事。里面有多少奇奇怪怪的东西啊！我非常喜欢这篇文章，宛如开发者的*《爱丽丝梦游仙境》*。请多来些这样的探索性文章。

*Jack Cab*

---

### [嵌套 Promise 的用途](https://blog.jcoglan.com/2026/03/23/uses-for-nested-promises/)

James 重新审视了 2013 年的 [Promises/A+](https://promisesaplus.com/) Monad [争论](https://github.com/promises-aplus/promises-spec/issues/94)，由于遇到的一个实际并发问题而改变了看法。有挑战性，但收获颇丰。

*James Coglan*

---

### [你不能取消一个 Promise（但有时可以）](https://www.inngest.com/blog/stop-promise-without-resolution)

你无法取消一个 Promise，但可以通过让它 await 一个永远不会 resolve 的 Promise 来中止一个异步函数。函数会默默停止，GC 会清理后续资源。

*Aaron Harper (Inngest)*

---

### [44 场 Postgres 演讲任你选择，全部在免费的虚拟活动中](https://posetteconf.com/2026)

参加 POSETTE: An Event for Postgres 2026，一个免费的虚拟 Postgres 开发者活动，6 月 16-18 日。[查看日程安排。](https://posetteconf.com/2026)

*Microsoft | AMD 赞助*

---

### [解析，而非验证（在不想让你这样做的语言中）](https://christianekrem.com/blog/parse-dont-validate)

厌倦了在多个文件中编写相同的防御性 if 检查，因为你不信任验证已经发生过了？Branded Types 和可辨识联合类型可以让 TypeScript 为你携带这样的证明。

*Christian Ekrem*

---

### 🌐 [Intl API：你还没开始用但最好的浏览器 API](https://kilianvalkhof.com/2026/javascript/the-intl-api-the-best-browser-api-youre-not-using/)

一篇精炼的、代码密集的入门指南，介绍你可以用 Intl 做什么。

*Kilian Valkhof*

---

## 🛠 代码与工具

### [Boneyard: 为你的 UI 自动生成骨架屏](https://boneyard.vercel.app/overview)

![boneyard](@@CDN@@/assets/img/web/JavaScriptWeekly24/img-03.webp)

截取你的真实 UI 并捕获一个骨架"骨块"的扁平列表，这些定位精确、尺寸匹配的矩形完美地镜像了页面布局。支持 React、Preact、React Native、Vue、Svelte 和 Angular。

*0xGF*

---

### 📈 [Micro-ML: 预测和聚类算法工具包](https://micro-ml.github.io/)

一个约 56KB 的 WASM 驱动库，包含回归和平滑算法。无需引入 TensorFlow.js 即可完成点聚类、数据分类或预测序列中的下一个值。

*Adam Perliński*

---

### [AI 写代码，Wallaby MCP 确保它真的能用](https://wallabyjs.com/?utm_source=cooperpress&utm_medium=javascriptweekly&utm_content=javascriptweekly)

为你的 AI 智能体提供实时执行数据、覆盖率和实时洞察，自信地生成测试和代码。

*Wallaby Team 赞助*

---

### [Ink 7.0: 使用 React 构建 TUI 和命令行应用](https://github.com/vadimdemedes/ink)

为许多流行的终端应用提供动力，v7.0 现在基于 React 19.2，内部使用 `useEffectEvent` 以提高效率，并带来了新的 Hooks 和设置。

*Vadim Demedes*

---

### 🔊 [web-audio-api: 在 Node 和 Bun 中使用 Web Audio API](https://github.com/ircam-ismm/web-audio-api)

完整的 Web Audio API 支持，可在你的机器/服务器上播放音频或渲染到文件（是的，Tone.js 也能用）。有许多示例可供欣赏。

*Sébastien Piquemal*

---

### [Syncpack: 在大型 JS Monorepo 中保持依赖版本一致](https://jamiemason.github.io/syncpack/)

一个 CLI 工具（被 Electron、Cloudflare、Vercel 等使用），可在整个 monorepo 中查找版本不匹配、修复它们，并可在 CI 中强制执行版本策略以避免未来的漂移。

*Jamie Mason*

---

## 📢 生态系统其他动态

### 🖥️ [在浏览器中运行 Windows 95](https://github.com/felixrieseberg/windows95)

![windows95](@@CDN@@/assets/img/web/JavaScriptWeekly24/img-04.webp)

一个完整的 Windows 95 环境，直接在浏览器中运行——这是一次令人惊叹的怀旧之旅，展示了 JavaScript 模拟器的惊人能力。

---

*原文链接：[JavaScript Weekly Issue 781](https://javascriptweekly.com/issues/781)*
