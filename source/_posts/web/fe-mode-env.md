---
title: 前端工程化-模式&环境变量
date: 2018-02-10 13:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-fe"></div>

# 前端工程化

## 模式和环境变量

- 可以通过指定不同的模式，来查看本地开发和生产环境生成的代码有哪些差异(打包时分别指定两种不同的模式，便能看到两种模式下的真实目录有什么差别)

## 一、模式(webpack 中的概念)

- 供 `mode` 配置选项，告知 `webpack` 使用`相应模式的内置优化`，默认值为 production，另外还有 development、none
- 如果 webpack 配置文件的导出内容为函数的话，函数的第二个参数的 mode 属性为　`模式`，便可以根据不同的模式来加载不同的 webpack `配置文件`
- 如果 mode 未通过配置或 CLI 赋值，CLI 将使用可能有效的 `NODE_ENV` 值作为 mode

### 1.1 模式的区别

1. development 开发模式：打包更加`快速`，省了代码优化步骤，不会删除未使用的变量或者文件，不会压缩文件，生成良好的source map, 有利于`开发中的调试`
2. production 生产模式: 打包比较慢，会删除未使用的变量或者文件，会开启 `tree-shaking` 和 `压缩代码`，减少体积，提升性能，适合发布到`生产环境`。
3. none: `不会应用任何默认优化`，输出的代码将保持原样，适用于`自定义`打包配置的特殊需求。

## 二、环境变量(node 中的概念)

- `process.env.NODE_ENV` 是在 `package.json` 的 `scripts` 命令中 通过 `cross-env` 插件来注入的, 也就是说 NODE_ENV 并不是 node 自带的，而是由用户显式定义的。
- 因为 NODE_ENV 属性是被注入到 `node` 的 process.env 中，所以只能在`工程文件中`使用该变量，WEB`业务代码`中是无法使用的。需要借用 `DefinePlugin` 插件将它注入到浏览器的全局变量中
- Webpack 项目不会自动根据`当前的环境变量`来加载`对应的环境变量文件`， 需要使用 `dotenv` 插件读取对应文件并将变量注入到 `process.env` 中，再使用 `DefinePlugin` 插件将变量注入到浏览器的全局变量中

## mode 影响的默认项

- mode 本身不直接做优化，它挑选其他选项的默认值；各选项仍可以显式覆盖
- development 下：devtool 默认 eval，模块和 chunk 用命名 ID，不压缩，不开启 sideEffects、usedExports 等生产优化
- production 下：开启压缩、确定 mangled 名，开启 sideEffects、usedExports、innerGraph、mangleExports、concatenateModules 等优化
- none 不应用默认优化；注意 none 只是退出这些默认项，不等于关闭所有优化
- mode 默认 production；配置和 CLI 都没给时，CLI 取有效的 NODE_ENV 作为 mode
- 配置文件导出为函数时，第二个参数 argv 的 mode 属性就是当前模式，可据此切换配置
- development 保留较好的调试信息，production 偏向体积和运行性能
- development 下模块、chunk 使用可读的命名 ID；production 下使用确定性的短 ID
- production 下默认开启 minimize；development 和 none 下不压缩产物
- 与模式相关的 splitChunks 阈值在 production 下更严格，development 下相对宽松
- development 下 devtool 默认为 eval；production 和 none 下 devtool 为 false
- `output.pathinfo` 在 development 为 true，production、none 为 false
- `optimization.nodeEnv` 在 development 为 development，production 为 production，none 为 false
- `optimization.emitOnErrors` 在 development、none 为 true，production 为 false
- `performance.hints` 在 development 关闭，production 给 warning，none 关闭
- production 下启用确定性的 mangled 命名，并开启依赖使用标记、模块拼接等内置优化
- mode 只挑选内置优化的默认组合，不影响与模式无关的常规选项
- none 模式输出保持原样，适用于自定义打包配置的特殊需求
- production 下默认开启 minimize，产物经过压缩；development 保留可读代码便于调试
- 各模式默认值汇总在 webpack mode 文档，未列出的选项保持自身常规默认

