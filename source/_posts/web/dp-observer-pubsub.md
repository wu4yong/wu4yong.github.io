---
title: 设计模式-观察者和发布订阅模式
date: 2018-02-15 23:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-dp"></div>

# 设计模式

## 观察者 && 发布订阅模式

## 一、观察者模式

- 观察者模式定义对象中一种一对多的依赖关系，当一个对象的状态发生变化时。所有依赖于它的对象都将得到通知。

1. 被观察者: 发布通知。发布者拥有缓存列表，用于存放订阅者信息
2. 观察者: 需要去订阅通知

### 1.1 售楼处的例子

- 一个简单的观察者模式代码实现

```js
// 定义售楼处
const salesOffices = {
  // 缓存列表，存放观察者的回调函数
  clientList: [],
  // 增加观察者
  listen: function (fn) {
    // 观察的消息添加进缓存列表
    this.clientList.push(fn);
  },
  // 发布消息
  trigger: function () {
    for (var i = 0, fn; (fn = this.clientList[i++]); ) {
      // arguments是发布消息时带上的参数
      fn.apply(this, arguments);
    }
  },
};

// 顾客订阅通知
salesOffices.listen(function (price, squareMeter) {
  console.log("价格= " + price);
  console.log("squareMeter= " + squareMeter);
});

// 售楼处发布通知
salesOffices.trigger(104, 118);
```

## 二、发布-订阅模式

- 发布订阅是一种消息范式，消息的发送者不会将消息直接发给特定的接收者。而是将消息发送给中介者
- 发布订阅模式中，组件是松耦合的

1. 发布者: 发布通知
2. 订阅者: 需要去订阅通知
3. 中介者：发布者把消息统一发送给中介者，中介者再将消息转发给所有订阅者(中介者负责维护发布、订阅的关系。订阅者不必关心会有几个发布者，发布者也不用关注需要将消息发给谁)

## 三、JS 事件模型

- 在 JavaScript 中，我们一般用事件模型来代替传统的发布-订阅模式

```js
document.body.addEventListener(
  "click",
  function () {
    alert(2);
  },
  false
);

document.body.addEventListener(
  "click",
  function () {
    alert(3);
  },
  false
);

document.body.click(); // 模拟用户点击
```

## 四、观察者模式与发布订阅模式的区别

- 观察者模式中，被观察者直接持有观察者的引用，通知由被观察者逐个推送给观察者
- 发布订阅模式中，发布者和订阅者之间存在一个中介者，双方都只和中介者通信，彼此不直接引用
- 观察者模式里订阅者通常知道发布者是谁，发布订阅模式里订阅者只关心中介者转发的消息，不关心消息由谁发出
- 两种模式都用于解耦事件的发出方和响应方，区别只在于中间是否多了一层中介者

## 五、DOM 事件模型的补充细节

- `addEventListener(type, listener, options)` 第三个参数可以是布尔值 `useCapture`，也可以是一个选项对象
- 选项对象中的 `capture` 为 `true` 时，监听器在捕获阶段触发；默认为 `false`，即在冒泡阶段触发
- `once` 为 `true` 时，监听器在被调用一次后自动移除
- `passive` 为 `true` 时，表示监听器内部不会调用 `preventDefault()`，浏览器可以不必等待监听器执行完再处理默认行为
- 事件传播分为捕获阶段、目标阶段和冒泡阶段：捕获阶段从文档顶层向下传到目标，冒泡阶段再从目标向上传回文档顶层
- 同一个元素上注册的多个监听器，会按照注册的先后顺序依次调用
- 移除监听器需要传入同一个函数引用，`capture` 选项也要和注册时一致；匿名函数无法被移除
- 除了浏览器内置事件，也可以用 `CustomEvent` 构造自定义事件，通过 `dispatchEvent` 派发，事件携带的数据放在 `detail` 属性上

```js
const box = document.querySelector(".box");

box.addEventListener(
  "custom:price",
  function (event) {
    console.log(event.detail.price);
  },
  false
);

const event = new CustomEvent("custom:price", {
  detail: { price: 104 },
});
box.dispatchEvent(event);
```

## 参考

- https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
- https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
- https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
- https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
- https://dom.spec.whatwg.org/#concept-event-listener-invoke
