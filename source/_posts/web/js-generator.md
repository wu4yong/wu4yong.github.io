---
title: JavaScript-Generator
date: 2018-03-02 07:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## Generator

- Generator 函数是 ES6 提供的一种异步编程解决方案。

## 一、基本用法

1. Generator 函数的返回值是一个遍历器对象，可以依次遍历该函数内部的每一个表达式。
2. Generator 函数是`分段执行`的， `yield` 表达式是暂停执行的标记，而 `next` 方法可以恢复执行

```js
function* helloWord() {
  yield 'hello'
  yield 'word'
  return 'ending'
}
const hw = helloWord()  // 遍历器对象
hw.next() // {value: "hello", done: false}
hw.next() // {value: "word", done: false}
hw.next() // {value: "ending", done: true} 
hw.next() // {value: "ending", done: true}
```

## next 方法传参与返回结构

- 每次 `next()` 返回 `{ value, done }`：`value` 是 `yield` 表达式的值，`done` 为 `true` 表示生成器已经结束
- 第一次 `next()` 从函数开头执行到第一个 `yield`；后续 `next(value)` 传入的值会替换当前暂停的 `yield` 表达式
- `yield` 表达式本身取到什么值，由下一次 `next()` 传入的参数决定
- 生成器结束后再调用 `next()`，只会返回 `{ value: undefined, done: true }`，不会再执行函数体
- 生成器暂停期间局部状态会被保留，重新进入时恢复，这是它与普通函数调用结束即销毁上下文的区别
- 生成器函数内部的局部变量在暂停期间随执行上下文一起保留
- `yield` 是暂停标记，把函数体切成可恢复的多段执行
- 调用生成器函数时先创建挂起的执行上下文，内部代码并不执行；`next()` 把该上下文推入栈，执行到 `yield` 后挂起并移出栈，控制权返回入口点
- 再次调用 `next()` 时，生成器的执行上下文被推回栈，内部代码从上次中断的地方继续执行
- 生成器保存的是完整执行上下文（变量绑定、作用域、`this` 等），不只是单个变量
- 生成器上下文挂起时不占用调用栈帧，控制权交还给入口点
- 生成器函数调用后得到的对象本身不执行内部代码，直到第一次 `next()` 被调用

## 迭代器协议与可迭代协议

- 迭代协议不是内置对象或新语法，而是一组可被任意对象遵循的约定
- 迭代器协议要求对象实现 `next()` 方法，返回 `IteratorResult`，包含可选的 `done` 布尔值和 `value`
- 可迭代协议要求对象实现 `[Symbol.iterator]()` 零参方法，返回一个符合迭代器协议的对象
- 可迭代对象被需要迭代时，内置语法先调用其 `[Symbol.iterator]()` 取得迭代器
- 迭代器协议的 `next()` 可以接收一个值，该值在生成器中成为对应 `yield` 表达式的结果
- 生成器对象既是迭代器又是可迭代对象，它的 `[Symbol.iterator]()` 返回自身，属于可迭代迭代器
- 内置可迭代对象包括 `String`、`Array`、`TypedArray`、`Map`、`Set`、`arguments` 对象和部分 DOM 集合（如 `NodeList`）；普通 `Object` 不是可迭代对象
- `for...of`、`Array.from()`、展开语法、解构赋值等内置语法按可迭代协议消费对象
- 迭代中断（如 `for...of` 中遇到 `break`）时，内置语法会在存在的情况下调用迭代器的 `return()` 方法做清理
- `next()` 若返回非对象值，内置语法使用时会抛出 `TypeError`
- 内置迭代器都继承自 `Iterator.prototype`，其 `[Symbol.iterator]()` 方法返回自身
- 多数内置语法和 API 期待的是可迭代对象，而不是直接期待迭代器对象
- `Promise.all()`、`Set()`、`Map()`、`Array.from()` 等内置 API 都接受可迭代对象
- 迭代器一旦结束不能重置；需要从头迭代时要重新取得迭代器
- 迭代协议是否实现无法通过反射直接判断，必须实际调用 `next()` 验证结果

## yield 委托与生成器的其他方法

- `yield*` 把迭代委托给另一个生成器或可迭代对象，逐个产出对方的每个值
- 委托迭代时，外层生成器把取值和暂停控制交给被委托的迭代器
- `throw()` 把错误抛回生成器内部，在暂停处恢复执行；`return()` 直接结束生成器并返回指定值
- 函数内部的 `return` 语句会结束生成器，返回的值进入对应结果对象的 `value`
- 可选的 `return(value)`、`throw(exception)` 用于通知调用方不再继续迭代，并执行必要的清理动作；普通迭代器可以只实现 `next()`，后两者属于可选实现
- 迭代器结束后再次调用 `next()` 不会重新执行函数体

## 生成器的写法与限制

- 每次调用生成器函数都会返回一个新的 `Generator` 对象
- 生成器函数与普通函数一样可以接收参数，参数在第一次 `next()` 被调用前进入执行上下文
- 生成器函数不能用 `new` 构造，否则抛出 `TypeError`；箭头函数也不能写成生成器函数
- 对象方法、类方法、计算属性，以及 `[Symbol.iterator]` 都可以写成生成器形式
- 自定义可迭代对象可以在 `[Symbol.iterator]` 中使用生成器函数，内部用 `yield` 逐项产出
- 生成器对象同时符合迭代器协议和可迭代协议，两种接口都可被内置语法识别
- `function*` 声明与普通函数声明一样会被提升到作用域顶部
- 无限循环产出值的生成器需要配合 `break` 或外部条件控制迭代次数

## 与异步流程的关系

- 生成器可以分段暂停与恢复，曾被用于组织异步流程，缓解回调嵌套问题
- 生成器与 Promise 结合可以把异步流程写成接近同步的顺序
- 现代代码中异步流程通常直接使用 `async/await`，它在语言层面封装了类似的暂停恢复语义
- 异步生成器函数返回异步生成器对象，迭代方法的返回值被 Promise 包装，可被 `for await...of` 消费
- 异步生成器对象同时实现异步可迭代和异步迭代器协议

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
