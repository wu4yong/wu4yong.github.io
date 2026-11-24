#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""用 byted-mediakit-image（mediakit-cli）在云端压缩图片，并立即把结果存到本地。

为什么需要这个脚本：mediakit-cli 返回的是 24 小时有效的临时 URL，
不下载等于没做；这个脚本负责"调用 → 下载 → 校验体积 → 落盘"的完整闭环。

用法示例：
    python scripts/img_mediakit_compress.py source/images
    python scripts/img_mediakit_compress.py hero.webp --max-size 200k
    python scripts/img_mediakit_compress.py hero.webp --quality 80 --replace
    python scripts/img_mediakit_compress.py ./img -r --max-size 200k --delete-original

依赖：
    pip install pillow
    mediakit-cli 在 PATH 中（或用 --cli / 环境变量 MEDIAKIT_CLI 指定路径）

注意：CLI 的 --max-size 是"尽量满足"，实测目标 200 KB 时可能返回 832 KB，
所以脚本会把实际结果和目标比对并明确告诉你有没有达标。
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.request
from pathlib import Path

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit("缺少 Pillow：pip install pillow")

Image.MAX_IMAGE_PIXELS = None

SOURCE_SUFFIXES = {".png", ".jpg", ".jpeg", ".webp"}
MAX_INPUT_BYTES = 35 * 1024 * 1024   # 官方建议单张 ≤35 MB
MAX_INPUT_SIDE = 10000               # 官方限制宽高各 ≤10000 px


def human(n: float) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024 or unit == "GB":
            return f"{n:.1f} {unit}" if unit != "B" else f"{int(n)} B"
        n /= 1024
    return f"{n:.1f} GB"


def parse_size(text: str) -> int:
    """把 200k / 200KB / 1.5MB / 2097152 统一成字节数。"""
    t = text.strip().lower().replace(" ", "")
    mult = 1
    for suffix, m in (("kb", 1024), ("k", 1024), ("mb", 1024 ** 2), ("m", 1024 ** 2), ("b", 1)):
        if t.endswith(suffix):
            mult = m
            t = t[: -len(suffix)]
            break
    try:
        return max(1, int(float(t) * mult))
    except ValueError:
        sys.exit(f"无法解析体积：{text}（示例：200k / 200KB / 1.5MB / 2097152）")


def find_cli(explicit: str | None) -> str:
    for cand in (explicit, os.environ.get("MEDIAKIT_CLI"), shutil.which("mediakit-cli")):
        if cand and Path(cand).exists():
            return str(cand)
    sys.exit("找不到 mediakit-cli：请确认已安装，或用 --cli 指定可执行文件路径，或设置环境变量 MEDIAKIT_CLI")


def collect(paths: list[str], recursive: bool) -> list[Path]:
    found: dict[str, Path] = {}
    for raw in paths:
        p = Path(raw).expanduser()
        if p.is_file():
            if p.suffix.lower() in SOURCE_SUFFIXES:
                found[str(p.resolve())] = p
        elif p.is_dir():
            it = p.rglob("*") if recursive else p.glob("*")
            for f in it:
                if f.is_file() and f.suffix.lower() in SOURCE_SUFFIXES:
                    found[str(f.resolve())] = f
        else:
            print(f"跳过（路径不存在）：{p}")
    return [found[k] for k in sorted(found)]


def prepare_input(src: Path, auto_resize: bool, max_side: int | None) -> tuple[Path, Path | None]:
    """上传前的本地前置处理，返回 (实际上传文件, 需要清理的临时文件)。

    两件事：
      1. 官方硬限制（≤35 MB、宽高各 ≤10000 px）超了就等比缩；
      2. --max-side 指定的目标长边（想真正压到 200 KB，通常得先把尺寸降下来）。
    """
    tmpfile: Path | None = None
    if src.stat().st_size > MAX_INPUT_BYTES:
        sys.exit(f"{src.name} 超过 35 MB，请先用 img2webp.py 或 Pillow 压一次")

    with Image.open(src) as im:
        w, h = im.size

    longest = max(w, h)
    target = longest
    if max_side and longest > max_side:
        target = max_side
    if longest > MAX_INPUT_SIDE:
        if not auto_resize and not max_side:
            sys.exit(f"{src.name} 尺寸 {w}x{h} 超过 10000px，加 --auto-resize 或 --max-side 让它先等比缩小")
        target = min(target, MAX_INPUT_SIDE)
    if target == longest:
        return src, tmpfile

    with Image.open(src) as im:
        im.load()
        scale = target / longest
        new_size = (max(1, int(w * scale)), max(1, int(h * scale)))
        im = im.convert("RGBA" if im.has_transparency_data else "RGB")
        im = im.resize(new_size, Image.LANCZOS)
        tmpfile = Path(tempfile.gettempdir()) / f"mediakit-pre-{os.getpid()}-{src.stem}.png"
        im.save(tmpfile)
    print(f"  ! {src.name} 本地预缩放到 {new_size[0]}x{new_size[1]} 后上传")
    return tmpfile, tmpfile


