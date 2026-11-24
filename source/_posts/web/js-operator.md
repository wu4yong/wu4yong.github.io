---
title: JavaScript-操作符
date: 2018-03-11 21:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## 操作符

## 一、运算优先级

1. 计算的顺序从左到右
2. ()的计算优先级最高
3. 运算符主要还是看运算的结果，运算过程中`产生的数值是附属品`

## 二、赋值运算符

1. `=`: 赋值的顺序从右到左
2. 赋值表达式有`返回值`

## 三、逻辑运算符

* || 运算符碰到表达式转化为布尔值为 true 时就输出该表达式。直到最后一个表达式无论真假都输出。(`短路操作符`)
* && 运算符碰到表达式转化为布尔值为 false 时就输出该表达式。直到最后一个表达式无论真假都输出。(`短路操作符`)

1. && 优先级大于 ||
2. || 经常在兼容里用到, 返回一个能用的。
3. obj.name && obj.name.length 可以避免因为 obj.name 是 undefined 而报错

* ! 逻辑非：把表达式转化为布尔值在取反
* ！！ 把表达式转化为布尔值在取反后再取反，相当于表达式转换为布尔值, 和 Boolean() 函数作用一样。

## 四、乘性运算符

* `*`乘法

* `/` 除法

* 求模 `%`
  
* 指数操作符 `**`

```js
3 ** 2 === Math.pow(3, 2)  // 9
```

## 五、加性运算符

* `+` 加法

* 减法 `-`

## 六、关系运算符 > < >= <=

* 字符串在对比时，对比的是字符的 asc 码值。且从第一个符号开始，依次对比
* 任何关系运算符在比较 NaN 时返回值都是 false

```js
NaN < 3  // false
NaN >= 3 // false
```

```js
// 先比较 "1" 和"8", "1" 是小于 "8" 的
"10" > "8"  // false
```

## 七、== 和 ！=

* 对比时，会发生类型转换
* 引用值：比较的是地址。
* 原始值：比较的是数值。
* null 与 undefined 相等
* null 与 undefined 不能转化为其他类型的值再进行比较
* `!不推荐使用`

## 八、 === 和！==

* 不会发生类型转换
* `!推荐使用全等和不全等符号`

## 九、逗号运算符

* 使用逗号运算符可以在一条语句执行多个操作，例如 `var a = 1, b = 2, c = 3;`(每一个变量都是相当于有 var 声明过的)，(但是 `var a = b = 123;` a声明过，b没有声明过)
* 用于返回表达式中的最后一项 `var num = (1, 2, 3, 4);` 那么 num 的值为4，因为他是最后一项

## 十、一元操作符

* --a(前缀减) ++a(前缀加) a--(后缀减) a++(后缀加)

## 十一、位操作符

* 数值的底层操作，也就是操作内存中表示数据的比特(位)

## 十二、条件运算符

- 三元条件运算符是 JavaScript 唯一带三个操作数的运算符：condition ? exprIfTrue : exprIfFalse
- 条件为真值执行冒号前的表达式，为假值（null、NaN、0、空字符串、undefined、false）执行最后的表达式
- 三元运算符是右结合的，可以连续链接，等价于 if...else if 链
- 整个表达式只返回被执行的那一个表达式的值，未被选中的表达式不会求值

## 十三、类型判断与成员判断运算符

- typeof 返回操作数类型的字符串：undefined、boolean、number、bigint、string、symbol、function、object
- typeof null 是历史遗留行为，返回 "object"，不等于 "null"
- 对未声明的标识符使用 typeof 返回 "undefined"，不会抛 ReferenceError；但对暂时性死区中的 let/const 变量使用 typeof 仍会抛 ReferenceError
- in 运算符判断属性是否出现在对象及其原型链上，不是判断值是否相等
- instanceof 判断构造函数的 prototype 是否出现在实例的原型链上，返回布尔值
- delete 用于删除对象的可配置属性，返回布尔值；删除不可配置属性在严格模式下抛 TypeError

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Conditional_operator
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof
