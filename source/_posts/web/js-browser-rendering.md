---
title: JavaScript-浏览器渲染原理
date: 2018-03-14 13:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## 浏览器渲染原理

## Web 的执行分为两个阶段

1. 页面构建阶段(通过对 HTML 标签的解析，进行 DOM 的构建): 遇到 Script 标签(script 标签也是 HTML 标签的一种)时，执行标签中的 JavaScript 代码(1.JavaScript 代码通过浏览器暴露给JavaScript 引擎的全局对象: window 对象 来操作当前页面中的所有变量，浏览器 API 2.注册事件处理器)

2. 事件处理阶段: 按照事件的生成顺序，依赖事件队列来循环的处理事件。

### 不同环境下的顶层对象

1. ES5 之前，顶层对象的属性(window)和全局变量是等价的 (变量未声明就使用不报错)(window 对象是当前的浏览器窗口，是当前页面的顶层对象)
2. ES6 之后，var 和 function 声明的全局变量依旧是顶层对象(window窗口)的属性，let, const, class 声明的全局变量不再属于 window 对象(在控制台中查看时属于一个叫 script 的对象)

### globalThis 对象(和宿主环境有关)

1. 浏览器里面，顶层对象是 window，但 Node 和 Web Worker 没有 window。
2. 浏览器和 Web Worker 里面，self 也指向顶层对象，但是 Node 没有self。
3. Node 里面，顶层对象是 global，但其他环境都不支持。

**ES2020在语言标准的层面，引入 globalThis 作为顶层对象。也就是说，任何环境下，globalThis都是存在的，都可以从它拿到顶层对象，指向全局环境下的 this。**

## 浏览器加载时间线

1. 创建 Document 对象，开始解析 web 页面。这个阶段的 document.readyState  = "loading".
2. 遇到 link 外部 css，创建线程异步加载，并`继续解析文档`。(CSS 下载完成后进行 CSS 解析工作)
3. 遇到 script 外部 js，并且没有设置 async，defer，浏览器下载 JS 文件，并`阻塞后续 DOM 结点的解析`。等待 JS 下载完成并执行完成该脚本后`继续解析文档`。
4. 遇到 script 外部 js，并且设置 async，defer。浏览器创建线程加载，`并继续解析文档`。(async 属性的脚本，脚本加载完之后立即执行)
5. 遇到 img 标签的话，先正常解析 dom 结构，然后浏览器异步加载 src，`并继续解析文档`。
6. 当文档解析(DomTree完成，但是 img 的图片不一定被加载出来，只是 img 的 DOM 被加载了)完成后，document.readyState = "interactive".
7. 当文档解析(DomTree完成)完成后，所有设置 defer 的脚本会按照顺序执行。
8. document 对象触发 `DOMContentLoaded` 事件(`文档解析完成`)
9. 当所有 `async 的脚本加载完成并执行`、`img 加载完成`、`CSS 加载解析完成`后。document.readyState = "complete", window 对象触发 `load` 事件(`文档加载完成`)
10. 从此之后，以异步响应的方式处理用户输入，网络事件等。(由`页面构建阶段`转为`事件驱动阶段`)

## JS 和 CSS 对于 DOM 解析的阻塞

### JS

* JS 的`下载`和`执行`都会阻碍后面 DOM 的`解析`(因为 JS 可以改变和操作 DOM)
* 所以 script 标签推荐写在 body 的最下方， 在 DOM 解析完成之后再下载和执行 JS 文件。以减少页面空白时间

### CSS

* CSS 是由单独的下载线程异步下载的：

1. `link 标签后没有 script 标签`：解析 CSS 不会阻塞 DOM 的解析，但是会阻塞页面的渲染(因为 Render Tree = DOM Tree + CSSOM Tree)
2. `link 标签后有 script 标签`: 解析 CSS 行为本身并不会阻塞 DOM 的解析，但是 JS 文件执行需要等待 CSS 解析完成，又因为 JS 的执行会阻塞 DOM 的解析，所以解析 CSS 行为会间接的阻塞 DOM 的解析。

* 所以 link 标签推荐写在 head 中，尽快的下载 CSS 文件，尽快完成 CSS 的解析，以免阻塞 JS 的文件执行。

## 渲染管线的几个阶段

- 解析 HTML 生成 DOM 树，解析 CSS 生成 CSSOM 树，两者合并得到渲染树
- 渲染树只包含可见内容，设置了 `display: none` 的元素及其后代不会进入渲染树；`visibility: hidden` 的元素仍占据空间，会保留在渲染树中
- 布局计算每个可见节点的尺寸和位置，第一次确定尺寸位置称为 layout，之后的重新计算称为 reflow
- 绘制把布局得到的盒子转成屏幕上的像素；必要时内容提升为独立图层，由合成步骤按正确顺序叠到屏幕上
- 图片、视频等替换元素在布局阶段先预留占位空间，尺寸确定后再回填
- 渲染管线依次经过样式计算、布局、绘制，部分场景下还有合成步骤

## 重排与重绘的触发

- 盒模型属性（宽高、位置、字体大小等）变化会触发重新布局，随后往往跟着重绘和重新合成
- 仅颜色、背景等外观变化通常不触发重新布局，只触发重绘
- 图片未声明尺寸时，图片加载完成会触发一次重排
- 图层可以改善绘制性能，但占用内存，不宜为大量元素过度提升图层
- 合成把页面分层栅格化，滚动时图层已栅格化，只需合成新帧；动画通过移动图层并合成新帧完成
- 主线程需在每帧时间预算内完成样式计算、重排和绘制，才能保证滚屏和动画流畅

## DOMContentLoaded 与 load 的区别

- `DOMContentLoaded` 在 HTML 解析完成、DOM 树构建好之后触发，此时不带 `async` 的脚本已经执行完毕
- `load` 事件在页面引用的脚本、图片、样式表等全部资源加载完成后，由 `window` 触发
- `document.readyState` 取值为 `loading`、`interactive`、`complete`，分别对应解析中、文档解析完成、全部资源加载完成
- 首次绘制对应首次有意义绘制；可交互时点指页面能在较短时间内响应用户交互的位置

## 脚本加载与解析的关系

- 不带 `async`、`defer` 的脚本会阻塞后续 DOM 解析，下载并执行完毕后才继续解析文档
- 等待 CSS 不会阻塞 HTML 的解析和下载，但会阻塞 JavaScript 的执行
- `async` 脚本加载完成后立即执行，不保证按文档中的先后顺序执行；`defer` 脚本按顺序执行，且在 `DOMContentLoaded` 之前执行
- 模块脚本 `<script type="module">` 默认延迟加载，行为与 `defer` 类似，无需再额外写 `defer` 属性
- 预加载扫描器在主线程解析文档时提前扫描内容，在后台请求 CSS、脚本、字体等高优先级资源

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/Performance/Guides/Critical_rendering_path
- https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work
