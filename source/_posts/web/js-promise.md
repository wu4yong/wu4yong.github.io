---
title: JavaScript-Promise
date: 2018-03-02 20:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## Promise

- Promise 对象是我们现在尚未得到的，但将来会得到的值的占位符。

## 一、Promise 的特点

![Promise三种状态](@@CDN@@/assets/img/web/js-promise/img-01.webp)

1. 对象的状态不受外界的影响，只有异步操作的结果可以决定当前是哪一种状态。任何其他的操作都无法改变这个状态
2. promise 对象只会有两种可能 1、从 pending 到 resolved 2、从 pending 到 rejected。一旦状态改变就不会再变。任何时候都会得到这个结果。

### 1.1 缺点

1. 无法取消 Promise, 一旦新建它就会立即执行，无法中途取消
2. 当处于 pending 状态时，无法得知目前进展到哪一个阶段(刚刚开始还是即将完成)

## 二、resolve 和 reject

### 2.1 Promise.resolve()

```js
Promise.resolve("foo");
// 等价于
new Promise((resolve) => resolve("foo"));
```

### (1) 参数是一个 Promise 实例

- Promise.resolve() 是一个幂等的方法，如果参数也是一个 Promise 实例，那么就会不做任何修改、原封不动地返回这个实例

### (2) 参数是一个 thenable 对象

thenable 对象指的是具有 then 方法的对象，比如下面这个对象。

```js
let thenable = {
  then: function (resolve, reject) {
    resolve(42);
  },
};

// Promise.resolve 方法会将这个对象转为 Promise 对象，然后就立即执行 thenable 对象的 then 方法。
let thenable = {
  then: function (resolve, reject) {
    resolve(42);
  },
};
let p1 = Promise.resolve(thenable);
p1.then(function (value) {
  console.log(value); // 42
});
```

### (3) 参数不是具有 then 的对象，或者不是对象，或者没有参数

- Promise.resolve 方法返回一个新的 Promise 对象，状态为 resolved，并且把参数作为期约的值.

### 2.2 Promise.reject()

```js
Promise.reject("foo");
// 等价于
new Promise((reject) => reject("foo"));
```

1. Promise.reject() 没有实现和 Promise.resolve() 一样的幂等逻辑，Promise.reject() 方法的参数，会`原封不动`地作为 reject 的理由
2. Promise.reject() 返回一个 Promise 对象，并且状态为 rejected，并且把参数作为 reject 的理由。
3. Promise.reject() 抛出的错误是异步的，无法使用同步的 try catch{} 块来捕获异步错误

## 三、期约的实例方法

### 3.1 Promise.prototype.then()

- 其实 then 方法可以提供`两个回调函数`。第一个在上面的执行器 resolve 时执行回调，第二个在上面的执行器 reject 时执行回调

  > 了解 then 有两个回调函数这件事即可，不要用两个回调函数的形式来书写代码，结构会很混乱，把人搞懵

- p.then() 的返回值是一个 `新的 Promise 实例` (p 代指上面的执行器 Promise())，then 的返回值和 p 的执行状态对应的 then 中的回调有关(也就是说如果 p resolve，那么 then 的返回值就和 then 中的第一个回调有关， 如果 p reject，那么 then 的返回值就和 then 中的第二个回调有关)。

1. 如果 then 中第一个回调函数被定义，且有返回值那么就把这个返回值通过 Promise.resolve() 包装，然后 then 的返回值就等于这个被包装过的值
2. 如果 then 中的第一个回调函数被定义，但是没有返回值，那么 then 的返回值就是 undefined 经过 Promise.resolve() 包装
3. 如果 then 的中的第一个回调函数没有被定义，那么 then 的返回值就是上面的 p 的解决之后的值。

```js
new Promise((resolve, reject) => {
  resolve("111");
})
  .then((res) => {
    console.log(res);
    return "aaa"; // 有返回值，所以这个 then 的返回值就是 'aaa' 经过resolve()函数包装
  })
  .then(null, (err) => {
    // then 中第一个回调函数没有定义。所以这个 then 的返回值就是上一个 then 的返回值
    // 用另一种方式来理解，此时这就是一个 catch 方法，上面的 Promise 状态为 resolved，所以这个catch 就没有被调用
    console.log(err);
    throw "bbb";
  })
  .then((res) => {
    console.log(res); // aaa 得到的数据是 'aaa'
  });
```

