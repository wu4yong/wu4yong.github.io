---
title: 十一、实战：Claude 记账 Web 项目
date: 2023-12-22 21:00:00
categories:
  - aicoding
tags:
  - AICoding
permalink: /2026/11/15/llm/ai-coding-11-expense-web-project/
---

<div class="essay-banner essay-aicoding"></div>

### 1. 配置开发组件

- (1) .gitignore
- (2) settings.json

### 2. plan模式进行规划

```
我要做一个 Python Web 记账工具，功能包括：
- 添加账目（金额、分类、日期、备注）——在网页表单里填写
- 查看列表（按月份和分类筛选）——表格展示
- 删除账目——输入 ID 删除
- 分类统计——柱状图 + 统计表

技术栈用 Python + streamlit + sqlite3。
预设 6 个分类：餐饮、交通、购物、娱乐、居住、其他。
我是编程新手，请先出方案再动手。
```

- 对计划不满意 可以对计划进行调整 => 不要切换模式

### 3. 切换到normal模式执行

- 开始执行plan
- 让claude一步一步执行操作 不要一下子操作完
- 如果需要比较简单 可以一下操作完再进行验证

### 4. 安装依赖并测试

- pip安装依赖默认是走国外的网络 比较慢
- 切换成清华的源 下载会更快一些
- 实际去测试http://localhost:8501 测试

### 5. git提交
