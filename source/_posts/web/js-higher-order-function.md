---
title: JavaScript-高阶函数
date: 2018-02-26 00:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## 高阶函数

高阶函数是指至少满足下列条件之一的函数。

1. 函数可以作为参数被传递；
2. 函数可以作为返回值输出

## 一、函数当做参数进行传递

- 回调函数：分离业务代码中不变和变化的部分，将业务代码中变化的部分封装到函数参数里

## 二、函数作为返回值输出

```js
// 自动生成一个 isType 对象。其中的三个方法可以用来判断数据类型
const isType = {};
const typeArray = ["String", "Array", "Number"];
for (
  let index = 0;
  (type = typeArray[index]), index < typeArray.length;
  index++
) {
  isType["is" + type] = function (obj) {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
  };
}
```

## 三、高阶函数应用

### 3.1 函数柯里化

- 柯里化又称为部分求值，是把接受`多个参数`的函数变成接受`单一参数`的函数

```js
// 将传入的函数包装成 柯里化 的函数
// 本例的效果为实现 **延迟调用**
// currying 函数是不变的部分(通用函数)  callback 函数是变化的部分
function currying(callback) {
  // 利用闭包的特性，将多次调用的参数全部存储到 args 数组中
  const args = [];
  return function () {
    // 1. 当无传入参数时， 输出结果
    if (arguments.length === 0) {
      return callback(args);
    } else {
      // 2. 当有参数传入时，将参数存储到闭包中，并再次返回当前函数等待下一次的调用
      args.push(...arguments);
      return arguments.callee;
    }
  };
}
// 具体的行为，将数组中的值求和
function cost(args) {
  return args.reduce((total, item) => total + item);
}

// 将 cost 函数包装成 柯里化 的函数
const Xcost = currying(cost);
// 经过柯里化的函数，单次调用不会运算出结果，只有当传入参数为空时才会将之前所有的调用整合到一起进行计算
Xcost(100);
Xcost(200);
Xcost(); // 300
```

### 3.2 防抖节流

### 防抖（Debounce）

**概念**：在事件被触发 n 秒后再执行回调，如果在这 n 秒内事件又被触发，则重新计时。

**应用场景**：搜索框输入、窗口大小调整、表单验证

```js
/**
 * 防抖函数
 * @param {Function} func - 需要防抖的函数
 * @param {Number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖处理后的函数
 */
function debounce(func, delay) {
  let timer = null;
  
  return function(...args) {
    // 如果已有定时器，清除之前的定时器
    if (timer) {
      clearTimeout(timer);
    }
    
    // 设置新的定时器
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
```

### 节流（Throttle）

**概念**：规定一个单位时间，在这个单位时间内，只能触发一次函数执行。如果这个单位时间内多次触发，只有一次生效。

**应用场景**：滚动加载、按钮点击、鼠标移动

```js
/**
 * 节流函数
 * @param {Function} func - 需要节流的函数
 * @param {Number} delay - 时间间隔（毫秒）
 */
function throttle(func, delay) {
  let timer = null;
  
  return function(...args) {
    // 如果定时器存在，说明还在等待期，直接返回
    if (timer) return;
    
    // 设置定时器
    timer = setTimeout(() => {
      func.apply(this, args);
      timer = null;
    }, delay);
  };
}
```
