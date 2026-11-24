---
title: Nest-管道
date: 2018-04-08 09:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-nest"></div>

# Nest

## 管道

- 转换：管道将输入数据转换为所需的数据输出(例如，将字符串转换为整数、提供默认值)
- 验证：对输入数据进行验证，如果验证成功继续传递; 验证失败则抛出异常

## 使用范围

1. 参数范围
2. 函数范围
3. 控制器范围
4. 全局范围

## 基于结构的验证

- 验证管道，要么返回该值，要么抛出一个错误

## PipeTransform 接口与 transform 方法

- 管道是用 `@Injectable()` 装饰的类，实现 `PipeTransform` 接口，接口要求提供 `transform()` 方法，接收当前正在处理的入参 `value` 和该参数的元数据 `metadata`

```ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
```

- `metadata` 是 `ArgumentMetadata` 对象，包含参数类型（body、query、param、custom）、运行期元类型 `metatype` 和装饰器传入的字符串 `data` 等属性
- `transform()` 返回的值会替换该参数原来的值，路由处理程序拿到的是管道处理后的入参；验证失败时抛出异常，路由处理程序不会被执行
- 管道既可以是同步的，也可以是异步的；部分验证逻辑返回 Promise 时，`transform()` 可以声明为 `async`
- TypeScript 接口在编译期被擦除，如果参数类型声明成接口而不是类，管道拿到的 `metatype` 会是 `Object`，运行期无法基于它做类装饰器校验
- `PipeTransform<T, R>` 是泛型接口，`T` 是输入 `value` 的类型，`R` 是 `transform()` 方法的返回类型
- 自定义管道除了类型转换，还可以做按 ID 查实体这类操作：接收入参 id，返回从数据库查到的实体对象

## 内置管道

- Nest 从 `@nestjs/common` 导出一批开箱即用的管道，包括 `ValidationPipe`、`ParseIntPipe`、`ParseFloatPipe`、`ParseBoolPipe`、`ParseArrayPipe`、`ParseUUIDPipe`、`ParseEnumPipe`、`DefaultValuePipe`、`ParseFilePipe`、`ParseDatePipe` 等
- `Parse*` 系列管道负责把字符串入参转换成对应类型，转换失败就抛出异常，例如 `ParseIntPipe` 保证路由参数被转成 JavaScript 整数
- 验证管道负责评估输入数据：验证通过就原样放行，验证失败则抛异常；内置 `ValidationPipe` 配合 class-validator 装饰器使用
- `DefaultValuePipe` 用于在 `Parse*` 管道之前补上默认值，处理可选的查询字符串参数；默认情况下 `Parse*` 管道收到 `null` 或 `undefined` 会抛异常，除非开启 `optional` 选项
- `ParseUUIDPipe` 校验参数是否为 UUID 格式，`ParseEnumPipe` 校验值是否落在给定枚举范围内，`ParseBoolPipe` 把字符串转成布尔值
- 内置 `ValidationPipe` 提供比手写示例更完整的选项；基于标准 Schema 的校验可使用 `StandardSchemaValidationPipe` 配合 Zod、Valibot 等兼容库
- 管道构造器可以接收配置（如校验用的 Schema），方法范围绑定时传入实例并带上上下文专属配置

## 管道的注册范围

- 参数范围：把管道直接挂在某个参数装饰器上，只作用于这一个参数，适合校验逻辑只涉及单个参数的场景
- 方法范围：用 `@UsePipes()` 挂在处理方法上，作用于该方法的全部参数
- 控制器范围：把管道挂在控制器类上，作用于该控制器内的所有处理方法
- 全局范围：在启动文件里调用 `app.useGlobalPipes()` 注册，作用于整个应用；从模块内部用 `APP_PIPE` token 注册的全局管道可以注入依赖

```ts
@Put('/:id')
async update(
  @Param('id', ParseIntPipe) id: number,
  @Body() body: CreateCatDto,
) {
  this.catsService.update(id, body);
}
```

## 转换与验证的边界

- 转换和验证是管道的两类典型用途：转换把输入数据变成所需形式（字符串转整数、提供默认值），验证判断输入是否合法，合法则原样传递，不合法则抛异常
- 管道在方法被调用之前介入，接收传给方法的参数，在这一点完成转换或验证，再带着（可能被转换后的）参数调用路由处理程序
- 管道运行在异常区域内：管道抛出的异常由异常处理层（全局过滤器和当前上下文绑定的过滤器）处理，一旦抛异常，路由处理程序不再执行
- 管道是在系统边界校验外部输入的推荐位置，请求编排和业务逻辑里不必再重复做类型转换和空值判断
- 同一个参数可以叠加多个管道，先由靠前的管道补默认值或做转换，再由后续管道校验，最终值才进入处理方法
- 全局管道对所有路由处理方法生效；从模块外用 `useGlobalPipes()` 注册的全局管道无法注入依赖，需要注入时用 `APP_PIPE` token 在模块内注册
- 管道不处理业务规则，只完成入参的转换和合法性判断；验证不通过时抛异常，由异常处理层统一生成错误响应

## 管道与 DTO 校验

- `ValidationPipe` 基于类上的 class-validator 装饰器校验请求体，校验失败抛异常，通过后返回转换后的对象
- DTO 用类定义是因为接口编译后被擦除，管道运行期拿不到接口元数据
- 校验管道可以配置是否剔除多余属性、是否转换类型、是否开启白名单等行为
- 管道在方法调用前介入，外部输入在进入业务方法前已完成转换和合法性判断
- 同一个参数可叠加多个管道，先补默认值或转换，再做校验
- 全局管道对所有路由生效；需要注入依赖时用 `APP_PIPE` token 在模块内注册

## 参考

- https://docs.nestjs.com/pipes
