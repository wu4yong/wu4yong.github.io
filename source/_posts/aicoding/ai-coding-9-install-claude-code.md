---
title: 九、安装与部署 Claude Code
date: 2023-12-19 21:00:00
categories:
  - aicoding
tags:
  - AICoding
permalink: /2026/11/15/llm/ai-coding-9-install-claude-code/
---

<div class="essay-banner essay-aicoding"></div>

### 环境准备

### 1. 安装node.js

- `node -v`
- `npm -v`

### 2. 安装git

- `git --version`

### 3.安装python

- `python --version`
- `pip --version`

### 4. 使用git初始化进行版本管理

- `git init`

### 安装使用claude

### 1. 安装claude

- `npm install -g @anthropic-ai/claude-code`
- `claude --version`

### 2. 配置模型

1. 海外用户 可以直接使用登录claude账号的形式
2. 国内用户想要使用claude原生模型 => 中转服务
3. 推荐国内用户使用国内大模型 使用的deepseek
  - 写入到settings.json文件

```json
{
  "env": {
   "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
   "ANTHROPIC_AUTH_TOKEN": "sk-使用字节的api key",
   "ANTHROPIC_MODEL": "deepseek-v4-pro[1m]",
   "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-v4-pro[1m]",
   "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-v4-pro[1m]",
   "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-v4-flash",
   "CLAUDE_CODE_SUBAGENT_MODEL": "deepseek-v4-flash",
   "CLAUDE_CODE_EFFORT_LEVEL": "max"
  }
}
```

### 3. 在工作目录打开powershell

- 输入claude进入客户端

### CCSwitch

- 多服务商管理切换工具

### vs code扩展使用claude code

- 安装对应的扩展包Claude Code for VS Code
- 需要配置好底层模式才能用 settings.json文件中
