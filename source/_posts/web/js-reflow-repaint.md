---
title: JavaScript-重排和重绘
date: 2018-03-14 18:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## 页面的重排(回流)和重绘

## 一、核心概念

### 1.1 重排

- 定义：当 DOM 元素的几何属性（如宽度、高度、边距、填充、位置等）发生变化，或者 DOM 树结构发生增删时，浏览器需要重新计算元素在页面上的确切位置和大小。这个“重新计算布局”的过程，就称为重排（也叫回流）
- 特点：重排开销非常大，因为它可能导致相关节点（甚至整个页面）的布局都需要重新计算。重排必定会触发重绘

### 1.2 重绘

- 定义：当 DOM 元素的外观属性（如 color、background-color、outline 等）发生变化，但不影响其布局时，浏览器会跳过重排，直接进入绘制阶段，为元素应用新的样式。这个过程就是重绘。
- 特点：重绘的开销小于重排。

### 1.3 合成

- 定义：在现代浏览器中，还存在一个“合成”阶段。当使用特定属性（如 transform、opacity）时，浏览器会将该元素提升到一个独立的“合成层”（Compositor Layer）。当这些属性变化时，浏览器既不需要重排也不需要重绘，而是可以直接在 GPU 中进行图层变换（合成），效率极高。
- 特点：开销最小，是实现高性能动画的首选。

### 1.4 为什么代价昂贵？

- 因为 JavaScript 引擎线程（JS 线程）和 GUI 渲染线程是互斥的。当 JS 线程执行时，GUI 线程会被挂起；反之亦然。如果 JS 频繁操作 DOM 引发重排和重绘，GUI 线程就需要频繁执行，导致 JS 线程的执行被中断，从而产生页面卡顿

## 二、触发重排 (Reflow) 的常见操作

1. DOM 结构变化：添加或删除可见的 DOM 节点。
2. 几何属性变化：修改元素的 width, height, margin, padding, border, left, top 等。
3. 页面初次渲染：这是不可避免的第一次重排。
4. 浏览器窗口尺寸变化（resize）。
5. 关键：强制重排（Forced Reflow）与布局抖动（Layout Thrashing）

- 浏览器本身很智能，它会维护一个“渲染队列”，将多次“写操作”（如改变样式）缓存起来，然后批量执行一次重排。但是，如果在“写操作”之后，你立即执行了“读操作”来查询布局信息，浏览器为了返回最精确的值，会立即强制执行渲染队列中待处理的重排（即强制重排）。如果在循环中交替执行“写”和“读”，就会导致布局的反复计算，这就是“布局抖动”，性能会急剧下降。

- 常见的“读操作”（强制重排触发器）包括：

```js
offsetTop, offsetLeft, offsetWidth, offsetHeight
scrollTop, scrollLeft, scrollWidth, scrollHeight
clientTop, clientLeft, clientWidth, clientHeight
getComputedStyle()
getBoundingClientRect()
```

## 三、性能优化策略

### 3.1 最小化DOM访问(读写分离)

- 将“读操作”和“写操作”分离，避免出现布局抖动。

```js
// 糟糕的写法：读写交错（布局抖动）
el.style.width = el.offsetWidth + 10 + 'px'; // 读（offsetWidth） -> 写
el.style.height = el.offsetHeight + 10 + 'px'; // 读（offsetHeight） -> 写

// 推荐的写法：先读后写
const currentWidth = el.offsetWidth;
const currentHeight = el.offsetHeight;

el.style.width = currentWidth + 10 + 'px';
el.style.height = currentHeight + 10 + 'px';
```

### 3.2 批量处理 DOM 修改（减少重排次数）

- 避免在循环中逐个修改样式

```js
// 使用 class 将所有样式定义在一个 class 中，一次性切换 class
el.classList.add('new-styles');

// 使用 DocumentFragment （适用于批量添加 DOM 节点）
const frag = document.createDocumentFragment();
for (let i = 0; i < 10; i++) {
  const li = document.createElement('li');
  frag.appendChild(li);
}
// 只有一次重排
document.body.appendChild(frag);
```

### 3.3 “离线”修改元素

- 如果必须对一个元素进行复杂的、多次的样式修改，可以先将其“离线”，操作完成后再“上线”

```js
// 1. 设置 display: none
el.style.display = 'none';

// 2. 在“离线”状态下进行多次修改
el.style.width = '100px';
el.style.height = '100px'; 
// ... 更多操作 ...

// 3. 恢复显示
el.style.display = 'block';
```

### 3.4 提升为合成层

- 这是针对动画和频繁变动元素的终极优化方案。

### 脱离文档流（absolute/fixed)

- position: absolute 或 fixed 可以限制重排的范围。当它变动时，它不会影响到其他正常文档流中的元素，实现了“局部重排”。

### GPU 加速

- 更进一步的优化是，使用 transform 和 opacity 属性。
- 浏览器会将使用这些属性的元素（以及 will-change 提示的元素）提升到单独的“合成层”。
- 对这些属性的修改（如 transform: translateX(10px)）将完全跳过重排和重绘，直接在 GPU 中进行“合成”。
