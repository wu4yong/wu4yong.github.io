---
title: Vue-事件的监听
date: 2018-05-28 16:19:00
categories:
- web
tag: 
- vue
---

<div class="essay-banner essay-vue"></div>

# Vue 中事件的监听

内联事件处理器：事件被触发时执行的内联 JavaScript 语句。
方法事件处理器：一个指向组件上定义的方法的属性名或是路径。

## 直接在 DOM 中监听事件

- 无需再 js 中手动绑定事件，代码可以是纯粹的逻辑，和 DOM 解耦
- 当一个视图模型被销毁时，所有的事件处理器都会被自动删除。

## 二、参数问题

### 2.1 方法事件处理器

1. 事件函数没有定义形参，在函数体内直接使用 event 就能访问到 event 事件对象
2. 事件函数只定义了一个形参，在函数体中使用这个形参就是 event 事件对象

### 2.2 内联事件处理器

1. 在事件函数的实参中，使用 `$event` 显式的声明
2. 在事件函数中没有用 `$event` 显式的定义实参，则不需要在事件函数中定义形参，直接在函数体中使用 event 来访问事件对象。

### 2.3 即需要事件对象又需要自定义参数

```html
<!-- 使用特殊的 $event 变量 -->
<div class="header" @click="btnClick(123, $event)">ViewFirst组件</div>

<!-- 使用内联箭头函数-->
<div class="header" @click="(event) => btnClick(123, event)">ViewFirst组件</div>
```

## .native 修饰符

- 组件不能和 DOM 一样直接的添加原生的事件。要加上.native 修饰符
- 用来监听组件根元素的原生事件

## v-on 与处理器形式

- `v-on` 指令可以简写为 `@`，例如 `v-on:click` 写成 `@click`
- 模板编译器通过检查 `v-on` 的值是否为合法标识符或属性访问路径来区分方法处理器和内联处理器，`foo`、`foo.bar` 视为方法处理器，`foo()`、`count++` 视为内联处理器
- 方法事件处理器会自动接收原生 DOM 事件并触发执行；视图模型被销毁时，绑定的事件处理器会自动删除，不需要手动解绑
- 内联事件处理器在事件触发时执行内联 JavaScript 语句，写法与原生 onclick 类似
- 方法事件处理器的值是指向组件上已定义方法的属性名或路径

## 事件修饰符

- `.stop`：调用 `event.stopPropagation()`，阻止事件继续向上传递
- `.prevent`：调用 `event.preventDefault()`，阻止事件的默认行为，例如表单提交刷新页面
- `.self`：只有 `event.target` 是元素本身时才触发处理器，来自子元素的事件不会触发
- `.capture`：以捕获模式添加监听器，内部元素的事件先被外部处理器处理
- `.once`：点击事件最多触发一次
- `.passive`：告知浏览器不会在处理器里调用 `preventDefault()`，一般用于触摸事件监听器，改善移动端滚屏性能
- `.capture`、`.once`、`.passive` 与原生 `addEventListener` 的对应选项一致
- `.passive` 不能和 `.prevent` 同时使用，否则 `.prevent` 会被忽略，浏览器还会给出警告
- 修饰符可以链式书写，顺序会影响生成代码的顺序，例如 `.prevent.self` 和 `.self.prevent` 行为并不相同
- 修饰符可以单独使用而不带处理器，例如只写 `@submit.prevent`
- 模板层面的修饰符让方法更专注数据逻辑，不必在方法内部处理 DOM 事件细节
- `.once` 与原生监听器只监听一次的行为对应

```html
<a @click.stop="doThis"></a>
<form @submit.prevent="onSubmit"></form>
<div @click.self="doThat">...</div>
```

## 按键与系统按键修饰符

- 监听键盘事件时可以用按键名作为修饰符，例如 `@keyup.enter`；常用别名还有 `.tab`、`.delete`、`.esc`、`.space`、`.up`、`.down`、`.left`、`.right`
- `.delete` 同时捕获 Delete 和 Backspace 两个按键
- 系统按键修饰符 `.ctrl`、`.alt`、`.shift`、`.meta` 只有在对应按键按下时才触发
- 配合 `.exact` 可以精确控制需要按下的系统按键组合，也支持在没有按下任何系统按键时触发
- 系统按键修饰符和 `keyup` 一起使用时，要求松开按键时对应系统键仍处于按下状态
- 其他按键名取自 `KeyboardEvent.key`，作为修饰符时转为 kebab-case，例如 PageDown 写成 `page-down`
- 在 Mac 键盘上 meta 对应 Command 键，在 Windows 键盘上 meta 对应 Windows 键
- 鼠标按键修饰符 `.left`、`.right`、`.middle` 分别限定由主、次、辅助鼠标按键触发
- 鼠标按键修饰符指代设备事件的主、次、辅助按键，而不固定对应物理鼠标的左、右、中键
- 内联处理器中可以用 `$event` 把原生事件显式传给组件方法

## .native 修饰符的版本变化

- `.native` 是 Vue 2 的写法，用来把原生 DOM 监听器加到子组件的根元素上
- Vue 3 移除了 `.native` 修饰符；子组件未通过 `emits` 声明的事件监听器，会作为原生事件监听器挂到根元素上（除非设置了 `inheritAttrs: false`）
- 升级到 Vue 3 时应删除所有 `.native` 实例，并用 `emits` 选项记录组件真正会触发的自定义事件

## 参考

- https://cn.vuejs.org/guide/essentials/event-handling.html
- https://v3-migration.vuejs.org/zh/breaking-changes/v-on-native-modifier-removed.html
