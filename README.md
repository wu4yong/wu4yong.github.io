# 🌌 时空秘境 · 星空风格博客

基于 Hexo + Butterfly 主题深度定制，全站启用星空粒子特效，采用分层模块化结构，低耦合、易扩展。

**页面访问**：https://wu4yong.gitee.io

## 🧩 运行环境

| 环境 / 工具 | 说明 |
| --- | --- |
| Node.js | 本地通过 nvm 管理，使用 `20.19.2` 版本，切换命令为 `nvm use 20.19.2` |
| npm | 随 Node.js 一并安装，用于安装与更新项目依赖（`npm install`） |
| Hexo 命令行工具（CLI） | 提供 `hexo server`、`hexo generate`、`hexo clean`、`hexo deploy` 等命令 |
| Git | 版本管理工具，用于向 GitHub、Gitee 推送与拉取代码 |
| Butterfly 主题 | 已随项目内置在 `themes/butterfly/` 目录，无需另行下载安装 |
| particles.js | 星空粒子特效的底层依赖，由 `_components/Particles.njk` 引入使用 |

> 所有命令建议在项目根目录执行。若提示 `hexo: command not found`，先执行 `nvm use 20.19.2` 切换 Node 版本，再重试命令。

## 📁 项目结构

```text
starry-blog/
├── node_modules/                # npm 依赖包
├── public/                      # Hexo 生成的静态站点（编译输出目录）
├── source/                      # 博客源文件：文章、资源、独立页面
│   ├── _posts/                  # 所有博客 Markdown 文章，按分类建立子目录
│   │   ├── ai/                  # 人工智能 / SpringAI
│   │   ├── bigdata/             # 大数据
│   │   ├── database/            # 数据库
│   │   ├── deepSearch/          # 深度研搜
│   │   ├── ecommerce/           # 电商问数
│   │   ├── fun/                 # 休闲空域，二级专区
│   │   │   ├── game/            # 游戏专区
│   │   │   ├── movie/           # 电影专区
│   │   │   ├── music/           # 音乐专区
│   │   │   └── photo/           # 摄影专区
│   │   ├── interview/           # 面试
│   │   ├── java/                # Java
│   │   ├── llm/                 # 大语言模型
│   │   ├── Netty/               # Netty
│   │   ├── story/               # 随笔杂谈
│   │   └── web/                 # Web 前端
│   ├── about/                   # 关于页面
│   ├── assets/                  # 静态资源：图片、视频、图标
│   │   ├── img/                 # 图片素材
│   │   └── video/               # MP4 本地视频文件
│   ├── search/                  # 站内搜索页面
│   ├── tags/                    # 标签汇总页面源文件
│   └── website/                 # 自定义独立页面目录
├── themes/
│   └── butterfly/               # 自定义重构 Butterfly 主题
│       └── layout/              # 页面模板根目录
│           ├── _components/     # 公共复用组件
│           │   ├── HomeContent.njk    # 首页中央菜单 / 折叠按钮组件
│           │   ├── Particles.njk      # 星空粒子背景全局组件
│           │   └── Sidebar.njk        # 文章页左侧侧边栏组件
│           ├── _css/            # 全局与页面专属样式文件
│           │   ├── archive.css        # 归档页样式
│           │   ├── categories.css     # 全分类汇总页样式
│           │   ├── category-single.css# 单分类详情页样式
│           │   ├── common.css         # 全局公共基础样式（所有页面共用）
│           │   ├── home-animation.css # 首页动画样式
│           │   ├── home.css           # 首页专属样式
│           │   ├── post-layout.css    # 文章详情页布局样式
│           │   ├── post.css           # 文章内容样式
│           │   ├── tag.css            # 单标签详情页样式
│           │   └── tags.css           # 全标签汇总页样式
│           ├── _js/             # 页面脚本（全部抽离为独立文件，无内联JS）
│           │   ├── home-parallax.js   # 首页视差与滚动动效脚本
│           │   ├── post-float-btn.js  # 文章页返回顶部悬浮按钮脚本
│           │   ├── sidebar.js         # 侧边栏交互脚本
│           │   └── typing.js          # 首页打字机 + 折叠菜单脚本
│           ├── search/
│           │   └── index.njk          # 站内搜索模板
│           ├── archive.njk            # 归档页面模板
│           ├── categories.njk         # 全分类汇总页面模板
│           ├── category.njk           # 单分类详情页面模板
│           ├── index.njk              # 首页基准模板
│           ├── post.njk               # 文章详情页模板
│           ├── tag.njk                # 单标签详情页面模板
│           └── tags.njk               # 全标签汇总页面模板
├── _config.yml                  # Hexo 全局主配置
├── _config.butterfly.yml        # Butterfly 主题配置
├── db.json                      # Hexo 本地缓存数据库
├── package-lock.json            # npm 依赖版本锁定文件
└── package.json                 # npm 依赖管理文件
```

