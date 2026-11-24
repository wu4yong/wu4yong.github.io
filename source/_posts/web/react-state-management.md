---
title: React-状态管理
date: 2018-04-14 04:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-react"></div>

# React

## 状态管理

- React 控制 UI 的方式是声明式的
- 在你不明确业务实现时，可以使用尽可能多的 state 来控制页面的 UI，然后在慢慢的进行优化。有哪些 state 是可以合并的(合并为同一个、或者由两个布尔合并为一个有三种情况的 string)，有哪些是互斥的
- 一个组件的 state 只有在组件初次渲染时，才会进行初始化。一般情况下不要将 props 使用 state 进行包装，除非你只想把父组件传过来的 props 当做初始化的值。

## 组件间共享状态

- 希望两个组件的状态始终同步，可以把 state 放到共同的父级，被称为`状态提升`
- 受控组件：组件的状态受父组件的影响
- 非受控组件：组件的状态不受父组件的影响

## state 的保留和重置

- state 并不存在于组件内，实际上 state 是由 react 保存的
- 只要一个组件还被渲染在 UI 树的相同位置(对 React 来说重要的是组件在 `UI 树中的位置`,而不是在 `JSX 中的位置`)，React 就会保留它的 state。 如果它被移除，或者一个不同的组件被渲染在相同的位置，那么 React 就会丢掉它的 state。
- 和 Vue 的区别，Vue 的状态是保存在组件内部的，即使是在相同位置再次渲染相同的组件，上一个组件的状态也不会被保留。但是 React 的状态是保存的 React 中的，在相同的位置再次渲染相同的组件，上一个组件遗留的状态会被保存下来
- 在相同位置渲染组件，但是想重置 state: 1. 将组件渲染在不同的位置 2.使用 key 来重置 state

## Reducer

- 使用 Reducer 来集中处理数据，分离关注点，使得代码结构更加的清晰

## Context 深层传递数据

- 组件通过 useContext(xxx) 来访问上层`最近`父组件提供的 xxx 的值
- context 让你可以编写“适应周围环境”的组件
- context 看起来非常诱人，但是这并不代表着 context 是万能的。使用 props 的方式能让开发者更容易了解哪些组件中使用了哪些数据。在使用 context 之前，先试试传递 props 或者将 JSX 作为 children 传递

## 结合 Reducer 和 context

- 把 state 和 dispatch 都放到 context 中，然后在组件树的任何地方使用 context
- 可以在当前步骤的基础上进一步进行抽离，将 state, dispatch，JSX 全部放到一个文件中，并自定义一个 hook 进行使用

## useState 的基本写法

- 一个状态变量用 `const [state, setState] = useState(initialState)` 声明，返回值第一项是当前状态，第二项是更新函数
- 初始值只在组件初次渲染时读取；把更新函数传给 setState 时，React 会按入队顺序依次作用到前一个状态上
- state 被视为只读，更新对象或数组时应该生成新对象或新数组替换，而不是直接改原来的引用
- 更新对象状态时生成新对象并展开原有字段，不要直接改写 state 里的嵌套属性
- 传给 set 的函数是更新函数，只接收待处理状态作为参数并返回新状态；React 把更新函数排队，下次渲染按顺序应用
- set 函数只更新下一次渲染的状态，在当前已经运行的代码里读到的还是旧值

## 状态设计的基本思路

- 业务实现不明确时，可以先多用几个 state 描述页面 UI，再逐步识别哪些状态可以合并、哪些状态互斥
- 两个布尔状态可以合并为一个三选一的字符串；能合并为同一个状态的，在重构时再收拢
- 一般不要将 props 包装进 state，除非只需要把父组件传来的 props 当作初始化值

## state 初始化与重置

- state 只在组件初次渲染时初始化，之后重新渲染不会再用 props 覆盖已有 state
- 只要组件还渲染在 UI 树的相同位置，React 就保留它的 state；被移除后再回来的组件拿不到上一次遗留的状态
- 想在相同位置重置 state，可以给组件加上一个稳定的 `key`，key 变化时组件会作为新的实例重新挂载

## useReducer

- 状态更新逻辑比较分散时，可以用 reducer 集中处理：`useReducer(reducer, initialArg)` 返回当前状态和 `dispatch` 函数
- 派发动作时调用 `dispatch(action)`，由纯函数 reducer 根据旧状态和动作算出下一个状态，组件只描述要做什么
- reducer 必须是纯函数，不在这里改外部变量、发请求或操作 DOM

```js
function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, initialArg);
```

## Context 与 memo 的配合

- 读取 context 的组件在 Provider 的 value 变化时会自动重渲染，即使外层用 `memo` 包裹也不会被挡住
- Provider 传入的 value 与上一次用 `Object.is` 比较，每次渲染新建的对象或数组会让所有消费方跟着重渲染，必要时可以用 `useMemo` 固定引用
- 上层没有 Provider 时，`useContext` 返回创建 context 时传入的默认值；局部子树可以再包一层 Provider，用不同的值覆盖上层提供的 context
- context 的默认值只在上方没有任何 Provider 时使用，一旦存在对应 Provider，就不会回退到默认值
- 把 state 和 dispatch 一起放进 context，组件树任意位置都能读取状态和派发动作；进一步可以把 state、dispatch 和提供 context 的 JSX 抽到同一个文件，封装成自定义 Hook 供组件使用
- context 适合跨多层传递主题、语言、当前用户这类全局信息；props 逐层传递适合明确父子契约的场景，能用 props 或 children 传递时优先于使用 context

## 参考

- https://react.dev/reference/react/useState
- https://react.dev/reference/react/useReducer
- https://react.dev/reference/react/useContext
- https://react.dev/reference/react/memo
