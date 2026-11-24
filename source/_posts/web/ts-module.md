---
title: TypeScript-TS模块
date: 2018-04-19 08:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-ts"></div>

# TypeScript

## 模块

- 任何包含顶级 `import` 和 `export` 的文件都被当成是一个模块
- 模块解决了标识符的可见范围

## 一、值的导出、导入

- 和 JS 语法保持一致

## 二、类的导出、导入

```ts
// 类型的导出
export type IPerson = {
  name: string;
};

// 类型的导入
import type { IPerson } from "xxx";

// 类型与值一起导入，单独标注类型
import { data, type IPerson } from "xxx";
```

## 三、命名空间

- TS 有自己的模块格式, 称为 namespaces, 它早于 ES 模块标准。命名空间在特定场景下很有用。但是 ES 模块能满足大部分需求。建议使用 ES 模块来与 JS 的方向一致

## 四、ES 模块的导出与导入

- 一个文件可以用 `export default` 声明主导出，其余导出通过不带 `default` 的 `export` 声明

```ts
// maths.ts
export const pi = 3.14;
export default class RandomNumberGenerator {}
```

- 导入时默认导出直接写在花括号前面，命名导出放在花括号里
- 导入时可以用 `import { 旧名 as 新名 }` 重命名，也可以用 `import * as 名字` 把所有导出放进一个命名空间对象
- `import "./file"` 这种写法只执行目标文件的副作用，不把任何变量引入当前模块

## 五、类型导入

- 类型和值可以用同一套 `import` / `export` 语法导出和导入
- `import type` 只能导入类型，被导入的引用不能当作值使用

```ts
import type { Cat, Dog } from "./animal.js";
import { createCatName, type Cat, type Dog } from "./animal.js";
```

- 在单个导入项前加 `type` 前缀（inline type 导入），可以把类型和值混在一条 `import` 语句里
- 这样写便于 Babel、swc、esbuild 等非 TypeScript 转译器识别出哪些导入可以安全删除

## 六、模块与脚本的区别

- 包含顶层 `import` 或 `export` 的文件会被当成模块；没有任何顶层 `import`、`export` 的文件被当成脚本，内容处于共享全局作用域
- 模块内部声明的变量、函数、类默认对外不可见，必须显式导出后才能被其他模块导入使用
- 想把一个没有导入导出的文件按模块处理，可以在文件里加一行 `export {}`，表示导出空内容

## 七、模块解析与编译选项

- 模块解析负责把 `import` 语句里的模块名映射到磁盘上对应的文件
- 内置的解析策略有 Classic 和 Node 两种，Node 策略复刻 Node.js CommonJS 模式下的查找方式，并额外检查 `.ts` 和 `.d.ts` 文件
- 除了 `moduleResolution`，`baseUrl`、`paths`、`rootDirs` 等配置也会影响解析结果
- 编译输出用哪个模块格式由 `module` 选项决定，`target` 决定哪些 JS 特性会被降级

## 八、CommonJS 写法与互操作

- npm 上大多数包按 CommonJS 格式发布，导出挂在 `module.exports` 上，导入用 `require`

```ts
module.exports = {
  pi: 3.14,
  absolute(num: number) {
    return num < 0 ? -num : num;
  },
};
```

- CommonJS 和 ES 模块在默认导入与命名空间导入的区分上存在差异，`esModuleInterop` 编译选项用来降低两套规范之间的互操作摩擦
- 用 ES 模块语法直接对应 CommonJS 的 `require` 时，可以写成 `import fs = require("fs")`

## 九、导出导入的补充约定

- 每个文件的默认导出只能有一个，命名导出可以有多个
- 声明变量、函数或类的同时可以直接在前面加 `export` 完成导出
- 导入的命名必须和导出时的名字一致，除非用 `as` 起了别名

## 参考

- https://www.typescriptlang.org/docs/handbook/2/modules.html
