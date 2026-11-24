---
title: Vue-双向绑定
date: 2018-05-17 17:49:17
categories:
- web
tag: 
- vue
---

<div class="essay-banner essay-vue"></div>

# vue双向绑定

## v-model 指令

- 双向绑定：数据可以影响视图，视图的更改也能影响数据
- 两个指令的结合：v-bind 指令和 v-on：input 的结合
- input 事件使用 $event.target.value 来获取当前表单的最新值

## 双向绑定的强大

- v-model 会根据不同的控件类型来选取正确的方法来更新元素
- v-model 会忽略所有表单元素的 value,checked，selected attribute 的初始值总是把 Vue 实例的数据作为数据来源

## v-model 的实现原理

```javascript
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
    // 父组件通过 props 来传递这个值
      v-bind:value="value"
    // 提交这个input的input事件和值
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})

// 组件调用的地方，直接使用v-model来声明值
// 默认情况下，只需要在调用自定义组件的时候。绑定一个v-model就行了。
// 会自动的把 v-model 绑定的值，通过 value (除非通过 model 模块重新指定)属性传到子组件中，父组件也会自动将子组件的 input (除非通过 model 模块重新指定) 事件的参数赋给。v-model 绑定的值。
<custom-input v-model="searchText"></custom-input>
```

## model 模块

- 一个组件上的 v-model 会默认利用名为 value 的 prop 和名为 input 的事件，但是像单选框，复选框类型的输入控件会不同，所以引用 model 模块来规范

```javascript
Vue.component('base-checkbox', {
  model: {
    // 使用 model 模块将默认的 value 指定为 checked，input 事件指定为 change 事件
    prop: 'checked',
    event: 'change'
  },
  props: {
    // checked 必须要在 props中声明
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      <!-- $event.target.checked 是 checked 不是 value -->
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})
<base-checkbox v-model="lovingVue"></base-checkbox>
// <!-- 这里的 lovingVue 的值将会传入这个名为 checked 的 prop。同时当 <base-checkbox> 触发一个 change 事件并附带一个新的值的时候，这个 lovingVue 的 property 将会被更新。 -->
```

## 内置控件的绑定方式

- 文本类型的 `input` 和 `textarea` 绑定 `value` property 并监听 `input` 事件
- `checkbox` 和 `radio` 绑定 `checked` property 并监听 `change` 事件；`select` 绑定 `value` property 并监听 `change` 事件
- `v-model` 会忽略表单元素上初始的 `value`、`checked`、`selected` attribute，始终把当前绑定的 JavaScript 状态作为数据来源
- 中文、日文、韩文等需要输入法拼字的语言，`v-model` 不会在 IME 拼字阶段触发更新；需要拼字阶段也更新时，要自行监听 `input` 事件并手动绑定 `value`
- 复选框配合 `true-value`、`false-value` 可以把选中和取消选中绑定为非布尔值，通过 `v-bind` 还能绑定对象等非字符串类型

## v-model 的修饰符

- `.lazy`：默认 `v-model` 在每次 `input` 事件后更新数据，加上 `.lazy` 改为在每次 `change` 事件后更新
- `.number`：让输入自动转为数字；值无法被 `parseFloat()` 处理时返回原始值，输入为空时返回空字符串；输入框自带 `type="number"` 时该修饰符自动启用
- `.trim`：自动去除用户输入内容两端的空格

```html
<input v-model.lazy="msg" />
<input v-model.number="age" />
<input v-model.trim="msg" />
```

## 组件上的 v-model（Vue 3）

- Vue 2 中组件的 `v-model` 默认绑定名为 `value` 的 prop 和名为 `input` 的事件，也可以通过 `model` 选项重新指定 prop 和事件名
- Vue 3 中组件 `v-model` 默认使用名为 `modelValue` 的 prop 和名为 `update:modelValue` 的事件；父组件的 `v-model="foo"` 会被编译为 `:modelValue="foo"` 加 `@update:modelValue` 监听
- 从 Vue 3.4 开始，可以用 `defineModel()` 宏在子组件里直接拿到一个双向绑定的 ref，底层仍展开为 `modelValue` prop 和 `update:modelValue` 事件
- 一个组件上可以绑定多个 `v-model`，分别使用如 `firstName` 这样的名字，对应各自的 prop 和 `update:firstName` 事件

## 参考

- https://cn.vuejs.org/guide/essentials/forms.html
- https://cn.vuejs.org/guide/components/v-model.html