### 目录职责说明

| 路径 | 职责 | 维护提示 |
| --- | --- | --- |
| `node_modules/` | npm 依赖包 | `npm install` 自动生成，不要手动修改 |
| `public/` | Hexo 编译输出静态站点 | `hexo generate` 生成；`hexo clean` 可清空重建 |
| `source/_posts/` | 全部博客文章 | 一级分类；`fun` 下再划分二级专区，文章按目录存放 |
| `source/about/` | 关于页面 | 对应首页「关于行者」入口 |
| `source/assets/` | 图片、视频等静态资源 | img 放图，video 放本地视频 |
| `source/search/` | 站内搜索页面 | 配合搜索模板使用 |
| `source/tags/` | 标签汇总页 | 标签聚合页面依赖 |
| `source/website/` | 自定义独立页面 | 新增独立页面放这里 |
| `themes/butterfly/layout/_components/` | 公共组件 | 粒子背景、侧边栏、首页结构统一维护 |
| `themes/butterfly/layout/_css/` | 样式文件 | common.css 全局样式，其余按页面拆分 |
| `themes/butterfly/layout/_js/` | 交互脚本 | 所有脚本外置，方便单独调试 |
| `themes/butterfly/layout/*.njk` | 页面模板 | index.njk 首页、post.njk 文章页等 |
| `_config.yml` | Hexo 全局配置 | 站点信息、部署配置 |
| `_config.butterfly.yml` | 主题配置 | 主题开关、Butterfly 原生参数 |
| `package.json` / `package-lock.json` | npm 依赖 | npm 自动维护 |
| `db.json` | Hexo 缓存 | 可直接删除，`hexo g` 自动重建 |

## 🧭 首页导航结构

首页以星空粒子动画为背景，自上而下由打字机对话框、两组折叠菜单、两个独立入口构成。

```text
首页
├── 打字机对话框        # 引导文案由 _js/typing.js 的 story 常量输出
├── 🛠 技术秘境（折叠菜单）
│   ├── ☕ Java 空间站
│   ├── 🗄️ 数据库空间站
│   ├── 📊 大数据空间站
│   ├── ⚡ Netty 空间站
│   ├── 🌐 Web 空间站
│   ├── 💬 面试空间站
│   ├── 🚀 大模型空间站
│   ├── 🛒 电商问数空间站
│   ├── 🔍 深度研搜空间站
│   └── 🤖 SpringAI 空间站
├── 🎮 休闲空域（折叠菜单）
│   ├── 🎵 音乐专区
│   ├── 🎬 电影专区
│   ├── 🎮 游戏专区
│   ├── 📷 摄影专区
│   └── 📝 随笔杂谈
├── 🔖 星标索引
└── 👤 关于行者
```

「技术秘境」「休闲空域」支持点击展开 / 收起，交互逻辑在 `typing.js`；「星标索引」「关于行者」为固定独立入口。

