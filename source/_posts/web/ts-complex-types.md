---
title: TypeScript-TS复杂类型
date: 2018-04-17 21:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-ts"></div>

# TypeScript

## TS 复杂类型

## 一、数组类型

```ts
// 类型后面接上 [] 表示由只某种类型元素构成的数组
let list: number[] = [1, 2, 3];
// Array<元素类型> 使用数组泛型来定义,(不推荐使用这种形式，<> 语法在 tsx 中会识别异常)
let list: Array<number> = [1, 2, 3];

// 只读数组，数组的值不允许发生改变
const roArray: ReadonlyArray<string> = ["red", "green", "blue"];
const roArray: readonly string[] = ["red", "green", "blue"];
```

## 二、元组类型

- 允许表示一个已知数量和类型的数组，各元素的类型不必相同，不允许越界访问

```ts
const arr: [string, number] = ["no One", 12];
arr[2] = "1"; // 不能将类型“"1"”分配给类型“undefined”。ts(2322)
console.log(arr[2]); //长度为 "2" 的元组类型 "[string, number]" 在索引 "2" 处没有元素。ts(2493)
```

## 三、枚举类型

是 JS 标准数据类型的一个补充。使用枚举类型可以为一组数值赋予友好的名字，下标值默认从 `零` 开始，也可以自己手动赋值。

```ts
// 定义一组常量
// 这样做的话是代码的可读性特别好
enum Position {
  LEFT,
  RIGHT,
}

function test(position: Position) {
  switch (position) {
    case Position.LEFT:
      console.log("left");
      break;
    case Position.RIGHT:
      console.log("right");
      break;
    default:
      // 这是 never 类型的一个典型应用，任何类型的值都不能被赋值给 never
      // 如果正常传入参数的话是不会执行到 default 这步的，如果执行到了这步说明入参有问题
      // 我们就可以在这个错误的逻辑块中执行一个违规的操作。如果进入了这个逻辑块就会报错
      let result: never = position;
  }
}
test(Position.LEFT);
```

## 四、object 类型

- 表示非原始类型数据，也就是除了 number、string、boolean、undefined、null(!注意)、symbol、bigint 之外的类型。

```ts
// 当给一个数据 object 类型注释时，无法拿到对象上的属性，但是可以拿到对象原型链上的方法 toString valueOf 等
const obj: object = {
  name: "no One",
  age: 12,
};
obj.toString(); // 支持调用
obj.name; // 不支持调用
```

## 五、联合类型

- 联合类型是由两种或多种其他类型组成的类型，表示可能是这些类型中的任何一种的值。我们将这些类型中的每一种都称为联合的成员

```ts
// 表示一个变量可能是几种数据类型
function getLength(data: string | string[]) {
  return data.length;
}

getLength("123");
getLength(["1", "2", "3"]);
getLength(123); // 类型“number”的参数不能赋给类型“string | string[]”的参数

// 字面量类型(字面量类型的值和类型必须保持一致)和联合类型结合
const a: "left" | "right" = "left";
const b: "left" | "right" = "middle"; // 不能将类型“"middle"”分配给类型“"left" | "right"”
```

## 六、包装类类型

- :string 代表的是字符串类型
- :String 代表的是字符串包装类类型(代码中很少出现)

- 永远不要使用类型 Number、String、Boolean、Symbol、Object 这些`原始类型包装类`类型。他们几乎从未在 JS 代码中正确使用过
