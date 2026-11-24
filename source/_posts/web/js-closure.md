---
title: JavaScript-闭包
date: 2018-02-25 04:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## 闭包

- 概念: 有权访问另一个函数作用域的变量的函数
- 实现方式：内部函数(内部函数使用了外部函数中的变量)被保存到外部时会生成闭包，是因为被返回出来的内部函数一直持有外部函数的执行期上下文。
   1. 直接返回函数 
   2. 返回对象，对象的方法是函数 
   3. setTimeout() 的回调函数被放到定时器线程中

- 优点：`私有化数据`并在`私有化数据的基础上保持数据`
- 缺点：闭包会一直持有父函数的执行期上下文(活动对象)，导致占用内存不被清除，造成`内存泄露`

## 一、闭包的应用

### 1.1 实现私有变量

- 在实现面向对象系统时使用闭包来模仿私有变量

```js
function counterNum() {
  var num = 10; //私有变量
  this.add = function () {
    num++;
  };
  this.getNum = function () {
    return num;
  };
}

const counterNum1 = new counterNum();
const a = counterNum1.getNum(); // 10

counterNum1.add();
const b = counterNum1.getNum(); // 11

// 无法直接读取 num 变量，只能通过定义的方法来操作 num 变量
console.log(counterNum1.num); // undefined
```

### 1.2 可以做缓存(存储结构)

- 相当于一个仓库(父函数返回多个子函数，这些子函数都会操作一个共同的变量)
- 在 ES6 之前的模块化就是通过这种形式实现的

```js
function father() {
  var num = 10;
  return {
    add: function () {
      num++;
    },
    increase: function () {
      num--;
    },
    get: function () {
      return num;
    },
    set: function (Snum) {
      num = Snum;
    },
  };
}
let a = father();
a.add();
a.add();
a.get(); //12
a.set(6);
a.get(); //6
```

### 1.3 高阶函数（柯里化）

> 详情参考 [高阶函数（柯里化）](/2018/02/26/web/js-higher-order-function/)

> 详情参考 [高阶函数（防抖节流）](/2018/02/26/web/js-higher-order-function/)

### 1.4 记忆函数

- 存储之前计算的结果，避免重复计算

```JS
const fibonacci = function () {
  const list = [1, 1]
  const fb = function(n) {
    let result = list[n]
    if(result === undefined) {
      result = fb(n - 1) + fb(n - 2)
      list[n] = result
    }
    return result
  }
  return fb
}(); //!有一个执行符号
```

## 二、闭包带来的问题

### 2.1 内存泄漏问题

- 解决内存泄漏问题:

1. 将保留内部函数的变量赋值为 null, 没有变量持有返回出来的内部函数后，内部函数占用的内存会被自动回收，内部函数持有的父函数执行期上下文也就会被回收
2. 在退出外部函数之前，将不使用的局部变量赋值为 null

### 2.2 打印问题

```JS
// ES6 之前使用立即执行函数来解决(来模仿块级作用域)
// ES6 之后使用块级作用域来解决
// 因为闭包的存在，最后的输出结果会是 4 4 4 4

for(var i = 0; i < 4; i++) {
  setTimeout(() => {
    console.log(i)
  }, j * 1000)
}

// 使用立即执行函数来 实现每隔一秒打印 0  1  2  3
for (var index = 0; index < 3; index++) {
  (function (j) {
    setTimeout(() => {
      console.log(j)
    }, j * 1000)
  }(index))
}

// 使用块级作用域来 实现每隔一秒打印 0  1  2  3
for(let i = 0; i < 4; i++) {
  setTimeout(() => {
    console.log(i)
  }, j * 1000)
}
```