菜单跳转链接统一维护在 `_components/HomeContent.njk`，和文章分类目录一一对应。

## 🎨 首页组件说明

### 1. 星空粒子组件（`_components/Particles.njk`）

全站统一星空连线粒子动画，基于 particles.js，所有页面自动引入。

**调整粒子效果**：修改组件内 particles 参数

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `number.value` | 粒子数量 | 100 |
| `color.value` | 粒子颜色 | `#00eeff` |
| `size.value` | 粒子大小 | 2 |
| `move.speed` | 移动速度 | 0.8 |

### 2. 左侧导航栏组件（`_components/Sidebar.njk`）

文章页左侧固定侧边栏：个人资料、搜索框、常用链接、热门标签、按月归档

| 区块 | 修改位置 |
| --- | --- |
| 个人资料 | `<div class="profile-card">` |
| 搜索框 | `<div class="search-box">` |
| 常用链接 | `<div class="links-card">` |
| 热门标签 | `{% for tag in site.tags %}`（自动渲染） |
| 按月归档 | `{% for post in site.posts %}`（自动渲染） |

### 3. 首页内容组件（`_components/HomeContent.njk`）

首页菜单 HTML 结构、按钮文字、跳转链接全部在此维护，配合 `typing.js` 实现折叠交互。

### 4. 样式文件

| 文件 | 作用 |
| --- | --- |
| `common.css` | 全站公共样式：星空背景、容器、通用组件 |
| `home.css` | 首页专属样式：按钮、对话框、菜单 |
| `home-animation.css` | 首页过渡动画 |
| `archive.css` | 归档页 |
| `categories.css` | 全分类汇总 |
| `category-single.css` | 单个分类列表页 |
| `post.css` | 文章正文样式 |
| `post-layout.css` | 文章页左右布局、悬浮按钮 |
| `tag.css` | 单个标签列表页 |
| `tags.css` | 全标签汇总 |

### 5. 脚本文件

| 文件 | 作用 |
| --- | --- |
| `typing.js` | 首页打字机、折叠菜单交互 |
| `home-parallax.js` | 首页视差滚动 |
| `sidebar.js` | 侧边栏交互 |
| `post-float-btn.js` | 返回顶部悬浮按钮 |

修改首页引导文案：

```javascript
const story = "时空裂隙已开启，你降临在无垠星海之中。请选择你的去向。";
```

## 🚀 快速开始

```bash
# 安装依赖
npm install
# 本地预览
hexo server
# 生成静态文件
hexo generate
# 清理缓存
hexo clean
# 开发常用组合命令
hexo clean && hexo generate && hexo server
```

## 📝 文章管理

### 创建新文章

```bash
hexo new post "文章标题"
```

生成后移动到对应分类目录，front-matter 示例：

```yaml
---
title: 文章标题
date: 2026-06-21
categories: java
tags: [JVM, Java并发]
---
```

> 二级分类写法（休闲空域）：

```yaml
categories: fun/game
tags: [游戏]
```

### 可用分类对照表

| 分类目录 | 内容说明 | 首页入口 |
| --- | --- | --- |
| `java` | Java、并发、JVM | 技术秘境 › ☕ Java 空间站 |
| `database` | MySQL、数据库优化 | 技术秘境 › 🗄️ 数据库空间站 |
| `bigdata` | 大数据、数仓 | 技术秘境 › 📊 大数据空间站 |
| `Netty` | Netty 网络编程 | 技术秘境 › ⚡ Netty 空间站 |
| `web` | Vue、前端 | 技术秘境 › 🌐 Web 空间站 |
| `interview` | 面试题、求职 | 技术秘境 › 💬 面试空间站 |
| `llm` | 大模型基础 | 技术秘境 › 🚀 大模型空间站 |
| `ecommerce` | 业务、数仓问数 | 技术秘境 › 🛒 电商问数空间站 |
| `deepSearch` | RAG、检索增强 | 技术秘境 › 🔍 深度研搜空间站 |
| `ai` | SpringAI / AI 应用 | 技术秘境 › 🤖 SpringAI 空间站 |
| `fun/game` | 游戏攻略、评测 | 休闲空域 › 🎮 游戏专区 |
| `fun/movie` | 影评、片单 | 休闲空域 › 🎬 电影专区 |
| `fun/music` | 歌单、音乐分享 | 休闲空域 › 🎵 音乐专区 |
| `fun/photo` | 摄影图集 | 休闲空域 › 📷 摄影专区 |
| `story` | 随笔、生活杂谈 | 休闲空域 › 📝 随笔杂谈 |

