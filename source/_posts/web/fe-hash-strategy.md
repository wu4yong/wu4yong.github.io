---
title: 前端工程化-Hash策略
date: 2018-02-06 20:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-fe"></div>

# 前端工程化

## hash 策略

> [ contenthash ] 文件级别的 hash

## 一、JS 文件

1. 模块自身的内容: 这是最直接的因素
2. 其依赖模块的内容: 一个最终的 JS Chunk 文件可能包含了多个模块，其中任何一个源模块发生变化，这个 Chunk 文件的 hash 值就会发生变化
3. 依赖关系图（import Graph）：依赖项发生变化，这个 Chunk 文件的 hash 值就会发生变化

## 二、CSS 文件

1. 模块自身的内容
2. @import 的依赖内容
3. PostCSS 等处理器的配置

## 三、静态资源

- 文件自身的二进制内容

## 四、webpack 文件名占位符

- `[fullhash]` 是整个编译的哈希，`[hash]` 是它的旧别名
- `[chunkhash]` 包含 chunk 的全部元素；`[contenthash]` 只按 chunk 里同一种内容类型计算
- `[id]` 是 chunk 或模块 ID，`[name]` 是 chunk 名（未命名时回退到 ID）
- 哈希长度可以用 `[hash:16]` 这种形式截取，也可以用 `output.hashDigestLength` 全局配置
- 资源模块文件名默认使用 `[hash][ext][query][fragment]` 模板
- 占位符写进真实文件名时需要转义，否则会被打包工具替换
- 模块级别也有自己的 `[hash]` 和 `[contenthash]` 占位符，口径与 chunk 级别不同
- `output.chunkFilename` 决定非初始 chunk 的文件名，默认模板是 `[id].js`，未在 `filename` 里写占位符时会从 `filename` 推导
- 编译级哈希随任何模块变动而变化；chunk 级哈希只反映对应 chunk；内容哈希按 CSS、JS 等类型分别计算
- 用 contenthash 代替 chunkhash，可以避免同 chunk 内非 JS 内容变动连带影响 JS 文件名
- 占位符在 `output.filename`、`chunkFilename`、`cssFilename` 等命名模板里通用
- `[fullhash]` 对应整个 compilation；单个 chunk 变动不会让其他 chunk 的 chunkhash 变化
- 摘要编码默认 hex；占位符里可以写成 `[<hash>:<digest>:<length>]` 指定编码和长度
- 资源模块命名之外，入口和 chunk 的文件名都可以套用同一套占位符
- chunkhash 随 chunk 内任一元素变化；contenthash 只受同类内容影响

## 五、缓存策略配合

- 内容哈希文件名是 cache-busting 的基础：内容不变则 URL 不变，内容一变 URL 跟着变
- 哈希命名的静态资源可以配很长的 `max-age`，并加上 `immutable`，刷新页面时不再发条件请求校验
- HTML 入口本身不要长缓存，一般用 `no-cache`，每次复用前回源校验，保证用户拿到新的资源链接
- `no-cache` 不是不缓存：响应可以存，但复用前必须回源校验；`no-store` 才是完全不存储
- 分组与哈希要配合：vendor chunk 内容不变则哈希不变，业务页面各自独立缓存
- 只加长缓存而文件名不带哈希，更新后用户仍会命中旧文件；两者必须配套
- `max-age=N` 表示响应从源站生成时刻起 N 秒内保持新鲜；缓存已存的时间由 `Age` 响应头记录并扣除
- `must-revalidate` 表示资源变陈旧后复用前必须回源校验，通常和 `max-age` 搭配
- 哈希文件长期缓存后，资源更新靠新 URL 生效；旧 URL 的文件在缓存有效期内继续服务老用户
- 动态内容或更新频繁的资源，不适合套用长缓存加 immutable 的组合
- 共享缓存（代理、CDN）和浏览器缓存可通过 `public`、`private`、`s-maxage` 分别控制
- 静态资源放 CDN 时，长 max-age 同时作用于 CDN 节点和浏览器缓存
- 不可缓存的接口和个性化页面不要套用静态资源缓存头
- 缓存键通常包含请求 URL；路径带哈希后，不同版本天然是不同键
- 资源哈希不变的前提是产物内容一致；构建工具或依赖版本变化可能改变产物，进而改变哈希
- 带哈希的资源一旦发布，文件名不应再被覆盖修改；更新就发新文件名
- 缓存策略按资源类型分层：HTML 校验、静态资源长缓存、接口不缓存
- immutable 表示新鲜期内不会更新，浏览器不会发条件请求；过期后规则仍按 max-age 计算
- 长缓存资源的版本切换依赖 HTML 里的链接更新，所以 HTML 不能被长缓存

## 六、校验头与内容哈希的区别

- ETag 是服务器给资源版本打的标识，校验时客户端用 `If-None-Match` 带上，未变化时服务端返回 `304 Not Modified`
- 内容哈希算在文件名里，URL 本身随内容变化；ETag 是响应头层面的版本标识，两者解决不同问题
- 文件名哈希用于长期缓存和 cache-busting；ETag 用于条件请求，未变化时不重发响应体，节省带宽
- 静态资源内容不变时 ETag 也不变，服务端据此可以回 304，而不是重新下发文件
- 弱 ETag 与强 ETag 的区别在于是否要求字节级一致；强校验更适合字节范围请求
- ETag 的生成方式规范没有限定，可以是内容哈希、时间戳或版本号；实践中常用内容摘要
- 内容哈希在构建期算好并写进文件名；ETag 在响应时由服务端计算或读取，发生在不同阶段
- 一次发布里，HTML 引用的带哈希文件名由构建清单记录；服务端按清单渲染对应的资源链接
- 条件请求命中 304 时响应不带 body，浏览器继续用本地缓存
- ETag 解决的是同一 URL 下的版本校验；文件名哈希解决的是不同内容对应不同 URL
- 服务端可以用内容哈希生成 ETag，两者在算法上可以复用
- 内容哈希文件名方案里，HTML 本身仍是条件请求校验的对象
- If-Modified-Since 基于修改时间校验，与 ETag 的摘要校验是两套机制
- 304 状态由服务端在比对通过后返回，替代完整响应
- ETag 可以是强标识也可以是弱标识；弱标识前缀为 `W/`
- 同一 URL 内容更新后，服务端应生成新的 ETag 值
- 缓存命中校验由浏览器或共享缓存发起，服务端只负责比对和回 304
- 内容哈希与 ETag 都基于摘要，但一个落在文件名，一个落在响应头
- ETag 由响应头下发，客户端在后续请求的 `If-None-Match` 里回传
- 摘要比对通过时服务端返回 304，不重传资源本体

## 参考

- https://webpack.js.org/configuration/output/
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag
