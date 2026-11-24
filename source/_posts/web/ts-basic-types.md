---
title: TypeScript-TS基础类型
date: 2018-04-17 02:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-ts"></div>

# TypeScript

## 基础类型

## 一、布尔类型

```ts
let isTrue: boolean = true;
```

## 二、数字类型

- TS 中所有的数字都是浮点数(不区分浮点数和整数类型)

```ts
let num: number = 12;
```

## 三、字符串类型

```ts
let str: string = "no One";
```

## 四、undefined null

```ts
let u: undefined = undefined;
let n: null = null;
```

## 五、any

- 在你不确定变量的指定类型的时候，使用 any 来`取消类型检查`。any 是类型系统的`顶级类型`

```ts
// 利用 any 来定义包含不同数据类型的数组
let list: any[] = [1, "no One", false];
list[1]; //no One
```

## 六、unknown

- unknown 类型能接受任何类型(unknown 也是类型系统的顶级类型)
- unknown 类型代表任何值，类似于 any, 但是更安全。给 unknown 类型赋值时可以避免类型错误，但是不能访问任何属性.

## 七、void

- 表现不返回显式值的函数的返回值
- 在 JavaScript 中 不返回任何值的函数将返回 undefined, 但是在 TypeScript 中 void 与 undefined 不同

## 八、never 类型

1. 表示的是永不存在的值的类型
2. never 是任何类型的子类型，可以赋值给任何类型，没有任何类型是 never 的子类型(除了自身),即使是 any 也不能赋值给 never。

## 九、数组类型

- 数组类型有两种写法：元素类型后加 `[]`，或者写成泛型形式 `Array<元素类型>`，两者等价

```ts
let nums: number[] = [1, 2, 3];
let names: Array<string> = ["Alice", "Bob"];
```

- `[number]` 是另一种语法，表示元组，和普通数组不是一回事

## 十、联合类型

- 联合类型由两个或多个类型组成，表示值可以是其中任意一种类型，成员之间用 `|` 分隔

```ts
function printId(id: number | string) {
  console.log(id);
}
```

- 在没有收窄之前，只能访问联合类型所有成员共有的属性和方法
- 用 `typeof` 等判断把联合类型收窄到具体分支后，才能使用该分支独有的方法

## 十一、对象类型与可选属性

- 对象类型直接列出属性名和对应类型，属性之间可以用 `,` 或 `;` 分隔

```ts
function printCoord(pt: { x: number; y: number }) {
  console.log(pt.x, pt.y);
}
```

- 属性名后面加 `?` 表示该属性是可选的
- 读取可选属性之前需要先判断它不是 `undefined`，也可以用可选链 `?.` 访问

## 十二、字面量类型

- 除了宽泛的 `string`、`number`，类型位置上还可以写具体的字面量值，组成字面量联合类型

```ts
function configure(method: "GET" | "POST"): void {}
```

- `const` 声明的字符串字面量会被推断为字面量类型；`let` 变量则会被拓宽为 `string`
- 字面量类型常和联合类型配合，用来限定函数只能接收一组已知的取值

## 参考

- https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
- https://www.typescriptlang.org/docs/handbook/2/narrowing.html
