---
title: Vue-Vue3介绍
date: 2018-05-05 03:47:56
categories:
- web
tag: 
- vue
---

<div class="essay-banner essay-vue"></div>

# Vue3介绍

* Vue 提供了一套`声明式`的、`组件化`的编程模型

## Vue 的两个核心功能

* 声明式渲染: Vue 基于标准 HTML 拓展了一套模板语法，使得我们可以`声明式地描述`最终输出的 HTML 和 JavaScript 状态之间的`关系`。
* 响应性: Vue 会`自动跟踪` JavaScript 状态并在其`发生变化时响应式的更新` DOM。

## 单文件组件

* 我们可以使用一种类似 HTML 的格式来书写 Vue 组件
* 单文件组件(.vue 文件)英文缩写 SFC
* 单文件组件中会有一个组件的逻辑，模板，样式

## typescript 相关

* Volar 和 Vscode 都会开启服务来支持 TS 语法, 在大型项目中可能存在性能问题，可以进行优化
* `<template>` 中也会支持 TS 语法

## script setup

* 能够使用纯 TypeScript 声明 props 和自定义事件。
* `<script setup>` 里面的代码会被编译成组件 setup() 函数的内容。这意味着与普通的 `<script>` 只在组件被首次引入的时候执行一次不同，`<script setup>` 中的代码会在 `每次组件实例被创建` 的时候执行
* 当使用 `<script setup>` 的时候，任何在 `<script setup>` 声明的顶层的绑定 (包括变量，函数声明，`以及 import 导入的内容`) 都能在模板中直接使用(因为 `<template>` 会被编译成, 在 `setup()` 函数作用域内的 rander() 渲染函数)
* defineProps() 和 defineEmits():为了在声明 props 和 emits 选项时获得完整的类型推导支持，我们可以使用 defineProps 和 defineEmits API，它们将自动地在 `<script setup>` 中可用
* `<script setup>` 中可以使用顶层 await。结果代码会被编译成 `async setup()`

## 自定义指令

* 自定义指令主要是为了`重用涉及普通元素的底层 DOM 访问的逻辑`。

## 组合式函数

* 组合式函数(Composables) 是一个利用 Vue 的组合式 API 来封装和复用`有状态逻辑`的函数。
* 推荐在组合式函数中使用 ref 而不是 reactive, 因为 reactive 会在解构的时候失去响应式

## 插件

1. 通过 `app.component()` 和 `app.directive()` 注册一到多个全局组件或自定义指令。
2. 通过 `app.provide()` 使一个资源可被注入进整个应用。
3. 向 `app.config.globalProperties` 中添加一些全局实例属性或方法

## 模板中受限的全局访问

* 模板中的表达式将被沙盒化，仅能访问到受限的全局对象，比如 Math Date
* 例如用户添加在 window 上的属性并不能直接在模板中使用，除非使用 app.config.globalProperties 显式的添加它们

### 依赖注入与全局属性

* Vue3 中的全局属性仅作为对于 Vue2 中的 Vue.prototype 的兼容，只推荐在 Vue3 的选项式 API 写法中使用
* Vue3 的组合式 API 写法只能在`模板`中访问到全局属性，无法在 `<script>` 中访问全局属性，因此十分不推荐在 Vue3 + 组合式 API 的写法中使用全局属性，而是全面使用`依赖注入`来代替

## 响应式基础

- 组合式 API 中用 `ref()` 声明响应式值，脚本里通过 `.value` 访问，模板中使用时会自动解包
- `reactive()` 用来为对象建立响应式代理；它只能用于对象类型，不能持有字符串、数字、布尔这样的原始类型
- 把 `reactive` 返回对象的原始类型属性解构为本地变量时，会断开与原状态的响应式连接，因此官方建议把 `ref()` 作为声明响应式状态的主要 API
- ref 可以持有包括对象、数组、`Map` 在内的任意类型值，非原始值会通过 `reactive()` 转换为响应式代理
- 普通 JavaScript 变量无法被响应式系统追踪，`.value` 属性让 Vue 有机会拦截 ref 的访问和修改
- ref 在模板中使用时自动解包，脚本里访问需要带上 `.value`
- reactive 返回的是代理对象，修改原始对象不会触发更新，应始终通过代理访问状态

```js
import { ref, reactive } from 'vue';

const count = ref(0);
const state = reactive({ name: 'Vue' });
```

## 响应式追踪的基本机制

- 组件首次渲染时追踪用到的每一个 ref，ref 被修改时触发追踪它的组件重新渲染
- 响应式系统基于依赖追踪工作，而不是手动订阅状态变化
- 对同一个原始对象多次调用 `reactive()` 会返回同样的代理对象，对代理对象再调用 `reactive()` 会返回它本身

## 选项式 API 与组合式 API

- 选项式 API 通过 `data`、`methods`、`computed`、`watch` 等选项组织组件逻辑，`this` 指向当前组件实例
- 组合式 API 在 `<script setup>` 中用导入的 API 声明状态和方法，顶层绑定可以直接在模板使用
- 两种风格可以在同一个项目中并存，组件代码组织方式按项目习惯选择即可

## 组合式逻辑复用

- 有状态的可复用逻辑封装在组合式函数中，多个组件调用同一个函数时各自持有独立的状态副本
- 组合式函数内部推荐使用 ref 而不是 reactive，避免解构时丢失响应式连接

## 参考

- https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html
- https://cn.vuejs.org/guide/essentials/computed.html
- https://cn.vuejs.org/guide/essentials/watchers.html
