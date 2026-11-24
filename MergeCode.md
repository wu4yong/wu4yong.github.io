## 🖼️ 图片资源与图床工作流
> ⚠️ **图片已全量迁移至独立图床仓库 `starry-images`，统一通过 jsDelivr CDN 分发。禁止再把图片放到 `source/assets/img`。**

### 1. 图片托管结构
图床仓库：`https://github.com/wu4yong/starry-images`
```text
starry-images/
└── assets/
    └── img/
        ├── banner/        # 章节头部 banner 背景图
        ├── mysql/         # 数据库类文章配图
        ├── netty/         # Netty 类文章配图
        └── ...            # 按分类建目录
```
CDN 访问前缀（固定）：
```text
https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main
```

### 2. 新增图片标准流程
**第一步：图片放入图床仓库**
按分类放入 `starry-images/assets/img/分类名/`，例如 `assets/img/mysql/`。

**第二步：提交推送图床仓库**
```bash
cd starry-images
git add .
git commit -m "add: 新增文章配图 xxx描述"
git push origin main
```

**第三步：等待 CDN 同步**
推送后 jsDelivr 会自动拉取，存在 5～10 分钟缓存延迟，刚推完访问 404 属正常现象，稍后刷新即可。

**第四步：文章内引用图片（统一样式）**
```html
<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/分类名/图片名.png" alt="图片说明"></div>
```
> ❌ 不要使用 `![alt](/assets/img/xxx.png)` 这种 Markdown 本地图片语法；
> ❌ 不要写 `/assets/img/...` 站内相对路径；
> ✅ 统一 `img-wrap-left` + `left-img` 结构 + 完整 CDN 链接，保证与现有页面样式一致。

### 3. CSS 中背景图引用
`themes/butterfly/layout/_css/post.css` 里章节 banner 背景图同样使用完整 CDN 地址：
```css
.essay-image1 {
  background-image: url("https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/banner/00-ChapterHeader-1-java-concurrency.png");
}
```
> 修改 css 后必须 `hexo clean` 再重新生成，否则旧静态资源仍在 `public/` 中生效。

### 4. 图片校验与维护
`tools/` 目录保留两个工具，用于日常巡检：
| 工具 | 作用 | 用法 |
| --- | --- | --- |
| `check-image.js` | 扫描全部文章，检测图片链接是否 404 | `cd tools && node check-image.js` |
| `copy_img.js` | 图片批量复制脚本 | 按需执行 |
| `missing_img_report.csv` | 缺失图片清单 | 记录 CDN 404 的图片，需补传图床或删除文章内失效标签 |

处理 404 图片两种方式：
1. **补图**：把缺失图片按原路径上传到 `starry-images` 对应目录；
2. **清理**：删除文章内该 `<img>` 标签，避免页面出现空图。

### 5. 本地原图备份策略
- `source/assets/img/` 仅作历史备份保留在本地磁盘，**已加入 `.gitignore`，不再提交 git**；
- 禁止手动删除该目录，线上稳定运行 1～2 个月、确认无遗漏后再考虑清理；
- 后续所有新图一律走上述图床流程。

## 🔧 自定义修改速查表
| 修改目标 | 文件位置 |
| --- | --- |
| PC 首页文案 / HUD / 导航按钮 | `layout/index.njk` |
| PC 首页视觉与分辨率断点 | `layout/pc/_css/pc-home.css` |
| 阅读器全屏、缩小、正文宽度 | `layout/_css/star-reader.css` + `_components/InplaceReader.njk` |
| 星迹索引矩阵排序 | `scripts/menu-order.js`（读 `_config.butterfly.yml` 的 `menu`） |
| 手机首页菜单文字、跳转链接 | `layout/phone/_components/home-content.njk` |
| 手机首页打字机文案 | `layout/phone/_js/home-typing.js` |
| 侧边栏头像、签名、链接 | `_components/Sidebar.njk` |
| 全站主色 / 星空变量 | `_css/common.css`（手机端同步 `phone/_css/common.css`） |
| 星空粒子参数 | `_components/Particles.njk`（手机端 `phone/_components/Particles.njk`） |
| 文章配图（含 banner 背景） | `starry-images` 图床仓库 + CDN 链接 |
| 双端分流规则 | `layout/index.njk` 与 `layout/phone/home.njk` 的 UA 判断 |

新增首页专区步骤：
1. 在 `layout/phone/_components/home-content.njk` 添加菜单按钮；
2. 在 `source/_posts/` 创建对应分类目录；
3. 在 `_config.yml` 的 `category_map` 中补充中文映射；
4. 若要让新分类在坐标矩阵里排到正确位置，在 `_config.butterfly.yml` 的 `menu` 里加子菜单。

## 🧾 命名与头部注释规范
| 约定 | 说明 |
| --- | --- |
| 目录分层 | `pc/` 只放电脑端首页相关、`phone/` 只放手机端、`_components/_css/_js` 放两端共用的电脑端资源 |
| 文件命名 | 页面模板用「页面名.njk」（`tags.njk`、`archive.njk`）；样式用「页面名.css」；脚本用「功能名.js」，不再用 `typing.js` 这类泛名 |
| 组件命名 | 组件用大驼峰（`InplaceReader.njk`），手机端组件用小写短横线（`home-content.njk`） |
| 头部注释 | 每个 `.njk` / `.css` / `.js` 文件首行起必须有注释块：文件路径、适用终端、页面描述/作用、依赖组件与样式、最后修改日期 |
| 依赖声明 | 模板头部写清 include 了哪些 css/js，改样式前先看头部，避免改错副本 |
## ⚙️ 核心配置说明
两份配置文件职责分离：
| 配置文件 | 职责 | 主要维护内容 |
| --- | --- | --- |
| `_config.yml` | Hexo 全局配置 | 站点信息、URL、渲染器、分类/标签中文映射、搜索、部署 |
| `_config.butterfly.yml` | Butterfly 主题配置 | 导航菜单、粒子、深色模式、背景色、mermaid、inject 注入 |

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
git commit -m "update project"
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

### 1条命令合并
```bash
git checkout master && git merge --ff-only develop && git push gitee master && git push github master && git checkout develop
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
| 文章图片 404 / 显示本地路径 | 确认引用为 `cdn.jsdelivr.net/gh/wu4yong/starry-images@main/...` 完整 CDN 链接 |
| 图片刚推送图床就 404 | jsDelivr 缓存延迟，等待 5～10 分钟后强制刷新 |
| 文章 banner 背景图不更新 | 修改 `post.css` 后执行 `hexo clean && hexo g`，清掉 `public/` 旧样式 |
| CSS 里还有 `/assets/img/` 本地路径 | 全局搜索 `url("/assets/img`，逐一替换为完整 CDN 地址 |
| 图片链接改完但页面仍是旧图 | `git status` 确认 `source/assets/img` 已不再被 git 追踪 |
---

**推荐每次就用这条（PowerShell，可直接粘）**：
Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
Set-Location "E:\devSoft\Microsoft VS Code\workspace2026\starry-blog"
npx hexo server

第一行先把占着 4000 的旧进程杀掉，保证新 server 一定落在 4000。

**什么时候才需要 clean + generate + deploy**
只有要发布到线上（`wu4yong.github.io`）时：

$env:Path = "E:\Git\cmd;" + $env:Path
Set-Location "E:\devSoft\Microsoft VS Code\workspace2026\starry-blog"
npx hexo clean; npx hexo generate; npx hexo deploy

```
npx kill-port 4000
```
**最后更新：2026-11-11**
