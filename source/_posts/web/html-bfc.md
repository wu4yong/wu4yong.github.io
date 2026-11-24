---
title: HTML+CSS-BFC
date: 2018-02-18 04:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-html"></div>

# HTML+CSS

## BFC

## 元素的BFC(块级格式上下文)

* 块级格式化上下文，一个独立的块级渲染区域，该区域拥有一套渲染规格来约束块级盒子的布局，且与区域外部无关。
* 属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠。

### Box 和 Formatting Context

* Box 就是 css 布局的的对象和基本单位，一个页面有很多个 Box 组成，元素的类型和 display 属性，决定了这个 Box 的类型，会参与不同的 Formatting Box。最常见的有 Block formatting Box(bfc) 和 inline formatting Box(IFC)
* Formatting Context 是页面中的一块渲染区域，有一套渲染的规则，他决定了子元素是如何的定位，以及和其他元素的关系和相互作用。

### 如何触发BFC

* float 为 left, right
* overflow 的值为 auto，hidden。
* display 的值为 table-call，table-caption，inline-block，flex
* position 为 absolute, fixed

### BFC 特性的理解

* 因为 BFC 内部的元素和外部的元素绝对不会互相影响。因此
* 当 BFC 外面存在浮动时，为了不受浮动而影响 BFC 内部元素的布局。BFC 会不与浮动重叠。
* 当 BFC 内部有浮动时为了不影响外部的元素的布局，BFC 高度会包含浮动。
* 避免 margin 重叠也是这个道理。两个元素直接相邻会产生 margin 重叠，但一个触发了 BFC 的元素包裹住其中一个的话，margin 就不会重叠。

### 元素的BFC特性

* 元素 BFC 化后，与浮动元素做兄弟，不会与浮动元素重叠尽管元素不重叠，但是 BFC 元素想要与左边元素有间隔时

1. 如果使用 BFC 元素的 margin 时，数值 = 目标间隔 + 浮动元素宽度
2. 如果使用浮动元素的 margin 时，直接加上一个 margin-right，就能拉开距离。
3. 计算 bfc 元素的高度时，浮动元素也会参加运算，不需要再去清除浮动。(格式化上下文自动包含该浮动元素)。
4. bfc 就是一个独立的隔离容器，容器里面的子元素不会受到外面元素的影响

## 触发 BFC 的常见条件

- 文档的根元素 `<html>` 本身就是一个 BFC
- `float` 的计算值不是 `none` 的元素
- `position` 为 `absolute` 或 `fixed` 的元素
- `display` 为 `inline-block`、`table-cell`、`table-caption` 的元素
- `display: flow-root` 的元素，专门用于无副作用地建立 BFC
- `overflow` 取 `auto`、`hidden`、`scroll` 等除 `visible` 之外的值的块级元素
- 弹性容器或网格容器的直接子项，在自身不是弹性、网格或表格容器时也会建立 BFC
- `contain: layout`、`content` 或 `paint` 的元素
- 根元素建立的 BFC 覆盖整个文档，普通元素默认都在这个上下文中排版

## BFC 的内部布局规则

- 同一个 BFC 内相邻块级盒子的垂直外边距会发生折叠
- BFC 内部的浮动元素会被包含在 BFC 的高度之内，不会溢出到外部
- BFC 不会与外部浮动元素的外边距重叠，并排布局时各自占据自己的空间
- 触发了 BFC 的元素可以阻止其子元素的外边距与自身外边距折叠
- BFC 是一个独立的隔离区域，内部子元素的布局不会影响区域外部
- 建立新的 BFC 是避免相邻元素外边距折叠的常用手段，把其中一个元素包裹进 BFC 容器即可
- BFC 内部块盒按垂直方向依次排列，行内内容按行盒规则排版
- 跨出 BFC 边界的盒子不参与本上下文内部的外边距折叠

## BFC 与外部浮动的并排行为

- 普通块级盒子水平排列在浮动元素旁边时，盒子本身会被浮动元素覆盖，只有文字内容会环绕浮动元素
- 触发了 BFC 的盒子与浮动元素并排时，不会与浮动元素重叠，两者在一行内各自分配空间
- 拉开间距时，给浮动元素设置外边距即可，BFC 盒子不需要预先知道浮动元素的宽度
- 把普通盒子变成 BFC 往往伴随其他副作用，例如裁剪内容、出现多余滚动条、格式化上下文被改变，大型布局中不建议依赖这一手段

## 用 flow-root 代替 overflow 建立 BFC

- 早期常用 `overflow: auto` 或 `overflow: hidden` 触发 BFC，目的是让父元素高度包含浮动子元素
- 这种写法的副作用是：溢出内容可能出现多余滚动条，元素投影到盒子外部的阴影也可能被裁剪
- `display: flow-root` 建立的 BFC 行为类似根元素，只承担隔离和包含浮动的职责，不引入裁剪或滚动行为

```css
.container {
  display: flow-root;
}
```

- 如果只是为了包住浮动子元素，优先考虑 `flow-root`；沿用 `overflow` 方案时建议在代码里注明用途
- 选择建立 BFC 的方式时，先确认需要的是隔离浮动、排除外部浮动还是阻止边距折叠，再挑副作用最小的方案
- 普通文档流中没有触发 BFC 的块盒，内部浮动子元素不会被计入自身高度
- BFC 内部排版不受外部浮动位置影响，外部浮动也不会钻进 BFC 盒子内部
- 建立 BFC 是两列流体布局中避免文字环绕浮动的常用手段

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_display/Block_formatting_context
- https://developer.mozilla.org/zh-CN/docs/Web/CSS/Containing_Block
- https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing
