---
title: HTML+CSS-meta
date: 2018-02-21 16:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-html"></div>

# HTML+CSS

## meta元数据

不会显示在页面上，但是可以再计算机上解析。
浏览器（如何显示内容或重新加载页面），搜索引擎（关键字）和其他 Web 服务都使用元数据。

一共有四个属性 charset, name, http-equiv(相当于http的作用， 比如定义一些http的参数), content

## 定义和用法

```html
<!-- 定义字符集 -->
<meta charset="UTF-8">
```

```html
<!-- 定义搜索引擎的关键字： -->
<meta name="keywords" content="HTML, CSS, JavaScript">
```

```html
<!-- 定义您的网页描述： -->
<meta name="description" content="Free Web tutorials for HTML and CSS">
```

```html
<!-- 定义页面的作者： -->
<meta name="author" content="John Doe">
```

```html
<!-- 每30秒刷新一次文档： -->
<meta http-equiv="refresh" content="30">
```

```html
<!-- 设置视口，以使您的网站在所有设备上看起来都不错：
width=device-width部分将页面的宽度设置为跟随设备的屏幕宽度(视设备而定)
initial-scale=1.0部分设置浏览器首次加载页面时的初始缩放级别。 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## 标准元数据名称

- HTML 规范定义的标准名称包括 `author`、`description`、`keywords`、`generator`、`theme-color`、`referrer`、`application-name`
- `keywords` 用逗号分隔与页面内容相关的关键词，`description` 是一段简短精确的页面内容描述，部分浏览器把它用作书签的默认描述
- `theme-color` 的 `content` 必须是有效的 CSS 颜色值，用于调整浏览器周边界面的配色
- `referrer` 控制当前文档发出请求时携带的 `Referer` 请求头策略
- `robots` 不属于 HTML 标准名称，是各搜索引擎通用的约定，常见取值有 `index`、`noindex`、`follow`、`nofollow`
- 声明字符编码的 `<meta charset>` 必须位于文档前 1024 个字节之内，HTML5 文档的有效编码为 UTF-8
- `generator` 记录生成页面所用软件的标识符，普通手写页面一般不需要填写

## http-equiv 编译指令

- `refresh` 只写秒数表示定时重载当前页面，写成 `3;url=https://example.com` 表示几秒后跳转到指定地址
- `content-security-policy` 用于定义页面内容策略，限制允许的脚本和资源来源，缓解跨站脚本风险
- `default-style` 用于指定默认 CSS 样式表组的名称
- `x-ua-compatible` 在现代浏览器中会被忽略
- 自动刷新或跳转间隔过短会影响辅助技术用户阅读页面，使用时需要谨慎

## viewport 常用键

- `width` 可取正整数像素值或 `device-width`，`height` 对应视口高度
- `initial-scale` 控制页面首次加载的缩放倍数，默认值为 1
- `minimum-scale`、`maximum-scale` 限制允许缩小和放大的倍数，取值范围在 0.1 到 10 之间
- `user-scalable` 控制是否允许手动缩放，取值 `yes`/`no` 或 `1`/`0`，默认为允许；禁止缩放会带来无障碍问题
- `viewport-fit` 取值 `auto`、`contain`、`cover`，用于让视口适配设备显示区域
- 设置了初始或最大缩放倍数时，`width` 实际转化为最小视口宽度，大屏浏览器会扩大视口而不是放大页面

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

## 社交平台元数据

- Open Graph 协议基于 RDFa，在 `<head>` 中使用 `property` 属性而不是 `name` 写元数据
- 每个页面必需的属性是 `og:title`、`og:type`、`og:image`、`og:url`，可选 `og:description`
- 同一属性出现多次时，按文档顺序优先采用前面的声明
- 图片还可以通过 `og:image:width`、`og:image:height`、`og:image:alt` 补充尺寸和说明信息
- 社交平台抓取页面时读取的也是 `<head>` 中的元数据，不会执行页面里的业务脚本
- 同一个 `<meta>` 元素只能承担一种元数据类型，`name`、`http-equiv`、`charset`、`itemprop` 互斥
- 元数据不显示在页面正文里，主要供浏览器、搜索引擎和其他 Web 服务解析使用

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/meta
- https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/meta/name
- https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/meta/name/viewport
- https://ogp.me/
