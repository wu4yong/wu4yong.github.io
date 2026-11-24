---
title: 前端工程化-tree-shaking
date: 2018-02-12 11:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-fe"></div>

# 前端工程化

## tree-shaking

- tree-shaking(树摇)：移除 JavaScript 上下文中的未引用代码 (dead-code)
- 依赖于 ES2015 模块语法的 `静态结构` 特性(import export)
- ES6 的`模块依赖关系是确定`的，和`运行时`的状态无关(所以 ES6 模块不支持`条件导入`和`动态导入`)因此可以进行可靠的静态分析，判断哪些模块最终`没有被引用`，这是 `tree shaking` 的基础

## 一、ESM 规范

```js
// 1. 只能作为模块的顶层语句出现
let bol = true
if(bol) {
  import ...  // 报错
  export ...  // 报错
}

// 2. import 的模块名只能是字符串常量
let str = './moduleA.js';
import A from str;    // 报错
```

## 二、tree-shaking 演示

- 没有使用到的 add() 函数在打包产物中被剔除
- 没有引入的 format.js 模块不会在打包产物中出现

```js
// 使用 rollup 工具进行代码示例
// utils.js
export function add(a, b) {
  return a + b;
}
export function read() {
  obj && obj.name;
}

// format.js
export function format(str) {
  return str.toUpperCase();
}

// input.js
import { read } from "./utils.js";
const object = {
  name: "foo",
};
read(object);

// 生成文件
function read() {
  obj && obj.name;
}
read();
```

## 三、副作用

- 如果一个函数调用会产生副作用，那么就不能将以移除。
- read() 虽然目前看起来没有产生副作用，但是在静态分析阶段识别哪些代码是 dead code 的很有难度(假如 obj 是通过 Proxy 创建的代理对象)，只有在运行阶段才能确定
- 使用 `/*#__PURE__*/` 来声明是无副作用的

```js
// input.js
import { read } from "./utils.js";
const object = {
  name: "foo",
};
/*#__PURE__*/ read(object); // 打包产物中不会包含 read() 函数的定义和使用
```

## 四、import() 动态导入对 tree-shaking 的影响

- 项目中有如下目录结构

```text
- import-js
  - dy-js1.js
  - dy-js2.js
  - dy-js3.js
  - dyn.js
- man.js
```

```js
let condition = 1
// 一、情况一
// dy-js1、dy-js2 会被打包到 dist 中
// dy-js3、dyn.js 不会被打包到 dist 中
if(condition === 1) {
  import("../import-js/dy-js1.js")
} else if(condition === 2) {
  import("../import-js/dy-js2.js")
} 

// 二、情况二
// dy-js1、dy-js2、dy-js3 会被打包到 dist 中
// dyn.js 不会被打包到 dist 中
import(`../import-js/dy-js${condition}.js`)

// 三、情况三
// dy-js1、dy-js2、dy-js3、dyn.js 都会被打包到 dist 中
import(`../import-js/${condition}.js`)
```