## 🔧 自定义修改速查表

| 修改目标 | 文件位置 |
| --- | --- |
| 首页菜单文字、跳转链接 | `_components/HomeContent.njk` |
| 侧边栏头像、签名、链接 | `_components/Sidebar.njk` |
| 全站主色 | `_css/common.css` |
| 星空粒子参数 | `_components/Particles.njk` |
| 首页打字机文案 | `_js/typing.js` |

新增首页专区步骤：

1. 在 `HomeContent.njk` 添加菜单按钮；
2. 在 `source/_posts/` 创建对应分类目录；
3. 重启本地服务预览。

## ⚙️ 核心配置说明

两份配置文件职责分离：

| 配置文件 | 职责 | 主要维护内容 |
| --- | --- | --- |
| `_config.yml` | Hexo 全局配置 | 站点信息、URL、渲染器、分类/标签中文映射、搜索、部署 |
| `_config.butterfly.yml` | Butterfly 主题配置 | 导航菜单、粒子、深色模式、背景色、mermaid、inject 注入 |

### 1. `_config.yml` 关键配置

```yaml
# Site
title: 时空秘境
subtitle: Java、JVM、MySQL、Redis、SpringAI、大数据面试笔记
description: 后端架构、JVM、中间件、分布式、Spring AI、大数据、面试复盘知识库
keywords: Java,JVM,MySQL,Redis,SpringAI,分布式,大数据,后端面试
author: wu4yong
language: zh-CN
timezone: Asia/Shanghai

# URL
url: https://wu4yong.gitee.io
root: /
permalink: :year/:month/:day/:title/
pretty_urls:
  trailing_index: true
  trailing_html: true

# 渲染器：统一使用 prismjs，关闭 highlight.js 避免样式冲突
syntax_highlighter: prismjs
highlight:
  enable: false
prismjs:
  preprocess: true
  line_number: true
  tab_replace: ''

# 相对链接：双站点部署（Gitee + GitHub Pages）建议关闭，避免资源 404
relative_link: false

# Home page setting
index_generator:
  path: ''
  per_page: 10
  order_by: -date

# Category & Tag
default_category: uncategorized

# Deployment（静态页面仓库，非源码仓库）
deploy:
  type: git
  repo: git@github.com:wu4yong/wu4yong.github.io.git
  branch: master

# 搜索（hexo-generator-searchdb）
search:
  path: search.xml
  field: all
  content: true
  format: html

# 归档
archive_generator:
  per_page: 10
  yearly: true
  monthly: true
  daily: false
```

### 2. 分类 / 标签中文映射

`category_map` 与 `tag_map` 决定分类页、标签页显示的中文名称，键必须与 `source/_posts/` 目录名保持一致（Hexo 会统一转小写）。

```yaml
# 分类中文映射
category_map:
  java: Java
  database: 数据库
  bigdata: 大数据
  netty: Netty
  web: Web前端
  interview: 面试
  llm: LLM大模型
  ai: SpringAI
  ecommerce: 电商问数
  deepsearch: 深度研搜
  story: 随笔杂谈
  fun/game: 游戏专区
  fun/movie: 电影专区
  fun/music: 音乐专区
  fun/photo: 摄影专区

# 标签中文映射
tag_map:
  java: Java
  database: MySQL数据库
  bigdata: 大数据
  netty: Netty
  web: 前端
  interview: 面试
  llm: LLM大模型
  ai: SpringAI
  ecommerce: 电商问数
  deepsearch: 深度研搜
  story: 随笔杂谈
  game: 游戏
  movie: 电影
  music: 音乐
  photo: 图片
```

