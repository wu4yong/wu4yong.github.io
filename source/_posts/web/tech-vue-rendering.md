---
title: 技术文档总结-Vue页面渲染原理
date: 2018-01-27 21:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-tech"></div>

# 技术文档总结

## 一文吃透 Vue 渲染机制：模板编译、虚拟 DOM、key 作用与 nextTick 原理

## 一、Vue 中的相关概念

![Vue虚拟DOM的示意图](@@CDN@@/assets/img/web/tech-vue-rendering/img-01.webp)

### 1.1 状态

- 开发者定义和操作的数据

```js
const isShow = ref(true);
const name = ref("no One");
const userList = reactive(["foo", "bar", "baz"]);
function handleClickName() {
  alert("click name");
}
```

### 1.2 模板

- 开发者使用模板来`声明式的描述`状态与 DOM 间的映射关系

```html
<template>
  <div class="vue-test">
    <span v-if="isShow" @click="handleClickName"> {{ name + ' org' }} </span>
    <ul>
      <li v-for="item in userList" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>
```

### 1.3 渲染函数

- Vue 通过编译将 template 模板转换为渲染函数(render)，执行渲染函数就能够得到 Virtual DOM。

```js
// Render 函数中也包含状态和 DOM 之间的映射关系
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    _openBlock(),
    _createElementBlock("div", _hoisted_1, [
      $setup.isShow
        ? (_openBlock(),
          _createElementBlock(
            "span",
            {
              key: 0,
              onClick: $setup.handleClickName,
            },
            _toDisplayString($setup.name + " org"),
            1
            /* TEXT */
          ))
        : _createCommentVNode("v-if", true),
      _createElementVNode("ul", null, [
        (_openBlock(true),
        _createElementBlock(
          _Fragment,
          null,
          _renderList($setup.userList, (item) => {
            return (
              _openBlock(),
              _createElementBlock(
                "li",
                { key: item },
                _toDisplayString(item),
                1
                /* TEXT */
              )
            );
          }),
          128
          /* KEYED_FRAGMENT */
        )),
      ]),
    ])
  );
}
```

### 1.4 虚拟 DOM 结点

- Render 函数的执行会生成 VNode
- 本质上就是 JS 对象，对象描述了应该怎样去创建真实的 DOM 结点。

```js
// 该虚拟 DOM 结构是简化版，只展示了重点信息
{
  type: "div",
  props: {
    class: "vue-test",
  },
  children:[
    {
      type: "span",
      props: {
        key: 0,
        onClick: handleClickName
      },
      children: "no One org"
    },
    {
      type: "ul",
      children:[
        {
          type: "li",
          props: {
            key: 'foo'
          },
          children: "foo"
        }
        ...
      ]
    }
  ]
}
```

### 1.5 patch 算法

- 最终目的是将 VNode 渲染成真实的 DOM

```js
// 页面的渲染并不是什么高级的黑魔法，本质上调用的也还是 DOM API
document.createElement(VNode.type);
```

### (1) diff 算法

- 渲染过程中的一种优化方案。使得 Vue 可以不必暴力绘制全部的 DOM 结点。而是通过对比新旧 VNode 的不同, 仅对差异点进行更新

## 二、视图层框架的范式

### 2.1 命令式范式

- JQ 是典型的命令式框架, 命令式框架`关注过程`

```txt
01 - 获取 id 为 app 的 div 标签
02 - 它的文本内容为 hello world
03 - 为其绑定点击事件
04 - 当点击时弹出提示：ok
```

- 翻译成对应的代码，自然语言能够和代码产生`一一对应`的关系

```js
01 $('#app') // 获取 div
02   .text('hello world') // 设置文本内容
03   .on('click', () => { alert('ok') }) // 绑定点击事件
```

### 2.2 声明式范式

- Vue 是典型的声明式框架，声明式框架关注`结果`。实现该结果的过程由 Vue 完成

```js
// 采用 Vue3 语法作为示例
<div @click="() => alert('ok')">{{ text }}</div>
const text = ref('hello world')
```

- Vue 框架借用虚拟 DOM + diff 算法来实现声明式，虚拟 DOM 不等同于声明式，只是一种达到目的的手段

