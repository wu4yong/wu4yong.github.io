/*
  ============================================
  档案坐标 · 立体星轨组件
  文件：globe.js
  适用终端：电脑端（秘境主人 /about/）
  作用：在「档案坐标」列表下方的空白区画一颗中心星体，外层是多条不同朝向的
        立体轨道（屏幕平面内旋转角各不相同，看起来是绕着中心球从多个方向转），
        每颗小行星按轨道公转，转到后半圈时压暗缩小做景深；纯 canvas 无外部依赖。
        公转速度刻意放慢（0.20~0.34 rad/s，绕一圈约 18~31 秒）。
  最后修改：2026-11-11
  ============================================
*/
(function () {
  var box = document.getElementById('globeBox');
  if (!box) return;

  var canvas = document.getElementById('globeCanvas');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var DPR = Math.min(2, window.devicePixelRatio || 1);
  var W = 0;
  var H = 0;
  var RX = 0;
  var RY = 0;
  var cx = 0;
  var cy = 0;

  /* 立体轨道：tilt = 在屏幕平面里的旋转角，flat = 椭圆压扁比。
     tilt 各不相同 → 轨道朝向四方，读起来是「多方位立体环绕中心球」。 */
  var ORBITS = [
    { k: 1.00, flat: 0.30, tilt: -0.52, alpha: 0.44, speed: 0.26 },
    { k: 0.88, flat: 0.26, tilt: 0.78, alpha: 0.36, speed: -0.21 },
    { k: 0.76, flat: 0.24, tilt: 0.22, alpha: 0.30, speed: 0.34 },
    { k: 0.64, flat: 0.20, tilt: -1.05, alpha: 0.26, speed: -0.28 },
    { k: 0.52, flat: 0.17, tilt: 1.32, alpha: 0.22, speed: 0.23 }
  ];

  /* 沿轨道公转的小行星（a = 初始相位） */
  var ASTEROIDS = [
    { orbit: 0, a: 0.35, size: 2.6 },
    { orbit: 0, a: 3.10, size: 1.8 },
    { orbit: 1, a: 1.20, size: 2.1 },
    { orbit: 1, a: 4.60, size: 1.6 },
    { orbit: 2, a: 0.90, size: 1.9 },
    { orbit: 2, a: 3.90, size: 1.5 },
    { orbit: 3, a: 2.40, size: 1.7 },
    { orbit: 4, a: 5.40, size: 1.4 }
  ];

  /* 星尘：铺满整个区块的微光点，让空白区不再空旷（确定性伪随机，刷新后位置不变） */
  var DUST = (function () {
    var seed = 20261111;
    function rnd() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    }
    var list = [];
    for (var i = 0; i < 46; i++) {
      list.push({ x: rnd(), y: rnd(), s: 0.4 + rnd() * 0.9, ph: rnd() * 6.28 });
    }
    return list;
  })();

  // resize：按容器实际尺寸重算画布像素（含 DPR 放大）、轨道半径与中心点。
  // 宽度优先但受高度约束，保证大屏铺满、小屏不出界
  function resize() {
    var rect = box.getBoundingClientRect();
    W = Math.max(1, Math.round(rect.width));
    H = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    /* 宽度优先，同时受高度约束：大屏把轨道撑满，小屏不出界 */
    RX = Math.min(W * 0.46, H * 1.35);
    RY = RX * 0.34;
    cx = W / 2;
    cy = H * 0.50;
  }

  resize();
  // resize 监听：拖窗口时会连续触发，用 requestAnimationFrame 合帧，
  // 一帧内只重算一次画布尺寸，否则每次 resize 都重建 canvas 会明显掉帧
  var resizeRaf = null;
  window.addEventListener('resize', function () {
    if (resizeRaf) return;
    resizeRaf = window.requestAnimationFrame(function () {
      resizeRaf = null;
      resize();
    });
  });

  var t = 0;              /* 秒 */
  var last = 0;
  var rafId = null;

  /* 轨道上某点：先算椭圆坐标，再按 tilt 旋转；z = sin(ang) 决定前后（>0 为近侧） */
  function posOn(orbit, ang) {
    var lx = Math.cos(ang) * RX * orbit.k;
    var ly = Math.sin(ang) * RY * orbit.k;
    var ct = Math.cos(orbit.tilt);
    var st = Math.sin(orbit.tilt);
    return {
      x: cx + lx * ct - ly * st,
      y: cy + lx * st + ly * ct,
      z: Math.sin(ang)
    };
  }

  // drawOrbit：画一条轨道椭圆。strong=true 的那两条（k=1.00 与 k=0.76）线更亮更粗，
  // 让主轨道在众多细线里有主次，不至于糊成一片
  function drawOrbit(orbit, strong) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(orbit.tilt);
    ctx.beginPath();
    ctx.ellipse(0, 0, RX * orbit.k, RY * orbit.k, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 238, 255, ' + (strong ? orbit.alpha : orbit.alpha * 0.72).toFixed(3) + ')';
    ctx.lineWidth = strong ? 1.15 : 0.9;
    ctx.stroke();
    ctx.restore();
  }

  // drawCore：中心星体 = 外层光晕 + 球面渐变 + 两条经线 + 一圈边线，四层叠出球体感
  function drawCore() {
    var r = Math.max(9, RX * 0.10);

    var halo = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 2.8);
    halo.addColorStop(0, 'rgba(0, 238, 255, 0.30)');
    halo.addColorStop(0.5, 'rgba(0, 170, 230, 0.10)');
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2.8, 0, Math.PI * 2);
    ctx.fillStyle = halo;
    ctx.fill();

    /* 中心球：径向渐变做出球面明暗 */
    var core = ctx.createRadialGradient(cx - r * 0.38, cy - r * 0.42, r * 0.08, cx, cy, r);
    core.addColorStop(0, 'rgba(232, 254, 255, 0.96)');
    core.addColorStop(0.42, 'rgba(58, 214, 250, 0.74)');
    core.addColorStop(1, 'rgba(6, 42, 72, 0.62)');
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = core;
    ctx.fill();

    /* 球面经线：两条极淡的弧，强化「立体球」的读法 */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.strokeStyle = 'rgba(180, 245, 255, 0.28)';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.42, r, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.85, r, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 238, 255, 0.42)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // drawAsteroid：一颗公转小行星。z>0 视为近侧——更大更亮；远侧缩到 72%、透明度 55%，
  // 这是「轨道有纵深」的唯一视觉依据，别把这段判定删了
  function drawAsteroid(a) {
    var orbit = ORBITS[a.orbit];
    var ang = a.a + t * orbit.speed;
    var p = posOn(orbit, ang);
    /* 近侧更大更亮、远侧更小更暗，形成轨道纵深 */
    var front = p.z > 0;
    var scale = front ? 1 : 0.72;
    var alpha = front ? 1 : 0.55;

    ctx.beginPath();
    ctx.arc(p.x, p.y, a.size * 3.4 * scale, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 238, 255, ' + (0.10 * alpha).toFixed(3) + ')';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, a.size * scale, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(198, 250, 255, ' + (0.9 * alpha).toFixed(3) + ')';
    ctx.fill();
  }

  // drawDust：区块里的星尘微光点，每颗按自己的相位做 sin 呼吸，让空白区一直在「活着」。
  // 坐标来自 DUST 的确定性伪随机，刷新后位置完全不变，不会让人眼捕捉到跳动
  function drawDust() {
    for (var i = 0; i < DUST.length; i++) {
      var d = DUST[i];
      var a = 0.16 + 0.38 * (0.5 + 0.5 * Math.sin(t * 0.9 + d.ph));
      ctx.beginPath();
      ctx.arc(d.x * W, d.y * H, d.s, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(150, 232, 255, ' + a.toFixed(3) + ')';
      ctx.fill();
    }
  }

  // draw：一帧的完整绘制顺序 —— 星尘 → 轨道 → 后半圈小行星 → 中心球 → 前半圈小行星。
  // dt 上限 0.05s：切标签页回来时不做一次性大跳，动画从原状态继续
  function draw(now) {
    if (!W || !H) resize();
    if (!last) last = now;
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;

    ctx.clearRect(0, 0, W, H);

    drawDust();
    ORBITS.forEach(function (o, i) { drawOrbit(o, i === 0 || i === 2); });

    /* 后半圈的小行星先画，再画中心球，最后画前半圈 → 真实的遮挡关系 */
    ASTEROIDS.forEach(function (a) {
      var orbit = ORBITS[a.orbit];
      var ang = a.a + t * orbit.speed;
      if (posOn(orbit, ang).z <= 0) drawAsteroid(a);
    });
    drawCore();
    ASTEROIDS.forEach(function (a) {
      var orbit = ORBITS[a.orbit];
      var ang = a.a + t * orbit.speed;
      if (posOn(orbit, ang).z > 0) drawAsteroid(a);
    });
  }

  function loop(now) {
    draw(now || 0);
    rafId = window.requestAnimationFrame(loop);
  }

  rafId = window.requestAnimationFrame(loop);

  // visibilitychange：切走标签页就停掉 rAF（后台标签页里继续跑 canvas 纯属烧电），
  // 切回来把 last 归零重置时间基准，避免恢复瞬间用巨大的 dt 跳帧
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    } else if (!rafId) {
      last = 0;
      rafId = window.requestAnimationFrame(loop);
    }
  });
})();
