---
title: JavaScript-定型数组
date: 2018-03-04 04:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## 定型数组

- 目的是提升向原生库传输数据的效率。实际上，JavaScript 并没有“TypedArray”类型，它所指的其实是一种特殊的包含数值类型的数组
- 使用 JS 编写 WEBGL 项目时，图形驱动 API 不需要 JS 默认双精度浮点格式的数据，这会浪费很多时间。Mozilla 为解决这个问题而实现了 CanvasFloatArray。这是一个提供 JavaScript 接口的、C 语言风格的浮点值数组。JavaScript 运行时使用这个类型可以分配、读取和写入数组。这个数组可以直接传给底层图形驱动程序 API，也可以直接从底层获取到。最终，CanvasFloatArray 变成了 Float32Array，也就是今天定型数组中可用的第一个“类型”。
- 最终，CanvasFloatArray 变成了 Float32Array，也就是今天定型数组中可用的第一个“类型”。

```js
// 一经创建就不允许再调整大小
const buf = new ArrayBuffer(16); // 在内存中分配 16 字节
buf.byteLength  // 16
```

## 缓冲与视图

- ArrayBuffer 表示一块原始内存，分配时初始化为 0；它本身不能直接读写，需要通过视图访问
- 视图分两类：类型化数组视图（Int8Array、Uint8Array、Uint8ClampedArray、Int16Array、Uint16Array、Int32Array、Uint32Array、Float32Array、Float64Array、BigInt64Array、BigUint64Array）和 DataView
- 同一缓冲上可以创建多个不同类型的视图，它们共享底层字节，按各自格式解释数据
- 视图暴露 buffer（底层缓冲）、byteOffset（相对缓冲起始的字节偏移）、byteLength（视图字节长度）三个属性
- 类型化数组按元素个数构造，DataView 按字节偏移和字节长度构造

## 类型化数组的约束与方法

- 类型化数组原则上长度固定，没有 push、pop、shift、unshift、splice 等改变长度的方法
- 类型化数组不是普通数组，Array.isArray() 返回 false；但共享普通数组的大部分读写方法
- set() 用另一个数组或类型化数组批量写入多个位置；subarray() 在同一缓冲上创建范围更窄的新视图
- 越界索引读取返回 undefined，写入不生效，不会在缓冲上新增属性

## DataView 与字节序

- DataView 提供按偏移读写各类型数值的 getter/setter，不需要对齐
- 类型化数组按运行环境本地字节序解释数据；DataView 的读写方法可以指定大小端，默认大端字节序
- 用 Array.from 或展开运算符可以把类型化数组转成普通数组，便于使用普通数组的全部方法

```js
const buf = new ArrayBuffer(16);
const int32 = new Int32Array(buf);
int32[0] = 1;
const int16 = new Int16Array(buf);
```

## 类型化数组的元素类型

- Int8Array、Uint8Array 各占 1 字节，Int16Array、Uint16Array 占 2 字节，Int32Array、Uint32Array、Float32Array 占 4 字节
- Float64Array 占 8 字节；BigInt64Array、BigUint64Array 占 8 字节，元素对应 bigint 类型
- Uint8ClampedArray 把超出 0 到 255 的值钳制到范围内，常用于 Canvas 像素数据
- 每种类型化数组都有 BYTES_PER_ELEMENT 属性，表示单个元素的字节数

## 缓冲的基本操作

- ArrayBuffer 分配的内存初始化为 0，byteLength 为只读的字节长度
- slice() 复制缓冲的一段到新缓冲；transfer()、transferToFixedLength() 把内存所有权转移给新缓冲，原缓冲不再可用
- 可调整大小的缓冲通过 maxByteLength 预设上限，resize() 在上限内改变大小
- ArrayBuffer.isView(value) 判断值是否为类型化数组或 DataView 这类视图

## 视图共享与转换

- 同一缓冲上的多个视图共享字节，修改一个视图会影响其他视图按字节解释出的值
- 用 set() 批量写入时，目标视图与源数据类型化数组共享缓冲的情况下是快速内存移动
- subarray() 不复制数据，只是在同一缓冲上切出窄范围视图；slice() 才会复制元素
- Array.from() 或展开运算符把类型化数组转成普通数组后，才能使用普通数组独有的方法
- 类型化数组索引越界读取返回 undefined，越界写入静默失败，不改变缓冲内容
- 类型化数组不能嵌套，flat、concat、flatMap 等方法不可用

## DataView 的读写

- DataView 按字节偏移定位，多字节读写不需要对齐到元素宽度
- 各类型 getter/setter 接收可选的小端参数；不传时按大端字节序解释
- 类型化数组按本地字节序工作，跨平台交换二进制数据时用 DataView 显式指定字节序更稳妥

```js
const buf = new ArrayBuffer(8);
const view = new DataView(buf);
view.setInt32(0, 256, true);
view.getInt32(0, true); // 256
```

## 与普通数组的区别

- 类型化数组的元素都是同一二进制格式的数值，不存在混合类型元素
- 类型化数组长度在创建后固定，底层缓冲大小决定了可容纳的元素个数
- 普通数组可以存稀疏空位，类型化数组越界位置读出来是 undefined，不保留空槽概念
- 类型化数组共享普通数组的大部分遍历和读写方法，但没有改变长度和嵌套相关的方法
- 转普通数组后才能使用 indexOf、slice、concat 等数组独有方法
- 二进制数据在 WebGL、Canvas、WebSocket、FileReader、TextEncoder/Decoder 等接口中以 ArrayBuffer 或类型化数组形式传递

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Typed_arrays
