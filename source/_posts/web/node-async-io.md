---
title: Node.js-异步IO
date: 2018-04-11 14:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-node"></div>

# Node.js

## 异步模型

## 一、异步 I/O

- 基于`事件驱动`的`非阻塞 I/O` 架构
- Node 中的事件主要来自于 1. 文件 I/O 2. 网络 I/O

### 1.1 非 I/O 的异步 API

1. setTimeout()、setInterval()
2. process.nextTick() 回调函数存储在`数组`中，每次 `Tick` 过后会将数组中`所有的回调函数`执行完毕(`!类似于微任务`)
3. setImmediate() 回调函数存储在`链表`中，每次 `Tick` 之后只会将链表中的`第一个`回调函数执行，然后等待下一轮(`!类似于宏任务`)

## 二、Node 的优点

- 处理多任务时无需创建新的线程或进程，上下文切换的代价小也不需要关注多线程带来的锁问题。
- 充分利用 CPU 资源，使得 CPU 无需等待 I/O 等耗时的操作。对于 I/O 密集型系统具有较高的性能。

## 三、Node 的缺点

- 在面对大量的 CPU 计算时 Node 的计算能力并不差，主要的挑战在于长时间的运算会导致 CPU 时间片无法被释放，使得 Node 无法发起后续的 I/O 任务
- 解决方案：适当的将大任务进行拆分，使得运算能够及时释放，不长时间阻塞后续 I/O 任务调用(类似于浏览器中使用 setTimeout 拆分任务)

1. 无法充分利用多核 CPU
2. 错误会引起整个应用的退出
3. 大量计算占用 CPU 导致无法继续调用异步 I/0

## 事件循环的阶段

- Node 默认使用单条 JavaScript 线程，通过把操作卸载给系统内核来实现非阻塞 I/O；事件循环负责在后台操作完成后，把对应回调加入队列并最终执行
- 事件循环按阶段依次处理回调，每个阶段维护一个 FIFO 队列：timers 阶段执行 `setTimeout()`、`setInterval()` 到期的回调；pending callbacks 阶段执行推迟到下一轮循环的部分 I/O 回调；idle、prepare 为内部使用；poll 阶段取回新的 I/O 事件并执行相关回调；check 阶段执行 `setImmediate()` 回调；close callbacks 阶段执行如 `socket.on('close', ...)` 这类关闭回调
- 进入某个阶段后，循环会先执行该阶段特有的操作，再把队列里的回调执行到耗尽或达到回调数量上限，然后进入下一阶段
- 定时器指定的是回调最早可以执行的阈值，而不是精确执行时刻；操作系统调度或其他回调耗时都可能让回调延后执行
- poll 阶段在没有已调度定时器且队列为空时，会等待新的回调加入；一旦队列有事件就同步执行完队列里的回调
- 在 I/O 回调内部同时安排 `setTimeout(0)` 和 `setImmediate()` 时，`setImmediate()` 回调总是先执行；脱离 I/O 循环在主模块里调用两者，顺序受进程性能影响并不确定

## fs/promises 与异步文件 I/O

- `node:fs/promises` 模块提供基于 Promise 的文件系统方法，异步操作完成后 Promise 被兑现，配合 `async/await` 书写文件读写逻辑

```js
const { readFile, writeFile } = require('node:fs/promises');

async function run() {
  const contents = await readFile('./package.json', { encoding: 'utf8' });
  await writeFile('./copy.txt', contents);
}
run();
```

- Promise 形式的文件操作在底层线程池上执行，脱离事件循环线程完成文件系统操作，因此不会长时间阻塞主线程上的后续 I/O 任务
- `readFile()` 不传编码时返回 `Buffer`，传了 `encoding` 选项时返回字符串；`writeFile()` 写入字符串、Buffer 等数据，文件已存在时会被覆盖
- 对同一个文件多次并发修改时要注意安全性，操作之间不是同步也不是线程安全的；大文件或高频写入场景推荐使用流（`createWriteStream`）而不是反复调用便捷方法
- `open()` 返回的 `FileHandle` 是对数字文件描述符的包装，用完应显式调用 `close()` 关闭，避免文件描述符泄漏
- 多数 Promise 形式的文件操作都接受 `signal` 选项，可以用 `AbortController` 中止进行中的操作；中止是尽力而为，部分底层系统请求仍可能已经写入

## EventEmitter 与事件机制

- Node 核心 API 大量围绕异步事件驱动架构构建：被称为 emitter 的对象发出命名事件，挂载在事件上的函数（listener）随之被调用
- 所有发事件的对象都是 `EventEmitter` 类的实例，通过 `on()`（别名 `addListener`）挂载监听器，通过 `emit()` 触发事件，`once()` 挂载只触发一次的监听器

```js
const { EventEmitter } = require('node:events');
const myEmitter = new EventEmitter();

myEmitter.on('event', () => console.log('listener called'));
myEmitter.emit('event');
```

- 事件触发时，注册在该事件上的所有监听器按注册顺序同步调用，监听器的返回值会被忽略和丢弃
- `net.Server` 每次有连接接入时发事件，`fs.ReadStream` 文件打开时发事件，流在有数据可读时发事件，这些都是事件机制在文件 I/O 和网络 I/O 上的具体表现
- `once()` 注册的监听器在事件触发后先注销再调用，因此同一次事件只会执行一次；`off()` 或 `removeListener()` 用来移除已挂载的监听器
- 监听器默认按添加顺序调用；需要在出错时收到通知，可以监听发射器的 `error` 事件，未处理的 `error` 会作为异常抛出

## nextTick 与 setImmediate 的执行时机

- `process.nextTick()` 严格说不属于事件循环的某个阶段：当前操作完成后、事件循环继续往下走之前，`nextTickQueue` 里的回调就会被处理
- 在某个阶段调用 `process.nextTick()`，所有传入的回调会在事件循环进入下一阶段之前执行；递归调用 `nextTick()` 可能把 I/O 饿死，让循环到不了 poll 阶段
- `setImmediate()` 的回调在事件循环的 check 阶段执行，设计上是在当前 poll 阶段完成后立即运行脚本
- 两者命名容易混淆：`process.nextTick()` 在同一阶段紧接着触发，`setImmediate()` 在下一轮事件循环触发；官方建议在一般场景下优先使用更容易推理的 `setImmediate()`
- 事件循环每一轮在阶段之间流转，只有当前队列耗尽或达到回调数量上限才进入下一阶段，单个长时间回调可能拖住所在阶段
- 定时器到期检查、`setImmediate` 回调、关闭事件回调各有固定归属阶段，混在一起调用时顺序要按阶段规则判断，而不是按代码书写顺序
- 网络 I/O 和文件 I/O 是 Node 事件的主要来源，服务器接入连接、流可读可写、文件打开关闭等都会产生对应事件交给监听者处理

## 参考

- https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
- https://nodejs.org/api/fs.html
- https://nodejs.org/api/events.html
