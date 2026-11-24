---
title: React-Hook
date: 2018-04-12 10:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-react"></div>

# React

## Hook

## useref

- 当你希望组件记住某些信息，但是又不想让这些信息触发新的渲染
- 可以使用 ref 来操作 DOM

## useEffect

- 等真的需要使用 React 做项目时再学习

## useMemo

- 第一个参数：一个函数，返回“要记住的值”。
- 第二个参数：依赖数组，依赖不变就用上一次的结果

## useCallback

- 本质上：useCallback(fn, deps) ≈ useMemo(() => fn, deps)
- 核心是：函数的“地址”稳定，方便给子组件 / 依赖传递。

## 自定义 Hook

1. 代码逻辑复用
2. 组件内部的代码描述的是想要做什么，而不是怎么做(隐藏背后的逻辑)

## useState

- `useState` 在组件顶层声明一个状态变量，返回当前状态和一个可以更新它的 set 函数，约定写成 `const [state, setState] = useState(initialState)`
- 传给 `useState` 的初始值只在初次渲染时生效；如果第一个参数是函数，会被当作初始化函数，只在初始化时调用一次，返回值作为初始状态
- set 函数可以直接传下一个状态，也可以传一个更新函数，接收待更新的前一个状态并返回新状态；依赖前一个状态做累加时应该用更新函数
- 调用 set 函数只会为下一次渲染更新状态，在当前已经运行的代码里读到的还是旧值
- 新值与当前状态用 `Object.is` 比较，相同则 React 会跳过该组件及其子组件的重渲染；多个状态更新会被批量处理，事件处理函数全部执行完后再统一刷新界面

## useEffect 补充

- Effect 接收一个 setup 函数和一个依赖数组；组件提交后运行 setup，依赖变化时先用旧值运行 cleanup，再用新值运行 setup，组件从 DOM 移除后再运行一次 cleanup
- 依赖数组里的每个值与上一次用 `Object.is` 比较；省略依赖数组时 Effect 会在每次提交后都重跑，传入空数组则只在挂载和卸载时执行
- cleanup 应该与 setup 成对可撤销：setup 做了什么，cleanup 就负责停掉或撤销什么
- 开发环境严格模式下，React 会在第一次正式 setup 之前额外跑一轮 setup 加 cleanup，用来校验副作用是否正确成对
- 如果 Effect 依赖了渲染期间新建的对象或函数，引用每次都变会导致 Effect 过于频繁地重跑；不依赖响应式状态的内容应移到 Effect 内部或组件外部

## Hooks 的调用规则

- 以 `use` 开头的函数是 Hook，只能在函数组件或自定义 Hook 的顶层调用
- 不要在循环、条件判断、嵌套函数、事件处理函数、类组件以及 `try`/`catch`/`finally` 块里调用 Hook
- 也不要在 `useMemo`、`useReducer`、`useEffect` 传入的函数里调用其他 Hook；需要条件或循环逻辑时，抽出一个新组件再把状态移进去
- 自定义 Hook 可以调用其他 Hook，这是它复用有状态逻辑的方式，但同样必须遵守上述调用位置规则

## useMemo 与 useCallback

- `useMemo` 缓存的是函数调用的结果，`useCallback` 缓存的是函数本身；后者不会调用传入的函数，只是把函数固定下来
- 依赖不变时返回上一次缓存的值或函数；忘记传依赖数组，`useMemo` 每次都会重新计算，`useCallback` 每次都会返回新函数
- 简化关系上 `useCallback(fn, deps)` 等价于 `useMemo(() => fn, deps)`
- 缓存只作为性能优化，组件初次挂载期间挂起等场景下 React 可能丢弃缓存；需要长期保留的值应使用 state 或 ref

## useRef 补充

- ref 对象只有一个 `current` 属性，初始值在初次渲染后读取，后续渲染返回同一个 ref 对象
- 修改 `ref.current` 不会触发组件重渲染，适合保存不参与界面输出的信息，例如定时器 ID、上一次的 DOM 节点引用
- 不要在渲染期间读写 `ref.current`，初始化用途除外；需要在界面上展示的值应该使用 state
- 把 ref 传给内置 DOM 元素的 `ref` 属性后，React 会把对应的 DOM 节点写入 `current`，节点移除时再置回 `null`

```js
import { useRef, useEffect } from 'react';

function FocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} />;
}
```

## useContext

- `useContext(SomeContext)` 读取并订阅组件树上方向上最近的同名 Provider 提供的值；上层没有任何 Provider 时，返回创建 context 时传入的默认值
- Provider 提供的 value 变化时，读取该 context 的组件会自动重渲染；用 `memo` 跳过重渲染也不会阻止消费 context 的子组件拿到新值
- 同一个组件内部返回的 Provider 对该组件自身的 `useContext` 调用无效，Provider 必须放在调用 `useContext` 的组件之上
- 上层可以嵌套多个同名 Provider，内层 Provider 会覆盖外层提供的值；创建 context 时传入的默认值本身不会变化

## 参考

- https://react.dev/reference/react/useState
- https://react.dev/reference/react/useEffect
- https://react.dev/reference/react/useMemo
- https://react.dev/reference/react/useCallback
- https://react.dev/reference/react/useRef
- https://react.dev/reference/react/useContext
- https://react.dev/reference/rules/rules-of-hooks
