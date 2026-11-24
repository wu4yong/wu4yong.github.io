---
title: 前端工程化-Rolldown
date: 2018-02-07 08:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-fe"></div>

# 前端工程化

## Rolldown

- Rolldown 是一个现代化、高性能的 JavaScript 打包工具，由 Rust 编写。它被设计为 Rollup 的替代品，旨在保持与现有生态系统兼容的同时，显著提升性能

## 三个原则

1. 速度：利用 Rust 的高性能进行构建
2. 兼容性：能够与现有的 Rollup 插件一起工作
3. 优化：拥有比 esbuild 和 Rollup 更先进的特性

## 为什么要有 Rolldown

1. 解决开发环境和生产环境的构建结果不一致问题
2. Rolldown 提供了 Vite 中需要的一些重要功能，但不太可能被 esbuild 和 Rollup 实现(底层工具切换为自家的，方便后续的定制)。

## 定位与生态兼容

- Rolldown 是用 Rust 编写的 JavaScript/TypeScript 打包工具，对外提供 Rollup 兼容的 API 与插件接口，能力范围对标 esbuild
- 三大原则：速度（Rust 高性能实现）、兼容性（与既有 Rollup 插件协作）、优化（提供超出 esbuild 与 Rollup 实现范围的特性）
- 插件钩子与 Rollup 对齐，官网列出的完整支持钩子包括 `options`、`buildStart`、`buildEnd`、`renderStart`、`renderError`、`generateBundle`、`writeBundle`、`closeBundle`、`banner`、`footer`、`intro`、`outro`、`augmentChunkHash`、`closeWatcher`、`watchChange`、`renderChunk` 等
- 内置了转换、`define`、`inject`、压缩等能力，目标是把 esbuild 与 Rollup 两类底层工具的职责合并到同一个打包器里
- 官网基准场景为打包 1.9 万个模块（1 万个 React JSX 组件加 9 千个 iconify JS 文件，含压缩与 source map），用于展示不同工具在该场景下的构建耗时差异
- 作为 Rollup 的替代者，Rolldown 在保持现有插件生态兼容的前提下追求显著的性能提升

## 迁移到 Rolldown 的动因

- 统一工具链：Vite 此前用 esbuild 做依赖预构建、Rollup 做生产构建，Rolldown 目标是把这两个职责合并到同一个高性能打包器中，降低整体复杂度
- 性能：基于 Rust 的实现相比 JavaScript 编写的打包器有明显的性能空间；具体收益随项目规模和复杂度变化，早期测试相对 Rollup 已有可观的提速
- 额外能力：Rolldown 提供了 Rollup 与 esbuild 都未实现的特性，例如更细粒度的 chunk 拆分控制、内置 HMR 以及 Module Federation
- 面向 Vite 设计：Rolldown 从一开始就考虑了 Vite 所需的功能，底层工具切换为自家实现后，后续定制不再受限于外部工具的路线

## 插件钩子与模块类型

- `manualChunks` 虽然兼容 Rollup 写法，但在 Rolldown 中已标记为过时；更细粒度的拆分通过 `advancedChunks` 配置分组（`groups` 里写 `name` 与 `test`），思路接近 webpack 的 `splitChunk`
- 为减少 Rust 与 JavaScript 运行时之间的通信开销，Rolldown 引入钩子过滤特性：插件可以声明匹配模式，决定钩子在哪些文件上才被调用；未使用该特性的插件可用 `withFilter` 包装器自行补一层过滤
- Rolldown 支持非 JavaScript 模块，默认按扩展名推断模块类型；在 `load` 或 `transform` 钩子里把其他类型内容转成 JS 时，返回值需要补 `moduleType: 'js'`
- 内置的别名、解析等内部插件已用 Rust 实现，原生插件默认开启（默认值 `'v1'`）；遇到问题可在配置里把 `experimental.enableNativePlugin` 调成 `'resolver'` 或 `false` 作为临时绕过
- `@vitejs/plugin-react` v5.0.0+ 使用 Oxc 的 React refresh 转换；未使用 Babel 插件（含 React compiler）时，整个转换可交给 Oxc 完成
- 旧插件若使用 `transformWithEsbuild`，在 Vite 不再直接依赖 esbuild 后需要把 esbuild 装为可选 peer 依赖；官方建议迁移到基于 Oxc 的 `transformWithOxc`

