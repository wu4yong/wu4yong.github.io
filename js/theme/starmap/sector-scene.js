/*
  ============================================
  星屿乐园 · 专区背景场景层
  文件：source/js/theme/starmap/sector-scene.js
  适用终端：电脑端（/fun/）
  作用：在雷达图下面铺一层半透明的线稿动画：
        音乐 = 一个人在舞池里跳街舞（律动 / 侧踢 / 风车倒立 / 空翻）；
        游戏 = 飞机大战，战机在陨石之间穿行；
        摄影 = 超跑侧影（兰博那种锋利折线）+ 高光扫过；
        电影 = 放映机光束 + 上浮胶片格；
        随笔 = 江边诗人举杯看月，衣摆随风。
        音乐和游戏会把雷达环 / 扫描 / 节点收掉，场景自己铺满整块，看起来更干净。
        全部用 1px 青线 + 发光 + 低透明度画，人物只留轮廓，和首页那张线稿少年一个调子。
  依赖：fun.js（调用 window.SectorScene.set）、star-jukebox.js（播放/暂停事件）
  最后修改：2026-11-15
  ============================================
*/
(function () {
  'use strict';

  /* 挂在「中间星图区」这一层，不能挂雷达区里：
     非音乐专区展开清单时 .radar-view 会被 display:none 收掉，场景会跟着一起消失。 */
  var host = document.querySelector('.starmap-center') || document.getElementById('radarView');
  if (!host) return;

  var DPR = Math.min(2, window.devicePixelRatio || 1);
  var W = 0;
  var H = 0;
  var key = null;
  var running = false;
  var rafId = 0;
  var t0 = 0;
  var sweepTimer = 0;
  var curtainTimer = 0;

  /* ---------- DOM：画布 + 幕布 ---------- */

  var canvas = document.createElement('canvas');
  canvas.className = 'sector-scene';
  var curtain = document.createElement('div');
  curtain.className = 'sector-scene-curtain';
  curtain.innerHTML = '<i class="sc-top"></i><i class="sc-bottom"></i>';

  host.insertBefore(curtain, host.firstChild);
  host.insertBefore(canvas, curtain.nextSibling);

  var ctx = canvas.getContext('2d');

  function resize() {
    var r = host.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    W = r.width;
    H = r.height;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    return true;
  }

  /* ---------- 画笔小工具 ---------- */

  function stroke(a, w) {
    ctx.strokeStyle = 'rgba(0, 238, 255, ' + a + ')';
    ctx.lineWidth = w || 1;
  }

  function strokeV(a, w) {
    ctx.strokeStyle = 'rgba(143, 125, 255, ' + a + ')';
    ctx.lineWidth = w || 1;
  }

  function glow(blur, color) {
    ctx.shadowColor = color || 'rgba(0, 238, 255, 0.45)';
    ctx.shadowBlur = blur;
  }

  function noGlow() {
    ctx.shadowBlur = 0;
  }

  function seg(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function ring(cx, cy, r, rx) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, r, rx || r, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  function rgba(a) {
    return 'rgba(0, 238, 255, ' + a + ')';
  }

  /* ---------- 街舞单人：律动 → 侧踢 → 风车倒立 → 空翻 ----------
     全身只有骨架线段和空心圆；倒立与空翻不是另画一套人，
     而是把整副骨架转过去、再加一个抬升量，所以动作之间是连的。 */

  /* 两段肢体：角度从正下方起算、顺时针为正；末端一个小空心圈当手 / 脚 */
  function limb(x, y, a1, a2, L1, L2) {
    var px = x + Math.sin(a1) * L1;
    var py = y + Math.cos(a1) * L1;
    seg(x, y, px, py);
    var qx = px + Math.sin(a1 + a2) * L2;
    var qy = py + Math.cos(a1 + a2) * L2;
    seg(px, py, qx, qy);
    ctx.beginPath();
    ctx.arc(qx, qy, 2.4, 0, Math.PI * 2);
    ctx.stroke();
  }

  /* 骨架：脚底落在局部 y = 0，向上为负。H = 身高 */
  function drawDancer(H, pose, a) {
    var hipY = -H * 0.50 + (pose.dip || 0) * H;
    var shY = hipY - H * 0.32;
    var headY = shY - H * 0.10;
    var headR = H * 0.062;
    var hipHalf = H * 0.052;
    var shHalf = H * 0.095;
    var leanX = (pose.lean || 0) * H;

    var shLx = -shHalf + leanX;
    var shRx = shHalf + leanX;

    ctx.save();
    glow(10);
    stroke(a, 1);

    /* 腿 */
    limb(-hipHalf, hipY, pose.legLA, pose.legLB, H * 0.26, H * 0.25);
    limb(hipHalf, hipY, pose.legRA, pose.legRB, H * 0.26, H * 0.25);

    /* 躯干：两条侧线 + 肩线，不闭合，像速写 */
    seg(-hipHalf, hipY, shLx, shY);
    seg(hipHalf, hipY, shRx, shY);
    seg(shLx, shY, shRx, shY);
    seg(-hipHalf * 1.0, hipY - H * 0.05, hipHalf * 1.0, hipY - H * 0.05);

    /* 手臂 */
    limb(shLx, shY, pose.armLA, pose.armLB, H * 0.20, H * 0.18);
    limb(shRx, shY, pose.armRA, pose.armRB, H * 0.20, H * 0.18);

    /* 头：空心圆 + 顶部头发弧 + 一撮斜刘海 + 耳侧耳机短线 */
    ring(leanX, headY, headR, headR);
    ctx.beginPath();
    ctx.arc(leanX, headY, headR, Math.PI * 1.12, Math.PI * 1.94);
    ctx.stroke();
    seg(leanX + headR * 0.05, headY - headR * 0.95, leanX + headR * 0.62, headY - headR * 0.30);
    seg(leanX - headR, headY, leanX - headR + 3.6, headY);
    seg(leanX + headR, headY, leanX + headR - 3.6, headY);

    noGlow();
    ctx.restore();
  }

  /* ---------- 场景一：音乐 · 一个人跳街舞 ---------- */
  function sceneDance(t, w, h) {
    var BPM = 128;
    var beat = t * BPM / 60;
    var ph = beat % 8;                       /* 8 拍一套动作 */
    var gy = h * 0.82;
    var H = Math.min(h * 0.52, w * 0.52);
    var cx = w * 0.5;
    var i, f, y;

    /* 舞池：消失点放射线 + 近处更亮的横线 */
    var vpY = h * 0.28, bot = h * 0.99;
    for (i = -6; i <= 6; i++) {
      stroke(0.05, 1);
      seg(cx + i * w * 0.055, vpY, cx + i * w * 0.17, bot);
    }
    for (i = 0; i < 12; i++) {
      f = i / 12;
      y = vpY + (bot - vpY) * f * f;
      stroke(0.045 + f * 0.10, 1);
      seg(cx - w * (0.10 + f * 0.45), y, cx + w * (0.10 + f * 0.45), y);
    }

    /* 顶光：从上打下来的一束锥形光，随节拍收放 */
    var beam = 0.5 + 0.5 * Math.sin(beat * Math.PI * 0.5);
    var g = ctx.createLinearGradient(cx, 0, cx, gy);
    g.addColorStop(0, 'rgba(0, 238, 255, ' + (0.03 + beam * 0.07) + ')');
    g.addColorStop(1, 'rgba(0, 238, 255, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.04, 0);
    ctx.lineTo(cx + w * 0.04, 0);
    ctx.lineTo(cx + w * 0.34, gy);
    ctx.lineTo(cx - w * 0.34, gy);
    ctx.closePath();
    ctx.fill();

    /* 地面光圈：一圈随节拍扩散，一圈常驻 */
    var pulse = beat % 1;
    ctx.save();
    ctx.translate(cx, gy);
    ctx.scale(1, 0.22);
    glow(12);
    stroke(0.30 - pulse * 0.24, 1);
    ring(0, 0, H * (0.28 + pulse * 0.42), H * (0.28 + pulse * 0.42));
    stroke(0.22, 1);
    ring(0, 0, H * 0.26, H * 0.26);
    ctx.restore();
    noGlow();

    /* 动作：8 拍一套，每 2 拍一段 */
    var seg2 = Math.floor(ph / 2);
    var u = (ph % 2) / 2;
    var rot = 0, lift = 0, b = Math.sin(beat * Math.PI * 2);
    var pose = {
      legLA: -0.20, legLB: 0.06, legRA: 0.20, legRB: -0.06,
      armLA: 0.40, armLB: 0.20, armRA: -0.40, armRB: 0.20,
      dip: 0, lean: 0
    };

    if (seg2 === 0) {
      /* 律动：屈膝打拍，一手举过头顶做波浪 */
      pose.dip = 0.03 + 0.028 * (0.5 - 0.5 * Math.cos(beat * Math.PI * 4));
      pose.legLA = -0.20 - 0.09 * b; pose.legLB = 0.06;
      pose.legRA = 0.20 + 0.09 * b; pose.legRB = -0.06;
      pose.armLA = -2.25 + 0.45 * b; pose.armLB = -0.80 + 0.35 * b;
      pose.armRA = 0.52 - 0.22 * b; pose.armRB = 0.26;
      pose.lean = 0.010 * b;
    } else if (seg2 === 1) {
      /* 侧踢：一条腿送出去，上身反着压 */
      var k = Math.sin(u * Math.PI);
      pose.legLA = -0.10;
      pose.legRA = 1.30 * k;
      pose.legRB = 0.30 * k;
      pose.dip = 0.02;
      pose.lean = -0.055 * k;
      pose.armLA = -1.85 - 0.35 * k; pose.armLB = -0.55;
      pose.armRA = 0.85 + 0.20 * k; pose.armRB = 0.50;
    } else if (seg2 === 2) {
      /* 风车进倒立：绕支点转到 π，同时抬升，让手正好撑到地面 */
      var rr = u < 0.62 ? (u / 0.62) : 1;
      rot = Math.PI * rr;
      lift = H * 1.18 * rr;
      pose.legLA = -0.45 * rr - 0.06; pose.legLB = 0.10;
      pose.legRA = 0.45 * rr + 0.06; pose.legRB = 0.10;
      pose.armLA = Math.PI * rr + 0.30 * (1 - rr); pose.armLB = 0.05;
      pose.armRA = Math.PI * rr + 0.30 * (1 - rr); pose.armRB = 0.05;
      pose.dip = 0;
    } else {
      /* 空翻落回站立：从 π 转到 2π，中间腾空 */
      rot = Math.PI + Math.PI * u;
      lift = H * 1.18 * (1 - u) + H * 0.30 * Math.sin(u * Math.PI);
      pose.legLA = -0.30 * (1 - u) - 0.06; pose.legLB = 0.08 + 0.10 * u;
      pose.legRA = 0.30 * (1 - u) + 0.06; pose.legRB = 0.08 + 0.10 * u;
      pose.armLA = Math.PI * (1 - u) + 0.40 * u; pose.armLB = 0.10;
      pose.armRA = Math.PI * (1 - u) - 0.40 * u; pose.armRB = 0.10;
      pose.dip = 0.02 * u;
    }

    /* 贴地的影子：不跟着人翻转 */
    ctx.save();
    ctx.translate(cx, gy);
    ctx.scale(1, 0.18);
    stroke(0.10, 1);
    ring(0, 0, H * 0.20, H * 0.20);
    ctx.restore();

    /* 人：整体带着旋转与抬升一起画 */
    ctx.save();
    ctx.translate(cx, gy - lift);
    ctx.rotate(rot);
    drawDancer(H, pose, 0.58);
    ctx.restore();
  }

  /* ---------- 场景二：游戏 · 飞机大战：战机在陨石之间穿行 ---------- */

  /* 线稿战机：三角机身 + 后掠翼 + 座舱 + 抖动的双折线尾焰 */
  function drawJet(cx, cy, s, bank, a, t) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(bank);
    glow(10);
    stroke(a, 1.1);

    ctx.beginPath();
    ctx.moveTo(0, -20 * s);
    ctx.lineTo(5.5 * s, 10 * s);
    ctx.lineTo(0, 7 * s);
    ctx.lineTo(-5.5 * s, 10 * s);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-4.5 * s, -2 * s);
    ctx.lineTo(-21 * s, 9 * s);
    ctx.lineTo(-17 * s, 12 * s);
    ctx.lineTo(-3.5 * s, 8 * s);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(4.5 * s, -2 * s);
    ctx.lineTo(21 * s, 9 * s);
    ctx.lineTo(17 * s, 12 * s);
    ctx.lineTo(3.5 * s, 8 * s);
    ctx.stroke();

    ring(0, -4.5 * s, 3.4 * s, 4.6 * s);
    seg(-8 * s, 11 * s, 8 * s, 11 * s);

    var flick = 0.55 + 0.45 * Math.sin(t * 9);
    ctx.beginPath();
    ctx.moveTo(-3 * s, 10 * s);
    ctx.lineTo(0, (10 + 9 * flick) * s);
    ctx.lineTo(3 * s, 10 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-1.4 * s, 10 * s);
    ctx.lineTo(0, (10 + 4.5 * flick) * s);
    ctx.lineTo(1.4 * s, 10 * s);
    ctx.stroke();

    noGlow();
    ctx.restore();
  }

  /* 陨石：不规则七边形 + 两道裂纹 */
  function drawRock(x, y, r, rot, a) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    glow(7);
    stroke(a, 1);
    var n = 7, i;
    ctx.beginPath();
    for (i = 0; i < n; i++) {
      var ang = i / n * Math.PI * 2;
      var rr = r * (0.76 + 0.24 * Math.abs(Math.sin(i * 2.1)));
      var px = Math.cos(ang) * rr;
      var py = Math.sin(ang) * rr;
      if (i) {
        ctx.lineTo(px, py);
      } else {
        ctx.moveTo(px, py);
      }
    }
    ctx.closePath();
    ctx.stroke();
    stroke(a * 0.55, 1);
    seg(-r * 0.35, -r * 0.45, r * 0.12, r * 0.05);
    seg(r * 0.12, r * 0.05, -r * 0.10, r * 0.55);
    noGlow();
    ctx.restore();
  }

  function sceneShooter(t, w, h) {
    var i;

    /* 高速星痕：一路往下拉的短竖线，暗示在往前飞 */
    for (i = 0; i < 30; i++) {
      var sx = ((i * 0.618) % 1) * w;
      var sy = ((i * 0.371 + t * 0.55) % 1) * h;
      stroke(0.04 + 0.10 * (1 - sy / h), 1);
      seg(sx, sy, sx, sy + 13 + (i % 3) * 5);
    }

    /* 陨石 / 障碍：九块，各走一条固定航道，越靠近镜头越亮 */
    var rocks = [
      [0.12, 0.55, 24, 0.6], [0.34, 0.30, 17, 1.9], [0.58, 0.68, 28, 3.1],
      [0.84, 0.24, 20, 4.4], [0.22, 0.90, 15, 5.7], [0.70, 0.88, 23, 7.0],
      [0.48, 0.12, 21, 8.3], [0.92, 0.74, 14, 9.6], [0.04, 0.18, 18, 11.0]
    ];
    for (i = 0; i < rocks.length; i++) {
      var R = rocks[i];
      var f = (t * 0.085 + R[3] * 0.075) % 1;
      var ry = -0.16 * h + f * 1.32 * h;
      var rr = R[2] * Math.min(h / 860, 1.9);
      drawRock(w * R[0] + Math.sin(t * 0.6 + R[3]) * 14, ry, rr, t * 0.4 + R[3],
        0.09 + 0.13 * Math.sin(f * Math.PI));
    }

    /* 战机：左右摆着躲，转向时带一点压角 */
    var px = w * (0.5 + 0.22 * Math.sin(t * 0.9) + 0.055 * Math.sin(t * 2.7));
    var py = h * 0.74;
    var bank = 0.16 * Math.cos(t * 0.9) + 0.05 * Math.cos(t * 2.7);
    var s = Math.min(h / 330, 3.2);

    /* 子弹：六发循环，从机头往上飞，越远越淡 */
    for (i = 0; i < 6; i++) {
      var f2 = (t * 1.4 + i / 6) % 1;
      var by = py - 14 - f2 * h * 0.62;
      stroke(0.34 - f2 * 0.22, 1);
      seg(px, by, px, by - 12 * s);
    }

    drawJet(px, py, s, bank, 0.62, t);

    /* 机头前方一点光 */
    glow(14);
    stroke(0.10, 1);
    ring(px + Math.sin(bank) * 6, py - 22 * s, 3.4 * s, 3.4 * s);
    noGlow();
  }

  /* ---------- 场景三：摄影 · 超跑侧影（兰博那种锋利折线） ----------
     低多边形楔形车身：一条腰线切出车头斜面，两个大轮，尾翼斜切；
     背景是成排的平行斜线，一条高光沿腰线扫过去。 */
  function scenePhoto(t, w, h) {
    var cw = Math.min(w * 0.80, h * 1.10);
    var s = cw / 320;
    var bx = w * 0.5;
    var by = h * 0.72;
    var i, k;

    /* 背景速度线：同一套斜角，长短错开 */
    for (i = 0; i < 13; i++) {
      var yy = h * (0.10 + i * 0.058);
      stroke(0.028 + (i % 3) * 0.010, 1);
      seg(w * 0.02, yy, w * 0.98, yy - 11);
    }

    /* 地面：两条长横线 */
    stroke(0.11, 1);
    seg(w * 0.03, by, w * 0.97, by);
    stroke(0.05, 1);
    seg(w * 0.12, by + 6, w * 0.88, by + 6);

    /* 车底阴影：一排短斜线，靠中间更密更亮 */
    for (i = -10; i <= 10; i++) {
      var hx = bx + i * cw * 0.045;
      stroke(0.04 + 0.035 * (1 - Math.abs(i) / 10), 1);
      seg(hx, by + 7, hx + cw * 0.022, by + 21);
    }

    ctx.save();
    ctx.translate(bx, by);
    glow(10);

    /* 车身轮廓：楔形 —— 低鼻、斜切挡风、车顶弧、尾部切角 */
    stroke(0.46, 1.2);
    ctx.beginPath();
    ctx.moveTo(-158 * s, -6 * s);
    ctx.lineTo(-140 * s, -26 * s);
    ctx.lineTo(-96 * s, -34 * s);
    ctx.lineTo(-52 * s, -74 * s);
    ctx.lineTo(10 * s, -96 * s);
    ctx.lineTo(58 * s, -92 * s);
    ctx.lineTo(104 * s, -58 * s);
    ctx.lineTo(150 * s, -46 * s);
    ctx.lineTo(152 * s, -26 * s);
    ctx.stroke();
    /* 车底边 + 尾灯 */
    stroke(0.28, 1);
    seg(-118 * s, -5 * s, 122 * s, -5 * s);
    seg(146 * s, -38 * s, 146 * s, -27 * s);

    /* 腰线：一条贯穿的折线，是这张脸的表情 */
    stroke(0.30, 1);
    seg(-96 * s, -34 * s, -40 * s, -40 * s);
    seg(-40 * s, -40 * s, 60 * s, -44 * s);
    seg(60 * s, -44 * s, 150 * s, -50 * s);

    /* 前大灯：两条短斜线 */
    seg(-136 * s, -26 * s, -106 * s, -31 * s);
    seg(-136 * s, -17 * s, -110 * s, -22 * s);

    /* 侧进气口：一排斜线，这家车的记号 */
    stroke(0.26, 1);
    for (i = 0; i < 4; i++) {
      seg(34 * s + i * 9 * s, -50 * s - i * 2 * s, 48 * s + i * 9 * s, -34 * s - i * 2 * s);
    }

    /* 尾翼：一块斜板 + 两根支撑 */
    stroke(0.32, 1);
    seg(104 * s, -74 * s, 148 * s, -68 * s);
    seg(120 * s, -74 * s, 120 * s, -56 * s);

    /* 车轮：两个大空心圆 + 六根辐条，慢慢转 */
    var wl = -92 * s, wr2 = 96 * s, wrad = 34 * s, wy = -wrad;
    for (i = 0; i < 2; i++) {
      var wx = i ? wr2 : wl;
      stroke(0.40, 1.2);
      ring(wx, wy, wrad, wrad);
      stroke(0.18, 1);
      ring(wx, wy, wrad * 0.62, wrad * 0.62);
      var rot = t * 1.5 * (i ? -1 : 1);
      for (k = 0; k < 6; k++) {
        var a2 = rot + k * Math.PI / 3;
        seg(wx + Math.cos(a2) * wrad * 0.16, wy + Math.sin(a2) * wrad * 0.16,
          wx + Math.cos(a2) * wrad * 0.46, wy + Math.sin(a2) * wrad * 0.46);
      }
    }

    /* 高光：一条亮线沿腰线从车头扫到车尾 */
    var hi = (t * 0.17) % 1;
    var gx = -152 * s + hi * 306 * s;
    ctx.save();
    ctx.globalAlpha = 0.55;
    stroke(0.60, 1.4);
    glow(16, 'rgba(160, 246, 255, 0.8)');
    seg(gx, -28 * s, gx - 22 * s, -92 * s);
    ctx.restore();
    noGlow();

    ctx.restore();

    /* 地面上的一点反光：两条短弧，跟着高光一起走 */
    ctx.save();
    ctx.globalAlpha = 0.16;
    stroke(0.30, 1);
    ctx.beginPath();
    ctx.ellipse(bx + (hi - 0.5) * cw * 0.8, by + 10, cw * 0.16, cw * 0.022, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  /* ---------- 场景四：电影 · 放映机光束 + 上浮的胶片格 ---------- */
  function sceneMovie(t, w, h) {
    var px = w * 0.14;
    var py = h * 0.86;

    /* 放映机：一个线稿盒子 + 两个片盘 */
    stroke(0.24);
    glow(8);
    ctx.strokeRect(px - 26, py - 30, 44, 30);
    ring(px - 14, py - 40, 9, 9);
    ring(px + 4, py - 40, 9, 9);
    seg(px + 18, py - 18, px + 26, py - 18);
    noGlow();

    /* 两束光：从镜头射向右上，用渐变三角填，靠近镜头亮、远端散 */
    var g1 = ctx.createLinearGradient(px + 22, py - 20, w * 0.72, h * 0.18);
    g1.addColorStop(0, 'rgba(0, 238, 255, 0.16)');
    g1.addColorStop(1, 'rgba(0, 238, 255, 0)');
    ctx.fillStyle = g1;
    ctx.beginPath();
    ctx.moveTo(px + 24, py - 22);
    ctx.lineTo(w * 0.80, h * 0.05);
    ctx.lineTo(w * 0.86, h * 0.34);
    ctx.closePath();
    ctx.fill();

    var g2 = ctx.createLinearGradient(px + 22, py - 20, w * 0.62, h * 0.55);
    g2.addColorStop(0, 'rgba(143, 125, 255, 0.13)');
    g2.addColorStop(1, 'rgba(143, 125, 255, 0)');
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.moveTo(px + 24, py - 22);
    ctx.lineTo(w * 0.56, h * 0.30);
    ctx.lineTo(w * 0.30, h * 0.62);
    ctx.closePath();
    ctx.fill();

    /* 光束里的尘埃：几个小点慢速上升 */
    var i;
    for (i = 0; i < 14; i++) {
      var u = ((i / 14) + t * 0.05) % 1;
      var dx = px + 30 + u * w * 0.62;
      var dy = py - 20 - u * h * 0.62 + Math.sin(t * 0.7 + i) * 8;
      stroke(0.30 - u * 0.22, 1);
      ctx.beginPath();
      ctx.arc(dx, dy, 1.2, 0, Math.PI * 2);
      ctx.stroke();
    }

    /* 上浮的胶片格：带齿孔的竖条，倾斜着慢慢升起 */
    for (i = 0; i < 5; i++) {
      var f = ((i / 5) + t * 0.045) % 1;
      var fx = w * (0.20 + i * 0.15) + Math.sin(t * 0.5 + i) * 10;
      var fy = h * 0.95 - f * h * 0.85;
      var alpha = 0.06 + (1 - Math.abs(f - 0.5) * 2) * 0.13;
      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(-0.12 + Math.sin(t * 0.4 + i) * 0.05);
      stroke(alpha);
      var fw = 22, fh = 60;
      ctx.strokeRect(-fw / 2, -fh / 2, fw, fh);
      /* 齿孔 */
      for (var q = 0; q < 5; q++) {
        ctx.strokeRect(-fw / 2 + 2, -fh / 2 + 4 + q * 11, 3, 3);
        ctx.strokeRect(fw / 2 - 5, -fh / 2 + 4 + q * 11, 3, 3);
      }
      /* 画面格 */
      ctx.strokeRect(-fw / 2 + 5, -fh / 2 + 8, fw - 10, fh - 22);
      ctx.restore();
    }

    /* 银幕边缘：上下两条很淡的亮框，缓慢闪 */
    var fl = 0.05 + Math.abs(Math.sin(t * 2.4)) * 0.06;
    stroke(fl);
    seg(w * 0.06, h * 0.10, w * 0.94, h * 0.10);
    seg(w * 0.06, h * 0.94, w * 0.94, h * 0.94);
  }

  /* ---------- 场景五：随笔 · 江边诗人举杯看月 ---------- */
  function sceneEssay(t, w, h) {
    var i, k;
    var cx = w * 0.52;
    var gy = h * 0.84;
    var H = Math.min(h * 0.46, w * 0.68);

    /* 月亮 + 两层月晕，呼吸 */
    var mr = Math.min(w, h) * 0.072;
    var mx = w * 0.24, my = h * 0.22;
    var br = 0.55 + 0.45 * Math.sin(t * 0.7);
    stroke(0.34 * br, 1);
    ring(mx, my, mr, mr);
    stroke(0.11 * br, 1);
    ring(mx, my, mr * 1.30, mr * 1.30);
    stroke(0.05 * br, 1);
    ring(mx, my, mr * 1.72, mr * 1.72);

    /* 远山：两段折线，基线不同 */
    for (k = 0; k < 2; k++) {
      var base = h * (0.46 + k * 0.11);
      stroke(0.10 - k * 0.03, 1);
      ctx.beginPath();
      for (i = 0; i <= 30; i++) {
        var qx = w * (i / 30);
        var qy = base - h * 0.055 * Math.abs(Math.sin(i * 0.42 + k * 1.7)) - k * h * 0.02;
        if (i === 0) { ctx.moveTo(qx, qy); } else { ctx.lineTo(qx, qy); }
      }
      ctx.stroke();
    }

    /* 江面：七道横线，往下越来越淡 */
    for (i = 0; i < 7; i++) {
      stroke(0.14 - i * 0.014, 1);
      seg(w * (0.10 - i * 0.008), h * (0.84 + i * 0.018), w * (0.90 + i * 0.010), h * (0.84 + i * 0.018));
    }

    /* 诗人：发髻 + 冠巾 + 宽袖长袍，一手举杯 */
    ctx.save();
    ctx.translate(cx, gy);
    glow(10);

    var sway = Math.sin(t * 0.9) * H * 0.020;
    var headR = H * 0.055;
    var headY = -H * 0.90;
    var shY = -H * 0.82;
    var hipY = -H * 0.48;

    /* 头 + 发髻 + 冠巾垂带 + 下颌 */
    stroke(0.46, 1);
    ring(0, headY, headR, headR);
    ring(-headR * 0.15, headY - headR * 1.02, headR * 0.42, headR * 0.42);
    seg(-headR * 0.15, headY - headR * 0.55, -headR * 1.05, headY + headR * 0.30);
    ctx.beginPath();
    ctx.arc(0, headY + headR * 0.10, headR * 0.78, Math.PI * 0.35, Math.PI * 0.65);
    ctx.stroke();

    /* 颈 + 肩线 */
    seg(-headR * 0.6, headY + headR * 0.9, -H * 0.02, shY + H * 0.01);
    seg(-H * 0.10, shY + H * 0.005, H * 0.10, shY + H * 0.005);

    /* 袍身：肩宽 → 腰窄 → 下摆展开 */
    stroke(0.34, 1);
    ctx.beginPath();
    ctx.moveTo(-H * 0.10, shY + H * 0.005);
    ctx.quadraticCurveTo(-H * 0.135 + sway, hipY - H * 0.02, -H * 0.185 + sway, -H * 0.02);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(H * 0.10, shY + H * 0.005);
    ctx.quadraticCurveTo(H * 0.125 + sway, hipY - H * 0.02, H * 0.175 + sway, -H * 0.015);
    ctx.stroke();

    /* 交领：V 字衣领 */
    stroke(0.30, 1);
    seg(-H * 0.075, shY + H * 0.02, -H * 0.02, shY + H * 0.16);
    seg(H * 0.045, shY + H * 0.02, -H * 0.02, shY + H * 0.16);

    /* 腰带 + 下摆弧线，让衣摆不是一块板 */
    stroke(0.24, 1);
    seg(-H * 0.095, hipY, H * 0.095, hipY);
    stroke(0.20, 1);
    ctx.beginPath();
    ctx.moveTo(-H * 0.185 + sway, -H * 0.02);
    ctx.quadraticCurveTo(-H * 0.02, -H * 0.075, H * 0.175 + sway, -H * 0.015);
    ctx.stroke();

    /* 下摆分衩：左右两片，外撇拖地 */
    stroke(0.16, 1);
    ctx.beginPath();
    ctx.moveTo(-H * 0.06 + sway, hipY + H * 0.02);
    ctx.quadraticCurveTo(-H * 0.13 + sway, hipY + H * 0.10, -H * 0.155 + sway, -H * 0.005);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(H * 0.05 + sway, hipY + H * 0.02);
    ctx.quadraticCurveTo(H * 0.12 + sway, hipY + H * 0.10, H * 0.145 + sway, -H * 0.004);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-H * 0.185 + sway, -H * 0.02);
    ctx.quadraticCurveTo(-H * 0.10 + sway, -H * 0.048, -H * 0.03 + sway, -H * 0.02);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(H * 0.022 + sway, -H * 0.018);
    ctx.quadraticCurveTo(H * 0.105 + sway, -H * 0.045, H * 0.175 + sway, -H * 0.015);
    ctx.stroke();

    /* 衣褶：三条从上垂下来的细线，长短不一 */
    stroke(0.09, 1);
    seg(-H * 0.06 + sway, hipY + H * 0.01, -H * 0.10 + sway, -H * 0.05);
    seg(-H * 0.01 + sway, hipY + H * 0.01, -H * 0.03 + sway, -H * 0.04);
    seg(H * 0.05 + sway, hipY + H * 0.01, H * 0.08 + sway, -H * 0.03);

    /* 左袖：拱手在身前，宽袖一弧 */
    stroke(0.30, 1);
    ctx.beginPath();
    ctx.moveTo(-H * 0.11, shY + H * 0.03);
    ctx.quadraticCurveTo(-H * 0.16 + sway * 0.6, hipY + H * 0.04, -H * 0.06, hipY + H * 0.02);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-H * 0.11, shY + H * 0.06);
    ctx.quadraticCurveTo(-H * 0.14 + sway * 0.6, hipY + H * 0.03, -H * 0.03, hipY + H * 0.01);
    ctx.stroke();

    /* 右臂举杯 */
    var handX = H * 0.24, handY = shY - H * 0.09 + Math.sin(t * 1.4) * H * 0.006;
    seg(H * 0.09, shY + H * 0.01, handX - H * 0.045, handY + H * 0.030);
    seg(handX - H * 0.045, handY + H * 0.030, handX, handY);
    stroke(0.34, 1);
    ctx.beginPath();
    ctx.moveTo(handX - H * 0.024, handY - H * 0.006);
    ctx.lineTo(handX + H * 0.024, handY - H * 0.006);
    ctx.lineTo(handX + H * 0.016, handY - H * 0.045);
    ctx.lineTo(handX - H * 0.016, handY - H * 0.045);
    ctx.closePath();
    ctx.stroke();

    /* 脚下的一道地面线 */
    stroke(0.16, 1);
    seg(-H * 0.19, -H * 0.002, H * 0.18, -H * 0.002);

    noGlow();
    ctx.restore();

    /* 落叶：几片小三角，边转边飘 */
    for (i = 0; i < 7; i++) {
      var u = ((i / 7) + t * 0.05) % 1;
      var lx = w * (0.18 + i * 0.09) + Math.sin(t * 0.6 + i * 2) * w * 0.02;
      var ly = h * 0.16 + u * h * 0.70;
      stroke(0.06 + 0.06 * Math.sin(u * Math.PI), 1);
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(t * 0.5 + i);
      seg(0, -5, 3, 3);
      seg(0, -5, -3, 3);
      seg(-3, 3, 3, 3);
      ctx.restore();
    }
  }
  /* 右边栏的曲目数（歌单没加载出来时退回矩阵里的占位数） */
  function trackCount() {
    var el = document.querySelector('.coord-item[data-sector="music"]');
    if (!el) return 0;
    var v = parseInt(el.getAttribute('data-count'), 10);
    return isFinite(v) && v > 0 ? v : 0;
  }

  /* ---------- 主循环 ---------- */

  /* 现只启用游戏的飞机大战；其余场景函数保留备用，set() 里已拦截非 game 的 key */
  var SCENES = {
    music: sceneDance,
    movie: sceneMovie,
    photo: scenePhoto,
    game: sceneShooter,
    essay: sceneEssay
  };

  function tick(now) {
    if (!running) return;
    if (!W || !H) {
      if (!resize()) {
        rafId = window.requestAnimationFrame(tick);
        return;
      }
    }
    var t = (now - t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    var fn = SCENES[key];
    if (fn) fn(t, W, H);
    rafId = window.requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    if (!resize()) return;
    running = true;
    t0 = performance.now();
    /* 先同步画一帧：这个页面有时在后台被启动，rAF 不转的话画布会一直空着 */
    ctx.clearRect(0, 0, W, H);
    var first = SCENES[key];
    if (first) first(0, W, H);
    rafId = window.requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    ctx.clearRect(0, 0, W, H);
  }

  /* 电影开幕：上下两道幕布合拢遮住，再退开；画布在幕布合到位那一刻直接关掉。
     这里不靠 CSS 过渡收尾——过渡一旦被浏览器节流，画布会一直亮着。 */
  function curtainSweep() {
    curtain.classList.remove('is-sweep');
    void curtain.offsetWidth;   /* 强制回流，同一套 keyframes 才能连续触发 */
    curtain.classList.add('is-sweep');
    if (sweepTimer) window.clearTimeout(sweepTimer);
    sweepTimer = window.setTimeout(function () {
      canvas.style.opacity = '0';
      canvas.classList.remove('is-on');
      canvas.classList.add('is-off');
      stop();
    }, 430);
    curtainTimer = window.setTimeout(function () {
      curtain.classList.remove('is-sweep');
    }, 1260);
  }

  /* 音乐 / 游戏两块把雷达环、扫描、节点一起收掉：
     场景自己铺满整块中心区，看着比叠在雷达上干净。
     这里只动 .radar-view 的子元素，星图底 canvas 留着当背景。 */
  function radarClean(on) {
    if (on) {
      host.classList.add('is-scene-clean');
    } else {
      host.classList.remove('is-scene-clean');
    }
  }

  function set(k) {
    /* 只有游戏专区保留飞机大战场景，其余专区回到纯雷达 */
    if (k !== 'game') { k = null; }
    radarClean(k === 'game');
    if (!k) {
      if (key) curtainSweep();
      key = null;
      return;
    }
    if (!SCENES[k]) return;
    var changed = k !== key;
    key = k;
    if (sweepTimer) window.clearTimeout(sweepTimer);
    canvas.style.opacity = '1';
    canvas.classList.remove('is-off');
    canvas.classList.add('is-on');
    if (changed) t0 = performance.now();
    start();
  }

  /* 播放时收起场景，暂停/关闭播放器再放回来（只对音乐区有意义） */
  document.addEventListener('jukebox:play', function () {
    if (key === 'music') curtainSweep();
  });
  document.addEventListener('jukebox:pause', function () {
    if (key === 'music') set('music');
  });
  document.addEventListener('jukebox:close', function () {
    if (key) set(key);
  });

  /* 窗口尺寸变了重算画布，别让线稿被拉变形 */
  var rsTimer = 0;
  window.addEventListener('resize', function () {
    if (rsTimer) window.clearTimeout(rsTimer);
    rsTimer = window.setTimeout(function () {
      if (resize() && running) t0 = performance.now();
    }, 180);
  });

  window.SectorScene = { set: set, stop: stop };

  /* 预览入口：/fun/?scene=music|game|photo|movie|essay 直接把某一幕铺上来看
     （只影响背景层，不动左右栏与雷达节点，调试与验收用） */
  (function preview() {
    var m;
    try {
      m = new RegExp('[?&]scene=([a-z]+)').exec(window.location.search);
    } catch (e) { m = null; }
    if (!m || !SCENES[m[1]]) return;
    var trySet = function (n) {
      if (!resize() && n > 0) {
        window.setTimeout(function () { trySet(n - 1); }, 120);
        return;
      }
      set(m[1]);
    };
    if (document.readyState === 'complete') trySet(6);
    else window.addEventListener('load', function () { trySet(6); });
  })();
})();
