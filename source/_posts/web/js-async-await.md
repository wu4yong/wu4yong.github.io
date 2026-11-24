---
title: JavaScript-async、await
date: 2018-03-03 10:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## async await

- async 和 Generator 星号（\*）的用法相近
- await 和 Generator 中 yeild 的用法相近

## 一、async 和 Generator 的改进

1. 内置执行器：调用 async 函数时会自动执行，不需要 next 方法
2. 更好的语义：async 表示包含异步操作、await 表示需要等待
3. 更广的适用性： await 命令可以是 Promise 对象也可以是原始类型(会被 Promise.resolve() 包装)的值
4. 返回值是 Promise: 可以进行链式调用

## 二、 async 中的错误处理

- async 函数中无论是 `await 表示式后面的状态为 reject` 还是`出现了 JS 语法错误`，都会使 async 函数返回 Promise 的状态变成 reject，从而进入 catch 方法回调中。并且 async 函数会终止，`不会向下执行`

### 2.1 如何防止单个 await reject 导致整个 async 函数 reject

- 能用 try catch 捕获 async 函数中 await 表达式后抛出的异步错误。并且不会导致整个 async 函数变成 reject

```js
(async function getAllData() {
  try {
    const res = await getData("https://jsonplaceholder.typicode.com/todo/1");
    console.log(res);
  } catch (error) {
    console.log("单个 await reject");
  }
})()
  .then((res) => {
    console.log("async resolved");
  })
  .catch((err) => {
    console.log("async reject");
  });

// 单个 await reject
// async resolved
```

- 给 await 表达式后面的 Promise 添加 catch 方法，可以避免单个 await 错误导致整个 async 函数的终止

```js
(async function getAllData() {
  const res = await getData(
    "https://jsonplaceholder.typicode.com/todo/1"
  ).catch((err) => {
    console.log("单个 await reject");
  });
  console.log(res);
})()
  .then((res) => {
    console.log("async resolved");
  })
  .catch((err) => {
    console.log("async reject");
  });
// 单个 await reject
// undefined  因为 await 后面的 Promise 被 reject，且 catch 回调函数中没有返回值，所以 res 是 undefined
// async resolved
```

## 三、await 命令

- await 只能在 async 的函数中使用, await 才是造成`阻塞`的实质。
- JS 运行时在碰到 await 关键字时，会记录在哪里暂停执行，等到 await 右边的值可以用了，js 运行时会向消息队列中推送一个任务，这个任务会恢复异步函数的执行

## 四、并发操作

- 如果 async 函数中的请求不需要串行进行，可以使用以下两种方式进行优化

```js
// 一、网络请求时并不进行 await, 而是在使用请求值之前进行 await
(async function getAllData() {
  const res1Promise = getData("https://jsonplaceholder.typicode.com/todos/1");
  const res2Promise = getData("https://jsonplaceholder.typicode.com/todos/1");
  let res1 = await res1Promise;
  let res2 = await res2Promise;
})()
  .then((res) => {
    console.log("async resolved");
  })
  .catch((err) => {
    console.log("async reject");
  });

// 二、使用 Promise.all() 进行并发请求(推荐使用)
(async function getAllData() {
  const [res1, res2] = await Promise.all([
    getData("https://jsonplaceholder.typicode.com/todos/1"),
    getData("https://jsonplaceholder.typicode.com/todos/1"),
  ]);
  console.log(res1);
  console.log(res2);
})()
  .then((res) => {
    console.log("async resolved");
  })
  .catch((err) => {
    console.log("async reject");
  });
```
