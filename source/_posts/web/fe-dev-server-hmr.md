---
title: 前端工程化-本地服务&热更新
date: 2018-02-10 07:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-fe"></div>

# 前端工程化

## 本地服务器

## webpack-dev-server

- 使用 node 的 express 启动一个本地的 HTTP 服务器，用来展示前端的代码
- 使用这个插件编译后的代码，并不会做输出(不会生成 dist 文件夹)，而是把内容放到内存中供 express 读取

### 热更新

- 应用程序运行过程中，替换、添加、删除模块。客户端会自动更新，而`无需刷新获取整个页面`(热更新过程中应用程序的`状态不会丢失`)
- 原理：客户端和服务端建立了一个 `webSocket` 连接(适用于即时通信)，文件发生变化时，服务端会通过 webSocket 发送更新信息给客户端

### 热更新的流程

1. `webpack-dev-server` 插件，使用 express 启动本地的 HTTP 服务器
2. 本地服务器与客户端建立了一个 `webSocket` 连接
3. `webpack` 监听到文件的变化, 重新编译打包。 本地服务器将新版本的 `hash` 值发送给客户端
4. 客户端通过 `hash` 值向服务端请求更新的文件
5. 服务端返回更新的文件给客户端
6. 客户端将更新的文件替换掉旧的文件

## 本地开发服务器的职责

- dev server 启动一个本地 HTTP 服务用来展示前端代码，编译后的产物保留在内存中，不写入 dist 目录
- webpack-dev-server 的 hot 模式优先用 HMR 更新模块，HMR 无法接受变更时再回退到整页刷新
- Vite dev server 默认监听 localhost，端口为 5173；端口被占用时自动尝试下一个可用端口，`strictPort` 设为 true 则占用即退出
- `server.host` 设为 `0.0.0.0` 或 `true` 可以监听所有地址，包括局域网和公网地址
- `server.proxy` 按路径把接口请求代理到目标服务，支持路径重写、跨域开关等配置项
- `server.cors` 默认开启，允许任意来源；可以设为 false 关闭，或用对象细化 CORS 规则
- `publicDir` 目录下的文件原样作为静态资源提供，dev 下挂在根路径，构建时复制到产物根目录
- `server.open` 开启后启动 dev server 自动打开浏览器，也可以用 `BROWSER` 环境变量指定使用的浏览器
- `server.headers` 可以给 dev server 的响应统一附加自定义响应头
- `server.watch` 把选项传给文件监听器；默认跳过 `.git` 和 `node_modules` 目录
- 开发服务器按需转换源码模块，不像生产构建那样先整体打包再输出
- 开发服务器只服务本地开发，不承担生产环境的静态资源分发职责
- dev server 不生成产物文件，刷新页面时模块由内存中的编译结果提供
- 接口代理只在开发阶段生效，生产环境由部署侧处理跨域和转发

## HMR 的生效范围

- HMR 是模块级 opt-in：只有带 HMR 处理代码的模块才参与热更新；CSS 的 HMR 接口由打包工具内置样式支持实现
- 模块自己没有写处理函数时，更新沿引用链向上冒泡：从改动模块走到导入它的模块，直到找到接受变更的处理函数
- 一个位置足够高的 handler 可以覆盖整个子树；接受更新的模块本身不会被重新执行，它的状态保留
- 以 top.js → middle.js → leaf.js 为例，只有 top 接受 middle：改动 leaf 时 leaf、middle 重新执行，top 不重新执行
- 被接受的模块（top）只调用 accept 回调，自身状态保留；此时它的导入绑定已经指向新版本
- 自接受（self-accept）的模块会在自身改动时被 dispose 后原地重新执行
- `dispose` 钩子在模块卸载前运行，用来清理上一份代码留下的副作用
- 未改动的模块仍在模块缓存里复用，不会被重新执行
- 如果更新一直冒泡到入口都没人接受，HMR 中止，dev server 回退到整页刷新
- HMR 接口挂在模块的 `module.hot` 上，通过 `accept` 声明接受哪些依赖的更新
- 模块接受更新后，新版本代码替换旧代码，未改动部分保持运行

## 更新流程与产物构成

- 应用请求运行时检查更新；运行时异步下载更新并通知应用；应用再请求应用更新；运行时同步应用更新
- 运行时先请求更新 manifest；请求失败表示当前没有可用更新，成功后才对比已加载的 chunk 并下载更新 chunk
- 全部更新 chunk 下载就绪后运行时进入 ready 状态，再执行 apply
- apply 把更新模块标记为失效；每个失效模块需要在自身或父模块上找到 handler，否则继续向上冒泡
- 失效模块先经 dispose 处理并卸载，再更新当前哈希，调用 accept 回调；之后运行时回到 idle 状态
- 运行时通过 status 报告当前阶段，自定义 HMR 客户端据此判断何时可以请求下一次更新
- 除了正常资源，编译器还要发出一份"更新"：一个 manifest（JSON）加一个或多个更新 chunk（JS）
- manifest 列出本次更新涉及的 chunk id、移除的 chunk 和移除的模块；更新 chunk 里是改动模块的新代码
- 更新文件按命名规则放在产物旁边：manifest 是 `[runtime].[fullhash].hot-update.json`，更新 chunk 是 `[id].[fullhash].hot-update.js`
- 文件名里的哈希是被更新版本的哈希，客户端拿自己当前运行版本去请求对应更新；版本太老匹配不上就回退整页刷新
- 更新 chunk 只包含改动模块的新代码，未改动模块不重复下发
- dev server 下这些更新文件和其他产物一样留在内存里，从内存提供服务
- watching 编译器在多次构建之间保持模块 ID、chunk ID 一致；需要跨构建持久化时可以写到 records 文件
- HMR 保留应用状态，这是相对整页刷新的主要收益；只更新改动部分，节省开发时间
- CSS 改动到达后直接替换旧样式，不需要整页刷新

## Vite 的 HMR 配置

- `server.hmr` 可以关闭或配置 HMR 连接；类型为 boolean 或对象，对象里可设置 protocol、host、port、path、timeout、overlay 等
- `server.hmr.overlay` 设为 false 可以关闭服务端错误浮层
- 默认配置下前置反向代理需要支持 WebSocket；HMR 客户端连不上时会回退到直连 Vite HMR server
- `clientPort` 只在客户端侧覆盖端口，用于 WebSocket 服务端口与页面访问端口不一致的场景
- `server.hmr.server` 指定后，HMR 连接请求走提供的 server；中间件模式下可以借助已有服务处理 HMR
- HMR WebSocket 与 HTTP server 默认共用地址；代理只转发 HTTP 不转发 WebSocket 时需要额外配置，代理项里 `ws: true` 用于转发 WebSocket
- 中间件模式通过 `server.middlewareMode` 开启，此时 Vite 挂进已有的服务框架处理中间件
- HMR 连接地址与 HTTP 地址不一致时，用 hmr 的 host、port、protocol 单独指定
- 关闭 HMR 可以把 `server.hmr` 设为 false
- `server.hmr.timeout` 用于设置 HMR 连接的超时时间
- 文件监听默认跳过 `node_modules`；要监听包里的文件，需要在 `server.watch.ignored` 里用取反 glob 单独声明

## 参考

- https://webpack.js.org/concepts/hot-module-replacement/
- https://vitejs.dev/config/server-options.html
