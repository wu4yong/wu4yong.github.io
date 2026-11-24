---
title: JavaScript-严格模式
date: 2018-03-07 10:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## 严格模式

## 一、"use strict" ;语句来激活严格模式   就是一行字符串，不会对不兼容严格模式的浏览器产生影响

* 不再兼容 es3 的一些不规则语法。使用全新的 es5 规范。两种用法：

1. 全局严格模式
2. 局部函数内严格模式（推荐）

## 二、严格模式和 ES3 模式的区别

1. witch(obj){
    改变作用域链的最顶端(将obj作为此代码块的作用域最顶端，通常配合命名空间使用)
}  //效率会变低很多  es5严格模式禁用

2. arguments.callee  function.caller      //这两个属性es5严格模式禁用

3. 变量赋值前必须声明  

4. var a = b = 3;会报错，b is undefined
5. a = 3;会报错,a is undefined  

6. 局部的 this 必须被赋值  在 es5 的严格模式下，预编译下的 this 不会指向 windows 为 undefined 。但是全局的 this 还是指向 window

7. 拒绝重复的属性和参数

### 2.8 eval() 严格模式禁用

* 可以把字符串当做代码执行
* 功能强大，但是很危险

### 2.9 严格模式不支持八进制字面量

## 三、常见运行时行为差异

- 给未声明的变量赋值在严格模式下抛 ReferenceError，不会再意外创建全局变量
- 普通函数调用时 this 不再被包装成对象，未指定 this 时为 undefined；全局作用域的 this 仍指向全局对象
- 严格模式下 arguments 对象保存调用时的原始参数，修改形参不会同步到 arguments[i]，反之亦然
- 给不可写属性、只读访问器属性、不可扩展对象的新属性赋值，都会抛 TypeError，而不是静默失败
- 试图删除不可删除的属性在严格模式下抛 TypeError；删除已声明变量是语法错误

## 四、被禁用或受限的语法

- with 语句在严格模式下是语法错误，它让作用域解析在运行时才能确定，引擎难以优化
- arguments.callee、arguments.caller、函数的 caller 和 arguments 属性在严格模式下访问或赋值都抛 TypeError
- 前导零形式的八进制字面量（如 015）在严格模式下是语法错误；ES6 的 0o10 写法仍然合法
- 严格模式下 eval 不会向外层作用域引入新变量，eval 内部声明的变量只在 eval 代码内有效
- 严格模式下 eval、arguments 不能被赋值，也不能用作函数名或参数名
- 重复的函数参数名在严格模式下是语法错误
- implements、interface、let、package、private、protected、public、static、yield 等保留字不能作为标识符
- 代码块内部的函数声明在严格模式下受限，函数声明应放在脚本或函数顶层

## 严格模式的开启位置与范围

- "use strict"; 放在脚本最前面对整个脚本生效；放在函数体第一条语句对该函数及其嵌套函数生效
- 不能在 {} 块内开启严格模式，块级声明不会形成严格模式作用域
- 严格模式代码与非严格模式代码可以共存，项目脚本可以渐进式启用
- eval、Function 构造器、事件属性、setTimeout 传入的脚本字符串，按各自规则决定是否处于严格模式

## 严格模式下的其他限制

- 不能给原始值（布尔、数字、字符串）设置属性，否则抛 TypeError
- 不能删除通过 var 声明的变量，delete 声明变量是语法错误
- 函数参数名必须唯一，重名参数在严格模式下是语法错误
- 函数内的 arguments 与形参脱钩，修改一方不影响另一方
- 严格模式代码中的静态绑定让引擎更容易做编译优化，相同代码在严格模式下往往可以跑得更快
- 非严格模式下静默失败的操作（给不可写属性赋值、给只读访问器赋值、给不可扩展对象加属性）在严格模式下都会抛 TypeError

## 常见写法对照

- 普通函数调用 this 为 undefined，而不是全局对象；用 call、apply、bind 指定的 this 按原值传入
- 严格模式下访问未声明变量直接抛 ReferenceError，不会在全局对象上新建属性
- with 被禁用后，名称解析在编译期就能确定，避免运行时才能判断作用域归属
- eval 内部声明的变量不泄漏到外层作用域
- 严格模式保留 implements、interface、let、package、private、protected、public、static、yield 等名字作为关键字
- 块内函数声明受限，现代代码应把函数声明放在脚本或函数顶层

```js
"use strict";
function f(a, a) {
  // 语法错误：参数名重复
}
```

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode
