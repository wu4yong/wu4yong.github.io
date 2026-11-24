---
title: JavaScript-浏览器
date: 2018-03-11 02:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## 浏览器历史

## 浏览器组成部分

- shell外壳
- 内核
  1. 渲染引擎  WebCore 主要负责页面的绘制
  2. js引擎   JSCore 主要负责 JS 代码的解析执行，其中 V8 引擎是最有名的，并且 V8 引擎使用 C++ 编写。V8 可以独立运行，也可以嵌入到任何 C++ 程序中(因此 javaScript 具有跨系统执行的优势)

## 主流浏览器

* IE, FireFox, Safari, Chrome, Opera

## 浏览器的主要组成部分

- 用户界面：地址栏、前进后退按钮、书签菜单、标签页等可见控件
- 渲染引擎：解析 HTML、CSS，构建渲染树，完成布局、绘制与合成
- JavaScript 引擎：解析、编译和执行脚本
- 网络组件：负责发起 DNS 查询和 HTTP 等协议的请求与响应
- 日常所说的浏览器内核，是渲染引擎与 JS 引擎等组件的统称；不同资料对内核的划分口径不完全一致

## 浏览器进程与渲染进程

- Chrome 类多进程浏览器中，浏览器进程负责地址栏、书签、前进后退等界面部分，以及网络请求、文件访问等浏览器特权部分
- 渲染进程负责标签页内网站内容的显示与交互
- 插件进程负责页面使用的插件；GPU 进程在独立于其他进程的环境中处理 GPU 任务
- GPU 需要处理来自多个应用的请求并绘制到同一表面，因此被单独划分到独立进程
- 浏览器还可能存在扩展进程、工具进程等辅助进程
- 不同站点通常分配到不同渲染进程；同一站点的多个标签页在内存压力下可能共用渲染进程
- 同一标签页内，不同站点的 frame 分配到不同渲染进程，同站点的 frame 共用同一渲染进程
- 多进程隔离让单个页面的故障或慢速任务不直接影响浏览器整体界面，性能和安全边界彼此分开

## 主线程与合成线程的分工

- 渲染进程的主线程执行脚本、渲染事件循环、文档生命周期、命中测试、事件派发以及 HTML/CSS 解析
- 合成线程处理输入事件、动画、页面滚动、分层判断，并协调图片解码、栅格化和绘制任务
- Viz 进程聚合来自多个渲染进程和浏览器进程的合成结果，借助 GPU 完成光栅化与绘制
- 主线程被脚本占满时，滚动、点击等交互会等待；合成线程上的部分动画和滚动可以不依赖主线程
- 主线程助手线程负责位图、Blob 等需要编解码的辅助任务；Web Worker 为 OffscreenCanvas 运行脚本和渲染事件循环
- 合成线程助手线程协调 Viz 栅格化、图片解码、paint worklet 和后备栅格化任务

## 渲染引擎与 JavaScript 引擎

- 渲染引擎把 HTML、CSS、JavaScript 及图片等资源转成可查看、可交互的页面
- JS 引擎实现 ECMAScript 语言，接收源代码解析并执行；现代引擎通过即时编译（JIT）把脚本转换为处理器可执行的机器码
- 浏览器中 JS 引擎通过 DOM 和 Web IDL 绑定与渲染引擎配合；部分引擎还在同一沙箱内执行 WebAssembly 代码
- JS 引擎和渲染引擎是两类不同的组件，不要把二者混为一谈
- HTML 解析包含分词和树构建两个步骤，解析结果是 DOM 树；CSSOM 与 DOM 是两棵独立的数据结构，CSSOM 还包含用户代理默认样式表
- JavaScript 先被解析成抽象语法树，部分引擎再编译输出字节码；大部分代码在主线程解释执行，Web Worker 中的代码是例外

## 主流浏览器与对应渲染引擎

- Blink 用于 Chrome、Edge、Opera、Brave 等 Chromium 系浏览器；Chromium 项目从 WebKit 分叉出 Blink 引擎
- Gecko 是 Mozilla 开发的布局引擎，用于 Firefox
- WebKit 是 Safari 使用的引擎；iOS 与 iPadOS 上的浏览器按系统要求使用 WebKit

```js
// 现役主要渲染引擎与对应浏览器
const engines = {
  Blink: "Chrome、Edge、Opera 等 Chromium 系",
  Gecko: "Firefox",
  WebKit: "Safari",
};
```

## 常见 JavaScript 引擎

- V8 是 Google 开发的 JS 引擎，用于 Chrome 及 Chromium 系浏览器，也被 Node.js、Deno、Electron 等运行时使用
- SpiderMonkey 是 Mozilla 开发的 JS 引擎，用于 Firefox，它是首款 JavaScript 引擎，由 Brendan Eich 在 Netscape 时期创建
- JavaScriptCore（又称 SquirrelFish/Nitro）是 Apple 开发的 JS 引擎，用于 Safari 等 WebKit 系浏览器
- 早期 Opera 使用的 Carakan、Internet Explorer 使用的 Chakra 属于历史引擎，已不再用于现役主流浏览器

## 页面从字节到可交互

- 收到网络数据后，浏览器先把字节解析成 DOM 树和 CSSOM 树，再合并为渲染树
- 渲染树只包含可见内容；布局确定每个可见节点的尺寸和位置，绘制把盒子转成像素，必要时提升为独立图层再合成
- 视频、画布，以及设置了 `opacity`、3D `transform`、`will-change` 等样式的元素，可能被提升到独立图层
- 合成把页面分层栅格化，滚动时图层已栅格化，只需合成新帧；动画通过移动图层并合成新帧完成
- 图层数量过多会使合成开销上升，不应为大量元素滥用图层提升
- 预加载扫描器在主线程解析文档时提前扫描内容，后台请求 CSS、脚本、字体等高优先级资源
- 渲染管线依次经过样式计算、布局、绘制，部分场景下还有合成步骤

## 参考

- https://developer.chrome.com/blog/inside-browser-part1
- https://developer.chrome.com/articles/renderingng-architecture/
- https://developer.mozilla.org/en-US/docs/Glossary/Engine/JavaScript
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/JavaScript_technologies_overview
- https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work
