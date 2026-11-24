#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
============================================
图片可读性体检（暗色化之后，检查文字还剩多少）
文件：tools/imgcheck.py
作用：扫一遍图片目录，用「局部对比度」判断深底上文字还能不能看清 ——
      文字可辨靠的是「一块区域内字与底的明暗差」，不是全局亮像素占比。
      所以核心指标是分块 p95-p05 的对比度；全局 ink 只作辅助参考。
用法：
  python tools/imgcheck.py <目录> -r                             # 体检，出 imgcheck_<时间>.csv
  python tools/imgcheck.py <目录> -r --orig <原图目录>            # 同时对比原图，标出「原图清楚、处理后糊了」
  python tools/imgcheck.py <图片>                                # 单张打印分数
  python tools/imgcheck.py <图片> --orig <原图>                   # 单张带对比
判定（按块内对比度 loc 与「相对原图的保持率 keep」）：
  OK        loc >= 40 且 keep >= 0.55        文字清楚
  WARN      loc 15~40 或 keep 0.35~0.55      偏暗 / 大面积空白页，小字吃力
  BAD       loc < 15 或 keep < 0.35          一片暗、对比被压平，文字看不清
指标口径（都先把长边缩到 400px，所有人用同一把尺）：
  loc   8×8 网格切块，每块算灰度 p95-p05，取第 95 百分位（画面里最清楚的那批块；
        截图类图片大面积是纯背景，取 80 分位会被背景块拉平而误判）
  std   整图灰度标准差（一片暗时很低）
  ink   L>110 的像素占比（辅助，细字本来就低，别单看这个）
  keep  loc(处理后) / loc(原图)，衡量「原有对比度保住了几成」
最后修改：2026-11-12
============================================
"""
import os
import sys
import csv
import argparse
import datetime

import numpy as np
from PIL import Image

EXTS = (".webp", ".jpg", ".jpeg", ".png")


def luma(a):
    return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]


def metrics(img, max_side=400, grid=8):
    w, h = img.size
    if max(w, h) > max_side:
        s = max_side / float(max(w, max(h, 1)))
        img = img.resize((max(grid, int(w * s)), max(grid, int(h * s))), Image.LANCZOS)
    a = np.asarray(img.convert("RGB"), dtype=np.float32)
    L = luma(a)

    std = float(L.std())
    ink = float((L > 110).mean()) * 100

    # 分块局部对比度：每块 p95-p05，取 95 分位 —— 即「画面里最清楚的那批块」。
    # 不用 80 分位：截图类图片大面积是纯背景（后台页面、画布空白），
    # 内容只占少数块，80 分位会被背景块拉平，把「文字其实很清楚」的图误判成 BAD。
    hh, ww = L.shape
    blocks = []
    for gy in range(grid):
        for gx in range(grid):
            y0, y1 = int(hh * gy / grid), int(hh * (gy + 1) / grid)
            x0, x1 = int(ww * gx / grid), int(ww * (gx + 1) / grid)
            if y1 <= y0 or x1 <= x0:
                continue
            b = L[y0:y1, x0:x1]
            blocks.append(float(np.percentile(b, 95) - np.percentile(b, 5)))
    loc = float(np.percentile(blocks, 95)) if blocks else 0.0

    return dict(loc=round(loc, 1), std=round(std, 1), ink=round(ink, 2), px=w * h)


def grade(m, keep=None):
    # loc 门槛偏松：截图类图片大面积是纯背景，内容只占少数块，
    # loc 被背景拉低不代表字看不清（20 上下但目视清晰是常态）。
    # 真正「整张糊平」的图 loc 会掉到 10 以内，所以 BAD 线定在 15。
    if keep is not None and keep < 0.35:
        return "BAD"
    if m["loc"] < 15:
        return "BAD"
    if keep is not None and keep < 0.55:
        return "WARN"
    if m["loc"] < 40:
        return "WARN"
    return "OK"


def scan_one(path, orig_path=None):
    m = metrics(Image.open(path))
    keep = None
    if orig_path and os.path.exists(orig_path):
        o = metrics(Image.open(orig_path))
        keep = round(m["loc"] / o["loc"], 2) if o["loc"] > 1 else None
        m["orig_loc"] = o["loc"]
        m["orig_std"] = o["std"]
    else:
        m["orig_loc"] = ""
        m["orig_std"] = ""
    m["keep"] = keep if keep is not None else ""
    m["grade"] = grade(m, keep)
    return m


def main():
    ap = argparse.ArgumentParser(description="图片可读性体检（局部对比度口径）")
    ap.add_argument("target")
    ap.add_argument("--recursive", "-r", action="store_true")
    ap.add_argument("--orig", default="", help="原图目录（结构一致），用于算对比度保持率")
    ap.add_argument("--min-px", type=int, default=40000, help="跳过太小的图")
    args = ap.parse_args()

    target = os.path.abspath(args.target)
    if os.path.isfile(target):
        m = scan_one(target, args.orig or None)
        print("  局部对比度 %.1f | std %.1f | ink %.2f%%%s -> %s"
              % (m["loc"], m["std"], m["ink"],
                 (" | 原图 %.1f 保持 %s" % (m["orig_loc"], m["keep"])) if m["orig_loc"] != "" else "",
                 m["grade"]))
        return

    rows = []
    for dirpath, dirnames, filenames in os.walk(target):
        if not args.recursive:
            dirnames[:] = []
        for fn in filenames:
            if os.path.splitext(fn)[1].lower() not in EXTS:
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, target)
            if os.path.getsize(full) < 8 * 1024:
                continue
            try:
                op = os.path.join(args.orig, rel) if args.orig else None
                m = scan_one(full, op)
            except Exception:
                continue
            if m["px"] < args.min_px:
                continue
            m["path"] = rel.replace("\\", "/")
            rows.append(m)

    order = {"BAD": 0, "WARN": 1, "OK": 2}
    rows.sort(key=lambda r: (order[r["grade"]], r["loc"] if r["grade"] == "BAD" else 999))

    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    out = "imgcheck_%s.csv" % ts
    with open(out, "w", newline="", encoding="utf-8-sig") as f:
        wr = csv.writer(f)
        wr.writerow(["判定", "局部对比度", "std", "ink%", "原图对比度", "保持率", "路径"])
        for r in rows:
            wr.writerow([r["grade"], r["loc"], r["std"], r["ink"], r["orig_loc"], r["keep"], r["path"]])

    bad = [r for r in rows if r["grade"] == "BAD"]
    warn = [r for r in rows if r["grade"] == "WARN"]
    print("\n总 %d 张 | BAD %d | WARN %d | OK %d"
          % (len(rows), len(bad), len(warn), len(rows) - len(bad) - len(warn)))
    if bad:
        print("\n最该修的 20 张：")
        for r in bad[:20]:
            print("  对比度 %5.1f | 保持 %s | ink %5.2f%% | %s"
                  % (r["loc"], str(r["keep"]), r["ink"], r["path"]))
    print("\n清单: %s" % os.path.abspath(out))


if __name__ == "__main__":
    main()
