---
title: JavaScript-日期对象
date: 2018-02-28 18:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## Date对象

* data 使用国际协调时间(1970年1月1日零时)经过的毫秒数进行保存日期
* getTime() 返回 1970 年至今的毫秒数 测时间差(时间戳)

## 一、创建日期对象

```js
const date = new Date();
```

## 二、继承对象方法的重写

* toString() 通常返回带时区信息的日期和时间
* toLocaleString() 与浏览器运行的本地环境一致的日期和时间
* valueOf() 返回日期的毫秒数表示。因此日期对象可以使用比较运算符进行比较，因为日期对象会调用 valueOf() 方法来隐式转换自己。

## 三、其他方法

* Date.now() 方法，用于返回调用该方法时与标准时间的毫秒数。用于计算时间差。

## 创建 Date 对象的几种形式

- `new Date()`：取当前时刻的日期对象
- `new Date(value)`：传入自 1970-01-01 00:00:00 UTC 起经过的毫秒数
- `new Date(dateString)`：解析日期字符串得到日期对象；MDN 提示不同浏览器对字符串解析存在差异，不推荐依赖构造函数解析字符串
- `new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)`：逐成员传入，`monthIndex` 从 0 开始，0 表示 1 月，11 表示 12 月
- 年份参数在 0 到 99 之间会被映射到 1900 到 1999 年；超出合理范围的成员会相邻进位调整
- 多参数形式中缺省的成员取最小值，日期默认为 1，时分秒毫秒默认为 0
- 多参数形式按本地时间解释，需要 UTC 口径时先用 `Date.UTC()` 得到毫秒数，再传入构造函数
- 把 `Date` 当普通函数调用（不加 `new`）返回的是字符串，而不是 `Date` 对象
- 月份成员取值范围为 0 到 11，日期成员从 1 开始；取月份前先注意月份成员从 0 开始，避免差一错误
- 构造函数逐成员传入时，成员个数最多为年月日时分秒毫秒 7 个
- 两个 `Date` 对象即使内部时刻相同，也不是同一个引用；比较时刻应比较毫秒值而不是对象引用
- `Date` 是 ECMAScript 内置对象，时刻由内部毫秒值表示，显示用的字符串由格式化方法生成

## 内部时间戳与时间基准

- `Date` 内部基于 Unix 时间戳保存时刻，即自 1970-01-01 00:00:00 UTC 起经过的毫秒数，计算时忽略闰秒
- 一天对应 86,400,000 毫秒
- `getTime()` 返回内部毫秒值，两个日期对象相减即可得到时间差（毫秒）
- `getTimezoneOffset()` 返回本地时间与 UTC 之间相差的分钟数
- `valueOf()` 返回日期对象的毫秒原始值，日期比较正是通过它完成隐式转换
- 时间戳以毫秒为单位，跨时区比较时刻时先取毫秒值再比较
- 日期对象的毫秒值可以为负数，对应 1970 年之前的时刻
- 时区偏移由运行环境的本地设置决定，日期对象本身不保存时区字符串
- 日期对象的内部状态是数值，格式化展示前先确定目标时区和语言环境，再选择对应的格式化方法

## 静态方法与时间精度

- `Date.now()` 是静态方法，返回自 Unix 纪元到当前时间的毫秒数，返回值是数值时间戳而不是日期对象
- 为防范定时攻击和指纹追踪，`Date.now()` 的精度可能根据浏览器设置被取整降低
- `Date.parse()` 解析日期字符串并返回毫秒数，同样受浏览器解析差异影响；无法识别的字符串返回 `NaN`
- `Date.UTC()` 按 UTC 口径把年月日等成员换算成毫秒数，再交给构造函数创建日期对象；其成员口径与多参数构造形式一致，只是时区基准为 UTC
- `Performance.now()` 提供亚毫秒级时间戳，用于网页性能测量，与 `Date.now()` 的用途不同
- `Date.now()` 必须以 `Date.now()` 静态形式调用，不能在日期实例上调用
- `Date.parse()` 与构造函数解析字符串使用同一套解析规则，存在同样的兼容差异
- `Date.UTC()` 返回的是毫秒数而不是日期对象

## 常用取值与格式化方法

- `getFullYear()`、`getMonth()`、`getDate()`、`getDay()` 分别取年、月（0–11）、日、星期（0 为周日）；对应的 UTC 版本为 `getUTCFullYear()` 等
- `getHours()`、`getMinutes()`、`getSeconds()`、`getMilliseconds()` 取时、分、秒、毫秒，同样有对应的 UTC 版本
- `setTime()` 直接以毫秒数设置日期；`setFullYear()`、`setMonth()` 等方法按本地时间设置对应成员，返回更新后的毫秒值
- `getYear()` 已弃用，年份取值应使用 `getFullYear()`
- `toISOString()` 输出 ISO 8601 格式的字符串；`toJSON()` 内部调用 `toISOString()`，供 `JSON.stringify()` 使用
- `toDateString()`、`toTimeString()`、`toUTCString()`、`toLocaleDateString()`、`toLocaleTimeString()` 分别以不同口径返回日期或时间字符串
- 本地化日期时间方法的输出格式随语言环境和时区设置变化
- 本地时间方法与 UTC 方法成对存在，选择哪一套取决于业务口径
- `getDay()` 返回的星期编号从 0 开始，0 对应周日，6 对应周六
- 日期对象可变，`set` 系列方法修改的是对象内部的时间值
- 日期对象可通过 `setTime()` 整体替换为另一个时刻；比较时刻先后前先确认两端使用同一时区口径
- 日期对象的成员取值都是按本地时区或指定时区计算的结果，对象本身不保存时区字符串

## 比较日期与注意事项

- 日期对象可以直接使用比较运算符判断先后，比较时通过 `valueOf()` 取内部毫秒值
- 计算经过时长时，建议用 `getTime()` 或 `Date.now()` 相减得到毫秒差，再按需要换算单位
- 涉及夏令时、月份天数差异时，大于秒或分钟的单位换算需要单独处理
- 仅有日期的字符串（如 `1970-01-01`）按 UTC 解析，带时间的字符串按本地时间处理，不同格式口径不一致
- 两个日期相减得到的是毫秒差，不是自然日差；换算为秒、分、小时时注意毫秒到目标单位的除法
- 比较两个时刻先后，不要比较格式化后的字符串

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/now
