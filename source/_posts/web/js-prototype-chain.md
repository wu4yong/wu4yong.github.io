---
title: JavaScript-原型 原型链
date: 2018-02-26 17:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## 原型链 原型

## 原型

![原型链结构](@@CDN@@/assets/img/web/js-prototype-chain/img-01.webp)

- 准则一: 构造函数的原型对象的 constructor 属性指向构造函数自身
- 准则二: 实例的 `__proto__` 和构造函数的原型对象指向`同一个内存区域`

1. `__proto__` 和 `constructor` 是所有对象（包括函数对象）共有的属性，用于指向对象的原型和构造函数；
2. `prototype` 是函数对象独有的属性（普通对象没有），用于定义该函数作为构造函数时，所创建实例的原型；
3. 由于函数本质是 “函数对象”（属于对象的特殊子集），因此函数会同时拥有` __proto__`、`constructor`（对象共有属性）和 `prototype`（函数独有属性）。

## 原型链

- 原型链：Object.prototype 是绝大多数对象(除了`Object.create(null)`)的原型链终点
- Object.prototype 的 `__proto__` 是 null

## Object.create

```js
(method) ObjectConstructor.create(o: object | null): any

// 创建一个对象，对象的原型是 o
const obj1 = Object.create(o);

// 创建一个对象，对象的原型是 null
const obj = Object.create(null);

// 因为 undefined 和 null 是原始值，没有原型，所以调用任意方法都会报错
undefined.toString(); // Cannot read properties of undefined (reading 'toString')
null.toString(); // Cannot read properties of null (reading 'toString')
```

## 读取与设置原型

- Object.getPrototypeOf(obj) 返回对象的原型，等价于读取实例的 __proto__，是规范推荐的写法
- Object.setPrototypeOf(obj, proto) 可以修改对象的原型；__proto__ 是浏览器暴露的非标准访问器，代码中优先用规范方法
- 构造函数的 prototype 属性决定了 new 出来的实例的原型
- 重写构造函数的 prototype 后，原有实例的原型链不会跟着变，只有新创建的实例指向新原型
- constructor 属性默认指向构造函数本身；把 prototype 整体替换为新对象后，新对象的 constructor 不再指向原构造函数，需要手动补回

## instanceof 与原型链

- instanceof 判断构造函数的 prototype 是否出现在实例的原型链上，返回布尔值
- 原型链终点是 Object.prototype，它的 __proto__ 是 null；Object.create(null) 创建的对象连 Object.prototype 都没有
- Object.prototype.hasOwnProperty(key) 只判断对象自身是否有该属性，不沿原型链查找
- Object.prototype.isPrototypeOf(other) 判断当前对象是否出现在 other 的原型链上，方向与 instanceof 不同
- 跨全局环境（多 frame、多 window）时，两侧的 Array.prototype 不是同一个对象，instanceof 可能失效；检测数组可用 Array.isArray

## 属性查找与共享

- 读取实例属性时，先查实例自身，找不到沿原型链向上，直到终点 null
- 实例自身覆盖原型上同名属性；删除实例属性后，原型上的同名属性才会重新可见
- 原型链上共享的是引用值，直接修改原型对象的属性会影响所有继承它的实例
- 给构造函数 prototype 添加方法，所有实例通过同一条原型链共享同一份方法定义

```js
function Car(make) {
  this.make = make;
}
const auto = new Car("Honda");
auto instanceof Car; // true
auto instanceof Object; // true
Object.getPrototypeOf(auto) === Car.prototype; // true
```

## 原型链上的继承关系

- 构造函数的 prototype 默认是一个普通对象，该对象内部的 [[Prototype]] 指向 Object.prototype
- new 操作把新实例的原型指向构造函数的 prototype，实例因此能访问原型上定义的方法和属性
- 自定义继承中，子类构造函数的 prototype 应指向父类实例，才能让子类实例沿链找到父类原型上的成员
- 原型方法内部的 this 指向调用该方法的实例，而不是原型对象本身
- 检查某个方法是否来自原型而不是实例自身，可用 hasOwnProperty 区分

```js
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  return "hi " + this.name;
};
const p = new Person("Tom");
p.sayHi(); // "hi Tom"
p.hasOwnProperty("sayHi"); // false
```

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf
