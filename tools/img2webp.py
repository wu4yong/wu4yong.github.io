#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""本地批量转 WebP（纯 Pillow，不联网）。

用法示例：
    python scripts/img2webp.py source/images          # 转换目录，保留原图
    python scripts/img2webp.py a.png b.jpg --delete-original  # 转换并删掉原图
    python scripts/img2webp.py ./img --quality 88 --dry-run   # 只看会做什么

约定（本博客长期沿用）：
    - 只处理 png / jpg / jpeg，目标统一为同目录同名的 .webp
    - 默认 quality=92、method=6、exact，追求"肉眼无损 + 体积最优"
    - 单边超过 16383px 的图会等比缩到 16383（WebP 格式上限，超了会失败）
    - 默认保留原图，只有显式 --delete-original 才删
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit("缺少 Pillow：pip install pillow")

# WebP 单边像素上限，超过后编码器会直接报错
WEBP_MAX_SIDE = 16383
SOURCE_SUFFIXES = {".png", ".jpg", ".jpeg", ".webp"}

# 超长截图会触发 Pillow 的 DecompressionBomb 保护，这里明确关闭
Image.MAX_IMAGE_PIXELS = None


def human(nbytes: int) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if nbytes < 1024 or unit == "GB":
            return f"{nbytes:.1f} {unit}" if unit != "B" else f"{nbytes} B"
        nbytes /= 1024
    return f"{nbytes:.1f} GB"


def collect(paths: list[str], recursive: bool) -> list[Path]:
    """展开文件/目录参数，去重并按路径排序。"""
    found: dict[str, Path] = {}
    for raw in paths:
        p = Path(raw).expanduser()
        if p.is_file():
            if p.suffix.lower() in SOURCE_SUFFIXES:
                found[str(p.resolve())] = p
            else:
                print(f"跳过（不是 png/jpg/jpeg）：{p}")
        elif p.is_dir():
            it = p.rglob("*") if recursive else p.glob("*")
            for f in it:
                if f.is_file() and f.suffix.lower() in SOURCE_SUFFIXES:
                    found[str(f.resolve())] = f
        else:
            print(f"跳过（路径不存在）：{p}")
    return [found[k] for k in sorted(found)]


def prepare(im: Image.Image) -> Image.Image:
    """把各种奇特色彩模式收敛到 WebP 能正确处理的模式。"""
    if im.mode in ("RGBA", "RGB", "L"):
        return im
    if im.mode == "P":
        # 调色板图带透明度时转 RGBA，否则转 RGB，避免透明区域变黑
        return im.convert("RGBA" if "transparency" in im.info else "RGB")
    if im.mode in ("LA", "PA"):
        return im.convert("RGBA")
    if im.mode == "CMYK":
        return im.convert("RGB")
    return im.convert("RGBA" if im.has_transparency_data else "RGB")


def convert_one(src: Path, args: argparse.Namespace) -> tuple[int, int]:
    """转换单张图，返回 (原始字节, 产出字节)。失败抛异常。"""
    dst = src.with_suffix(".webp")
    in_place = dst.resolve() == src.resolve().with_suffix(".webp") and dst.exists()
    if dst.exists() and not in_place and not args.overwrite:
        raise FileExistsError(f"目标已存在：{dst.name}（用 --overwrite 覆盖）")
    if in_place and not args.overwrite:
        raise FileExistsError(f"{src.name} 本身就是 webp，重压请加 --overwrite")

    before = src.stat().st_size
    with Image.open(src) as im:
        im.load()
        orig_w, orig_h = im.size
        longest = max(orig_w, orig_h)

        # 目标长边：--max-side 优先，其次才是 WebP 的 16383 硬上限
        target = longest
        if args.max_side and args.max_side < longest:
            target = args.max_side
        if target > WEBP_MAX_SIDE:
            target = WEBP_MAX_SIDE

        if target != longest:
            scale = target / longest
            new_size = (max(1, int(orig_w * scale)), max(1, int(orig_h * scale)))
            im = im.resize(new_size, Image.LANCZOS)
            print(f"  · 尺寸 {orig_w}x{orig_h} → {new_size[0]}x{new_size[1]}")

        fixed = prepare(im)
        if args.alpha_blur and fixed.mode == "RGBA":
            # 只模糊 alpha：线稿 RGB 保持锐利，透明过渡本来就是渐变，肉眼几乎无差
            from PIL import ImageFilter
            r, g, b, a = fixed.split()
            fixed = Image.merge("RGBA", (r, g, b, a.filter(ImageFilter.GaussianBlur(args.alpha_blur))))
            print(f"  · alpha 通道模糊 {args.alpha_blur}px")

        kwargs = dict(quality=args.quality, method=args.method, exact=args.exact)
        if fixed.mode in ("RGBA", "LA"):
            kwargs["alpha_quality"] = args.alpha_quality
        if "icc_profile" in im.info:
            kwargs["icc_profile"] = im.info["icc_profile"]

        if args.dry_run:
            return before, before

        # 源本身就是 webp 时先写临时文件，避免边读边写同一个文件
        write_to = dst.with_suffix(".tmp.webp") if in_place else dst
        fixed.save(write_to, "WEBP", **kwargs)

    # 立刻回读校验，防止写出坏文件
    with Image.open(write_to) as check:
        check.load()
    after = write_to.stat().st_size
    if after <= 0:
        raise ValueError("产出文件为 0 字节")

    if in_place:
        if args.delete_original:
            write_to.replace(dst)
        else:
            write_to.replace(dst)
    elif args.delete_original:
        src.unlink()
    elif args.backup_dir:
        backup = Path(args.backup_dir).expanduser() / src.name
        backup.parent.mkdir(parents=True, exist_ok=True)
        if backup.exists():
            backup.unlink()
        src.replace(backup)

    return before, after


