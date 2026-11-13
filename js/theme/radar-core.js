/*
  ============================================
  星图雷达内核（阶段 1 + 2）
  文件：source/js/theme/radar-core.js
  适用终端：电脑端 /archives/（时间引力奇点）与 /tags/（多节点引力场）
  作用：统一接管雷达区的布局、连线、粒子、聚焦反馈与跨页上下文
        视图差异通过 root.dataset.view（timeline / graph）分派，
        每个视图一套独立参数表（见 CFG），渲染逻辑共用
  依赖：radar-view.css、star-reader.css、chronicle.css、tags.css
  最后修改：2026-11-13
  ============================================
*/
(function () {
  'use strict';

  var root = document.getElementById('radarView');
  if (!root) return;

  var VIEW = root.getAttribute('data-view') === 'timeline' ? 'timeline' : 'graph';

  /* ============ 六、参数化配置表：每个视图一套，改观感只动这里 ============ */
  var CFG = {
    /* 视图 A：时间坐标矩阵 —— 单向时序流，一圈 = 一个年份 */
    timeline: {
      rMin: 132,             // 最内圈（最旧年份）半径，须大于核心文字块半径
      rMaxPad: 52,           // 最外圈距画布边缘的留白
      goldenAngle: 137.508,  // 节点沿轨道的错位角，避免挤在一条射线上
      startAngle: -90,       // 第一个节点从正上方开始
      orbitOpacity: [0.16, 0.42],   // 轨道透明度：旧 → 新
      dotScale: [0.62, 1.2],        // 星点大小：旧 → 新
      linkCurve: 0.55,       // 相邻年份弧线向中心内收的比例（越大越弯）
      linkColor: '#00eeff',
      linkDash: [10, 7],
      particles: { count: 92, mode: 'collapse', speed: 0.85, size: [0.6, 1.9] },
      focusDim: true
    },
    /* 视图 B：标签图谱 —— 多节点引力场，质量越大越靠内 */
    graph: {
      rMin: 74,
      rMaxPad: 58,
      goldenAngle: 137.508,
      startAngle: -90,
      massRadiusPow: 0.85,   // 半径随质量衰减的曲线（1 = 线性，<1 = 大质量更贴核心）
      linkMinWeight: 1,      // 共现篇数下限
      linkMax: 44,           // 最多画多少条引力丝，控制性能
      linkCurve: 0.28,
      linkColor: '#8f7dff',
      particles: { count: 70, mode: 'cluster', speed: 0.55, size: [0.5, 1.6] },
      focusDim: true
    }
  };
  var cfg = CFG[VIEW];

  /* ============ 基础工具 ============ */
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function svgEl(tag) { return document.createElementNS('http://www.w3.org/2000/svg', tag); }

  var canvas = null, ctx = null, dpr = 1;
  var svg = root.querySelector('.starmap-lines');
  var hud = null, grid = null;
  var nodes = [];
  var geometry = { cx: 0, cy: 0, rMin: 0, rMax: 0 };
  var particles = [];
  var rafId = 0;
  var links = [];

  /* ============ 1. 图层准备（公共底层） ============ */
  function initLayers() {
    canvas = document.createElement('canvas');
    canvas.className = 'rv-canvas';
    root.insertBefore(canvas, root.firstChild);
    ctx = canvas.getContext('2d');

    /* HUD 刻度环 + 极坐标网格各一份，两个视图共用 */
    if (!hud) {
      hud = document.createElement('div');
      hud.className = 'rv-hud';
      root.appendChild(hud);
    }
    if (!grid) {
      grid = document.createElement('div');
      grid.className = 'rv-grid';
      root.appendChild(grid);
    }
    /* 连线 SVG 若不存在则补一个 */
    if (!svg) {
      svg = svgEl('svg');
      svg.setAttribute('class', 'starmap-lines rv-links');
      root.appendChild(svg);
    } else {
      svg.classList.add('rv-links');
    }
    root.classList.add('is-entering');
    setTimeout(function () { root.classList.remove('is-entering'); }, 1000);
  }

  /* ============ 2. 收集节点 ============ */
  function collectNodes() {
    nodes = [];
    var list;
    if (VIEW === 'timeline') {
      list = root.querySelectorAll('.year-node');
      list.forEach(function (el, i) {
        nodes.push({
          el: el,
          id: el.getAttribute('data-year') || String(i),
          value: Number(el.getAttribute('data-count') || 0),
          order: Number(el.getAttribute('data-year') || i)
        });
      });
      /* 年份一律正序：内圈旧、外圈新 */
      nodes.sort(function (a, b) { return a.order - b.order; });
    } else {
      list = root.querySelectorAll('.stargate-node');
      list.forEach(function (el, i) {
        nodes.push({
          el: el,
          id: el.getAttribute('data-tag-name') || String(i),
          value: Number(el.getAttribute('data-count') || 0),
          order: i
        });
      });
    }

    var maxValue = 1;
    nodes.forEach(function (n) { if (n.value > maxValue) maxValue = n.value; });
    nodes.forEach(function (n) { n.mass = n.value / maxValue; });
  }

  /* ============ 3. 布局（每个视图独立空间规则） ============ */
  function measure() {
    var w = root.clientWidth, h = root.clientHeight;
    geometry.cx = w / 2;
    geometry.cy = h / 2;
    if (VIEW === 'graph') {
      /* B 视图：核心文字块只占中心一条，rMin 可以压到 92，
         让「大质量贴核心、小质量飘外圈」的层次真正拉开（原来 122 起步，
         1420 档环带只有 34px，20 个标签全挤成一坨） */
      geometry.rMax = Math.max(96, Math.min(w, h) / 2 - cfg.rMaxPad);
      geometry.rMin = Math.min(geometry.rMax * 0.56, Math.max(cfg.rMin, 92));
    } else {
      geometry.rMax = Math.max(90, Math.min(w, h) / 2 - cfg.rMaxPad);
      /* 内圈必须躲开中心核心文字块（约 140px 宽），但空间实在不够时按比例退让 */
      geometry.rMin = Math.min(geometry.rMax * 0.66, Math.max(cfg.rMin, 122));
    }
    return geometry;
  }

  function layout() {
    measure();
    if (VIEW === 'timeline') layoutTimeline(); else layoutGraph();
    drawLinks();
    snapStarNodes();
    positionParticles();
  }

  /* A：一圈一年份，节点吸附在各自轨道上
     年份多（>=4）时改走阿基米德螺旋：角度随半径连续推进，标签自然错开，
     不再出现 11 个年份沿黄金角互相穿插的情况 */
  function layoutTimeline() {
    var N = nodes.length;
    var orbits = root.querySelectorAll('.rv-orbit');
    /* 清掉上一轮的轨道再重建（resize 时半径全变） */
    orbits.forEach(function (o) { o.remove(); });

    if (!N) return;

    var spiral = N >= 4;
    var sweepDeg = spiral ? Math.min(520, 140 + N * 34) : (N - 1) * cfg.goldenAngle;

    nodes.forEach(function (n, i) {
      var t = N > 1 ? i / (N - 1) : 0.5;
      var r = geometry.rMin + (geometry.rMax - geometry.rMin) * t;
      var deg = N > 1 ? (spiral ? cfg.startAngle + (i * (sweepDeg / (N - 1))) : cfg.startAngle + i * cfg.goldenAngle)
                      : cfg.startAngle;
      var rad = deg * Math.PI / 180;

      n.r = r;
      n.deg = deg;
      n.x = geometry.cx + r * Math.cos(rad);
      n.y = geometry.cy + r * Math.sin(rad);
      n.radius = clamp(0.5 + n.mass * 0.6, 0.5, 1.1);      /* 命中判定用（相对画布短边） */

      n.el.style.left = n.x + 'px';
      n.el.style.top = n.y + 'px';

      /* 最新两圈算"新"，其余沉淀为旧 */
      var isNew = i >= N - 2 || N <= 2;
      n.el.setAttribute('data-age', isNew ? 'new' : 'old');
      n.el.style.opacity = isNew ? '1' : String(0.55 + n.mass * 0.25);

      /* 每个年份一条轨道圈 */
      var orbit = document.createElement('div');
      orbit.className = 'rv-orbit';
      orbit.setAttribute('data-age', isNew ? 'new' : 'old');
      orbit.style.width = (r * 2) + 'px';
      orbit.style.height = (r * 2) + 'px';
      orbit.style.animationDelay = (0.04 * i) + 's';
      orbit.style.opacity = '0';
      root.insertBefore(orbit, hud);
      /* 圈多时整体压暗，否则 11 条同心环会糊成一片纹理 */
      var opa = N >= 8 ? [0.07, 0.24] : cfg.orbitOpacity;
      var op = opa[0] + (N > 1 ? (i / (N - 1)) : 1) * (opa[1] - opa[0]);
      orbit.style.borderColor = 'rgba(0, 238, 255, ' + op.toFixed(2) + ')';
      /* 圈间距过窄时改点线，避免实线叠出摩尔纹 */
      if (N >= 8 && i < N - 2) orbit.style.borderStyle = 'dashed';
    });
  }

  /* B：质量决定半径，大质量更贴核心 */
  function layoutGraph() {
    var N = nodes.length;
    if (!N) return;

    nodes.forEach(function (n, i) {
      /* 质量映射到"离核心距离"：重的东西被引力拉得更近 */
      var pull = Math.pow(1 - n.mass, cfg.massRadiusPow);
      var r = geometry.rMin + (geometry.rMax - geometry.rMin) * clamp(pull, 0, 1);
      var deg = cfg.startAngle + i * cfg.goldenAngle;
      var rad = deg * Math.PI / 180;

      n.r = r;
      n.deg = deg;
      n.x = geometry.cx + r * Math.cos(rad);
      n.y = geometry.cy + r * Math.sin(rad);
      n.radius = clamp(0.4 + n.mass * 0.7, 0.4, 1.1);

      n.el.style.left = n.x + 'px';
      n.el.style.top = n.y + 'px';
      n.el.style.setProperty('--rv-mass', n.mass.toFixed(3));
    });
  }

  /* ============ 4. 连线（两视图的视觉差异主要落在这里） ============ */
  function clearLinks() {
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    links = [];
  }

  function drawLinks() {
    clearLinks();
    if (VIEW === 'timeline') drawTimelineLinks(); else drawGraphLinks();
  }

  /* A：只连时间相邻的年份，单向光带（旧 → 新），不交叉 */
  function drawTimelineLinks() {
    for (var i = 0; i < nodes.length - 1; i++) {
      var a = nodes[i], b = nodes[i + 1];
      /* 控制点朝中心内收，形成同心的弧形带；角度差越大越贴近弦，
         否则螺旋布局下弧会大幅穿过核心区 */
      var gap = Math.abs((((b.deg - a.deg) % 360) + 540) % 360 - 180);
      var curve = cfg.linkCurve * (1 - Math.min(1, gap / 110) * 0.62);
      var cxp = geometry.cx + ((a.x + b.x) / 2 - geometry.cx) * curve;
      var cyp = geometry.cy + ((a.y + b.y) / 2 - geometry.cy) * curve;

      var path = svgEl('path');
      path.setAttribute('d', 'M ' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) +
        ' Q ' + cxp.toFixed(1) + ' ' + cyp.toFixed(1) + ' ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1));
      path.setAttribute('stroke', cfg.linkColor);
      path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke-opacity', String(0.2 + (i / Math.max(1, nodes.length - 1)) * 0.4));
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-dasharray', cfg.linkDash.join(' '));
      /* 流动方向：旧 → 新（只朝外扩散，体现单向时序） */
      path.setAttribute('class', 'rv-link rv-flow-out');
      path.style.animationDelay = (i * 0.12) + 's';
      svg.appendChild(path);
      links.push({ a: a, b: b, el: path });
    }
  }

  /* B：不画任何连线（用户已明确去掉那根实线，连弱关联的虚线也不要）。
     关联关系仍由 computeAffinity() 供给 focusGraph()，用来做「一级关联点亮」，
     只是不再落到 SVG 上。 */
  function drawGraphLinks() {
    return;
  }

  /* 共现：同一篇文章同时属于两个标签 → 一条关联 */
  function computeCooccurrence() {
    var dataset = document.querySelector('.tag-dataset');
    if (!dataset) return [];

    var postTags = {};
    dataset.querySelectorAll('.tag-posts').forEach(function (box) {
      var tag = box.getAttribute('data-tag');
      box.querySelectorAll('.tag-post-data').forEach(function (p) {
        var url = p.getAttribute('data-url');
        if (!url) return;
        (postTags[url] || (postTags[url] = [])).push(tag);
      });
    });

    var weights = {};
    Object.keys(postTags).forEach(function (url) {
      var tags = postTags[url];
      if (tags.length < 2) return;
      /* 一篇文章挂的标签过多时（如 10+）多半是宽泛标签，跳过组合避免噪声 */
      if (tags.length > 8) return;
      for (var i = 0; i < tags.length; i++) {
        for (var j = i + 1; j < tags.length; j++) {
          var key = tags[i] + '\u0000' + tags[j];
          weights[key] = (weights[key] || 0) + 1;
        }
      }
    });

    var byId = {};
    nodes.forEach(function (n) { byId[n.id] = n; });

    var out = [];
    Object.keys(weights).forEach(function (key) {
      var w = weights[key];
      if (w < cfg.linkMinWeight) return;
      var parts = key.split('\u0000');
      var a = byId[parts[0]], b = byId[parts[1]];
      if (!a || !b) return;
      out.push({ a: a, b: b, w: w });
    });

    out.sort(function (x, y) { return y.w - x.w; });
    return out;
  }

  /* 同分类亲和：同一 rank（首页菜单分类顺序）的标签互相吸引，
     强度按两者的质量叠加，质量越大丝越粗 */
  function computeAffinity() {
    var groups = {};
    nodes.forEach(function (n) {
      var rank = n.el.getAttribute('data-rank') || '9999';
      if (rank === '9999') return;              /* 未收录进菜单的标签不连，留在外层深空 */
      (groups[rank] || (groups[rank] = [])).push(n);
    });

    var out = [];
    Object.keys(groups).forEach(function (rank) {
      var g = groups[rank];
      if (g.length < 2) return;
      for (var i = 0; i < g.length; i++) {
        for (var j = i + 1; j < g.length; j++) {
          out.push({ a: g[i], b: g[j], w: 1 + (g[i].mass + g[j].mass) * 2 });
        }
      }
    });
    out.sort(function (x, y) { return y.w - x.w; });
    return out;
  }

  /* ============ 4.5 文章星点吸附（阶段 2 的空间规则） ============ */
  /* starmap-live.js 先随机撒了一圈 .rt-node，这里把它们拉回该去的地方：
     A 视图吸附到所属年份的轨道上，B 视图吸附到所属标签的引力范围里 */
  function snapStarNodes() {
    var stars = root.querySelectorAll('.rt-node');
    if (!stars.length) return;

    var tagOfPost = {};
    var dataset = document.querySelector('.tag-dataset');
    if (dataset) {
      dataset.querySelectorAll('.tag-posts').forEach(function (box) {
        var tag = box.getAttribute('data-tag');
        box.querySelectorAll('.tag-post-data').forEach(function (p) {
          var u = p.getAttribute('data-url');
          if (u) tagOfPost[u] = tag;
        });
      });
    }

    var used = {};                       /* 每个宿主节点已吸了几颗，避免糊成一团 */

    /* 雷达区越小，越不该塞满标题星点：按面积裁掉超额的那部分 */
    var area = root.clientWidth * root.clientHeight;
    var keepMax = area < 300000 ? 12 : (area < 460000 ? 20 : 99);
    stars.forEach(function (el, idx) {
      if (idx >= keepMax) el.style.display = 'none';
      else el.style.display = '';
    });

    stars.forEach(function (el) {
      var url = el.getAttribute('data-url') || '';

      if (VIEW === 'timeline') {
        var m = /^(\d{4})/.exec(el.getAttribute('data-date') || '');
        var year = m ? m[1] : '';
        var host = null;
        for (var i = 0; i < nodes.length; i++) if (nodes[i].id === year) { host = nodes[i]; break; }
        if (!host) return;

        /* 沿轨道散开：每颗星按序错角；圈数多时单轨容量收小（11 圈只有 15px 间距，塞 7 颗必糊） */
        used[host.id] = (used[host.id] || 0) + 1;
        var cap = nodes.length >= 8 ? 4 : 7;
        if (used[host.id] > cap) { el.classList.add('is-snapped'); el.style.opacity = '0.32'; return; }
        var ang = host.deg * Math.PI / 180 + (used[host.id] - 1) * (nodes.length >= 8 ? 2.2 : 0.86) + rnd(-0.16, 0.16);
        var rr = host.r + rnd(-8, 8);
        el.style.left = (geometry.cx + rr * Math.cos(ang)) + 'px';
        el.style.top = (geometry.cy + rr * Math.sin(ang)) + 'px';
        el.classList.add('is-snapped');
        return;
      }

      var tag = tagOfPost[url];
      if (!tag) return;
      var hostTag = null;
      for (var j = 0; j < nodes.length; j++) if (nodes[j].id === tag) { hostTag = nodes[j]; break; }
      if (!hostTag) return;

      used[tag] = (used[tag] || 0) + 1;
      if (used[tag] > 5) { el.classList.add('is-snapped'); el.style.opacity = '0.3'; return; }
      /* 角度挑在标签文字的上下两侧，刻意跳开正下方 70°~110°（node-label 就挂在节点下方 22px） */
      var slots = [-62, -8, 148, 196, 38];
      var a2 = (slots[used[tag] - 1] * Math.PI) / 180 + rnd(-0.14, 0.14);
      var r2 = rnd(34, 74) * (0.78 + hostTag.mass * 0.42);
      el.style.left = (hostTag.x + r2 * Math.cos(a2)) + 'px';
      el.style.top = (hostTag.y + r2 * Math.sin(a2) * 0.85) + 'px';
      el.classList.add('is-snapped');
    });
  }

  /* ============ 5. 粒子系统（公共池，参数按视图注入） ============ */
  function sizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(root.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(root.clientHeight * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function positionParticles() {
    var want = cfg.particles.count;
    if (window.innerWidth < 1180) want = Math.round(want * 0.45);
    /* 雷达区矮于 420px 也降采样，窄屏挤成一团时粒子再少一点 */
    if (root.clientHeight < 420) want = Math.round(want * 0.6);

    particles = [];
    var w = root.clientWidth, h = root.clientHeight;

    for (var i = 0; i < want; i++) {
      if (VIEW === 'timeline') {
        /* 向心坍缩：从外圈往奇点走，越近越快 */
        particles.push({
          ang: rnd(0, Math.PI * 2),
          r: rnd(geometry.rMin, geometry.rMax * 1.15),
          sp: rnd(0.3, 1) * cfg.particles.speed,
          size: rnd(cfg.particles.size[0], cfg.particles.size[1]),
          a: rnd(0.25, 0.8)
        });
      } else {
        /* 团状环绕：围绕若干高权重节点公转，模拟引力场 */
        particles.push({
          host: i % Math.max(1, Math.min(6, nodes.length)),
          ang: rnd(0, Math.PI * 2),
          r: rnd(14, 64),
          sp: rnd(0.08, 0.3) * cfg.particles.speed * (Math.random() < 0.5 ? -1 : 1),
          size: rnd(cfg.particles.size[0], cfg.particles.size[1]),
          a: rnd(0.2, 0.65)
        });
      }
    }
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    sizeCanvas();
  }

  function tick() {
    rafId = 0;
    if (!ctx || document.hidden) return;

    var w = root.clientWidth, h = root.clientHeight;
    ctx.clearRect(0, 0, w, h);

    if (VIEW === 'timeline') {
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.r -= p.sp * (1 + (geometry.rMax - p.r) / geometry.rMax * 1.6);
        if (p.r < 18) { p.r = geometry.rMax * rnd(1.02, 1.2); p.ang = rnd(0, Math.PI * 2); }
        var x = geometry.cx + p.r * Math.cos(p.ang);
        var y = geometry.cy + p.r * Math.sin(p.ang);
        ctx.beginPath();
        ctx.fillStyle = 'rgba(120, 235, 255,' + p.a + ')';
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      for (var j = 0; j < particles.length; j++) {
        var q = particles[j];
        var host = nodes[q.host];
        if (!host) continue;
        q.ang += q.sp * 0.02;
        var hx = host.x + q.r * Math.cos(q.ang);
        var hy = host.y + q.r * Math.sin(q.ang) * 0.82;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(170, 158, 255,' + q.a + ')';
        ctx.arc(hx, hy, q.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (!document.hidden) rafId = requestAnimationFrame(tick);
  }

  function startParticles() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  }

  /* ============ 6. 聚焦 / 选中反馈 ============ */
  function dimOthers(keep) {
    if (!cfg.focusDim) return;
    nodes.forEach(function (n) {
      if (keep.indexOf(n) >= 0) {
        n.el.classList.remove('rv-dimmed');
      } else {
        n.el.classList.add('rv-dimmed');
      }
    });
    root.classList.add('is-focused');
  }

  function clearFocus() {
    root.classList.remove('is-focused');
    nodes.forEach(function (n) { n.el.classList.remove('rv-dimmed', 'rv-anchor-pulse'); });
    var beams = svg.querySelectorAll('.rv-beam');
    beams.forEach(function (b) { b.remove(); });
  }

  /* A：奇点射出定向光束 + 相邻年份时序链整条高亮 */
  function focusTimeline(node) {
    clearFocus();
    var idx = nodes.indexOf(node);
    var keep = [node];
    if (idx > 0) keep.push(nodes[idx - 1]);
    if (idx < nodes.length - 1) keep.push(nodes[idx + 1]);
    dimOthers(keep);

    var beam = svgEl('line');
    beam.setAttribute('x1', geometry.cx);
    beam.setAttribute('y1', geometry.cy);
    beam.setAttribute('x2', node.x);
    beam.setAttribute('y2', node.y);
    beam.setAttribute('class', 'rv-beam');
    svg.appendChild(beam);

    links.forEach(function (l) {
      var related = keep.indexOf(l.a) >= 0 && keep.indexOf(l.b) >= 0;
      l.el.setAttribute('stroke-opacity', related ? '0.85' : '0.12');
    });
  }

  /* B：节点冲击波 + 一级关联点亮、其余降暗降噪（关联从 computeAffinity 现算，不画线） */
  function focusGraph(node) {
    clearFocus();
    var neighbors = [node];
    var pairs = computeCooccurrence();
    if (!pairs.length) pairs = computeAffinity();
    pairs.forEach(function (p) {
      if (p.a === node && p.b) neighbors.push(p.b);
      if (p.b === node && p.a) neighbors.push(p.a);
    });
    dimOthers(neighbors);

    var shock = document.createElement('div');
    shock.className = 'rv-shock';
    shock.style.left = node.x + 'px';
    shock.style.top = node.y + 'px';
    /* 同一次点击会被 capture / 内联 handler 各调一次，波纹只保留最新的一个 */
    root.querySelectorAll('.rv-shock').forEach(function (s) { s.remove(); });
    root.appendChild(shock);
    setTimeout(function () { shock.remove(); }, 950);

    /* 节点自身脉冲闪烁（不再从核心拉一条直线出来） */
    node.el.classList.remove('rv-hit');
    void node.el.offsetWidth;
    node.el.classList.add('rv-hit');
    setTimeout(function () { node.el.classList.remove('rv-hit'); }, 1500);
  }

  function focusById(id) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].id === String(id)) { focusNode(nodes[i]); return nodes[i]; }
    }
    return null;
  }

  function focusNode(node) {
    if (!node) return;
    /* 真实点击 → 信息日志（节点这一层统一在这里写，两页都覆盖） */
    if (VIEW === 'timeline') {
      logUser('锁定年份：' + node.id + '（' + node.value + ' 篇）');
      focusTimeline(node);
    } else {
      logUser('点击标签：' + node.id + '（' + node.value + ' 篇）');
      focusGraph(node);
    }
  }

  /* ============ 7. 跨页上下文：记录选中文章 / 年份 / 标签 ============ */
  var STORE_KEY = 'radar:context';

  function readStore() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {};
    } catch (e) { return {}; }
  }

  function writeStore(patch) {
    try {
      var cur = readStore();
      for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) cur[k] = patch[k];
      cur.ts = Date.now();
      localStorage.setItem(STORE_KEY, JSON.stringify(cur));
    } catch (e) { /* 隐私模式下写不进去就算了，不影响渲染 */ }
  }

  /* 本页载入时把"上次在另一页选过的东西"映射回来：
     timeline 页按文章归属年份定位；graph 页按文章所属标签定位 */
  function restoreContext() {
    var store = readStore();

    if (VIEW === 'timeline' && store.articleUrl) {
      var row = document.querySelector('.coord-item[data-url="' + store.articleUrl.replace(/"/g, '\\"') + '"]');
      if (row) {
        var y = row.getAttribute('data-year');
        var node = focusById(y);
        if (node) node.el.classList.add('rv-anchor-pulse');
      }
      return;
    }

    if (VIEW === 'graph' && store.articleUrl) {
      var dataset = document.querySelector('.tag-dataset');
      var hitTag = '';
      if (dataset) {
        dataset.querySelectorAll('.tag-posts').forEach(function (box) {
          if (hitTag) return;
          box.querySelectorAll('.tag-post-data').forEach(function (p) {
            if (!hitTag && p.getAttribute('data-url') === store.articleUrl) hitTag = box.getAttribute('data-tag');
          });
        });
      }
      if (hitTag) {
        var tagNode = focusById(hitTag);
        if (tagNode) tagNode.el.classList.add('rv-anchor-pulse');
      }
    }
  }

  /* ============ 7.5 随机换位（仅 graph 视图，固定 5 秒一次，不看有没有点击） ============
     规则：随机挑两颗可见节点，A 缓慢飘向 B 的位置，抵达瞬间 B 消失、
     A 占住 B 的位置，随后 B 淡入到 A 原来的位置上。
     节奏由 7.6 节的定时器统一驱动（旋转 → 换位），指针动作不再重置。 */
  var swapping = false;

  function swapParticles() {
    if (VIEW !== 'graph' || swapping) return;
    if (nodes.length < 4) return;

    /* 主角随机：不再固定质量最大的那颗 */
    var pool = nodes.filter(function (n) {
      return !n.el.classList.contains('rv-dimmed') && !n.el.classList.contains('rv-hit');
    });
    if (pool.length < 2) return;

    var ai = Math.floor(Math.random() * pool.length);
    var a = pool[ai];
    var rest = pool.filter(function (n) { return n !== a; });
    var b = rest[Math.floor(Math.random() * rest.length)];
    if (!a || !b) return;

    swapping = true;
    var ax = a.x, ay = a.y, ar = a.r, adeg = a.deg;
    var bx = b.x, by = b.y, br = b.r, bdeg = b.deg;

    var ease = 'cubic-bezier(.42,.02,.58,.99)';
    a.el.style.transition = 'left 1.15s ' + ease + ', top 1.15s ' + ease;
    b.el.style.transition = 'opacity .28s ease';

    /* 1) 质量节点缓慢飘向目标位 */
    a.el.style.left = bx + 'px';
    a.el.style.top = by + 'px';
    a.x = bx; a.y = by; a.r = br; a.deg = bdeg;

    /* 2) 抵达那一刻：目标淡出 → 瞬移到原位 → 淡入 */
    setTimeout(function () {
      b.el.style.opacity = '0';
      setTimeout(function () {
        b.el.style.transition = 'none';
        b.el.style.left = ax + 'px';
        b.el.style.top = ay + 'px';
        b.x = ax; b.y = ay; b.r = ar; b.deg = adeg;
        void b.el.offsetWidth;
        b.el.style.transition = 'opacity .4s ease';
        b.el.style.opacity = '';

        setTimeout(function () {
          a.el.style.transition = '';
          b.el.style.transition = '';
          swapping = false;
          snapStarNodes();   /* 依附在标签周围的小行星跟着换到新位置 */
        }, 420);
      }, 32);
    }, 1150);
  }

  /* ============ 7.6 行星每 5 秒顺时针推进（timeline 沿轨道 / graph 绕核心自转） ============ */
  var ROT_MS = 5000;
  var ROT_DEG = 9;
  var rotTimer = 0;

  function rotateTimeline() {
    if (VIEW !== 'timeline' || document.hidden) return;
    nodes.forEach(function (n) {
      /* 屏幕 y 轴向下，角度递增即顺时针；半径不变，只沿轨道滑 */
      n.deg += ROT_DEG;
      var rad = n.deg * Math.PI / 180;
      n.x = geometry.cx + n.r * Math.cos(rad);
      n.y = geometry.cy + n.r * Math.sin(rad);
      n.el.style.left = n.x + 'px';
      n.el.style.top = n.y + 'px';
    });
    drawLinks();      /* 时序光带按新角度重画 */
    snapStarNodes();  /* 吸附的小星点跟着节点走 */
  }

  /* graph 没有轨道圈，用「绕核心自转」：半径（按质量定的远近）不变，只推角度 */
  function rotateGraph() {
    if (VIEW !== 'graph' || document.hidden) return;
    nodes.forEach(function (n) {
      n.deg += ROT_DEG;
      var rad = n.deg * Math.PI / 180;
      n.x = geometry.cx + n.r * Math.cos(rad);
      n.y = geometry.cy + n.r * Math.sin(rad);
      n.el.style.left = n.x + 'px';
      n.el.style.top = n.y + 'px';
    });
    snapStarNodes();  /* 依附在标签周围的小行星跟着走 */
  }

  function startRotation() {
    if (rotTimer) { clearInterval(rotTimer); rotTimer = 0; }
    if (VIEW === 'timeline') {
      rotTimer = setInterval(rotateTimeline, ROT_MS);
    } else if (VIEW === 'graph') {
      /* 同一拍：先整体转 9°，等转到位（1.2s 缓动）再随机换位两颗 */
      rotTimer = setInterval(function () {
        rotateGraph();
        setTimeout(swapParticles, 1250);
      }, ROT_MS);
    }
  }

  /* ============ 7.7 信息日志：用户真实点击 ============
     只往 DOM 里追加，不写 localStorage —— 刷新/重进页面自然清空。
     排序：接在现有模拟日志的最后（append 到 .log-list 末尾）。 */
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function logUser(text, cls) {
    var list = document.querySelector('.log-list');
    if (!list || !text) return;
    var d = new Date();
    var item = document.createElement('div');
    item.className = 'log-item log-item-user' + (cls ? ' log-item-' + cls : '');
    item.innerHTML = '<span class="log-time">' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds()) +
      '</span><span class="log-tag">操作</span><span class="log-text"></span>';
    item.querySelector('.log-text').textContent = text;
    /* 模拟日志都在 .log-scroller 里循环滚，真实点击也挂进去，视觉上连着往下排 */
    var host = list.querySelector('.log-scroller') || list;
    host.appendChild(item);

    /* 只保留最近 12 条点击，避免长时间挂页把滚动队列撑爆 */
    var users = host.querySelectorAll('.log-item-user');
    if (users.length > 12) users[0].remove();
  }

  function labelOf(el, sel, attr) {
    var v = el.getAttribute(attr);
    if (v) return v;
    var sub = el.querySelector(sel);
    return sub ? (sub.textContent || '').trim() : '';
  }

  /* ============ 8. 事件绑定 ============ */
  function bindEvents() {
    nodes.forEach(function (n) {
      /* 节点点击：先做视觉反馈（capture 阶段，不拦默认行为，交给模板里的跳转/展开逻辑） */
      n.el.addEventListener('click', function () { focusNode(n); }, true);

      n.el.addEventListener('mouseenter', function () { focusNode(n); });

      /* 离开时清空聚焦，但要给模板自己的 hover 逻辑留出空间，用微延迟 */
      n.el.addEventListener('mouseleave', function () {
        setTimeout(function () {
          if (!root.classList.contains('is-focused')) return;
          var stillOn = nodes.some(function (x) { return x.el.matches(':hover'); });
          if (!stillOn) clearFocus();
        }, 120);
      });
    });

    /* 左侧坐标行 hover → 雷达定位（替代模板里原来的单线绘制） */
    document.querySelectorAll('.coord-item').forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        var id = VIEW === 'timeline'
          ? row.getAttribute('data-year')
          : row.getAttribute('data-tag-name');
        if (id) focusById(id);
      });
      row.addEventListener('mouseleave', function () { clearFocus(); });
    });

    /* 阅读一篇文章时记下它，切到另一视图还能定位 */
    document.addEventListener('starmap:reader-open', function () {
      var act = document.querySelector('.coord-item.is-reading, .coord-child.is-reading');
      if (act && act.getAttribute('data-url')) writeStore({ articleUrl: act.getAttribute('data-url') });
    });

    window.addEventListener('resize', function () {
      clearFocus();
      layout();
    });

    /* 真实点击 → 信息日志（capture 阶段，跳转前也能记上） */
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;

      var rt = t.closest('.rt-node');
      if (rt) {
        var ttl = labelOf(rt, '.rt-label', 'data-title');
        if (ttl) logUser('打开文章：' + ttl);
        return;
      }

      var row = t.closest('.coord-item, .coord-child');
      if (row) {
        var title = labelOf(row, null, 'data-title') || (row.querySelector('a') ? row.querySelector('a').textContent.trim() : '');
        if (title) logUser('打开文章：' + title);
      }
    }, true);

    /* 5 秒节奏由 7.6 的定时器统一驱动，指针动作不再打断旋转 / 换位 */

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      } else if (!rafId) {
        startParticles();
        startRotation();
      }
    });
  }

  /* ============ 启动 ============ */
  function boot() {
    initLayers();
    collectNodes();
    positionParticles();
    layout();
    bindEvents();
    startParticles();

    /* 等字体与布局稳定后再排一次，避免 clientWidth 读到的还是 0 */
    setTimeout(function () { layout(); restoreContext(); startRotation(); }, 260);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* 暴露给模板内联脚本使用 */
  window.RadarView = {
    view: VIEW,
    relayout: function () { layout(); },
    focus: focusById,
    clear: clearFocus
  };
})();
