---
title: Nest-中间件
date: 2018-04-06 11:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-nest"></div>

# Nest

## 中间件

- 在`路由`处理程序`之前`调用的函数

## 使用范围

1. 控制器范围
2. 路由范围
3. 全局范围

## 函数式中间件

- 当您的中间件没有任何依赖关系时，我们可以考虑使用函数式中间件。

## NestMiddleware 接口与 use 签名

- 类形式的中间件用 `@Injectable()` 装饰，并实现 `NestMiddleware` 接口，接口要求提供 `use(req, res, next)` 方法，签名和 Express 中间件一致

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
```

- 中间件函数可以执行任意代码、修改 request 和 response 对象、结束请求/响应周期，或者调用 `next()` 把控制权交给栈里的下一个中间件
- 当前中间件不结束周期时必须调用 `next()`，否则请求会一直挂起；异步的 `use()` 可以声明为 `async`，让拒绝的 Promise 转发到异常处理层
- 类中间件支持依赖注入，可以在构造器里注入同一模块内可用的 provider

## 中间件的挂载方式

- 中间件不注册在 `@Module()` 装饰器里，而是在模块类的 `configure()` 方法中配置，包含中间件的模块需要实现 `NestModule` 接口
- 通过 `MiddlewareConsumer` 的 `apply()` 挂上中间件，再用 `forRoutes()` 指定生效的路由；`forRoutes()` 可以接收路径字符串、路径加请求方法的对象，或直接传控制器类

```ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('cats');
  }
}
```

- 要排除某些路由时，在 `forRoutes()` 之前链式调用 `exclude()`，传入要排除的路径或路由对象
- `apply()` 接收单个中间件或逗号分隔的多个中间件，多个中间件按传入顺序依次执行
- `forRoutes()` 可以接收路径字符串、带请求方法的路由对象，或直接传控制器类；`exclude()` 用来排除不挂载中间件的路由
- 路径支持通配符模式；不同底层适配器对子路径的匹配行为有差异，跨平台部署时需要留意
- 模块要实现 `NestModule` 接口并提供 `configure(consumer)` 方法，中间件不写在 `@Module()` 装饰器的元数据里
- 类中间件通过构造器注入同一模块内可用的 provider，函数式中间件没有这个能力

## 函数式中间件的写法

- 当中间件没有任何成员、方法和依赖时，可以直接定义成普通函数，而不是类，这种形式称为函数式中间件

```ts
import type { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log('Request...');
  next();
}
```

- 函数式中间件同样通过 `consumer.apply(logger).forRoutes(...)` 挂载，写法比类中间件更轻量
- 规范建议：中间件不需要依赖时优先使用函数式中间件；一旦需要注入 provider，再改用类中间件

## 全局中间件与依赖注入的限制

- 给所有已注册路由统一挂中间件，可以在启动文件里调用 `app.use()`，传入中间件函数
- 用 `app.use()` 注册的全局中间件由底层 HTTP 平台（Express 或 Fastify）处理，无法访问 Nest 的依赖注入容器，因此这里应使用函数式中间件
- 想在全局范围内使用可注入的类中间件，可以在模块的 `configure()` 里通过 `forRoutes('*')` 挂载
- 中间件抛出的异常同样由异常处理层接管，但此时还没选中路由处理程序，只有全局异常过滤器会生效，方法范围和控制器范围的过滤器不会被调用
- 异步中间件可以把 `use()` 声明为 `async`，让拒绝的 Promise 转发到异常层；包裹旧式 Express 中间件时，也可以通过 `next(err)` 把错误传给下一层
- 用 `MiddlewareConsumer` 挂载中间件前，默认会注册 `json` 和 `urlencoded` 两种请求体解析器；想自定义这些解析器，需要在创建应用时关闭默认 `bodyParser`
- 中间件按 `apply()` 传入的顺序依次执行，先注册的先拿到请求控制权，调用 `next()` 后才轮到下一个中间件
- 全局 `app.use()` 注册的中间件不经 Nest 的 `MiddlewareModule` 处理，而是由底层平台直接执行
- 中间件在路由处理程序之前运行，能执行任意代码、修改 request/response 对象、结束请求周期，或把控制权交给栈里的下一个中间件

## 参考

- https://docs.nestjs.com/middleware
