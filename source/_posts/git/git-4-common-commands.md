---
title: Git常用命令
date: 2025-08-04 01:00:00
categories:
  - java
tags:
  - git
description: Git 常用命令完整整理，涵盖全局配置、仓库获取、工作区与暂存区、本地提交、远程双仓库（github/gitee）推拉、分支管理与 develop→master 合并流程，并附常见推送报错排查。
---

<div class="essay-banner essay-image1"></div>

# 4. Git常用命令

 **导读**：本文从基础 Git 命令讲到本博客项目实战。前半部分是通用命令（配置、克隆、暂存、提交、日志、分支、标签），
 后半部分是 **starry-blog 双远程（`github` / `gitee`）工作流**，包含 `develop → master` 的完整合并流程与推送报错排查，可直接对照执行。

<!-- more -->

## 4.1 Git全局设置

安装 Git 后首先要设置用户名称和 email 地址，这是非常重要的，因为每次 Git 提交都会使用该用户信息。在 Git 命令行中执行下面命令：

### 设置用户信息

```bash
git config --global user.name "itcast"
git config --global user.email "itcast@itcast.cn"
```

### 查看配置信息

```bash
git config --list
```

> 注意：上面设置的 user.name 和 user.email 并不是注册码云账号时使用的用户名和邮箱，此处可以任意设置。

## 4.2 获取Git仓库

要使用 Git 对我们的代码进行管理，首先需要获得 Git 仓库。获取 Git 仓库通常有两种方式：

- 在本地初始化 Git 仓库（不常用）
- 从远程仓库克隆（常用）

### 4.2.1 在本地初始化Git仓库

**操作步骤如下**：

1. 在任意目录下创建一个空目录（例如 repo1）作为本地 Git 仓库
2. 进入这个目录中，点击右键打开 Git bash 窗口
3. 执行命令

```bash
git init
```

如果在当前目录中看到 `.git` 文件夹（此文件夹为隐藏文件夹），则说明 Git 仓库创建成功。

### 4.2.2 从远程仓库克隆

可以通过 Git 提供的命令从远程仓库进行克隆，将远程仓库克隆到本地。

**命令格式**：

```bash
git clone 远程仓库地址
```

> ✨ 本项目克隆示例（starry-blog 源码仓库）

```bash
# 克隆 github 源码仓库
git clone git@github.com:wu4yong/starry-blog.git
```

## 4.3 工作区、暂存区、版本库

为了更好的学习 Git，我们需要了解 Git 相关的一些概念，这些概念在后面的学习中会经常提到。

| 概念 | 说明 |
| --- | --- |
| 版本库 | `.git` 隐藏文件夹就是版本库，其中存储了配置信息、日志信息和文件版本信息 |
| 工作区 | 包含 `.git` 文件夹的目录就是工作区，也称工作目录，用于存放开发的代码 |
| 暂存区 | `.git` 文件夹中的 `index` 文件就是暂存区，也可叫做 `stage`，是临时保存修改文件的地方 |

## 4.4 Git工作区中文件的状态

Git 工作区中的文件存在两种状态：

- `untracked` 未跟踪（未被纳入版本控制）
- `tracked` 已跟踪（被纳入版本控制）
  - `Unmodified` 未修改状态
  - `Modified` 已修改状态
  - `Staged` 已暂存状态

> 注意：文件的状态会随着我们执行 Git 的命令发生变化。

## 4.5 本地仓库操作

本地仓库常用命令如下：

| 命令 | 作用 |
| --- | --- |
| `git status` | 查看文件状态 |
| `git add` | 将文件的修改加入暂存区 |
| `git reset` | 将暂存区的文件取消暂存，或切换到指定版本 |
| `git commit` | 将暂存区的文件修改提交到版本库 |
| `git log` | 查看日志 |

### 4.5.1 git status

`git status` 命令用于查看文件状态。

```bash
git status
```

### 4.5.2 git add

`git add` 命令的作用是将文件的修改加入暂存区。

```bash
# 指定单个文件
git add fileName
# 添加全部改动
git add .
```

### 4.5.3 git reset

`git reset` 命令的作用是将暂存区的文件**取消暂存**，或者是**切换到指定版本**。

```bash
# 取消暂存
git reset 文件名
# 硬回退到指定版本（谨慎！会丢弃本地改动）
git reset --hard 版本号
```

> 注意：每次 Git 提交都会产生新的版本号，通过版本号就可以回到历史版本。

### 4.5.4 git commit

`git commit` 命令的作用是将暂存区的文件修改提交到版本库。

```bash
git commit -m "提交说明" 文件名
# 提交全部暂存内容
git commit -m "feat: 新增xxx功能"
```

解释说明：

- `-m`：代表 message，每次提交时需要设置，会记录到日志中
- 可以使用通配符 `*` 一次提交多个文件

### 4.5.5 git log

`git log` 命令的作用是查看提交日志。

```bash
# 完整日志
git log
# 简洁单行日志（项目高频使用）
git log --oneline
# 查看最近5条提交
git log --oneline -5
# 图形化查看分支历史
git log --graph --oneline --all -20
```

通过 `git log` 命令查看日志，可以发现每次提交都会产生一个版本号，提交时设置的 message、提交人、邮箱、提交时间等信息都会记录到日志中。

## 4.6 远程仓库操作

> ⭐ 本项目特殊说明：本项目配置**双远程仓库**
> - `github`：GitHub 源码仓库
> - `gitee`：Gitee 源码仓库

### 4.6.1 git remote

```bash
# 查看远程别名
git remote
# 查看远程详细地址（项目必用）
git remote -v
```

正常应为对称结构：

```bash
gitee   git@gitee.com:wu4yong/starry-blog.git (fetch/push)
 github  git@github.com:wu4yong/starry-blog.git  (fetch/push)
```

> 若 `fetch` 与 `push` 指向不同仓库（推拉分家），会出现拉错仓库、状态错乱，务必保持两侧一致。

### 4.6.2 git remote add

添加远程仓库命令格式：

```bash
git remote add 简称 远程仓库地址
```

> ✨ 本项目添加 gitee 远程示例

```bash
git remote add gitee git@gitee.com:wu4yong/starry-blog.git
```

> 注意：一个本地仓库可以关联多个远程仓库。

### 4.6.3 git clone

如果需要获得一份已存在的 Git 远程仓库的拷贝，就要用到 `git clone` 命令。Git 克隆的是该仓库服务器上的几乎所有数据（包括日志信息、历史记录等）。

```bash
git clone 远程仓库地址
```

### 4.6.4 git push

将本地仓库内容推送到远程仓库，命令格式：

```bash
git push 远程仓库简称 分支名称
```

> ✨ 本项目双远程推送实战命令

```bash
# 推送 master 主分支
git push github master
git push gitee master

# 推送 develop 开发分支
git push github develop
git push gitee develop

# rebase 变基后安全强制推送（单人仓库使用，多人禁止）
git push github develop --force-with-lease
git push gitee develop --force-with-lease
```

### 4.6.5 git pull

`git pull` 命令的作用是从远程仓库获取最新版本，并合并到本地仓库。命令格式：

```bash
git pull 远程仓库简称 分支名称
```

> ✨ 本项目拉取实战

```bash
# 拉取 github
git pull github master
git pull github develop
# 拉取 gitee
git pull gitee master
git pull gitee develop
```

> 注意：如果当前本地仓库不是从远程仓库克隆，而是本地创建的仓库，并且仓库中存在文件，此时再从远程仓库拉取文件会报错（`fatal: refusing to merge unrelated histories`）。解决方法是在 `git pull` 后加入参数 `--allow-unrelated-histories`。

### 4.6.6 清理远程追踪缓存（项目排错常用）

```bash
# 清理已经删除的远程分支的本地追踪引用
git fetch --prune
# 删除本地失效的远程追踪分支
git branch -r -d github/develop
git branch -r -d gitee/develop
# 删除远程分支
git push github --delete develop
git push gitee --delete develop
```

## 4.7 分支操作

分支是 Git 使用过程中非常重要的概念。使用分支意味着可以把工作从开发主线上分离开来，以免影响开发主线。本地仓库和远程仓库中都有分支，同一个仓库可以有多个分支，各个分支相互独立、互不干扰。通过 `git init` 创建本地仓库时，默认会创建一个 `master` 分支。

> ⭐ 本项目分支规范
> - `master`：稳定主分支
> - `develop`：日常开发分支，所有新功能先在 develop 完成，再合并回 master

### 4.7.1 查看分支

```bash
git branch          # 列出所有本地分支
git branch -r       # 列出所有远程分支
git branch -a       # 列出所有本地分支和远程分支
```

### 4.7.2 创建分支

```bash
git branch 分支名称
# 新建并且立刻切换到该分支
git checkout -b develop
```

### 4.7.3 切换分支

```bash
git checkout 分支名称
# 新版本 git 也支持
git switch 分支名称
```