### 3.2 Promise.prototype.catch()

- 本质上是一个语法糖，`p.catch(() => {}) === p.then(null, () => {})`
- catch 也有返回值，返回值会被 Promise.resolve() 包装
- Promise 的错误会一直向后传递，直到被捕获为止

> Promise 中的错误捕获

```js
// 一、Promise 中 抛出错误，会导致 Promise 的状态变成 reject
let p = new Promise((resolve, reject) => {
  // 一般在 Promise 抛出错误的形式
  reject(new Error("err"));
  // 使用 throw 语句同样也可以使得 Promise 的状态改变为 reject
  throw Error("error");
});

// 二、then 方法回调函数如果在运行中抛出错误，也会被 catch 捕获
Promise.resolve("foo")
  .then((res) => {
    throw new Error("err");
  })
  .catch((err) => console.log(err));
```

### 3.3 Promise.prototype.finally()

1. 无论 p 的状态如何都会执行
2. finally 不接受任何参数。
3. finally 的返回值和状态无关，大多数情况下表现为父期约的传递。
4. 主要是为了解决冗余代码问题

### 3.4 期约连锁

- 可以使用连缀方法的调用的形式
- 实现的原理主要是 then，catch，finally 处理程序的返回值都是一个 Promise。
- 链式调用后面的内容需要等前一个调用执行完才会执行。

### 3.5 Promise.all([p, p])

- Promise.all() 静态方法会在一组期约全部解决之后再解决, 返回 `一个新期约`
- 有一个包含的期约待定，则合成的期约也待定。一个包含的期约拒绝，则合成的期约也拒绝(第一个拒绝的理由会成为合成期约的拒绝理由, 不等待其他 Promise 解决)
- 如果所有期约都成功解决，合成期约的值就是包含期约解决值的数组。并且`合成期约值的顺序和传入实例的顺序一致`。如果有期约抛出错误，则合成期约的返回值是这个被拒绝的期约。

```js
// 新期约的值是一个数组，["foo", "bar"]
let p = Promise.all([Promise.resolve("foo"), Promise.resolve("bar")]);
let a = Promise.all([1, 2]); // 原始值会被Promise.resolve()包装处理
let b = Promise.all([]); // 这条语句等价于Promise.resolve()
let d = Promise.all(); // 无效的语法
```

```js
Promise.all([
  new Promise(() => {
      ...
  }),
  new Promise(() => {
      ...
  })
]).then(results => {
  result[0] //里面是第一次执行的结果
  result[1] //里面是第二次执行的结果
})
```

### 3.6 Promise.race([p, p])

- 返回一个包装期约，是一组集合中最先解决或者拒绝的期约的镜像。

```js
let a = Promise.race([1, 2]); // 原始值会被Promise.resolve()包装处理
let b = Promise.race([]); // 这条语句等价于Promise.resolve()
let d = Promise.race(); // 无效的语法
```

### 3.7 Promise.allSettled([p, p])

- 返回一个包装期约，是一组集合所有 Promise 都完成(不论成功、失败只要完成就行)之后的结果
- allSettled 的状态只会是 resolve，不会是 reject

### 3.8 Promise.any([p, p])

- 返回一个包装期约，如果有一个 Promise resolved，那么这个包装期约就解决，解决值就是第一个 resolved 的期约的值。如果`所有的 Promise 都 reject`，那么这个包装期约就拒绝，拒绝的值为 "AggregateError: All promises were rejected"

### 3.9 Promise.try()

- 目前仍处于提案状态

```js
// 一、使用 try catch 捕获 getJSON 中的同步错误
function getJSON() {
  // 可能抛出同步错误。例如 x is not defined
  x + 1;
  return new Promise((resolve, reject) => {
    // 可能抛出异步错误，根据请求状态决定
    ...
  });
}

// 如果想要同时捕获同步、异步错误，可以这样写
// 但是这样写比较麻烦
try {
  getJSON()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
} catch (error) {
  console.log(error);
}

// 二、使用 Promise.try() 捕获同步错误
function getJSON() {
  // 抛出同步的错误
  x + 1;
  return new Promise((resolve, reject) => {
    resolve("foo");
  });
}

Promise.try(() => getJSON())
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
```
