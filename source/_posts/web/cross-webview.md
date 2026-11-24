---
title: 跨域-webview
date: 2018-02-03 03:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-cross"></div>

# 跨端开发

## Webview 的介绍

* Webview 是一个基于 (webkit 内核) 的 组件，可以解析 DOM 元素，进行 HTML 页面的展示。它和浏览器展示页面的原理是相同的。
* WebView 用于在手机应用程序内部直接展示 HTML 页面，而不必额外去打开浏览器应用。

* 使用 WebView 的好处时可以不必要求用户更新APP，便可以获取到最新的页面（热更新）
* 运行在 WebView 中的 JS 代码是有能力调用原生的系统 API 的，没有传统浏览器沙箱的限制。

## 浏览器的内核

### PC 浏览器

1. IE        Trident(俗称 IE 内核)  
2. FireFox   Gecko(俗称 Firefox 内核)
3. Chrome    webkit 内核-> Blink 内核(统称为 Chromium 内核(Blink 内核 fork 了 Webkit 内核))
4. Safari    Webkit 内核
5. Opera     Presto 内核 -> Webkit 内核 -> Blink 内核

* 国内浏览器号称双内核，其实是 Trident 内核 + Webkit 内核。在访问不需要网上交易的网站时 使用 Webkit 内核，得到更高的性能。在访问需要网上交易的网站时，使用 Trident 内核

### 移动端

* 移动端的浏览器内核指的是 `系统内置浏览器` 的内核
* phone 和 IOS 主要使用 Webkit 内核， Android4.4 之前使用的是 Webkit 内核，Android4.4 之后系统浏览器切换到了 Chromium 内核

## Webview 和 浏览器的区别

1. WebView 可以在离线状态下工作，但浏览器不能
2. WebView 可以使用应用程序的缓存和数据，而浏览器不能

## Android 侧的 JS 通信

- Android 的 WebView 可以通过 `addJavascriptInterface` 把一个 Java 类实例暴露为 JavaScript 可调用的接口，页面脚本通过这个接口名调用原生方法
- 页面发起的特定 URL Scheme 可以在 `WebViewClient` 的 `shouldOverrideUrlLoading` 中被拦截解析，从而桥接到原生处理逻辑
- 原生侧需要主动执行页面脚本时，可以调用 `evaluateJavascript` 在 WebView 中执行指定的 JavaScript 字符串并接收回调结果
- 注入 JavaScript 接口会让网页获得控制应用的能力，当 WebView 中的 HTML 内容不可信时，这种方式存在安全风险，应严格限制可暴露的方法范围

## iOS 侧的 WKWebView

- `WKWebView` 是 iOS 和 macOS 上展示交互式网页内容的原生视图，在 iOS 8 及以后替代了旧的 `UIWebView`
- 原生侧执行页面脚本使用 `evaluateJavaScript(_:completionHandler:)`，传入要执行的 JavaScript 字符串，结果通过 completion 回调返回
- 页面向原生发消息通过脚本消息处理器完成：在配置中注册遵循 `WKScriptMessageHandler` 的对象，页面侧经由对应的 message handler 通道把消息传给原生
- 导航行为由导航代理监听，页面弹窗和上下文菜单等原生 UI 交互由 UI 代理响应

## 应用数据与浏览器数据的隔离

- 出于安全考虑，系统浏览器应用不会与你的应用共享应用程序数据，WebView 运行在应用自己的进程和数据环境中
- WebView 可以使用应用自身的缓存、Cookie 和存储数据，而系统浏览器另有独立的数据空间
- 嵌入应用内的 WebView 主要展示自己可控的内容，对导航、权限和接口暴露的控制力度高于打开外部浏览器

## 页面导航与生命周期

- WebView 加载页面时由导航代理跟踪加载进度、判断链接是否在应用内打开，拦截到外部地址时再交给系统浏览器处理
- 页面中的电话链接、图片视频等内嵌资源会随初始加载请求一并加载，具体行为由 WebView 配置和页面内容决定
- 应用切到后台或销毁时，需要按平台方式停止页面加载、释放 WebView 实例，避免残留资源占用

## 本地资源与离线加载

- WebView 可以加载应用包内自带的 HTML、CSS、JS 和图片等本地资源，在离线状态下展示内置页面
- 远程页面和本地资源的访问路径需要按各端规则配置，跨域和文件访问限制由 WebView 内核和系统策略共同决定
- 热更新场景下，更新的页面资源由应用自身的存储或下载机制提供，WebView 负责解析展示

## Hybrid 架构中的位置

- 在 Hybrid 模式下，WebView 负责展示 H5 页面和运行页面脚本，原生侧负责提供系统能力和页面容器
- H5 与原生之间通过桥接机制双向通信，页面侧发起能力调用，原生侧执行后把结果回传页面
- 频繁的桥接调用存在序列化和往返开销，复杂交互页面需要评估通信次数对流畅度的影响

## 内核版本与兼容性

- 页面的渲染和脚本执行表现依赖设备内置的 WebView 内核版本，不同系统版本之间存在差异
- 样式和 JS 行为在不同内核上可能表现不一致，需要在目标设备上验证页面实际效果
- 远程页面升级只需要更新 WebView 加载的资源，不必随应用安装包一起重新分发

## 权限与接口暴露的控制

- WebView 中可调用的原生接口应当按最小范围暴露，页面只能访问业务所需的能力
- 接收自页面的参数需要在原生侧校验，不应直接信任 JS 传来的数据结构和取值
- 页面内容来源不可信时，避免注入宽泛的 JavaScript 接口，防止网页越权调用原生功能

## 页面加载与缓存

- WebView 可以加载远程 URL，也可以加载应用内置或下载到本地的 HTML 资源
- 应用自身的缓存、Cookie 和存储由 WebView 在应用数据环境内维护，与系统浏览器相互独立
- 远程页面更新时只需替换 WebView 加载的资源，离线页面则依赖本地已保存的资源文件

## 参考

- https://developer.android.com/develop/ui/views/layout/webapps/webview
- https://developer.apple.com/documentation/webkit/wkwebview
