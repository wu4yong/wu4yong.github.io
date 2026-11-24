---
title: 前端工程化-代码分割
date: 2018-02-13 04:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-fe"></div>

# 前端工程化

## 代码分割

- 将代码拆分为多个包，然后对这些包进行 `按需` 或者是 `并行加载`
- 可以 `提升首屏加载速度`
- 在资源有更新时，可以充分利用`浏览器的缓存`机制，提升网站的打开速度

## 动态导入

- 利用 `路由` 和 `import() 动态导入` 实现 `路由级别` 懒加载
- 利用 `事件` 和 `import()` 动态导入实现 `函数级别` 懒加载

```js
// 路由级别懒加载
const routes = [
  {
    path: "/",
    component: () => import("./src/index.js"),
  },
  {
    path: "/fetch",
    component: () => import("./src/fetch.js"),
  },
];

// 文件级别的懒加载
const button = document.getElementById("button");
button.addEventListener("click", () => {
  import("./src/utils.js").then(({ add }) => {
    console.log(add(1, 2));
  });
});
```

## Vite 项目代码分割

## 默认策略

1. 基于动态导入 `import()` 的分割点：只要你在代码中使用了动态导入 `import()` 语法，Vite/Rollup 就会自动将该模块及其独特的依赖项创建一个新的 `JS Chunk（块）`
2. 自动的公共代码块提取：当一个模块被两个或更多个不同的、异步加载的 Chunk 所依赖时，Rollup 会自动将这个共享的模块提取出来，形成一个独立的公共 Chunk。
3. CSS 代码分割： 将 CSS 与使用它的 JS Chunk 关联

### 手动配置代码分割

```js
manualChunks: {
  // 第三方库单独打包
  'vendor-vue': ['vue', 'vue-router', 'pinia'],
  'vendor-ui': ['element-plus', '@element-plus/icons-vue'],
  'vendor-utils': ['axios', 'vue-i18n'],
  // 业务模块分组
  'views-admin': [
    './src/views/admin-system/admin-system-index.vue',
    './src/views/admin-system/menu-item/dashboard/index.vue',
    './src/views/admin-system/menu-item/user-management/index.vue',
    './src/views/admin-system/menu-item/permission-management/index.vue',
    './src/views/admin-system/menu-item/system-settings/index.vue',
  ],
  'views-home': ['./src/views/home-page/home-page.vue'],
  'views-auth': ['./src/views/login/page-login.vue'],
  'views-others': [
    './src/views/not-found/not-found.vue',
    './src/views/vue3-syntax/parent-child/index.vue',
    './src/views/vue3-syntax/syntax-test/index.vue',
  ],
},
```

{% autogrid data-grid-link-table nofix %}
分组类型|更新频率|文件大小|缓存策略|用户影响
**vendor-vue**|极低|103KB|长期缓存|几乎无需重新下载
**vendor-ui**|低|862KB|长期缓存|UI库更新时才重新下载
**vendor-utils**|极低|98KB|长期缓存|工具库很少更新
**views-admin**|中等|13.74KB|模块级缓存|只影响管理功能用户
**views-home**|中等|2.92KB|独立缓存|首页优化，影响面小
**views-auth**|中高|0.40KB|独立缓存|登录功能独立更新
**views-others**|低|4.97KB|合并缓存|学习页面变化影响小
{% endautogrid %}

## webpack 侧的分割方式

- webpack 官方给出三种通用分割方式：入口配置拆分、防重复提取（entry 依赖或 SplitChunksPlugin）、动态导入
- 入口拆分适合页面之间本就独立的 bundle；缺点是入口 chunk 之间重复的模块会被各自打包一份
- SplitChunksPlugin 把公共依赖提取到已有入口 chunk 或全新 chunk，消除重复
- 动态导入用 `import()` 按运行时需要拆分模块；`import()` 返回 Promise，老浏览器还需要 Promise 垫片
- 魔法注释 `webpackPrefetch`、`webpackPreload` 可以声明后续需要或即将需要的 chunk，分别对应预取和预加载
- runtimeChunk 把引导代码单独拆出，避免公共 chunk 变动时入口 bundle 跟着失效

## 提取公共依赖的注意点

- 公共依赖只有达到 webpack 设定的尺寸阈值才会被提取成独立 chunk，不是所有共用模块都自动单独成块
- 提取后的 vendor chunk 与业务 chunk 分开缓存，第三方库不变时无需重新下载
- CSS 同样按 chunk 拆分：懒加载的 CSS 跟随对应 chunk 到达，加载 chunk 时一并生效
- 手动分组时把更新频率低、体积大的库归在一起，业务页面按路由或模块独立成块
- 分割点由代码里的动态导入语法决定；没有动态导入的模块，只能通过入口或手动分组拆分

## 参考

- https://webpack.js.org/guides/code-splitting/
