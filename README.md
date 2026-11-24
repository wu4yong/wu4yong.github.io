# 时空秘境 · Starry Sanctum

一个以「星空 / 雷达控制台」为视觉母题的 Hexo 博客。电脑端是带雷达扫描、线稿人物、时间坐标矩阵、标签图谱与星野歌单的控制台式站点；手机端是同素材的轻量阅读版。

- 线上地址：https://wu4yong.github.io
- 内容规模：175 篇文章，14 个分类目录
- 设计基调：深蓝夜空 + 青色扫描光，无硬边框，控件「融入星空」

本文档按当前工程实际目录编写。改任何东西之前，先读第 3 章（目录结构）和第 6 章（样式与脚本）。

---

## 目录

1. [技术栈与运行环境](#1-技术栈与运行环境)
2. [快速开始](#2-快速开始)
3. [目录结构](#3-目录结构)
4. [双端架构与路由](#4-双端架构与路由)
5. [写一篇文章](#5-写一篇文章)
6. [样式与脚本](#6-样式与脚本)
7. [配置说明](#7-配置说明)
8. [图片与媒体资源](#8-图片与媒体资源)
9. [构建、预览与部署](#9-构建预览与部署)
10. [开发约定与禁区](#10-开发约定与禁区)
11. [故障排查](#11-故障排查)
12. [维护清单](#12-维护清单)

---

## 1. 技术栈与运行环境

| 项 | 版本 / 取值 | 说明 |
| --- | --- | --- |
| 操作系统 | Windows 10/11（实测环境） | 脚本无 Windows 强绑定，只有路径大小写差异 |
| Node.js | >= 18（实测 v22.23.2） | Hexo 8 要求 Node 18+ |
| Hexo | 8.1.2 | `package.json` 依赖 `hexo ^8.0.0` |
| 模板引擎 | Nunjucks（`.njk`） | 不是 EJS |
| Markdown 渲染 | `hexo-renderer-marked` ^7 | |
| 代码高亮 | PrismJS（`highlight` 已关闭） | 两者同开会打架，配置里已锁死 |
| 搜索索引 | `hexo-generator-searchdb` | 构建期产出 `public/search.json`（约 5.3 MB） |
| 音频/视频 | `hexo-tag-dplayer` | 文章里可用 `{% dplayer %}` |
| 部署 | `hexo-deployer-git` | 推到独立的 Pages 仓库 |

### 构建期扩展（`scripts/`）

Hexo 自动加载 `scripts/**.js`，改动必须重新 `hexo generate` 才生效。当前 7 个：

| 文件 | 提供什么 |
| --- | --- |
| `scripts/image-cdn.js` | 图床地址注入：把文章里的 `@@CDN@@` 占位符替换成 `_config.yml` 的 `image_cdn.base`；另有兜底 filter 改写属性上下文里的历史硬编码前缀 |
| `scripts/phone-routes.js` | 手机端全部路由生成（`/phone/**`）+ helper `phone_tag_url` / `phone_cat_slug` / `phone_post_url` |
| `scripts/menu-order.js` | helper `starmap_menu_order` / `starmap_tag_ranks`：把菜单顺序换算成雷达区标签排列位次；`MENU_ALIASES` 维护菜单路径 → 分类 slug 的别名映射 |
| `scripts/tag-time-rank.js` | helper `starmap_tag_time_ranks`：按每标签下最新文章日期算时间位次（/tags/ 标签云用） |
| `scripts/category-time-rank.js` | helper `starmap_category_time_ranks`：分类版时间位次，左栏坐标矩阵按分类最新文章排序（越新越靠上） |
| `scripts/site-helpers.js` | helper `current_year` / `is_mobile` |
| `scripts/autogrid.js` | 自定义标签 `{% autogrid %}`：把管道分隔的文本渲染成矩阵网格（`renderCell()` / `splitRow()`） |

> **`scripts/` 是 Hexo 保留目录，只能放 `.js`。** 塞进 Python 脚本或 README 会让 `hexo g` / `hexo s` 抛 `SyntaxError: Invalid or unexpected token`。
> 非构建期脚本（图片处理等）统一放 `tools/`（见 8.6）。

---

## 2. 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 本地预览：http://localhost:4000（先自动清掉占着 4000 的旧进程，再启动）
npm run dev

# 3. 只构建，产物在 public/
npx hexo generate

# 4. 清理缓存后再构建（改了模板、CSS、scripts、文章图床地址后必须做）
npx hexo clean && npx hexo generate
```

`package.json` 已配置快捷脚本，等价写法：

```bash
npm run clean && npm run build     # = hexo clean + hexo generate
npm run dev                        # = 先清理 4000 端口，再 hexo server（推荐日常预览用这个）
npm run server                     # = hexo server（端口被占会直接失败退出，不建议直接用它）
npm run deploy                     # = hexo deploy
```

> **`npm run dev` 为什么要先清端口**：`hexo server` 只要发现 4000 被占，就会打印
> `FATAL Port 4000 has been used.` + `Error: listen EADDRINUSE` 然后**直接退出**（Windows / macOS
> 都一样，不会自动换端口）。此时它没起来，浏览器连的还是那个占着 4000 的旧进程，页面自然还是老模板。
> `npm run dev` = `kill-port 4000 && hexo server`，跨平台通用，先杀占用再启动，启动成功才继续。
>
> 启动成功的唯一标志是终端最后出现这一行，看到别的（尤其 `FATAL`）就是没起来：
>
> ```
> INFO  Hexo is running at http://localhost:4000/ . Press Ctrl+C to stop.
> ```

> **预览的坑**：部分 Windows 环境下 `hexo server` 会卡住不返回。此时改用「构建 + 静态服务器」：
>
> ```bash
> npx hexo clean && npx hexo generate
> npx --yes serve public -l 4001
> ```
>
> 访问 `http://localhost:4001/`。两条路产物完全一致，只是热更新不同。

正常构建输出 `INFO  Generated: 659 files`，用时约 2 秒。

---

## 3. 目录结构

### 3.1 顶层

```
starry-blog/
├── _config.yml               # Hexo 主配置（含 image_cdn 图床段、searchdb、生成器分页）
├── _config.butterfly.yml     # 主题配置（菜单、粒子、背景）
├── package.json              # 依赖与快捷脚本
├── scripts/                  # 构建期扩展（只放 .js，7 个）
├── source/                   # 内容与站点级静态资源
├── themes/butterfly/         # 主题（layout 模板 + source 静态资源）
├── tools/                    # 图片处理等离线脚本（自带 tools/README.md）
├── README.md                 # 本文件
├── MergeCode.md              # 代码片段汇集（历史参考）
├── 主题样式与脚本说明.md       # 主题 CSS/JS 逐文件详解（同步维护，见第 12 章）
├── 图床与配图说明.md           # 图床换用与配图规范（第 8 章入口）
└── public/、.deploy_git/、node_modules/、db.json   # 构建与依赖产物（已 gitignore）
```

### 3.2 `source/`

```
source/
├── _posts/            # 全部文章，按分类分目录（14 个目录 / 175 篇）
├── about/             # 秘境主人页（曾经的少年）
├── categories/        # 分类入口页
├── tags/              # 星迹索引页
├── search/            # 全文搜索页（找找看）
├── fun/               # 星屿乐园入口页（layout: fun）
├── music/             # 星野歌单入口页（layout: music）+ playlist.json + lyrics/
├── phone/             # 手机端入口页
├── website/           # 站点附属页（link/ 友链、tools/ 工具）
├── images/            # 站点级图片（404 图、about/ 主人照片、收款二维码等）
├── css/               # 站点级样式（code-table.css 代码块配色）
├── 404.html
└── .nojekyll          # （已移除，见 9.3 的说明）
```

`_posts/` 分类目录与篇数：

| 目录 | 篇数 | 目录 | 篇数 |
| --- | --- | --- | --- |
| `aicoding/` | 14 | `interview/` | 11 |
| `bigdata/` | 3 | `java/` | 10 |
| `database/` | 14 | `langchain/` | 10 |
| `deepsearch/` | 15 | `llm/` | 35 |
| `ecommerce/` | 18 | `netty/` | 4 |
| `fun/` | 12 | `springai/` | 15 |
| `git/` | 5 | `web/` | 9 |
| | | **合计** | **175** |

嵌套目录两处（路径深度不影响分类，分类由 front-matter 决定）：

- `bigdata/hbase/`（2 篇）、`bigdata/hdfs/`（1 篇）
- `fun/game|movie|photo|story/`（1 + 5 + 3 + 3 篇）——注意 `fun/story/` 里的文章分类写的是 `essay`（随笔杂谈），不是 `story`，见 7.2 的 `MENU_ALIASES`

### 3.3 `themes/butterfly/`

```
themes/butterfly/
├── layout/
│   ├── index.njk / post.njk / page.njk / tags.njk / archive.njk
│   ├── categories.njk / category.njk / tag.njk / about.njk
│   ├── fun.njk / music.njk        # 星屿乐园、星野歌单
│   ├── search/index.njk            # + _components/ + _css/
│   ├── phone/                      # 手机端：home / list / post / tags / about
│   │   └── _components/            # home-content.njk、Particles.njk
│   ├── _components/                # APlayer、Head、InplaceReader、Particles、Sidebar、StarJukebox
│   └── _js/                        # hot-tags.js（模板内联依赖的渲染期脚本）
└── source/
    ├── css/theme/                  # 按 base / home / media / starmap / phone 五组分目录（见 6.1）
    ├── js/theme/                   # 同样五组（见 6.3）
    ├── js/third-party/             # 本地化的第三方库：aplayer/、mermaid/
    ├── js/particles.min.js         # 粒子库（本地）
    └── img/                        # 主题图片（banner/、首页人物主视觉 webp）
```

> 2026-11 起主题 CSS/JS 从扁平结构重组为 `base / home / media / starmap / phone` 五个子目录，按「职责域」分组；`pageCss` 里写子目录 + 文件名（如 `starmap/tags.css`）。

---

## 4. 双端架构与路由

### 4.1 电脑端路由一览

| 路径 | 页面 | 生成方式 |
| --- | --- | --- |
| `/` | 电脑端首页（雷达 + 线稿人物 + 公告） | `layout/index.njk` |
| `/page/2..18/` | 首页文章分页（每页 10 篇） | `index_generator`，`per_page: 10` |
| `/:year/:month/:day/:title/` | 文章页 | Hexo 默认（`permalink`） |
| `/archives/` | 星图手记（时间坐标矩阵 + 年度分布） | `archive_generator`，`per_page: 0` |
| `/tags/` | 星迹索引（标签图谱 + 控制台） | `layout/tags.njk` |
| `/categories/` | 分类入口（只做入口，不列文章） | `layout/categories.njk` |
| `/categories/<分类>/` | 单分类文章列表 | `layout/category.njk`，`per_page: 0` |
| `/about/` | 秘境主人 | `layout/about.njk` |
| `/search/` | 全文搜索（找找看） | `layout/search/index.njk` |
| `/fun/` | 星屿乐园（娱乐专区第二层矩阵） | `source/fun/index.md`（`layout: fun`） |
| `/music/` | 星野歌单（整页播放器） | `source/music/index.md`（`layout: music`） |
| `/website/link/`、`/website/tools/` | 友链、工具页 | `source/website/**` |

### 4.2 手机端路由（全部由 `scripts/phone-routes.js` 生成）

| 路径 | 页面 |
| --- | --- |
| `/phone/` | 手机端菜单首页 |
| `/phone/c/<分类>/` | 手机端分类列表（`layout: phone/list`） |
| `/phone/t/<标签>/` | 手机端标签列表（同上） |
| `/phone/tags/` | 手机端星迹索引（`layout: phone/tags`） |
| `/phone/about/` | 手机端秘境主人（`layout: phone/about`） |
| `/phone/p/<slug>/` | 手机端文章原文（`layout: phone/post`） |

### 4.3 分流规则

- 手机 UA 或宽度 ≤ 900px 时，首页显示 `#mGate` 待机层，点击进入 `/phone/`。
- 所有电脑端模板（含 `fun.njk`、`music.njk`）头部都有 UA 嗅探脚本，手机访问直接 `location.replace('/phone/')`。
- 带 `?mobile=1` 访问首页时，由 `index.njk` 内联脚本直接跳转，`phone/gate.js` 不重复处理。
- 手机端页面与被跳转的电脑端页面并存，共用同一份 `_posts` 内容。

### 4.4 手机端路由三条硬规则

1. 分类 / 标签目录名用**原始中文名**，不要在生成器里预编码；链接处再 `encodeURIComponent`，否则产物里出现 `%E5%A4%A7...` 目录而 404。
2. 模板 `layout` 名必须与 `phone-routes.js` 里的写法、与实际文件名三方一致。
3. 不要在 `phone/` 里复制电脑端的三栏结构，手机端只做线性阅读。

---

## 5. 写一篇文章

### 5.1 新建文件

在对应分类目录下建 `.md`，文件名即 URL 里的 `:title` 段（中文可用，Hexo 会编码）。

> 文件名不要出现零宽字符（历史上出现过 `memory‌.jpeg`，肉眼不可见，排查极痛苦）。

### 5.2 front-matter 模板

```yaml
---
title: 文章标题
date: 2026-11-14 10:00:00
categories:
  - java
tags:
  - JVM
  - 垃圾回收
permalink: /2023/06/01/java/jvm/     # 可选：固定旧链接，目录挪动后 URL 不变
---
```

`permalink` 只在「目录调整但仍要保持旧 URL」时写。默认走 `_config.yml` 的 `:year/:month/:day/:title/`。

娱乐专区的文章另有两个可选键（见 `fun/game/index.md`）：

```yaml
album: scroll          # 雷达区画册版式：book=一页一张翻页，scroll=横向长卷
album_bgm: https://wu4yong.github.io/starry-images/media/audio/xxx.mp3
                       # 画册背景音，不写则回落全局默认 be-with-you.mp3
```

> **front-matter 不参与 `@@CDN@@` 替换**（`image-cdn.js` 只处理正文），所以 `album_bgm` 这类写在头部的媒体地址必须写完整 URL；正文里的 `{% dplayer %}` 才能用 `@@CDN@@/media/video/...` 占位符。

### 5.3 章节 banner

每篇开头那块 6.2:1 霓虹横幅用固定类名 + 固定图片名，映射表在主题样式的 banner 段。类名与文件名错位会串图。

### 5.4 表格：`autogrid`

全站表格统一用这个标签，**不要直接写 GFM 表格**（`|---|` 那种），否则渲染成另一种样式。

```njk
{% autogrid %}
列1 | 列2 | 列3
值1 | 值2 | 值3
{% endautogrid %}
```

规则：

- **不写分隔行**。`| --- | --- |` 会被当成一行数据渲染出来。
- 单元格支持行内 Markdown：反引号 → `<code>`、`**粗体**` → `<strong>`、`[文字](url)` → 链接。这一步是 `autogrid.js` 里 `renderCell()` 做的，不用手写 HTML。
- 表头整行为空时（`|  |` 这种单列提示框写法），不渲染表头条，只渲染下面的内容行。
- **整列空白会自动剔除**。源表格常写成 `|  | SQL | NoSQL |`，首尾的空单元格会被 `splitRow()` 去掉；若某一整列在所有行（含表头）都是空的，渲染前直接删掉该列，不会在网格前后留空栏。
- 参数：`nofix` 关掉首列固定宽度；其余参数当成额外 class 追加（如 `data-grid-link-table`）。
- 引用块里的表格（`> | … |`）也能包，包裹时把 `> ` 前缀去掉再放进标签里。

### 5.4.1 图表：`mermaid`

正文直接写 ` ```mermaid ` 代码块，页面加载后自动渲染成 SVG 图，不用切图片。

- **库是本地的**：`themes/butterfly/source/js/third-party/mermaid/mermaid.min.js`（mermaid@10）。三处按需加载——`layout/post.njk`、`layout/phone/post.njk`、`_components/InplaceReader.njk`（浮层阅读器自己的那套），页面上没有 mermaid 代码块就不加载，不走外网 CDN（之前用 `cdn.jsdelivr.net` 运行时 import，网络一抖图就退化成代码块）。
- `_config.butterfly.yml` 里 `mermaid.enable` 保持 `false`：主题自带的渲染关掉，避免和手写脚本重复渲染。
- 配色写死在脚本的 `themeVariables`（深青底 `#062f3d`、青色边框与连线 `#00eeff`、文字 `#d6f6ff`），改主题色就改这里。**文章页与浮层阅读器两处的配色要同步改**。
- **subgraph 标题别用 `<br/>` 换行**：mermaid v10 会把换行后的第二行压到第一个节点上，标题写成一行（`subgraph Phase1["第一阶段：智能补全时代 2020-2022"]`）即可。
- 手机端图按原尺寸渲染、超出屏幕时在容器内横向滑动。
- 库引用带版本参数 `?v=10`（上述三处各一个）。换 mermaid 版本时**三处一起改数字**，否则浏览器会继续用缓存里的旧库。

**图不渲染时的排查顺序（先排环境，再排代码）**

> **第 0 步：先确认页面里没有「同步外链脚本」**。这是本博客历史上最隐蔽的一个坑：`_components/APlayer.njk` 曾用
> `<script src="https://cdn.bootcdn.net/...">` 直接引播放器，`_components/Particles.njk` 曾用 `document.write` 从
> `cdn.jsdelivr.net` 插入 particles.js。同步外链脚本会**阻塞 HTML 解析**，网络不通时（本机访问 jsdelivr 会被重置）会
> 长时间挂起，**后面所有脚本一行都执行不到**，其中就包括 mermaid 渲染——表现就是「重启、F5、Ctrl+Shift+R、清缓存全没用」，
> 而无头浏览器网络快、能渲染，会把人反复带偏。现在播放器（APlayer + Meting）已本地化到
> `source/js/third-party/aplayer/`，粒子库在 `source/js/particles.min.js`，两者都不再回退外网；新增任何外链
> `<script>` 必须带 `defer` 或 `async`。查一遍当前页面：
>
> ```powershell
> (Invoke-WebRequest "http://localhost:4000/<任一文章路径>/" -UseBasicParsing).Content `
>   | Select-String -AllMatches '<script[^>]*src="(https?:)?//' | ForEach-Object { $_.Matches.Value }
> ```
>
> 输出为空即正常。
>
> **另一条独立路径：站内浮层阅读器**。「星迹索引」(`/tags/`)、「星图手记」(`/archives/`) 和「星屿乐园」(`/fun/`) 点开文章时用的是
> `_components/InplaceReader.njk` 的就地阅读浮层：它 `fetch` 文章页后只搬 `.article-content` 的 HTML，
> **innerHTML 里的 `<script>` 不会执行**，文章页那套 mermaid 转换脚本也管不到浮层——所以浮层里的 ` ```mermaid `
> 以前一直是原始源码。现在浮层有自己的一套渲染（`renderReaderMermaid()` + `ensureReaderMermaid()`，本地库
> 按需加载，配色与文章页一致），样式在 `css/theme/media/star-reader.css` 的 `.reader-body .mermaid`。

1. **确认访问方式**。`hexo server` 是 `http://localhost:4000`。如果直接双击 `public/**.html` 用 `file://` 打开，页面里的 `/js/third-party/mermaid/…` 是站点绝对路径，`file://` 下会解析到磁盘根目录 → 库 404 → 图退化成代码块。这种打开方式本来就不受支持，要看效果必须走 server。
2. **改过 `themes/` 下任何东西就必须重启 server**。模板、JS、CSS、新增静态文件都属于这一类：`hexo server` 在启动时确定模板与静态资源，Ctrl+C 重开才能拿到新文件。只改 `source/_posts/*.md` 才实时生效。另外注意旧进程若占着 4000，`hexo server` 会直接打印 `FATAL Port 4000 has been used.` + `EADDRINUSE` 后退出（不会自动换端口），浏览器连的仍是那个旧进程，看到的永远是老模板——日常启动统一用 `npm run dev`，它自带清端口。
3. **确认浏览器标签不是旧文档**。表现是地址栏 URL 与页面内容对不上（比如地址写 `/tags/` 却显示文章正文）。点地址栏重新输入完整 URL 回车，或 `Ctrl + Shift + R` 强刷。
4. **确认库能取到**：浏览器打开 `http://localhost:4000/js/third-party/mermaid/mermaid.min.js?v=10`，能看到一大段 JS（约 3.2 MB）即正常。
5. 以上都对仍不渲染，再按 F12 → Console 看是否有 `[mermaid]` 开头的警告；脚本失败只 `console.warn`，不会弹错。

### 5.5 图片与音视频引用：占位符 + 图床

**图片唯一推荐写法**（图床地址不写死在文章里）：

```markdown
![说明](@@CDN@@/assets/img/<分类>/<文件名>.webp)
```

- `@@CDN@@` 在构建期被 `scripts/image-cdn.js` 换成 `_config.yml` 里的 `image_cdn.base`。
- 以后换图床只改一行配置，不用全文搜替。
- 完整规则、换图床的四种场景、验证命令见 **`图床与配图说明.md`**。
- 只放 webp；本地小图可放 `source/images/` 并用 `/images/...` 站点路径，但大图一律走图床。

**音视频**（大媒体不进博客仓库，`.gitignore` 已注明）：

```njk
{% dplayer "url=@@CDN@@/media/video/xxx.mp4" ... %}
```

- 媒体文件放图床仓库 `starry-images` 的 `media/` 目录，走 Pages 外链。
- 正文里用 `@@CDN@@` 占位符；front-matter 里（如 `album_bgm`）必须写完整 URL（见 5.2）。

---

## 6. 样式与脚本

### 6.1 电脑端样式（`themes/butterfly/source/css/theme/` → `/css/theme/`）

按职责域分五组，共 22 个文件：

**`base/` —— 全站骨架（四个模板的公共前四层）**

| 文件 | 职责 |
| --- | --- |
| `common.css` | 全局基础：变量、字体、滚动条、通用动效 |
| `post-layout.css` | 页面骨架（三栏、容器宽高） |
| `sidebar.css` | 左栏：logo 星空徽标、常用链接、热门标签、粉丝数、折叠态 |
| `post.css` | 正文排版：标题、代码块、表格、引用 |

**`home/` —— 首页与主人页**

| 文件 | 职责 |
| --- | --- |
| `pc-home.css` | 首页主视觉：标题、人物、雷达、公告面板、stat chips |
| `about.css` | 秘境主人页 |

**`starmap/` —— 星图控制台族（索引 / 手记 / 乐园 / 分类标签页）**

| 文件 | 职责 |
| --- | --- |
| `tags.css` | 星迹索引 / 星图手记的坐标矩阵、标签图谱、log 框（三栏骨架与三档断点，被 fun 页复用） |
| `starmap-live.css` | 雷达实时面板：K 线频谱、日志流、轨道星点（覆盖 tags.css 中的滚动光带方向） |
| `chronicle.css` | 星图手记的行星与时间轴 |
| `radar-view.css` | 雷达视图专用尺寸与游标 |
| `category-shared.css` | 分类页共用外壳 |
| `tag.css` | 单标签页 |
| `fun.css` | 星屿乐园第二层矩阵 → 分区清单（骨架沿用 tags.css） |

**`media/` —— 媒体与浮层**

| 文件 | 职责 |
| --- | --- |
| `star-reader.css` | 就地阅读器（InplaceReader）容器与转场 |
| `star-album.css` | 图片画册：book / scroll 两种版式、放大层、HUD |
| `star-jukebox.css` | 雷达区播放器（archives / tags / fun / music 就地展开的那套） |
| `star-player.css` | 全站迷你播放器 + 歌单页大播放器 |

**`phone/` —— 手机端（5 个）**

| 文件 | 职责 |
| --- | --- |
| `common.css` | 手机端基础与安全区 |
| `home.css` | 手机首页版式 |
| `home-animation.css` | 打字机与折叠菜单动效（招式由 `home-typing.js` 驱动） |
| `gate.css` | 待机层 `#mGate` |
| `list.css` | 手机端列表 / 标签页 |

### 6.2 脚本（`themes/butterfly/source/js/theme/` → `/js/theme/`）

同样五组，共 18 个：

**`base/`**

| 文件 | 职责 |
| --- | --- |
| `sidebar.js` | 左栏全部交互：搜索面板、弹窗、关注数、滚动记忆、链接预取、折叠 |
| `post-float-btn.js` | 文章页右下浮动按钮（>300px 亮起，滚 `.main-content`） |

**`home/`**

| 文件 | 职责 |
| --- | --- |
| `globe.js` | 地球仪：经纬网、轨道、星尘 |
| `starfield.js` | 星座层：8 个真实星座 + 零星闪现 |
| `pc-typewriter.js` | 首页标题打字机（跑一次，回访直接终态） |
| `pc-hero-layout.js` | 标题与副标题宽度同步（2px 阈值） |
| `pc-notice-frame.js` | 公告 / 雷达面板落在标题与人物之间的中缝 |

**`starmap/`**

| 文件 | 职责 |
| --- | --- |
| `radar-core.js` | 星图雷达内核：统一接管雷达区布局、连线、粒子、聚焦反馈与跨页上下文；`/archives/` 与 `/tags/` 的视图差异靠 `root.dataset.view`（timeline / graph）分派 |
| `starmap-live.js` | 星图控制台动态层：雷达标题星群、K 线频谱、滚动日志、轨道星点，按访问次数重排热门标签 |
| `fun.js` | 星屿乐园第二层矩阵交互：点专区就地展开文章清单，点文章交给 InplaceReader |
| `sector-scene.js` | 星屿乐园专区背景场景层：音乐=街舞线稿、游戏=飞机大战、摄影=超跑侧影、电影=放映机光束、随笔=江边诗人（1px 青线 + 发光画法） |

**`media/`**

| 文件 | 职责 |
| --- | --- |
| `star-album.js` | 图片画册：翻页、自动播放、放大、音频、字幕 |
| `star-jukebox.js` | 雷达区播放器：stage / split 两种视图、三种播放模式、canvas 星图背景、Web Audio 真实频谱驱动扫描 |
| `star-player.js` | 全站左下角迷你播放器（`#star-mini`）+ 歌单页大播放器（`#star-player`，环形频谱） |

**`phone/`**

| 文件 | 职责 |
| --- | --- |
| `gate.js` | 手机待机层显示与跳转 |
| `home-typing.js` | 手机首页打字机 + 折叠菜单 |
| `home-parallax.js` | 手机首页鼠标/触摸视差 |

所有 `.css` / `.js` 都带文件头注释块（作用、依赖、适用终端）；非直觉的规则与每个事件原地写明作用。逐文件详解见 **`主题样式与脚本说明.md`**（该文档尚按旧扁平结构编写，目录重组后待同步，见第 12 章）。

### 6.3 音乐子系统（星野歌单）

数据与渲染分离，**加歌不用碰任何模板**：

| 件 | 位置 | 说明 |
| --- | --- | --- |
| 曲目数据 | `source/music/playlist.json` | 每首 `name / artist / url / key`，url 指向图床 `media/audio/` |
| 歌词 | `source/music/lyrics/<key>.lrc` | 缺省自动降级不报错 |
| 大播放器 | `/music/` 页 + `_components/StarJukebox.njk` | 整页铺满，环形频谱 |
| 雷达区播放器 | `/archives/`、`/tags/`、`/fun/` 内嵌 StarJukebox | 点侧栏「星野歌单」就地展开，不跳页 |
| 迷你播放器 | `_components/APlayer.njk`（page / post 页） | 左下角固定 `#star-mini`，读同一个 playlist.json |

第三方库全部本地：`js/third-party/aplayer/`（APlayer.min.js / APlayer.min.css / Meting.min.js）。

### 6.4 加载顺序（改样式必读）

`_components/Head.njk` 用 `pageCss` 数组按固定顺序输出，**只许追加，不许重排**：

```
1 base/common.css → 2 base/post-layout.css → 3 base/sidebar.css → 4 base/post.css
→ 5 页面级（starmap/tags · starmap/chronicle · home/about · starmap/tag · starmap/category-shared · home/pc-home）
→ 6 media/star-reader.css → 7 starmap/starmap-live.css
```

页面级 `pageCss` 清单（实测自各模板）：

| 模板 | 追加样式 |
| --- | --- |
| `page.njk`、`post.njk`、`music.njk` | 仅前 4 个 |
| `tags.njk` | + starmap/tags、media/star-reader、media/star-album、starmap/starmap-live、starmap/radar-view |
| `archive.njk` | + starmap/tags、media/star-reader、media/star-album、starmap/chronicle、starmap/starmap-live、starmap/radar-view |
| `fun.njk` | + 同 archive，再追加 starmap/fun |
| `about.njk` | + starmap/tags、home/about、starmap/starmap-live |

> 同页同时出现 `tags.css` 与 `starmap-live.css` 时，后者覆盖前者的滚动光带方向（自下而上）。**不要**在两处各写一遍 `@keyframes logScan`。

> **缓存击穿参数 `?v=`**：频繁改动的样式（star-reader、star-album、fun、about、star-jukebox 等）在 `pageCss` 里带日期版本号（如 `media/star-reader.css?v=20261115k`）。改这些文件后**记得把对应 `?v=` 数字顶上去**，否则线上走浏览器缓存的旧样式。星屿乐园三处（fun.njk 的 star-reader / star-album / fun）与组件内联的 star-jukebox.css / .js 各自维护版本号。

---

## 7. 配置说明

### 7.1 `_config.yml`（只列容易被误改的项）

| 键 | 当前值 | 说明 |
| --- | --- | --- |
| `permalink` | `:year/:month/:day/:title/` | 改它等于全站改链接，旧文需显式 `permalink` |
| `theme` | `butterfly` | |
| `index_generator.per_page` | `10` | 首页文章分页，当前产出 `/page/2..18/` |
| `archive_generator.per_page` | `0` | 0 = 不分页，避免产物里出现 `/archives/page/2..n/` 重复副本 |
| `category_generator.per_page` | `0` | 同上 |
| `image_cdn.base` | `https://wu4yong.github.io/starry-images` | 图床基地址，**换图床只改这一行** |
| `searchdb` | `path: search.json`，`content: false` | 搜索索引，约 5.3 MB |
| `deploy.repo` | `git@github.com:wu4yong/wu4yong.github.io.git` | |
| `deploy.branch` | `gh-pages` | 与 Pages 源分支保持一致 |

`image_cdn` 段写法：

```yaml
image_cdn:
  base: https://wu4yong.github.io/starry-images
```

> **图床源的来龙去脉**：2026-11-14 实测本机网络对 `cdn.jsdelivr.net` **TLS 握手直接失败**
> （`The SSL connection could not be established`），页面图片全部裂开；`cdn.bootcdn.net` 也不可靠；
> raw 端点虽可直连但国内有 QoS 限流（实测 3 次里 1 次失败）。故当前用 **starry-images 仓库的 GitHub Pages**
> （走 Fastly CDN，稳定性最优）。
> 开启条件：`starry-images` 仓库 Settings → Pages → Deploy from a branch → main → /(root)。
> 换源时逐个 `HEAD` 实测，别只看文档：

| 源 | 地址 | 状态 |
| --- | --- | --- |
| **GitHub Pages**（当前） | `https://wu4yong.github.io/starry-images` | 需图床仓库开启 Pages；Fastly CDN，稳定性最优 |
| GitHub raw（回滚备选） | `https://raw.githubusercontent.com/wu4yong/starry-images/main` | 可直连，但国内有限流，实测 3 次里 1 次失败 |
| jsDelivr | `https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main` | 2026-11-14 起 TLS 握手直接失败 ✗ |

改完必须 `hexo clean` 再 `hexo generate`（过滤器读的是构建期配置，热更新不生效）。

### 7.2 `_config.butterfly.yml`

| 键 | 说明 |
| --- | --- |
| `menu` | 左栏菜单与雷达标签排序依据（`menu-order.js` 读它换算位次） |
| `particle` | 粒子层参数 |
| `darkmode` | 暗色模式 |
| `background` | 背景图 / 背景色 |
| `mermaid` | 保持 `enable: false`（渲染由手写脚本接管，见 5.4.1） |

菜单结构：`首页` / `技术分类`（12 个分类子项）/ `娱乐专区`（`/fun/`，子项含星野歌单 `/music/` 与 movie / photo / game / essay 分类）/ `网站工具` / `关于我`。

> 菜单里的部分路径与实际分类 slug 不一致，别名映射写在 `scripts/menu-order.js` 的 `MENU_ALIASES`：

```js
const MENU_ALIASES = {
  '/categories/story/': '/categories/essay/',   // fun/story/ 的文章分类是 essay
  '/categories/fun/movie/': '/categories/movie/',
  '/categories/fun/photo/': '/categories/photo/',
  '/categories/fun/game/': '/categories/game/'
};
```

改菜单时同步核对。

---

## 8. 图片与媒体资源

### 8.1 四条铁律

1. 只放 webp（PNG/JPG 会被压成白洞或噪点）。
2. 文章大图走图床，用 `@@CDN@@/assets/img/...` 占位符，不写死域名。
3. 主题图片放 `themes/butterfly/source/img/`（banner / 首页人物主视觉）；站点级图片放 `source/images/`（404 图、about 照片、二维码）。`source/img` 不存在。
4. 音视频一律走图床 `media/` 目录外链，不进博客仓库（曾导致 `.git` 膨胀到 92.8 MB，见 `.gitignore` 注释）。

### 8.2 图床

- 仓库：`wu4yong/starry-images`，基地址写在 `_config.yml` 的 `image_cdn.base`。
- **当前 base = `https://wu4yong.github.io/starry-images`**（GitHub Pages 源，2026-11-14 由 jsDelivr 迁移而来，原因见 7.1）。
- 全部文章已改用占位符（122 篇引用 `@@CDN@@`），用 `scripts/image-cdn.js` 两道 filter 在构建期还原。
- 换仓库 / 换分支 / 换 CDN 服务商 / 退回本地图，四种做法与验证命令见 `图床与配图说明.md`。
- 图片**不进博客仓库**：本地那份 286.6 MB 副本在 `workspace2026/starry-images`，不要往 `source/` 里抄。

### 8.3 章节 banner

6.2:1 霓虹横幅，已全部本地化，放 `themes/butterfly/source/img/banner/`。

### 8.4 首页人物主视觉

`pc-hero-glow.webp` / `pc-hero-glow-l.webp` 为 `object-fit: contain` + 贴右下，流光层用同尺寸 mask。**改尺寸必须同步改流光层的 `mask-position` / `inset`**，否则人物旁边会画出第二个人轮廓。压体积用 `tools/img2webp.py` 的 alpha 三连（见 8.6）。

### 8.5 秘境主人照片

8 张 webp，放 `source/images/about/`（站点级资源，不是主题目录）。

### 8.6 图片处理工具（`tools/`）

`tools/` 不被 Hexo 扫描，放什么都安全；完整用法见 **`tools/README.md`**。速查：

| 脚本 | 用途 |
| --- | --- |
| `img2webp.py` | 本地批量转 WebP（Pillow，`quality=92, method=6, exact=True`；支持 alpha 通道专项压缩、长边缩放、备份原图） |
| `img_mediakit_compress.py` | 云端 AI 压缩（byted-mediakit-image，自动下载 24h 临时链接，超目标体积本地兜底重压） |
| `imgdark.py` | 白底截图暗色化（面板底色统一 `#0a2035`）：`python tools/imgdark.py <图> --preview` |
| `imgcheck.py` | 图片可读性体检（暗色化后检查文字还剩多少） |
| `check-image.js` / `copy_img.js` | 图床校对 / 同步到 starry-images 的辅助脚本 |

---

## 9. 构建、预览与部署

### 9.1 标准构建流程

```bash
npx hexo clean
npx hexo generate      # 产物 public/，约 659 files / 2s
npx hexo server        # http://localhost:4000（日常建议 npm run dev）
```

### 9.2 发布前自检

- [ ] `hexo clean && hexo generate` 无 ERROR
- [ ] 产物里搜 `@@CDN@@` 应为 0（占位符没被替换就是过滤器没跑）
- [ ] 首页、`/archives/`、`/tags/`、`/search/`、`/fun/`、`/music/`、任取一篇长文、`/phone/` 都能打开
- [ ] 任意分辨率无横向滚动条
- [ ] 星空粒子层可见（没有被滤镜吃掉）

### 9.3 部署

```bash
hexo deploy      # 推到 wu4yong.github.io 的 gh-pages
```

- 首次需 `ssh -T git@github.com` 验证 key。
- 线上不更新：确认 `deploy.branch` 与 Pages 源分支一致。
- 源码仓库有双远端：`github`（wu4yong/starry-blog）与 `gitee`（wu4yong/starry-blog），推送时两个都推。

> **`.nojekyll` 已移除**（2026-11 音乐页改造时删掉）。当前 `public/` 产物里没有下划线开头的目录 / 文件，GitHub Pages 跑 Jekyll 也不会吞资源。若未来产物里出现 `_` 开头的资源被 404，把空的 `.nojekyll` 加回 `source/` 即可。

---

## 10. 开发约定与禁区

### 10.1 文件头注释（硬性）

主题下所有 `.njk` / `.css` / `.js` 必须带统一注释块：

```
============================================
文件：<相对路径>
适用终端：电脑端 / 手机端 / 双端
作用：<一句话说明职责>
依赖：<样式/脚本/组件>
最后修改：YYYY-MM-DD
============================================
```

非直觉的 CSS 规则、每个事件绑定，都要在原地写明「为什么这么写」。
此外每个 CSS 文件的**每条规则上方**都有一行 `/* 作用：… */`，新增规则时照同样格式补一行。

### 10.2 排版与视觉约定

- 星空底与天体控件不可被遮挡；控件不做硬边框。
- 公告文案锁定原文（欢迎语 + 5 条清单），不改写。
- 标题不倾斜；打字机只跑一次；不用图片字形当字体。
- 动画只在首次打开/刷新播放，回访直接终态。
- 任何分辨率下不允许出现横向滚动条，页面完全贴满，不加宽度上限。
- 阅读器开合用 PPT 式转场，关闭是同一效果的逆播。

### 10.3 技术禁区

| 禁区 | 原因 |
| --- | --- |
| 页面根容器上用 `backdrop-filter` 或 `filter: blur/drop-shadow` | 破坏固定定位 canvas 的合成，粒子整块消失且无报错 |
| `#particles` 写负 z-index | 负层级画在父背景之下，body 一有不透明底色就整层不可见 |
| 图片字形 + `clip-path` 做打字机 | Chrome 按未缩放盒计算，出现青紫大矩形 |
| 一个动画既写 CSS `animation` 又被脚本触发 | 表现像跑了两遍，实际是两套叠加 |
| 面板里给元素 `position: fixed` 求「全屏」 | 被祖先 `overflow:hidden` 裁住，需搬节点到 body 并补不透明底色 |
| 把粒子库 / 字体 / 播放器 / mermaid 改回 CDN | 断网或 CDN 故障时静默失效（jsDelivr 已实测阵亡） |
| 用 `hexo server` 判定线上行为 | 本机可能挂死，改用 `public/` + 静态服务器验证 |
| 只改 `.pc-hero-art` 的 `object-position` / `height`，不同步改流光层 mask | `contain` 两套框错位，画出第二个人轮廓 |
| 缩图时给伪元素写 `inset: 6% 0 0 0` | 图是顶部对齐，要让的是底部 `inset: 0 0 6% 0` |
| `transform: scaleX(-1)` 翻转人物 | 绕框中心翻，图区会跑到左边，流光层不跟随 |
| 用负 `left` 给人物做位移 | 整列被左推，左肩贴上雷达圆 |
| 在 `tags.css` 里再定义 `@keyframes logScan` | 与 `starmap-live.css` 方向冲突，统一由后者控制 |
| `pc-home.css` 重复定义 `@keyframes pc-float` | 后定义覆盖前定义；全文件只允许一处，且不加 `scaleX` 否则 mask 失效 |
| 新增同步外链 `<script>`（不带 `defer` / `async`） | 阻塞 HTML 解析，网络抖动时整页脚本饿死（见 5.4.1 第 0 步） |

### 10.4 编码与换行

- 所有文本文件 UTF-8 无 BOM，换行 LF。
- `source/_posts` 下 `aicoding/` 等目录原本就是纯 LF，编辑时保持原状。

---

## 11. 故障排查

### 11.1 构建

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| `hexo generate` 有 ERROR 但页面能开 | 某页渲染失败被跳过 | 按日志里的文件路径定位，先 `node --check` 校验 JS |
| 改了 CSS/JS 页面没变化 | 主题资源是构建复制出来的外链 | `hexo clean` 后重新生成，浏览器硬刷新；线上还要顶 `?v=` 版本号 |
| 产物里出现 `/archives|categories/page/2..n/` | 归档 / 分类生成器还在分页 | 把两个 `per_page` 置 0（首页 `/page/2..n/` 是正常分页，别误杀） |
| 产物里出现 `%E5%A4%A7...` 目录 | 生成器里预编码了目录名 | 目录用原始名，链接处再编码 |
| `DEP0170 DeprecationWarning: The URL http://... is invalid` | 文章正文里的裸 URL 被 marked 当链接解析 | 属正常提示，不影响构建；需要静默就把该行 URL 包成反引号 |

### 11.2 路由与链接

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 手机端点标签 404 | 百分号目录 | 修 `phone-routes.js` 路径写法 |
| 手机端某页空白 | `layout` 名写错或模板缺失 | 对齐 `phone-routes.js` 与实际文件名 |
| 改目录名后旧链接打不开 | `:title` 含目录路径 | 恢复目录名，或给文章写显式 `permalink` |
| 菜单点击 404 | 菜单路径与真实分类 slug 不符 | 核对 `MENU_ALIASES` |
| `/categories/` 只有空壳卡 | 该页只做入口，不列文章 | 正常，不是 bug |
| `fun/story/` 文章在 `/categories/story/` 找不到 | 这些文章分类写的是 `essay` | 走 `/categories/essay/`，别名见 7.2 |

### 11.3 图片与媒体

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 图片 404 | 放错目录（`source/img` 不存在） | 站点图挪 `source/images/`，主题图挪 `themes/butterfly/source/img/` |
| 图裂且源码里是 `@@CDN@@` | 过滤器没跑 | 确认 `scripts/image-cdn.js` 存在，`hexo clean` 后重建 |
| 刚推图床就 404 | GitHub Pages 部署 / CDN 缓存延迟几分钟 | 等待后强制刷新；**推图顺序固定「先图床 → 等生效 → 再推博客」** |
| 音视频播放失败 | front-matter 里写了 `@@CDN@@` | 头部不参与替换，改写完整 URL（见 5.2） |
| 首屏图很慢 | 图太大 / 走外链 | 转 webp、按渲染尺寸压、`loading="lazy"` |
| 人物图边上有方框或色块 | `mix-blend-mode: screen` 放大了有损噪点 | 提高编码质量或改用局部色阶更保守的图 |
| 深色面板里像白洞 | 白底截图未暗色化 | 跑 `tools/imgdark.py`，底色 `#0a2035` |
| mermaid 显示成代码块 | 库没加载（`file://` 打开、旧 server 进程、库被改路径） | 按 5.4.1 的排查顺序走，重点确认走的是 `localhost:4000` 且 server 是新起的 |
| mermaid 图挤成一团 | 该图语法有问题（多余 `end`、`subgraph` 标题含 `<br/>`） | 先本地 `hexo server` 重现，F12 Console 看 `[mermaid]` 警告 |
| mermaid 样式变了 | 浏览器用了缓存里的旧库 | 改三处 `?v=` 的版本数字，强制重新取库 |

### 11.4 动效与浮层

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 加浮层后整页发暗或星空消失 | `backdrop-filter` / `filter` 破坏 canvas 合成 | 去掉滤镜，用 `opacity` / `transform` |
| 关闭动画播一半元素就没了 | 隐藏定时器提前触发 | 播完离场动画再隐藏，并清理句柄 |
| 面板重开被上次关闭定时器吞掉 | `setTimeout` 未取消 | 打开时 `clearTimeout` |
| 打字/入场像跑两遍 | CSS 与脚本双触发 | 只留一处触发源 |
| 阅读器全屏溢出 | 祖先 `overflow:hidden` + 定位上下文 | 节点搬 body，补不透明底色 |

### 11.5 搜索与部署

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 搜索无结果 | `/search.json` 未生成或为空 | 检查 `searchdb` 配置，确认 `public/search.json` 体积正常（约 5.3 MB） |
| 新文章搜不到 | 索引是构建期产物 | 重新 `hexo generate` |
| 线上还是旧内容 | 产物没推 / 分支不对 | 核对 `deploy.branch`，重新 `hexo deploy` |
| `hexo deploy` 失败 | SSH key 未配置 | `ssh -T git@github.com` 验证 |
| 播放器整页不响 | APlayer.min.js 未先于 star-player.js 加载 | 核对 `_components/APlayer.njk` 的 defer 顺序 |

---

## 12. 维护清单

- [ ] **配套文档同步**：`主题样式与脚本说明.md`（仍按旧扁平结构编写）与 `图床与配图说明.md`（仍以 jsDelivr 为现状）落后于工程现状，重构主题或换图床后要同步更新。
- [ ] 正文里还留着少量被 HTML 注释掉的历史图，清理时别连注释一起删掉正文。
- [ ] 图床仓库全量 webp 化已完成；**推图顺序仍是「先图床 → 等 Pages 生效 → 再推博客」**，否则线上会先 404 一阵。
- [ ] 新加图片走占位符写法，不要写死域名；音视频走 `media/` 外链，不进仓库。
- [ ] 改完主题 CSS/JS 记得同步 `主题样式与脚本说明.md` 里的对应条目，并顶高对应 `?v=` 版本号。
- [ ] 加歌只改 `source/music/playlist.json`（+ 可选 `lyrics/<key>.lrc`），模板不用动。
- [ ] `_backup/` 已在 `.gitignore` 里，本地备份不会误入版本管理。
