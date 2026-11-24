---
title: JavaScript-函数对象
date: 2018-02-27 10:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## 函数对象

## 函数是对象

* 函数实际上是对象，每个函数都是 Function 类型的实例，而且和其他对象一样都具有属性和方法。
* 由于函数是个对象，因此函数名实际上也是一个指向函数对象的指针，不会与函数绑定。
* 函数是对象，函数名是指针。函数体是真正的值。栈内存存地址(指针)，堆内存存数据

## 函数属性和方法

### 属性

* function.length 返回函数的形参个数
* function.name 返回函数的名称
* function.caller 属性中保留着调用当前函数的函数的引用(代码)，如果是在全局中调用这个函数会返回null，在其他函数中使用会返回父函数的代码
* function.prototype 函数的原型

### 方法

* 每个函数都包括两个非继承过来的方法
* apply() 和 call()，在特定的作用域中调用函数，实际上等于设置函数体内的 this 值。
* call(obj，arguments...)必须明确的传入每一个参数,obj 是重新指定的执行环境。
* apply(obj, [arguments])可以传入一个参数的数组，obj 是重新指定的执行环境。
* 使用这两个方法来扩充作用域的好处是，对象不需要与方法有任何的耦合，函数就可以使用对象作为环境。
* ES5 定义了 bind 方法，可以创建一个函数的实例。其 this 值会被绑定到传给 bind() 函数的值。 var b = a.bind(obj);

## 函数继承的方法

* toLocalString(), toString() 方法始终都返回函数的代码，但是因浏览器而异。所以无法使用这两个方法实现重要的功能。
* valueOf() 方法返回函数的代码

## 函数的几种声明形式

- 函数声明：`function name() {}`，会被提升到当前作用域顶部
- 函数表达式：`const fn = function () {}`，函数名只在函数体内可见，表达式只在执行到赋值语句时绑定，赋值前调用会触发引用错误
- 函数表达式可以匿名，也可以命名；命名函数的名字只在函数内部用于自指或调试栈跟踪
- 箭头函数：`() => {}`，没有自己的 `this`、`arguments`、`super`，也没有 `prototype` 属性，不能用 `new` 调用；作为构造函数调用会抛出 `TypeError`
- 箭头函数没有 `arguments`，需要参数列表时使用剩余参数
- 箭头函数体内的 `this` 沿用定义处外层作用域的 `this`，`call`、`apply`、`bind` 都无法改变它
- 箭头函数主体中不能使用 `yield`，也不能作为生成器函数
- 函数本身也是对象，可以给函数挂载自定义属性；函数名是指向函数对象的指针，不与函数体绑定
- 函数提升只适用于函数声明，函数表达式在赋值语句执行之前不可调用
- 箭头函数表达式总是匿名；命名函数表达式的名字只在函数体内部有效
- 普通函数作为构造函数调用时，`this` 指向新建实例；箭头函数不能承担这一角色
- 嵌套的内部函数形成闭包，可以访问外层函数的参数和变量
- 函数表达式作为回调传给其他函数时，通常使用匿名写法；函数名改变只改变指向，不复制函数体
- 函数表达式作为回调传递时，通常不需要单独命名

## arguments 与剩余参数

- `arguments` 是函数内部的类数组对象，包含实际传入的参数，`arguments.length` 是实参个数
- `arguments` 有从零开始的索引属性，但不具备 `forEach`、`map` 等数组内置方法
- `arguments` 只在非箭头函数中可用；箭头函数没有自己的 `arguments`
- `arguments.callee` 指向当前执行的函数，在严格模式中被禁用
- 非严格模式、简单参数的函数中，修改参数会同步到 `arguments` 对象，反之亦然；严格模式下二者互不影响
- 参数按值传递给函数；传入对象时，函数内部修改对象属性对调用方可见
- 剩余参数与 `arguments` 互不替代：剩余参数是真正的数组，`arguments` 是类数组对象
- 剩余参数是数组实例，可以直接调用 `forEach`、`map` 等数组方法
- 现代代码优先使用剩余参数 `...args` 替代 `arguments`，剩余参数可以直接调用数组方法

## 函数的 length 与 name 属性

- 函数的 `length` 属性是形参个数，不含剩余参数，也只统计第一个带默认值的参数之前的参数
- `arguments.length` 反映的是实际传入的参数个数，与函数的 `length` 不是一回事
- `name` 属性返回函数名，用于调试和识别函数；由 `bind()` 得到的绑定函数，`name` 会带上 `"bound "` 前缀
- 普通函数实例内置 `length`、`name`、`prototype` 三类主要属性
- `prototype` 属性指向函数的原型对象；箭头函数不提供 `prototype` 属性，该属性只存在于普通函数上，用于构造实例的原型链
- 函数内部的 `this` 由调用方式决定，而不是由函数定义位置单独决定；函数作为对象方法调用时，`this` 指向该对象
- 剩余参数只收集排在形参之后的额外参数，不占用 `arguments` 之外的独立位置
- `Function` 构造函数本身是一个 `Function` 实例，它的 `length` 属性值为 1；`Function.prototype` 本身可以被调用，`length` 为 0

## call、apply、bind 的补充

- `call` 逐个传参，`apply` 接受参数数组或类数组对象，二者都在指定的 `this` 下调用原函数；两者的区别只在参数传递形式
- 非严格模式下，`call`、`apply` 传入 `null` 或 `undefined` 作为 `this` 时，会被替换为全局对象；严格模式下未指定的 `this` 保持 `undefined`
- `bind` 返回一个绑定函数，预先固定 `this` 和前导参数，调用时再补齐剩余参数，这种用法也称偏函数；`bind` 不立即执行原函数
- 绑定函数预设的参数插入到调用时传入参数的前面；绑定函数的 `length` 为目标函数 `length` 减去已绑定参数的个数，最小值为 0
- 绑定函数可以通过 `new` 构造，此时传入的 `thisArg` 被忽略；绑定函数没有自己的 `prototype` 属性，不能作为 `extends` 的基类
- 递归可以通过函数名、`arguments.callee` 或作用域内指向函数的变量名引用自身
- 严格模式下函数内未指定的 `this` 为 `undefined`，不会指向全局对象

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/length
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions
