---
title: 技术文档总结-JS中的多线程
date: 2018-01-22 23:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-tech"></div>

# 技术文档总结

## JS 中的多线程

## 一、浏览器中的多线程

概念 + 示例

webWorker 支持多线程，但是不支持操作 DOM。

## 二、Node.js 中的多线程

概念 + 示例

- 利用异步编程的模型来实现

### 缺点

1. 不适合耗费 CPU 密集型应用
2. 无法利用多核 CPU 的优势

### Node 多线程(多进程)

1. Node 中的多线程, 相关的框架和工具

## JS 多线程的缺点

1. 不是真正的多线程，而是多进程
2. 更高的切换代价

## WASM 来实现多线程

概念 + 示例

## Web Worker 的通信方式

- Worker 通过 `new Worker(脚本地址)` 创建，在后台执行脚本，运行在独立的上下文里，不能访问 DOM
- 主线程与 worker 之间通过 `postMessage()` 互发消息，消息经过结构化克隆；接收方监听 `message` 事件拿到数据
- 主线程调用 `terminate()` 会立即终止 worker；worker 内部可以用 `self.close()` 关闭自身
- 转移 `ArrayBuffer` 这类可转移对象时，通过转移列表移交所有权，而不是在两端各拷贝一份数据
- 消息发送是异步的，双方通过事件监听接收，不能在发送后同步读取对方的处理结果
- worker 内部可以用 `importScripts()` 加载额外的脚本文件
- 结构化克隆会拷贝消息内容，大对象频繁跨线程通信时有序列化成本，适合传递必要的数据

```js
// main.js
const worker = new Worker('/worker.js')
worker.postMessage([1, 2])
worker.onmessage = (event) => {
  console.log(event.data)
}
```

## Worker 的可用范围与限制

- worker 上下文里没有 `window`、`document`，不能操作页面上的元素与样式
- 标准 JS 内置对象可用，同时可以使用 Fetch、XMLHttpRequest、IndexedDB、WebSocket、Console、定时任务等 Web API
- 同一个 worker 不能直接操作另一个 worker 的上下文，跨 worker 协作通过消息通道完成
- 专用 worker 与创建它的页面同源；worker 也可以再派生新的 worker
- 计算结果需要回到主线程更新界面时，仍要通过消息把数据发回主线程
- 把计算密集型任务移出主线程，可以避免长时间阻塞界面交互与渲染
- 专用 worker、共享 worker、服务 worker 是不同类型，作用域与生命周期各不相同

## 共享内存与 SharedArrayBuffer

- 普通 `ArrayBuffer` 经 `postMessage` 传递是拷贝或转移；`SharedArrayBuffer` 可以在多个执行上下文之间共享同一块内存
- 共享内存要求页面处于跨源隔离状态，可以用 `crossOriginIsolated` 判断当前上下文是否满足条件
- 多个线程同时读写共享内存时，需要配合 `Atomics` 原子操作做同步，避免竞态写入
- `WebAssembly.Memory` 可以带 `shared` 标志创建，其底层 buffer 就是 `SharedArrayBuffer`
- 共享数据块在一个上下文里的修改，最终会对其他上下文可见，可见时机取决于系统调度
- 共享内存减少了消息拷贝的开销，但引入了同步与竞态处理的复杂度

## Node.js 的 worker_threads

- `node:worker_threads` 模块提供并行执行的 JS 线程，适合处理 CPU 密集型任务；I/O 密集型工作仍优先使用内置的异步 I/O
- 线程之间通过 `worker.postMessage()` 与 `parentPort` 收发消息，可以转移 `ArrayBuffer` 或共享 `SharedArrayBuffer`
- `isMainThread` 用来判断当前代码是否运行在主线程；worker 内调用 `process.exit()` 只会结束当前线程，不会退出整个进程
- 与 `child_process`、`cluster` 不同，worker 线程之间可以共享内存，而不只是通过进程间通信交换数据
- 自定义消息通道可以用 `MessageChannel` 创建，把其中一个端口传给其他线程，便于按职责拆分通信链路
- Node 内置的异步 I/O 由事件循环与底层线程池承担，业务代码里不需要为常规 I/O 再开 worker
- worker 适合拆分长时间占用主线程的计算任务，任务粒度与通信开销需要一并权衡
- 跨线程传递的消息以可结构化克隆的值为限，函数、DOM 节点等不能直接发给 worker
- 任务拆出主线程后，通信次数与数据体积需要控制，避免线程间消息开销抵消并行收益
- 多线程场景下的状态变更集中通过消息或共享内存同步，不在各自上下文里保留副本
- 线程数量按 CPU 密集型任务的实际需要控制，避免过多线程带来调度开销
- 消息通道按职责拆分后，主线程与各 worker 的通信边界更清晰
- worker 内的异常通过错误事件上报主线程，便于集中排查

## 参考

- https://developer.mozilla.org/en-US/docs/Web/API/Worker
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Functions_and_classes_available_to_workers
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer
- https://nodejs.org/api/worker_threads.html
