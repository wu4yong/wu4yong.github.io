---
title: 前端工程化-持久化缓存
date: 2018-02-09 16:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-fe"></div>

# 前端工程化

## 持久化缓存

> Webpack 5 的持久化缓存是一个内置的、智能的、全局性的缓存系统。它的目标是：在保持构建结果正确性的前提下，最大限度地重用上一次构建的成果，从而极大地提升二次构建（或多次构建）的速度

## 基本配置

```js
// webpack5 持久化缓存配置
cache: {
  type: 'filesystem', // 使用文件系统缓存
  cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack'), // 缓存目录
  buildDependencies: {
    // 当配置文件发生变化时，缓存失效
    config: [__filename],
    // 当这些文件发生变化时，缓存失效
    tsconfig: [path.resolve(__dirname, 'tsconfig.json')],
    postcss: [path.resolve(__dirname, 'postcss.config.js')],
    project: [path.resolve(__dirname, 'project.config.js')]
  }
},
```

## 工作流程

1. 首次构建（冷启动）：
   - 当你第一次运行 Webpack 构建时，缓存是空的。
   - Webpack 会正常执行所有编译步骤：解析模块、运行 loader、分析依赖、优化代码、生成 chunk。
   - 在构建的最后阶段，Webpack 会将这些辛辛苦苦计算出来的中间结果——比如每个模块处理后的代码、模块间的依赖关系、chunk 的构成等——序列化后写入到文件系统中（通常是 node_modules/.cache/webpack 目录下）。

2. 二次构建（热启动）：
   - 你再次运行 Webpack 构建。
   - Webpack 启动后，首先会去检查缓存是否存在。
   - 缓存验证（最智能的部分）：Webpack 会快速检查项目文件。它会对比文件的修改时间戳 (mtime) 和内容哈希 (content hash)，来判断一个文件自上次构建以来是否发生了变化。
   - 缓存命中 (Cache Hit)：如果一个模块和它的所有依赖都没有变化，Webpack 会直接跳过**“读取 -> loader 转换 -> 解析”**这一系列昂贵的步骤，直接从磁盘缓存中读取上次处理好的结果。
   - 缓存未命中 (Cache Miss)：如果一个模块发生了变化，Webpack 只会重新处理这一个发生变化的模块以及受它影响的模块，而其他未变化的模块仍然会使用缓存。

## 和 cache-loader 的对比

{% autogrid data-grid-link-table nofix %}
对比项|cache-loader（Webpack 4）|Webpack 5 持久化缓存（内置）
缓存级别|Loader 层面|编译器层面
详细解释|它只关心某个特定 loader 链的输入和输出。它不知道 Webpack 的全局依赖关系。|它在 Webpack 的核心工作流中，理解整个项目的依赖图，缓存的是模块对象本身，而不仅仅是 loader 的输出字符串。
缓存内容|缓存 loader 转换后的代码字符串和 Source Map。|缓存经过处理后的整个模块对象，包括代码、依赖、AST 等更丰富的数据结构。
智能化程度|较低。它只检查输入文件的内容是否变化。对于 Webpack 配置、Node 版本等全局变化无能为力。|非常高。它能感知到文件变化、依赖关系变化、Webpack 配置变化、node_modules 变化等，并进行智能的、细粒度的缓存失效
性能和效率|有限提升。它只能跳过其后面的 loader，但 Webpack 仍然需要进行模块解析、依赖分析等工作。并且，读写大量小缓存文件本身也有 I/O 开销|质的飞跃。它能跳过从文件读取到依赖分析的整个漫长过程，直接复用已构建好的模块。反序列化缓存对象比重新编译整个模块快得多。
集成方式|手动侵入式。需要手动将其添加到每个需要缓存的 loader 链中。rules: [{ use: ['cache-loader', 'babel-loader', ...] }]|非侵入式。一个顶层配置 cache: { type: 'filesystem' } 即可全局开启，对所有模块和 loader 生效。
{% endautogrid %}

## 缓存类型与目录

- `cache.type` 取 `'memory'` 或 `'filesystem'`；`cache: true` 等价于 `{ type: 'memory' }`
- 缓存默认值与 `mode` 相关：development 默认为 `{ type: 'memory' }`，production 与 none 默认关闭
- `cacheDirectory` 默认是 `node_modules/.cache/webpack`；缓存的最终位置由 `cacheDirectory` 与 `cache.name` 组合得到
- `cache.name` 用来区分多份并存的缓存，不同名称互不覆盖；默认值为 `${config.name}-${config.mode}`
- `cache.version` 标记缓存数据版本，版本不一致时不会复用旧缓存，适合在配置变化到无法兼容旧结果时主动失效
- `maxAge` 控制未使用缓存条目的存活时长，默认值为一个月（5184000000 毫秒）
- 内存缓存的条目存活代数由 `maxGenerations` 控制；文件系统缓存的内存代际由 `maxMemoryGenerations` 控制，默认值随 `mode` 不同而不同