## rolldown-vite 的试用与版本策略

- 基于 Rolldown 驱动的 Vite 目前以独立包 `rolldown-vite` 提供；在 `package.json` 里把 `vite` 别名指向 `rolldown-vite`，可以作为无缝替换试用
- 官方文档说明 `rolldown-vite` 被视为实验性版本，建议固定具体版本号，避免跟随 `@latest` 遇到意料之外的破坏性变更
- 对把 Vite 作为 peer 依赖的元框架，需要按包管理器覆盖 `vite`：npm/Bun 写 `overrides`，Yarn 写 `resolutions`，pnpm 写 `pnpm.overrides`，覆盖后重装依赖即可
- 版本策略上，`rolldown-vite` 的主版本和次版本与普通 Vite 包对齐；补丁版本两者不同步，且只维护最新的次版本，老版本不回补安全或缺陷修复
- 检测当前是否运行在 `rolldown-vite` 上：插件钩子读 `this.meta.rolldownVersion`，或从 `vite` 包导出的 `rolldownVersion` 判断；多数情况下插件应保持两边行为一致，不需要条件分支
- 试用中遇到的问题应反馈到 `vitejs/rolldown-vite` 仓库而不是主 Vite 仓库；报告时通常需要附带最小复现、操作系统、Node 版本、包管理器和错误日志

## 与 Vite 8 的对应关系

- Vite 8 使用 Rolldown 与 Oxc 工具链替代之前的 esbuild 与 Rollup；`rolldown-vite` 实现的是接入 Rolldown 的 Vite 7，作为迁移到 Vite 8 的中间技术预览版本
- 内部职责替换对应为：构建打包与依赖优化由 Rolldown 承担，CommonJS 互操作由 Rolldown 处理；语法降级由 Oxc 承担；CSS 压缩默认 Lightning CSS；JS 压缩默认 Oxc Minifier；配置文件本身的打包也由 Rolldown 处理
- 从 `rolldown-vite` 迁回或升级到 Vite 8 时，撤销 `package.json` 里的别名改动并把 `vite` 升到 `^8.0.0` 即可
- `rolldown-vite` 是收集反馈、稳定 Rolldown 集成的临时方案，相关功能未来会合回主 Vite 仓库
- Full Bundle Mode 计划让开发与生产都使用打包产物，兼顾大应用启动速度、两端行为一致、刷新网络开销下降，并在 ESM 输出之上保持高效 HMR；初期以可选特性提供，稳定后再考虑默认

