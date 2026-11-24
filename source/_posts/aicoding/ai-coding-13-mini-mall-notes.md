---
title: 十三、实战：Mini Mall 迭代补充
date: 2023-12-24 21:00:00
categories:
  - aicoding
tags:
  - AICoding
permalink: /2026/11/15/llm/ai-coding-13-mini-mall-notes/
---

<div class="essay-banner essay-aicoding"></div>

### 底层依赖

- `node.js`
- `git`
- `python`

### claude code

- 选好模型
  - 配置到电脑的环境变量,保密工作要做好

### 专属环境配置

### .claude

- 建议配置项目级 => 保持时刻更新
- settings.json

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run dev)",
      "Bash(npm run build)",
      "Bash(npx prisma *)",
      "Bash(npm install *)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[Hook] 文件已修改，建议运行: npx prettier --write <修改的文件>\""
          }
        ]
      }
    ]
  }
}
```

### git

- 配置忽略文件

### git初始化并提交

- `git init`

### 启动claude工作

### 1. 生成工作计划

- 在plan模式下生成工作计划
- 可以选择调整数据库的表格数据

### 2. 初始化next.js+安装依赖

- 创建出当前的项目

### 3. 初始化CLAUDE.md添加skills

- `CLAUDE.md`

```
# Mini Mall 项目规范

## 技术栈
- 框架：Next.js 16 (App Router) + TypeScript
- 样式：TailwindCSS 4
- 数据库：SQLite + Prisma 5
- 认证：自制 Cookie Session + bcryptjs

## 目录结构
- src/app/ — 页面和 API
- src/components/ — 可复用组件
- src/lib/ — 工具函数
- prisma/ — 数据库模型

## 命名规范
- 文件名：kebab-case（如 product-card.tsx）
- 组件：PascalCase（如 ProductCard）
- 函数：camelCase（如 getProducts）

## 约定
- 所有 UI 文案和注释用中文
- 优先使用 Server Components
- API 返回 JSON，错误返回 { error: string }
```

- Superpowers
  - `npx superpowers-zh`
- skills
  - 构建crud的skills
- 注册skills
- 4.构建数据库+seed种子函数生成数据
