---
title: Vue-Vue路由
date: 2018-07-28 12:15:30
categories:
- web
tag: 
- vue
---

<div class="essay-banner essay-vue"></div>

# Vue路由

* 路由是网络工程里面的术语
* 路由就是通过互联网的网络把信息从源地址传输到目的地址的活动

## 映射表

* 路由表的本质上就是一个映射表，决定了数据包的指向。

## 前端渲染后端渲染

### 后端的渲染(服务端渲染)

* 原来的话后端使用 jsp 写页面，html+css+java java代码就直接从数据库中读取数据，并且将它动态的放在页面上
* 以前的网页是没有ajax技术的。整个页面都是重新获取的
* 浏览器输入RUL，直接将RUL发送给后端，后端直接返回页面
* 后端路由就是由后端处理URL和页面之间的映射关系
* 后端渲染直接交给客户端展示的话，有利于SEO的优化。
* 结构样式和数据全都糅合在一起，编写和维护都是很恶心的。

### 前后端分离的阶段

* 随着ajax的出现
* 后端只负责提供数据，不负责任何页面的功能
* 后端就是一个提供API接口的服务器
* 在浏览器输入URL的话，去静态服务器下载html+css+js，html和css浏览器能够直接的渲染到页面，然后执行js代码，根据ajax去后端服务器请求数据，然后再根据请求到的数据增删改查DOM和CSS，然后再将新的页面渲染到页面上。
* 根据不同的URl下载不同的html+css+js，静态服务器中存在很多套html+css+js
* 这个阶段叫做前端渲染
* 前后端任务的分离，后端负责数据，前端负责交互和可视化

### 单页面(spa)富应用阶段

* 在前后端分离的基础上加上了一层前端路由
* 静态资源服务器上只有一套html+css+js，在获取的时候会一次性获得所有文件，只不过不全部显示
* 然后根据不同的URL，从获取的html+css+js中抽离对应的部分(在vue中也就是对应的组件)
* 页面和URl的映射关系由前端路由来管理
* 改变URL的时候，页面是不进行整体的刷新的(改变URl的时候并不会重新向服务器发起请求)

## history模式和hash模式

* Vue 是单页面应用，Vue-Router 存在的意义就在于 --- 改变视图的同时不会向后端发起请求

### 如何改变视图但是不向后端发起请求

### hash模式

```js
http://160.238.86.82:8003/#/index
hash的值为 #/index
特点: hash 虽然出现在URL中，但是不会被包含到HTTP请求中。每次向后端发起请求时只会发送 http://160.238.86.82:8003 这部分
```

### history模式

* history 是利用的 H5 提供的 API。实现改变 URL 但是浏览器不会立即向后端发送请求
* 外形美观方便(但是如果想要完美的使用，需要后端进行配置支持)

### history的弊端

* 使用 history 模式进行浏览器历史记录栈的前进，后退都没有问题。就怕手动输入URL后回车或者刷新浏览器，因为每次刷新浏览器可是实实在在的去请求服务器。在hash模式下，#后面的内容都不会放到HTTP请求中，所以在多层路由下也没有问题。但是 history 模式就不行。在多层路由的情况下会把整个URL全都放到HTTP请求中(这就是为什么多层路由下刷新页面，通过绝对路径请求的资源会失效)。所以想要用好 history 模式，需要后端的配置。需要后端覆盖前端所有的路由，不然通过刷新请求数据时会找不到对应的资源

## Vue Router 4 的基本写法

- Vue Router 是 Vue 官方的客户端路由方案，作用是在 SPA 中把浏览器 URL 和展示的内容绑定起来，切换页面时不向服务器重新加载页面
- 通过 `createRouter()` 创建路由器实例，传入 `history` 选项和 `routes` 路由表；`routes` 把 URL 路径映射到对应的组件
- 实际应用中历史记录模式通常用 `createWebHistory()`，哈希模式用 `createWebHashHistory()`；`createMemoryHistory()` 只用于演练场或测试环境
- 创建实例后通过 `app.use(router)` 注册插件，这一步要在 `mount('#app')` 之前完成
- 注册插件会全局注册 `RouterLink` 和 `RouterView`，并提供 `$router`、`$route` 以及 `useRouter()`、`useRoute()`
- `RouterLink` 用来生成导航链接，`RouterView` 用来渲染当前 URL 路径对应的路由组件
- RouterLink 不同于常规 `<a>` 标签，由 Router 在不重新加载页面的情况下改变 URL
- 路由表中每个路由由 `path` 和 `component` 组成，component 指定的组件就是被 RouterView 渲染的视图
- 组合式 API 中不能通过 `this` 访问组件实例，因此提供 `useRouter()` 和 `useRoute()`

## 编程式导航与当前路由

- 选项式 API 中通过 `this.$router` 访问路由器实例，调用 `push('/about')` 做编程式导航；`this.$route` 访问当前路由对象
- 组合式 API 中用 `useRouter()` 和 `useRoute()` 获取路由器实例和当前路由；当前路由的 `query`、`params` 等信息挂在 `route` 对象上
- 动态路由可以用 `:id` 形式的路径参数匹配，参数值放在 `route.params` 中，查询参数放在 `route.query` 中

## 导航守卫

- 全局前置守卫通过 `router.beforeEach` 注册，每个守卫接收 `to`（即将进入的目标路由）和 `from`（正要离开的路由）两个参数
- 守卫返回 `false` 可以取消当前导航；返回一个路由地址会重定向到不同地址；返回 `true`、`undefined` 或不返回则导航有效，继续调用下一个守卫
- 守卫返回 `false` 取消导航时，如果浏览器 URL 已经改变，会被重置到 from 路由对应的地址
- 路由独享的守卫 `beforeEnter` 直接写在路由配置上，只在进入该路由时触发，`params`、`query`、`hash` 变化不会再次触发
- 组件内可以定义 `beforeRouteEnter`、`beforeRouteUpdate`、`beforeRouteLeave` 守卫；离开守卫常用来阻止用户在未保存修改前离开页面
- 全局后置钩子 `afterEach` 在导航确认、DOM 更新后调用，不影响导航本身，常用于埋点或修改页面标题
- 守卫是异步解析执行的，导航在所有守卫 resolve 完成前一直处于等待状态

## 参考

- https://router.vuejs.org/zh/guide/
- https://router.vuejs.org/zh/guide/advanced/navigation-guards.html