- 试用收益：大项目构建明显更快；反馈会影响 Vite 未来的打包形态；提前为官方集成做准备
- 新项目可用 `create-vite` 初始化，创建过程中会询问是否使用 `rolldown-vite`
- 已知限制：部分特性仍在实现中，也存在少量有意的行为差异；完整清单以官方 GitHub PR 为准
- 传入未知或无效选项时 Rolldown 会输出校验警告；若选项不是用户自己传入的，需要由所用框架修复
- 默认配置面向平滑过渡；切换到更快的 Rust 原生内部插件与其他定制可以拿到进一步性能收益
- 别名、解析等内部插件已转为 Rust 实现；原生插件默认开启（`'v1'`），异常时可把 `experimental.enableNativePlugin` 调成 `'resolver'` 或 `false` 绕过，该选项未来会移除
- `@vitejs/plugin-react` v5.0.0+ 走 Oxc 的 React refresh 转换；未使用 Babel 插件（含 React compiler）时整体转换交给 Oxc，更新插件即可提升性能
- 未使用 SWC 插件与自定义 SWC 选项的 `@vitejs/plugin-react-swc` 用户，可切换到 `@vitejs/plugin-react` 使用 Oxc；`@vitejs/plugin-react-oxc` 已废弃，实现并入 `@vitejs/plugin-react`
- 检测运行环境：插件钩子读 `this.meta.rolldownVersion`；自 Vite 7.0.0 起 `this.meta` 在所有钩子可用；也可从 `vite` 包导出的 `rolldownVersion` 判断
- 多数情况下插件应保持两边行为一致，不需要条件分支；确需区分时再用上述两种方式检测
- `transformWithEsbuild` 在 Vite 不再直连 esbuild 后属于可选 peer 依赖；插件需要把 esbuild 加入自身依赖，或由用户手动安装；推荐迁移到 `transformWithOxc`
- esbuild 选项有兼容层转换为对应的 Oxc 或 Rolldown 选项，简单 esbuild 插件多数可用；该兼容层未来会移除，转换后的选项可在 `configResolved` 钩子里读取
- 钩子过滤特性让插件声明匹配模式，决定钩子在哪些文件上触发，减少 Rust 与 JS 运行时之间的通信开销；未使用该特性的插件可用 `withFilter` 包装器补一层过滤
- 在 `load` 或 `transform` 钩子里把其他类型内容转成 JS 时，返回值需要补 `moduleType: 'js'`；模块类型默认按扩展名推断
- 问题反馈提交到 `vitejs/rolldown-vite` 仓库而不是主 Vite 仓库；报告附最小复现、操作系统、Node 版本、包管理器与错误日志，实时讨论可加入 Rolldown Discord
- 版本策略：主版本、次版本与普通 Vite 对齐，保证同一 Vite 次版本的功能在对应 `rolldown-vite` 次版本中包含；补丁版本不同步，且只维护最新次版本，老版本不回补安全或缺陷修复
- Vite 8 内部替换：构建打包与依赖优化由 Rolldown 承担，CommonJS 互操作由 Rolldown 处理；语法降级由 Oxc 承担；CSS 压缩默认 Lightning CSS；JS 压缩默认 Oxc Minifier；配置文件打包也由 Rolldown 处理
- 从 `rolldown-vite` 升级到 Vite 8 时，撤销别名改动并把 `vite` 升到 `^8.0.0` 即可
- Full Bundle Mode 动因之一是开发期未打包 ESM 与生产打包产物运行行为不一致，问题只在生产暴露时更难调试
- 动因之二是未打包模式下每个模块单独请求，开发服务器启动与页面刷新要处理大量网络请求；代理网络场景下刷新更慢、体验下降
- Full Bundle Mode 目标：大应用快速启动、两端行为一致、刷新网络开销下降、在 ESM 输出之上保持高效 HMR；初期作为可选特性，收集反馈稳定后再考虑默认
- 官网基准场景为打包 1.9 万个模块（1 万个 React JSX 组件加 9 千个 iconify JS 文件，含压缩与 source map），用于展示不同工具的构建耗时差异
- 作为 Rollup 的替代者，Rolldown 在保持现有插件生态兼容的前提下追求显著性能提升
- 统一动因：Vite 此前用 esbuild 做依赖预构建、Rollup 做生产构建，Rolldown 把两个职责合并到同一个高性能打包器，降低复杂度
- 性能动因：Rust 实现相比 JS 打包器有性能空间；具体收益随项目规模与复杂度变化，早期测试相对 Rollup 已有可观提速
- 额外能力：更细粒度 chunk 拆分控制、内置 HMR、Module Federation 等 Rollup 与 esbuild 未提供的特性
- 面向 Vite 设计：从一开始就考虑 Vite 所需功能，底层工具切换为自家实现后，后续定制不受限于外部工具路线
- 内置转换、`define`、`inject`、压缩等能力，目标是合并 esbuild 与 Rollup 两类工具的职责

## 参考

- https://rolldown.rs/
- https://vite.dev/guide/rolldown
- https://vite.dev/guide/migration
