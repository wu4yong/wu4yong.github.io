# 🌌 时空秘境 - 星空风格博客

基于 Hexo + Butterfly 主题深度定制，全页星空粒子特效，分层模块化结构，低耦合易扩展

页面访问: https://wu4yong.gitee.io
---

## 📁 项目结构
starry-blog/
├── node_modules/ # npm 依赖包
├── public/ # hexo 生成静态站点（编译输出目录）
├── source/ # 博客源文件：文章、资源、页面
│ ├── _posts/ # 所有博客 Markdown 文章
│ ├── assets/ # 静态资源：图片、视频、图标
│ │ ├── img/ # 图片素材
│ │ └── video/ # MP4 本地视频文件
│ ├── tags/ # 标签页面源文件
│ ├── categories/ # 分类页面源文件
│ ├── fun// website/ # 自定义子页面目录
├── themes/
│ └── butterfly/ # 自定义重构 Butterfly 主题
│ └── layout/ # 页面模板根目录
│ ├── _components/ # 公共复用组件
│ │ ├── Particles.njk # 星空粒子背景全局组件
│ │ ├── HomeContent.njk # 首页中央菜单 / 折叠按钮组件
│ │ └── Sidebar.njk # 文章页左侧侧边栏组件
│ ├── _css/ # 全局 / 页面专属样式文件
│ │ ├── common.css # 全局公共基础样式（所有页面共用）
│ │ ├── home.css # index.njk 首页专属样式
│ │ ├── archive.css # archive.njk 归档页专属样式
│ │ ├── categories.css # categories.njk 分类汇总页样式
│ │ ├── category-single.css # category.njk 单分类详情页样式
│ │ ├── post-layout.css # post.njk 文章详情页布局样式
│ │ └── sidebar.css # Sidebar.njk 侧边栏组件专属样式
│ ├── _js/ # 页面脚本文件（内联 JS 全部抽离独立文件）
│ │ ├── typing.js # 首页打字机 + 折叠菜单脚本
│ │ └── post-float-btn.js # 文章页返回顶部悬浮按钮脚本
│ ├── index.njk # 首页模板（封装规范基准模板）
│ ├── archive.njk # 归档页面模板
│ ├── categories.njk # 全分类汇总页面模板
│ ├── category.njk # 单分类详情页面模板
│ └── post.njk # 文章详情页模板
├── _config.yml # Hexo 全局主配置
├── _config.butterfly.yml # Butterfly 主题配置
├── db.json # Hexo 本地缓存数据库
├── package-lock.json
└── package.json # npm 依赖配置                # npm 依赖管理文件



## 🎨 首页组件说明

### 1. 星空粒子组件 (`_components/Particles.njk`)

全站统一星空连线粒子动画，基于 particles.js 实现，所有页面自动引入.

**修改粒子效果**：编辑 `_components/Particles.njk` 中的配置参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `number.value`  | 粒子数量 | 100       |
| `color.value`   | 粒子颜色 | #00eeff |
| `size.value`    | 粒子大小 | 2         |
| `move.speed`    | 移动速度 | 0.8       |

### 2. 左侧导航栏组件 (`_components/Sidebar.njk`)

文章页左侧固定侧边栏，包含个人信息、搜索、归档、标签云。

**修改导航栏内容**：编辑 `_components/Sidebar.njk`

| 区块 | 说明 | 修改位置 |
|------|------|----------|
| 个人资料 | 头像、昵称、签名、统计数据 | `<div class="profile-card">`     |
| 搜索框   | 站内搜索                | `<div class="search-box">`       |
| 常用链接 | 快捷导航链接             | `<div class="links-card">`       |
| 热门标签 | 自动获取文章标签          | `{% for tag in site.tags %}`     |
| 按月归档 | 自动按年月分组            | `{% for post in site.posts %}`   |

### 3. 首页内容组件 (`_components/HomeContent.njk`)

首页的按钮、折叠菜单等 HTML 结构，配合 `typing.js` 实现交互。

### 4. 样式文件说明

| 文件 | 作用 | 主要样式 |
|------|------|----------|
| `common.css`  | 公共样式   | 星空背景、通用容器、列表样式         |
| `home.css`    | 首页专用   | 大按钮、打字机对话框、折叠菜单       |
| `layout.css`  | 布局样式   | 左右两栏、文章卡片、悬浮按钮         |
| `sidebar.css` | 侧边栏样式  | 个人资料卡、搜索框、标签云、归档列表  |

### 5. 首页脚本 (`_js/typing.js`)

首页打字机动画 + 折叠菜单交互。

**修改打字机文字**：编辑 `_js/typing.js`

```javascript
const story = "时空裂隙已开启，你降临在无垠星海之中。请选择你的去向。";

🚀 快速开始
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

📝 文章管理
创建新文章

hexo new post "文章标题"

文章分类规范
文章放在 source/_posts/分类名/ 目录下，front-matter 中设置：

---
title: 文章标题
date: 2026-06-21
categories: 分类名  # 如 java、database、game 等
tags: [标签1, 标签2]
---
全部可用分类对照表

分类名	      内容说明	                           首页对应按钮
java	      Java 开发、并发、JVM 等技术	            ☕ Java 专区
database	  MySQL、数据库优化、面试题	              🗄️ 数据库专区
bigdata	    大数据框架、数据仓库	                  📊 大数据专区
web	        前端、Vue、HTML/CSS	                  Web 专区
game	      游戏评测、游戏攻略	                     └─ 游戏专区
movie	      影视影评、片单推荐	                     └─ 电影专区
music	      音乐分享、歌单	                         └─ 音乐专区
photo	      摄影作品、图集	                        摄影专区
story	      生活随笔、故事散文	                    无独立按钮

🔧 自定义修改

修改首页按钮文字

编辑 _components/HomeContent.njk

修改个人资料
编辑 _components/Sidebar.njk

修改主题颜色

编辑 _css/common.css 中的颜色值

 部署到 GitHub Pages
bash
# 安装部署插件

npm install hexo-deployer-git --save

在 _config.yml 中添加：

yaml
deploy:
  type: git
  repo: https://github.com/你的用户名/你的用户名.github.io
  branch: main

  hexo deploy

  📌 常见问题
问题	解决命令
修改样式没变化	hexo clean && hexo generate && hexo server
端口被占用	hexo server -p 5000
分类页面404	检查 source/categories/index.md 是否存在

最后更新: 2026-06-21

补充说明区分推送目标
git push -u origin "master" → 推 GitHub
git push -u gitee master → 推 Gitee