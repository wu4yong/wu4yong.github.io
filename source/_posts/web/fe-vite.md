---
title: 前端工程化-Vite
date: 2018-02-08 00:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-fe"></div>

# 前端工程化

## Vite

- Vite 预设了场景 `WEB`, 并且将大部分常见的 WEB 构建需求都直接做成了默认的配置(TS、JSX、CSS、SCSS、LESS、POSTCSS、CSS Modules)

## 一、开发阶段

- 使用 ESBuild 进行转译(使用 GO 语言编写，可以直接转换成机器代码。能够充分利用 CPU 多核的运算)
- 真正的`按需编译`，开发过程中不需要事先打包应用程序，而是在应用程序`运行时`即时`编译和构建`。

### 1.1 利用缓存提速

- 已`预构建的依赖`请求使用 `HTTP 头 max-age=31536000, immutable` 进行`强缓存`，以提高开发期间页面`重新加载的性能`

### 1.2 仅执行转译

- Vite 仅执行 `.ts` 的转译工作(使用 ESBuild 将 ts 转成 js)，并`不执行`类型检查。并假定类型检查已经由 IDE 实现了。
- 因为类型检查需要了解`整个模块图`，这和 Vite 开发阶段 `按需编译` 的原则相违背。
- 同理 Eslint 的静态分析也与 Vite 的工作流程`解耦`

### 1.3 现代浏览器兼容性

- 开发阶段的浏览器是必须支持 `原生 ES 模块`、`原生 ES 动态导入` 和 `import.meta` 的，所以也就代表着浏览器支持 ES6 特性，所以开发阶段的 babel 转化工作会省略很多(Vite 开发阶段的产物包含很多 ES6 的语法，例如，箭头函数，解构，模板字符串等)

## 二、build 阶段

- 使用 Rollup 进行打包

## 三、index.html

- index.html 会被 Vite 视为依赖图的一部分
- 在开发阶段整个 Vite 项目目录会被视为服务器的根目录，index.html 是入口文件。在 index.html 中可以直接基于 Vite 项目目录的结构进行资源引入

## 四、浏览器支持度

1. 开发阶段：Vite 将 `esnext` 作为转化目标，假设是 `现代浏览器` 并支持所有最新的 js 和 css 特性，这样在开发阶段就能尽量减少 Vite 的代码转译工作，使得速度更快
2. 生产构建：支持 `原生 ES 模块` 、`原生 ES 动态导入` 和 `import.meta`

## 五、静态资源处理

- 服务时引入一个静态资源会返回解析后的公共路径
- css 中的 url() 以同样的方式处理

```js
// imgUrl 在开发时会是 /img.png，在生产构建后会是 /assets/img.2d8efhg.png。
import imgUrl from "./img.png";
document.getElementById("hero-img").src = imgUrl;
```

- public 目录的特性和之前保持一致，永远使用根绝对路径引入

## 六、依赖预构建

- 开发模式下 Vite 会先用 esbuild 对项目依赖做预构建：把 CommonJS、UMD 产物转换成 ESM；把内部模块很多的 ESM 依赖合并成单个模块，减少浏览器同时发出的请求数
- 预构建只在开发模式生效；生产构建改用 `@rollup/plugin-commonjs` 处理 CommonJS 依赖
- 预构建产物与其他缓存文件存放在 `node_modules/.vite` 目录，可用 `cacheDir` 配置；没有检测到 `package.json` 时默认目录为 `.vite`
- 是否需要重新预构建，依据包管理器 lockfile 内容、patches 目录修改时间、`vite.config` 相关字段以及 `NODE_ENV` 值判断；上述内容不变就复用缓存
- 服务启动后遇到尚未进缓存的新依赖导入时，Vite 会重新跑预构建流程，并在需要时刷新页面；`--force` 启动或手动删除缓存目录可以强制重新构建依赖
- `optimizeDeps.include` 与 `optimizeDeps.exclude` 用来显式列入或排除依赖；体积大、是 CommonJS 的依赖适合 include，体积小且已是合法 ESM 的依赖可以 exclude 让浏览器直接加载
- monorepo 中通过链接引入的本地包会被 Vite 识别为源码，默认不参与打包，而是分析它自己的依赖列表；这类包需要以 ESM 形式导出，否则要在 `optimizeDeps.include` 与 `build.commonjsOptions.include` 中补充配置
- 锁文件版本变化时，追加的版本查询参数会让浏览器侧的旧缓存自然失效