### 4.7.4 推送至远程仓库分支

```bash
git push 远程仓库简称 分支名称
```

### 4.7.5 合并分支

```bash
# 将目标分支合并到当前所在分支
git merge 分支名称

# --no-ff：保留合并提交节点，适合多人协作
git merge develop --no-ff -m "merge: develop -> master"
```

> 冲突处理：
> 1. 出现冲突执行 `git status` 查看冲突文件
> 2. 手动编辑冲突文件，删除 `<<<<<<<` / `=======` / `>>>>>>>` 标记
> 3. 解决完毕：`git add 冲突文件`，然后 `git commit` 完成合并
> 4. 放弃本次合并（还没有 commit）

```bash
git merge --abort
```

### 4.7.6 rebase变基（单人项目，保持线性历史，本博客推荐）

> ⚠️ 多人协作仓库禁止对共享分支 rebase，只适合单人维护。

```bash
# 将 develop 变基到 master 之上
git checkout develop
git rebase master

# rebase 遇到冲突：解决冲突后
git add 冲突文件
git rebase --continue

# 放弃本次变基，恢复原样
git rebase --abort
```

## 4.7.7 🚀本项目完整工作流：develop合并到master（Rebase线性版）

> 业务全部在 `develop` 开发，验证稳定后合并回 `master`，并同步 github 与 gitee 双远程。

**流程总览**

```text
develop提交 → 同步远程develop → 切master同步 → 切回develop rebase master
→ 切master快进合并 → 推送双端master → 安全强推develop → 切回develop继续开发
```

**完整命令**

```bash
# 1. develop 提交改动
git status
git add .
git commit -m "feat: 改动描述"

# 同步两边远程 develop
git pull github develop
git pull gitee develop
git push github develop
git push gitee develop

# 2. 切换 master，拉取两边最新主分支
git checkout master
git pull github master
git pull gitee master

# 3. 切回 develop，执行变基
git checkout develop
git rebase master
# 遇到冲突：解决冲突 → git add 文件 → git rebase --continue
# 想放弃：git rebase --abort

# 4. 回到 master，快进合并（不产生新 commit）
git checkout master
git merge develop

# 5. 推送 master 到双远程
git push github master
git push gitee master

# 6. rebase 改写历史后，安全强制推送 develop
git push github develop --force-with-lease
git push gitee develop --force-with-lease

# 7. 切回开发分支继续写代码
git checkout develop
```

### 备选：多人协作版本 merge --no-ff 流程

> 保留合并节点，分支历史可追溯，适合多人共同维护 develop 分支。

```bash
git checkout master
git pull github master
git pull gitee master
git merge develop --no-ff -m "merge: develop -> master"
git push github master
git push gitee master
git checkout develop
```

## 4.8 标签操作

Git 中的标签，指的是某个分支某个特定时间点的状态。通过标签可以很方便地切换到标记时的状态。比较有代表性的是用这个功能来标记发布结点（`v1.0`、`v1.2` 等）。

### 4.8.1 查看标签

```bash
git tag
```

### 4.8.2 创建标签

```bash
# 带说明的 annotate 标签（推荐）
git tag -a v1.0 -m "版本说明"
```

### 4.8.3 将标签推送至远程仓库

```bash
git push github v1.0
git push gitee v1.0
```

### 4.8.4 检出标签

检出标签时需要新建一个分支来指向某个标签。

```bash
git checkout -b 分支名 标签名
```

## 4.9 常见报错排查（适配本项目踩坑记录）

{% autogrid data-grid-link-table nofix %}
 报错现象 | 排查 / 处理命令 
 `non-fast-forward` 推送被拒绝 | 先执行 `git pull github 分支名` 同步远程，不要盲目强推 
 推送 Ctrl+C 中断，状态混乱 | `git fetch --prune` 清理本地缓存，再核对远程真实 hash：`git log --oneline github/develop` 
提示 `Everything up-to-date` 但本地有提交 | 指定 commit 直接推送：`git push github <commit-hash>:develop` 
 报错但不确定是否推送成功 | `git ls-remote github refs/heads/develop` 查询服务器真实引用 
 要撤销已 commit 但**未 push** 的提交 | `git reset --hard HEAD~1`（⚠️ 已 push 禁止使用） 
 本地与远程引用错乱 | `git fetch --prune` 后重新核对分支状态 
{% endautogrid %}
> 原则：推送报错时优先核对远程真实状态，不要反复强制推送。部分场景命令返回报错但对象实际已写入，盲推会造成重复提交或历史错位。
