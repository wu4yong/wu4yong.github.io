---
title: JavaScript-JavaScript简介
date: 2018-03-10 09:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## JavaScript简介

- 要真正学好用好JavaScript，理解其`本质`、`历史`及`局限性`是非常重要的。

## ECMAScript

- 两个公司的两个版本的 javascript 语言备受业界关注，ECMA 协会制定了一个名为 ECMAScript 的标准。
- ECMAScript 定义的只是这门语言的基础(规定了语言的语法，类型，语句，关键字，保留字，操作符，对象)，在此基础上可以构建更加完善的脚本语言。
- WEB 浏览器只是 ECMAScript 实现的宿主环境之一，宿主环境提供基本的 ECMAScript 的实现，同时也会提供扩展，例如 DOM，BOM。其他的宿主环境还有(node)

## JavaScript 语言的特点

1. 解释语言
2. 动态类型，弱类型
3. 单线程
4. ECMA标准 JS 原生也称为 ECMAScript。三大核心：ECMAScript + DOM + BOM（后两个由浏览器提供）

### JS是动态类型语言

1. JS 中的变量可以赋值任意类型、变量实际值在运行时确定
2. case 里的数据类型完全可以不一样（和其他强类型语言不一样）
3. 数组内的数据类型可以是完全不同的数据类型 var arr = [1, 2, "abd", undefined]

### 函数一等公民

- JavaScript 中采用函数式编程的方式, 函数的作用十分强大

### 基于原型的面向对象

- 不同于其他主流语言(c#, java等`基于类的面向对象`), JavaScript 使用`基于原型的面向对象`

### 开发语言的特点

- 编译语言： 先通篇翻译之后，执行翻译完的文件: c、c++   速度快、用于底层实现，游戏、移植性不好
- 解释语言： 看一行、翻译一行、执行一行（不需要生成别的文件）: php、JS  速度稍微慢一点、跨平台（极大的优点）
- java 先编译后解释 因为 java 虚拟机的存在: .java -> 编译 -> .class ->jvm(虚拟机中解释执行)

## 浏览器中 JavaScript 的运行环境

- 在 chrome 浏览器运行环境中，v8 是 chrome 浏览器中的 JS 解析引擎
- 内置 API: DOM-BOM-JS 内置对象等等(内置 API 是由运行环境提供的特殊接口，只能在所属的运行环境中被调用，浏览器有自己的 API，Node 也有自己的一套 API )(在浏览器环境中利用浏览器提供的事件来操作 DOM，在 Node 环境中利用 Node 提供的事件来操作 IO)
- 待执行的 JS 代码(程序员在浏览器中编写 JS 代码的时候，会使用浏览器内置的 API)(也就是说 DOM 的方法, BOM的方法，还有 JS 中各种构造函数和方法都是内置在浏览器中的)

![js在浏览器中执行](@@CDN@@/assets/img/web/js-intro/img-01.webp)

### 小结

- javascript是一种专门为了与网页进行交互而设计的脚本语言

1. ECMAScript 核心语言功能
2. 文档对象模型(DOM)提供访问和操作网页内容的方法和接口
3. 浏览器对象模型(BOM)提供与浏览器交互的方法和接口

## 单线程与事件循环

- JavaScript 执行模型基于事件循环：运行环境维护堆、作业队列和调用栈三类数据结构
- 堆是内存中的大块区域，创建对象时在其中分配空间
- 调用栈后进先出，每个函数调用推入一个执行上下文栈帧，返回时弹出；同步代码先入栈执行
- 作业队列先入先出，异步任务完成后作为回调进入队列，由事件循环在栈空时依次取出执行
- 事件循环负责执行代码、收集和处理事件、执行排队的子任务，脚本本身是单线程的
- 每个自主执行器（代理）维护自己的堆、队列和调用栈
- 异步操作完成后执行的代码总是以回调形式提供，如 Promise 的 `then` 处理程序、`setTimeout` 回调、事件处理程序
- 队列中的作业分为任务和微任务两类，微任务优先级更高，会在下一个任务被取出之前先排空
- 每个作业会运行至完毕，不会被其他代码抢占；作业耗时过长会阻塞点击、滚动等用户交互
- 网络请求、定时器、用户交互等异步任务由宿主环境提供接口，结果回到主线程回调；`alert()`、同步 XHR 是少数会阻塞的传统例外

## 语言标准与宿主能力的边界

- JavaScript 的核心语言由 ECMA TC39 委员会标准化为 ECMAScript，同一套核心语言也可以运行在 Node.js 等非浏览器环境
- ECMAScript 规定语法、类型、错误处理机制、基于原型的继承、内置对象和函数、严格模式、模块系统等内容
- 引擎实现 ECMAScript 核心功能，宿主环境补充与外部世界交互所需的特定机制
- 浏览器范畴的 JavaScript 由 ECMAScript 核心和大量 Web API 组成，DOM 是其中最主要的一组 API
- DOM 规范中定义的对象，从 ECMAScript 角度称为宿主对象
- 宿主环境不同，可用的 API 也不同：浏览器提供 DOM、BOM，Node 不提供 DOM API，但仍实现了 `fetch()`、`setTimeout()` 等部分 Web API
- ES6 之后规范以发布年份命名（如 ES2017），ES6 就是 ES2015

## 动态类型的含义

- 动态类型意味着变量在运行时绑定类型，赋值可以切换类型，不需要在声明时写死类型
- 类型属于值而不是变量：同一个变量先后可以持有不同类型的值
- 类型检查要靠 `typeof`、`instanceof` 等在运行时完成
- 数组中的元素可以是不同类型，函数接收的参数类型也不固定

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Event_loop
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/JavaScript_technologies_overview
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules
