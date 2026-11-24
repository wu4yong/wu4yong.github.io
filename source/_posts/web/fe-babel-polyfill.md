---
title: 前端工程化-babel&polyfill
date: 2018-02-11 06:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-fe"></div>

# 前端工程化

## babel

- 语法层：let、const、class、箭头函数等。这些需要在构建时进行转义，是指在语法层面上的转义
- API 方法层：Promise、includes、map 等，这些是在全局或者 Object、Array 等原型上新增的方法，它们可以由相应的 ES5 代码来实现。所以导入对应的 polyfill 即可。
- Proxy: 是一种新增的机制，无法使用 ES5 代码来实现，所以无法使用 babel 兼容

## polyfill 的现代组合

- 旧包 `@babel/polyfill` 从 Babel 7.4.0 起已弃用，它内部打包的是 core-js 与 regenerator runtime 两部分
- 现在应用里分别引入 `core-js`（补 ECMAScript 的内置对象、静态方法和实例方法）和 `regenerator-runtime`（转译 generator、async 函数时所需的运行期垫片）
- polyfill 模拟的是完整的 ES2015+ 环境，不含未进入 Stage 4 的提案特性
- polyfill 会改写全局作用域和原生原型（如 `Array.prototype.includes`），适合应用项目；组件库或工具库不建议直接引入整套 polyfill
- 整包导入要放在入口文件最顶部，先于所有业务代码执行；`core-js` 整个应用只导入一次，重复导入可能造成全局冲突和难以追踪的问题
- 因为 polyfill 在运行期参与执行，安装时应作为 `dependency`，而不是 `devDependency`
- 如果编译目标里包含 generator 或 async 函数，且使用的 `@babel/core` 或 `@babel/plugin-transform-regenerator` 版本较旧，还需要单独加载 regenerator runtime；用 preset-env 的 `usage` 或 `transform-runtime` 时它会被自动带上
- 引入整套 polyfill 体积偏大，应用里优先用 `usage` 按实际使用注入，只补代码里真正用到的特性

```js
import "core-js/stable";
import "regenerator-runtime/runtime";
```

## preset-env 与按需注入

