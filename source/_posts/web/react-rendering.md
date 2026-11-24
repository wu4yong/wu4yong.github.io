---
title: React-页面渲染
date: 2018-04-14 06:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-react"></div>

# React

## 渲染过程

## 触发渲染

1. 组件的`初次渲染`
2. 组件(或者祖先之一)的 `状态发生了改变`

## React 渲染你的组件

1. 在初次渲染时： React 会调用根组件
2. 对于后续的渲染， React 会调用内部状态更新触发了渲染的函数组件(递归的去渲染子组件)

## React 把更改提交到 DOM 上

1. 对于初次渲染， React 会使用 `appendChild` DOM API 将其创建的所有 DOM 节点放在屏幕上
2. 对于重渲染，React 将应用最少的必要操作(在渲染时计算)

## 初次渲染与提交

- 初次渲染时 React 会调用根组件，递归生成整棵组件树对应的 UI 描述
- 重渲染时 React 先重新计算需要输出的 UI，再对比前后两次结果，把最少必要的 DOM 操作应用到已有节点
- 渲染输出是 UI 描述树，节点创建、更新等 DOM 操作都发生在提交阶段
- 初次渲染只发生一次，之后的界面更新都来自状态、props 或 context 变化触发的重渲染
- 对于后续渲染，React 调用触发了状态更新的函数组件，再递归地渲染子组件

## 重渲染的触发条件

- 收到的 props 改变、读取的 context 改变，或者父组件重渲染，也会让组件重新执行一次渲染
- set 传入的新值与当前状态用 `Object.is` 比较，相同时 React 跳过本次重渲染
- 组件被移除出 UI 树后，React 丢掉它对应的 state，并运行相关 Effect 的 cleanup

## 提交阶段的 DOM 操作

- 初次渲染提交时，React 把创建的所有 DOM 节点放到屏幕上
- 对比发生在前后两次渲染输出之间，已有节点能复用就不会重建

## 渲染期间的纯粹约束

- 组件函数在同一组 props、state、context 下应返回相同的 JSX，不要在渲染过程中改外部变量
- 渲染只是计算 UI 描述，订阅、定时器、手动操作 DOM、发请求这类副作用不写在渲染表达式里
- 组件不假设调用顺序，每个组件独立完成自己的渲染

## 列表渲染与 key

- 用 `map()` 把数据转成 JSX 节点数组，再放进父元素返回；需要先筛子集时可以配合 `filter()`
- 列表中的每一项需要一个在同级元素中唯一的 `key`，React 靠 key 把数组项和组件、DOM 节点对应起来
- 数据库来源的数据用数据库 ID；本地生成并持久化的数据用自增计数器或 `crypto.randomUUID()`，不要在渲染时用 `Math.random()` 现场生成
- 不要用数组下标作 key；插入、删除或重排后下标会对应错项，列表内已输入的内容也可能错乱
- 每个列表项需要输出多个 DOM 节点时，可以用带 key 的 `Fragment` 分组；简写的 `<></>` 不能传 key
- key 只是 React 内部使用的提示，不会作为 prop 传给组件；组件需要 ID 时要另外传一个 prop
- key 在不同数组的 JSX 节点之间可以重复，只要求在同一级列表中唯一
- 不指定 key 时 React 默认使用数组下标作为 key

```js
const people = [
  { id: 1, name: 'Ada' },
  { id: 2, name: 'Lin' },
];

const listItems = people.map(person => (
  <li key={person.id}>{person.name}</li>
));
```

## memo 跳过重渲染

- `memo` 包裹组件后，父组件重渲染时只要 props 浅比较相同，该组件就可以跳过本次重渲染
- 默认用 `Object.is` 逐个比较 prop；对象、数组、函数每次渲染都新建引用时，浅比较会判定为变化
- `memo` 不修改原组件，返回一个新的记忆化组件；传入的组件可以是函数组件，也可以是 `forwardRef` 组件
- 第二个参数是自定义比较函数，返回 true 表示新旧 props 等价；比较本身也有开销，只在默认浅比较无法满足时使用
- 父组件传给记忆化组件的对象或函数引用每次不同时，可以用 `useMemo` 固定对象引用、用 `useCallback` 固定函数引用
- 被 `memo` 包裹的组件在自身状态改变、使用的 context 改变时仍然会重渲染，memo 只约束来自父组件的 props
- 记忆化是性能优化而不是保证，必要时 React 仍可能重新渲染该组件
- 传入 memo 的组件如果需要暴露内部 DOM 节点，ref 要通过 forwardRef 转发

```js
import { memo } from 'react';

const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});
```

## 参考

- https://react.dev/learn/rendering-lists
- https://react.dev/reference/react/memo
- https://react.dev/reference/react/useContext
