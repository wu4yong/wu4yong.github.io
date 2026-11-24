---
title: 设计模式-原型模式
date: 2018-02-15 14:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-dp"></div>

# 设计模式

## 原型模式

- JavaScript 是一门基于原型的面向对象语言，它的对象系统就是使用原型模式来搭建的
- 在其他静态类型语言中都是基于类来创建对象(通过类创建的对象都有具体的类型)。而 JavaScript 是基于原型来创建对象(通过原型创建的对象没有具体类型)
- JavaScript 语言是动态类型语言，平时只关注了 number string boolean 等基本数据的类型，却忘记了 object 在其他静态语言中也是有类型的。既然 JavaScript 中没有类型的概念，所以不能使用类去创建对象。
- 原型模式是通过`克隆`来创建对象的 借用 Object.create() 方法。但是原型模式的真正目的并非在于需要得到一个一模一样的对象，而是提供了一种便捷的方式去创建对象，克隆只是创建这个对象的过程和手段
- (注意：上文中提到原型模式通过克隆来创建对象，但是 Object.create(obj) 方法的返回值却并不像我们所想的那样和 obj 长得一样。是因为 JS 并没有把被克隆对象的属性一个个展开放到返回值中，而是采用了一个**原型指针**的形式来指向被克隆对象。也许返回值的形式上并不像克隆了被克隆对象，但是实质上返回值可以调用所有被克隆对象拥有的属性和方法)

```js
function duck() {
  // 1. 在构造函数内部返回的 this 对象是通过 Object.create(obj) 生成的
  // Object.create() 的功能是创建一个对象，对象的原型是传入的参数
  this = Object.create(duck.prototype)
  // 2. this 实际的内部情况
  this = {
    __proto__: duck.prototype
  }
  // 3. 根据语句在 this 中添加新的属性。将最终的 this 返回出去
  this = {
    xxx: xxx,
    yyy: yyy,
    ...
    __proto__: duck.prototype
  }
}
```

## 动物世界

- JavaScript 中的所有对象都是克隆自同一个对象(这个源对象就是 Object.prototype)

```js
// 自定义一个动物世界

// Animal 的原型就是源对象
Animal.prototype = Object.create(null);
function Animal() {
  // this 是通过 Object.create(Animal.prototype) 克隆源对象生成的
  this.type = "animal";
  this.makeSound = function () {
    console.log("animal sound");
  };
}
// 生成的 animal 对象就是在克隆 源对象 的基础上添加一些自定义的属性和方法
const animal = new Animal();

// Dog 的原型指向 animal 实例(animal 实例是在克隆 源对象 的基础上添加了一些数据)
Dog.prototype = new Animal();
function Dog() {
  // this 是通过 Object.create(Dog.prototype) 克隆 animal 实例生成的
  this.type = "dog";
  this.eat = function () {
    console.log("dog eat");
  };
}
// 生成的 dog 对象就是在克隆 animal 实例的基础上添加了一些自定义的属性和方法
// 又因为 animal 实例克隆了 源对象。所以 dog 实例最终的克隆源头也是 源对象
// 因为 dog 对象是通过克隆 animal 对象而来的，所以说 animal 对象是 dog 对象的原型。如果在多几个层级就会形成原型链。在 javaScript 中通过原型链来实现继承的效果
// ！！！原型编程中的一个重要特性：即当对象无法响应某个请求时，会把该请求委托给它自己的原型(基于原型链的委托机制就是原型继承的本质)
const dog = new Dog();
```

## JavaScript 中的原型继承

1. 所有的数据都是对象(JS 中除了 undefined 和 null 数据都是对象。string number 等基本数据通过包装类的方式变成对象进行处理)
2. 要得到一个对象，不是通过实例化类。而是找到一个对象作为原型并克隆它
3. 对象会记住它的原型(JS 中的对象通过隐藏属性 `__proto__` 来找到它的原型)
4. 如果对象无法响应某个请求，它会把这个请求委托给它自己的原型(原型继承的精髓所在)

## Object.create 与原型查询

- `Object.create(proto)` 创建一个新对象，新对象的原型就是传入的 `proto` 参数
- 传入 `null` 作为原型时，新对象不继承 `Object.prototype`，原型链上找不到 `toString`、`hasOwnProperty` 等方法
- `Object.getPrototypeOf(obj)` 读取对象的原型，`Object.setPrototypeOf(obj, proto)` 改写对象的原型
- 读取对象属性时，先在对象自身查找，找不到就沿原型链逐级向上委托，直到原型为 `null`
- 给对象赋值一个属性时，通常直接写在对象自身上，不会改写原型链上同名的属性

## 冻结与密封的边界

- `Object.freeze(obj)` 冻结对象：不能再新增属性、删除属性，已有数据属性的值也不能再修改
- 冻结只作用于对象自身的直接属性；如果某个属性的值本身是另一个对象，这个嵌套对象不会被一并冻结，它的属性仍可修改
- `Object.seal(obj)` 密封对象：不能新增和删除属性，但已有可写属性的值仍然可以修改
- 冻结或密封都不会把原型链上的方法一并封死，需要限制原型上的改动要单独处理

## class 语法与原型的关系

- JavaScript 的 `class` 是在原型继承之上提供的语法形式，类的实例方法定义在类的原型对象上，由所有实例共享
- 类体内部默认运行在严格模式下
- 以 `#` 开头的私有字段只能在类体内部读写，类外部访问不到
- `class` 不能像 `var` 声明的变量那样被提前使用，在类声明之前引用会抛出错误

## 参考

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