- `@babel/preset-env` 根据配置的目标环境决定需要哪些语法转译和 polyfill，而不是把所有特性全量打包
- 特性到转译插件、polyfill 的映射来自 compat-table、electron-to-chromium 等数据源，再结合 browserslist 选出需要的子集
- 目标环境可写在 `.browserslistrc`、`package.json` 的 browserslist 字段，或 preset 的 `targets` 选项里；autoprefixer、stylelint 等工具也复用同一份 browserslist 配置
- `useBuiltIns` 取 `entry`、`usage`、`false` 三种值
- `entry`：在入口按目标环境把整包导入替换成对应的单个 core-js 入口
- `usage`：在用到对应特性的文件里逐个补上 polyfill 导入，打包工具会把同一个 polyfill 只加载一次
- `false`：不自动注入 polyfill，也不转换 `import "core-js"` 这类入口导入
- 以 `usage` 为例，环境不支持时：写了 `new Promise()` 的文件会补上 `es.promise`，写了 `new Map()` 的文件会补上 `es.map`；环境已经支持的特性不会再补
- `entry` 模式下整包导入只在入口出现一次；用了 `usage` 就不要再把 polyfill 挂进打包工具的 entry 数组
- `corejs` 选项指定使用的 core-js 版本，只在 `entry` 或 `usage` 下生效；默认只注入稳定 ECMAScript 特性的 polyfill，提案特性需要额外开启
- 开启提案 polyfill 有两种方式：`entry` 下直接从 core-js 的提案入口导入；`usage` 下设置 `shippedProposals: true`，或写成 `corejs: { version: "3.8", proposals: true }`
- 未进入 Stage 4 的提案特性不会被自动包含；preset-env 默认也不会纳入低于 Stage 3 的提案，这类特性需要手动添加对应插件

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": "3.22"
      }
    ]
  ]
}
```

## 转译与 polyfill 的边界

- 语法层转译由 Babel 插件完成，产物是等价的旧语法代码；API 层靠 polyfill 在运行期补齐环境里缺失的内置对象
- 像 Proxy 这类依赖运行期机制的特性没有等价的 ES5 实现，Babel 无法转译，只能放弃兼容，或者把目标环境限定为支持该特性的浏览器
- 想避免污染全局，库场景可以用 `@babel/plugin-transform-runtime` 把辅助函数抽成独立模块复用；它的局限是实例方法（如 `Array.prototype.includes`）不会被补齐
- 实例方法垫片改的是原生原型，`transform-runtime` 不做原型修改，所以这部分补不上
- `transform-runtime` 同时解决辅助函数重复生成的问题：多个文件各自生成的同一个辅助函数（如 class 检查函数）会被抽成共享模块，避免在产物里重复出现
- 排查兼容问题时先判断特性属于哪一层：报错是语法不认识，还是运行期找不到某个对象或方法，再决定靠转译还是 polyfill 解决
- 老浏览器里使用 `import()` 这类动态导入语法还需要 Promise 垫片，因为打包工具内部用 Promise 来处理异步加载的 chunk；Promise 本身也是内置对象，需要单独垫片
- 语法转译后产物体积通常只增不减，polyfill 是运行期垫片，两者对最终包体的影响发生在不同阶段
- Babel 只负责把代码转成目标环境能执行的形态，不保证产物体积最小；最终的去重、合并和压缩仍由打包工具在构建阶段完成

## 配置选项与打包工具接入

- Babel 本身只处理单个文件的转译，需要通过 babel-loader 或 @rollup/plugin-babel 这类接入层挂进打包流程
- `modules` 选项默认 `auto`：由接入层告知打包工具是否支持原生 ESM，支持时保留 `import`/`export`，不支持时转成对应模块格式；设为 `false` 则保留 ES module，只有确定要发送原生 ES Module 时才这么用
- 接入层传入的 caller 数据决定模块语法的处理方式，手动覆盖 caller 可能导致后续打包工具特性适配变差
- `include` 和 `exclude` 只作用于 preset 内置的插件和 core-js 特性；不在 preset 内的插件要写在 `plugins` 里
- `forceAllTransforms` 默认 `false`；开启后对目标环境强制跑全部转译，兼容只支持 ES5 的压缩链路或旧运行环境
- `debug` 开启后会在控制台输出 preset-env 启用了哪些 polyfill 和转译插件，用来核对目标环境的兼容范围
- `corejs` 不配置版本时使用默认的 `"3.0"`，与项目实际安装的 core-js 版本不一致时，可能出现缺失特性或多余垫片
- `ignoreBrowserslistConfig` 默认 `false`；设为 `true` 后 preset-env 不再读取 browserslist 配置
- 全局配置写在 `babel.config.js` 或 `babel.config.json`，作用于项目内所有文件；局部配置只影响当前目录及其子目录

## 配置与使用上的补充

- `shippedProposals` 默认 `false`；开启后纳入部分浏览器已经实现的 Stage 3 提案
- 提案的 polyfill 入口形如 `core-js/proposals/string-replace-all`，需要在 `entry` 模式下手动导入
- `debug` 默认 `false`；输出内容包括启用的转译插件、polyfill 以及各目标环境的缺失情况
- 发布到 npm 的组件库不应把 polyfill 打进产物，垫片策略交由使用方决定
- 同一个辅助函数在产物里重复出现，通常是没有使用 `transform-runtime` 的表现
- 报错发生在编译期还是运行期，可以先区分问题出在语法解析还是 API 缺失
- Babel 转译不改变代码的运行行为，只做语法等价转换；依赖的内置对象仍需环境或垫片提供
- 配置里的 `targets` 与 browserslist 同时存在时，按文档优先级取值；想完全忽略 browserslist 用 `ignoreBrowserslistConfig`
- `useBuiltIns: false` 时，需要自己在入口引入所需 polyfill 或手动按需导入对应垫片
- preset-env 根据目标环境裁剪插件列表，目标环境越新，转译产物越接近源码

## 参考

- https://babeljs.io/docs/usage/polyfill
- https://babeljs.io/docs/babel-preset-env
