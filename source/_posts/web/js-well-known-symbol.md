---
title: JavaScript-高级符号
date: 2018-03-09 19:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## 符号

## 1.1 `?.` 可选链

```ts
// 可选链是为了避免冗余的前置检验
// 不使用可选链
if (user && user.info && user.info.name) {
  console.log(user.info.name);
}
```

```ts
// 使用可选链
// TS 在尝试访问 user.info.name 之前会先检查 user 是否为 null 或者 undefined
// TS 在尝试访问 user.info.name 之前会先检查 user.info 是否为 null 或者 undefined
// 如果上一级的属性不存在，那么表达式的返回值为 undefined
user?.info?.name;
```

## 1.2 `??` 空值合并运算符

```ts
// ?? 属于高级的 ||

const user = { number: 10 };

// 只有当 user.number 为 null 或者 undefined 的时候才会返回 '暂无数据'
user.number ?? "暂无数据";

// 当 user.number 为 false 类型(undefined, null, false, 0, '')时就会返回 '暂无数据'
// 所有的 false 类型都会返回 '暂无数据'，有时候会出现意料之外的行为
user.number || "暂无数据";
```

## 1.3 Symbol 类型

- Symbol() 返回唯一的 symbol 值，可用作对象属性标识符；不能用 new Symbol() 构造
- 每个 Symbol() 调用产生的值都不相等，即使描述字符串相同
- Symbol.for(key) 在全局注册表中按 key 查找或创建 symbol，Symbol.keyFor(sym) 反查注册 key；未注册的 symbol 找不到对应 key
- symbol 作为键的属性不会出现在 for...in 和 Object.keys() 中，可用 Object.getOwnPropertySymbols() 获取
- symbol 描述存在 description 属性上，仅用于调试展示
- JSON.stringify 会忽略 symbol 键的属性

## 1.4 内置通用（well-known）Symbol

- Symbol.iterator：返回对象默认迭代器的方法，被 for...of 使用
- Symbol.asyncIterator：返回默认异步迭代器的方法，被 for await...of 使用
- Symbol.hasInstance：instanceof 运算符调用的判断方法
- Symbol.toPrimitive：对象转换为原始值时调用的方法
- Symbol.toStringTag：Object.prototype.toString() 读取的默认描述字符串
- Symbol.species：创建派生对象时使用的构造器函数
- Symbol.isConcatSpreadable：布尔值，控制对象是否被 Array.prototype.concat() 展开成元素
- Symbol.match、Symbol.replace、Symbol.search、Symbol.split：分别对应字符串 match、replace、search、split 操作
- Symbol.unscopables：列出在 with 环境中排除在外的属性名
- Symbol.matchAll：匹配全部结果的迭代器方法
- 这些内置 symbol 是语言预留的内部行为钩子，修改它们会改变对应内置操作的行为

## Symbol 的注册与标识

- Symbol.for(key) 按 key 在全局注册表中复用同一个 symbol，相同 key 得到相同值
- Symbol.keyFor(sym) 返回注册表中对应 key；未通过 Symbol.for 创建的 symbol 返回 undefined
- 每个 symbol 唯一且不可变，描述字符串相同不代表两个 symbol 相等
- description 是 symbol 实例上的只读描述属性，仅用于调试，不参与相等性比较

## 符号作为属性键

- 计算属性语法 [sym] 把 symbol 作为对象键
- symbol 键属性不出现在 for...in、Object.keys()、Object.assign() 和展开运算符中
- Object.getOwnPropertySymbols() 取出对象自身的 symbol 键；Reflect.ownKeys() 同时返回字符串键和 symbol 键
- JSON.stringify 序列化时忽略 symbol 键的属性

## 常见内置符号的作用

- Symbol.iterator 定义对象的默认迭代行为，支持 for...of 和展开
- Symbol.hasInstance 被 instanceof 调用，可自定义实例判断逻辑
- Symbol.toPrimitive 控制对象转原始值的转换顺序和结果
- Symbol.toStringTag 决定 Object.prototype.toString() 输出的标签名
- Symbol.isConcatSpreadable 控制 concat 时是否把对象展开为数组元素
- Symbol.unscopables 列出 with 环境中不可见的属性名

```js
const sym = Symbol("age");
const obj = { [sym]: 18 };
Object.keys(obj); // []
Object.getOwnPropertySymbols(obj); // [Symbol(age)]
```

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol
