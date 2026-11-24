---
title: 技术文档总结-JS异步代码编写
date: 2018-01-23 08:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-tech"></div>

# 技术文档总结

## JavaScript 异步编程全景图：从回调地狱到优雅解决方案

## 一、同步任务和异步任务

### 1.1 同步任务

1. 某段程序执行会阻塞其他程序的执行，一定要等上一个任务执行完毕，拿到结果之后，才能执行下一个任务。
2. 其表现形式为`程序的执行顺序依赖程序本身的书写顺序`。

### 1.2 异步任务

1. 某段程序执行不会阻塞其他程序的执行，不必等待上一个任务执行完毕、拿到结果，就能执行下一个任务
2. 其表现形式为`程序的执行顺序不依赖本身的书写顺序`。

## 二、封装一个 XMLHttpRequest 请求函数

```js
// 一个简易的AJAX请求函数
function getData(url) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === this.DONE) {
      if (this.status === 200) {
        // 数据响应成功
        console.log({
          code: this.status,
          Data: JSON.parse(this.responseText),
        });
      } else {
        // 数据响应失败
        console.log({
          code: this.status,
          Data: JSON.parse(this.responseText),
        });
      }
    }
  };
  xhr.open("get", url);
  xhr.send();
}

getData("https://jsonplaceholder.typicode.com/todos/1");
```

## 三、基于回调函数的异步代码编写

- 将上面的 `getData` 函数与回调函数进行结合

```js
// 网络请求成功、失败之后，使用回调函数的形式来进行后续逻辑处理
function getData(url, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === this.DONE) {
      if (this.status === 200) {
        success({
          code: this.status,
          Data: JSON.parse(this.responseText),
        });
      } else {
        error({
          code: this.status,
          Data: JSON.parse(this.responseText),
        });
      }
    }
  };
  xhr.open("get", url);
  xhr.send();
}
```

- 单个请求示例

```JS
getData(
  "https://jsonplaceholder.typicode.com/todos/1",
  function (res) {
    console.log("网络请求成功", res.Data);
  },
  function (res) {
    console.log("网络请求错误", res.code);
  }
);

console.log("1");
```

- 如果下一个请求需要用到上一个请求返回的值，基于回调函数的这种请求方式就需要`嵌套书写`代码

```js
getData(
  "https://xxxxx/当前省/info",
  function (res) {
    getData(
      "https://xxxxx/当前市/info/?当前省=res.Data",
      function (res) {
        getData(
          "https://xxxxx/当前区/info?当前市=res.Data",
          function (res) {
            console.log("当前所属区域行政单位", res.Data);
          },
          function (res) {
            console.log("网络请求错误" + res.code);
          }
        );
      },
      function (res) {
        console.log("网络请求错误" + res.code);
      }
    );
  },
  function (res) {
    console.log("网络请求错误" + res.code);
  }
);
```

### 3.1 回调函数的优缺点

### (1) 优点

1. 简单性: 对于简单的异步任务，使用回调函数可以快速实现、代码直观易懂
2. 兼容性: 兼容性很好，兼容所有浏览器

### (2) 缺点

1. 回调地狱：当多个异步操作互相依赖时，回调函数会嵌套多层，导致代码难以阅读和维护，这种现象被称为`回调地狱`
2. 非线性：程序的执行没按照程序的书写方式执行，可读性差

## 四、事件

- 使用事件模型的方式来完成异步任务的处理(属于发布订阅模式)。例如，JS DOM 事件、Vue 的事件总线。

### 4.1 JS DOM 事件

```js
document.body.addEventListener("click", () => {
  alert(2);
});

document.body.addEventListener("click", () => {
  alert(3);
});

document.body.click(); // 模拟用户点击
```

### 4.2 Vue 的事件总线

```js
const Bus = new Vue();
Bus.$emit("itemImageLoad", index);
Bus.on("itemImageLoad", (index) => {
  console.log(index);
});
```

### 4.3 事件的优缺点

1. 简单易用，适合小项目中的通信
2. 发布者和订阅者是解耦的，但是在大型项目中会导致订阅者、发布者之间的关系难以维护。定位问题时难以调试
3. 事件订阅时机晚于事件触发的时机，那这个事件就会丢失。不再能检测到

## 五、Promise

### 5.1 基于 Promise 的异步代码编写

- 将 `getData` 函数与 Promise 进行结合

```js
function getData(url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState === this.DONE) {
        if (this.status === 200) {
          resolve({
            code: this.status,
            Data: JSON.parse(this.responseText),
          });
        } else {
          reject({
            code: this.status,
            Data: JSON.parse(this.responseText),
          });
        }
      }
    };
    xhr.open("get", url);
    xhr.send();
  });
}
```

- 单个请求示例

```js
getData("https://jsonplaceholder.typicode.com/todos/1")
  .then((res) => {
    console.log("网络请求成功", res);
  })
  .catch(() => {
    console.log("网络请求失败", res);
  })
  .finally(() => {
    console.log("网络请求无论成功失败，都会执行");
  });
```

- 如果下一个请求需要用到上一个请求返回的值，基于 Promise 的这种请求方式就需要`链式书写`代码

```js
getData("https://xxxxx/当前省/info")
  .then((res) => {
    return getData("https://xxxxx/当前市/info/?当前省=res.Data");
  })
  .then((res) => {
    return getData("https://xxxxx/当前区/info?当前市=res.Data");
  })
  .then((res) => {
    console.log("当前所属区域行政单位", res.Data);
  })
  .catch((err) => {
    console.log("网络请求错误", err.code);
  });
```

## 六、async 和 await

- 宣称异步编程的`最终解决方案`，async await 是基于 Generator 语法的语法糖

### 6.1 Generator 语法

1. Generator 函数的返回值是一个遍历器对象，可以依次遍历该函数内部的每一个表达式。
2. Generator 函数是`分段执行`的， `yield` 表达式是暂停执行的标记，而 `next` 方法可以恢复执行

```js
function* helloWord() {
  yield "hello";
  yield "word";
  return "ending";
}
const hw = helloWord(); // 遍历器对象
hw.next(); // {value: "hello", done: false}
hw.next(); // {value: "word", done: false}
hw.next(); // {value: "ending", done: true}
hw.next(); // {value: "ending", done: true}
```

### 6.1 代码示例

- 如果下一个请求需要用到上一个请求返回的值，基于 async 的这种请求方式可以实现以`同步代码的形式`实现异步任务

```js
(async function getAllData() {
  const res1 = await getData("https://xxxxx/当前省/info");
  const res2 = await getData("https://xxxxx/当前市/info/?当前省=res1.Data");
  const res3 = await getData("https://xxxxx/当前区/info?当前市=res3.Data");
  return res3;
})()
  .then((res) => {
    console.log("当前所属区域行政单位", res3.Data);
  })
  .catch((err) => {
    console.log("网络请求错误");
  });
```

## 七、异常处理

1. 网络请求的异常处理
2. 得到数据后，进行数据操作时的异常处理

### 7.1 Promise 异常处理

- try cath 块无法捕获异步的错误

```js
// 一、无法使用 try catch 来捕获 Promise 的 reject 事件
try {
  getData("https://xxxxx/当前省/info").then((res) => {
    console.log("网络请求成功", res);
  });
} catch (error) {
  console.log("网络请求失败", error);
}

// 二、无法使用 try catch 来捕获 then 回调函数中的错误
try {
  getData("https://xxxxx/当前省/info")
    .then((res) => {
      // 模拟数据处理问题, 在 undefined 上访问 b 属性，会报错
      res.Data.a.b;
    })
    .catch((err) => {
      console.log("网络请求失败", err);
    });
} catch (error) {
  console.log("数据处理失败", error);
}
```

- try catch 只能捕获同步代码中的错误
- 但是 Promise 的 then 回调函数中，如果代码中存在错误，那么错误信息会通过 catch 回调函数进行捕获

```js
// 一、使用 try catch 来捕获 then 数据处理问题
getData("https://xxxxx/当前省/info")
  .then((res) => {
    // 用 try catch 来捕获数据处理问题
    try {
      // 模拟数据处理问题, 在 undefined 上访问 b 属性，会报错
      console.log(res.Data.a.b);
    } catch (error) {
      console.log("数据处理失败");
    }
  })
  .catch((err) => {
    console.log("网络请求失败");
  });

// 二、利用 catch 来捕获 Promise 的 then 回调函数中的错误
getData("https://xxxxx/当前省/info")
  .then((res) => {
    // 模拟数据处理问题, 在 undefined 上访问 b 属性，会报错
    res.Data.a.b;
  })
  .catch((err) => {
    err.code ? console.log("网络请求失败") : console.log("数据处理失败");
  });
```

### 7.2 async 和 await 异常处理

- 有两种情况会导致 async 函数返回值 Promise 的状态为 reject

1. await 后 Promise 的状态为 reject
2. 同步代码中出现了错误

```js
(async function getAllData() {
  // 一、await 后面 Promise 的状态可能为 reject
  const res = await getData("https://xxxxx/当前省/info");
  // 二、模拟数据处理问题, 在 undefined 上访问 b 属性，会报错
  res.a.b;
})()
  .then((res) => {
    console.log("async resolved");
  })
  .catch((err) => {
    console.log("async reject");
  });
```

- 有两种方式可以避免 async 函数返回值 Promise 的状态为 reject

1. 使用 try catch 来捕获 async 函数中 await 后表达式的异步错误以及同步代码中的错误
2. 使用 catch 方法来处理 await 后 Promise 的 reject

```js
// 一、使用 try catch 来捕获 await 后 Promise 的 reject
(async function getAllData() {
  try {
    // await 后面 Promise 的状态可能为 reject
    const res = await getData("https://xxxxx/当前省/info");
    // 模拟数据处理问题, 在 undefined 上访问 b 属性，会报错
    res.a.b;
  } catch (error) {
    console.log("网络请求或者数据处理失败");
  }
})()
  .then((res) => {
    console.log("async resolved");
  })
  .catch((err) => {
    console.log("async reject");
  });

// 二、使用 catch 方法来处理 await 后 Promise 的 reject
(async function getAllData() {
  // await 后面 Promise 的状态可能为 reject
  const res = await getData("https://xxxxx/当前省/info").catch((err) =>
    console.log("网络请求失败")
  );
})()
  .then((res) => {
    console.log("async resolved");
  })
  .catch((err) => {
    console.log("async reject");
  });
```
