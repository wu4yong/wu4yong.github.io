---
title: JavaScript-try catch
date: 2018-03-07 04:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## try catch

* try catch 块的优点是，当 try 中的代码有警告的话， 代码不会直接死掉而是可以在 catch 中尝试解决这个错误
* 还可以使用 throw 来自定义错误

## Error.name的六种对应的信息

1. EvalError: eval()的使用和定义不一致
2. RangeError： 数值越界
3. ReferenceError：非法或不能识别的引用数值
4. SyntaxError：发生语法解析错误
5. TypeError：操作数类型错误
6. URLError：URL处理函数使用不当

```js
try {
   ...
} catch (e) {
    console.log(e.name + e.message);
} finally {
  console.log('无论有没有错误都会执行');
}
```

## throw

* throw 错误的时候，可以直接 throw("..."), 也可以 throw 一个 Error 对象(throw New Error("..."))

## 注意点

* try catch 只会对运行时的 error 有效， 如果代码包含语法的错误，try catch 将会无法正常工作
* try 中如果包含了计划要执行的函数， 例如 setTimeout 里面的错误不会被捕捉到(异步的错误不会被捕获到)

## 异常对象的属性

- 抛出的异常如果是 Error 实例，常见属性有 name（错误类型名）、message（错误描述）、stack（调用栈）
- name 常见取值包括 EvalError、RangeError、ReferenceError、SyntaxError、TypeError、URIError
- throw 可以抛出字符串等任意值，但规范和惯例上推荐抛出 Error 对象，便于保留类型和调用栈
- catch 绑定的异常值只在 catch 块作用域内可用；需要时可以在 catch 内把非 Error 值包装成 Error

## catch 绑定与 finally 执行规则

- 不需要异常值时，catch 可以省略绑定变量和括号，写成 catch { ... }（可选捕获绑定）
- finally 块无论 try 中是否抛出、catch 是否捕获异常，都会在退出整个结构之前执行
- try 或 catch 中的 return、throw 会被延迟到 finally 执行完毕后才生效
- 如果 finally 块自身用了 return 或 throw，会覆盖前面 try/catch 里的控制流结果，一般不建议在 finally 中返回值
- try...catch 只能捕获运行时抛出的错误；脚本自身的语法错误在解析阶段就出现，无法被 try 捕获
- 异步回调（如 setTimeout、Promise 回调）里抛出的错误，不会被外层同步的 try...catch 捕获
- 嵌套的 try 块由直接包裹它的 catch 捕获；异常未被内层处理时才向外层冒泡，重新抛出的异常会再次经过外层 catch

## 抛出与捕获的细节

- throw 后面跟任意表达式；抛出 Error 实例能保留 name、message、stack 等结构化信息
- catch 子句的绑定只在 catch 块内有效，不会污染外层作用域
- 捕获到非 Error 值时，可以在 catch 内用 new Error(e) 统一包装，再按类型处理
- 条件捕获常见做法：catch 内用 instanceof 判断错误类型，只处理预期错误，其余重新抛出
- 自定义错误可以继承 Error，在构造函数中设置 name 和 message

## 嵌套与冒泡

- 内层 try 没有 catch 时，异常向上找到包裹它的外层 catch 处理
- 异常在直接包裹它的 catch 中只被处理一次；重新抛出后才会再次经过外层 catch
- finally 用于资源清理（关闭文件、释放连接、移除监听），无论正常结束还是出错都会执行
- finally 中的 return 或 throw 会丢弃 try/catch 原本的返回值或异常，调试时容易掩盖问题

## 捕获不到的错误

- 语法错误在解析阶段出现，try...catch 无法捕获
- 异步回调（setTimeout、setInterval、Promise、事件监听）内抛出的错误，脱离了外层同步调用栈
- 模块加载、JSON 解析失败等场景的错误，需要在对应的异步接口或钩子中处理
- 未捕获的 Promise 拒绝不会经过传统的同步 catch，需要用 promise.catch 或全局 rejection 钩子处理
- Error.stack 是各环境提供的调用栈字符串，规范未统一其格式

```js
try {
  JSON.parse(text);
} catch {
  return false;
} finally {
  cleanup();
}
```

## 异常处理的常见约定

- 只捕获预期会出现的错误，避免用空 catch 吞掉所有异常
- 捕获后记录错误信息，必要时重新抛出，让上层决策
- 资源释放统一放在 finally，不要依赖 catch 是否执行
- 业务校验类错误可以抛出自定义错误类型，便于上层按 instanceof 分流

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/try...catch
