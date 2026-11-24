---
title: 前端工程化-打包工具专有名词
date: 2018-02-14 07:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-fe"></div>

# 前端工程化

## 打包工具专有名词

## Bundle

打包工具将多个模块及其依赖组合在一起生成的文件，通常是最终输出的文件或一组文件。

## Chunk

代码块，通常是代码分割后的产物。一个 bundle 可以由多个 chunk 组成

## Vendor

通常是指包含第三方库或依赖的代码块或包

## Module 与依赖图

- Module 是项目里被 `import`/`require` 声明引用的文件，打包工具以模块为单位读取、翻译和记录引用关系
- 每个模块对外暴露的导出和内部依赖的导入，都在编译期解析清楚
- 模块之间的引用关系构成依赖图：入口是起点，被引用的模块沿图展开
- 依赖图里只包含实际被引用的模块，没被任何入口链路用到的文件不会进入产物
- 打包工具从入口开始遍历依赖图，递归找到全部模块，再按配置组织输出
- 模块可以是 JS 文件，也可以是 CSS、图片、字体等资源；后者通过 loader 或资源模块机制纳入依赖图
- 编译期确定引用关系后，运行时代码只需要按记录加载对应的 chunk
- 同一个模块被多个地方引用，依赖图里只保留一份，产物中也只打包一次
- 模块解析失败（找不到文件、别名对不上）会在编译阶段报错，而不是留到运行期
- 模块 ID、chunk ID 在多次构建之间需要保持稳定，HMR 和缓存更新都依赖这个一致性

## Runtime 运行时代码

- 打包产物里除了业务模块，还有一小段引导代码，负责模块缓存、按需加载 chunk 和解析模块标识
- 这段引导代码称为 runtime；在多 chunk 场景下，它记录 chunk id 与产物文件名的映射，运行时据此发起请求
- 文件名模板里使用 `[name]`、`[chunkhash]` 这类占位符时，chunk id 到文件名的映射需要写进产物的 runtime 里
- 把 runtime 单独拆成一个 chunk（如 `runtimeChunk: 'single'`），可以避免业务 chunk 变动时连带影响包含映射关系的入口 bundle
- 应用入口对应的是 entry chunk；动态导入触发的是异步 chunk，异步 chunk 初始不加载，等用到时再请求
- chunk 是打包工具内部的代码组织单位，bundle 是最终输出的文件；一个 bundle 可以由多个 chunk 组成
- 非初始 chunk 的文件名由 `chunkFilename` 决定，默认模板是 `[id].js`
- 开发服务器模式下编译结果保留在内存，runtime 也在内存产物里，不写入磁盘
- runtime 跟踪模块的父子关系，更新模块时沿引用链向上找接受更新的处理函数

## Vendor 与缓存分组

- Vendor 通常指第三方库或框架依赖组成的代码块，对应打包工具从 `node_modules` 提取出来的公共 chunk
- 业务代码频繁变动，第三方依赖相对稳定；把它们分成不同 chunk 后，发布新版本时浏览器可以继续复用缓存的 vendor 文件
- 公共依赖被两个以上 chunk 复用时，可以通过 SplitChunksPlugin 提取到单独的 chunk，避免在多个 bundle 里重复打包
- 提取出的 vendor chunk 在构建产物里按依赖路径命名（如 `vendors-node_modules_lodash_lodash_js`）
- 分组时除了第三方库，也可以把体积大、更新频率低的工具库单独成块；更新频繁的业务页面各自独立缓存
- 静态资源（图片、字体等）作为资源模块进入依赖图，输出为独立文件，文件名由资源模块命名规则决定
- chunk 分组要配合文件名里的内容哈希：内容不变则哈希不变，缓存才命得中
- 入口 chunk 里如果混进了公共依赖，去掉重复需要靠提取公共 chunk，而不是手写多入口复制
- 分组过多会增加并发请求数，分组过粗又会降低缓存命中率，分组粒度需要结合体积和更新频率权衡

## 常见易混概念

- Bundle 是输出到磁盘的文件，Chunk 是打包工具内部组织代码的单位，二者不是一一对应
- Entry chunk 随页面首次加载，async chunk 在动态导入时按需请求
- Module 是单个源文件级别的单位，Chunk 是若干 Module 打包后的单位
- Vendor chunk 特指第三方依赖，common chunk 则是多个业务 chunk 共用的公共部分，两者可以重叠
- Runtime 负责加载和缓存模块，manifest（更新清单）记录本次更新涉及哪些 chunk 和模块，属于 HMR 机制里的概念
- Asset 指图片、字体这类独立输出的静态资源，不属于 JS chunk
- 产物文件名里的占位符：`[id]` 是 chunk 或模块 ID，`[name]` 是 chunk 名，`[chunkhash]` 是 chunk 内容哈希，`[contenthash]` 是按内容类型计算的哈希

## 打包流程里的对应位置

- Entry 决定依赖图从哪个模块开始；Output 决定产物写到哪里、叫什么名字
- Loader 在模块翻译阶段工作；Plugin 挂在编译生命周期上介入
- Mode 切换内置优化集合；Browser Compatibility 决定产物兼容的目标环境
- 打包工具先解析依赖图，再翻译模块，最后组装 chunk 并输出文件
- 每个模块经过 loader 处理后，产物里保留的是翻译后的代码和引用关系
- 打包工具的产物类型包括 JS chunk、CSS 文件、资源文件和 runtime

## 命名占位符补充

- `[fullhash]` 是整个编译的哈希，`[hash]` 是它的旧别名
- `[chunkhash]` 包含 chunk 的全部元素；`[contenthash]` 只按该 chunk 里同一种内容类型计算
- 模块级别也有自己的 `[hash]` 和 `[contenthash]` 占位符
- 哈希长度可以用 `[hash:16]` 这种形式截取，也可以用 `output.hashDigestLength` 全局配置
- 资源模块文件名默认用 `[hash][ext][query][fragment]` 模板
- 占位符写进真实文件名时需要转义，否则会被打包工具替换

## 分组与缓存的补充

- 公共依赖只有达到 webpack 设定的尺寸阈值，才会被 SplitChunksPlugin 提取成独立 chunk
- vendor 分组的目标是稳定缓存：第三方库版本不变，文件名哈希就不变
- 业务 chunk 单独打包后，某个页面改动只影响自己的 chunk，其他页面继续走缓存
- 提取公共 chunk 后，入口 bundle 里不再重复打包同一份依赖
- 资源文件的哈希来自文件二进制内容，与 JS/CSS chunk 的哈希计算口径不同
- 分组方案要和文件名哈希、缓存头配合使用，单独改分组或单独改缓存头都达不到预期效果
- 异步 chunk 通过动态导入产生，文件名由 chunkFilename 规则决定
- 公共 chunk 可以被多个 entry chunk 共享，运行时只加载一次
- 模块被拆分后，加载顺序由 runtime 按依赖关系保证

## 参考

- https://webpack.js.org/concepts/
- https://webpack.js.org/guides/code-splitting/
- https://webpack.js.org/configuration/output/
