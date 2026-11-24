---
title: JavaScript-Math对象
date: 2018-02-27 05:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## Math对象

## 一、max() 和 min() 用于查找一组数据中的最大值，最小值

## 二、舍入方法

* Math.ceil()   向上取整
* Math.floor()  向下取整
* Math.round()  四舍五入取整

## 三、random()

* 随机返回一个 `(0 ~ 1]` 的数字
  
## 四、其他方法

* Math.abs(num) 返回 num 的绝对值

## Math 对象的性质

- `Math` 是命名空间对象，所有属性和方法都是静态的，不能用 `new Math()` 创建实例，也不能把 `Math` 当函数调用
- `Math` 没有实例方法，所有方法都通过 `Math` 静态调用，不能在其他类型的对象上借用
- `Math` 方法面向 `Number` 类型，不支持 `BigInt`
- 多数方法的精度取决于具体实现，不同引擎在个别边界值上的结果可能不同
- 传入方法的参数会先转换为数值；无法转换为数值的参数会使对应方法返回 `NaN`
- 方法返回值类型通常为 `Number`；无法表示的结果按规范返回 `Infinity`、`-Infinity` 或 `NaN`

## 常用静态常量

- `Math.E` 是欧拉数（自然对数的底数），约等于 2.718
- `Math.PI` 是圆周长与直径之比，约等于 3.14159
- `Math.LN2`、`Math.LN10` 分别是 2、10 的自然对数，其中 `Math.LN2` 约等于 0.693
- `Math.LOG2E`、`Math.LOG10E` 分别是以 2、10 为底的 e 的对数，其中 `Math.LOG2E` 约等于 1.443
- `Math.SQRT2`、`Math.SQRT1_2` 分别是 2 的平方根和二分之一的平方根，后者约等于 0.707
- 这些常量都是只读的静态属性

## 取整与符号方法

- `Math.ceil()` 返回大于等于给定数的最小整数
- `Math.floor()` 返回小于等于给定数的最大整数
- `Math.round()` 四舍五入到整数，正好落在两个整数之间的边界值朝正无穷方向取整
- `Math.trunc()` 直接去掉小数部分，只保留整数位，对正数和负数都不做四舍五入
- `Math.sign()` 返回数的符号：正数、负数、0 分别对应 `1`、`-1`、`0`
- `Math.abs()` 返回绝对值

## 幂、根与对数

- `Math.pow(x, y)` 返回 `x` 的 `y` 次幂，与幂运算符 `**` 功能相近
- `Math.sqrt()` 返回平方根，参数为负数时返回 `NaN`，`Math.cbrt()` 返回立方根，对负数返回负的立方根
- `Math.hypot()` 可接收多个参数，逐个平方后求和再开方，常用于计算直角三角形斜边长度
- `Math.exp()` 返回 e 的 x 次幂，与 `Math.log()` 互为逆运算，`Math.expm1()` 返回 `exp(x) - 1`
- `Math.log()` 返回自然对数，`Math.log10()` 返回以 10 为底的对数，`Math.log2()` 返回以 2 为底的对数
- `Math.log1p()` 返回 `1 + x` 的自然对数；对数方法在参数为负数时返回 `NaN`

## 三角函数与双曲函数

- `Math.sin()`、`Math.cos()`、`Math.tan()` 提供三角函数，参数以弧度为单位
- `Math.asin()`、`Math.acos()`、`Math.atan()`、`Math.atan2()` 提供反三角函数；`atan2()` 接收两个参数，返回两点连线与 x 轴夹角的反正切值
- `Math.sinh()`、`Math.cosh()`、`Math.tanh()` 提供双曲函数
- `Math.asinh()`、`Math.acosh()`、`Math.atanh()` 提供反双曲函数
- 角度转弧度需要用 `Math.PI` 做换算；传入角度值前必须先换算为弧度

## 最值与随机数

- `Math.max()`、`Math.min()` 接受零到多个数值参数；不传参数时 `max` 返回 `-Infinity`，`min` 返回 `Infinity`
- 最值方法的参数按数值比较，比较前先转换为数字；参数中有值被转换为 `NaN` 时，`max`、`min` 返回 `NaN`
- 最值方法不接受数组直接传入，需要展开或 `apply` 把数组转成参数列表；数组元素很多时展开和 `apply` 受参数数量限制，可用 `reduce` 代替
- `Math.random()` 返回 0 到 1 之间的伪随机数，区间包含 0、不包含 1；引擎未暴露固定种子接口，不能用固定种子复现序列
- 随机数属于伪随机，不可预测性不等同于密码学安全，不适合用于安全相关场景
- 取 `[min, max]` 区间的随机整数，通常用 `Math.floor(Math.random() * (max - min + 1)) + min` 组合；`random()` 提供基础取值，取整和区间映射由取整方法完成
- 对数、三角等方法的返回值为 `Number`，无法计算时返回 `NaN`；对 `NaN`、`Infinity` 等特殊值的返回按规范定义
- 单精度浮点和 32 位整数相关方法面向类型化运算与位运算场景
- `Math` 常量和方法都挂在 `Math` 对象上，不从其他内置对象继承

## 位运算与浮点表示方法

- `Math.fround()` 返回最接近的单精度浮点型表示
- `Math.clz32()` 先把参数转换为 32 位无符号整数，再统计前导零个数
- `Math.imul()` 返回 32 位有符号整数乘法结果，避免直接浮点乘法的精度问题

## 常见边界值对照

- `Math.sign(0)` 对正零返回 `0`，对负零返回 `-0`；`Math.sign(NaN)` 返回 `NaN`
- `Math.round()` 朝正无穷方向取整：`Math.round(0.5)` 为 `1`，`Math.round(-0.5)` 为 `0`
- `Math.trunc()` 只截去小数部分：`Math.trunc(-1.5)` 返回 `-1`，而 `Math.floor(-1.5)` 返回 `-2`
- `Math.hypot()` 先按平方和开方，对无穷大输入返回 `Infinity`，可减少中间平方结果溢出的影响
- `Math.log(1)` 返回 `0`，`Math.exp(0)` 返回 `1`，两个方法在这两个点上互为逆运算

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
