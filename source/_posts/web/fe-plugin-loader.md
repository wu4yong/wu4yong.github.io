---
title: 前端工程化-Plugin&Loader
date: 2018-02-08 20:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-fe"></div>

# 前端工程化

## plugin 和 loader

- 主要使用 JS 来编写 Plugin 和 loader, 但是也可以通过 WEBAssembly 来编写 Plugin 和 loader

## 一、插件

- 对于 webpack 现有`功能的扩展`，可以`贯穿 Webpack 打包的生命周期`，执行不同的任务比如打包优化，文件压缩, 代码检查。
- webpack 在运行的声明周期中`广播`许多事件， Plugin 可以`监听`这些事件

### 1.1 常见 plugin

1. htmlWebpackPlugin 自动生成 HTML 模板并且引入资源文件
2. CleanWebpackPlugin 打包之前清除之前的文件
3. miniCssExtractPlugin 把 CSS 以外链文件的形式引入 HTML 中
4. copyWebpackPlugin 复制指定文件夹到 dist 目录中
5. speed-measure-webpack-plugin 查看 webpack 的构建费时情况
6. webpack-bundle-analyzer 查看打包文件的体积大小
7. optimize-css-assets-webpack-plugin 压缩 CSS
8. terser-webpack-plugin 压缩 JS(webpack 默认开启)
9. purgecss-webpack-plugin 清除无用的 CSS
10. `EsLint` 很严格的 JS 代码规范

## 二、loader

- loader `本质上就是一个函数`，是一个`转换器`
- webpack 默认支持处理 `js` 和 `json` 文件，其他类型的处理不了，需要借助 `loader` 来转化特定类型的文件，将文件转化为 webpack 能处理的类型。

### 2.1 常见 loader

1. style-loader 把 css 语句写入 style 标签中，然后插入到 html 页面里
2. css-loader 识别 CSS 语法
3. postcss-loader 识别 postcss 语法
4. sass-loader 识别 scss 语法
5. babel-loader 识别 ES6+ 语法并转移成兼容指定浏览器的 JS 代码
6. cache-loader 缓存一些性能开销较大的 loader 的处理结果
7. thread-loader 开启多进程打包优化
8. url-loader 和 file-loader 类似，但是可以将较小的文件转成 base64 的 URI，然后图片可以和其他资源放在一个请求中，减少对服务器的压力
9. vue-loader(vue 加载) 和 vue-template-compiler(vue 模板编译)
10. ts-loader 识别 TS 语法

## 三、插件的工作方式

- 插件通过 `apply` 方法拿到 webpack 的 `compiler`，在编译生命周期的各个钩子上注入自定义任务
- webpack 内部的许多对象继承自 `Tapable` 类，对外暴露 `tap`、`tapAsync`、`tapPromise` 三种注册方法
- 钩子类型决定可用哪种注册方式：同步钩子（如 `compile`）只能用 `tap`；异步钩子（如 `run`）可以用 `tapAsync` 或 `tapPromise`
- `tapPromise` 传入的函数可以是 async 函数，内部用 `await` 等待异步操作完成后再 resolve
- `compiler` 代表运行中的编译器实例，`compilation` 代表一次具体的编译，插件在对应钩子上可以访问这两个对象
- 插件在配置文件的 `plugins` 数组中注册；多数插件支持传入选项做定制，同一个插件可以多次实例化用于不同目的
- 插件记录日志优先用 `compilation.getLogger('PluginName')`，日志进入 Stats 并可被过滤导出；基础设施级日志可用 `compiler.getInfrastructureLogger`
- 通过 `ProgressPlugin` 报告进度时，钩子需要以 `context: true` 注册，再从上下文取 `reportProgress` 输出百分比与说明文字
- 自定义钩子可以用模块级 `WeakMap` 按 compilation 实例存取，其他插件通过插件暴露的静态方法拿到钩子对象后再 `tap`

## 四、loader 的执行规则