| 分类目录 | category_map 键 | 生成 URL |
| --- | --- | --- |
| `source/_posts/java/` | `java` | `/categories/java/` |
| `source/_posts/database/` | `database` | `/categories/database/` |
| `source/_posts/bigdata/` | `bigdata` | `/categories/bigdata/` |
| `source/_posts/Netty/` | `netty` | `/categories/netty/` |
| `source/_posts/web/` | `web` | `/categories/web/` |
| `source/_posts/interview/` | `interview` | `/categories/interview/` |
| `source/_posts/llm/` | `llm` | `/categories/llm/` |
| `source/_posts/ai/` | `springai` | `/categories/springai/` |
| `source/_posts/ecommerce/` | `ecommerce` | `/categories/ecommerce/` |
| `source/_posts/deepSearch/` | `deepsearch` | `/categories/deepsearch/` |
| `source/_posts/story/` | `story` | `/categories/story/` |
| `source/_posts/fun/game/` | `fun/game` | `/categories/fun/game/` |
| `source/_posts/fun/movie/` | `fun/movie` | `/categories/fun/movie/` |
| `source/_posts/fun/music/` | `fun/music` | `/categories/fun/music/` |
| `source/_posts/fun/photo/` | `fun/photo` | `/categories/fun/photo/` |

### 3. `_config.butterfly.yml` 导航菜单

```yaml
menu:
  首页: / || fas fa-home
  技术分类:
    path: /categories/
    icon: fas fa-layer-group
    submenu:
      随笔: /categories/story/ || fas fa-file-lines
      前端: /categories/web/ || fas fa-laptop-code
      JAVA: /categories/java/ || fas fa-coffee
      数据库: /categories/database/ || fas fa-database
      大数据: /categories/bigdata/ || fas fa-chart-line
      Netty: /categories/netty/ || fas fa-bolt
      LLM大模型: /categories/llm/ || fas fa-brain
      SpringAI: /categories/springai/ || fas fa-robot
      电商问数: /categories/ecommerce/ || fas fa-cart-shopping
      深度研搜: /categories/deepsearch/ || fas fa-magnifying-glass-chart
      面试: /categories/interview/ || fas fa-user-graduate
  娱乐专区:
    path: /fun/
    icon: fas fa-gamepad
    submenu:
      音乐: /categories/fun/music/ || fas fa-music
      电影: /categories/fun/movie/ || fas fa-film
      图片: /categories/fun/photo/ || fas fa-images
      游戏: /categories/fun/game/ || fas fa-gamepad
  网站工具:
    path: /website/
    icon: fas fa-wrench
    submenu:
      友情链接: /website/link/ || fas fa-link
  关于我: /about/ || fas fa-user-circle
```

### 4. 主题开关配置

```yaml
# 粒子背景：已用自定义 Particles.njk 全局组件，主题自带粒子必须关闭，避免双层粒子重叠
particle:
  enable: false

# 深色模式
darkmode:
  enable: true
  default: dark

# 背景色
background:
  color: '#020817'

# 关闭 butterfly 自带 mermaid，模板手写按需加载
mermaid:
  enable: false

# 底部播放器（需要时取消注释，仅保留一份 inject）
inject:
  head:
    - <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/aplayer/1.10.1/APlayer.min.css">
    - <script src="https://cdn.bootcdn.net/ajax/libs/aplayer/1.10.1/APlayer.min.js"></script>
    - <script src="https://cdn.bootcdn.net/ajax/libs/meting/2.0.1/Meting.min.js"></script>
  bottom:
    - <div class="aplayer no-destroy" data-id="2182931917" data-server="netease" data-type="playlist" data-fixed="true" data-mini="true"></div>
```

