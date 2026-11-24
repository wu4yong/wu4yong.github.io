---
title: TypeScript-TS类型声明
date: 2018-04-19 22:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-ts"></div>

# TypeScript

## 类型声明

## 一、三斜杠指令

- 三斜杠指令是包含单个 XML 标记的单行注释。注释的内容用作编译器指令。

```ts
/// <reference path="..." /> 指令是该组中最常见的。它用作文件之间依赖的声明。
/// <reference types="..." /> 指令声明对包的依赖。
/// <reference lib="..." /> 该指令允许文件显式包含现有的内置 lib 文件。
```

- 在 .d.ts 文件中做类型的声明，在文件中声明了变量，模块，interface，type 等之后，在其他地方不需要导入就可以直接使用，并且有语法提示
- declare 关键字: 用于类型声明

## 二、.d.ts 文件的作用

- `.d.ts` 是 TypeScript 的声明文件，里面只写类型声明，编译后不产生对应的 JavaScript 代码
- 它用来描述已经存在的 JavaScript 库的形状，让 TS 代码调用这些库时能得到类型检查和语法提示
- 第三方 npm 包如果没有自带类型声明，可以通过 `@types/<包名>` 形式的包安装，例如 `npm install --save-dev @types/lodash`
- 如果 npm 包已经在自身包里附带了声明文件，就不需要再下载对应的 `@types` 包

## 三、declare 声明

- `declare` 用来告诉编译器某个值或类型在运行环境中已经存在，而不是在这里实现它

```ts
declare var foo: number;
declare function greet(greeting: string): void;
declare class Greeter {
  constructor(greeting: string);
  showGreeting(): void;
}
```

- 全局变量用 `declare var`、`declare let` 或 `declare const` 声明，只读的变量用 `declare const`
- 全局函数用 `declare function` 声明；类用 `declare class`；点号访问的对象用 `declare namespace`
- 同名函数可以写多个 `declare function` 声明，表示函数重载
- 声明文件里也可以用 `interface` 和 `type` 别名来描述对象形状和可接受的取值组合

```ts
interface GreetingSettings {
  greeting: string;
  duration?: number;
  color?: string;
}
declare function greet(setting: GreetingSettings): void;

type GreetingLike = string | (() => string) | MyGreeter;
```

- 命名空间声明可以嵌套，外部通过点号路径访问里面的接口和类型别名
- 类声明里的成员可以是属性，也可以是方法签名，构造器参数同样要写类型

## 四、三斜杠指令的位置

- 三斜杠指令只在文件顶部有效，前面只能再有注释或其他三斜杠指令；出现在语句或声明之后会被当成普通单行注释
- `/// <reference path="..." />` 声明文件之间的依赖，相对路径相对于当前文件解析
- `/// <reference types="..." />` 声明对一个包的依赖，作用类似为声明包写 `import`
- `/// <reference lib="..." />` 让文件显式包含内置的 lib 文件，写法和 `lib` 编译选项一致

## 五、声明文件里的类型写法

- 可选属性在属性名后面加 `?`，和普通 TypeScript 对象类型写法一致
- 函数参数可以联合类型描述，例如 `string | (() => string) | MyGreeter`
- 组织多个相关类型时可以用 `declare namespace` 嵌套分组，调用方通过点号路径访问

## 六、全局声明与模块声明文件的区别

- 描述通过 `<script>` 标签或加载器挂到全局作用域的库时，声明文件里直接写全局的 `declare var`、`declare function`
- 描述 npm 包时，声明文件按模块组织，里面用 `export` 导出类型和值，消费方再 `import`
- 声明文件只提供类型信息，不能在里面写运行时的实现逻辑
- 如果某个变量在运行时由第三方脚本注入，先用 `declare` 声明它的类型，代码里才能访问对应属性和方法

## 七、编写声明文件的注意点

- 内置的 JS 运行时类型和 DOM 类型通过 `lib` 或三斜杠 `reference lib` 引入，不要在声明文件里重复声明一遍
- 可选属性、联合类型、接口和类型别名都可以在声明文件里正常使用
- 想描述一组构造函数或类的形状时，用 `declare class` 写清构造器、属性和方法签名

## 八、声明的可见范围

- 全局声明文件里写的 `declare var`、`declare function` 不需要 import，在脚本文件里可以直接使用
- 按模块组织的声明文件，里面导出的类型和值必须通过 import 引入，不会自动进入全局作用域
- 同一个第三方库的类型声明通常集中在一个 `.d.ts` 文件里，按模块拆分导出

## 参考

- https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
- https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html
- https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html
- https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html
