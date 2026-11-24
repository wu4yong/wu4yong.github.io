---
title: JavaScript-对象的扩展
date: 2018-03-01 21:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## 对象的扩展

## 一、增强对象字面量

```js
// 1. 当对象属性的 key 和属性的值一样时，就可以简略书写
{ item: item }  ==>  { item }

// 2. 当对象拥有方法属性时，可以简写 function
{ findItem: function(){} }   ==> { findItem(){} }

// 3. 可计算属性
const obj = {}
obj['foo' + 'bar'] = 'baz'
// 不需要再提前定义 obj 了
const obj = {
  ['foo' + 'bar']: 'baz'
}
```

## 二、对象方法

### 2.1 遍历对象的方法

- Object.keys() 以数组的形式返回对象的键 (自身的并且可枚举的属性)
- Object.values() 以数组的形式返回对象的值 (自身的并且可枚举的属性)
- Object.entries 以数组的形式返回对象的键值对 (自身的并且可枚举的属性)

### 2.2 Object.is()

- 使用了 SameValueZero 相等性比较算法,
- 表现和 === 基本相等, 主要区别于 NaN 和 +0 -0

```js
// Object.is() 修复了 === 中存在的两个问题
NaN === NaN; // false
+0 === -0; // true
Object.is(NaN, NaN); // true
Object.is(+0, -0); // false
```

### 2.3 Object.assign(obj1, ...obj)

- 将源对象的 `自身属性` 且为 `可枚举属性` 的值复制到目标对象。它将返回目标对象。

```js
const obj1 = {
  name: "foo",
  age: 12,
};
const obj2 = {
  name: "bar",
  sex: 1,
};

let newObj = Object.assign({}, obj1, obj2);
newObj; // {name: 'bar', age: 12, sex: 1}
obj1; // {name: 'foo', age: 12}
obj2; // {name: 'bar', sex: 1}
```

## 三、对象的冻结与密封

- Object.preventExtensions(obj) 禁止向对象添加新属性，已有属性和对象原型不受影响
- Object.seal(obj) 在 preventExtensions 基础上把现有属性的 configurable 设为 false，不能添加或删除属性，现有值仍可写
- Object.freeze(obj) 是最高级别保护，现有属性不可写、不可配置，对象原型也不能重新指定
- 这三个方法都返回传入的同一个对象，不会创建冻结副本
- 冻结是浅冻结：属性值本身是对象时，内层对象仍可修改，需要逐层冻结才能得到整体不可变的对象
- 非严格模式下这些改动尝试通常静默失败，严格模式下会抛出 TypeError

## 四、属性描述符

- 对象属性除了 value，还由 configurable、enumerable、writable 三个特性描述；访问器属性用 get、set 代替
- 直接赋值添加的属性默认 writable、enumerable、configurable 都为 true
- Object.defineProperty(obj, key, descriptor) 可以精确添加或修改属性；描述符里省略不写的特性默认为 false
- enumerable 为 false 的属性不会出现在 for...in、Object.keys()、Object.assign() 和展开运算符中
- Object.getOwnPropertyDescriptor(obj, key) 读取对象单个自身属性的描述符
- 数据描述符与访问器描述符不能混用，同时出现 value/writable 与 get/set 会抛出异常

```js
const obj = {};
Object.defineProperty(obj, "name", {
  value: "foo",
  writable: true,
  enumerable: true,
  configurable: true,
});
```

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
