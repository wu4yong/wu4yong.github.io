/* ============================================
   星空星座层
   文件：js/theme/starfield.js
   适用终端：电脑端
   作用：在粒子层之上随机散布真实星座图形（连星成图 + 呼吸闪烁 + 极慢漂移），
         让背景不只有均匀粒子，还有零星可辨认的星座
   依赖：#constellations 容器（见 _components/Particles.njk）
   层级：#particles(z0) < #constellations(z1) < 内容(z10)
   ============================================ */
(function () {
  "use strict";

  var host = document.getElementById("constellations");
  if (!host) return;

  var canvas = document.createElement("canvas");
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  host.appendChild(canvas);

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0;
  var H = 0;

  /* ----- 星座模板：坐标为 0~1 归一化，links 为星点之间的连线 ----- */
  var TEMPLATES = [
    { // 北斗七星（大熊座）
      stars: [[0.05, 0.62], [0.18, 0.70], [0.31, 0.72], [0.44, 0.66], [0.62, 0.55], [0.78, 0.44], [0.92, 0.30]],
      links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]]
    },
    { // 猎户座（腰带三星 + 双肩 + 双脚）
      stars: [[0.28, 0.24], [0.72, 0.30], [0.38, 0.50], [0.50, 0.53], [0.62, 0.56], [0.50, 0.72], [0.30, 0.86], [0.70, 0.88]],
      links: [[0, 2], [1, 4], [2, 3], [3, 4], [2, 6], [4, 7], [3, 5]]
    },
    { // 仙后座（W 形）
      stars: [[0.10, 0.80], [0.30, 0.40], [0.50, 0.78], [0.70, 0.36], [0.90, 0.76]],
      links: [[0, 1], [1, 2], [2, 3], [3, 4]]
    },
    { // 天鹅座（十字）
      stars: [[0.50, 0.08], [0.50, 0.40], [0.50, 0.72], [0.18, 0.46], [0.82, 0.42]],
      links: [[0, 1], [1, 2], [3, 1], [1, 4]]
    },
    { // 天鹰座（牛郎星与两侧）
      stars: [[0.50, 0.40], [0.30, 0.55], [0.30, 0.80], [0.72, 0.55], [0.72, 0.78]],
      links: [[0, 1], [1, 2], [0, 3], [3, 4]]
    },
    { // 双子座
      stars: [[0.20, 0.10], [0.30, 0.40], [0.26, 0.72], [0.35, 0.92], [0.68, 0.14], [0.78, 0.44], [0.74, 0.76]],
      links: [[0, 1], [1, 2], [2, 3], [4, 5], [5, 6]]
    },
    { // 天蝎座
      stars: [[0.12, 0.18], [0.28, 0.30], [0.44, 0.50], [0.58, 0.66], [0.74, 0.74], [0.86, 0.62], [0.90, 0.44]],
      links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]]
    },
    { // 小熊座
      stars: [[0.50, 0.14], [0.70, 0.26], [0.80, 0.50], [0.64, 0.70], [0.40, 0.66], [0.30, 0.44], [0.40, 0.30]],
      links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]]
    }
  ];

  var items = [];
  /* 零星闪烁点：数量刻意压得很低（1917×954 只有约 17 个），
     大部分时间不可见，偶尔亮一下再慢慢熄灭，模拟肉眼观星 */
  var sparks = [];

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  /* 决定星座数量：按面积推算，1917x954 约 7 个，保证「零星」而不是铺满 */
  function countForArea() {
    return Math.max(4, Math.min(9, Math.round((W * H) / 260000)));
  }

  /* 闪烁点数量：同样按面积，但上限压到 26，绝不成片 */
  function countSparks() {
    return Math.max(8, Math.min(26, Math.round((W * H) / 110000)));
  }

  /* 一颗闪烁点：周期 9~22 秒，其中只有 1~2.6 秒是亮的，其余时间完全不可见 */
  function makeSpark() {
    var period = rand(9, 22);
    return {
      x: rand(10, W - 10),
      y: rand(10, H - 10),
      period: period,
      flash: rand(1.1, 2.6),
      offset: rand(0, period),
      mode: Math.random() < 0.48 ? 0 : 1,      /* 0 = 圆点，1 = 四芒小星 */
      size: rand(1.1, 2.2),
      tint: Math.random() < 0.22 ? "230, 244, 255" : "150, 232, 255"
    };
  }

  function buildSparks() {
    sparks = [];
    var n = countSparks();
    for (var i = 0; i < n; i++) sparks.push(makeSpark());
  }

  /* 生成一个星座实例：模板 + 位置 + 缩放 + 旋转 + 漂移 + 闪烁相位 */
  function makeItem(tpl, others) {
    var scale = rand(0.10, 0.20) * Math.min(W, H);
    var x = 0;
    var y = 0;
    var ok = false;
    for (var t = 0; t < 24; t++) {
      x = rand(scale * 0.6, W - scale * 0.6);
      y = rand(scale * 0.6, H - scale * 0.6);
      ok = true;
      for (var i = 0; i < others.length; i++) {
        var dx = x - others[i].x;
        var dy = y - others[i].y;
        if (dx * dx + dy * dy < Math.pow(scale * 1.5 + others[i].scale * 1.2, 2)) {
          ok = false;
          break;
        }
      }
      if (ok) break;
    }
    return {
      tpl: tpl,
      x: x,
      y: y,
      scale: scale,
      rot: rand(-0.22, 0.22),
      vx: rand(-0.045, 0.045),
      vy: rand(-0.035, 0.035),
      phase: rand(0, Math.PI * 2),
      twinkle: rand(0.5, 1.1)
    };
  }

  function build() {
    items = [];
    var n = countForArea();
    var pool = TEMPLATES.slice();
    for (var i = 0; i < n; i++) {
      var tpl = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      if (!tpl) { pool = TEMPLATES.slice(); tpl = pool[0]; }
      items.push(makeItem(tpl, items));
    }
    buildSparks();
  }

  function resize() {
    W = host.clientWidth || window.innerWidth;
    H = host.clientHeight || window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    build();
  }

  /* 单颗星：核心亮点 + 柔光晕 */
  function drawStar(px, py, r, alpha) {
    ctx.beginPath();
    ctx.arc(px, py, r * 1.9, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 225, 255, " + alpha * 0.16 + ")";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(214, 250, 255, " + alpha + ")";
    ctx.fill();
  }

  /* 四芒小星：横竖两条带渐变的长臂 + 中心亮点，远看就是一颗"星星" */
  function drawSparkCross(sp, px, py, alpha) {
    var len = sp.size * 5;
    var col = sp.tint;

    if (!sp.gH) {
      sp.gH = ctx.createLinearGradient(px - len, py, px + len, py);
      sp.gH.addColorStop(0, "rgba(" + col + ", 0)");
      sp.gH.addColorStop(0.5, "rgba(" + col + ", 1)");
      sp.gH.addColorStop(1, "rgba(" + col + ", 0)");
      sp.gV = ctx.createLinearGradient(px, py - len, px, py + len);
      sp.gV.addColorStop(0, "rgba(" + col + ", 0)");
      sp.gV.addColorStop(0.5, "rgba(" + col + ", 1)");
      sp.gV.addColorStop(1, "rgba(" + col + ", 0)");
    }

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1;
    ctx.strokeStyle = sp.gH;
    ctx.beginPath();
    ctx.moveTo(px - len, py);
    ctx.lineTo(px + len, py);
    ctx.stroke();
    ctx.strokeStyle = sp.gV;
    ctx.beginPath();
    ctx.moveTo(px, py - len);
    ctx.lineTo(px, py + len);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(px, py, sp.size * 1.15, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fill();
    ctx.restore();
  }

  /* 闪烁点统一绘制：一次"闪现"是一条 sin 曲线（渐亮 → 顶点 → 渐暗） */
  function drawSparks(t) {
    for (var i = 0; i < sparks.length; i++) {
      var sp = sparks[i];
      var c = (t + sp.offset) % sp.period;
      if (c > sp.flash) continue;             // 不在闪现窗口内 → 完全不可见
      var u = c / sp.flash;
      var a = Math.sin(Math.PI * u);
      a *= a * 0.95;                          // 平方让峰值更短促、更像"闪一下"
      if (a < 0.02) continue;

      if (sp.mode === 0) {
        drawStar(sp.x, sp.y, sp.size, a);
      } else {
        drawSparkCross(sp, sp.x, sp.y, a);
      }
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    for (var k = 0; k < items.length; k++) {
      var it = items[k];

      // 极慢漂移，出界后从对侧回来
      it.x += it.vx;
      it.y += it.vy;
      if (it.x < -it.scale) it.x = W + it.scale;
      if (it.x > W + it.scale) it.x = -it.scale;
      if (it.y < -it.scale) it.y = H + it.scale;
      if (it.y > H + it.scale) it.y = -it.scale;

      var breathe = 0.55 + 0.45 * Math.sin(t * 0.55 + it.phase);
      var cs = Math.cos(it.rot);
      var sn = Math.sin(it.rot);

      // 归一化坐标 → 屏幕坐标（以星座中心为原点旋转）
      var pts = [];
      for (var s = 0; s < it.tpl.stars.length; s++) {
        var ox = (it.tpl.stars[s][0] - 0.5) * it.scale;
        var oy = (it.tpl.stars[s][1] - 0.5) * it.scale;
        pts.push([it.x + ox * cs - oy * sn, it.y + ox * sn + oy * cs]);
      }

      // 连线
      ctx.strokeStyle = "rgba(0, 210, 245, " + (0.07 + 0.09 * breathe) + ")";
      ctx.lineWidth = 1;
      for (var l = 0; l < it.tpl.links.length; l++) {
        var a = pts[it.tpl.links[l][0]];
        var b = pts[it.tpl.links[l][1]];
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }

      // 星点（各自相位闪烁）
      for (var p = 0; p < pts.length; p++) {
        var tw = 0.62 + 0.38 * Math.sin(t * it.twinkle * 1.6 + it.phase + p * 1.7);
        drawStar(pts[p][0], pts[p][1], 1.3 + (p % 3) * 0.35, 0.55 * tw + 0.22);
      }
    }

    // 星座之上再叠一层零星闪烁点
    drawSparks(t);
  }

  var start = 0;
  function loop(now) {
    if (!start) start = now;
    draw((now - start) / 1000);
    requestAnimationFrame(loop);
  }

  resize();
  var timer = null;
  window.addEventListener("resize", function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(resize, 220);
  });
  requestAnimationFrame(loop);
})();
