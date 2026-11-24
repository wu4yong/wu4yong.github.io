---
title: 技术文档总结-WEB日志
date: 2018-01-24 15:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-tech"></div>

# 技术文档总结

## WEB 日志打印

> 1、 `console` 对象提供了浏览器控制台调试的接口。在不同浏览器上它的工作方式可能不一样，但通常都会提供一套共性的功能。

> 2、本文中的所有执行结果都是基于 Chrome 125.0.6422.141

## 一、打印信息

### 1.1 输出不同类型的日志

```js
console.log("log 信息"); // 打印内容的通用方法
console.info("info 信息"); // 打印资讯类说明信息, 据说在不同的浏览器平台可能会有不同的显示效果
console.warn("warn 信息"); // 打印一条警告信息
console.error("error 信息"); // 打印一条错误信息
```

![信息打印](@@CDN@@/assets/img/web/tech-js-web-log/img-01.webp)

### 1.2 信息筛选

![筛选条件](@@CDN@@/assets/img/web/tech-js-web-log/img-02.webp)

1. Verbose(啰嗦的、冗长的): 详细的输出、冗长的代码、过多的信息、日志级别
2. info: `console.log` + `console.info`
3. Warnings: `console.warn`
4. Errors: `console.error`

### 1.3 what? 打印出来的数据竟然和实际不符？

```js
const arr = [
  { name: "张三", age: { value: 18 }, sex: "男", height: 180 },
  { name: "李四", age: { value: 19 }, sex: "女", height: 190 },
];

arr.forEach((item) => {
  console.log(item);
  // 先打印数据，然后再改变属性值
  item.age.value++;
  item.height++;
});
```

![打印数据不对](@@CDN@@/assets/img/web/tech-js-web-log/img-03.webp)

### (1) 原因

1. object、Array 实际的值是被存储在堆内存中的，栈中存储的实际上只是内存地址。
2. 不展开对象看时，界面展示的数据是对象当时的快照，也就是我们预期的值。
3. 展开对象看时，会根据引用地址重新去内存中读取对象的值，如果在打印后改变了对象的属性，那么打印出来的数据就会和实际不符。

### (2) 解决办法

1. 打印对象前，使用 `JSON.Stringify` 方法将对象转换成字符串
2. 通过 debug 的形式来查看数据值
3. 部分场景可以通过 `console.table` 来解决

### 1.4 `console.table` ? 何方神圣

```js
const userInfo = {
  age: 18,
  sex: "男",
  height: "180cm",
};
const arr = [
  { name: "张三", age: { value: 18 }, sex: "男", height: 180 },
  { name: "李四", age: { value: 19 }, sex: "女", height: 190 },
];
console.log("将数据以表格的形式显示");
console.table(userInfo);
console.table(arr, ["name", "age", "height"]);
```

![表格形式打印](@@CDN@@/assets/img/web/tech-js-web-log/img-04.webp)

### (1) 表格打印的优点

1. 数据展示直观、便于查看
2. 打印数组时，可以通过第二个参数来指定要`输出的信息以及排列顺序`
3. 打印单层属性数据时，可以避免输出数据与实际值不一致的问题
4. 支持升序、降序排列

## 二、占位符支持

{% autogrid data-grid-link-table nofix %}
字符串|介绍
`%o` or `%O`|打印 JavaScript 对象。在审阅器点击对象名字可展开更多对象的信息
`%d`|打印整数。支持数字格式化。例如，console.log("Foo %.2d", 1.1) 会输出有先导 0 的两位有效数字：Foo 01。
`%s`|打印字符串
`%f`|打印浮点数。支持格式化，比如 console.log("Foo %.2f", 1.1) 会输出两位小数：Foo 1.10
`%c`|为打印内容定义样式
{% endautogrid %}

### 2.1 数据占位符

```js
const name = "张三";
const userInfo = {
  age: 18,
  sex: "男",
  height: "180cm",
};
console.log(name, "你好，您的信息为：", userInfo);
console.log("%s 你好，您的信息为：%o ", name, userInfo);
console.log(`${name}你好，您的信息为：${userInfo}`);
```

![占位符](@@CDN@@/assets/img/web/tech-js-web-log/img-05.webp)

### 2.2 样式占位符

```js
console.log(
  "指令前的文本不会受到影响，%c但指令后的文本将会使用参数中声明的 CSS 样式",
  `background: #909399; border:1px solid #909399; padding: 1px; border-radius: 2px 0 0 2px; color: #909399; background:transparent`
);
```

![样式占位符](@@CDN@@/assets/img/web/tech-js-web-log/img-06.webp)

> FireFix 中可使用的属性，不同浏览器之间可能存在差异

1. background 与其全写版本。
2. border 与其全写版本。
3. border-radius
4. box-decoration-break
5. box-shadow
6. clear 和 float
7. color
8. cursor
9. display
10. font 与其全写版本。
11. line-height
12. margin
13. outline 与其全写版本。
14. padding
15. text-transform 这类 text-\* 属性
16. white-space
17. word-spacing 和 word-break
18. writing-mode

## 三、count 计数器

```js
// 遍历 0~9 的数组
Array.from({ length: 10 }, (_, index) => index).forEach((value) => {
  if (value !== 7) {
    console.count("不等于7");
  } else {
    console.count("等于7");
    console.countReset("不等于7");
  }
});
```

![count计数器](@@CDN@@/assets/img/web/tech-js-web-log/img-07.webp)

- 仅根据`参数的值`维护单独的计数
- 重置时也是根据`参数的值`进行匹配

## 四、计时器

```js
console.time("用户响应时间");
alert("第一个弹窗");
console.timeLog("用户响应时间");
alert("第二个弹窗");
console.timeEnd("用户响应时间");
```

![time计时](@@CDN@@/assets/img/web/tech-js-web-log/img-08.webp)

仅根据`参数的值`维护单独的计时
关闭计时也是根据`参数的值`进行匹配

## 五、APP 日志

### 5.1 问题描述

- 目前的宇视云、宇视云 Pro 都具有诊断报告的功能。测试在发现问题时会将操作时日志附加到问题定位邮件中，以供开发人员快速定位问题。
- 虽然目前原生通过 dsbirdge 向 WEB 提供了日志打印的方法，但是目前的 WEB 代码中并未有意识的去使用
- 这导致一些难复现问题、依赖特殊环境问题无法进行快速的定位

### 5.2 解决方案

### (1) 封装 WEB 的 console 方法，并在调用 console 方法时，随带调用原生提供的日志打印方法

```ts
<!-- 完整的 Hook 方法 -->
enum LogColor {
  LOG = '#909399',
  INFO = '#909399',
  ERROR = '#F56C6C',
  WARN = '#E6A23C',
}

type consoleType = 'log' | 'info' | 'error' | 'warn'

const isProduction = process.env.NODE_ENV === 'production'

// 模拟原生APP的日志打印方法
function mockAPPLog(title: string, content: any) {
  title && content
}

// 美化打印
export default function () {
  function formatPrint(type: consoleType, color: string, title: string, content: any[]) {
    // 生产环境屏蔽 WEB 日志
    if (isProduction) {
      return
    }
    console[type](
      `%c${title}`,
      `background: ${color}; border: 1px solid ${color}; padding: 1px 8px; border-radius: 2px; color: #fff;`,
      ...content
    )
  }
  // 基础信息打印
  const log = (title: string = 'Log', ...content: any[]) => {
    formatPrint('log', LogColor.LOG, title, content)
    mockAPPLog(title, content)
  }
  const info = (title: string = 'Info', ...content: any[]) => {
    formatPrint('info', LogColor.INFO, title, content)
    mockAPPLog(title, content)
  }

  const warn = (title: string = 'Warn', ...content: any[]) => {
    formatPrint('warn', LogColor.WARN, title, content)
    mockAPPLog(title, content)
  }
  const error = (title: string = 'Error', ...content: any[]) => {
    formatPrint('error', LogColor.ERROR, title, content)
    mockAPPLog(title, content)
  }

  return {
    log,
    info,
    error,
    warn,
  }
}
```

### (2) 在 Vue3 WEB 项目中的使用示例

```ts
import appLog from "@/hook/appLog";
const Log = appLog();
const data = {
  code: "200",
  message: {
    list: [
      {
        id: 1,
        name: "张三",
        age: 18,
      },
    ],
  },
};
Log.log("执行", "页面渲染");
Log.info("user接口", data);
Log.warn("警告信息", "未获取到用户列表");
Log.error("执行错误", "用户信息获取失败");
```

### (3) 控制台打印效果

![hook效果](@@CDN@@/assets/img/web/tech-js-web-log/img-09.webp)

### (4) 优缺点

1. 优点：能一次性在双端进行日志打印
2. 优点：封装之后，可以提供更加灵活的日志控制：统一的格式，颜色、生产环境关闭 WEB 日志
3. 缺点：控制台中的日志打印行数会出现问题
