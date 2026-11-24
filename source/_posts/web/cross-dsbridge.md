---
title: 跨域-dsbridge
date: 2018-02-01 10:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-cross"></div>

# 跨端开发

## 混合开发技术

## 一、JSBridge

* 在 Hybrid 模式下，H5 会经常需要使用 Native 的功能，比如打开二维码扫描、调用原生页面、获取用户信息等，同时 Native 也需要向 Web 端发送推送、更新状态等，
* 而 JavaScript 是运行在单独的 JS Context 中（Webview容器、JSCore等），与原生有运行环境的隔离，所以需要有一种机制实现 Native 端和 Web 端的双向通信
* JSBridge：以JavaScript 引擎或 Webview 容器作为媒介，通过协定协议进行通信，实现 `Native 端和 Web 端双向通信`的一种机制。

## 二、JSBridge实现原理

### 2.1 JavaScript 调用 Native 端

- 使用 URL Scheme 拦截的方式

1. JS 端发起调用
   - JS 调用 `dsBridge.call('getUserInfo', { 'userId': 123 }, function(userInfo) { ... })`
   - 把接口调用信息编码为 URL，`dsbridge://call?module=default&method=getUserInfo&args=%7B%22userId%22%3A123%7D&callback=c_1678886400000_1`
   - 包含重要信息：方法名、参数、回调ID

2. 创建不可见的 iframe
   - 创建一个不可见的 iframe，并设置其 src 为 URL

3. Native 端拦截 URL
   - Native 端拦截 `dsbridge://` 开头的URL，并解析出方法名、参数、回调ID

4. 解析 URL 并执行方法
   - Native 端解析 URL，并执行方法
   - 执行方法后，将结果通过回调 ID 返回给 JS 端

### 2.2 Native 端调用 JavaScript 端

1. JavaScript 环境准备
   - DSBridge 初始化，向 WebView 中注入一段核心的 JS 代码，定义内部方法例如 `_handleMessageFromNative`

2. Native 发起调用
   - Native 调用 `webView.callHandler('updateTitle', 'New Title', function(response) { ... })`
   - 把调用信息编码为 JSON 字符串 `'javascript:dsBridge._handleMessageFromNative(\'' + jsonString + '\');'`
   - 包含重要信息：方法名、参数、回调

3. Native 执行 JS 方法
   - 在 Android 中是 `webView.evaluateJavascript(...)`。
   - 在 iOS 中是 `webView.evaluateJavaScript(...)`。

4. JS 端处理消息
   - JS 解析 JSON 字符串，执行对应的方法
   - 如果有回调，继续使用 URL Scheme 拦截的方式返回给 Native 端

## 三、桥接通信

### 3.1 通信的性能损耗

1. 通信的过桥开销
   - 数据序列化和反序列化
   - 协议编码与解码

2. 异步通信的延迟
   - 单次调用的影响不大，高频调用场景下影响较为明显

### 通信的体积限制

{% autogrid data-grid-link-table nofix %}
通信方向|DSBridge 底层机制|体积限制|限制原因|解决方案
JS → Native|URL Scheme 拦截|有，且比较严格（约 1MB）|底层 WebView 对 URL 长度的限制|分片传输，将大数据拆分成小块多次调用
Native → JS|evaluateJavascript|有，但非常宽松（受限于内存）|WebView 执行 JS 字符串的能力|通常不需要特殊处理，可以直接传递
{% endautogrid %}

## 四、同步与异步调用

- DSBridge 同时支持同步调用和异步调用两种方式，JS 侧通过 `dsBridge.call` 调用原生 API
- 同步调用直接拿到原生方法的返回值；异步调用通过回调函数接收原生执行结果
- 原生侧异步方法通过完成回调把结果返回给 JS，一次调用可以多次返回进度信息
- 调用时参数只能传一个，需要传递多个参数时可以组装成一个 JSON 对象

## 五、API 对象与命名空间

- 原生 API 集中实现在一个 Java 类或 JavaScript 对象中，再注册给桥接对象统一管理
- 支持命名空间，API 可以按层级归类，不同层级之间用点号分隔，便于在接口较多的混合应用中组织代码
- JS 侧也可以注册供原生调用的 JavaScript 方法，原生通过 `callHandler` 触发并接收返回值
- 提供方法存在性检测，调用前可以先判断某个原生方法或 JS 方法是否已经注册

## 六、安全约束

- 出于安全考虑，暴露给 JavaScript 调用的原生方法需要标注对应的接口注解，避免页面随意调用未授权的原生能力
- WebView 中的页面内容不可信时，注入 JavaScript 接口会带来风险，需要限制可暴露的方法范围
- 桥接通信的两端各自校验传入的数据，原生侧不应直接信任 JS 传来的参数，JS 侧也不应假定原生返回的数据结构固定不变

## 参考

- https://github.com/wendux/DSBridge-Android
- https://github.com/wendux/DSBridge-IOS
