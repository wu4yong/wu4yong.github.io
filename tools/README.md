# tools —— 非构建期脚本（图片处理）

放在 `tools/` 而不是 `scripts/` 的原因：`scripts/` 是 Hexo 保留目录，里面的任何文件都会被当成 Node 脚本加载（Python 文件进去会直接 `SyntaxError: Invalid or unexpected token`，`hexo s` 启动失败）。`tools/` 不被 Hexo 扫描，安全。

两个脚本，解决两件事：**本地转 WebP**（不联网、体积最优）和 **云端压缩**（质量优先、可指定体积上限）。

都依赖 Pillow：

```bash
pip install pillow
```

---

## 1. `img2webp.py` —— 本地批量转 WebP

纯 Pillow，不联网，不走 CDN。写法和本博客一直沿用的一致：`quality=92, method=6, exact=True`。

```bash
# 转换整个目录（保留原图）
python tools/img2webp.py source/images

# 转换并删除原图（就是"只用 webp、删原图"的做法）
python tools/img2webp.py source/images --delete-original

# 原图不删，移到备份目录（不参与部署）
python tools/img2webp.py source/images --backup-dir _backup/img

# 递归 + 先看会做什么
python tools/img2webp.py ./img -r --dry-run

# 更激进的体积（颜色可能轻微偏移）
python tools/img2webp.py a.png --quality 85 --no-exact
```

| 参数 | 默认 | 说明 |
|---|---|---|
| `--quality` | 92 | 0-100，越低越小 |
| `--method` | 6 | 压缩演算 0-6，6 最慢但最小 |
| `--no-exact` | 关 | 关闭 exact，体积更小但颜色可能偏 |
| `--max-side` | — | 把长边压到该像素数（等比缩放） |
| `--alpha-quality` | 100 | alpha 压缩质量 0-100，带透明的大图降到 60 常省一半 |
| `--alpha-blur` | 0 | 只模糊 alpha 通道（线稿 RGB 保持锐利），0.6~1.2 常见 |
| `-r / --recursive` | 关 | 目录递归 |
| `--delete-original` | 关 | 成功后删原图 |
| `--backup-dir` | — | 成功后把原图移到该目录（与上一项互斥） |
| `--overwrite` | 关 | 允许覆盖已存在的 `.webp`；源本身就是 `.webp` 时也必须加它才会就地重压 |
| `--dry-run` | 关 | 只列出，不写盘 |

> **带透明通道的大图为什么体积下不来**：这张首页主视觉 73.6% 是全透明，alpha 通道就是体积大头。只压 RGB 没用，要同时动 alpha：

```bash
# 首页主视觉实测 1,277.8 KB → 197.4 KB（84.6%）
python tools/img2webp.py themes/butterfly/source/img/pc-hero-glow.webp \
  --max-side 1120 --quality 70 --alpha-quality 60 --alpha-blur 1.2 --overwrite
```


内置保护：

- 单边超过 **16383 px** 的图会等比缩到 16383（WebP 格式硬上限，超了编码器直接报错）；
- `P`/`LA`/`CMYK`/16 位等模式会先收敛到 RGBA/RGB，避免透明区域变黑；
- 目标 `.webp` 已存在时默认跳过，不覆盖别人的图；
- 写完立刻回读校验，坏文件当场暴露。

---

## 2. `img_mediakit_compress.py` —— 云端压缩（byted-mediakit-image）

调用 `mediakit-cli image compress-image`，**并立刻把 24 小时临时链接下载落盘**——不下载等于没做，这是脚本存在的主要意义。

```bash
# 质量优先（默认 quality=82）
python tools/img_mediakit_compress.py hero.webp

# 指定体积上限
python tools/img_mediakit_compress.py hero.webp --max-size 200k

# 想真正压到 200KB，先把长边降下来再算
python tools/img_mediakit_compress.py hero.webp --max-side 1200 --max-size 200k

# 批量 + 递归 + 直接覆盖源文件（覆盖前先 commit）
python tools/img_mediakit_compress.py ./img -r --max-size 200k --replace

# 只预览
python tools/img_mediakit_compress.py ./img -r --dry-run
```

| 参数 | 默认 | 说明 |
|---|---|---|
| `--max-size` | — | 目标体积，支持 `200k` / `1.5MB` / 字节数；优先于 `--quality` |
| `--quality` | 82 | 1-100，仅在未给 `--max-size` 时生效 |
| `--format` | webp | webp / jpeg / png / avif / heic |
| `--max-side` | — | 上传前把长边压到该像素（想命中体积目标基本都需要） |
| `--out-dir` | 同目录 | 输出目录 |
| `--replace` | 关 | 直接覆盖源文件 |
| `--delete-original` | 关 | 输出名与源不同时删除源 |
| `--overwrite` | 关 | 允许覆盖已存在输出 |
| `--auto-resize` | 关 | 超 10000px 时先本地等比缩小 |
| `--retries` | 3 | 单张调用/下载重试次数 |
| `--cli` | — | mediakit-cli 路径，也可用环境变量 `MEDIAKIT_CLI` |

输出命名：

- 源是 `png/jpg/jpeg` → 输出同目录 `xxx.webp`
- 源是 `webp` → 输出 `xxx.min.webp`（避免覆盖原图），除非加 `--replace`

### 实测过的两个坑

1. **`--max-size` 是"尽量满足"，不是保证**。实测 1672×2508 带透明通道的 webp 目标 200 KB，服务端只给到 1.1 MB。所以脚本内置了**本地兜底**：云端结果仍超目标时，先按 quality 88→52 逐级重压，还不行再按 85% 递减尺寸，直到达标（会在日志里打 `· 本地兜底：…`）。追求画质时请用 `--max-side` 指定真实显示尺寸，别只靠兜底硬压。
2. **临时链接 24 小时后失效**。脚本下载完会回读校验并打印真实尺寸与体积，落盘的就是最终文件。

### 输入限制（官方）

单张 ≤ 35 MB，宽高各 ≤ 10000 px（超过脚本会提示加 `--max-side` / `--auto-resize`）；不支持动图。

---

## 该用哪个

| 场景 | 用哪个 |
|---|---|
| png/jpg 批量换 webp，追求"肉眼无损 + 小体积" | `img2webp.py` |
| 已有图片质量一般，想用 AI 修复毛刺/噪点并瘦身 | `img_mediakit_compress.py`（不加 `--max-size`） |
| 首屏图必须压到某个 KB 数以内 | `img_mediakit_compress.py --max-side <显示尺寸> --max-size 200k` |
| 只想改文章里的图、不碰原图 | `img2webp.py --backup-dir _backup/img` |

> 别把大图都塞进博客仓库：`.git` 已经从 856 MB 瘦到 42.7 MB，本地图片只用于首屏那几张（banner / 人物 / 二维码 / 404），其余仍走图床 CDN。
