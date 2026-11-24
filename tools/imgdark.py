#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
============================================
白底截图暗色化脚本（把白底图改成深色面板底）
文件：tools/imgdark.py
作用：把「白底/浅灰底」的截图改成与站点面板同色 #0a2035 的深底，使图片嵌进深色面板时不再像一块
      白洞。彩色元素（按钮、流程框、状态标签）保留原色相，只做轻微压暗。
用法：
  # 单张（覆盖原文件，先自动备份到同目录 .bak）
  python tools/imgdark.py <图片路径> [--force]
  # 整个目录（只处理判定为白底的图，非白底自动跳过）
  python tools/imgdark.py <目录> --recursive
  # 预览（不写盘，输出到 <同名>.dark.webp 便于比对）
  python tools/imgdark.py <图片路径> --preview
算法（顺序不能变）：
  1. 白点归一化：取图片四边条带里灰阶像素（s<0.16）的亮度中位 ev，ev>=0.85（白/浅灰底）
     时把整图 v 归一化到 v/ev，保证浅灰底（#f5f5f5 之类）也能精确落到面板色；
  2. 灰度反相 + 提亮：v' = ((1-v) ** 0.45) * 1.15 —— 白底→0、深色字→接近 1；
  3. 彩色保留：s>0.16 的像素走 v'=0.85v+0.03、s×1.05，不改色相；
  4. 叠面板底色：out = out + BG*(1-out/255)，纯黑部分正好变成 #0a2035；
  5. UnsharpMask(1.4, 70, 2)：截图缩过之后文字边缘发糊，靠这一步把笔画做实；
  6. 存 webp quality=80 method=6（暗色化后比原图小，见 README 8.6）。
