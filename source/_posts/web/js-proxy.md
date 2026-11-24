---
title: JavaScript-Proxy
date: 2018-03-06 20:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## Proxy

- Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种"元编程"，即对编程语言进行编程。

## Proxy 的主要作用

- 对于一个目标对象进行一次拦截处理，外界对于改对象的访问，都必须先通过这层拦截。因此提供了这种机制，可以对外界的访问进行过滤和改写。

## 拦截器种类

- get 拦截对象属性的读取
- set 拦截对象属性的设置
- 等等一共有 13 种

## 构造参数与基本用法

- new Proxy(target, handler) 接收两个参数：target 是被代理的原始对象，handler 定义哪些操作被拦截以及如何重定义
- handler 为空对象时，代理把所有操作原样转发给目标对象
- 代理是具有不同身份的另一个对象，不会取代目标对象本身
- Proxy.revocable(target, handler) 创建可撤销的代理对象，返回 { proxy, revoke }，调用 revoke 后代理不再可用
- get 陷阱签名为 (target, prop, receiver)，set 陷阱签名为 (target, prop, value, receiver)

## 全部 13 种拦截器

- get：拦截属性读取
- set：拦截属性设置
- has：拦截 in 运算符判断
- deleteProperty：拦截 delete 操作
- ownKeys：拦截自身属性枚举，如 Object.keys、Object.getOwnPropertyNames
- getOwnPropertyDescriptor：拦截属性描述符读取
- defineProperty：拦截属性定义
- getPrototypeOf：拦截原型读取
- setPrototypeOf：拦截原型设置
- preventExtensions：拦截禁止扩展操作
- isExtensible：拦截是否可扩展判断
- apply：拦截函数调用，仅对函数目标生效
- construct：拦截 new 构造操作，仅对函数目标生效

## 不变量与使用限制

- 拦截器必须遵守语言规定的不变量；违反不变量时直接抛出 TypeError
- 目标对象不可扩展、属性不可配置等约束会针对目标对象验证，代理不能绕过这些限制
- 代理无法直接访问目标对象的私有成员；内部带内部槽的原生对象（如 Map、Set）不能靠空 handler 直接转发，访问其内部方法会报错
- 代理陷阱常与 Reflect 配合使用：Reflect 提供与陷阱同名的方法，调用对应内部操作；在陷阱里递归调用代理自身可能造成无限递归
- 数组方法 push、slice 等内部读写属性时也会触发 get 和 set 陷阱
- 代理常用于日志记录、输入校验、格式化、默认值填充等场景

```js
const target = { name: "foo" };
const proxy = new Proxy(target, {
  get(obj, prop) {
    return Reflect.get(obj, prop);
  },
});
```

## 代理与目标对象的对应关系

- 代理对象和目标对象是两个不同身份；拦截发生在代理上，直接访问目标对象不会经过 handler
- 陷阱返回值会成为对应操作的结果；get 陷阱不返回时读到 undefined，set 陷阱应返回布尔值表示设置是否成功
- 没有写对应陷阱的操作直接转发给目标对象，行为与直接操作目标一致
- Proxy 实例没有自己的 prototype 属性或原型方法，行为全部由 handler 与目标对象决定

## 常见应用场景

- 数据校验：在 set 陷阱里检查写入值的类型和范围，不合法就抛异常或拒绝写入
- 默认值与格式化：get 陷阱在属性缺失时返回默认值，或对读到的值做格式化
- 访问日志与追踪：在 get、set、has、deleteProperty 等陷阱中记录操作行为
- 响应式更新：读取和写入属性时收集依赖、触发更新，是框架响应式系统的常见基础做法
- 撤销代理：revoke 后再访问代理会抛 TypeError，可用于临时授权访问

## 陷阱编写注意事项

- 同一陷阱内不要通过代理自身读写属性，否则会再次进入陷阱造成递归；需要默认行为时调用对应 Reflect 方法
- 目标对象冻结、密封或不可扩展时，可拦截的操作受限，违反约束抛 TypeError
- 带内部槽的原生对象（Map、Set、Date、DOM 元素）直接转发会报错，需要在陷阱中把 this 恢复为目标对象

```js
const validator = {
  set(obj, prop, value) {
    if (prop === "age" && !Number.isInteger(value)) {
      throw new TypeError("age 不是整数");
    }
    obj[prop] = value;
    return true;
  },
};
```

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
