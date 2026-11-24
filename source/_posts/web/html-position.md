---
title: HTML+CSS-定位
date: 2018-02-18 19:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-html"></div>

# HTML+CSS

## 定位

* 定位允许你从正常的文档流中取出元素，并使他们具有不同的行为

## 四种定位值

### static

* 不指定 position 的值

### relative:相对定位

* 占据正常的文档流中
* 主要用于创造定位上下文

### absolute：绝对定位

* 不在正常的文档流布局中，坐在自己的一层
* 元素设置为 absolute 之后，默认会把元素内部转换为 inline-block

### fixed：固定定位

* 固定定位相当于浏览器视口本身

### sticky： 粘性定位

* 父级元素有 overflow：scroll,auto,overlay，hidden时，粘性定位会失效。
* 粘性定位只在父元素内生效
* 父元素的高度不能低于 sticky 元素的高度
* 必须指定 top，bottom，left，right 其中之一。否则会处于相对定位(目前自己只知道 top 的效果，left 的效果不知道是什么)

浮动的定位还是基于正常的文档流，只有改变了文档流的显示。(半脱离，元素会无视它，但是文本能看到)

## 包含块

* 元素的大小和位置通常受包含块的影响，通常包含块是最接近的块级元素的 ！！！内容！！！ 位置

1. 元素的属性为position：fixed

* 则元素的包含块为浏览器窗口。

1. 元素的属性是position：absolute

* 则元素的包含块为最接近的父级元素具有 position 但不能是 static。
* 元素的 width 用百分比时需要考虑包含块的 padding。
* 如果都没有显示的定义 position，那么元素的包含块是浏览器视口(不是body是(html标签的父级))
* 根目录所在的包含块是一个称之为！！！初始包含块！！！的矩形

## 偏移量的设置

* 设置了 position: absolute; 之后，元素会被在内部转化为 inline-block 类型
* 元素被设置了 position:absolute; 之后，会以 border 来进行定位而不是 content。
* 这个和其他的位置定位不一样，设置的每一个关键字，代表的是元素的那一边的位置，如果设置了对角的关键字(left right)的话，那么就会固定住了子元素在父元素的相对位置。
* 设置 left:0;right:0;top:0;bottom:0; 之后，如果自身没有定义宽或者高，就会继承父元素(指的是包含块而不是DOM)的宽高。且内容不能偏移出父级元素的区域,否则会消失。

## z-index的介绍

* 层叠上下文是 HTML 中的一个三维的概念，实际上网页除了x轴，y轴，它还有z轴。z轴往往都是用来设定层的先后顺序的。一个元素在z轴方向上的堆叠顺序，是由层叠上下文和层叠级别这两个因素决定的。

* 同为神奇盒子的父元素如果没有显示的声明 z-index (或者显式的声明为auto)，子元素的 z-index 值小于零的话，子元素就回到父元素的底下。
* 只要是父元素显式的声明了 z-index 的话，无论子元素的 z-index 的值多小，子元素也不会到父元素的底下。
**那些定位的元素想要创建层叠上下文的话，必须要显式的定义 z-index**
* 需要 z-index 触发创建层叠上下文 position 值为 relative/absolute/fixed  flex 项(父元素 display 为 flex|inline-flex)，注意是子元素，不是父元素创建层叠上下文
* 不需要 z-index 触发创建层叠上下文 元素的透明度 opacity 小于1 transform 不是 none

* z-Index 只能应用于(神奇盒子) 默认值为auto(auto和0有区别，有些情况下设置auto不会创建层叠上下文)
* 神奇盒子最常见的定位不为 static，元素的 opacity 不为 1, z-Index 不为 auto 的 flex 项(不是声明了flex的元素，是元素的子元素)，元素的 transform 不为 none。
* 对于普通的盒子，(无特殊定义的，inline-block，float)，z-Index 无法影响他们的层叠顺序写在 html 文档后面的块会挡在前面的盒子上面。
float 的盒子会挡在没有 float 的盒子上面，文字等 inline，inline-block 会在 block 的元素上面
* z-Index 是在自己的父级内的层叠顺序，和伯伯元素的层叠顺序建立在父级和伯伯元素的层叠顺序上。
* 有些特定的元素也会在内部创建自己的堆叠上下文，内部的排序不会受到其他堆叠盒子的影响。
* 具有层叠的顺序的盒子和普通盒子的视轴顺序
HTML > z-Index为负值的盒子 > 块状盒子 > float盒子 > inline,inline-block > z-Index为auto或者0的盒子 > z-Index为正值的盒子

## 各定位值的包含块

- `static` 是默认值，此时 `top`、`right`、`bottom`、`left` 和 `z-index` 都无效，元素按正常布局流排列
- `relative` 元素仍留在正常文档流中，偏移不会给其他元素腾出或挤压空间，页面为它保留的位置与 `static` 时相同
- `absolute` 元素脱离文档流，页面布局不为它预留空间，位置相对最近的非 `static` 祖先；找不到这样的祖先时相对初始包含块
- `fixed` 元素的包含块通常是视口；若祖先的 `transform`、`perspective`、`filter`、`will-change`、`contain` 或 `backdrop-filter` 建立了包含块，则以该祖先为准
- `sticky` 元素先按正常流定位，再相对最近的滚动祖先和包含块偏移；至少要设置一个非 `auto` 的 inset 属性，否则表现为 `relative`
- 绝对定位元素未指定宽高时，`top` 与 `bottom` 同时指定可以撑满垂直空间，`left` 与 `right` 同时指定可以撑满水平空间

## 层叠上下文与 z-index

- `z-index` 只作用于定位元素，以及弹性容器或网格容器的子项；普通块盒、浮动盒子不受它影响
- `z-index` 默认值为 `auto`，元素在父层叠上下文内按文档顺序排列
- `fixed` 和 `sticky` 定位总会创建新的层叠上下文；`relative`、`absolute` 只有在 `z-index` 不是 `auto` 时才创建
- 元素的透明度小于 1、`transform` 不为 `none`、使用非 `none` 的 `filter` 等情况也会创建层叠上下文
- 层叠上下文内部的排序不参与父级与兄弟上下文之间的比较，子元素的层级被限制在父上下文之内
- `z-index` 是在自身父级层叠上下文内的顺序，跨父级比较时先比较父级所在上下文的层级

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/CSS/position
- https://developer.mozilla.org/zh-CN/docs/Web/CSS/Containing_Block
