---
title: 技术文档总结-国际化
date: 2018-01-31 03:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-tech"></div>

# 技术文档总结

## 国际化方案

## i18n Ally 插件

1. 内联显示翻译
2. 直接在当前页面修改
3. 一次性查看所有翻译

## 多语言文件

- 不能仅有 JS、JSON 格式的多语言文件
  1. 给非技术人员审核
  2. 给用户定制词条

维护一个 Excel 文件，行(每个词条)列(多国语言)
   1. 由多个 JS、JSON 文件转化为一个 Excel 文件
   2. 由一个 Excel 文件转化为多个 JS、JSON 文件

Electron 编写桌面端 APP

## 界面适配

1. 常见的响应式方案
2. 打点省略、多行打点省略、flex 不定宽子项打点省略

## 浏览器内置的 Intl 能力

- `Intl` 命名空间提供语言敏感的字符串比较、日期时间格式化、数字格式化等内置能力
- `Intl.DateTimeFormat`、`Intl.NumberFormat`、`Intl.Collator` 接收 locale 与 options 参数
- locale 标识遵循 BCP 47 写法，例如 `zh-Hans-CN`、`de-AT`；运行时找不到匹配 locale 时会回退到系统默认 locale
- 可以读取 `navigator.languages` 作为偏好列表，由运行时完成 locale 协商
- 排序、大小写、复数形式等语言相关规则交给 Intl 处理，不在前端自己写分支判断
- 相对时间、复数规则等场景分别由对应的 Intl 构造器提供支持
- 字符串排序规则随语言不同，比较文本时交给 `Intl.Collator` 处理，而不是默认按字符编码比较

```js
const date = new Date('2012-05-24')
const count = 26254.39
new Intl.DateTimeFormat('en-US').format(date)
new Intl.NumberFormat('de-DE').format(count)
```

## i18next 的词条组织

- `init()` 传入 `lng` 与 `resources`，词条按语言和命名空间存放；`t()` 函数按 key 取出对应译文
- 缺少当前语言译文时，可以通过 `fallbackLng` 配置回退语言；插值、复数、格式化由相应能力处理
- 框架侧使用对应的绑定层（如 react-i18next），不在业务代码里手动拼接 HTML 字符串
- 命名空间按页面或模块拆分，避免所有词条堆在同一个文件里

```js
import i18next from 'i18next'

i18next.init({
  lng: 'en',
  resources: {
    en: { translation: { key: 'hello world' } }
  }
})
i18next.t('key')
```

## 界面适配的注意点

- 不同语言的文案长度差异较大，布局要允许宽度伸缩，避免固定宽度导致文字被截断
- 日期、数字、货币、字符串排序按 locale 处理，不要在前端硬编码格式
- 词条文件按语言分目录维护，新增词条时同步补齐各语言版本，避免出现漏译
- 多行省略、不定宽子项省略等样式，要在文案变长或变短时都保持可读
- 标点、复数与语序随语言变化，句子结构不要写成只能适配单一语言的拼接方式
- 日期顺序（月/日/年与日/月/年）随 locale 不同，展示格式不要在代码里写死

## 词条文件的维护方式

- 词条 key 按页面或功能模块分组，命名保持一致的层级，方便检索和替换
- 非技术人员审核与用户定制词条的需求，可以通过表格类中间格式与代码内文件互转
- 翻译内容与代码结构解耦，替换语言包不需要改动业务逻辑
- 新增词条时同时检查已有词条是否需要随界面调整更新，避免新旧措辞混杂
- 翻译文件纳入版本管理，词条变更与代码变更一起提交，便于回溯
- 语言检测可以结合浏览器偏好与用户手动切换，用户的选择在后续访问时保留
- 布局评估要覆盖文案最长的语言版本，避免只按中文排版导致其他语言溢出
- 词条按模块分组后，新增与替换译文时可以缩小检索范围，减少漏改
- 同一界面的固定文案集中维护，避免相同意思在不同文件里出现多种译法
- 语言切换后，已加载词条与界面文案同步更新，不遗留混合语言的片段
- 插值占位符按各语言的语序调整位置，译文重排时不要破坏占位符对应的参数
- 词条变更随代码一起提交，便于回溯译文与界面的对应关系
- 相同含义在不同模块的译法保持统一，避免界面出现近义重复
- 语言包替换不需要改动业务逻辑，词条与代码结构解耦

## 参考

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
- https://www.i18next.com/overview/getting-started
- https://www.i18next.com/overview/configuration-options
