---
title: TypeScript-TS介绍
date: 2018-04-15 17:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-ts"></div>

# TypeScript

## TypeScript 基础

> 复杂性不会凭空消失，只是会从 A 转移到 B

## 一、TypeScript 介绍

- TypeScript 是一门静态类型语言，编译类型语言
- TypeScript 是 JavaScript 的超集(兼容 JavaScript 的所有特性)

### 1.1 为什么要使用 TypeScript

1. JS 缺失类型的概念，TS 在 JS 的基础上增加了类型的概念保证程序的健壮性
2. 在开发时能够拥有更好的开发体验。使用 TS 后，IDE 可以做到自动提示，自动填充、重构等功能
3. JS 中的每个值都有一组行为，你可以通过运行不同的操作来观察这些行为。但是 JS 很难在运行之前预测结果，每种操作的结果取决于我们最初拥有的值。开发者只有在代码运行时才能发现问题。TS 在 JS 的基础上增加了类型系统，静态类型系统描述了当我们运行程序时我们的值的形状和行为。能够提前发现错误，错误代码在编译时期就会报错，而不用非得等到代码已经跑起来。

```js
// 即使 message 不是 string, 在 JS 中也可以对它执行 `()` 操作
message.toLowerCase();
message();
```

### 1.2 TypeScript 的特点

- 在代码运行之前（静态）运行的工具并确保程序的类型正确（类型检查）
- TS 的核心原则之一就是对`值所具有的结构`进行类型检查(`结构类型`类型系统)

## 二、类型的理解

- 类型：一组具有相同特征的值的集合
- 如果两个值具有共同的特征，就可以说，它们属于同一种类型，一旦确定某个值的类型，就意味着，这个值具有该类型的所有特征，可以进行该类型的所有运算。`类型是人为添加的一种编程约束和用法提示`

```ts
// string 代表可能字符串的无限集合
// never 是一组空值(空类型)，由于集合中没有值，所以 `永不` 类型 `永不` 能有任何值
const any: any = 1;
const never: never = any; // 不能将类型“any”分配给类型“never”。ts(2322)
```

## 三、TS特点：结构类型系统

- TypeScript 的核心原则之一是类型检查侧重于`值的形状`。这有时被称为 `duck Typing` 或 结构类型
- 在 TypeScript 中，最好将类型视为一组具有共同点的值。因为类型只是集合，所以一个特定的值可以同时属于多个集合

### 3.1 TS 中的擦除

```ts
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  return {
    color: config.color || "red",
    area: config.width ? config.width * config.width : 20,
  };
}

// 一、直接传入对象字面量
// TS 会报告错误：对象字面在将它们分配给其他变量或将它们作为参数传递时会得到特殊处理并进行额外的属性检查
createSquare({ colour: "red", width: 100 }); //对象字面量只能指定已知的属性，但“colour”中不存在类型“SquareConfig”。是否要写入 color?

// 二、先将值赋给变量再传入
// 只要你在 squareOptions 和 SquareConfig 之间具有共同属性, TS 就不会报错
const squareOptions = { colour: "red", width: 100 };
createSquare(squareOptions);
```

### 3.2 TS 的类型并不存在于运行时中

- TS 编译生成的 JS 代码中，类型信息会被完全删除，类型注释永远不会改变程序的运行时行为。
- 但是 JAVA, C# 等语言 "代码中编写的类型在运行时存在"，类型通过他们的声明而不是他们的结构相关

```ts
// 一、打印泛型类型
function add<T>(data: T) {
  console.log(typeof T); // “T”仅表示类型，但在此处却作为值使用
  return data;
}

// 二、打印接口类型
interface IUser {
  name: string;
  age: number;
}

const user1: IUser = {
  name: "张三",
  age: 18,
};

console.log(typeof user1); // object， not IUser
```
