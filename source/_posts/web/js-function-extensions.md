---
title: JavaScript-函数的扩展
date: 2018-02-24 12:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## 函数的扩展

## 一、函数的默认值

- 函数参数的默认值

```javascript
function add(item, total = 0) {
  return [item, total];
}
add("a"); // ['a', 0]
```

- 解构赋值的默认值

```js
// 只用到了解构赋值的默认值
// 如果函数调用时没有传递参数，执行会报错
function move({ x = 1, y = 2 } = obj) {
  return [x, y];
}

// 这种方式和上面的方式等价，且这种方式更加简洁
function move({ x = 1, y = 2 }) {
  return [x, y];
}
move({ x: 5 }); // [5, 2]
move(); // 会报错提示obj不能是undefined
```

- 解构赋值默认值加上函数的默认值

```js
// 即用到了解构赋值的默认值，又用到了函数的默认值
function move({ x = 1, y = 2 } = { x: 6, y: 7 }) {
  return [x, y];
}
let a = move(); // 即使调用函数没有参数也不会报错[6, 7]
```

## 二、箭头函数

### 2.1 缩减代码量

### 1. 只有一个参数时可以把小括号省掉

```js
// 标准写法
const double = (num) => num * 2;

// 单个参数可以省略小括号
const triple = num => num * 3;

console.log(double(5));  // 10
console.log(triple(5));  // 15

// 但是没有参数或多个参数时，必须保留小括号
const sayHello = () => 'Hello';
const add = (a, b) => a + b;
```

### 2. 代码块部分如果只有一个 return 语句的话，就可以不加 {} 和 return

```js
// 标准写法
const multiply = (a, b) => {
  return a * b;
};

// 只有一个return语句，可以省略{}和return
const multiplySimple = (a, b) => a * b;

console.log(multiply(3, 4));       // 12
console.log(multiplySimple(3, 4)); // 12

// 注意：console.log()的返回值是undefined
const logValue = num => console.log(num);
const result = logValue(10);  // 打印: 10
console.log(result);          // undefined
```

### 3. 如果直接返回一个对象的话，需要在对象的外面加上一个 ()

```js
// 错误示例：会被当做代码块处理
// const createPerson = (name, age) => { name: name, age: age };  // 语法错误!

// 正确写法：使用小括号包裹对象
const createPerson = (name, age) => ({ name: name, age: age });

// 使用简写属性
const createPersonShort = (name, age) => ({ name, age });

console.log(createPerson('张三', 25));      // { name: '张三', age: 25 }
console.log(createPersonShort('李四', 30)); // { name: '李四', age: 30 }

// 对比：如果不用小括号包裹，需要使用return
const createPersonNormal = (name, age) => {
  return { name, age };
};
```

### 2.2 特性

- 箭头函数内没有 arguments
- 箭头函数没有 prototype 属性
- 箭头函数不会创建自己的 this，会继承外层作用域的 this

### 2.3 不适合的场景

- 对象里面不适合使用箭头函数,对象里面使用箭头函数来定义`方法`的话，会失去通过 `this` 实现面向对象编程的特点。

```js
const obj = {
  name: "foo",
  call() {
    console.log(this.name);
  },
};
// 因为 call 函数中的 this 是 obj 对象
obj.call(); // foo

const obj = {
  name: "bar",
  call: () => {
    console.log(this.name);
  },
};
// 因为 call 函数中的 this 是 window 对象
obj.call(); // undefined
```

- 需要动态 this 的地方，比如事件 addEventListener 绑定函数。
- 因为没有 this 也不能被当做构造函数

### 2.4 this 的指向问题

- 箭头函数不会创建自己的 this，所以它没有自己的 this，它只会从自己的作用域链的上一层继承 this。(只有函数和 window 有作用域，对象没有自己的作用域)
- 会捕获自己在定义时(注意，是定义时，不是调用时)所处的外层执行环境的 this，并继承这个 this 值。所以，箭头函数中 this 的指向在它被定义的时候就已经确定了，之后永远不会改变。不能使用 call(), apply() 等函数去改变 this 的指向
- 箭头函数中的this会保留定义该函数时的上下文

## 三、扩展操作符与函数

### 3.1 扩展参数

- `调用函数`时，使用扩展运算符将`可迭代对象` `拆分`为每个值`单独传入`

```js
getNum(...[1, 2, 3]);       // 等价于 getNum(1, 2, 3)
getNum(...[1, 2, 3], 4, 5); // 等价于 getNum(1, 2, 3, 4, 5)
getNum(0, ...[1, 2, 3]);    // 等价于 getNum(0, 1, 2, 3)
```

### 3.2 收集参数

- `定义函数`时，使用扩展运算符将多个参数`收集`为`数组`

```js
function getSum(...values) {
  return values.reduce((x, y) => x + y, 0);
}
getSum(1,2,3); // 6
```
