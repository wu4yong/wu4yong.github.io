---
title: Nest-控制反转
date: 2018-04-09 12:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-nest"></div>

# Nest

## IOC 控制反转

* 是一种面向对象编程中的一种设计原则，用来降低计算机代码之间的耦合度，基本思想: 借助于 `第三方` 实现具有依赖关系的对象之间的解耦。第三方也就是指 `IOC容器`。使得对象依赖关系的控制权不在由开发者进行控制，而是转交给 `第三方` IOC容器。
* 当 A 类依赖于 B 类时，不在由开发者手动去创建 B 实例添加到 A 实例中，而是交给 `IOC容器` 去创建。A 依赖 B 的过程由主动行为变成了被动的行为，控制权颠倒过来了，这就是 `控制反转` 名称的由来
* 高层模块不应该依赖低层模块
* 控制反转是一种`思想`，`依赖注入`则是实现控制反转最典型的`实现方式`。
* IOC 架构的好处就是不需要手动创建对象和根据依赖关系传入不同对象的构造器中，一切都是自动扫描并创建，注入的

## DI 依赖注入

* A 依赖 B 时，不是在 A 的实例过程中去主动 new B()。而是在 new A() 之前就初始化好了 B 实例，然后将 B 实例通过参数的形式传入 A 实例。这种非自己主动初始化依赖，而是通过外部来传入依赖的方式被称之为 `依赖注入`
* 通过 `@Controller` `@Injectable` 装饰器声明的 class 会被 NestJS 扫描，创建对应的对象并添加到一个容器里，这些所有的对象会根据构造器里声明的依赖自动注入，也就是 `依赖注入`

### 不使用依赖注入

- 不使用依赖注入， B 类依赖 A 类的话，就直接在 B 类中 new A()
- 耦合很强，如果哪天需要更换依赖，必须要在 B 类中修改代码(伤筋动骨)

```ts

class A {
  name: string;
  constructor() {
    this.name = 'xujie';
  }
}

// B 类严重依赖 A 类
// ! 强耦合
class B {
  a: string
  constructor() {
    this.a = new A().name
  }
}
```

### 依赖注入

* 使用依赖注入， 把依赖 A 当作 B 类的一个参数进行传入
* 耦合较低，如果哪天需要更换依赖，只需要在实例化 B 时传入不同的参数

```TS
class A {
  name: string;
  constructor() {
    this.name = 'xujie';
  }
}

// B 类不再依赖某个具体的类
class B {
  a: string
  constructor(x) {
    this.a = x
  }
}
// 实例化 B 的时候将依赖当作参数传入
const b = new B(new A())
```

### IOC 容器

```ts
class A {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

// 容器
class Container {
  mo: any;
  constructor() {
    this.mo = {}
  }
  // 依赖注入
  provide(key: string, mo: any) {
    this.mo[key] = mo;
  }
  // 取出依赖
  get(key: string) {
    return this.mo[key];
  }
}

class B {
  a: A
  constructor(mo: Container) {
    // A 类的获取不在直接操作 A 而是变成操作 Container 容器
    // 由容器来负责依赖的读取
    this.a = mo.get('a')
  }
}

// B 类现在已经不在依赖 A 类, 而是依赖 Container 容器
// 由容器来负责依赖的注入
const mo = new Container('a',  new A('xujieAAA'), 'b', new B('xujieBBB'))
// 直接将容器实例 mo 注入到 B 实例中即可
// 在创建多个 B 实例的时候，不需要一遍遍的 new A() new B()。只需要制作好一个容器就可以重复使用
const b1 = new B(mo)
const b2 = new B(mo)
const b3 = new B(mo)
```