面板底色 BG 必须和 post.css 里 p:has(> img:only-child) 的 background 保持一致，
否则图的边缘会和面板差一档，出现淡色矩形。
最后修改：2026-11-12
============================================
"""
import os
import sys
import argparse

import numpy as np
from PIL import Image, ImageFile, ImageFilter

ImageFile.LOAD_TRUNCATED_IMAGES = True

BG = np.array([10, 32, 53], dtype=np.float32)   # #0a2035 = post.css 里的图片面板底色
MAX_PX = 6_000_000                              # 超过这个像素数的图分块处理，避免吃满内存
G_GRAY, V_STRETCH = 0.45, 1.15                  # 灰阶层：反相后的 gamma 与亮部拉伸
G_COL, SAT = 0.85, 1.05                         # 彩色层：压暗系数与饱和提升
SH_R, SH_P = 1.4, 45                            # UnsharpMask(radius, percent)
WHITE_MIN, WHITE_MED = 232, 0.85                # 白底判定：边缘条带亮度中位 >=232
EXCLUDE_NAME = ("qr", "pay", "donate", "avatar", "logo", "icon", "banner", "hero")
SKIP_DIRS = ("about",)


def rgb2hsv(a):
    return np.asarray(
        Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGB").convert("HSV"),
        dtype=np.float32,
    ) / 255.0


def hsv2rgb(h, s, v):
    return np.asarray(
        Image.fromarray(np.clip(np.stack([h * 255, s * 255, v * 255], -1), 0, 255).astype(np.uint8), "HSV").convert("RGB"),
        dtype=np.float32,
    )


def edge_stats(v, s):
    """返回 (灰阶边缘亮度中位, 边缘亮度中位0-255)"""
    h, w = v.shape
    band = max(4, min(h, w) // 60)
    ve = np.concatenate([v[:band].ravel(), v[-band:].ravel(), v[:, :band].ravel(), v[:, -band:].ravel()])
    se = np.concatenate([s[:band].ravel(), s[-band:].ravel(), s[:, :band].ravel(), s[:, -band:].ravel()])
    ge = ve[se < 0.16]
    gm = float(np.median(ge)) if ge.size > 20 else 0.0
    return gm, gm * 255.0


def darkify(im):
    a = np.asarray(im.convert("RGB"), dtype=np.float32)
    hsv = rgb2hsv(a)
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    color = s > 0.16                         # 带色相的像素（含 #1f2937 这类灰字，s≈0.44）
    _, ev255 = edge_stats(v, s)
    if ev255 >= WHITE_MIN:                   # 白点归一化：浅灰底也拉到纯白再反相
        ev = min(1.0, ev255 / 255.0)
        if ev >= WHITE_MED:
            v = np.clip(v / ev, 0.0, 1.0)
    vg = np.clip(((1.0 - v) ** G_GRAY) * V_STRETCH, 0.0, 1.0)
    # 彩色像素的亮度不能直接沿用原值（浅色卡片会变成亮块），也不能一律压暗（深灰字会只剩空心态）。
    # 折中：反相为主 + 饱和度补光 —— 浅色低饱和 → 略亮于面板（结构可见）；
    #       深色文字 → 明显发亮（实心）；饱和色（按钮/箭头/标签）→ 亮度由 s 补足，色相保留。
    vn = np.where(color, 0.10 + (1.0 - v) * 0.55 + s * 0.35, vg)
    sn = np.where(color, np.minimum(1.0, s * SAT), 0.0)
    out = hsv2rgb(h, sn, vn)
    out = out + BG[None, None, :] * (1.0 - out / 255.0)
    res = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGB")
    return res.filter(ImageFilter.UnsharpMask(radius=SH_R, percent=SH_P, threshold=2))


def darkify_any(im):
    w, h = im.size
    if w * h <= MAX_PX:
        return darkify(im)
    out = Image.new("RGB", (w, h))
    step = max(1, MAX_PX // max(1, w))
    ov = 8                                     # overlap：分块边界前后各多算 8px，避免锐化断层
    for y in range(0, h, step):
        y0 = max(0, y - ov)
        y1 = min(h, y + step + ov)
        piece = darkify(im.crop((0, y0, w, y1)))
        top = y - y0
        bottom_cut = (y1 - (y + step)) if (y + step) < y1 else 0
        piece = piece.crop((0, top, w, piece.height - bottom_cut)) if bottom_cut else piece.crop((0, top, w, piece.height))
        out.paste(piece, (0, y))
    return out


def is_white_bg(im):
    """四边条带亮度中位 >=232 判为白底"""
    a = np.asarray(im.convert("RGB"), dtype=np.float32)
    hsv = rgb2hsv(a)
    _, ev255 = edge_stats(hsv[..., 2], hsv[..., 1])
    return ev255 >= WHITE_MIN


def skipped_by_name(path):
    low = path.lower()
    return any(k in low for k in EXCLUDE_NAME)


def save_like(src_path, res, preview):
    ext = os.path.splitext(src_path)[1].lower()
    if preview:
        dst = os.path.splitext(src_path)[0] + ".dark.webp"
        res.save(dst, "WEBP", quality=80, method=4)
        return dst
    if ext == ".webp":
        res.save(src_path, "WEBP", quality=80, method=6)
    elif ext in (".jpg", ".jpeg"):
        res.save(src_path, "JPEG", quality=80, subsampling=0, optimize=True)
    elif ext == ".png":
        res.save(src_path, "PNG", optimize=True)
    else:
        dst = os.path.splitext(src_path)[0] + ".webp"
        res.save(dst, "WEBP", quality=80, method=6)
        return dst
    return src_path


def run_one(src_path, force=False, preview=False):
    im = Image.open(src_path)
    if im.mode == "RGBA" and not force:
        print("  跳过（带透明通道）: " + src_path)
        return None
    im = im.convert("RGB")
    if min(im.size) < 120 and not force:
        print("  跳过（尺寸过小）: " + src_path)
        return None
    if not force and not preview and not is_white_bg(im):
        print("  跳过（本身不是白底）: " + src_path)
        return None
    res = darkify_any(im)
    dst = save_like(src_path, res, preview)
    print("  完成: %s  (%.1f KB -> %.1f KB)" % (dst, os.path.getsize(src_path) / 1024, os.path.getsize(dst) / 1024))
    return dst


def main():
    ap = argparse.ArgumentParser(description="白底截图暗色化（面板底 #0a2035）")
    ap.add_argument("target", help="图片文件或目录")
    ap.add_argument("--recursive", "-r", action="store_true", help="递归处理目录")
    ap.add_argument("--force", "-f", action="store_true", help="不做白底判定，强制处理（含带 alpha 的图）")
    ap.add_argument("--preview", "-p", action="store_true", help="只输出 <name>.dark.webp，不覆盖原图")
    args = ap.parse_args()

    target = os.path.abspath(args.target)
    if not os.path.exists(target):
        print("路径不存在: " + target)
        sys.exit(2)

    if os.path.isfile(target):
        run_one(target, args.force, args.preview)
        return

    ok = skip = 0
    for dirpath, dirnames, filenames in os.walk(target):
        if not args.recursive:
            dirnames[:] = []
        rel = os.path.relpath(dirpath, target)
        if any(part in SKIP_DIRS for part in rel.split(os.sep)):
            dirnames[:] = []
            continue
        for fn in filenames:
            if os.path.splitext(fn)[1].lower() not in (".webp", ".jpg", ".jpeg", ".png"):
                continue
            full = os.path.join(dirpath, fn)
            if skipped_by_name(full):
                skip += 1
                continue
            try:
                if run_one(full, args.force, args.preview):
                    ok += 1
                else:
                    skip += 1
            except Exception as e:
                print("  失败: %s :: %s" % (full, str(e)[:60]))
    print("\n完成 %d 张，跳过 %d 张" % (ok, skip))


if __name__ == "__main__":
    main()
