---
title: 技术文档总结-Vue响应式原理
date: 2018-01-26 23:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-tech"></div>

# 技术文档总结

## 搞懂 Vue 响应式：依赖收集、触发更新与跨版本实现差异

## 一、响应式数据

- 当数据发生变化时，会自动执行某些动作去更新 DOM 节点(需要明确更新 DOM 的时机，也就是说明需要拦截`响应式数据`的`设置`操作，需要明确有哪些 DOM 需要被更新，也就是说明需要拦截`响应式数据`的`读取`操作)
- `Vue2` 使用 `Object.defineProperty` 实现数据代理，`Vue3` 使用 `Proxy` 实现数据代理

## 二、Vue2 的响应式原理

### 2.1 Observer 类

```js
function defineReactive(obj, key, value) {
  // 每个 key 值对应的依赖，存储在 dep 实例中
  let dep = new Dep();
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get() {
      // 收集依赖
      dep.depend();
      return value;
    },
    set(newValue) {
      val = newValue;
      // 触发依赖
      dep.notify();
    },
  });
}
```

### 2.2 Dep 类

- 可以简化看成是一个用来存储回调函数的数组
- Window.target 是一个全局变量，方便依赖的收集

```js
// 定义一个 dep 类，专门用来管理依赖
class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  removeSub(sub) {
    remove(this.subs, sub);
  }
  depend() {
    if (window.target) {
      this.addSub(window.target);
    }
  }
  // 循环触发 dep 实例中依赖的 update 方法
  notify() {
    const subs = this.subs.slice();
    // 循环的触发所有依赖
    for (let index = 0; index < subs.length; index++) {
      subs[i].update();
    }
}
```

### 2.3 Watcher 类

- watcher 是一个中介的角色，数据发生变化时通知它，然后它再通知其他地方
- 三种 watcher: 1. 组件的 render watcher 2. 计算属性 watcher 3. $watcher 对应的 watcher

```js
class Watcher {
  constructor(vm, expOrFn, callback) {
    this.vm = vm;
    this.callback = callback;

    // 执行 this.getter() ，就可以读取某个属性的值
    this.getter = parsePath(expOrFn);
    // 在实例化一个 watcher 实例的时候，会自动执行 get 方法
    this.value = this.get();
  }
  get() {
    window.target = this;
    let value = this.getter.call(this.vm, this.vm);
    window.target = undefined;
    return value;
  }
  update() {
    const oldValue = this.value;
    this.value = this.get();
    this.callback.call(this.vm, this.value, oldValue);
  }
}
```

### 2.4 响应式系统的整体流程

![响应式流程](@@CDN@@/assets/img/web/tech-vue-reactivity/img-01.webp)

- (1) 页面初始化时

1. Observer 类会附加到每一个 object 上。递归的调用 defineReactive 函数将每一个属性都通过 `Object.defineProperty()` 进行数据拦截。
2. 在`读取数据`时会`收集依赖`，在`修改数据`后会`触发依赖`。
3. 每一个属性都会拥有一个独立的 Dep 实例

- (2) 页面使用数据时

1. 使用响应式数据时会`实例化`一个 Watcher
2. 在 new Watcher 的过程中会`触发依赖收集`，从而将 watcher 实例放到响应式属性的 dep 中

- (3) 改变数据后

1. 改变数据会`触发依赖执行`，执行当前响应式属性的 dep 数组中的所有 watcher 的 update 方法
2. watcher 的回调函数可能是执行`组件的 render 函数`，也可以是执行`用户自定义的回调函数`

### 2.5 数组的响应式处理

- 出于性能和业务场景（大多数情况下是通过方法来改变数组，而非直接操作 key/index 来改变数组）的考虑。数组不会针对每一条数据使用 Object.defineProperty() 进行数据拦截。
- 数组的响应式处理为在 `get` 中`收集依赖`，在`数组方法`中`触发依赖`。
- 重写七个可改变数组的方法

```js
// 一、基于 Array.prototype 实现重写数组方法
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto)[
  ("push", "pop", "shift", "unshift", "splice", "sort", "reverse")
].forEach(function (method) {
  // 1. 借用 Array.prototype 上的方法, 实现原本的功能
  // 2. 在修改数据的同时发送通知
});

// 二、使用__proto__ 替换响应式数组的原型
const arr = [];
arr.__proto__ = arrayMethods;
```

### 2.6 Vue2 响应式数据的缺陷

### (1) 缺陷的体现

1. 由于 Vue 会在实例初始化的时候对 property 进行 getter/setter 转化。所以只有在一开始就存在 data 中的数据才是响应式的。(比如在组件的 created, beforeCreate 钩子函数中为组件添加一个属性，这个数据不是响应式的数据)
2. 对象: Object.defineProperty 只能追踪一个属性`是否被更改`。在一个对象中`添加`一个新属性，使用 `delete 删除`一个属性的时候`不会触发响应式`。
3. 数组：push()、pop()、shift()、unshift()、splice()、sort()、reverse()称为变更方法，`会触发视图更新`。数组`长度的变化`是`非响应式`的。例如，`arr.length = 4`。通过`索引`来直接修改数组中的数据也是`非响应式`的。例如，`arr[2] = 'foo'`

### (2) 缺陷的解决方案

```js
// 对象上使用 $set 方法，实际上就是 Vue 手动去调用响应式的方法，手动的将新增的属性变成响应式的
`Vue.set(object, 'key', 'value')` // 对象上使用 $delete 方法，实际上就是 Vue 手动的去触发依赖，通知所有使用到该对象的组件去重新渲染
`Vue.delete(object, 'key')`;
```

## 三、Vue3 的响应式原理

### 3.1 使用 proxy 监听对象的行为

```js
// 一、存储副作用函数的桶
const bucket = new Set();

// 二、原始数据
const data = { text: "hello world" };

// 三、对原始数据的代理
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 将副作用函数 effect 添加到存储副作用函数的桶中
    bucket.add(effect);
    // 返回属性值
    return target[key];
  },
  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal;
    // 把副作用函数从桶里取出并执行
    bucket.forEach((fn) => fn());
    // 返回 true 代表设置操作成功
    return true;
  },
});

// 四、测试
// 副作用函数
function effect() {
  document.body.innerText = obj.text;
}
// 执行副作用函数，触发读取
effect();
// 1 秒后修改响应式数据
setTimeout(() => {
  obj.text = "hello vue3";
}, 1000);
```

### 4.2 Proxy 和 Object.defineProperty() 对比

1. 通过 Proxy（代理）能够拦截对象中任意属性的变化, 包括属性值的`读写`、属性的`添加`、属性的`删除`等。
2. Vue3 对于响应式数据，不在像 Vue2 那种递归对所有的子数据进行影响是定义。而是在获取到深层数据的时候再去利用 proxy 进一步定义响应式，这对于大量数据的初始化场景来说收益会非常大。
3. Proxy 是 ES6 的语法，兼容性较差。不支持 IE 11
