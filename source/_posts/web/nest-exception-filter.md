---
title: Nest-异常过滤器
date: 2018-04-07 16:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-nest"></div>

# Nest

## 异常过滤器
`
> Nest 内置了一个`异常处理层` ，负责处理应用程序中所有`未捕获的异常`。当应用程序代码未处理某个异常时，该层会捕获它并自动返回用户友好的响应

## 使用范围

1. 方法范围
2. 控制器范围
3. 全局范围  

## ExceptionFilter 接口与 catch 签名

- 自定义异常过滤器需要实现 `ExceptionFilter` 接口，接口要求提供 `catch(exception, host)` 方法，其中 `exception` 是当前正在处理的异常对象，`host` 是 `ArgumentsHost` 上下文对象

```ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

- 通过 `host.switchToHttp()` 取出 HTTP 场景下的响应对象和请求对象，再直接控制返回给客户端的响应内容
- `ArgumentsHost` 是跨上下文的抽象，同一套过滤器逻辑也可以面向微服务、WebSocket 等场景编写
- 过滤器在这里完全接管响应流程：可以自定义响应体结构、附加时间戳和请求路径、记录异常日志
- 过滤器可以只处理特定类型的异常，也可以作为兜底处理所有未捕获异常；需要跨平台同时支持 Express 和 Fastify 时，通过 `HttpAdapterHost` 拿到底层适配器再统一回复，而不是直接调用平台专属对象
- 异常过滤器在异常已经抛出之后才介入，和守卫、拦截器、管道一起构成完整的请求处理与错误处理链路

## @Catch 绑定异常类型

- `@Catch()` 装饰器给过滤器绑定元数据，告诉 Nest 这个过滤器只查找对应类型的异常；参数可以传单个异常类，也可以传逗号分隔的多个异常类
- 不传参数写成 `@Catch()` 时，过滤器捕获所有未处理的异常，不区分类型
- 同时注册捕获全部异常的过滤器和绑定特定类型的过滤器时，捕获全部的那个要先声明，绑定特定类型的过滤器才有机会处理它负责的异常
- 过滤器绑定既可以传类（由框架实例化并支持依赖注入），也可以传就地 `new` 出来的实例；需要注入依赖时应传类而不是实例

## 作用范围的注册方式

- 方法范围：在单个处理方法上用 `@UseFilters()` 绑定过滤器，只作用于该方法
- 控制器范围：在控制器类上用 `@UseFilters()` 绑定，作用于该控制器内的所有处理方法
- 全局范围：在启动文件里调用 `app.useGlobalFilters()` 注册，作用于整个应用的所有控制器和处理方法
- 从模块内部注册全局过滤器可以使用 `APP_FILTER` token，这样过滤器还能经过依赖注入容器注入依赖；直接用 `useGlobalFilters()` 注册的全局过滤器处于任何模块上下文之外，无法注入依赖
- 中间件抛出的异常也由异常处理层接管，但此时还没选中路由处理程序，只有全局过滤器会生效，方法范围和控制器范围的 `@UseFilters()` 绑定不会被调用

## 内置 HTTP 异常与默认响应

- Nest 内置了全局异常过滤器，负责处理 `HttpException` 及其子类；无法识别的异常（既不是 `HttpException` 也不是其子类）会生成默认响应 `{ statusCode: 500, message: 'Internal server error' }`
- `HttpException` 构造器接收响应体和 HTTP 状态码两个参数：响应体可以是字符串（只覆盖消息）或对象（覆盖整个响应体），状态码建议使用 `HttpStatus` 枚举
- 框架还提供了一批内置异常类，如 `BadRequestException`、`UnauthorizedException`、`ForbiddenException`、`NotFoundException` 等，分别对应常见的错误状态码
- `HttpException` 的第三个可选参数可以传入错误原因对象，用于记录导致异常的内部错误；这个原因对象不会被序列化进响应体，只便于日志排查
- 内置异常类对应常见的 HTTP 错误语义，业务代码优先抛出这些语义明确的异常，而不是直接 `throw new Error()`，这样异常处理层才能给出合适的状态码
- 想复用内置全局过滤器的行为、只在特定条件下覆盖处理，可以继承 `BaseExceptionFilter` 并调用父类的 `catch()` 方法
- 过滤器里拿到的异常对象可以通过类型判断区分是哪一类异常，再分别决定响应体和状态码；处理完异常后要主动回复响应，否则请求会挂起

## HttpException 与内置异常

- `HttpException` 是 Nest 提供的基础异常类，构造参数为响应体、状态码，第三个参数可传入 `cause` 说明异常原因
- `@Catch()` 不传参数时捕获所有类型异常；传入异常类则只捕获匹配类型
- 内置常见异常包括 `BadRequestException`、`UnauthorizedException`、`ForbiddenException`、`NotFoundException`、`InternalServerErrorException` 等，对应常见 HTTP 状态码
- 无法被识别的异常（非 `HttpException`）默认返回 500 状态码和 `Internal server error` 消息
- 异常响应体结构由过滤器决定，内置默认结构包含 `statusCode` 和 `message` 字段
- 抛出自定义业务异常时，优先继承 `HttpException` 并带上对应状态码和错误信息，过滤器据此生成规范响应
- `@Catch()` 可以传入多个异常类，匹配其中任意一种；异常类之间的继承关系会被用于匹配
- 过滤器拿到的 `exception` 是实际抛出的对象，`host` 是 `ArgumentsHost`，通过它切换到 HTTP、RPC 或 WebSocket 上下文
- 过滤器在决定响应内容时，应区分已知的业务异常和未预期的系统异常，避免把内部细节直接返回给客户端

## 过滤器的注册与执行位置

- 方法范围用 `@UseFilters()` 挂在处理方法上，控制器范围挂在控制器类上，只覆盖对应层级
- 全局过滤器通过 `app.useGlobalFilters()` 注册，或在模块内用 `APP_FILTER` token 注册；后者可以注入依赖
- 全局过滤器作用于所有路由；从模块外用 `useGlobalFilters()` 注册的过滤器无法注入依赖
- 过滤器在异常从处理方法以及拦截器后置、管道等环节抛出后被调用，负责生成最终错误响应
- 中间件阶段抛出的异常，只有全局过滤器能够接到
- 跨平台场景下通过 `HttpAdapterHost` 获取底层平台适配器，避免直接绑定 Express 或 Fastify 对象
- 需要复用内置错误处理逻辑时，可以继承 `BaseExceptionFilter`，在其基础上扩展自定义响应

## 参考

- https://docs.nestjs.com/exception-filters
