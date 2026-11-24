---
title: 计算机网络-鉴权手段
date: 2018-01-21 21:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-net"></div>

# 计算机网络

## 鉴权手段

## 一、Session + Cookie(经典方案)

- 传统的、`有状态` 的认证方式

### 1.1工作流程

1. 登录: 浏览器提交用户名和密码到后端。
2. 验证: 后端验证凭证，验证成功后，在服务器内存或数据库（如 Redis）中创建一个 Session 对象，用于存储用户信息。这个 Session 有一个唯一的 ID，即 Session ID。
3. 种下 Cookie: 后端通过 Set-Cookie HTTP 响应头，将这个 Session ID 发送给浏览器。
4. 自动携带: 浏览器会自动保存这个 Cookie。在后续的每一次请求中，浏览器都会自动将这个 Cookie 附加在 HTTP 请求头中发送给后端。
5. 身份识别: 后端收到请求后，从 Cookie 中读取 Session ID，然后根据这个 ID 找到对应的 Session 对象，从而得知当前请求是哪个用户发来的。

### 1.2优点

1. 机制简单, 浏览器支持良好，能自动处理 Cookie 的发送

### 1.3缺点

1. 移动端支持不佳，Cookie 在移动端的支持较差，且容易被拦截。
2. 有状态，难以扩展：每个用户的 Session 信息都需要存储在服务端，当用户量巨大时，对服务器内存/数据库是巨大开销。在分布式/集群部署时，需要处理 Session 同步或共享问题。
3. CSRF风险

## 二、JWT

- JWT 的全称是 JSON Web Token
- 理论上如果被其他人拿到了 JWT，他就可以伪造请求。所以使用 HTTPS 通信信道加密来保证 JWT 的安全性。

### 2.1 JWT结构
```js
// Header: 包含 JWT 的类型和加密算法
{ "alg": "HS256", "typ": "JWT" }

// Payload: 包含 JWT 的数据
{ "sub": "1234567890", "name": "John Doe", "iat": 1516239022 }

// Signature: 包含 JWT 的签名
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

### 2.2 工作流程

1. 登录: 用户提交用户名密码。
2. 签发 Token: 后端验证成功后，生成一个包含用户标识和过期时间的 JWT，用服务器密钥进行签名，然后将整个 JWT 字符串返回给前端。
3. 前端存储: 前端（JS）收到 JWT后，手动将其存储在某个地方，常见的是 localStorage、sessionStorage 或 HttpOnly Cookie。
4. 手动携带: 在后续的每一次 API 请求中，前端都需要手动将 JWT 放在 HTTP 请求头的 Authorization 字段中，通常以 Bearer `<token>` 的形式。
5. 身份识别: 后端收到请求后，从 Authorization 头中取出 JWT，用同一个密钥验证其签名是否有效。如果签名有效，后端就完全信任 Payload 中的信息，从而识别用户身份。

### 2.3 优点

1. 无状态，易于扩展: 服务器不需要存储任何 Session 信息，每次请求都是自包含的。极利于分布式部署和水平扩展。
2. 跨平台/跨域友好: Token 可以轻松地在 Web、移动 App、微服务之间传递。
3. 功能强大: Payload 可以携带一些非敏感的业务数据（如角色），避免了额外查询。

### 2.4 缺点

1. 令牌吊销困难: 由于无状态，一旦签发，令牌在过期前就一直有效。

## 三、HTTP Basic 认证

- Basic 是 HTTP 本身定义的一种认证方案，凭据放在 Authorization 请求头中发送
- 客户端首次访问受保护资源时，服务器返回 401 Unauthorized 响应，并通过 WWW-Authenticate 头告知可用的认证方案；客户端取得凭据后再带 Authorization 头重新请求
- Basic 方案把 user-id 和 password 用冒号拼接后做 Base64 编码，Base64 可以被直接解码，凭据在网络上相当于明文传输，必须配合 TLS（HTTPS）使用
- Basic 认证本身不保存会话状态，每次请求都要携带凭据；它和 Cookie 会话是两套独立的机制

```http
Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l
```

## 四、Cookie 的常用属性

- HttpOnly：带该属性的 Cookie 不能被 JavaScript 的 Document.cookie 读取，只能随请求发送给服务器，用于缓解跨站脚本窃取会话标识
- Secure：带该属性的 Cookie 只在 HTTPS 加密请求中发送，不安全的 HTTP 连接不会携带（本地主机除外）
- SameSite：控制 Cookie 是否随跨站点请求发送，取值 Strict、Lax、None；未设置 SameSite 时浏览器按 Lax 处理；SameSite=None 必须同时设置 Secure
- Domain 与 Path：限定 Cookie 被发送到哪些主机和路径；不指定 Domain 时默认只作用于当前主机，不包含子域名
- 会话期 Cookie 不写过期时间，浏览器会话结束后删除；持久 Cookie 用 Expires 或 Max-Age 指定生命周期

## 五、前端存储位置的区别

- localStorage：写入后长期保留，除非手动清除；数据不会随请求自动携带，需要前端代码手动读取并放进 Authorization 头
- sessionStorage：只在当前标签页会话内有效，关闭标签页后清除
- HttpOnly Cookie：由浏览器在每次请求中自动携带，JavaScript 无法读取
- 把 JWT 存在 localStorage 或 sessionStorage 中，都要面对 XSS 窃取的风险；存在 HttpOnly Cookie 中可以避免脚本读取，但又需要借助 SameSite 等属性约束跨站请求

## 六、JWT 的校验要点

- JWT 的签名只保证 Payload 在签发后未被篡改，不保证内容保密；Payload 是 Base64URL 编码而不是加密，不能存放敏感信息
- exp 声明标识过期时间，到达该时间后令牌不应再被接受；nbf 声明标识在此时间之前不接受；iat 声明标识签发时间
- 签名算法写在 Header 的 alg 字段，常见 HS256（HMAC 对称密钥）和 RS256（RSA 非对称密钥）
- 无状态意味着令牌签发后无法主动吊销；要提前让它失效，需要额外维护吊销名单、缩短有效期，或改用可共享状态的会话方案

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Reference/Headers/Authorization
- https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/Cookies
- https://www.rfc-editor.org/rfc/rfc7617
- https://www.rfc-editor.org/rfc/rfc7519
