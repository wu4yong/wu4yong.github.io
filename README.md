# 🌌 时空秘境 - 星空风格博客

基于 Hexo + Butterfly 主题深度定制，全页星空粒子特效，分层模块化结构，低耦合易扩展

页面访问: https://wu4yong.gitee.io
---

## 📁 项目结构
starry-blog/
├── source/                        # 站点源文件（文章、页面、静态资源）
│   ├── _posts/                    # 文章根目录（按分类分文件夹存放）
│   │   ├── bigdata/               # 大数据技术文章
│   │   ├── database/              # MySQL/数据库技术文章
│   │   ├── fun/                   # 休闲娱乐分类
│   │   │   ├── game/              # 游戏子分类
│   │   │   ├── movie/             # 电影子分类
│   │   │   ├── music/             # 音乐子分类
│   │   │   └── photo/             # 摄影图集
│   │   ├── java/                  # Java 技术专栏
│   │   ├── story/                 # 随笔故事
│   │   └── web/                   # 前端/Web 开发
│   ├── about/                     # 「关于我」独立页面
│   │   └── index.md
│   ├── assets/                    # 静态资源：图片、音频、素材
│   │   ├── archive/
│   │   ├── img/                   # 文章封面、页面背景图
│   │   └── music/
│   ├── categories/                # 分类汇总页面
│   │   └── index.md
│   ├── tags/                      # 标签汇总页面
│   │   └── index.md
│   └── website/                   # 工具/友链独立页面
│       ├── link/                  # 友情链接
│       └── tools/                 # 在线小工具
├── themes/
│   └── butterfly/                 # 核心 Butterfly 主题目录
│       └── layout/                # 页面模板存放目录
│           ├── _components/       # 全局复用组件
│           │   ├── HomeContent.njk  # 首页按钮、折叠菜单组件
│           │   ├── Particles.njk    # 星空粒子背景组件
│           │   └── Sidebar.njk       # 侧边栏导航组件
│           ├── _css/              # 全局样式表
│           │   ├── common.css     # 全站公共样式
│           │   ├── home.css       # 首页专属样式
│           │   ├── layout.css     # 页面基础布局
│           │   └── sidebar.css    # 侧边栏样式
│           ├── _js/               # 交互脚本
│           │   └── typing.js      # 首页打字机、折叠菜单逻辑
│           ├── index.njk          # 首页主模板
│           ├── archive.njk        # 归档页模板
│           ├── categories.njk     # 分类页模板
│           ├── post.njk           # 文章详情页模板
│           └── search/
│               └── index.njk      # 搜索页模板
├── _config.yml                    # Hexo 全局基础配置
├── _config.butterfly.yml          # Butterfly 主题专属配置
└── package.json                   # npm 依赖管理文件

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