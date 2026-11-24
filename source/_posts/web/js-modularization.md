---
title: JavaScript-模块化
date: 2018-03-05 11:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## 模块化

## 一、ES6的模块化

### 1.1 模块的导出

```js
// 不允许 export 定义在某个块中
if(true) {
    export ...
}

// 导出单个变量
export const foo = "aaa"

// 导出多个变量
let name = "xujie"
let age = 11

// !{} 代表的是一个导出列表，并不是对象
export {
  name as id, // 使用别名的导出方式必须在 {} 中
  age
}

// 默认导出
// 但是每个模块只能默认导出一个东西
// 并且导入的时候不能使用 {}
export default name;
export { name as default } //和上面的语句是等价的

// 默认导出和一般的导出是相互独立的，可以同时定义默认导出和一般的导出
export { name, phone }
export default a;

export { name, phone, a as default } //等价于上面的两条语句
// 默认导出和一般的导出同时定义时的接收
import a, { name, phone } from './tool.js'
import { default as a, name, phone } from './tool.js'
```

### 1.2 模块的导入

* 加载一个模块的时候，即使没有公共的接口，也会执行模块体中的代码。

```js
// import语句不能声明在块级中
// 如果想要在块中导入模块的话可以使用 import() 函数进行导入，使用 Promise 来进行后续处理
if(true) {
    import ...
}
// import 语句会被提升到模块的顶部
// 可以但是要避免在 import 之前使用导入的变量
// 模块的路径只能是静态的，不能是动态计算的结果，不能使用变量。

// 默认的导入
// 这两种方式等价
import name from './tool.js'
import { name as default  } from './tool.js'

// 使用 import 导入的变量就像是 const 声明的一样
// 基本数据类型的值不能被修改
// 引用类型的值(例如对象)能够添加，删除，修改属性。但是不能够赋值为一个新对象
import { name, person } from './tool.js'
```

## 二、CommonJS 与 ESModule 互相引用

* 可以使用 import 语法来导入以 CommonJS 规范书写的代码，但是导入时不能使用解构语法
* 不能使用 require() 来导入以 ESModule 规范书写的代码
* 尽量不要在业务代码中混用

## 三、指定文件的模块机制

* 使用 .mjs 后缀指定当前文件是 ESModule 规范代码
* 使用 .cjs 后缀指定当前文件是 CommonJS 规范代码

## ES Module 的静态特性

- `import`、`export` 语句只能出现在模块顶层，模块结构在编译期确定，导入路径不能是运行时计算的变量
- 模块内的导入是导出值的只读视图，类似 `const` 绑定：基本类型不能重新赋值，对象属性仍可修改
- 同一个模块 URL 在页面中只加载并执行一次，导出的绑定在各导入方之间共享
- 模块脚本自动处于严格模式，顶层变量不会挂到全局对象；`<script type="module">` 引入的脚本默认延迟执行，无需额外写 `defer`

## 动态导入与模块元信息

- `import()` 以函数形式调用，返回 `Promise`，按需加载模块，适合条件分支或首屏减负
- `import.meta` 是模块级元对象，宿主环境通常在其上暴露模块 URL 等信息；模块之外使用属于语法错误

## 与 CommonJS 的差异

- CommonJS 用 `require` 在运行时同步加载，导出挂在 `module.exports` 上；ES Module 在编译期解析静态依赖
- 浏览器原生 ESM 中不能用 `require()`；Node 中两种规范互操作的具体规则随版本变化，业务代码不建议混用
- `.mjs` 后缀用于在以 CommonJS 为默认的环境中标识 ES Module，`.cjs` 反之

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/import.meta