### 5. 配置项注意事项

| 配置项 | 说明 | 处理方式 |
| --- | --- | --- |
| `particle.enable` | 与自定义 `Particles.njk` 会叠加渲染 | 必须设为 `false` |
| `syntax_highlighter` | `highlight.js` 与 `prismjs` 同时开启会样式冲突 | 只保留 `prismjs`，`highlight.enable: false` |
| `relative_link` | 开启后 Gitee / GitHub Pages 双站点切换易资源 404 | 设为 `false` |
| `plugins` 节点 | Hexo 的 `_config.yml` 无此顶层节点，写入不生效 | 插件只通过 `npm install` 安装 |
| `archive_generator` | 需安装 `hexo-generator-archive` 才生效 | 未安装时该项无效果 |
| `author` | 原值为占位文本 | 改为实际昵称 |
| `deploy.branch` | 必须与静态页面仓库实际分支一致 | 统一为 `master` |
| 菜单中的 `/fun/` | 该路径需 `source/fun/index.md` 页面存在 | 未创建时点击会 404 |
| 菜单分类路径 | 必须与 `category_map` 键、目录名三者一致 | 改分类时三处同步修改 |

## 🌐 静态站点部署

> ⚠️ `hexo-deployer-git` 部署的是**静态页面仓库**（`wu4yong.github.io`），**不是 starry-blog 源码仓库**，两者不要混淆。

### 1. 安装部署插件

```bash
npm install hexo-deployer-git --save
```

### 2. `_config.yml` 部署配置

```yaml
deploy:
  type: git
  repo: https://github.com/wu4yong/wu4yong.github.io.git
  branch: master
```

> 静态页面仓库与源码仓库的分支需保持一致，本仓库统一使用 `master`。

### 3. 执行部署

```bash
hexo clean && hexo generate && hexo deploy
```

## 🔀 Git 远程仓库与分支管理

本仓库同时在 GitHub 与 Gitee 托管源码，远程别名固定为 `github` / `gitee`，分支为 `master`（主分支）与 `develop`（开发分支）。

### 1. 查看当前状态

```bash
git status              # 工作区状态
git remote -v           # 远程别名与地址
git branch -a           # 本地 + 远程全部分支
git log --oneline -5    # 最近 5 条提交
git log --graph --oneline --all -20   # 图形化查看分支历史
```

远程配置应为对称结构：

```text
gitee   git@gitee.com:wu4yong/starry-blog.git (fetch/push)
github  git@github.com:wu4yong/starry-blog.git  (fetch/push)
```

> 若 `fetch` 与 `push` 指向不同仓库（推拉分家），会频繁出现拉错仓库、状态错乱，务必保持两侧一致。

### 2. 日常推送与拉取

```bash
# 推送
git push github master
git push gitee master
git push github develop
git push gitee develop

# 拉取
git pull github master
git pull gitee master
git pull github develop
git pull gitee develop
```

### 3. develop 合并到 master 标准流程（Rebase 线性版）

> 适用于单人维护仓库，提交历史保持一条直线。
> ⚠️ rebase 会改写 `develop` 历史，多人共用 `develop` 时请改用第 4 节的 Merge 模式。

流程顺序：

```text
develop 提交 → 同步远程 develop → 切 master 同步 → 切回 develop rebase master
→ 切 master 快进合并 → 推双端 master → 强推 develop → 切回 develop
```

