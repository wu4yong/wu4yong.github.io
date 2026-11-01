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
├── source/                      # 博客源文件：文章、资源、页面
│   ├── _posts/                  # 所有博客 Markdown 文章，按分类建立子目录
│   │   ├── ai/                  # 人工智能
│   │   ├── bigdata/             # 大数据
│   │   ├── database/            # 数据库
│   │   ├── deepSearch/          # 深度研搜
│   │   ├── ecommerce/           # 电商问数
│   │   ├── fun/                 # 休闲空域，按专区再分子目录
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
│   ├── tags/                    # 标签页面源文件
│   └── website/                 # 自定义子页面目录
├── themes/
│   └── butterfly/               # 自定义重构的 Butterfly 主题
│       └── layout/              # 页面模板根目录
│           ├── _components/     # 公共复用组件
│           │   ├── HomeContent.njk     # 首页中央菜单 / 折叠按钮组件
│           │   ├── Particles.njk       # 星空粒子背景全局组件
│           │   └── Sidebar.njk         # 文章页左侧侧边栏组件
│           ├── _css/            # 全局与页面专属样式文件
│           │   ├── archive.css         # 归档页样式
│           │   ├── categories.css      # 全分类汇总页样式
│           │   ├── category-single.css # 单分类详情页样式
│           │   ├── common.css          # 全局公共基础样式（所有页面共用）
│           │   ├── home-animation.css  # 首页动画样式
│           │   ├── home.css            # 首页专属样式
│           │   ├── post-layout.css     # 文章详情页布局样式
│           │   ├── post.css            # 文章内容页样式
│           │   ├── tag.css             # 单标签详情页样式
│           │   └── tags.css            # 全标签汇总页样式
│           ├── _js/             # 页面脚本（内联 JS 已全部抽离为独立文件）
│           │   ├── home-parallax.js    # 首页视差与滚动动效脚本
│           │   ├── post-float-btn.js   # 文章页返回顶部悬浮按钮脚本
│           │   ├── sidebar.js          # 侧边栏交互脚本
│           │   └── typing.js           # 首页打字机 + 折叠菜单脚本
│           ├── search/          # 站内搜索模板
│           │   └── index.njk    # 搜索索引页面模板
│           ├── archive.njk      # 归档页面模板
│           ├── categories.njk   # 全分类汇总页面模板
│           ├── category.njk     # 单分类详情页面模板
│           ├── index.njk        # 首页模板（封装规范基准模板）
│           ├── post.njk         # 文章详情页模板
│           ├── tag.njk          # 单标签详情页面模板
│           └── tags.njk         # 全标签汇总页面模板
├── _config.yml                  # Hexo 全局主配置
├── _config.butterfly.yml        # Butterfly 主题配置
├── db.json                      # Hexo 本地缓存数据库
├── package-lock.json            # npm 依赖版本锁定文件
└── package.json                 # npm 依赖管理文件
```

### 目录职责说明

| 路径 | 职责 | 维护提示 |
| --- | --- | --- |
| `node_modules/` | npm 依赖包 | 由 `npm install` 生成，无需手动修改 |
| `public/` | Hexo 编译输出的静态站点 | 由 `hexo generate` 生成，可被 `hexo clean` 清空后重建 |
| `source/_posts/` | 所有博客 Markdown 文章 | 按分类建立子目录（`ai`、`java`、`web`、`llm` 等）；`fun/` 下再按专区细分（`game`、`movie`、`music`、`photo`） |
| `source/about/` | 关于页面 | 对应首页「关于行者」入口，页面文案在此维护 |
| `source/assets/` | 图片、视频、图标等静态资源 | `img/` 存放图片，`video/` 存放 MP4 视频 |
| `source/search/` | 站内搜索页面 | 配合 `layout/search/index.njk` 搜索模板使用 |
| `source/tags/` | 标签页面源文件 | 标签页展示依赖此目录 |
| `source/website/` | 自定义子页面目录 | 新增独立页面时在此维护 |
| `themes/butterfly/layout/_components/` | 全站公共复用组件 | 粒子、侧边栏、首页内容等组件集中于此 |
| `themes/butterfly/layout/_css/` | 全局与各页面专属样式 | 按页面拆分，公共样式集中在 `common.css` |
| `themes/butterfly/layout/_js/` | 页面脚本 | 内联 JS 已全部抽离为独立文件 |
| `themes/butterfly/layout/search/` | 站内搜索模板 | 提供全站搜索索引页 `index.njk` |
| `themes/butterfly/layout/*.njk` | 各页面模板 | `index.njk` 为封装规范基准模板 |
| `_config.yml` | Hexo 全局主配置 | 站点信息与部署配置在此维护 |
| `_config.butterfly.yml` | Butterfly 主题配置 | 主题功能开关与参数在此维护 |
| `package.json` / `package-lock.json` | npm 依赖管理与版本锁定 | 由 npm 自动维护，不手动改动 |
| `db.json` | Hexo 本地缓存数据库 | 自动生成，可安全删除后由 Hexo 重新生成 |

## 🧭 首页导航结构

首页以星空粒子动画为背景，自上而下由打字机对话框、两组折叠菜单和两个独立入口构成。

```text
首页
├── 打字机对话框            # 引导文案由 _js/typing.js 的 story 常量输出
├── 🛠 技术秘境（折叠菜单）   # 10 个技术专区
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
├── 🎮 休闲空域（折叠菜单）   # 5 个生活专区
│   ├── 🎵 音乐专区
│   ├── 🎬 电影专区
│   ├── 🎮 游戏专区
│   ├── 📷 摄影专区
│   └── 📝 随笔杂谈
├── 🔖 星标索引
└── 👤 关于行者
```

「技术秘境」「休闲空域」均为可展开 / 收起的折叠菜单，点击标题切换展开状态，交互由 `_js/typing.js` 实现。「星标索引」「关于行者」为独立入口，不参与折叠。

各专区按钮与文章存放目录的对应关系，见「文章管理 → 可用分类对照表」。

## 🎨 首页组件说明

### 1. 星空粒子组件（`_components/Particles.njk`）

全站统一的星空连线粒子动画，基于 particles.js 实现，所有页面自动引入。

**调整粒子效果**：修改 `_components/Particles.njk` 中的配置参数。

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `number.value` | 粒子数量 | 100 |
| `color.value` | 粒子颜色 | `#00eeff` |
| `size.value` | 粒子大小 | 2 |
| `move.speed` | 移动速度 | 0.8 |

### 2. 左侧导航栏组件（`_components/Sidebar.njk`）

文章页左侧固定侧边栏，包含个人资料、搜索框、常用链接、热门标签与按月归档。

**调整导航栏内容**：修改 `_components/Sidebar.njk`。

| 区块 | 说明 | 修改位置 |
| --- | --- | --- |
| 个人资料 | 头像、昵称、签名、统计数据 | `<div class="profile-card">` |
| 搜索框 | 站内搜索 | `<div class="search-box">` |
| 常用链接 | 快捷导航链接 | `<div class="links-card">` |
| 热门标签 | 自动获取文章标签 | `{% for tag in site.tags %}` |
| 按月归档 | 自动按年月分组 | `{% for post in site.posts %}` |

### 3. 首页内容组件（`_components/HomeContent.njk`）

承载首页的导航按钮、折叠菜单等 HTML 结构，配合 `_js/typing.js` 实现展收与跳转交互。首页各入口的显示文字与跳转链接均在此维护。

### 4. 样式文件说明

| 文件 | 作用 |
| --- | --- |
| `common.css` | 全站公共基础样式：星空背景、通用容器、列表样式 |
| `home.css` | 首页专属样式：大按钮、打字机对话框、折叠菜单 |
| `home-animation.css` | 首页动画样式：页面过渡与动效 |
| `archive.css` | 归档页样式 |
| `categories.css` | 全分类汇总页样式 |
| `category-single.css` | 单分类详情页样式 |
| `post.css` | 文章内容页样式 |
| `post-layout.css` | 文章详情页布局：左右两栏、文章卡片、悬浮按钮 |
| `tag.css` | 单标签详情页样式 |
| `tags.css` | 全标签汇总页样式 |

### 5. 页面脚本（`_js/`）

内联 JS 已全部抽离为独立文件：

| 文件 | 作用 |
| --- | --- |
| `typing.js` | 首页打字机动画与折叠菜单交互 |
| `home-parallax.js` | 首页视差与滚动动效 |
| `sidebar.js` | 侧边栏交互 |
| `post-float-btn.js` | 文章页返回顶部悬浮按钮 |

**修改打字机文字**：编辑 `_js/typing.js` 中的 `story` 常量。

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

# 完整开发流程
hexo clean && hexo generate && hexo server
```

## 📝 文章管理

### 创建新文章

```bash
hexo new post "文章标题"
```

### 文章分类规范

文章存放于 `source/_posts/分类名/` 目录下；休闲空域下的文章再多一层专区目录（如 `source/_posts/fun/game/`）。文件需在 front-matter 中指定分类与标签：

```yaml
---
title: 文章标题
date: 2026-06-21
categories: 分类名  # 如 java、database、fun/game 等
tags: [标签1, 标签2]
---
```

### 可用分类对照表

| 目录（分类名） | 内容说明 | 首页对应按钮 |
| --- | --- | --- |
| `java` | Java 开发、并发、JVM 等技术 | 技术秘境 › ☕ Java 空间站 |
| `database` | MySQL、数据库优化、面试题 | 技术秘境 › 🗄️ 数据库空间站 |
| `bigdata` | 大数据框架、数据仓库 | 技术秘境 › 📊 大数据空间站 |
| `Netty` | Netty 网络编程 | 技术秘境 › ⚡ Netty 空间站 |
| `web` | 前端、Vue、HTML/CSS | 技术秘境 › 🌐 Web 空间站 |
| `interview` | 面试题与求职经验 | 技术秘境 › 💬 面试空间站 |
| `llm` | 大语言模型应用 | 技术秘境 › 🚀 大模型空间站 |
| `ecommerce` | 电商问数与业务实践 | 技术秘境 › 🛒 电商问数空间站 |
| `deepSearch` | 深度研究与检索 | 技术秘境 › 🔍 深度研搜空间站 |
| `ai` | 人工智能、SpringAI 应用 | 技术秘境 › 🤖 SpringAI 空间站 |
| `fun/game` | 游戏评测、游戏攻略 | 休闲空域 › 🎮 游戏专区 |
| `fun/movie` | 影视影评、片单推荐 | 休闲空域 › 🎬 电影专区 |
| `fun/music` | 音乐分享、歌单 | 休闲空域 › 🎵 音乐专区 |
| `fun/photo` | 摄影作品、图集 | 休闲空域 › 📷 摄影专区 |
| `story` | 生活随笔、故事散文 | 休闲空域 › 📝 随笔杂谈 |

> `ai` 与 SpringAI 空间站、`story` 与随笔杂谈的对应关系按命名推定，如与站点实际配置不符，请以 `_components/HomeContent.njk` 中的按钮链接为准。

## 🔧 自定义修改

| 修改内容 | 编辑文件 |
| --- | --- |
| 首页导航按钮与文字 | `_components/HomeContent.njk` |
| 个人资料 | `_components/Sidebar.njk` |
| 主题颜色 | `_css/common.css` 中的颜色值 |

### 常见改动示例

**1. 调整星空粒子效果**
编辑 `themes/butterfly/layout/_components/Particles.njk`，修改上表对应参数。例如想让星星更稀疏，调小 `number.value`；想更换配色，修改 `color.value`。

**2. 更换首页打字机文案**
编辑 `themes/butterfly/layout/_js/typing.js` 中的 `story` 常量，替换为新的引导文字。

**3. 修改个人资料与侧边栏链接**
编辑 `themes/butterfly/layout/_components/Sidebar.njk`：个人资料在 `<div class="profile-card">`，常用链接在 `<div class="links-card">`。

**4. 修改首页按钮文字**
编辑 `themes/butterfly/layout/_components/HomeContent.njk`，找到对应按钮文本后替换。

**5. 调整主题配色**
编辑 `themes/butterfly/layout/_css/common.css` 中的颜色值，即可统一变更全站主色调。

**6. 新增一篇归类文章**
先执行 `hexo new post "文章标题"` 生成文章，再将文件移动到 `source/_posts/分类名/` 目录下，并在 front-matter 中填写 `categories` 与 `tags`。

**7. 新增一个首页专区**
先在 `_components/HomeContent.njk` 中按现有结构复制一组按钮，修改其显示文字与跳转链接；再在 `source/_posts/` 下建立对应的分类目录用于存放该专区文章。

## 🌐 部署到 GitHub Pages

**第一步，安装部署插件**

```bash
npm install hexo-deployer-git --save
```

**第二步，在 `_config.yml` 中配置**

```yaml
deploy:
  type: git
  repo: https://github.com/你的用户名/你的用户名.github.io
  branch: main
```

**第三步，执行部署**

```bash
hexo deploy
```

## 📌 常见问题

| 问题 | 解决命令 |
| --- | --- |
| 修改样式没变化 | `hexo clean && hexo generate && hexo server` |
| 端口被占用 | `hexo server -p 5000` |
| 分类 / 标签页面 404 | 确认 `source/` 下已存在对应页面目录（如 `tags/`），再执行 `hexo generate` 重新生成 |

**报错 `bash: hexo: command not found`**：执行 `nvm use 20.19.2`。

## 🔀 Git 推送与拉取

推送到不同远程仓库时注意区分目标：

```bash
# 推送到 Gitee
git push origin master

# 推送到 GitHub
git push github master
```

常用查看命令：

```bash
# 查看状态
git status

# 查看远程仓库
git remote -v

# 查看提交历史
git log --oneline -5
```

同时推送到两个仓库：

```bash
git push github master
git push origin master
```

从远程拉取最新代码：

```bash
# 从 GitHub 拉取
git pull github master

# 从 Gitee 拉取
git pull origin master
```

---

**最后更新：2026-11-01**
