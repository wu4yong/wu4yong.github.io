---
title: Node.js-模块系统
date: 2018-04-11 23:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-node"></div>

# Node.js

## CommonJs规范

## 一、CommonJs 的特点

* commonJS 规范是同步的加载
* 在 Node 中一个文件就是一个模块，每个文件模块都是一个对象
* Node 中 CommonJS 的 `本质` 就是 `对象的引用赋值` (导入模块拿到的就是导出模块的 `module.exports` 对象的 `引用地址` )

### 1.1 语法

```js
// 导出多个值
module.exports = {
    name,
    phone
}

// 导出多个值
module.exports.a = name;
module.exports.b = phone;

// 导出单个值
module.exports = "xujie"

// 用变量接收
var module = require("./tool.js")
// 使用解构赋值接收
var { name, phone } = require("./tool.js");
```

### 1.2 module.exports 和 exports 的区别

```js
//  module.exports 才是真正被导出的东西
module.exports = {
  ...
}

// 额外声明了一个 exports 对象，exports 的引用指向 module.exports 的堆内存
// 目的是为了同 commonJS 规范一致(commonJS 规定要用 exports 语句导出内容)
exports = module.exports

// 这样使用是没有问题的，因为操作的是同一个堆内存
exports.a = 'xu'
exports.b = 'jie'

// 不可以这样使用，改变了 exports 对象对应的堆内存地址，exports 将和 module.exports 失去关系
// 最终导出的是 module.exports 堆内存数据，而不是 exports 的堆内存数据
exports = {
  a,
  b
}
```

## 二、node 的模块

* 核心模块(会被预先放到内存中，加载速度较快) 和 文件模块
* 不论是核心模块还是文件模块，require() 方法对相同模块的 `二次加载` 都一律采用 `缓存优先` 的方式，这是 `第一优先级` 的。不同之处在于核心模块的缓存检查先于文件模块的缓存检查。
* 加载顺序: 核心模块(http、path、fs 等) > 文件模块(相对路径 & 绝对路径) > 非路径形式文件模块(去 node_modules 中查找)
* node 允许 `路径标识符` 中省略扩展名 并且依次按照 `.js .json .node` 进行尝试，如果找不到对应 `文件` 的话会把 `路径标识符` 看作一个 `目录`，然后依次查找目录下的 `index.js index.json index.node`
* 找到对应的模块后对模块进行编译。每一个编译成功的模块都会将其文件路径作为索引缓存在 `Module._cache` 对象上，以提高 `二次引入` 的性能。

## 三、node 的包文件

* package.json 包描述文件
* bin 用于存放可执行二进制文件的目录
* lib 用于存放 JS 代码的目录
* npm ls 可以用来分析当前目录下可以引入哪些包

## ESM 与 CommonJS 的差异

- Node 同时支持两种模块系统：CommonJS 是 Node 最初的打包方式，使用 `require()` 和 `module.exports`；ECMAScript 模块（ESM）使用 `import` 和 `export` 语法，和浏览器等运行时采用同一套标准
- 模块按扩展名和最近的 `package.json` 里的 `type` 字段判定：`.cjs` 始终按 CommonJS 处理，`.mjs` 始终按 ESM 处理；`.js` 文件按最近 package.json 的 `type`（`commonjs` 或 `module`）决定，没有该字段时按 CommonJS 处理
- 调用 `require()` 始终走 CommonJS 加载器，调用 `import()` 始终走 ESM 加载器；ESM 可以包含顶层 `await`，而被 `require()` 加载的 ESM 模块必须是完全同步、不含顶层 `await` 的
- ESM 的导入导出是静态结构，`import` 在模块加载阶段建立绑定；CommonJS 导出的是 `module.exports` 对象的引用，拿到什么取决于运行期对这个对象做了什么赋值

## require 的解析顺序与 node_modules

- 按 `require(X)` 的解析规则：先判断 X 是不是核心模块，是则直接返回核心模块并停止；其次处理以 `/`、`.`、`../` 开头的相对或绝对路径，按文件和目录两种方式加载；最后才在各级 `node_modules` 目录里查找非路径形式的模块名
- 作为文件加载时，依次尝试不带扩展名的路径、`.js`、`.json`、`.node`；作为目录加载时，先读目录下 `package.json` 的 `main` 字段，找不到再依次查找 `index.js`、`index.json`、`index.node`
- 查找 `node_modules` 时从调用文件所在目录向上逐级进入父目录，每一级都检查对应的 `node_modules` 文件夹；包可以放在文件系统任意位置，解析过程基于调用方文件的真实路径逐级向上
- 核心模块在缓存检查上优先于文件模块；无论是核心模块还是文件模块，二次加载都优先走缓存，不会重复编译执行

## 模块缓存与循环依赖

- 每个编译成功的模块以文件路径为索引缓存在 `Module._cache` 上，再次 `require()` 同一模块时直接返回缓存里的 `module.exports` 对象，提升二次引入性能
- 因为 CommonJS 拿到的是导出对象的引用，循环依赖（A 依赖 B、B 又依赖 A）在某一方还没执行完导出时，可能拿到不完整的导出对象；使用时要避免在模块顶层立即访问对方尚未赋值的导出属性
- 修改导出对象的属性会反映到所有引用方，因为大家共享同一个对象引用；整体替换 `module.exports` 则会让引用方看到新的导出对象
- 需要在运行期判断解析到的具体文件路径，可以使用 `require.resolve()`，它返回实际加载到的文件名而不执行模块

## 参考

- https://nodejs.org/api/modules.html