- Solid.js、Svelte.js 框架同样都是声明式框架，但都不是通过虚拟 DOM 的方式来实现的

### 2.3 不同范式下更新内容

### (1)命令式

```js
// 一、开发者书写代码
$("#app").text("no One");

// 二、JQ 框架执行过程
div.textContent = "no One";
```

### (2) 声明式

```js
// 一、开发者书写代码
text.value = "no One";

// 二、Vue 框架执行过程
// 1. 通过 diff 算法得到本次更新的差异
// 2. 调用原生方法来更新变化的内容
div.textContent = "no One";
```

> 声明式代码的性能不优于命令式代码的性能

- 假设直接修改的性能消耗为 A，找出差异的性能消耗为 B

1. 命令式更新的性能消耗：A
2. 声明式更新的性能消耗：B + A

- 声明式代码更新的性能`理论上`不会好于命令式代码更新(`此处的命令式代码更新指的是极致优化的情况下`)，因为声明式会`多一次查找差异`的过程。

## 三、虚拟 DOM 性能真的好吗？

### (1) 操作 DOM 的代价是昂贵的

操作对象:

```js
const app = [];
console.time("操作对象");
for (let index = 0; index < 10000; index++) {
  const div = { tag: "div", class: "child" };
  app.push(div);
}
console.timeEnd("操作对象");

// 操作对象: 0.265869140625 ms
```

操作 DOM:

```js
const app = document.querySelector("#app");
console.time("操作DOM");
for (let index = 0; index < 10000; index++) {
  const div = document.createElement("div");
  div.setAttribute("class", "child");
  app.appendChild(div);
}
console.timeEnd("操作DOM");

// 操作DOM: 6.808837890625 ms
```

> `操作 DOM 的代价是昂贵的!`, 操作 JS 与操作 DOM 的时间相差了 25 倍

### (2) 场景分析

假设场景: 一个列表中有 100 条数据，在进行一次操作之后需要删除前 10 条数据，末尾添加 10 条数据。

`1.命令式写法（直接操作DOM、不使用优化手段）：`: 直接将最新的 100 条数据进行循环渲染。

- 耗费性能: 删除 100 个 DOM, 添加 100 个 DOM
- 编码难易: 虽然需要操作 DOM，但是操作手段简单粗暴。不需要考虑 DOM 的变化点

`2.声明式写法（借用虚拟 DOM、diff 算法）`: 先查找差异，再针对变化的部分进行渲染

- 耗费性能: 删除 10 个 DOM, 添加 10 个 DOM， 加上寻找差异的时间
- 编码难易: 声明式的代码，不需要操作 DOM，编码简单，程序的可维护性高

`3.命令式写法(直接操作DOM、极致的优化手段):` 开发者要明确 DOM 的变化。手动对需要变动的地执行方 DOM 操作

- 耗费性能: 删除 10 个 DOM, 添加 10 个 DOM
- 编码难易: 需要明确 DOM 的变化点, 需要手动进行大量 DOM 操作。程序可维护性差。

### (3) 结论

- 命令式代码(极致优化下)：性能最好、但是难以维护、开发效率低(手动实现创建、更新、删除等工作)
- 声明式代码： 容易维护、开发效率高、`相对不错的性能`
- 权衡的艺术 - 在真实的业务场景中 DOM 会是更加复杂的树形结构(不仅 DOM 节点是树形的，节点下的属性也是树形的)。大部分情况下，开发者`很难写出绝对优化的命令式代码(1、需要学习高效操作 DOM 的知识 2、需要明确 DOM 的变化点)`。即使写出了极致优化的代码也一定会耗费巨大精力，投入产出比并不高。借用虚拟 DOM + diff 来更新页面，能保证开发者既能享受到声明式代码的便利之处和可维护性，又能得到一个相对不错的性能。

## 三、页面渲染

### 3.1 页面初始绘制

- 页面的首次渲染比较简单，仅需要按照 VNode 的结构创建新的 DOM，并挂载到真实结点上即可

### 3.2 页面的更新

通常，在运行时应用内部的状态会不断发生变化，此时需要不停地重新渲染。Vue 如何知道有哪些 DOM 结构需要被重新渲染？如何去更新 DOM 结构。

