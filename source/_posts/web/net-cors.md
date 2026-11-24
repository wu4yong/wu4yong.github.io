---
title: 计算机网络-跨域
date: 2018-01-20 15:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-net"></div>

# 计算机网络

## 前端的跨域

## 一、什么是跨域

- 跨域请求：当前发起请求的域与该请求指向的资源所在的域不一样
- 所谓同源是指:`协议`+`域名`+`端口`三者相同。
- 跨域是浏览器的自我保护机制， 防止其他服务器冒充真实的服务器来获取用户输入的信息。(目的是为了保护使用浏览器的用户，防止用户获取到假信息)

### 1.1 以下的东西都会涉及资源的请求

1. 资源跳转： A 链接、重定向、表单提交
2. 资源嵌入： `<link>、<script>、<img>、<frame>`等 dom 标签，还有样式中 background:url()、@font-face()等文件外链
3. 脚本请求： js 发起的 ajax 请求、dom 和 js 对象的跨域操作等

- 通常来说资源跳转和资源嵌入能够正常请求到跨域的资源，脚本请求在不进行设置的情况下无法获取跨域的资源

### 1.2 同源策略

- 是浏览器同源策略限制的一类请求场景
- 同源策略/SOP（Same origin policy）是一种约定，由 Netscape 公司 1995 年引入浏览器，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到 XSS、CSFR 等攻击。
- 同源策略的非绝对性：`<script> <img>`等带有 src 属性的标签可以从不同的域加载和执行资源。

## 二、跨域的解决方案

### 2.1 vue 中

- 可以在 vue.config.js 文件中配置 devServer.proxy 进行代理
- 前端解决跨域的方法最多的情况是代理。
- 之所以会跨域是因为浏览器的同源策略。服务器和服务器之间不会存在跨域行为
- 跨域是客户端单方面拒绝响应，服务端是接收请求并处理了的。
- 代理的本质就是把自己的请求交给第不受跨域限制的三方代理服务器(第三方代理服务器和客户端是同源的，所以不会有跨域)，来规避同源策略

### 2.2 CORS 策略(跨域资源共享)

- 需要后端进行配置 Access-Control-Allow-Origin 字段
- 如果想要 http 请求带 cookie 的话，需要前端进行一下配置

### 2.3 nginx 代理转发

- 在 nginx 中进行配置，把本地的请求进行代理的转发

### 2.4 JSONP 的方式

- 因为同源策略的非绝对性，`<script>`等标签的 src 属性可以从不同的域来加载资源，所以可以在 src 中和服务器请求数据
- 缺点：只能进行 get 请求

## 三、简单请求与预检请求

- 浏览器把跨源请求分为简单请求和需预检的请求；可能对服务器数据产生副作用的方法（GET 以外的方法，或特定 MIME 类型的 POST），以及携带自定义请求头的请求，需要先做预检
- 预检请求用 OPTIONS 方法发到同一资源，OPTIONS 是安全方法，不会对服务器资源产生影响
- 预检请求通过 Access-Control-Request-Method 告知服务器实际请求将使用的方法，通过 Access-Control-Request-Headers 告知实际请求携带的自定义请求头
- 预检通过后浏览器才发起实际请求；Access-Control-Request-* 头只出现在 OPTIONS 请求中，不会出现在实际请求里

```http
OPTIONS /doc HTTP/1.1
Origin: https://foo.example
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER, Content-Type
```

## 四、CORS 响应头与凭证

- Access-Control-Allow-Origin 指定允许访问的源；不带凭证的请求可以用 * 表示任意源，带凭证的请求必须明确写出具体源，不能使用通配符
- Access-Control-Allow-Methods 与 Access-Control-Allow-Headers 分别列出允许的请求方法和请求头，用于预检响应
- Access-Control-Max-Age 给出预检结果可以被缓存的秒数，在该时间内重复同类请求不再重复预检
- 要在跨源请求中携带 Cookie 和 HTTP 认证信息，响应需要 Access-Control-Allow-Credentials: true，前端也要在请求中开启凭证模式
- Access-Control-Expose-Headers 把指定响应头放入允许列表，网页脚本才能通过 getResponseHeader 读取；默认只能读取 Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma 等基本头
- 服务端按 Origin 动态返回允许源时，响应应带上 Vary: Origin，告知客户端不同 Origin 的响应内容可能不同
- CORS 被浏览器拦截时，网页脚本拿不到具体失败原因，只能在浏览器控制台查看报错信息

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://foo.example
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
```

## 五、代理与 CORS 的分工

- 同源策略只存在于浏览器，服务器之间发起的请求不受同源策略约束
- devServer.proxy 和 nginx 反向代理都是把请求先发给同源的代理服务器，由代理服务器转发到目标源；浏览器看到的是同源通信，因此不触发跨源限制
- 代理转发保留了服务端到服务端的连接；CORS 则是在响应头中由目标服务器声明哪些源有权读取响应
- JSONP 利用 script 标签 src 可跨源加载的特性，只支持 GET，不能读取其他类型的跨源响应；现代项目优先使用 CORS 或代理

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/CORS