def shrink_locally(dest: Path, target: int) -> int:
    """云端压不到目标体积时的本地兜底：先降质量，再降尺寸，直到达标。

    mediakit 的 --max-size 对带透明通道的 webp 往往只能到 400~800 KB，
    所以真正想做到"≤200 KB"必须补这一步。返回最终字节数。
    """
    if dest.stat().st_size <= target:
        return dest.stat().st_size

    with Image.open(dest) as im:
        im.load()
        base = im.convert("RGBA" if im.has_transparency_data else "RGB")
        w, h = base.size
        kwargs = {}
        if "icc_profile" in im.info:
            kwargs["icc_profile"] = im.info["icc_profile"]

        work, size = base, dest.stat().st_size
        # 第一轮：只降质量
        for q in (88, 82, 76, 70, 64, 58, 52):
            work.save(dest, "WEBP", quality=q, method=6, **kwargs)
            size = dest.stat().st_size
            if size <= target:
                print(f"  · 本地兜底：quality={q} 达标（{human(size)}）")
                return size

        # 第二轮：按 85% 递减尺寸 + 中质量
        scale = 0.85
        while min(work.size) > 200 and scale > 0.2:
            new_size = (max(1, int(w * scale)), max(1, int(h * scale)))
            work = base.resize(new_size, Image.LANCZOS)
            work.save(dest, "WEBP", quality=74, method=6, **kwargs)
            size = dest.stat().st_size
            if size <= target:
                print(f"  · 本地兜底：缩到 {new_size[0]}x{new_size[1]} 达标（{human(size)}）")
                return size
            scale -= 0.08
    return dest.stat().st_size


def call_cli(cli: str, src: Path, args: argparse.Namespace, retries: int) -> dict:
    cmd = [cli, "image", "compress-image", "--image-url", str(src)]
    if args.max_size:
        cmd += ["--max-size", str(args.max_size)]
    else:
        cmd += ["--quality", str(args.quality)]
    cmd += ["--output-format", args.format]

    last_err = ""
    for attempt in range(1, retries + 1):
        proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
        out = proc.stdout.strip()
        if proc.returncode == 0:
            try:
                data = json.loads(out)
            except json.JSONDecodeError:
                last_err = f"返回不是合法 JSON：{out[:200]}"
            else:
                if data.get("image_url"):
                    return data
                last_err = f"返回里没有 image_url：{out[:200]}"
        else:
            last_err = (proc.stderr or out).strip()[:300]
        print(f"  ! 第 {attempt} 次调用失败：{last_err}")
        if attempt < retries:
            time.sleep(2 * attempt)
    raise RuntimeError(last_err or "mediakit-cli 调用失败")


