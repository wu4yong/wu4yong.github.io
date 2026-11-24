---
title: TypeScript-TS泛型
date: 2018-04-18 17:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-ts"></div>

# TypeScript

## 泛型

- 让参数的 `类型` `参数化`
- 泛型就是将两个或多个具有相同类型的值关联起来

## 一、函数泛型

```ts
// 在定义这个函数时，不决定这些参数的类型，而是让调用者以参数的形式告知，函数类型应该是什么
function sum<Type>(num: Type): Type {
  return num;
}

// 泛型类型的调用
sum<number>(20);
sum<string>("222");
sum<{ name: string }>({ name: "xujie" });
sum<any[]>([123, "123"]);

// 简化泛型函数的调用
sum(20); // 函数内部会使用类型推导
```

- 多个函数参数类型

```ts
function sum<T, E>(num1: T, num2: E) {
  console.log(num1, num2);
}
sum<number, string>(0, "123");
```

## 二、泛型接口

```ts
interface person<T, E> {
  name: T;
  age: E;
}

const p: person<string, number> = {
  name: "xujie",
  age: 18,
};
```

## 三、类泛型

```ts
class point<T> {
  x: T;
  constructor(x: T) {
    this.x = x;
  }
}

// 自动推导类型
const p1 = new point("1.22.34");
// 声明参数类型
const p2 = new point<string>("1.22.34");
const p3: point<string> = new point("1.22.34");
```

## 四、泛型类型限制(泛型约束)

```ts
// 接口要求数据有一个 length 属性
interface Length {
  length: number;
}
// 虽然是泛型，但是还是需要对于类型增加一些限制
function test<T extends Length>(arg: T) {
  // 想要返回参数的 length 属性
  // 但是不是所有数据都是有 length 属性的(eg: number)
  return arg.length;
}

// 下面三个数据都是有 length 属性的，才能被传进函数中
test("abc");
test(["122", "445"]);
test({ length: 90 });
```

## 五、泛型默认类型参数

- 给类型参数写默认值后，调用方不传对应类型参数时就回退到这个默认类型
- 有默认值的类型参数是可选的；必选的类型参数不能放在可选类型参数后面

```ts
function create<T = string>(arg: T): T {
  return arg;
}

create("hello"); // 类型参数取默认值 string
create<number>(1); // 显式传入 number
```

## 六、约束中引用另一个类型参数

- 一个类型参数可以用另一个类型参数作为约束，常见写法是 `Key extends keyof Type`
- 这样可以保证传入的键名确实存在于对象类型上，取不到对象上不存在的属性

```ts
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}

const x = { a: 1, b: 2 };
getProperty(x, "a");
```

- 泛型类只对实例侧是泛型的，静态成员不能使用类的类型参数

## 参考

- https://www.typescriptlang.org/docs/handbook/2/generics.html
