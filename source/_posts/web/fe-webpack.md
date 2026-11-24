---
title: 前端工程化-webpack了解
date: 2018-02-09 05:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-fe"></div>

# 前端工程化

## Webpack 基础

## 一、基础概念

- 是一个现代的 javascript 应用的`静态`(打包完成的文件是静态资源)`模块`(支持模块化开发)打包工具
- 依赖 node 环境

### 1.1 前端模块化

- 使用模块化开发完项目之后，需要借助 webpack 工具来处理模块之间的依赖关系
- 不仅仅是 js 代码，图片，css，json 文件在 webpack 中都被当做模块

### 1.2 打包

- 把各种资源文件进行打包整合，合成一个或者多个包。
- 在打包的过程中，还可以进行资源的处理，压缩图片，scss 转化为 css，ES6 语法转化为 ES5 语法，typeScript 转化为 javascript

### 1.3 和 grunt/gulp 对比

- 他们只是一系列的任务，压缩，转化。
- 并不涉及到模块化的概念，不会处理模块化之间的依赖

## 二、使用

- node_modules 文件下的 bin 目录包含了可以使用的指令, 同时拥有全局和局部的 webpack,想要使用局部的 webpack 时，需要到本地目录中执行 webpack node_modules/.bin/webpack。 想要直接使用局部 webpack 打包，可以使用 npx webpack 指令
- 在项目的 package.json 的 scripts 中执行的命令时会自动使用`局部的插件`
- 命令行参数的优先级，高于配置文件的参数优先级
- webpack 的强大特性之一就是能通过 `import` 导入任何类型的模块(eg: .css)

## 三、核心配置概念

- `entry` 是 webpack 构建内部依赖图的起点，默认值为 `./src/index.js`；webpack 从入口出发解析直接和间接依赖的所有模块
- `output` 告诉 webpack 生成的 bundle 放在哪里、如何命名；主输出文件默认为 `./dist/main.js`，其他生成产物默认放到 `./dist` 目录
- loader 配置在 `module.rules` 下：`test` 标识要匹配的文件，`use` 指定处理这些文件的 loader；webpack 开箱只理解 JavaScript 和 JSON 文件
- 插件注册在 `plugins` 数组中，用于 bundle 优化、资源管理、环境变量注入等更宽范围的任务；多数插件通过选项定制，使用时需要 `new` 出实例
- `mode` 取 `development`、`production` 或 `none`，开启对应环境的内置优化；默认值为 `production`
- webpack 从一个或多个入口出发构建依赖图，再把项目所需的每个模块组合成一个或多个 bundle，这些 bundle 就是对外提供服务的静态资源
- 没有配置文件时 webpack 仍可按默认入口打包；默认入口文件不存在会报入口模块无法解析的错误，这时需要在 `webpack.config.js` 里显式指定 `entry`

## 四、loader 规则细节

- 规则写在 `module.rules`：`test` 匹配文件路径，`use` 列出 loader 链；webpack 开箱只理解 JavaScript 与 JSON，其他类型文件都要靠 loader 转换
- 正则匹配文件时不要给正则加引号，加引号后会被当成单个绝对路径，而不是路径模式
- 一条规则还可以通过 `include`、`exclude` 收窄或排除生效目录；`enforce` 控制 loader 链的前后位置
- loader 链内执行从右到左，pitch 阶段从左到右先跑；pitch 返回结果即可跳过链上后续 loader
- 同步 loader 直接 `return` 或 `this.callback()` 返回结果；异步 loader 调 `this.async()` 取回回调后再回调，此时函数要返回 `undefined`
- 最后一个 loader 返回 `String` 或 `Buffer`，可附带 SourceMap；默认资源文件按 UTF-8 字符串传入，`raw: true` 时收到原始 `Buffer`
- loader 上下文里的 `this.callback` 接收错误、内容、可选 SourceMap 与 meta；传 meta 里的 `webpackAST` 可在 loader 之间共享预解析的 AST
- 默认模块构建结果标记为可缓存；loader 调 `this.cacheable(false)` 后整个模块在后续编译中重建，即使输入和依赖都没变
- `this.addDependency` 登记文件依赖，文件变化触发模块重编译；`this.addBuildDependency` 登记 loader 自身读取的配置文件，用于持久化缓存失效判断
- `this.context` 是当前模块所在目录，`this.rootContext` 是项目基础目录，后者在所有模块间保持一致
- `this.sourceMap` 标识当前是否需要生成 source map；不需要时强行产出会带来额外开销
- loader 报错可用 `throw`（中断模块编译）、`this.emitError()`（只上报不中断）或异步回调传错误三种方式
- loader 可以通过 `emitFile` 直接产出文件；`this.loadModule` 解析并应用其他模块的 loader，回调源码、SourceMap 与模块实例

