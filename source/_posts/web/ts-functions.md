---
title: TypeScript-TS函数
date: 2018-04-16 09:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-ts"></div>

# TypeScript

## TS 函数

## 一、函数类型定义

```ts
// 函数声明(这种方式相当于给函数的参数，返回值单独添加上类型注解)
// TS 能根据 return 语句来判断返回值的类型，因此我们一般省略函数返回值类型
function add(a: number, b: number): number {
  return a + b;
}
add(2, 5);

// 函数表达式(这种方式相当于给一个函数添加上了一个类型注解)
// (a: number, b: number) => number 这个叫函数类型，必须有返回值类型，没有返回值填写 void
let add: (a: number, b: number) => number = function (
  x: number,
  y: number
): number {
  return x + y;
};
add(2, 5);

// 函数表达式 - 推断类型
// 如果左边指定了类型，typescript 在右边会自动识别出类型，这叫做按上下文归类，是类型推论的一种
let add: (a: number, b: number) => number = function (x, y) {
  return x + y;
};
```

## 二、参数

- typescript 中每个函数的参数都是必须的，传入函数的参数个数必须和函数期望的参数个数相同。

### 2.1 可选参数 `？`

```ts
// 可选参数没有传递的时候是 undefined  
// 可选参数必须在必须参数的后面
function fullName(firstname: string, lastName?: string): string {
  return firstname + lastName;
}

fullName('xu', 'jie')  //xujie
fullName('xu') //xuundefined
```

### 2.2 默认参数

```ts
// 当没有传递参数和传递的参数是 undefined 时，使用参数的默认值
// 如果定义的时候带有默认值的参数声明在普通参数的前面，想要使用默认参数的时候。必须在传入参数的时候在前面传入undefined
function fullName(firstname: string, lastName: string = "jie"): string {
  return firstname + lastName;
}

fullName("xu", "han"); //xuhan
fullName("xu"); //xujie
```

### 2.3 可选参数和默认参数共享函数类型

```ts
// 当前定义的函数类型，第二个参数是可选参数(可选参数包含有默认值的参数和可选参数)
type fullNameType = (x: string, y?: string) => string;

// fullName1 函数的第二个参数可选参数，函数类型使用上面的 fullNameType
let fullName1: fullNameType = function (firstname, lastName?) {
  return firstname + lastName;
};

//  fullName 函数的第二个参数为有默认值的参数，函数类型也可以使用上面的 fullNameType
let fullName: fullNameType = function (firstname, lastName = "jie") {
  return  + lastName;
};
```

### 2.4 剩余参数

```ts
// 使用...a 表示个数不限的可选参数
function fullName(firstName: string, ...restName: string[]): string {
  return firstName + " " + restName.join(" ");
}

// 在函数类型上定义时也会用到 ...a 这个符号
let fullNameFun: (x: string, ...y: string[]) => string = fullName;

fullNameFun("xu", "jie", "han");
```

## 三、this

## 3.1 函数的重载

- 在同一个作用域内，可以定义多个同名函数，只要他们的参数列表不同(参数的数量不同、参数的类型不同、参数的顺序不同)

```ts
// 函数签名
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;

// 函数实现
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
```
