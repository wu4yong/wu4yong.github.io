---
title: Nest-拦截器
date: 2018-04-08 01:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-nest"></div>

# Nest

## 拦截器

## 使用场景

1. 在函数执行之前/之后绑定额外的逻辑
2. 转换从函数返回的结果
3. 转换从函数抛出的异常
4. 扩展基本函数行为
5. 根据所选条件完全重写函数 (例如, 缓存目的)

### 使用范围

1. 方法范围
2. 控制器范围
3. 全局范围

## NestInterceptor 接口与两个参数

- 拦截器是用 `@Injectable()` 装饰的类，实现 `NestInterceptor` 接口，接口要求提供 `intercept()` 方法
- `intercept()` 接收两个参数：第一个是 `ExecutionContext` 执行上下文，和守卫拿到的是同一类对象；第二个是 `CallHandler`，暴露 `handle()` 方法用来在拦截器里调用路由处理程序

```ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
```

- 如果 `intercept()` 实现里不调用 `handle()`，路由处理程序根本不会被执行；拦截器本质上包裹了整条请求/响应流
- `handle()` 返回的是 RxJS `Observable`，Nest 订阅拦截器返回的流，处理程序的结果沿着这条流最终发给调用方
- 拦截器和控制器、Provider、守卫一样，可以通过构造器注入依赖
- `NestInterceptor<T, R>` 是泛型接口：`T` 是 `next.handle()` 返回流里发射的值类型，`R` 是 `intercept()` 返回流里发射的值类型
- 拦截器的 `intercept()` 方法可以是同步的，也可以声明为 `async`，在返回流之前先 `await` 必要的异步操作

## 请求前与响应后的逻辑

- 处理程序之前的逻辑直接写在 `handle()` 调用之前，例如打印进入请求的日志、记录开始时间
- 处理程序之后的逻辑通过对流施加 RxJS 操作符完成：`map` 用来转换成功返回的结果，`tap` 用来在不干扰响应的情况下记录日志或计时，`catchError` 用来替换处理程序抛出的异常
- 响应映射的典型做法是用 `map()` 把处理程序返回的值包进统一结构，例如把 `[]` 包装成 `{ data: [] }`
- 异常映射用 `catchError()` 把原始异常转换成框架内置异常再抛出；缓存场景下如果命中缓存，可以直接返回 `of(...)` 而不再调用 `handle()`
- `tap` 的成功回调在处理程序抛异常时不会执行，需要在出错时也跑逻辑，要给 `tap` 传带 `error` 回调的观察者对象，或使用 `finalize` 操作符
- 除了日志、包装结果和转换异常，拦截器还可以实现超时控制：在流上叠加 `timeout` 操作符，超时后转成 `RequestTimeoutException` 抛出

## 拦截器的注册范围

- 方法范围：在单个处理方法上用 `@UseInterceptors()` 绑定，只作用于该方法
- 控制器范围：在控制器类上用 `@UseInterceptors()` 绑定，作用于该控制器内的所有处理方法
- 全局范围：在启动文件里调用 `app.useGlobalInterceptors()` 注册，作用于整个应用；从模块内部用 `APP_INTERCEPTOR` token 注册的全局拦截器可以注入依赖
- 从模块外注册的全局拦截器处于任何模块上下文之外，无法注入依赖；需要注入依赖时，用 `APP_INTERCEPTOR` token 在模块内注册
- 拦截器的响应映射只在标准响应方式下生效：处理程序用 `@Res()` 自己占用响应对象时，流上的结果转换不再起作用
- 多个拦截器按注册顺序包裹处理程序，外层拦截器的前置逻辑先执行、后置逻辑后执行，形成嵌套的处理链
- 拦截器适合承载跨整个应用的可复用方案，例如统一替换空值、统一附加响应字段，绑定到全局后所有注册的处理方法自动生效

## RxJS 流上的常用操作

- 拦截器返回的是 RxJS Observable，常用 `map()` 转换响应值，`tap()` 做不改变值的副作用（日志、计时）
- `catchError()` 捕获流内错误并转成异常或新的 Observable；`timeout()` 给处理过程加超时；`finalize()` 在流结束后做收尾
- `of()` 用于直接构造一个只发一次值的 Observable；拦截器可以完全替换 `next.handle()` 返回的流
- `next.handle()` 不被调用时，路由处理程序不会执行；调用后拿到的流在处理程序返回结果后发出响应值
- 拦截器在处理方法前后都能介入：前置逻辑在调用 `next.handle()` 之前写，后置逻辑在对流的 `map`、`tap` 等操作里写

## 拦截器接口的补充约定

- 方法、控制器范围用 `@UseInterceptors()` 注册；全局拦截器用 `app.useGlobalInterceptors()` 或模块内 `APP_INTERCEPTOR` token 注册
- 用 token 注册的全局拦截器可以注入依赖；从模块外用 `useGlobalInterceptors()` 注册的无法注入
- 拦截器接口是 `NestInterceptor`，可带泛型 `NestInterceptor<T, R>` 标明输入响应类型和输出响应类型
- `intercept()` 方法可以声明为异步，但返回值仍需是 Observable 形式的流
- 控制器或方法内使用 `@Res()` 直接占用响应对象后，标准的流响应映射会失效，拦截器对流的包装也不再生效
- 多个拦截器按注册顺序嵌套：外层先执行前置逻辑，内层再执行前置逻辑，返回时按相反顺序执行后置逻辑

## 拦截器适合做什么

- 统一响应包装：把业务返回值包成固定结构，附带状态码、消息等字段
- 日志与耗时统计：记录请求进入和完成的时间，计算处理耗时
- 缓存处理：对可缓存的响应直接返回结果，不调用下游处理程序
- 异常转换：把流内错误转换成统一的业务异常
- 超时与降级：给下游调用加超时，超时后返回兜底结果

## 参考

- https://docs.nestjs.com/interceptors