## NODE_ENV 与 mode 是两个概念

- NODE_ENV 是注入 node 进程环境变量的值；mode 是打包工具的模式概念，二者不等同
- webpack 的 DefinePlugin 把 `process.env.NODE_ENV` 写进产物；业务代码默认读不到 process.env
- Vite 命令与二者的关系：`vite build` 的 NODE_ENV 和 mode 都是 production；`--mode` 只改 mode，不改 NODE_ENV，反之亦然
- `import.meta.env.PROD`、`DEV` 由 NODE_ENV 决定；`import.meta.env.MODE` 由 mode 决定
- NODE_ENV 可以在命令行或 .env 文件里设置；在 `.env.[mode]` 里设置时，mode 可以反过来控制它
- 模式与环境变量分开判断，避免把"开发模式"和"NODE_ENV=development"当成一回事
- `vite build --mode development` 时 NODE_ENV 仍是 production；`NODE_ENV=development vite build` 时 mode 仍是 production
- 只有 NODE_ENV 和 mode 同时为 development，`import.meta.env.DEV` 才为 true、`PROD` 为 false
- NODE_ENV 不是 node 内置自动设置的，需要由命令行、cross-env 或 .env 文件显式注入
- webpack 通过 DefinePlugin 在编译期把常量替换进产物，运行期没有 process.env 对象
- 业务代码要读环境变量，需借助 DefinePlugin（webpack）或 `import.meta.env`（Vite）注入到浏览器全局
- Vite 配置里读取 `process.env.NODE_ENV`，可以在配置求值早期拿到命令行传入的值
- DefinePlugin 替换的是编译期常量，业务代码里不能读取未声明的全局变量

## Vite 环境变量

- Vite 把环境变量挂在 `import.meta.env` 上，构建期静态替换；内置 MODE、BASE_URL、PROD、DEV、SSR
- 只有 `VITE_` 前缀的变量才暴露给客户端代码；其他变量留在 Node 侧，不会进 bundle
- `.env` 文件加载顺序：`.env`、`.env.local`、`.env.[mode]`、`.env.[mode].local`；mode 专属文件优先级高于通用文件
- 已存在于执行环境的变量优先级最高，不会被 .env 文件覆盖
- 注入客户端的变量都是字符串；数字、布尔要在代码里自行转换
- `envPrefix` 可以自定义暴露给客户端的变量前缀
- HTML 里用 `%ENV_NAME%` 语法替换环境变量；不存在的变量在 HTML 里保持原样不替换
- 改动 .env 文件后需要重启 dev server 才生效
- `.env.local` 和 `.env.[mode].local` 是本地专用文件，应被 git 忽略
- `.env.[mode]` 只在指定 mode 下加载；切换 mode 后对应的环境变量随之变化
- 变量注入客户端后会被打包进 bundle，`VITE_` 前缀的变量不要放敏感信息
- TypeScript 下 `import.meta.env` 的类型声明来自 `vite/client.d.ts`，自定义变量可在 `ImportMetaEnv` 里补充
- dev 命令默认 development mode，build 命令默认 production mode
- `vite build --mode staging` 会加载 `.env.staging`，mode 记为 staging
- 已存在的 shell 环境变量优先级高于 .env 文件；命令行临时变量不会被文件覆盖
- dotenv-expand 支持在变量里展开引用其他变量
- 环境变量在 Vite 启动时加载一次，运行期修改 .env 文件不生效
- `BASE_URL` 由 base 配置决定，对应部署的公共路径
- SSR 场景下 `import.meta.env.SSR` 为 true
- 敏感信息即使不带 `VITE_` 前缀，也要注意不要通过其他方式写进客户端产物
- 环境变量文件放在项目根目录，`envDir` 配置可改查找目录
- `.env.[mode].local` 优先级高于 `.env.[mode]`
- 变量值以字符串形式进入客户端，布尔、数字需要显式转换

## 参考

- https://webpack.js.org/configuration/mode/
- https://vitejs.dev/guide/env-and-mode.html