使用`数据代理`的方式来解决这个问题。

1. 读取响应式数据时，使用数组收集对应的副作用函数
2. 设置响应式数据时，逐个触发数组中所有的副作用函数

### (1) 更新粒度

> Vue 组件保持状态和 DOM 同步的方式：每个组件实例创建一个响应式副作用来渲染和更新 DOM

- Vue 更新的粒度为 `中粒度`。即一个 template 中使用的响应式数据所绑定的副作用并不是具体的 DOM 结点也不是整个网页。而是一个组件，当状态发生变化后会通知组件进行更新

```vue
<template>
  <div class="vue-test">
    <span @click="handleClickName">
      {{ name + " org" }} // 模版中使用响应式数据
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref, effect } from "vue";
// 一、定义响应式数据
const name = ref("no One");
// 二、为响应式数据注册副作用函数
effect(() => {
  console.log("name", name);
});
// 三、更改响应式数据，从而触发副作用函数执行
function handleClickName() {
  name.value = name.value + "1";
}
</script>
```

![副作用函数的收集](@@CDN@@/assets/img/web/tech-vue-rendering/img-02.webp)

- name 对应的 deps 数组中一共有两个副作用函数

1. 模版中使用 name, 自动注册的组件更新副作用函数
2. 使用 effect 注册的自定义副作用函数

![组件更新副作用函数](@@CDN@@/assets/img/web/tech-vue-rendering/img-03.webp)

1. 在 componentUpdateFn 函数中打断点
2. 触发 handleClickName 方法从而触发 name 的更新
3. name 的每次更新都会调用一次当前组件更新的副作用函数

### (2) React 和 Vue 页面更新对比

```vue
<template>
  <div>
    {{ msg }}
    // ChildComponent 中未用到 msg 变量
    <ChildComponent />
  </div>
</template>

// 触发 msg.value = 'new msg'
```

1. Vue: 在此场景下，只有当前组件会更新，并不会触发子组件 ChildComponent 的更新
2. React: 在此场景下， 是自顶向下的进行递归更新的，也就是说会触发子组件 ChildComponent 的更新。假如 ChildComponent 里还有十层嵌套子元素，那么所有的子元素都会更新

## 四、Vue 中的 key 值

> Vue 默认按照“就地更新”的策略来更新通过 v-for 渲染的元素列表。当数据项的顺序改变时，Vue 不会随之移动 DOM 元素的顺序，而是就地更新每个元素，确保它们在原本指定的索引位置上渲染

> 默认模式是高效的，但`只适用于列表渲染输出的结果不依赖子组件状态或者临时 DOM 状态` (例如表单输入值) 的情况。

> key 这个特殊的 attribute 主要作为 Vue 的虚拟 DOM 算法提示，在比较新旧节点列表时用于识别 vnode。只要两个 VNode 的 `type` 属性值和 `key` 属性值`都相同`，那么我们就认为它们是相同的，即可以进行 DOM 的复用(DOM 可复用并不意味着不需要更新)

### 4.1 列表渲染依赖子组件状态

```vue
// 一、父组件中定义一个列表
<template>
  <el-table :data="userList" style="width: 100%">
    <el-table-column prop="name" label="UserName" />
    <el-table-column prop="age" label="UserAge">
      <childComponent></childComponent>
    </el-table-column>
  </el-table>

  <el-button @click="changeData">changeData</el-button>
</template>

<script lang="ts" setup>
import childComponent from "./cpts/child-component.vue";
import { ref } from "vue";

// 模拟接口请求
function changeData() {
  userList.value = [
    { name: "baz", age: "" },
    { name: "fff", age: "" },
  ];
}
const userList = ref([
  { name: "foo", age: "" },
  { name: "bar", age: "" },
]);
</script>

// 二、子组件独立维护年龄
<template>
  <span class="child-component">
    {{ age }}
    <el-button @click="() => (age -= 1)">-</el-button>
    <el-button @click="() => (age += 1)">+</el-button>
  </span>
</template>

<script lang="ts" setup>
import { ref } from "vue";
// 默认值 18
const age = ref(18);
</script>
```

