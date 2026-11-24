---
title: JavaScript-函数
date: 2018-02-23 14:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## 函数

- 在 JS 中函数是一等公民(函数拥有和"数据"完全平等的地位: 可以被任意操作、传递、组合)
- 把函数想象为`对象`，函数名想象为`指针`

## 一、函数声明

```js
function test() {}
test();
```

## 二、函数表达式

1. 命名函数表达式

```js
// 通过函数表达式声明函数时，函数原有的名称(foo)会失效
const bar = function foo() {};
```

2. 匿名函数表达式 --- 函数表达式

```js
const bar = function () {};
```

## 三、参数传递: 按值传递

### 3.1 原始类型值

- **传递方式**：值传递（类似于变量赋值时的复制）
- **内存分配**：函数的 arguments 会新开一个栈内存空间
- **值的拷贝**：将外部变量的值拷贝到新的栈内存中
- **地址关系**：arguments 中的变量和外部变量指向`不同的栈地址`
- **修改影响**：函数内部修改参数值`不会影响`外部变量

```js
function addTen(num) {
  num += 10;  // 修改的是 arguments 中的副本
  return num;
}

let count = 20;
let result = addTen(count);
console.log(count);  // 20，外部变量没有变化
console.log(result); // 30
```

### 3.2 引用类型值

- **传递方式**：值传递（传递的是引用地址的副本）
- **内存分配**：函数的 arguments 会新开一个栈内存空间
- **地址的拷贝**：将外部变量存储的`引用地址`拷贝到新的栈内存中
- **地址关系**：arguments 中的变量和外部变量指向`不同的栈地址`，但`都指向同一个堆内存`
- **修改影响**：
  - 修改对象属性：外部变量`会跟着变化`（因为操作的是同一个堆内存）
  - 重新赋值：外部变量`不会受影响`（因为改变的是栈中的地址指向）

```js
// 1. 函数内部修改参数，外部的引用值也会跟着变
function setName(obj) {
  obj.name = "Nicholas";
}
let person = new Object();
setName(person);
console.log(person.name); // "Nicholas"

// 2. 为参数重新赋值一个引用类型值， 外部引用值不会跟着变化(证明 JS 不是按引用传递)
function setName(obj) {
  obj.name = "Nicholas";
  obj = newObject();
  obj.name = "Greg";
}
let person = new Object();
setName(person);
console.log(person.name); // "Nicholas"
```

## 四、函数作为值使用

- 因为函数名本身就是变量，因此函数名可以当做值来使用。
- 函数能够作为值来使用，是 JS `灵活性的最重要体现`

## 五、函数内部

### 5.1 arguments

- arguments 是一个类数组对象
   1. arguments.callee 是一个指针，指向拥有这个 arguments 对象的函数
   2. arguments.length 表示实参的长度
   3. arguments[] 用于接收实参列表, ECMAScript函数既不关心参数的个数，也不关心参数的类型

### 5.2 this

- 指向的是函数执行的环境

### 5.3 new.target

- 检测函数是否使用 new 关键字调用

```js
function King() {
  if (!new.target) {
    throw '必须使用 "new" 关键字来实例化 King'
  }
  console.log('已使用 "new" 关键字实例化 King');
}
new King();  // 已使用 "new" 关键字实例化 King
King();      // Error: 必须使用 "new" 关键字来实例化 King
```
