---
title: JavaScript-Set
date: 2018-03-03 22:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-js"></div>

# JavaScript

## Set

- 类似于数组，但是成员都是唯一的，没有重复的值。
- Set 使用了 SameValueZero 相等性比较算法

## 一、Set 的属性和方法

1. size: 返回 Set 实例的成员总数。
2. add(value): 添加某个值，返回 Set 结构本身。支持链式调用
3. delete(value): 删除某个值，返回一个布尔值，表示删除是否成功。
4. has(value): 返回一个布尔值，表示该值是否为 Set 的成员。
5. clear(): 清除所有成员，没有返回值。

## 二、遍历

- Set 会维护值插入时的顺序，因此支持按顺序迭代。Set 的`键名等于键值`

1. keys()：返回键名的遍历器
2. values()：返回键值的遍历器
3. entries()：返回键值对的遍历器
4. forEach()：使用回调函数遍历每个成员

```js
// set 默认的遍历器函数是 values 方法
Set.prototype[Symbol.iterator] === Set.prototype.values;
// 可以省略 values() 方法，直接使用 for of 遍历 Set
for (let key of set) {
  console.log(key);
}
```

## 三、WeakSet

- WeakSet 集合中的值是弱引用，不影响垃圾回收器的工作，如果一个引用类型值除了被 WeakSet 当做值之外没有其他的地方引用它，那这个引用类型值会被回收

## 四、Set 与数组转换

- Set 成员按插入顺序迭代，keys()、values()、entries() 都基于插入顺序
- Set 默认迭代器是 values()，for...of 直接遍历得到成员值
- Set 的键名等于键值，entries() 返回的每一项 key 和 value 相同
- 用 new Set(数组) 可以对数组去重，再通过展开运算符或 Array.from 转回数组
- Set 内部用 SameValueZero 比较，NaN 之间视为相等，+0 与 -0 也视为相等

```js
const arr = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(arr)]; // [1, 2, 3]
```

## 五、集合运算与 WeakSet 的边界

- 并集：两个集合合并后新建 Set；交集：遍历其中一个集合，保留另一个集合 has 的成员；差集同理过滤
- WeakSet 只接受对象和非全局注册的 symbol 作为成员，原始值不能放入
- WeakSet 持弱引用：成员除了被 WeakSet 引用之外没有其他引用时，可被垃圾回收
- WeakSet 不可枚举，没有 size 属性，也没有 keys、values、entries、forEach 等遍历方法，只提供 add、delete、has
- WeakSet 构造函数同样接收可迭代对象初始化
- WeakSet 适合跟踪对象引用、检测循环引用等场景，不需要遍历集合内容

## 遍历顺序与迭代协议

- Set 不支持按键位置随机访问成员，取值需要通过迭代器或 forEach 遍历
- forEach 回调签名为 (value, key, set)，这里 value 和 key 是同一个成员
- 迭代过程中删除当前正在遍历的成员不会报错；新增成员会在本次迭代中被访问到
- Set 构造函数接收可迭代对象初始化，数组、另一个 Set 都可以作为入参
- size 是成员总数，不是方法；add 返回 Set 本身支持链式调用
- delete 与 has 返回布尔值，clear 清空所有成员且没有返回值

## 与数组的差异

- 数组允许重复成员，Set 成员唯一；数组按索引访问，Set 按值查找
- Set 没有数组的 push、pop、indexOf、slice 等方法，判断成员存在用 has
- 用 Set 去重后，数值和字符串类型不会自动转换，1 与 "1" 是两个不同成员
- 引用类型按引用比较，两个内容相同的普通对象在 Set 中是不同成员

## WeakSet 适用场景

- 跟踪已经处理过的对象，避免重复处理或检测循环引用
- 成员被回收后 WeakSet 自动不再持有它，不会阻止垃圾回收
- 因为不可枚举，WeakSet 不能用于需要列出全部成员的场景

```js
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
const intersection = new Set([...a].filter((x) => b.has(x)));
```

## 参考

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet
