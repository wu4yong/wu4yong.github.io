---
title: 前端工程化-前端项目性能指标
date: 2018-02-13 16:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-fe"></div>

# 前端工程化

## 性能优化相关的指标

## 一、加载时间相关指标

### 1.1 页面加载时间

- 从用户输入网址到点击链接到页面完全加载并可交互的时间，是衡量用户体验的关键指标，一般控制在 3 秒以内

### 1.2 首次页面内容绘制时间(FCP)

- 浏览器首次将任何文本、图像、非空白 canvas 或 SVG 绘制到屏幕上的时间，反映了页面的初始加载速度，能让用户尽快感知到页面开始加载

### 1.3 首次有意义绘制时间（FMP）

- 页面中主要内容开始呈现的时间，对于用户快速了解页面内容至关重要

### 1.4 可交互时间（TTI）

- 页面达到完全可交互状态所需的时间，此时用户可以与页面上的元素进行交互，如点击按钮、输入文本等，标志着页面已准备好为用户提供服务。

## 二、资源加载相关指标

### 2.1 资源请求数

- 页面加载过程中发起的资源请求数量，包括 HTML、CSS、JavaScript、图片、字体等资源。减少资源请求数可以降低浏览器的并发压力，提高加载速度。

### 2.2 资源大小

- 页面所加载的各种资源文件的大小总和，包括压缩前和压缩后的大小。优化资源大小可以显著加快下载速度，如对图片进行压缩、对代码进行精简等。

### 2.3 缓存命中率

- 衡量浏览器缓存资源的使用效率，缓存命中率越高，说明从缓存中获取资源的比例越大，页面加载速度也就越快。

## 三、渲染相关指标

### 3.1 帧率

- 每秒绘制的帧数，通常以 fps（frames per second）为单位。一般来说，60fps 的帧率可以提供流畅的视觉体验，低于 30fps 可能会导致动画和交互出现卡顿。

## 四、SEO 相关指标

### 4.1 首屏内容丰富度

- 首屏展示的内容是否丰富、有价值，是否包含关键词等重要信息，对于搜索引擎收录和排名有重要影响。

### 4.2 HTML 结构合理性

- HTML 代码的结构是否清晰、语义化是否良好，有助于搜索引擎更好地理解页面内容，提高搜索排名。

## 五、以用户为中心的性能指标

- LCP（Largest Contentful Paint）：视口内可见的最大图像或文本块的渲染时间，从页面开始加载时计时；计入判定的元素包括 `<img>`、SVG 内的 `<image>`、`<video>` 的封面图、带 `background-image` 的元素以及文本节点组
- CLS（Cumulative Layout Shift）：衡量视口内元素在帧与帧之间位置偏移带来的布局稳定性；单次偏移分由影响比例（偏移所占视口比例）乘以距离比例（移动距离占视口比例）得到
- 发生在近期用户输入之后的偏移不计入 CLS 统计，条目上的 `hadRecentInput` 为 true 时应跳过
- Long Task：占用主线程 50 毫秒及以上的不间断任务；长任务会推迟可交互时间、增加输入与事件处理延迟，并造成动画和滚动卡顿
- FP（First Paint）是首次渲染任何内容的时间，FCP（First Contentful Paint）是首次渲染 DOM 文本或图像内容的时间；FP 的标记是可选的，并非所有用户代理都会上报
- 长任务条目还会附带归属信息，用来定位任务来自顶层页面、iframe 还是其他浏览上下文容器
- 这里只记录指标的定义与采集口径，具体达标阈值以官方指标文档为准

## 六、指标的采集与计时

- `PerformanceObserver` 用来监听性能时间线中新记录的性能条目，构造回调后调用 `observe()` 指定要监听的条目类型
- 条目对象带 `entryType`、`startTime`、`duration` 等字段；传 `buffered: true` 可以拿到文档构建期间已经被浏览器缓冲的条目
- LCP 条目通过监听 `largest-contentful-paint` 类型获取，布局偏移条目类型为 `layout-shift`，长任务条目类型为 `longtask`

```js
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(entry.entryType, entry.startTime, entry.duration)
  })
})
observer.observe({ type: 'layout-shift', buffered: true })
observer.observe({ type: 'longtask', buffered: true })
```

- `performance.now()` 返回自 `timeOrigin` 起经过的毫秒级高精度时间戳，基于单调时钟，当前时间不会回退，也不受系统时钟调整影响
- 与 `Date.now()` 相比，`performance.now()` 精度到浮点毫秒级别，不依附 Unix 纪元，适合度量一段代码或一个任务的耗时
- 度量普通代码耗时可以在前后各取一次 `performance.now()`，两次结果的差值就是中间经过的毫秒数
- 观察者不再需要接收条目时，可以调用 `disconnect()` 停止回调；已缓冲但未派发的条目可以用 `takeRecords()` 取出

## 七、时间线与度量口径

- 性能条目都挂在浏览器的性能时间线上；`PerformanceObserver` 在条目记录时收到回调，已经发生的历史条目需要配合 `buffered: true` 才能取到
- `PerformanceEntry` 是各类条目的基础接口，通用字段包括 `entryType`（条目类型）、`name`（条目名称或归属容器）、`startTime`（起始时间）、`duration`（持续时间）
- 布局偏移条目的 `duration` 恒为 0，偏移概念不适用时长；它的分值放在 `value` 字段，归属元素列表放在 `sources` 字段
- 长任务的 `duration` 是任务起止之间的耗时，精度为 1 毫秒；`attribution` 序列给出任务归属的容器信息
- 度量耗时优先用单调时钟：`performance.now()` 不受系统时钟调整影响，跨页面比较时间戳时结合 `performance.timeOrigin` 使用
- 指标采集脚本应在页面早期注册观察者，避免漏掉启动阶段产生的条目；上报前再按条目类型过滤需要的指标

## 参考

- https://developer.mozilla.org/en-US/docs/Web/API/LargestContentfulPaint
- https://developer.mozilla.org/en-US/docs/Web/API/LayoutShift
- https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming
- https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver
- https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