![改变列表数值前](@@CDN@@/assets/img/web/tech-vue-rendering/img-04.webp)
![改变列表数值后](@@CDN@@/assets/img/web/tech-vue-rendering/img-05.webp)

1. 前提: 列表渲染依赖子组件状态、使用默认更新策略
2. 现象: 更改 foo bar 的年龄后，更换列表数据。但是子组件并没有被初始化
3. 原因: 数据变更前后，foo 和 baz 具有相同的 type 和 key。Vue 在进行 VNode 对比时认为是同一个 VNode。所以不会有 DOM 的销毁与重建，只会更新差异部分(更新了页面中的 name)。子组件复用之前的 DOM 结构，所以 age 未被初始化

### 4.2 列表渲染依赖临时 DOM 状态

> 在 Vue 中，临时 DOM 状态通常指的是那些不是由 Vue 响应式系统管理的、与用户交互直接相关的 DOM 状态。这些状态不会被 Vue 的响应式数据跟踪

临时 DOM 状态包括：

1. 元素滚动的位置
2. 视频播放状态：进度、播放、暂停、音量等
3. 由第三方库直接操作的 DOM 状态(例如、动画库可能会直接修改 DOM 元素的样式或者类)

```vue
<template>
  <div>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <input v-model="item.value" placeholder="Edit me" />
        <button @click="removeItem(index)">Remove</button>
      </li>
    </ul>
    <button @click="addItem">Add Item</button>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

const items = reactive([
  { id: 1, value: "Initial value 1" },
  { id: 2, value: "Initial value 2" },
  { id: 3, value: "Initial value 3" },
]);

setTimeout(() => {
  items.splice(1, 1);
}, 4000);
</script>
```

![改变数据前光标](@@CDN@@/assets/img/web/tech-vue-rendering/img-06.webp)
![改变数据后光标](@@CDN@@/assets/img/web/tech-vue-rendering/img-07.webp)

1. 前提: 列表渲染依赖临时 DOM 状态、使用默认更新策略
2. 现象: 将 ID 为 2 input 置为 focus 状态，然后 4000ms 后被删除，页面重新渲染。但是发现此时 ID 为 3 的 input 被置为了 focus 状态
3. 原因: 数据变更前后，Vue 复用了 DOM 结构，将本次页面渲染当做更新来操作而不是销毁重建。和响应式数据相关的状态会更新，但是临时 DOM 状态被复用

### 4.3 加入 key 来优化列表更新

![Vue的key值](@@CDN@@/assets/img/web/tech-vue-rendering/img-08.webp)

1. 场景: 列表原有六条数据，在中间新加一条数据
2. 不加 key: 更新两个 DOM 结点，新建一个 DOM 结点
3. 加 key: 仅新建一个 DOM 结点

### 4.4 key 的应用

1. 如上例，优化列表渲染性能
2. 强制替换一个元素/组件而不是复用它(1. 适当的时候触发组件的生命周期狗子 2.触发过渡效果 3. 强制组件重新渲染)

### 4.5 结论

> `推荐`在任何可行的时候为 v-for 提供一个 key attribute，除非所迭代的 DOM 内容非常简单 (例如：不包含组件或有状态的 DOM 元素)，或者你想有意采用默认行为来提高性能。

## 五、Vue 的 nextTick

1. 作用: 等待下一次 DOM 更新刷新的工具方法
2. 出现原因:  当你在 Vue 中更改响应式状态时，最终的 DOM 更新并不是同步生效的，而是由 Vue 将它们缓存在一个队列中，直到下一个“tick”才一起执行。这样是为了确保每个组件无论发生多少状态改变，都仅执行一次更新。
3. 现实意义: 异步渲染最终目的是，将多次数据变化所引起的响应变化收集后合并成一次页面渲染，避免不必要的渲染，从而提升性能与用户体验。

> 数据变化 –> 收集 watcher -> 执行 render() 生成最新的 VNode -> diff 找出差异 -> 更新差异部分(渲染 DOM)

### 5.1 适用场景

1. 对一个数据连续更改多次：页面只会渲染最终的状态，防止界面的闪烁
2. 连续多次更改数据：合并 收集 watcher 之后的流程，减少性能消耗
