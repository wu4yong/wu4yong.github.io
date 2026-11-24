---
title: Nest-守卫
date: 2018-04-06 22:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-nest"></div>

# Nest

## 守卫

- 守卫有一个单独的责任。它们根据运行时出现的某些条件（例如权限，角色，访问控制列表等）来确定给定的请求是否由路由处理程序处理。这通常称为`授权`

## 使用范围

1. 函数范围
2. 全局范围

## CanActivate 接口与返回值

- 守卫是用 `@Injectable()` 装饰的类，实现 `CanActivate` 接口，接口要求提供 `canActivate(context: ExecutionContext)` 方法

```ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

- `canActivate` 的返回值决定请求是否被放行：返回 `true` 请求继续处理，返回 `false` Nest 拒绝该请求；返回值可以是同步布尔值，也可以是 `Promise` 或 `Observable`
- 守卫返回 `false` 时框架抛出 `ForbiddenException`，需要返回其他错误响应时，可以在守卫里主动抛出对应的异常
- 守卫在所有中间件之后、任何拦截器和管道之前执行，是请求进入业务逻辑前的一道关卡
- 守卫不负责修改响应或编排业务结果，只给出放行或拒绝的判断；被拒绝的请求不会到达路由处理程序
- 守卫可以返回异步结果：`canActivate` 返回 `Promise` 或 `Observable` 时，Nest 订阅其结果后再决定是否放行

## 守卫与中间件的区别

- 中间件天然不感知上下文：调用 `next()` 之后到底会执行哪个处理方法，中间件并不知道；守卫能拿到 `ExecutionContext`，清楚接下来要执行的是哪个控制器和方法
- 校验令牌、把用户信息挂到 request 这类不依赖路由元数据的工作，适合放在中间件；按路由上的角色、权限元数据做判断的工作，适合放在守卫
- 守卫可以读取挂在路由处理方法上的自定义元数据，结合 `Reflector` 取出当前路由要求的角色，再和当前用户的权限比对
- 中间件是 Express 风格的请求/响应/next 函数，守卫是 Nest 托管的可注入类，和管道、拦截器、异常过滤器一样可以走依赖注入

## 守卫的注册范围

- 方法范围：在单个处理方法上用 `@UseGuards()` 绑定，只作用于该方法
- 控制器范围：在控制器类上用 `@UseGuards()` 绑定，作用于该控制器内的所有处理方法
- 全局范围：在启动文件里调用 `app.useGlobalGuards()` 注册，作用于整个应用；从模块内部用 `APP_GUARD` token 注册的全局守卫可以注入依赖
- `@UseGuards()` 接收单个守卫或逗号分隔的守卫列表，多个守卫按注册顺序依次执行
- 从模块外注册的全局守卫处于任何模块上下文之外，无法注入依赖；需要注入依赖时，用 `APP_GUARD` token 在模块内注册
- `APP_GUARD` 是引导阶段被框架消费的伪提供者，不能再通过 `app.get()` 取出或注入到别处

## 认证与授权的分工

- 认证（authentication）确认调用者是谁，通常表现为校验请求头里的令牌并解析出用户身份；授权（authorization）确认这个身份能不能访问当前路由，是守卫最常见的用途
- 实际项目中常把解析身份的逻辑放在认证守卫或中间件里，把身份挂到 request 对象上，再由授权守卫比对路由要求的角色
- 守卫本身不限制具体实现方式，`validateRequest` 这类校验逻辑可以简单也可以复杂，职责单一：只判断请求是否被允许进入处理程序
- 角色守卫的典型做法是：从上下文取出 request 上的用户身份，读取路由元数据要求的角色，再把两者比对，匹配则放行
- 校验不通过时主动抛出对应的内置异常，可以返回比默认 `ForbiddenException` 更贴合场景的错误响应
- 守卫访问路由元数据依赖 `Reflector`，`Reflector` 由框架从 `@nestjs/core` 导出，是构建通用守卫的常用工具
- 守卫抛出的任何异常都会进入异常处理层，由全局过滤器和当前上下文绑定的过滤器统一生成错误响应

## 认证与授权的配合流程

- 守卫最常见的两类职责：认证（authentication）确认调用者是谁，授权（authorization）判断已确认身份能否访问当前路由
- 认证通常在前置守卫里完成，例如校验请求头里的令牌，解析出当前用户；授权在认证基础上结合路由元数据判断角色或权限
- 守卫返回 `true` 放行，返回 `false` 时 Nest 默认抛出 `ForbiddenException`
- 守卫可以从 `ExecutionContext` 取出 request、response 或 RPC 上下文，据此判断当前调用

## 守卫的元数据与全局注册

- 自定义路由元数据用 `@SetMetadata()` 写入，守卫通过注入的 `Reflector` 读取，实现“带权限标记的路由才校验”这类策略
- `Reflector` 从 `@nestjs/core` 导出，用于在守卫、拦截器等扩展点读取装饰器附加的元数据
- 方法、控制器范围用 `@UseGuards()` 注册；全局守卫用 `app.useGlobalGuards()` 或模块内 `APP_GUARD` token 注册
- 用 `APP_GUARD` 注册的是伪提供者，不能通过 `app.get()` 从容器取回
- 守卫是在拦截器、管道、处理方法之前执行的扩展点，未放行的请求不会进入后续链路
- 守卫的 `canActivate()` 可以是同步返回布尔值，也可以返回 Promise 或 RxJS Observable，支持异步鉴权

## 守卫在链路中的位置

- 守卫有 `ExecutionContext` 上下文，能拿到路由元数据和当前处理程序；中间件拿到的是原始 request/response
- 守卫可以访问 DI 容器并读取元数据，适合做按路由策略变化的鉴权；中间件更接近平台层的通用处理
- 守卫处于链路的鉴权阶段，请求编排和业务方法在守卫放行之后才执行
- 守卫可以组合使用：前置守卫先完成认证解析身份，后续守卫再依据身份和路由元数据做授权判断
- 守卫内部读取的请求对象来自 `ExecutionContext` 切换后的 HTTP 上下文，不直接依赖底层平台类型
- 认证信息解析后可以挂到 request 对象上，供后续守卫、管道、拦截器和处理方法读取

## 参考

- https://docs.nestjs.com/guards
