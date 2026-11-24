---
title: Nest-服务者
date: 2018-04-05 17:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-nest"></div>

# Nest

## 服务者

## Provider 与 IoC 容器

- Service 本质是一个被 `@Injectable()` 装饰的普通 class，装饰器做的是在类上写入元数据，声明它可以被 Nest 的 IoC 容器托管
- 被托管不代表会被创建：只有出现在某个模块 `providers` 数组里的类，Nest 才会实例化
- 默认作用域是 singleton，应用 bootstrap 时解析全部依赖、实例化一次，之后所有依赖方共享同一个实例

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  private readonly cats: string[] = [];

  create(cat: string) {
    this.cats.push(cat);
  }

  findAll(): string[] {
    return this.cats;
  }
}
```

## 依赖是按「类型」解析的

- 构造器参数上的类型注解就是查找用的 token，Nest 读的是 TypeScript 编译期发射到 class 上的参数类型元数据
- `private` 在这里是 TypeScript 的参数属性语法，同时完成「声明成员」和「赋值」两件事，等价于手写 `this.catsService = catsService`

```ts
constructor(private catsService: CatsService) {}
```

- `interface`、`type` 别名在编译后不存在，写成 `constructor(private config: AppConfig)` 会让容器拿不到 token，启动直接报 `Nest can't resolve dependencies of the ...`
- `import type { CatsService }` 也一样，导入语句被整体擦除，运行期没有这个 class
- 非 class 的依赖（配置对象、第三方客户端）必须先注册成 token，再用 `@Inject()` 显式指定

```ts
// 注册
@Module({
  providers: [{ provide: 'HTTP_OPTIONS', useValue: { timeout: 5000 } }],
})
export class AppModule {}

// 注入
@Injectable()
export class HttpService {
  constructor(@Inject('HTTP_OPTIONS') private readonly options: { timeout: number }) {}
}
```

## 可选依赖与属性注入

- `@Optional()` 只改变「provider 缺失」时的行为：找不到对应 token 就注入 `undefined`，而不是启动失败，兜底逻辑要自己在类里写

```ts
@Injectable()
export class HttpService<T> {
  constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {}
}
```

- 属性注入是给「基类依赖多个 provider、子类逐层 `super()` 传参太重」准备的
- 不继承父类时官方建议优先用构造器注入，依赖关系写在构造器签名上更容易读

```ts
@Injectable()
export class HttpService<T> {
  @Inject('HTTP_OPTIONS')
  private readonly httpClient: T;
}
```

## 模块之间的可见性

- provider 的作用域是模块级的：本模块 `providers` 注册的东西，只有本模块的控制器和其他 provider 能注入
- 要让别的模块用，得把它放进本模块的 `exports` 数组，对方模块再 `imports` 这个模块

```ts
@Module({
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

- 同一个 provider 在两个模块的 `providers` 里各注册一次，得到的是两个不同实例，每个模块一份
- 需要全局唯一时用 `@Global()` 把模块标记成全局模块，只注册一次，任何模块不 import 也能注入
- 循环依赖（A 依赖 B 的 service、B 又依赖 A 的 service）用 `forwardRef()` 延迟求值，而不是把两个类塞进同一个文件绕过去

```ts
// a.module.ts
@Module({
  imports: [forwardRef(() => BModule)],
  providers: [AService],
  exports: [AService],
})
export class AModule {}
```

- `ModuleRef` 用来按 token 动态取实例：`get()` 取已注册的那个，`create()` 新建一个不被容器管理的实例

## 生命周期钩子

- provider 只要实现对应接口名的方法，Nest 就会在对应时机调用，不需要自己订阅事件

```ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class CatsService implements OnModuleInit, OnModuleDestroy {
  onModuleInit() {
    // 依赖注入完成、模块初始化时调用
  }

  onModuleDestroy() {
    // 应用关闭时调用
  }
}
```

- 钩子顺序是「依赖先于依赖方」，所以 `onModuleInit` 里可以安全使用注入进来的 provider
- `onModuleDestroy` 要响应系统信号（SIGTERM 等）还需要在启动时调用 `app.enableShutdownHooks()`
- 想等 HTTP 服务真正起来之后再做初始化，用 `onApplicationBootstrap` 而不是 `onModuleInit`

## 常见坑

- 用 Service 存内存状态在单进程单实例下没问题，但实例是按模块注册的，多模块重复注册或多副本部署时状态不会共享
- request 作用域的 provider 会沿注入链向上传染：控制器注入了 request-scoped 的 service，这个控制器本身也会变成 request-scoped，每个请求新建一份
- 构造器里做重活（连数据库、读大文件）会拖慢 bootstrap，放到 `onModuleInit` 里更合适
- 报 `Nest can't resolve dependencies` 时按顺序排查：类型注解是不是 interface 或 `import type`、目标 provider 是否在当前模块的 `providers` 里、跨模块是否漏了 `exports` 和 `imports`

## 参考

- https://docs.nestjs.com/providers
- https://docs.nestjs.com/modules
- https://docs.nestjs.com/fundamentals/lifecycle-events
- https://docs.nestjs.com/fundamentals/module-ref
- https://docs.nestjs.com/fundamentals/injection-scopes
