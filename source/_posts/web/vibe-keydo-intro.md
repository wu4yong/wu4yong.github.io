---
title: Vibe Coding-KeyDo项目介绍
date: 2018-04-21 05:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-vibe"></div>

# Vibe Coding

## KeyDo — 四象限任务管理应用

> 基于艾森豪威尔矩阵（重要/紧急）的全栈任务管理工具，支持拖拽排序、人生角色分类、重复任务与时间管理。

在线链接：[KeyDo](http://www.keydo.top:3000/)

## 一、项目简介

KeyDo 是一个以「四象限法则」为核心的任务管理应用，灵感来源于滴答清单。它将任务按**重要-紧急**两个维度划分为四个象限（Q1 ～ Q4），帮助用户聚焦真正重要的事情，告别无意义的忙碌。

项目采用 **pnpm Monorepo** 架构，包含前端（keyDoWeb）、后端（keyDoServer）和共享类型包（keyDoContract），支持 Docker 一键部署。

## 二、功能详情

### 2.1 四象限任务管理（艾森豪威尔矩阵）

核心页面采用 **2×2 网格布局**，将任务按重要/紧急两个维度分为四个象限：

{% autogrid data-grid-link-table nofix %}
象限|含义|策略
**Q1** — 重要且紧急|必须立即处理|立即处理
**Q2** — 重要不紧急|预防性规划|计划安排
**Q3** — 不重要但紧急|可委托他人|委派处理
**Q4** — 不重要不紧急|尽量避免|尽量避免
{% endautogrid %}

每个象限独立展示自己的任务列表，未完成任务在上、已完成任务在下分组显示。

![home](@@CDN@@/assets/img/web/vibe-keydo-intro/img-01.webp)

---

### 2.2 任务增删改查

- **创建任务**：点击象限底部的 `+` 按钮，弹出表单对话框，支持标题（必填，≤64 字）、详情描述（可选，≤1000 字）、截止日期、时间、重复规则、角色关联
- **编辑任务**：点击未完成任务卡片，弹出编辑对话框，支持修改所有字段
- **删除任务**：右键菜单选择删除，支持乐观更新（立即从列表移除，失败自动回滚）
- **完成/取消完成**：点击复选框切换完成状态。取消完成不恢复重复规则
- **字符计数**：标题和描述输入框实时显示字符计数，接近上限时颜色变为警告色，超出上限变为红色

![create-task](@@CDN@@/assets/img/web/vibe-keydo-intro/img-02.webp)
![delete-task](@@CDN@@/assets/img/web/vibe-keydo-intro/img-03.webp)

---

### 2.3 拖拽排序与跨象限移动

- **象限内排序**：未完成任务支持拖拽排序，拖拽时显示「让位动画」，松手后重新计算 LexoRank 排序值
- **跨象限移动**：将任务拖到另一个象限，自动重新分类并放置在目标象限底部。目标象限高亮边框提示
- **已完成任务**：不可拖拽，不可编辑点击
- **DragOverlay**：拖拽时显示半透明任务卡片预览，随鼠标移动
- **乐观更新 + 回滚**：拖拽操作即时更新 UI，API 失败时自动恢复到拖拽前状态

![drag-task](@@CDN@@/assets/img/web/vibe-keydo-intro/img-04.webp)
---

### 2.4 人生角色管理

每个用户最多创建 **5 个人生角色**（如「员工」「父亲」「开发者」「博主」），任务可以关联到某个角色。

- **角色属性**：
  - 名称（≤10 字，同用户下唯一）
  - Emoji 图标（使用 emoji 选择器）
  - 主题色（8 种预设颜色：蓝/绿/橙/紫/红/黄/粉/灰）
  - 宣言（10～200 字，描述角色的使命）
- **角色聚焦**：点击侧边栏角色，主视图**只显示该角色的任务**，顶部显示角色宣言横幅
- **智能关联**：聚焦某角色后，新建任务自动选中该角色
- **删除角色**：关联的任务 `roleId` 自动清空，聚焦状态自动清除
- **角色标签**：任务卡片上显示对应角色的 emoji + 名称 + 主题色标签

![role-manage](@@CDN@@/assets/img/web/vibe-keydo-intro/img-05.webp)

---

### 2.5 重复任务（循环任务）

支持设置任务的重复规则，适用于每日打卡、每周例会、每月还款等场景。

- **重复类型**：
  - **每天**：每日重复
  - **每周**：自动推导选中日期的星期几（如选中周三则显示「每周三」）
  - **每月**：自动推导选中日期的日期（如选中15号则显示「每月15日」）
- **完成行为**：完成重复任务时，当前任务标记完成并清除重复字段，同时**自动创建下一个实例**（dueDate 根据规则计算）
- **新实例位置**：自动创建的下一实例放置在象限未完成任务列表的**顶部**

![c-task](@@CDN@@/assets/img/web/vibe-keydo-intro/img-06.webp)

---

### 2.6 用户认证系统

- **注册**：用户名（3～20 字）+ 密码（6～20 字）+ 确认密码
- **登录**：用户名 + 密码，返回 JWT Token

![login](@@CDN@@/assets/img/web/vibe-keydo-intro/img-07.webp)
![sign-in](@@CDN@@/assets/img/web/vibe-keydo-intro/img-08.webp)

## 三、项目亮点

### 3.1 Monorepo 项目架构

> KeyDo 的 Monorepo 架构并非简单的「把代码放一起」，而是通过两个共享包在前后端之间建立了**类型安全的契约层**

### (1) 核心共享包：`@yuan-shan/keydo-contract`

这是整个 Monorepo 的「灵魂」—— 一个纯 TypeScript + Zod 包，**零框架依赖**，可同时被 React 前端和 NestJS 后端消费：

```
packages/keyDoContract/src/
  ├── auth.ts    # 认证相关：类型 + Zod Schema
  ├── task.ts    # 任务相关：类型 + Zod Schema
  └── role.ts    # 角色相关：类型 + Zod Schema
```

### (2) 业务逻辑共享：LexoRank 排序算法

任务排序使用 LexoRank（一种字符串字典序算法，可在任意两项之间插入新值而无需重新编号）。这个算法**前后端必须完全一致**

{% autogrid data-grid-link-table nofix %}
场景|调用位置|用途
**后端创建任务**|`task.service.ts` → `getRankBetween(lastTask.order, null)`|新任务放在象限末尾
**前端拖拽排序**|`QuadrantContainer.tsx` → `getRankBetween(prevTask.order, nextTask.order)`|计算拖拽落位的排序值
{% endautogrid %}

### (3) Monorepo 价值的量化对比

{% autogrid data-grid-link-table nofix %}
维度|多仓库模式|KeyDo Monorepo
类型同步|前后端各有一份类型定义，靠人工对齐|一份 `Task` 类型，两端自动同步
校验一致性|前端表单校验 ≠ 后端 API 校验，自行发现 Bug|同一个 Zod Schema，绝对一致
共享逻辑|复制代码或发 npm 包，版本管理复杂|workspace 协议直接引用，即时生效
契约变更|改接口需要两边提 PR，可能不同步上线|共建一个 Commit，CI 全量跑通才算过
新人上手|需要找到 2-3 个仓库，自己拼凑全局视图|一个仓库拉下来，`pnpm install && pnpm dev` 就能跑
{% endautogrid %}

### 3.2 乐观更新策略

> 拖拽排序、删除任务使用乐观更新（即时 UI 反馈 + 失败回滚），完成操作使用 `invalidateQueries` 确保数据一致性
