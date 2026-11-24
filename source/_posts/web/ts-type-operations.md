---
title: TypeScript-TS类型操作
date: 2018-04-15 08:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-ts"></div>

# TypeScript

## 类型操作

## 一、keyof

- keyof 操作符可以用于获取某种`类型`的所有键，其返回类型是联合类型

```ts
interface Person {
  name: string;
  age: number;
  sex: string;
}

type PersonKeys = keyof Person; // "name" | "age" | "sex"
```

## 二、typeof 操作符

- 在类型上下文中获取`变量`或者`属性`的类型

```ts
const p = {
  name: "CJ",
  age: 18,
};

type Person = typeof p;

// 等同于
type Person = {
  name: string;
  age: number;
};
```

## 三 索引类型

```ts
type Person = {
  age: number;
  name: string;
  sex: boolean;
};

type T1 = Person["age"]; //type T1 =  number
type T2 = Person["age" | "name"]; //type T2 = number | string
type T3 = Person[keyof Person]; //type T3 = number | string | boolean
```

## 四、条件类型

## 五、映射类型

## 六、模版字面类型

## 七、条件类型

- 条件类型的形式和 JavaScript 三元表达式相似：`SomeType extends OtherType ? TrueType : FalseType`
- 左侧类型可以赋值给右侧类型时取 true 分支，否则取 false 分支；配合泛型使用才能发挥作用

```ts
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;
```

- `infer` 关键字在 true 分支里声明一个新的类型变量，用来从被比较的类型中推断出一部分类型
- 条件类型作用于泛型且传入联合类型时会按成员分发；用 `[T] extends [U]` 把两侧包成元组可以关闭分发行为

## 八、映射类型

- 映射类型基于索引签名语法，用 `keyof` 得到的键联合遍历现有类型，批量生成新类型

```ts
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
```

- 映射时可以加或去掉 `readonly` 修饰符和可选属性 `?`，前缀 `-` 表示移除，`+` 表示添加，默认是 `+`
- TypeScript 4.1 起可以在映射类型里用 `as` 子句重映射键名，配合模板字面量类型生成新的属性名
- 映射类型里通过条件类型把键解析成 `never`，可以从结果类型里过滤掉对应属性

## 九、模板字面量类型

- 模板字面量类型语法和 JavaScript 模板字符串相同，但用在类型位置上；插值位置是联合类型时，结果是所有组合的字面量联合

```ts
type Lang = "en" | "ja";
type LocaleID = `${Lang}_id`;
```

- 编译器内置了一组字符串操作类型：`Uppercase`、`Lowercase`、`Capitalize`、`Uncapitalize`
- 模板字面量类型可以和索引访问类型配合，把对象属性名拼进事件名，并通过泛型推断出回调参数的类型

## 参考

- https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
- https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
- https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
