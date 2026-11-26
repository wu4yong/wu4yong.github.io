/*
  ============================================
  诗云 · 标签星云（/tags/ 雷达区的 3D 点云）
  文件：source/js/theme/starmap/tags-cloud.js
  作用：把原来的平面行星场换成「诗云」式三维星云 ——
        标签是亮星，每篇文章是细星，外圈还有一层深空尘埃；
        鼠标移动让整团星云产生视差倾侧，拖拽可以带着惯性甩动，
        滚轮缩放，点星星有冲击波 + 闪光，然后跳到对应页面。
  依赖：无（纯 canvas 2D 手写投影，不引 three.js）
  数据：.stargate-node（标签：名称 / 计数 / 链接）
        .tag-dataset .tag-post-data（文章：标题 / 链接）
  ============================================
*/
(function () {
  var root = document.getElementById('radarView');
  if (!root || root.getAttribute('data-view') !== 'graph') return;

  var HUES = [186, 264, 44, 332, 152, 206, 20, 290];

  function hash01(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return (h % 100000) / 100000;
  }

  /* ---------- 数据：标签 + 文章 ---------- */
  var tagEls = [].slice.call(root.querySelectorAll('.stargate-node[data-tag-name]'));
  if (!tagEls.length) return;

  var tags = tagEls.map(function (el) {
    var name = el.getAttribute('data-tag-name');
    return {
      name: name,
      label: (el.querySelector('.node-label') || {}).textContent || name,
      href: el.getAttribute('href') || '#',
      count: +el.getAttribute('data-count') || 1,
      hue: HUES[Math.floor(hash01(name + ':h') * HUES.length) % HUES.length]
    };
  });

  var tagIndex = {};
  tags.forEach(function (t) { tagIndex[t.name] = t; });

  var posts = [];
  var ds = document.querySelector('.tag-dataset');
  if (ds) {
    ds.querySelectorAll('.tag-posts').forEach(function (box) {
      var tag = box.getAttribute('data-tag');
      box.querySelectorAll('.tag-post-data').forEach(function (p) {
        var url = p.getAttribute('data-url');
        if (!url) return;
        posts.push({
          url: url,
          title: p.getAttribute('data-title') || '',
          hue: (tagIndex[tag] || {}).hue != null ? tagIndex[tag].hue : 190
        });
      });
    });
  }

  /* ---------- 画布 ---------- */
  var cv = document.createElement('canvas');
  cv.className = 'cloud-canvas';
  root.appendChild(cv);
  root.classList.add('rv-cloud');

  var ctx = cv.getContext('2d');
  var DPR = Math.min(2, window.devicePixelRatio || 1);
  var W = 1, H = 1, cx = 0, cy = 0, R = 200;

  /* 球面均匀分布（Fibonacci 球）：y 压扁一点，适配扁的雷达框 */
  var GOLD = Math.PI * (1 + Math.sqrt(5));

  function unit(i, n) {
    var k = (i + 0.5) / n;
    var phi = Math.acos(1 - 2 * k);
    var theta = GOLD * i;
    return {
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.cos(phi) * 0.72,
      z: Math.sin(phi) * Math.sin(theta)
    };
  }

  var points = [];

  tags.forEach(function (t, i) {
    var u = unit(i, tags.length);
    var jitter = 0.96 + hash01(t.name + ':r') * 0.06;
    points.push({
      kind: 'tag',
      x: u.x * jitter, y: u.y * jitter, z: u.z * jitter,
      r: 1.3 + Math.sqrt(t.count) * 0.62,
      hue: t.hue,
      label: t.label,
      sub: t.count + ' 篇',
      href: t.href,
      tw: hash01(t.name + ':t') * 6.28
    });
  });

  posts.forEach(function (p, i) {
    var u = unit(i, posts.length);
    var k = Math.cbrt(hash01(p.url + ':r'));                 /* 体积均匀：里外都填满，中心不空 */
    points.push({
      kind: 'post',
      x: u.x * k, y: u.y * k, z: u.z * k,
      r: 0.45 + hash01(p.url + ':s') * 0.34,
      hue: p.hue,
      label: p.title,
      sub: '',
      href: p.url,
      tw: hash01(p.url + ':t') * 6.28
    });
  });

  /* 深空尘埃：只有光点、不参与拾取，撑出纵深与外圈星雾 */
  var dust = [];
  for (var d = 0; d < 1500; d++) {
    var du = unit(d + 97, 1500);
      var dk = 1.06 + hash01('d' + d) * 0.42;
      var dh = hash01('dh' + d);
    dust.push({
      x: du.x * dk, y: du.y * dk, z: du.z * dk,
      r: 0.42 + hash01('dd' + d) * 0.38,
      a: 0.3 + hash01('da' + d) * 0.45,
      /* 七成是冷白/淡蓝的小星，剩下三成撒一点彩色，别让背景变成糖纸 */
      hue: dh < 0.7 ? 195 + Math.round(hash01('dq' + d) * 18) : HUES[(d * 3) % HUES.length],
      tw: hash01('dt' + d) * 6.28
    });
  }

  /* ---------- 光晕贴图缓存（每种色相一张，避免每帧建渐变） ---------- */
  var spriteCache = {};
  function sprite(hue) {
    var key = 'h' + hue;
    if (spriteCache[key]) return spriteCache[key];
    var s = 64, c = document.createElement('canvas');
    c.width = c.height = s;
    var g = c.getContext('2d');
    var grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grd.addColorStop(0, 'hsl(' + hue + ',100%,97%)');
    grd.addColorStop(0.16, 'hsla(' + hue + ',100%,78%,0.95)');
    grd.addColorStop(0.42, 'hsla(' + hue + ',96%,62%,0.42)');
    grd.addColorStop(1, 'hsla(' + hue + ',96%,58%,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
    spriteCache[key] = c;
    return c;
  }

  var whiteSprite = (function () {
    var s = 64, c = document.createElement('canvas');
    c.width = c.height = s;
    var g = c.getContext('2d');
    var grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.2, 'rgba(235,248,255,0.85)');
    grd.addColorStop(1, 'rgba(235,248,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
    return c;
  })();

  /* ---------- 交互状态 ---------- */
  var st = {
    rx: -0.12, ry: 0.6,          /* 当前旋转 */
    vx: 0, vy: 0.16,             /* 角速度（y 自转、x 惯性） */
    zoom: 1, zoomTarget: 1,
    px: 0, py: 0,                 /* 归一化指针位置（-1..1） */
    inside: false,
    down: false, dragged: false,
    lx: 0, ly: 0, ltime: 0,
    hover: null,
    mouseX: -999, mouseY: -999
  };

  var ripples = [];              /* 点击冲击波 */
  var flashes = [];              /* 点击闪光 */

  function measure() {
    var w = root.clientWidth, h = root.clientHeight;
    if (!w || !h) return;
    W = w; H = h; cx = w / 2; cy = h / 2;
    cv.width = Math.round(w * DPR);
    cv.height = Math.round(h * DPR);
    cv.style.width = w + 'px';
    cv.style.height = h + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    /* 半径：横向铺满、纵向按 0.72 压扁后的高度算 */
    R = Math.max(90, Math.min(w / 2 - 46, (h / 2 - 26) / 0.72));
  }

  /* ---------- 每帧：旋转 → 投影 → 绘制 ---------- */
  var last = 0, lastDrawn = 0;

  function frame(ts) {
    requestAnimationFrame(frame);
    step(ts);
  }

  function step(ts) {
    if (document.hidden) { last = 0; return; }
    var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
    last = ts;

    /* 鼠标在区内：整团星云朝指针方向倾侧（3D 视差），并带一点自转偏移 */
    var tiltX = st.inside ? -(st.py) * 0.5 : 0;
    var tiltY = st.inside ? st.px * 0.45 : 0;

    if (!st.down) {
      /* 角度回正 + 自转 */
      st.rx += ((tiltX - st.rx) * 0.9 + st.vx) * Math.min(1, dt * 5);
      st.ry += (st.vy + tiltY * 0.9) * dt;
      st.vx *= Math.pow(0.25, dt);
    } else {
      /* 拖拽中角度由指针增量直接驱动，松手后再靠 vx/vy 惯性 */
      st.rx += st.vx * dt;
      st.ry += st.vy * dt;
      st.vx *= Math.pow(0.02, dt);
    }
    st.rx = Math.max(-1.15, Math.min(1.15, st.rx));
    st.zoom += (st.zoomTarget - st.zoom) * Math.min(1, dt * 8);

    render(ts);
  }

    /* 一次性的旋转矩阵系数 */
  function render(ts) {
    var t = ts / 1000;
    lastDrawn = performance.now();
    var cosY = Math.cos(st.ry), sinY = Math.sin(st.ry);
    var cosX = Math.cos(st.rx), sinX = Math.sin(st.rx);
    var rBase = R * st.zoom;

    ctx.clearRect(0, 0, W, H);

    /* 1) 深空尘埃（最底） */
    for (var d = 0; d < dust.length; d++) {
      var dp = dust[d];
      var rot = project(dp, cosY, sinY, cosX, sinX);
      if (rot.z <= -1) continue;
      var sc = 1 / (1 - rot.z * 0.46);
      var px = cx + rot.x * rBase * sc;
      var py = cy + rot.y * rBase * sc;
      if (px < -40 || px > W + 40 || py < -40 || py > H + 40) continue;
      var a = dp.a * (0.35 + 0.65 * ((rot.z + 1) / 2));
      var sz = dp.r * sc * 1.7;
      ctx.globalAlpha = a;
      ctx.drawImage(sprite(dp.hue), px - sz, py - sz, sz * 2, sz * 2);
    }

    /* 2) 文章细星 + 标签亮星：按深度排序，远的先画 */
    var list = [];
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var r2 = project(p, cosY, sinY, cosX, sinX);
      var s2 = 1 / (1 - r2.z * 0.46);
      var x2 = cx + r2.x * rBase * s2;
      var y2 = cy + r2.y * rBase * s2;
      list.push({ p: p, z: r2.z, s: s2, x: x2, y: y2 });
    }
    list.sort(function (m, n) { return m.z - n.z; });

    var hover = null;
    for (var k = 0; k < list.length; k++) {
      var it = list[k];
      var depth = (it.z + 1) / 2;
      var alpha = 0.18 + 0.82 * Math.pow(depth, 1.15);
      /* 标签亮点会呼吸，细星只随深度明暗 */
      if (it.p.kind === 'tag') alpha *= 0.82 + 0.18 * Math.sin(t * 1.6 + it.p.tw);

      var radius = it.p.r * it.s;
      var halo = radius * (it.p.kind === 'tag' ? 3.1 : 3.6);
      ctx.globalAlpha = alpha;
      ctx.drawImage(it.p.kind === 'tag' ? sprite(it.p.hue) : whiteSprite, it.x - halo, it.y - halo, halo * 2, halo * 2);

      /* 标签本体再压一个带色的实心核，避免细星糊成一片白 */
      if (it.p.kind === 'tag') {
        ctx.globalAlpha = alpha * 0.9;
        ctx.drawImage(sprite(it.p.hue), it.x - radius * 2.2, it.y - radius * 2.2, radius * 4.4, radius * 4.4);
      }

      if (st.mouseX > -900 && it.z > 0.05) {
        var mt = Math.max(13, radius);
        if ((it.x - st.mouseX) * (it.x - st.mouseX) + (it.y - st.mouseY) * (it.y - st.mouseY) < mt * mt) {
          if (!hover || it.z > hover.z) hover = it;
        }
      }
    }

    st.hover = hover;

    /* 3) 悬停：描一圈 + 名字 */
    if (hover) {
      ctx.globalAlpha = 1;
      ctx.save();
      ctx.strokeStyle = 'hsla(' + hover.p.hue + ',100%,80%,0.85)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(hover.x, hover.y, Math.max(11, hover.p.r * hover.s * 2.2), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      drawTip(hover);
    }

    /* 4) 点击冲击波 + 闪光 */
    drawEffects();

    ctx.globalAlpha = 1;
  }

  function drawEffects() {
    var now = performance.now();
    for (var i = ripples.length - 1; i >= 0; i--) {
      var r = ripples[i];
      var age = (now - r.t0) / 1000;
      if (age > 0.9) { ripples.splice(i, 1); continue; }
      var q = age / 0.9;
      ctx.globalAlpha = (1 - q) * 0.9;
      ctx.strokeStyle = 'hsla(' + r.hue + ',100%,78%,1)';
      ctx.lineWidth = 1.6 * (1 - q) + 0.4;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r0 + q * r.grow, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (var j = flashes.length - 1; j >= 0; j--) {
      var f = flashes[j];
      var a2 = (now - f.t0) / 1000;
      if (a2 > 0.6) { flashes.splice(j, 1); continue; }
      var q2 = 1 - a2 / 0.6;
      var rad = f.r * (1 + (1 - q2) * 2.4);
      ctx.globalAlpha = q2 * 0.85;
      ctx.drawImage(sprite(f.hue), f.x - rad * 3, f.y - rad * 3, rad * 6, rad * 6);
    }
    ctx.globalAlpha = 1;
  }

  function drawTip(hit) {
    var txt = hit.p.label || '';
    var sub = hit.p.sub || '';
    var a = 0.9;
    ctx.font = '600 12px "Noto Sans SC","PingFang SC",system-ui,sans-serif';
    var tw = ctx.measureText(txt).width;
    var padX = 8, padY = 6, hgt = sub ? 30 : 20;
    var bx = Math.min(W - tw - 26, Math.max(6, hit.x - tw / 2 - padX));
    var by = Math.max(6, hit.y - (hit.p.r * hit.s) - 14 - hgt);
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(4, 16, 28, 0.82)';
    ctx.beginPath();
    ctx.roundRect(bx, by, tw + padX * 2, hgt, 7);
    ctx.fill();
    ctx.strokeStyle = 'hsla(' + hit.p.hue + ',96%,66%,0.55)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = 'hsl(' + hit.p.hue + ',100%,86%)';
    ctx.textBaseline = 'top';
    ctx.fillText(txt, bx + padX, by + padY);
    if (sub) {
      ctx.font = '11px "Noto Sans SC","PingFang SC",system-ui,sans-serif';
      ctx.fillStyle = 'rgba(190, 232, 255, 0.75)';
      ctx.fillText(sub, bx + padX, by + padY + 15);
    }
  }

  function project(p, cY, sY, cX, sX) {
    var x1 = p.x * cY + p.z * sY;
    var z1 = -p.x * sY + p.z * cY;
    var y1 = p.y * cX - z1 * sX;
    var z2 = p.y * sX + z1 * cX;
    return { x: x1, y: y1, z: z2 };
  }

  /* ---------- 指针交互 ---------- */
  function localXY(e) {
    var rect = cv.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  cv.addEventListener('pointermove', function (e) {
    var m = localXY(e);
    st.mouseX = m.x; st.mouseY = m.y;
    st.px = (m.x - cx) / (W / 2 || 1);
    st.py = (m.y - cy) / (H / 2 || 1);
    st.inside = true;

    if (st.down) {
      var dx = m.x - st.lx, dy = m.y - st.ly;
      if (Math.abs(dx) + Math.abs(dy) > 3) st.dragged = true;
      st.ry += dx * 0.006;
      st.rx -= dy * 0.004;
      st.vx = -dy * 0.02;
      st.vy = dx * 0.02;
      st.lx = m.x; st.ly = m.y;
    }
  });

  cv.addEventListener('pointerleave', function () {
    st.inside = false;
    st.mouseX = -999; st.mouseY = -999;
    st.hover = null;
    st.px = 0; st.py = 0;
  });

  cv.addEventListener('pointerdown', function (e) {
    st.down = true;
    st.dragged = false;
    var m = localXY(e);
    st.lx = m.x; st.ly = m.y;
    cv.setPointerCapture(e.pointerId);
  });

  cv.addEventListener('pointerup', function (e) {
    st.down = false;
    var m = localXY(e);
    if (!st.dragged) {
      var hit = pick(m.x, m.y);
      if (hit) {
        burst(hit);
        var url = hit.p.href;
        setTimeout(function () { if (url && url !== '#') location.href = url; }, 240);
      }
    }
    try { cv.releasePointerCapture(e.pointerId); } catch (err) {}
  });

  cv.addEventListener('wheel', function (e) {
    e.preventDefault();
    st.zoomTarget = Math.max(0.82, Math.min(1.7, st.zoomTarget - e.deltaY * 0.0011));
  }, { passive: false });

  /* 点击拾取：用当前姿态即时投影一遍，只在「前半球」里挑离指针最近的那颗 */
  function pick(mx, my) {
    var cosY = Math.cos(st.ry), sinY = Math.sin(st.ry);
    var cosX = Math.cos(st.rx), sinX = Math.sin(st.rx);
    var rBase = R * st.zoom;
    var best = null;
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var r2 = project(p, cosY, sinY, cosX, sinX);
      if (r2.z < 0.02) continue;
      var sc = 1 / (1 - r2.z * 0.46);
      var x2 = cx + r2.x * rBase * sc;
      var y2 = cy + r2.y * rBase * sc;
      var rad = Math.max(12, p.r * sc * 2.4);
      var dx = x2 - mx, dy = y2 - my;
      if (dx * dx + dy * dy > rad * rad) continue;
      if (!best || r2.z > best.z) best = { p: p, z: r2.z, s: sc, x: x2, y: y2 };
    }
    return best;
  }

  function burst(hit) {
    var now = performance.now();
    var hue = hit.p.hue;
    for (var i = 0; i < 3; i++) {
      ripples.push({ x: hit.x, y: hit.y, t0: now + i * 90, r0: 6, grow: 58 + i * 26, hue: hue });
    }
    flashes.push({ x: hit.x, y: hit.y, t0: now, r: Math.max(6, hit.p.r * hit.s), hue: hue });
  }

  /* ---------- 启动 ---------- */
  measure();
  window.addEventListener('resize', measure);
  requestAnimationFrame(frame);

  /* 兜底：窗口被别的窗口挡住 / 后台时浏览器会挂起 rAF，用定时器补帧，
     否则切回来之前画面是僵的（顺带保证截图和巡检能看到画面） */
  setInterval(function () {
    if (performance.now() - lastDrawn > 380) step(performance.now());
  }, 220);

  window.__cloud = st;   /* 调试口子：看当前姿态 / 手动改角度验证视差 */
})();
