---
title: 计算机网络-WebSocket
date: 2018-01-15 23:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-net"></div>

# 计算机网络

## WebSocket

* WebSocket 协议运行在 TCP 协议之上，与 HTTP 协议同属于应用层网络数据传输协议。WebSocket 相比于 HTTP 协议最大的特点是: 允许服务端主动向客户端推送数据(从而解决 HTTP 协议实现中客户端只能通过轮询方式获取服务端推送数据造成的资源消耗和消息延时等问题)
* WebSocket 是全双工的协议

## 轮询

* 短轮询：一般是由客户端每隔一段时间（如每隔5s）向服务器发起一次普通 HTTP 请求。服务端查询当前接口是否有数据更新，若有数据更新则向客户端返回最新数据，若无则提示客户端无数据更新。
* 长轮询：一般是由客户端向服务端发出一个设置较长网络超时时间的 HTTP 请求，并在 HTTP 连接超时前，不主动断开连接；待客户端超时或有数据返回后，再次建立一个同样的 HTTP 请求，重复以上过程

## 协议握手

WebSocket 协议握手复用了 HTTP 协议：

1. 客户端通过 HTTP 请求与 WebSocket 服务端协商升级协议到 Websocket 协议。
2. 服务端通过 HTTP 响应数据回应客户端的升级请求，完成协议握手。

完成协议握手后，后续的数据交换则遵照 WebSocket 的协议进行。

## 关闭连接

* 由于 WebSocket 是全双工的协议，因此客户端和服务端都可以选择关闭 WebSocket 连接

## 适用场景

* WebSockets 适用于多个客户端和一个服务器端实现实时通信的场合

1. 多人在线游戏网站
2. 在线聊天室
3. 实时体育或者新闻评论网站
4. 实时交互用户信息的社交网站

## 握手报文的具体内容

- 握手阶段客户端使用普通 HTTP 请求向服务器协商升级协议，请求头包含 Upgrade: websocket 和 Connection: Upgrade
- 请求头 Sec-WebSocket-Key 携带一个随机的 16 字节值，做 Base64 编码后随请求发出，每个连接重新生成
- 服务器接受升级时返回 101 Switching Protocols 状态行，并用 Sec-WebSocket-Accept 头回应
- Sec-WebSocket-Accept 的值由 Sec-WebSocket-Key 与固定 GUID 258EAFA5-E914-47DA-95CA-C5AB0DC85B11 拼接后取 SHA-1 摘要，再做 Base64 编码得到
- 响应状态码不是 101 时，连接不按 WebSocket 协议建立，HTTP 语义仍然适用
- 握手成功后连接上的数据交换遵照 WebSocket 帧协议，不再使用 HTTP 报文格式

## 数据帧的结构

- WebSocket 把一条消息拆成一到多个数据帧传输，帧是协议的基本单位
- 帧首部包含 FIN 位、保留位、操作码 opcode、掩码标志位和载荷长度
- FIN 位标明当前帧是否为一条消息的最后一帧，操作码区分帧类型：文本帧、二进制帧以及关闭、心跳等控制帧
- 从客户端发往服务器的帧必须经过掩码处理，服务器发往客户端的帧不做掩码
- 控制帧包括关闭帧、Ping 帧和 Pong 帧，Ping 与 Pong 用于连接存活探测
- 一方发出关闭控制帧后不再继续发送数据，收到对方关闭帧后再关闭连接

## 浏览器端 API

- 浏览器通过 new WebSocket(url) 创建连接对象，ws:// 是明文连接，wss:// 是经 TLS 加密的连接

```js
const socket = new WebSocket('wss://example.com/socket');

socket.addEventListener('open', () => {
  socket.send('hello server');
});

socket.addEventListener('message', (event) => {
  console.log('received:', event.data);
});

socket.addEventListener('close', () => {
  console.log('connection closed');
});
```

- 连接对象通过 open、message、close、error 四个事件分别对应连接打开、收到消息、连接关闭和出错
- send() 方法把要发送的数据排入传输队列，可发送字符串或二进制数据
- 二进制消息可以承载 ArrayBuffer 或 Blob，文本消息以字符串形式到达 message 事件
- readyState 表示当前连接状态：0 是 CONNECTING 正在建立，1 是 OPEN 可以通信，2 是 CLOSING 正在关闭，3 是 CLOSED 已关闭
- bufferedAmount 表示当前排队待发送的字节数，protocol 返回服务器选中的子协议
- 连接出错时触发 error 事件，随后通常会进入 close 状态
- 客户端和服务器都可以主动发起关闭，关闭握手完成后连接释放

## 握手与加密连接的补充要点

- 握手请求仍遵循 HTTP 语义，服务器拒绝升级时返回普通 HTTP 错误响应
- Sec-WebSocket-Accept 用于客户端确认服务器理解 WebSocket 握手，防止把非 WebSocket 连接误当成 WebSocket
- 文本帧与二进制帧的区别由操作码标明，message 事件按帧类型给出字符串或二进制数据
- wss:// 连接经过 TLS 保护，握手阶段同时完成证书校验和加密协商

## 参考

- https://www.rfc-editor.org/rfc/rfc6455
- https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
- https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