def download(url: str, dest: Path, retries: int = 3) -> int:
    dest.parent.mkdir(parents=True, exist_ok=True)
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "img-mediakit-compress/1.0"})
            with urllib.request.urlopen(req, timeout=120) as resp, open(dest, "wb") as f:
                f.write(resp.read())
            return dest.stat().st_size
        except Exception as e:
            print(f"  ! 下载第 {attempt} 次失败：{e}")
            if attempt == retries:
                raise
            time.sleep(2 * attempt)
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="mediakit-cli 云端压缩图片并下载到本地")
    ap.add_argument("paths", nargs="+", help="图片文件或目录")
    ap.add_argument("--max-size", help="目标体积上限，如 200k / 1.5MB（优先于 --quality）")
    ap.add_argument("--quality", type=int, default=82, help="质量 1-100，默认 82（仅在未给 --max-size 时生效）")
    ap.add_argument("--format", default="webp", choices=["webp", "jpeg", "png", "avif", "heic"], help="输出格式，默认 webp")
    ap.add_argument("--out-dir", help="输出目录，默认与源文件同目录")
    ap.add_argument("--replace", action="store_true", help="直接覆盖源文件（源为 .webp 时慎用）")
    ap.add_argument("--delete-original", action="store_true", help="成功后删除源文件（仅当输出名与源不同）")
    ap.add_argument("--overwrite", action="store_true", help="允许覆盖已存在的输出文件")
    ap.add_argument("--auto-resize", action="store_true", help="超过 10000px 时先本地等比缩小再上传")
    ap.add_argument("--max-side", type=int, help="上传前把长边压到该像素数（想真压到 200KB 通常需要，如 1200）")
    ap.add_argument("-r", "--recursive", action="store_true", help="目录递归")
    ap.add_argument("--dry-run", action="store_true", help="只列出待处理文件，不调用、不写盘")
    ap.add_argument("--retries", type=int, default=3, help="单张调用/下载重试次数，默认 3")
    ap.add_argument("--cli", help="mediakit-cli 可执行文件路径")
    args = ap.parse_args()
    args.max_size = parse_size(args.max_size) if args.max_size else None

    cli = find_cli(args.cli)
    targets = collect(args.paths, args.recursive)
    if not targets:
        print("没有找到需要处理的图片")
        return 0

    print(f"待处理 {len(targets)} 个文件"
          + ("（dry-run）" if args.dry_run else "")
          + f"，目标格式 {args.format}，"
          + (f"体积上限 {human(args.max_size)}" if args.max_size else f"quality={args.quality}")
          + "\n")

    ok = fail = miss = 0
    total_before = total_after = 0
    for i, src in enumerate(targets, 1):
        prefix = f"[{i}/{len(targets)}] {src}"
        in_path, tmp_src = src, None
        try:
            in_path, tmp_src = prepare_input(src, args.auto_resize, args.max_side)
            if args.dry_run:
                print(f"{prefix}\n  → 将输出 {src.stem}.{args.format}")
                ok += 1
                continue

            data = call_cli(cli, in_path, args, args.retries)

            if args.replace:
                dest = src
            elif args.out_dir:
                dest = Path(args.out_dir).expanduser() / f"{src.stem}.{args.format}"
            elif src.suffix.lower() in (".png", ".jpg", ".jpeg"):
                dest = src.with_suffix(f".{args.format}")
            else:
                dest = src.with_name(f"{src.stem}.min.{args.format}")

            if dest.exists() and not args.overwrite and dest != src:
                raise FileExistsError(f"目标已存在：{dest.name}（用 --overwrite 覆盖）")

            before = src.stat().st_size
            size = download(data["image_url"], dest, args.retries)
            if args.max_size:
                shrink_locally(dest, args.max_size)
            after = dest.stat().st_size
            if after <= 0:
                raise ValueError("下载结果是 0 字节")

            with Image.open(dest) as im:  # 回读校验，坏文件当场暴露
                im.load()
                final_w, final_h = im.size

            if args.delete_original and dest != src and src.exists():
                src.unlink()

            ok += 1
            total_before += before
            total_after += after
            pct = (before - after) / before * 100 if before else 0
            print(f"{prefix}\n  ✓ {dest.name}：{human(before)} → {human(after)}（{pct:.1f}%） {final_w}x{final_h}")
            if args.max_size and after > args.max_size:
                miss += 1
                print(f"  ! 未达标：目标 {human(args.max_size)}，实际 {human(after)}（服务端已压到它认为的极限）")
        except FileExistsError as e:
            print(f"{prefix}\n  - {e}")
            fail += 1
        except Exception as e:
            print(f"{prefix}\n  ✗ 失败：{type(e).__name__}: {e}")
            fail += 1
        finally:
            if tmp_src and tmp_src.exists():
                tmp_src.unlink()

    print(f"\n完成：成功 {ok}（其中未达标 {miss}），失败 {fail}")
    if ok and not args.dry_run:
        saved = total_before - total_after
        pct = saved / total_before * 100 if total_before else 0
        print(f"合计 {human(total_before)} → {human(total_after)}，省 {human(saved)}（{pct:.1f}%）")
        if args.replace:
            print("已直接覆盖源文件（无原图备份，建议先 commit）")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