## 七、静态目录、公共路径与解析

- `publicDir` 默认为 `"public"`：目录内文件开发时以 `/` 路径提供服务，构建时原样复制到 `outDir` 根目录，不经过插件转换；设为 `false` 可以关闭这个特性
- `base` 配置开发与生产环境的公共基础路径，默认 `/`；取值可以是绝对路径名（如 `/foo/`）、完整 URL，或空字符串、`./`（嵌入部署场景）
- 项目根目录 `root` 默认为启动命令时的工作目录，也就是 `index.html` 所在位置；可以传绝对路径，也可以传相对当前工作目录的路径
- 环境变量默认只暴露带 `VITE_` 前缀的变量给客户端源码（通过 `import.meta.env` 访问）；`envPrefix` 可以修改这个前缀，留空会有安全风险，Vite 会直接报错
- `resolve.dedupe` 列出需要始终解析到项目根目录同一份副本的依赖，用于处理 monorepo 链接包导致的同一依赖多份拷贝问题
- `resolve.conditions` 补充条件导出允许的条件名；默认允许条件包括 `import`、`module`、`browser`、`default`，以及按当前模式取的 `production`/`development`
- `resolve.mainFields` 按 `module`、`jsnext:main`、`jsnext` 的顺序查找 `package.json` 字段；条件导出命中 `exports` 字段时，主字段不再参与解析
- `resolve.extensions` 列出省略扩展名时依次尝试的后缀；官方不建议给 `.vue` 这类自定义扩展名加入省略列表，以免干扰 IDE 与类型支持
- esbuild 转译默认作用于 `.ts`、`.jsx`、`.tsx` 文件；需要调整 JSX 工厂函数、碎片函数等可在 `esbuild` 选项里配置，设为 `false` 可关闭 esbuild 转译
- `json.namedExports` 默认为 `true`，支持从 `.json` 具名导入；关闭后导入 JSON 会被转成 `export default JSON.parse(...)`，大 JSON 场景下性能更好
- `appType` 默认为 `spa`，可选 `mpa` 或 `custom`；SSR 与自定义 HTML 处理场景使用 `custom`，不挂载 SPA 回退中间件

- CommonJS 转换会做智能导入分析，即使导出是动态赋值的（如 React），具名导入也能按预期工作
- 预构建把内部模块很多的 ESM 依赖合并成单模块；例如 lodash-es 内部有 600 多个模块，未合并时浏览器会同时发出数百个请求
- 找不到既有缓存时，Vite 会扫描源码自动发现裸导入，作为预构建入口；预构建由 esbuild 执行，通常很快
- 服务启动后遇到未进缓存的新依赖导入，会重新跑预构建流程，并在需要时刷新页面
- monorepo 链接包被识别为源码后不参与打包，改为分析它自己的依赖列表；链接包必须以 ESM 导出，否则补到 `optimizeDeps.include` 与 `build.commonjsOptions.include`
- 改动链接包后需要带 `--force` 重启开发服务器才能生效
- 链接依赖解析差异可能导致传递依赖去重不正确、运行时出问题；遇到时可用 `npm pack` 处理链接包修复
- 插件转换生成的导入在初次扫描时发现不了，容易在文件被浏览器请求、转换后触发服务器立即重新打包；这类依赖用 `optimizeDeps.include` 显式列入
- `optimizeDeps.esbuildOptions` 可进一步定制 esbuild，例如加入处理依赖内特殊文件的 esbuild 插件
- 已解析的依赖请求用 `max-age=31536000, immutable` 强缓存，缓存后不再请求开发服务器；安装不同版本时由追加的版本查询参数自动失效
- 调试本地依赖改动可在浏览器 DevTools 网络面板临时禁用缓存，或带 `--force` 重启后刷新页面
- 缓存复用判断依据：包管理器 lockfile 内容、patches 目录修改时间、`vite.config` 相关字段、`NODE_ENV`；任一变化才重新预构建
- 体积大、是 CommonJS 的依赖适合 include；体积小且已是合法 ESM 的依赖可以 exclude，让浏览器直接加载

## 参考

- https://vitejs.dev/config/shared-options
- https://vitejs.dev/guide/dep-pre-bundling
