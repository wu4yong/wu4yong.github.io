---
title: TypeScript-TS类型缩小
date: 2018-04-15 13:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-ts"></div>

# TypeScript

## 类型缩小

- TS 只有对联合的每个对象都有效的情况下才允许操作

```ts
function printId(id: number | string) {
  // 类型“string | number”上不存在属性“toUpperCase”。类型“number”上不存在属性“toUpperCase”。ts(2339)
  console.log(id.toUpperCase());
}
```

- 解决方案是使用代码进行类型缩小
- 当 TypeScript 可以`根据代码的结构为某个值推断出更具体的类型`时，类型就会发生缩小(将类型精炼为比声明的更具体的类型的过程)。

```ts
function printId(id: number | string) {
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // id 的类型被缩小为 string(将鼠标移到变量 id 上可查看)
  } else {
    console.log(id++); // id 的类型被缩小为 number (将鼠标移到变量 id 上可查看)
  }
}
```

## 一、类型缩小的方式

### 1.1 typeof 类型保护

- typeof 的返回值"string"、"number"、"bigint"、"boolean"、"symbol"、"undefined"、"object"、"function"
- 在 TypeScript 中，检查 typeof 返回的值是一种类型保护。因为 TypeScript 编码了 typeof 如何对不同的值进行操作，所以它知道它在 JavaScript 中的一些怪癖

```ts
function printAll(strs: string | string[] | null) {
  if (typeof strs === "object") {
    for (const s of strs) {
      // “strs”可能为 “null”。
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  } else {
    // do nothing
  }
}
```

## 1.2 真值缩小

- 七种 false 的值：false、null、undefined、0、NaN、""、0n(bigint)
- 在 JS 例如 if() 这样的代码结构中，会自动将条件强制转化为 boolean 类型

```ts
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === "object") {
    // strs 不再会是 null
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  } else {
    // do nothing
  }
}
```

### 1.3 相等性缩小

- TS 还可以使用 switch、===、!==、==、!= 等相等性检查来缩小类型

```ts
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // 因为 x === y 所以 x 和 y 的类型也肯定一样，所以一定是 string
    x.toUpperCase(); // (parameter) x: string
    y.toLowerCase(); // (parameter) y: string
  } else {
    console.log(x); // (parameter) x: string | number
    console.log(y); // (parameter) y: string | boolean
  }
}
```

### 1.4 in 运算符缩小

- prop in object: 指定的属性是否在指定的对象或其原型链中

```ts
function move(animal: Fish | Bird | Human) {
  if ("swim" in animal) {
    animal; // (parameter) animal: Fish | Bird
  } else {
    animal; // (parameter) animal: Bird | Human
  }
}
```

### 1.5 instanceof 缩小

- x instanceof Foo: 检查 x 的原型链是否包含 Foo.prototype

```ts
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString()); // (parameter) x: Date
  } else {
    console.log(x.toUpperCase()); // (parameter) x: string
  }
}
```

### 1.6 使用类型谓词

- parameterName is Type: is 关键字一般用于函数返回值类型中，判断参数是否属于某一类型，并根据结果返回对应的布尔类型。

```ts
// 一、不使用类型谓词
function isString(s: unknown): boolean {
  return typeof s === "string";
}

function ifUpperCase(str: unknown) {
  if (isString(str)) {
    // (parameter) str: unknown
    // 报错:类型“unknown”上不存在属性“toUpperCase”
    str.toUpperCase();
  }
}

// 二、使用类型谓词
function isString(s: unknown): s is string {
  return typeof s === "string";
}

function ifUpperCase(str: unknown) {
  if (isString(str)) {
    str.toUpperCase(); // (parameter) str: string
  }
}

// 三、直接使用 typeof
function ifUpperCase(str: unknown) {
  if (typeof str === "string") {
    str.toUpperCase(); // (parameter) str: string
  }
}
```

- 使用类型谓词来判断复杂类型

```ts
interface Animal {
  song: () => void;
}

interface Dog extends Animal {
  jump: () => void;
}

interface Cat extends Animal {
  rapper: () => void;
}

function isCat(animal: Animal): animal is Cat {
  return (animal as Cat).rapper !== undefined;
}

function showTime(animal: Cat | Dog) {
  if (isCat(animal)) {
    animal.rapper(); // (parameter) animal: Cat
  } else {
    animal.jump(); // (parameter) animal: Dog
  }
}

const cat: Cat = {
  song: () => {
    console.log("song");
  },
  rapper: () => {
    console.log("rapper");
  },
};

showTime(cat);
```

### 1.7 判别联合

- 当联合中的每个类型都包含具有`字面类型`的`公共属性`时。TS 认为这是一个`可区分的联合`

```ts
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2; // (parameter) shape: Circle
  } else {
    return shape.sideLength ** 2; // (parameter) shape: Square
  }
}
```
