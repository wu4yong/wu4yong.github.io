---
title: JavaScript-类数组
date: 2018-03-05 01:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## 类数组对象

## 一、类数组对象的定义

> 定义：拥有一个 length 属性和若干索引属性的`对象`

```js
// 数组
var array = ["name", "age", "sex"];

// 类数组
var arrayLike = {
  0: "name",
  1: "age",
  2: "sex",
  length: 3,
};
```

## 二、类数组对象和数组的关系

### 2.1 相同点

```js
// 读
array[0];
arrayLike[0];
// 写
array[0] = "age";
arrayLike[0] = "age";
// 长度
array.length;
arrayLike.length;
```

### 2.2 不同点

- 类数组不可以直接调用数组的方法

```js
// 直接调用数组的方法(本质上因为 类数组 的原型上没有数组的那些方法)
arrayLike.push("age"); // 报错 arrayLike.push is not a function

// 可以间接的调用数组的方法
Array.prototype.push.call(arrayLike, 5);
```

## 三、类数组对象的好处

### 3.1 性能

- 在某些情况下，我们仅需要利用数组的部分特性(索引、length)。如果使用原生数组，数组的原型上会附带大量的数组方法，这会增加内存分配和垃圾回收的开销

### 3.2 扩展性

- 类数组本质上是对象，所以可以方便的添加属性和方法，这使得更加容易扩展和定制

### 3.3 方便的转换

- 虽然类数组不是真正的数组，但是可以轻松的转换为数组(转换后即可拥有数组的所有特性)

```js
// 1. Array.from()
const array = Array.from(arrayLike);

// 2. 扩展运算符

const array = [...arrayLike];

// 3. slice() 如果不传参数则返回数组的拷贝
Array.prototype.slice.call(arrayLike);
```

总结：仅适用于特殊场景，即拥有数组的部分特性(索引 length), 又拥有对象的全部特性(方便的添加属性和方法)

## 四、类数组对象的应用

- 函数中的 arguments, DOM 方法返回的节点列表

## 五、常见的类数组来源

- `arguments` 是函数内部的类数组对象，有 `length` 和从零开始的索引属性，但不继承 `Array.prototype`，没有 `forEach`、`map` 等数组方法
- `document.querySelectorAll()` 返回静态 `NodeList`，`document.getElementsByTagName()`、`document.getElementsByClassName()` 返回 `HTMLCollection`
- `NodeList` 自身提供 `forEach`、`entries`、`keys`、`values` 方法，`HTMLCollection` 没有这些遍历方法
- 纯索引类数组对象若没有实现 `Symbol.iterator`，扩展运算符 `...` 无法直接展开，需要先转成数组

## 六、转换为数组的细节

- `Array.from()` 接受类数组或可迭代对象，第二个参数是映射函数，在构造数组的过程中逐项执行映射
- 转换后缺失的索引位置在新数组中是 `undefined`，`Array.from()` 不会创建稀疏数组
- `apply()` 可以直接把类数组传给接受参数列表的内置方法，例如 `Math.max.apply(null, arguments)`

```js
function longest() {
  const args = Array.from(arguments, (item) => String(item));
  return args.join(",");
}
```

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from
- https://developer.mozilla.org/zh-CN/docs/Web/API/NodeList
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments
