---
title: 前端工程化-AST
date: 2018-02-03 19:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-fe"></div>

# 前端工程化

## AST 抽象语法树

- 抽象语法树（Abstract Syntax Tree，AST）是源代码语法结构的一种抽象表示，它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构
- DSL：领域特定语言、不要求图灵完备，只需要满足特定场景下的用途即可
- GPL：通用用途语言、要求图灵完备
- 有限状态自动机：有限状态 - 有限个状态。正则表达式的本质就是有限自动机

## 一、编译

- 编译器其实只是一段程序，它用来将 `一种语言 A` 翻译成 `另一种语言 B`
- 源代码 -> 词法分析 -> 语法分析 -> 语义分析 -> 生成中间代码 -> 优化 -> 目标代码生成 -> 目标代码

1. 解析过程: 词法分析(生成 Token)、语法分析(生成 AST)
2. 转化过程：将原 AST 转化为新的 AST
3. 代码生成：将新的 AST 转化为目标代码

## 编译的具体过程

### 源代码

```lisp
(add 2 (subtract 4 2))
```

### 词法分析

- 使用 `tokenizer(分词器)` 或者 `lexer(词法分析器)` ，将源码拆分成 `tokens`
- token: 是一个放置对象的数组，其中的每一个对象都可以看做是一个单元（数字，标签，标点，操作符...）的描述信息。

```bash
[
  { type: "paren", value: "(" },
  { type: "name", value: "add" },
  { type: "number", value: "2" },
  { type: "paren", value: "(" },
  { type: "name", value: "subtract" },
  { type: "number", value: "4" },
  { type: "number", value: "2" },
  { type: "paren", value: ")" },
  { type: "paren", value: ")" },
];
```

### 语法分析

- 将 tokens 重新整理成语法相互关联的表达形式，这种表达形式一般被称为 `中间层或者AST`

```bash
{
  type: 'Program',
  body: [{
    type: 'CallExpression',
    name: 'add',
    params:
      [{
        type: 'NumberLiteral',
        value: '2',
      },
      {
        type: 'CallExpression',
        name: 'subtract',
        params: [{
          type: 'NumberLiteral',
          value: '4',
        }, {
          type: 'NumberLiteral',
          value: '2',
        }]
      }]
  }]
}
```

### 转化(重点)

- Traversal(遍历): 深度优化遍历
- Visitors (访问器)：访问器最基本的思想是创建一个“访问器”对象，这个对象可以处理不同类型的节点函数
- 这个过程主要是`改写AST（抽象语法树`），或者根据`当前AST（抽象语法树）生成一个新的AST（抽象语法树`

### 代码生成

- 将新的 AST 树转化为目标代码

## 应用场景

1. 代码语法检查：Eslint
2. 代码的格式化：Prettier
3. 代码的高亮、代码错误提示、代码自动补全
4. babel
5. 代码压缩
6. Vue template 的编译
