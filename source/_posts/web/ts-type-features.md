---
title: TypeScript-TS类型功能
date: 2018-04-14 16:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-ts"></div>

# TypeScript

## TS 中类型功能

## 一、类型推断

- 我们并不是必须编写显式类型注释，TS 类型系统会自动推断类型
- 当 TS 类型系统最终会推断出相同的类型时，最好不要添加类型注释

```ts
// 首次赋值为 string 之后，就不能在赋值 number 类型了
let str = "123";
str = 1; // 不能将类型“number”分配给类型“string”
```

## 二、上下文类型

```ts
const names = ["Alice", "Bob", "Eve"];

names.forEach((s) => {
  console.log(s.toUpperCase()); // 即使参数 s 没有类型注释，TS 也会自动推断出 s 的类型为 string
});
```

## 三、类型断言

- 适用于你比 Typescript 更加了解某个值的详情
- 把一个比较 `宽泛` 的类型转成一个更加 `具体` 的类型

```ts
// as 语法(推荐)
let someValue1: any = "this is a string";
// 相当于强制的把 any 类型转化为 string 类型，并且我明确的知道这个就是 string 类型的数值
let strLength1: number = (someValue1 as string).length;

// 尖括号语法(在 tsx 中会报错)
let someValue: any = "this is a string";
// 相当于强制的把 any 类型转化为 string 类型，两种形式是等价的.
let strLength: number = (<string>someValue).length;
```

## 四、字面推断

- 当你使用对象初始化变量时，TypeScript 假定该对象的属性可能会在以后更改值

```ts
const obj = { counter: 0 };
obj.counter = 1; // TS 不会假定 counter 属性是字面量 0

// req.method 被推断为 string，而不是 "GET"，因为 req.method 的值是可以进行更改的
declare function handleRequest(url: string, method: "GET" | "POST"): void;
const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method); // 类型“string”的参数不能赋给类型“"GET" | "POST"”的参数。

// 解决方案之一
// as const 后缀的作用类似于 const，但用于类型系统，确保为所有属性分配字面类型，而不是更通用的版本，如 string 或 number。
const req = { url: "https://example.com", method: "GET" } as const;
```

## 五、`!` 非空断言

```ts
// ! 能够缩小 TS 的类型检查范围
// 这会告诉编辑器 x 不会是 undefined 或者 null
// 但是也仅仅是骗过了 TS 类型系统而已，如果 user 实际值为 undefined 则程序运行起来之后照样会报错
function liveDangerously(x?: number | null) {
  console.log(x!.toFixed());
}
```

## 六、类型收窄

- 类型收窄指 TypeScript 根据代码里的判断，把值的类型细化到比声明更具体的类型
- `typeof` 检查、真值判断、相等判断、`in` 操作符和 `instanceof` 都可以作为类型守卫参与收窄

```ts
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString());
  } else {
    console.log(x.toUpperCase());
  }
}
```

- `typeof null` 在 JavaScript 里是 `"object"`，所以仅靠 `typeof === "object"` 不能把数组和 `null` 分开
- 联合类型的每个成员都带一个相同的字面量属性时，构成判别联合，判断这个属性就能收窄到对应成员

## 七、satisfies 操作符

- `satisfies` 用来校验一个表达式的类型是否匹配某个类型，但不会改变这个表达式本身的结果类型
- 写成类型注解 `: T` 会把表达式拓宽成 `T`，丢失原本更精确的字面量推断；`satisfies` 只做校验，保留原推断类型

```ts
const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
} satisfies Record<string, string | number[]>;
```

## 参考

- https://www.typescriptlang.org/docs/handbook/2/narrowing.html
- https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html
