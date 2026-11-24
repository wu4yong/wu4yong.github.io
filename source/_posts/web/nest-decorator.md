---
title: Nest-装饰器
date: 2018-04-10 03:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-nest"></div>

# Nest

## 装饰器

* TS 的语法，实际上就是将对被装饰主体进行操作(添加属性，方法...)使得被装饰主题能够很简单的拥有一类功能

```js
// 自定义一个 GET 方法
const Get = (url:string) => {
  return (target, key, descriptor) => {
    // 获取到被装饰的方法主体
    const fnc = descriptor.value
    axios.get(url)
    .then(res => {
      // 成功的话，调用函数主体并传入成功的消息和自定义参数
      fnc(res, status: 200)
    })
    .catch((err) => {
       // 失败的话，调用函数主体并传入失败的错误和自定义参数
      fnc(err, status: 500)
    })
  }
}

@Get('https://xxx.com/xxx')
// 在运行该函数时，就会把该函数使用装饰器来修饰
// 在修饰的过程中会调用 axios 的 get 方法，并且 axios 有结果之后调用被修饰主体(调用的时候还能传递一些参数)
getText(content, code) {}
```

## 装饰器的类型与作用时机

- 装饰器是 TypeScript 提供的语言特性，本质是一个返回函数的表达式，接收被装饰主体、属性名和属性描述符作为参数，在类、方法、属性或参数被声明时写入元数据
- 装饰器可以作用于类、方法、属性、参数四种主体，不同主体拿到的入参和可写入的元数据范围不同
- Nest 内置的 `@Controller()`、`@Get()`、`@Injectable()`、`@Param()` 等都是装饰器，它们把路由、依赖、参数绑定等信息写到元数据上，供框架在运行期读取
- 装饰器本身不在被装饰主体被调用时执行逻辑，而是在声明阶段完成元数据写入；真正的行为由框架在请求处理流程中按元数据触发
- 装饰器可以接收参数，参数在装饰器工厂函数里参与元数据的生成，同一个装饰器挂在不同主体上可以携带不同配置
- 带参数的装饰器先调用工厂函数拿到真正挂到主体上的处理逻辑；同一个主体上可以叠加多个装饰器，各自写入不同维度的元数据
- 装饰器在类定义被加载时求值，元数据随后挂载到类、方法或参数上，供框架在启动期和请求处理期读取
- 装饰器本身不承载业务流程，业务行为由守卫、管道、拦截器等组件按读到的元数据触发执行

## Nest 自定义参数装饰器

- 当鉴权层把用户信息挂到 request 对象上，每个处理方法都手动取 `req.user` 会重复，Nest 提供 `createParamDecorator()` 把这种取值封装成可复用的装饰器

```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

- 装饰器工厂函数接收两个参数：传给装饰器的数据 `data`，和当前执行上下文 `ExecutionContext`；通过 `switchToHttp()` 可以取出 HTTP 请求对象
- 需要按键取属性时，把键名作为 `data` 传入装饰器，工厂函数据此从用户对象上返回对应字段
- 自定义参数装饰器和内置的 `@Body()`、`@Param()`、`@Query()` 被同等对待，管道同样会作用在标注了自定义装饰器的参数上
- `createParamDecorator<T>()` 是泛型工厂，可以显式约束 `data` 的类型；不传类型时 `data` 为 `any`
- 自定义装饰器默认不被 `ValidationPipe` 校验参数，需要开启 `validateCustomDecorators` 选项才会走校验

## 元数据与组合装饰器

- `@SetMetadata()` 可以把自定义元数据挂到路由处理方法上，守卫在运行期通过 `Reflector` 读取这些元数据，判断当前路由需要什么角色或权限
- 多个装饰器需要一起使用时，可以用 `applyDecorators()` 把它们组合成一个自定义装饰器，一次声明同时应用所有装饰器

```ts
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
  );
}
```

- 组合装饰器适合把鉴权相关的一整套声明收拢到一处，避免控制器上堆叠一串零散的装饰器
- 元数据是声明式权限方案的基础：路由上只声明需要什么角色，守卫负责读取并比对当前用户的权限
- 除了 `@SetMetadata()`，也可以用 `Reflector.createDecorator()` 创建类型安全的自定义装饰器，再由守卫通过 `Reflector.get()` 读取对应元数据
- 装饰器组合只收拢声明，不改变各组件本身的执行时机；组合后的自定义装饰器用在控制器或方法上，和逐个展开各装饰器效果一致
- 元数据挂在控制器类或处理方法上，`Reflector` 读取时可以分别按类和方法两个层级取
- 组合装饰器内部可以混入守卫、元数据等任意可组合项；个别第三方装饰器不支持组合，使用前需要确认其实现方式
- `Reflector` 是框架从 `@nestjs/core` 导出的元数据读取工具，守卫和其他组件通过它读取挂在类或方法上的自定义装饰器值

## 参考

- https://docs.nestjs.com/custom-decorators
- https://docs.nestjs.com/guards