## 五、插件、模式与配置组织

- 插件在编译生命周期钩子上注入任务；webpack 内部对象继承 Tapable，提供 `tap`、`tapAsync`、`tapPromise` 三种注册方式，钩子类型决定可用哪种
- `compiler` 代表编译器实例，`compilation` 代表一次编译；插件在对应钩子上访问这两个对象，读取模块与产物信息
- webpack 支持符合 ES5 规范的浏览器；`import()` 与 `require.ensure()` 需要 `Promise`，要兼容更老浏览器需要先加载对应的 polyfill
- 模块解析的扩展名、别名、查找目录由 `resolve` 相关配置控制；未配置时使用 webpack 内置默认规则
- webpack 配置本身是一个 JavaScript 模块，可导出对象；函数形式接收环境参数，按 `mode` 等条件返回不同配置
- 配置中需要引用本地文件路径时，通常结合 Node 的 `path` 模块拼接绝对路径，避免依赖命令执行时的工作目录
- loader 回答「文件怎么转换」，插件回答「编译流程中额外做什么任务」，两者职责互不替代

- webpack 4.0.0 起不强制要求配置文件；没有配置时按默认入口打包，入口文件不存在会报 `Can't resolve './src'` 一类错误
- webpack 5 要求 Node.js 不低于 10.13.0；IE8 及以下浏览器不在支持范围内
- 规则必须写在 `module.rules` 下而不是顶层 `rules`；写错位置 webpack 会给出警告
- 正则匹配文件时不要加引号：裸正则按路径后缀匹配，加引号后被当成单个绝对路径
- 一条规则可通过 `include`、`exclude` 收窄或排除生效目录；`enforce` 控制 loader 链的前后位置
- loader 链从右到左执行；`pitch` 方法从左到右先跑，pitch 返回结果即可跳过后续 loader
- 同步 loader 直接 `return` 或 `this.callback()` 返回；异步 loader 调 `this.async()` 取回回调后回调，函数返回 `undefined`
- 末位 loader 返回 `String` 或 `Buffer` 与可选 SourceMap；默认按 UTF-8 字符串传入，`raw: true` 时收到原始 `Buffer`
- `this.callback` 参数依次为错误、内容、可选 SourceMap、可选 meta；meta 里的 `webpackAST` 可在 loader 间共享预解析 AST
- 默认模块构建结果可缓存；`this.cacheable(false)` 后整个模块在后续编译重建，即使输入依赖没变；再次 `cacheable(true)` 不会恢复
- `this.addDependency` 登记文件依赖；`this.addBuildDependency` 登记 loader 自身读取的配置文件，用于持久化缓存失效判断
- `this.context` 是当前模块所在目录；`this.rootContext` 是项目基础目录（配置的 `context`，默认启动目录），在所有模块间一致
- loader 报错三种方式：`throw` 中断模块编译，`this.emitError()` 只上报不中断，异步回调传错误
- `this.loadModule` 解析并应用其他模块的 loader，回调源码、SourceMap 与模块实例；`this.emitFile` 直接产出文件
- 插件在编译生命周期钩子上注入任务；内部对象继承 Tapable，提供 `tap`、`tapAsync`、`tapPromise`，钩子类型决定可用方式
- `compiler` 是编译器实例，`compilation` 是一次编译；插件在钩子上访问两者读取模块与产物信息
- `mode` 三档 `development`/`production`/`none`，开启对应内置优化；默认 `production`
- `import()` 与 `require.ensure()` 依赖 `Promise`；兼容更老浏览器需先加载 polyfill
- 模块解析的扩展名、别名、查找目录由 `resolve` 配置控制；未配置时使用内置默认规则
- 配置文件是 JavaScript 模块，可导出对象；函数形式接收环境参数，按 `mode` 等条件返回不同配置
- 引用本地文件路径通常结合 Node `path` 模块拼接绝对路径，避免依赖命令执行时的工作目录
- loader 回答「文件怎么转换」，插件回答「编译流程中额外做什么任务」，职责互不替代
- 入口默认 `./src/index.js`；主输出默认 `./dist/main.js`，其他产物默认进 `./dist`；`output.filename` 与 `output.path` 控制文件名与位置

## 参考

- https://webpack.js.org/concepts/
