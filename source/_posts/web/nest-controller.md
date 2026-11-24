---
title: Nest-控制器
date: 2018-04-05 07:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-nest"></div>

# Nest

## 控制器

- 控制器负责`处理传入的请求`和向客户端`返回响应`

## 控制器的声明与路由前缀

- 控制器用 `@Controller()` 装饰器声明，装饰器关联的元数据被 Nest 用来构建路由映射表，把请求分发到对应的处理方法
- `@Controller()` 可以传入一个路径前缀，把一组相关路由归到同一前缀下，避免在每个方法上重复写路径

```ts
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

- 方法上的 `@Get()`、`@Post()` 等请求方法装饰器告诉 Nest 为哪个端点创建处理程序，端点由 HTTP 方法和路由路径共同确定
- 方法装饰器上再写路径时，最终路由是控制器前缀与方法路径拼接的结果，例如前缀 `cats` 加 `@Get('breed')` 对应 `GET /cats/breed`
- 处理方法的名字本身没有特殊含义，Nest 只把它和路由绑定，方法名可以按业务习惯命名
- 一个控制器可以定义多个路由，每个路由执行不同动作；不同控制器按路径前缀区分各自负责的请求

## 路由处理程序与参数装饰器

- 动态路径参数用路径里的参数令牌捕获，再通过 `@Param()` 装饰器在方法签名中取出
- 请求体用 `@Body()` 取出，查询字符串参数用 `@Query()` 取出，也可以直接注入原始的 request、response、next 对象

```ts
@Get(':id')
findOne(@Param('id') id: string) {
  return `This action returns a #${id} cat`;
}

@Post()
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

- `@Param()`、`@Body()`、`@Query()` 都可以传入键名，直接取对象上的某个属性；不传键名时拿到整个参数对象
- 查询参数到达时是字符串，类型注解本身不会做转换，需要数字等类型时配合管道完成转换
- 复杂查询参数（嵌套对象、数组）可以通过对应的查询字符串写法传递，再由控制器和管道解析
- 除了这几个常用装饰器，Nest 还提供 `@Headers()`、`@Ip()`、`@Session()` 等装饰器分别对应请求头、客户端 IP、会话等平台对象
- `@Request()`、`@Req()` 对应原始 request 对象，`@Response()`、`@Res()` 对应原始 response 对象，`@Next()` 对应下一个中间件函数

## 响应的两种处理方式

- 标准方式：处理程序直接返回值，返回对象或数组时 Nest 自动序列化为 JSON，返回原始类型时直接发送该值；默认状态码为 200，POST 请求默认 201，可用 `@HttpCode()` 调整
- 平台特定方式：用 `@Res()` 注入底层响应对象，调用原生方法构造响应，适合需要操作响应头、Cookie 等场景，但代码会绑定到具体平台
- 一旦处理程序使用了 `@Res()` 或 `@Next()`，标准响应方式会对该路由自动失效；只想顺手设置 Cookie 或响应头时，可以用 `@Res({ passthrough: true })` 保留标准方式
- 拦截器、`@HttpCode()`、`@Header()` 这类依赖标准响应处理的 Nest 特性，在完全占用响应对象的写法下不再生效
- 平台特定写法让测试更困难，需要 mock 响应对象，且代码和底层库 API 耦合，规范上优先使用标准返回方式

## 控制器在模块中的注册

- 控制器必须出现在某个模块的 `controllers` 数组里，Nest 才会实例化它并把它的路由挂到应用上
- 控制器通常只做请求编排：取出参数、调用对应 Service、把结果返回给客户端，业务规则放在 Service 层
- 控制器不直接访问数据库，也不在方法里堆砌校验和转换逻辑，这些工作分别交给管道和 Service 完成
- 路由冲突时，带参数的路径要声明在静态路径之后，避免参数化路径抢先匹配静态路由
- 控制器方法可以是同步的，也可以声明为 `async` 返回 Promise，Nest 会等待 Promise 兑现后再把结果作为响应发出

## 路由与响应细节

- 路由路径由控制器前缀、方法路径和动态参数拼接而成；动态参数段以 `:` 开头，在 `@Param()` 中按同名键取出
- 控制器可以集中声明一组相关路由，按资源名划分前缀，例如 `cats`、`users` 各自对应一个控制器
- `@HttpCode()` 用来覆盖默认状态码；不设置时默认 200，POST 方法默认 201
- `@Header()` 用来在标准响应方式下附加自定义响应头；需要设置 Cookie 时可用 `@Res({ passthrough: true })` 保留标准返回
- 路由方法可以返回原始字符串、对象、数组或 Promise，Nest 按标准方式序列化为响应
- 控制器方法抛出的异常进入异常处理层，由过滤器生成错误响应，而不是直接抛给底层平台
- 控制器注入 Service 等提供者，业务规则不写在控制器方法内；控制器只负责把请求参数转成对提供者的调用

## 请求对象上常用的数据

- `@Body()` 对应请求体，适合 POST、PUT、PATCH 等带 body 的方法
- `@Query()` 对应查询字符串，用于筛选、分页等可选参数
- `@Param()` 对应路径中的动态段，用于按标识定位资源
- `@Headers()` 取出指定请求头；`@Ip()` 取客户端 IP；`@Session()` 取会话对象
- 直接注入 `@Req()` 得到原始 request 对象，直接注入 `@Res()` 得到原始 response 对象
- 原始对象的方法和属性由底层平台决定，直接使用会让控制器和 Express/Fastify 耦合

## 参考

- https://docs.nestjs.com/controllers
- https://docs.nestjs.com/modules