def main() -> int:
    ap = argparse.ArgumentParser(description="本地批量转 WebP（Pillow，不联网）")
    ap.add_argument("paths", nargs="+", help="图片文件或目录，可多个")
    ap.add_argument("--quality", type=int, default=92, help="质量 0-100，默认 92")
    ap.add_argument("--method", type=int, default=6, choices=range(0, 7), help="压缩演算 0-6，默认 6（最慢最小）")
    ap.add_argument("--exact", action="store_true", default=True, help="保留 RGB 值，默认开启")
    ap.add_argument("--no-exact", dest="exact", action="store_false", help="关闭 exact（体积更小，颜色略有偏移）")
    ap.add_argument("--max-side", type=int, help="把长边压到该像素数（等比缩放）")
    ap.add_argument("--alpha-quality", type=int, default=100, help="alpha 压缩质量 0-100，默认 100；带透明的大图降到 60 能省一半")
    ap.add_argument("--alpha-blur", type=float, default=0.0, help="只模糊 alpha 通道（线稿 RGB 不变），0.6~1.2 常见")
    ap.add_argument("-r", "--recursive", action="store_true", help="目录递归")
    ap.add_argument("--delete-original", action="store_true", help="转换成功后删除原图")
    ap.add_argument("--backup-dir", help="转换成功后把原图移到该目录（与 --delete-original 互斥）")
    ap.add_argument("--overwrite", action="store_true", help="允许覆盖已存在的 .webp")
    ap.add_argument("--dry-run", action="store_true", help="只列出待转换文件，不写盘")
    args = ap.parse_args()

    if args.delete_original and args.backup_dir:
        ap.error("--delete-original 与 --backup-dir 不能同时使用")

    targets = collect(args.paths, args.recursive)
    if not targets:
        print("没有找到需要处理的 png/jpg/jpeg 文件")
        return 0

    print(f"待处理 {len(targets)} 个文件"
          + ("（dry-run，不写盘）" if args.dry_run else "")
          + f"，quality={args.quality} method={args.method} exact={args.exact}\n")

    ok = fail = 0
    total_before = total_after = 0
    for i, src in enumerate(targets, 1):
        prefix = f"[{i}/{len(targets)}] {src}"
        try:
            before, after = convert_one(src, args)
        except FileExistsError as e:
            print(f"{prefix}\n  - {e}")
            fail += 1
            continue
        except Exception as e:  # 单张失败不影响整批
            print(f"{prefix}\n  ✗ 失败：{type(e).__name__}: {e}")
            fail += 1
            continue

        ok += 1
        total_before += before
        total_after += after
        if args.dry_run:
            print(f"{prefix}\n  → 将生成 {src.with_suffix('.webp').name}（{human(before)}）")
        else:
            saved = before - after
            pct = (saved / before * 100) if before else 0
            print(f"{prefix}\n  ✓ 生成 {src.with_suffix('.webp').name}：{human(before)} → {human(after)}"
                  f"，省 {human(saved)}（{pct:.1f}%）")

    print(f"\n完成：成功 {ok}，失败 {fail}")
    if ok and not args.dry_run:
        saved = total_before - total_after
        pct = (saved / total_before * 100) if total_before else 0
        print(f"合计 {human(total_before)} → {human(total_after)}，省 {human(saved)}（{pct:.1f}%）")
        if args.delete_original:
            print("原图已删除")
        elif args.backup_dir:
            print(f"原图已移到 {args.backup_dir}")
        else:
            print("原图仍保留（如需删除请加 --delete-original）")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
