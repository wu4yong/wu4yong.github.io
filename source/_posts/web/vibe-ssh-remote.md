---
title: Vibe Coding-SSH远程开发
date: 2018-04-22 19:00:00
categories:
  - web
tags:
  - web
---

<div class="essay-banner essay-vibe"></div>

# Vibe Coding

## SSH 远程开发

## 一、为什么需要 SSH 远程开发

- **笔记本性能不够**：大项目安装依赖慢、构建卡，用家里的高性能主机轻松搞定
- **环境依赖**：数据库、Redis 等服务都部署在主机上，远程开发直接读写同一份数据，避免本地与远程数据不同步
- **环境一致性**：直接在目标环境上开发调试，避免「本地好好的，上去就报错」
- **配合 AI 编程工具**：Claude Code 可以直接跑在主机上，远程开发时依然能延续之前的上下文
- **开发体验流畅**：相比向日葵这类桌面远程工具，SSH 更轻量，开发体验更流畅

## 二、使用 Tailscale 搭建局域网环境

> Tailscale 是基于 WireGuard 的零配置私有网络工具，让你在任何地方都能像在同一个局域网一样访问你所有的设备——不需要公网 IP、不需要端口转发、3 分钟就能让两台设备互通。免费版支持 100 台设备，个人和小团队完全够用。

![TailScale](@@CDN@@/assets/img/web/vibe-ssh-remote/img-01.webp)

- 使用同一个账号登录后，每台设备都会被分配一个专属 IP，所有设备相当于处于同一个局域网内
- 开启设备的 SSH 功能后，无论身在何处，直接用分配的 IP 就能连上设备，实现远程开发

![account](@@CDN@@/assets/img/web/vibe-ssh-remote/img-02.webp)

## 三、基础准备：SSH 免密登录

远程开发最烦的就是每次敲密码，先配置免密登录。

### 1. 生成密钥对

本地执行：

```bash
# ed25519 算法，比 RSA 更快更安全
ssh-keygen -t ed25519 -C "your_email@example.com"
```

一路回车即可，生成 `~/.ssh/id_ed25519`（私钥）和 `~/.ssh/id_ed25519.pub`（公钥）。

### 2. 上传公钥到主机

```bash
ssh-copy-id user@server_ip
# 例如：ssh-copy-id root@120.xx.xx.xx
```

输入一次密码后，以后登录就不需要密码了。

### 3. 配置连接别名

编辑本地 `~/.ssh/config`：

```
Host win-home
    HostName 120.xx.xx.xx
    User root
    Port 22
    IdentityFile ~/.ssh/id_ed25519
    # 保持连接，防止长时间无操作被断开
    ServerAliveInterval 60
```

配置后直接 `ssh win-home` 就能登录，不用记 IP。

## 四、VS Code Remote-SSH

VS Code 的 Remote-SSH 是目前体验最好的远程开发方案：本地保留完整编辑器体验，代码、终端、插件全部跑在远程。

### 1. 安装插件

在扩展商店搜索 **Remote-SSH**（`ms-vscode-remote.remote-ssh`）并安装。

### 2. 连接主机

1. `Ctrl+Shift+P` 打开命令面板，执行 `Remote-SSH: Connect to Host`
2. 选择上一步配置的别名（`win-home`），没有别名也可以直接输入 `user@ip`
3. 首次连接会自动在主机上下载安装 `vscode-server`，等待片刻即可
4. 连接成功后，窗口左下角会显示 `SSH: win-home`

### 3. 打开远程目录

`文件 → 打开文件夹`，此时浏览的是主机上的目录结构，选中项目目录即可开始开发。

TODO：配上远程连接成功的图片

## 五、在主机上使用 AI 编程工具

SSH 远程开发 + AI 编程工具的常见组合：

- **Claude Code / Codex CLI**：直接在主机终端运行，命令行环境依赖少，读取和修改主机的代码零门槛
- **Cursor / VS Code 插件**：通过 Remote-SSH 连接后，AI 能力直接作用于远程文件
- **混合模式**：本地编辑器浏览代码，AI 终端在主机上执行构建、测试、部署命令

TODO：配上 Claude Code 在主机上运行的截图