```bash
# 第一步：develop 上提交并同步
git status
git add .
git commit -m "feat: 改动描述"
git pull github develop
git pull gitee develop
git push github develop
git push gitee develop

# 第二步：切 master 拉取最新
git checkout master
git pull github master
git pull gitee master

# 第三步：切回 develop，基于 master 变基
git checkout develop
git rebase master
# 冲突处理：解决后 git add <文件> → git rebase --continue
# 放弃变基：git rebase --abort

# 第四步：master 快进合并（不产生新提交）
git checkout master
git merge develop

# 第五步：推送 master
git push github master
git push gitee master

# 第六步：推送变基后的 develop（安全强制推送）
git push github develop --force-with-lease
git push gitee develop --force-with-lease

# 第七步：切回 develop 继续开发
git checkout develop
```

### 4. 备选：Merge 模式（多人协作版）

保留合并节点，分支关系可追溯，适合多人共用 `develop`：

```bash
git checkout master
git pull github master
git pull gitee master
git merge develop --no-ff -m "merge: develop -> master"
git push github master
git push gitee master
git checkout develop
```

### 5. 合并异常处理

| 场景 | 命令 | 说明 |
| --- | --- | --- |
| 合并 / 变基出现冲突 | `git status` | 查看冲突文件，手动编辑 `<<<<<<<` / `=======` / `>>>>>>>` 区间 |
| 冲突已解决 | `git add <文件>` → `git commit`（merge）/ `git rebase --continue`（rebase） | 完成本次操作 |
| 放弃未提交的合并 | `git merge --abort` | 回到合并前状态 |
| 放弃变基 | `git rebase --abort` | 回到变基前状态 |
| 已提交未推送，想撤销 | `git reset --hard HEAD~1` | 仅限尚未 push 时使用 |
| 落后远程被拒推 | `git pull github <分支>` | 先同步再推送，不要强推覆盖 |

### 6. 推送异常排查

| 现象 | 排查方式 |
| --- | --- |
| 报错但不确定是否成功 | `git fetch github` 后 `git log --oneline github/develop`，以远程真实引用为准 |
| `Everything up-to-date` 但本地有新提交 | 用 `git push github <commit>:<分支>` 直接指定引用推送 |
| `non-fast-forward` 被拒 | 说明远程已有该提交或更新提交，先 `git pull` 对齐，**不要盲目强推** |
| 本地与远程状态错乱 | `git fetch --prune` 清理失效的远程追踪引用后重新核对 |
| 推送中断（Ctrl+C）后状态混乱 | 先 `git ls-remote github refs/heads/<分支>` 查服务器真实 hash，再决定重推或拉取 |

> 原则：**推送报错时先核对远程真实状态，不要反复强制重试。** 部分场景命令返回报错但对象实际已写入，盲推会造成重复提交或历史错位。

### 7. 分支操作速查

| 操作 | 命令 |
| --- | --- |
| 查看分支差异 | `git log --oneline master..develop` / `git log --oneline develop..master` |
| 对比改动文件 | `git diff master..develop --stat` |
| 仅允许快进合并 | `git merge --ff-only develop` |
| 删除本地分支 | `git branch -D develop` |
| 删除远程分支 | `git push github --delete develop` |
| 重命名分支 | `git branch -m master main` |

> 版本发布时在 `master` 打标签：`git tag -a v1.0 -m "版本说明"`，再 `git push github v1.0` / `git push gitee v1.0`。

## 📌 常见问题

| 现象 | 处理命令 |
| --- | --- |
| 修改样式不生效，缓存问题 | `hexo clean && hexo generate && hexo server` |
| 默认端口 4000 被占用 | `hexo server -p 5000` |
| 分类 / 标签页 404 | 确认 `source` 下存在 `tags`、`categories` 页面，重新 `hexo generate` |
| `hexo: command not found` | `nvm use 20.19.2` |
| `hexo deploy` 报推送失败 | 检查 `_config.yml` 中 `repo` 与 `branch` 是否指向静态页面仓库及正确分支 |
| 推送远程报错或状态异常 | 参考「Git 远程仓库与分支管理 → 推送异常排查」 |

---

**最后更新：2026-11-06**
