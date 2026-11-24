---
title: React-UI描述
date: 2018-04-12 19:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-react"></div>

# React

## UI 描述

## 一、JSX 语法

- React 组件使用一种叫做 JSX 的语法扩展来表示组件的 UI，JSX 和 HTML 很像，但它更为严格，`标签必须闭合`，并且一个组件只能返回一个根元素(因为 JSX 会被转化为 JS 对象，一个函数不能返回多个对象)
- 因为 JSX 会被转化成 JS，因此 JSX 中的属性命名有限制，大部分属性使用驼峰式命名法(由于历史原因 `aria-*`, `data-*` 属性可以使用连字符)，不能包含 `-` 连字符，不能使用 class 关键字，而应该使用 className
- 在 JSX 中通过大括号使用 JavaScript 表达式
- undefined, null, false/true 等不会在 JSX 中渲染任何内容
- JSX 中不允许直接渲染一个对象
- JSX 语句和 return 关键字在同一行时可以省略 `()`, 不在同一行时需要使用 `()` 来包括 JSX 的内容

```js
function Heading({ level, children }) {
  const Heading = level;
  return <Heading>{children}</Heading>;
}

export default function Home() {
  const level = "h2";
  return (
    <section>
      <Heading level={level}>我是{level}</Heading>
    </section>
  );
}
```

### 2.1 组件传值

- React 组件使用 props 来进行组件之间的通讯
- 父组件传递给子组件的属性，都在一个名为 props 的对象中，为了简化代码，我们可以在子组件函数中直接使用解构赋值的方式拿取具体属性
- 即使传递的是 className 这种 DOM 元素上固有的 prop, 也不会自动进行应用。需要手动去指定
- props 是不可变的，当你需要交互性时，你可以设置 state
- Props 是只读的时间快照：每次渲染都会收到新版本的 props

### 2.2 条件渲染

```js
// 使用 if 分支来区分大块的 DOM
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  } else {
    return <li className="item">{name}</li>;
  }
}

// 使用三目运算符来控制更小快的 DOM
function Item({ name, isPacked }) {
  return <li className="item">{isPacked ? name + "✔" : name}</li>;
}

// 使用 && 操作符，表示只有在条件成立时才渲染一些内容
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name}
      {isPacked && "✔"}
    </li>
  );
}

// 不在 JSX 中进行条件判断，而是根据条件来操作变量，在 JSX 中直接使用变量
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + "✔";
  }
  return <li className="item">{itemContent}</li>;
}
```

## 列表渲染

- 用数组的 `map()` 遍历数据，把每一项转成 JSX 节点，外层用 `<ul>` 之类的父元素包裹返回
- 每个列表项要带上同级唯一的 `key`，React 依据 key 在插入、删除或排序时正确对应组件与 DOM 节点
- 数据来自数据库时用数据库的 ID；本地生成并持久化的数据可以用自增计数器或随机 UUID，不要在渲染时用 `Math.random()` 现场生成 key

```js
const people = [
  { id: 1, name: 'Ada' },
  { id: 2, name: 'Lin' },
];

const listItems = people.map(person => (
  <li key={person.id}>{person.name}</li>
));
```

## 事件处理

- 给元素绑定交互行为使用 `onClick` 这类驼峰式 prop，值是事件处理函数而不是字符串
- 处理函数接收 DOM 事件对象，需要阻止默认行为时调用事件对象的 `preventDefault()`
- 事件处理程序里可以读取 props 和 state，也可以调用 set 函数更新状态；渲染表达式本身不要写副作用逻辑

## 参考

- https://react.dev/learn/rendering-lists
- https://react.dev/learn/responding-to-events
- https://react.dev/reference/react/memo