- loader 是导出函数的 JavaScript 模块；loader runner 调用这个函数，把上一个 loader 或资源文件的结果传进去
- 第一个 loader 收到的是资源文件内容，编译器期望最后一个 loader 返回 `String` 或 `Buffer`，可选附带 SourceMap
- loader 执行顺序从右到左；每个 loader 还可以定义 `pitch` 方法，pitch 阶段从左到右先执行，pitch 直接返回结果就会跳过后续 loader
- pitch 阶段传入的 `data` 对象在正常执行阶段也能通过 `this.data` 访问，可用来在两个阶段之间共享信息
- 同步 loader 可以直接 `return` 结果，或调用 `this.callback()` 返回多个结果；异步 loader 用 `this.async()` 取回回调函数后再回调，此时函数要返回 `undefined`
- loader 上下文的 `this` 对象由 loader runner 填充，常用属性包括 `this.resourcePath`、`this.context`、`this.rootContext`、`this.addDependency`、`this.addBuildDependency`、`this.cacheable`、`this.async`、`this.mode`、`this.target`、`this.sourceMap` 等
- 默认情况下模块的构建结果标记为可缓存；在 loader 里调用 `this.cacheable(false)` 会让整个模块在后续编译中重新构建，即使输入和依赖都没变
- `this.addDependency(file)` 把文件登记为模块结果的依赖，文件变化时模块重新编译；`this.addContextDependency(directory)` 把整个目录登记为依赖；`this.addMissingDependency(file)` 针对尚未存在、编译过程中可能被创建的文件
- `this.addBuildDependency` 登记 loader 自身读取的配置文件，文件变化时持久化缓存随之失效；这与进入模块结果的普通依赖登记分开
- 默认资源文件会被转成 UTF-8 字符串传入 loader；把 `raw` 标志设为 `true` 时，loader 收到的是原始 `Buffer`
- `this.sourceMap` 标识当前是否需要生成 source map；不需要时不应强行产出，避免额外开销
- loader 报错渠道：`throw` 或异步回调传错误会让当前模块编译失败；`this.emitError()` 只上报错误，不中断模块编译

## 五、解析与工具方法

- `this.resolve` 按 webpack 的解析规则把请求解析成文件路径，解析过程产生的依赖会自动加入当前模块
- `this.loadModule` 解析给定请求、应用已配置的 loader 并回调源码、source map 与模块实例，适合需要参考其他模块源码生成结果的场景
- `this.getResolve` 用来生成带自定义解析选项的解析函数；`this.utils` 上提供 `createHash`、`absolutify`、`contextify` 等工具方法
- loader 上下文的 `this.version` 标识 Loader API 版本，`this.webpack` 为 true 表示当前由 webpack 编译；需要兼容旧版本时可以据此分支处理
- loader 可以通过 `emitFile` 直接产出文件

- `this.clearDependencies()` 移除 loader 结果登记的全部依赖，包括初始依赖和其他 loader 登记的依赖
- `this.emitWarning()` 输出警告；警告是否展示还受 `stats.warnings` 等统计配置影响
- `this.environment` 以布尔标记给出运行时环境支持的 ES 特性，如箭头函数、const/let、解构、动态导入、for-of、globalThis 等
- `this.fs` 指向当前 compilation 的 `inputFileSystem`，可读取输入文件系统
- `this.getDependencies()`、`this.getContextDependencies()`、`this.getMissingDependencies()` 分别返回本次 loader 运行已登记的文件、目录和缺失文件副本
- `this.getLogger(name)` 是 `compilation.getLogger()` 的快捷方式，日志前缀带上 loader 路径与处理中的模块标识
- `this.getOptions(schema)` 提取 loader 选项并可用 schema 校验；webpack 5 起内置，替代了 loader-utils 的 `getOptions`
- `this.importModule` 是轻量子编译器方案，在构建时编译并执行一个请求，返回模块导出或 ESM 命名空间
- `this.loaderIndex` 是当前 loader 在 loader 数组中的下标；`this.loaders` 是全部 loader 的可写数组，pitch 阶段可修改
- `this.resourcePath`、`this.resourceQuery`、`this.resourceFragment` 分别拆分请求中的资源路径、查询串和片段；`this.query` 指向配置的 options 对象或查询字符串
- `this._compilation` 与 `this._compiler` 可直接访问编译器对象，但属于 webpack 专有属性，会降低 loader 可移植性，只作为最后手段使用
- 调用 `this.cacheable(true)` 或不传参数不会在禁用后恢复可缓存性；可缓存 loader 的结果必须在输入和依赖不变时保持确定
- `this.getResolve` 生成的解析函数可合并配置的 `resolve` 选项，数组值用 `"..."` 继承已有配置；解析产生的依赖会自动加入当前模块
- loader 原本也可作为 Babel 转换使用；`this.webpack` 为 true 表示当前由 webpack 编译，可据此判断是否有额外 loader 上下文能力

## 参考

- https://webpack.js.org/api/plugins/
- https://webpack.js.org/api/loaders/