## 构建依赖与失效范围

- `buildDependencies` 列出参与构建的附加代码依赖，webpack 对这些项及其依赖取哈希，变化即让文件系统缓存失效；默认包含 `webpack/lib`
- 官方建议把配置文件本身放进 `buildDependencies.config: [__filename]`，配置及其依赖变更后缓存才会正确失效
- loader、postcss 配置、tsconfig 等影响模块处理结果的文件，都可以登记到 `buildDependencies` 中，避免改了文件却命中旧缓存
- 缓存命中的前提是模块输入与依赖都没有变化；loader 的处理结果必须是确定性的，不能依赖未登记的外部状态或随机取值
- 被 loader 读取但内容不进入模块结果的配置文件，应登记为 build dependency；内容会成为模块结果一部分的文件，用普通 dependency 登记
- 在 CI 之间复用文件系统缓存时，每次构建需要保持相同的绝对路径，因为缓存文件中存储的是绝对路径

## 快照与存储策略

- webpack 通过 snapshot 机制记录文件的 mtime 与内容哈希，用来判断模块自上次构建以来是否变化；未变化的模块才可能命中缓存
- `snapshot.managedPaths` 标记由包管理器管理的路径（如 `node_modules`），这些路径下的文件按托管规则检查；旧版本配置里的 `cache.managedPaths` 已迁移到 snapshot 选项
- `cache.store` 控制数据写入文件系统的时机，`'pack'` 表示编译器空闲时把所有缓存项合并写入单个文件；这是 webpack 5.0.x 起唯一支持的模式
- `compression` 指定缓存文件的压缩类型，默认 `false`（不压缩），可选 `'gzip'`、`'brotli'`、`'zstd'`；压缩类型会影响磁盘占用与反序列化时的解压开销
- `allowCollectingMemory` 控制是否收集反序列化过程中分配的未使用内存，只在 `filesystem` 类型下可用，需要把数据复制到更小的缓冲区，有性能代价
- `idleTimeout` 控制距离空闲多久后执行缓存写入，默认值为 60000 毫秒；`idleTimeoutForInitialStore` 控制首次写入前的等待时长，默认 5000 毫秒
- `cache.profile` 开启后会记录每个缓存项的详细耗时，便于定位缓存未命中或反序列化耗时的环节
- `readonly: true` 配合 `store: 'pack'` 使用时，webpack 只读取缓存而不把新结果写回文件系统
- `hashAlgorithm` 指定哈希生成算法，默认 `md4`
- 手动删除缓存目录，或在 CI 里清空对应缓存路径，即可强制下一次构建从零开始编译

- `cacheLocation` 指定缓存位置，默认 `path.resolve(cacheDirectory, cache.name)`
- `maxGenerations` 控制内存缓存中未使用条目的存活代数：`1` 表示一次编译未使用即移除，`Infinity` 表示永久保留
- `maxMemoryGenerations` 为 `0` 时条目只在序列化到磁盘前留在内存，下次读取从磁盘反序列化；为 `1` 时序列化且一次编译未使用后即从内存清除
- `allowCollectingMemory` 默认值随 `mode` 不同：production 为 `false`，development 为 `true`，none 为 `false`
- `idleTimeoutAfterLargeChanges` 控制检测到较大变更后的缓存写入等待时长，默认 1000 毫秒
- `cacheUnaffected` 与 `memoryCacheUnaffected` 用于缓存未变且只引用未变模块的计算结果，需要同时开启 `experiments.cacheUnaffected`
- `compression` 的 `'zstd'` 选项自 webpack 5.109.0 起可用，要求 Node.js 不低于 22.15.0
- CI 复用缓存时，作业需要运行在相同的绝对路径下；不要在同一作业里执行 `npm ci` 或改动缓存目录，否则缓存文件会被清理
- 不同选项的调用之间不要共享同一份缓存；`cache.version` 变更后旧缓存不会被复用
- 旧版本配置里的 `cache.managedPaths` 已被 schema 接受但忽略，实际生效的是 `snapshot.managedPaths`

## 参考

- https://webpack.js.org/configuration/cache/
