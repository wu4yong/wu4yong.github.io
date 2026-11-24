---
title: 十、Claude Code 深度使用
date: 2023-12-21 21:00:00
categories:
  - aicoding
tags:
  - AICoding
permalink: /2026/11/15/llm/ai-coding-10-claude-code-usage/
---

<div class="essay-banner essay-aicoding"></div>

### 1. 根据问题选择不同的模型

- Haiku 简单问题 响应速度快
- sonnet 中等问题
- opus 复杂问题 思考深度更深 性能更强 但是速度慢

### 2. 根据项目配置settings.json

- (1) 在用户自己的settings.json中配置env 不对外(项目)暴露
- (2) 使用CCSwitch管理env 不对外暴露

### (3) 在工作目录里面创建.claude/settings.json

- 添加允许的操作和禁止的操作

### 3. claude.md

### (1) 全局配置: 个人习惯和要求

```
## 沟通方式

- 默认中文回复；代码、命令、变量名、文件路径保持英文
- 结论先行，简洁直接，不先铺垫背景
- 不谄媚，不夸"这是个很好的问题"，不以"当然可以"开头
- 给真实判断——方案有问题直接指出，发现更好做法主动说明

## Git

- 不自动 `git commit` 或 `git push`，除非我明确要求
- 提交前先展示将要提交的变更摘要
- commit message 使用简洁英文

## 红线操作

以下操作即使在 auto-accept 模式下也必须先问我：

- 删除文件、目录或 git 历史
- 修改 `.env`、密钥、token、证书、CI/CD 配置
- `git push`、`git rebase`、`git reset --hard`、强制推送
- 公开发布（`npm publish`、生产部署等）
```

### (2) 项目配置: 介绍项目技术栈和结构 添加规范和要求

```
# 项目名称

## 项目概述
一句话描述这个项目做什么。

## 技术栈
- 前端：Next.js 14 + TypeScript + Tailwind CSS
- 后端：Next.js API Routes
- 数据库：Prisma + SQLite
- 部署：Vercel

## 项目结构
​```
src/
├── app/         # Next.js App Router 页面
│   ├── api/      # API 路由
│   ├── layout.tsx # 全局布局
│   └── page.tsx   # 首页
├── components/   # React 组件
│   ├── ui/      # 通用UI组件
│   └── features/  # 业务组件
├── lib/         # 工具函数和配置
├── prisma/      # 数据库 schema 和迁移
└── types/       # TypeScript 类型定义
​```

## 编码规范
- 使用函数式组件 + React Hooks
- 组件文件使用 PascalCase 命名（如 BookmarkCard.tsx）
- 工具函数使用 camelCase 命名
- API 路由返回统一格式：{ success: boolean, data?: any, error?: string }
- 所有数据库操作通过 Prisma Client 执行

## 当前开发状态
-  项目初始化完成
-  数据库 Schema 设计完成
-  书签 CRUD API 开发中
-  前端页面待开发
-  搜索功能待开发

## 注意事项
- SQLite 数据库文件在 prisma/dev.db，不要提交到 Git
- 环境变量在 .env 文件中，不要提交到 Git
- 所有新功能先创建 Git 分支再开发
```

- (3) 模块配置: 添加模块额外的需求

### 4.Aotu Memory

- 可选开启关闭该功能
- CC自动记录你的习惯和项目进度

### 5. 自建参考文档

- 避免大量内容都写在Claude.md
- 把文件的链接写在Claude.md里面 按需加载

### 6. .claudeignore 文件

- 告诉Claude不需要关注的文件
