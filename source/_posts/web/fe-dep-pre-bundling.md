---
title: 前端工程化-依赖预构建
date: 2018-02-08 02:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-fe"></div>

# 前端工程化

## 依赖预构建

## 一、依赖预构建原因

### 1.1 CommonJS 和 UMD 兼容性

- 将以 CommonJS 或 UMD 形式提供的依赖项转换为 ES 模块

### 1.2 性能

- 将那些具有许多内部模块的 ESM 依赖项转换为单个模块。例如: lodash-es 有超过 600 个内置模块，如果不处理，浏览器会同时发出 600 多个 HTTP 请求

## 二、缓存

### 2.1 文件系统缓存

- 将预构建的依赖项缓存到 `node_modules/.vite` 目录下

### 2.2 浏览器储存

- 已预构建的依赖请求使用 HTTP 头 `max-age=31536000, immutable` 进行强缓存

## 预构建的判定与发现

- 依赖只有写在 package.json 的 dependencies 里才会被纳入预构建检查；不打算在源码里直接 import 的包应放到 devDependencies
- 默认 Vite 爬取项目里的 `.html` 文件，找出 bare import（从 node_modules 解析的导入）作为预构建入口
- 也可以用 `optimizeDeps.entries` 指定自定义入口，值为 tinyglobby 模式或相对项目根目录的模式数组，覆盖默认的入口推断
- 入口没有合法 ES module 导出（按 CommonJS 处理），或入口里有指向其他模块/依赖的 ES import（内部模块很多），满足其一即会被预构建
- CommonJS/UMD 依赖被转成 ES 模块后，浏览器才能作为原生 ES 模块导入；具名导入在导出动态赋值的情况下也能正常工作
- 内部模块很多的 ESM 依赖被合并成单个模块，减少浏览器同时发出的请求数
- 服务启动后遇到缓存里没有的新依赖导入，Vite 会重新跑一次依赖打包，必要时刷新页面
- 预构建只在开发模式生效；生产构建走打包流程，依赖处理方式不同
- 预构建不处理项目源码，源码改动走 dev server 的模块转换链路

## 缓存失效与强制重建

- 预构建结果缓存在文件系统目录；缓存是否需要重建，依据 package.json 的 dependencies、包管理器 lockfile、vite.config.js 等来源判断
- 上述任一发生变化才会重跑预构建；没变化时直接读缓存
- 强制重建可以用 dev server 的 `--force` 命令行选项，或设置 `optimizeDeps.force: true`，也可以手动删除缓存目录
- 检测到不是从 node_modules 解析的链接包（monorepo 里的 linked dep），Vite 按源码处理，不打包它，改为分析它的依赖列表
- 链接包如果不是 ESM 导出，可以加进 `optimizeDeps.include` 强制纳入预构建
- 链接包改动后，需要带 `--force` 重启 dev server，改动才会在预构建产物里生效
- 缓存损坏（改了依赖版本但产物不对）时，删除缓存目录或加 `--force` 即可重新生成

## 自定义预构建范围

- `optimizeDeps.include` 强制纳入指定依赖，适合链接包、插件转换产生的导入、以及嵌套了 CommonJS 的 ESM 依赖
- `optimizeDeps.exclude` 排除指定依赖；体积小、本身已是合法 ESM 的包可以排除，让浏览器直接加载
- CommonJS 依赖不建议排除在优化外；被排除的 ESM 依赖若嵌套 CommonJS，那个 CJS 依赖要写进 include
- `optimizeDeps.noDiscovery` 设为 true 后关闭自动发现，只优化 include 里列出的依赖；只含 CJS 的依赖必须显式列在 include 中
- 深层导入很多的库，可以用尾部 glob 模式在 include 里一次性预构建，避免每用到一个新深层导入就重新预构建
- 插件转换生成的导入在初次扫描时发现不了，服务启动后才触发重新打包；用 include 提前声明可以避免启动后重打包
- 排除依赖前先确认它是合法 ESM；CommonJS 排除后浏览器无法直接加载
- `needsInterop` 一般不需要手动配置，Vite 会自动检测哪些依赖需要 interop；检测不准时控制台会给出提示，再把包名加进对应数组

## 常见场景

- 新增一个依赖后首次请求对应页面，可能触发一次预构建并刷新页面，属于正常流程
- 预构建把多内部模块的 ESM 依赖合并成单模块，目的是减少浏览器并发请求，而不是压缩代码体积
- 第三方库版本不变时，预构建产物可以直接复用缓存；业务源码的改动不影响依赖缓存
- 预构建产物与源码模块分开服务：依赖走优化后的单模块，源码按原生 ESM 逐个转换
- 手动调整 include/exclude 后，建议重启 dev server 让新配置生效
- 预构建阶段不做 tree-shaking，未使用的导出是否剔除由生产打包阶段处理

## 预构建与浏览器缓存

- 已预构建的依赖请求在浏览器侧走强缓存，避免每次开发启动都重新拉取
- 依赖产物内容稳定，缓存有效期长；业务源码不在这个缓存范围里
- 依赖版本升级后，产物内容变化，引用随之变化，浏览器重新拉取
- 缓存头由 dev server 对优化后的依赖响应设置，与生产构建的静态资源缓存策略是两套链路

## 优化器的边界

- 预构建只优化第三方依赖，不合并项目内部的页面模块
- 项目源码在 dev server 下按原生 ESM 服务，按需转换单个模块，不经过依赖打包流程
- 依赖的 CommonJS/UMD 兼容性处理只在开发阶段由依赖优化器完成；生产构建使用打包工具对应的 CommonJS 处理插件
- 链接包默认按源码对待，需要导出为 ESM 才能被浏览器直接加载
- 自动发现依据源码里的 bare import；动态拼接、字符串拼接的导入可能扫描不到
- 配置 include/exclude/entries 后，改动需要重启 dev server 生效

## 预构建的常见疑问

- 预构建主要解决两个问题：非 ESM 依赖的兼容性、多内部模块导致的并发请求过多
- 预构建不是压缩产物，产物体积优化发生在生产打包阶段
- 遇到依赖相关的报错（默认导出、命名导入取不到），先判断是否需要 interop 或调整 include
- 锁文件、package.json 依赖、vite 配置任一变化都会使缓存失效，触发下次启动重新预构建
- `--force` 忽略已有缓存重新打包，等同于手动清空缓存目录
- 优化器在开发模式下运行；生产环境的产物由打包流程统一生成

## 参考

- https://vitejs.dev/guide/dep-pre-bundling.html
- https://cn.vitejs.dev/config/dep-optimization-options
