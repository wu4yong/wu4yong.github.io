---
title: React-交互事件
date: 2018-04-13 10:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-react"></div>

# React

## 交互事件

## 一、React 事件

- React 中的事件都会传播，需要手动取消冒泡操作
- 事件函数是执行副作用的最佳位置，事件处理函数不需要是纯函数

```js
// 事件处理函数的形式
// 传递的是事件函数本身，而不是函数的执行结果
export default function PackingList() {
  function handleClick() {
    alert("被点击")
  }
  return (
    <button onClick={handleClick}>BUTTON</button>
  );
}

// 内联函数的形式，更加简洁
export default function PackingList() {
  return (
    <button onClick={() => alert("被点击")}>BUTTON</button>
  );
}
```

## 二、state

### 2.1 useState Hook

- useState Hook 提供了两个功能

1. State 变量：用于`保存渲染间`的数据
2. State setter 函数：`更新变量`并`触发 React 再次渲染`组件

当调用 useState 时，你是在告诉 React 你想让这个组件记住一些东西(是记住同一组件每次`渲染`时的状态，多次调用组件函数时，多个组件之间的数据是分离的)

```js
// Hook: 以 use 开头的函数，只能在组件或者自定义 Hook 的最顶层调用
import { useState } from "react";
export default function PackingList() {
  const [message, setMessage] = useState("点击我");
  function handleClick() {
    setMessage(message + "!");
  }
  return <button onClick={handleClick}>{message}</button>;
}
```

### 2.2 state 如同一张快照

- 在 React 内部，为每个组件保存了一个数组，其中每一项都是一个 state 对
- State 是屏幕上组件实例内部的状态：如果你渲染同一个组件两次，每个副本都会有完全隔离的 state
- 与 props 不同，state 完全`私有于声明它的组件`。父组件无法感知和更改子组件的 state
- `正在渲染` 就意味着 React 正在调用你的组件(一个函数)，从该函数返回的 JSX 就像是在某个时间点上 UI 的快照，它的 props、事件处理函数和内部变量都是根据`当前渲染时的 state` 被计算出来的

```js
// state 如同一张快照: 一个 state 变量的值永远不会在一次渲染的内部发生变化
export default function Counter() {
  const [number, setNumber] = useState(0);
  return (
    <>
      <h1>{number}</h1>
      {/* 设置 state 只会为 `下一次渲染` 变更 state 的值 */}
      {/* 这个 click 事件，看起来像是对 state 进行了 +3 的操作， 但是实际上三次调用都是将 0 变成 1 */}
      <button
        onClick={() => {
          // state 的值是不可变的， 将 0 加 1 后的结果，是用来给下一次的渲染变更用
          setNumber(number + 1);
          setNumber(number + 1);
          setNumber(number + 1);
        }}
      >
        +3
      </button>
    </>
  );
}
```

### 2.3 把一系列 state 更新重新加入队列

- React 会等到事件处理函数中的所有代码都运行完毕再处理你的 state 更新

```js
export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button
        onClick={() => {
          {
            /* 使用更新函数的形式，用来在下一次渲染之前多次更新同一个 state */
          }
          setNumber((n) => n + 1);
          setNumber((n) => n + 1);
          setNumber((n) => n + 1);
        }}
      >
        +3
      </button>
    </>
  );
}
```

- `setState(n = n + 1)` 被称为更新函数，这是在告诉 React 用 state 值来做某事。`setState(n + 1)` 是在告诉用某值来替换原来的值

### 2.4 更新 state 中的对象

- 从技术上来说，可以改变对象自身的内容。但是在 React 中，需要将所有 state 都视为只读的，你需要替换 state 中对象的值，而不是改变它
- 对于多层嵌套的 state 对象，可以考虑进行扁平化操作，或者使用 immer 库来简化操作
- React 并不依赖 mutation(Vue2 通过 Proxy 的方式，通过 mutation 来实现响应式 )

```js
// 更新对象的常见方式，使用...扩展运算符
setPerson({
  ...person, // 复制上一个 person 中的所有字段
  firstName: e.target.value, // 但是覆盖 firstName 字段
});
```

### 2.5 更新 state 中的数组

- 数组同样要视为不可变的， push、pop、splice 等数组方法不能在 React 中使用
- 同样可以使用 immer 库来简化数组的操作
