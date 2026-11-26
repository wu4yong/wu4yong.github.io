/* ============================================
   星图控制台动态层脚本
   文件：source/js/theme/starmap-live.js
   适用终端：电脑端（星图手记 / 星迹索引 / 秘境主人）
   作用：按页面已有文章数据动态生成雷达标题星群、K 线频谱、
        滚动日志、轨道带小星星，并按访问次数重排侧栏热门标签
   依赖：source/css/theme/starmap-live.css、_components/InplaceReader.njk
   最后修改：2026-11-11
   ============================================ */
(function () {
  'use strict';

  var PALETTE = ['#00eeff', '#8f7dff', '#ffd166', '#ff6fae', '#5dffa8', '#ff9d5c', '#7fd6ff'];
  var SHAPES = ['star', 'planet', 'orbit', 'sparkle', 'diamond', 'hex'];

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* 去掉文章标题里的「一、」「十二、」「１、」这类序号前缀，只渲染标题本体 */
  function stripPrefix(t) {
    if (!t) return '';
    return t
      .replace(/^[\s　]*[一二三四五六七八九十百零〇两]+[\s　]*[、.．·:：)）][\s　]*/, '')
      .replace(/^[\s　]*\d+[\s　]*[、.．·:：)）][\s　]*/, '')
      .replace(/^[\s　]*[（(][\s　]*[一二三四五六七八九十百零〇两\d]+[\s　]*[)）][\s　]*/, '')
      .trim();
  }

  /* ---------- 采集页面数据：坐标矩阵里已有的文章 ---------- */
  function collectPosts() {
    var out = [];
    var seen = {};
    document.querySelectorAll('[data-title][data-url]').forEach(function (el) {
      var t = el.dataset.title;
      var u = el.dataset.url;
      if (!t || !u || seen[u]) return;
      seen[u] = 1;
      out.push({ title: t, url: u, date: el.dataset.date || '' });
    });

    /* 秘境主人这类没有文章清单的页面，退化为用页面里的坐标行标题 */
    if (!out.length) {
      document.querySelectorAll('.coord-item').forEach(function (el) {
        var text = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (text) out.push({ title: text.slice(0, 24), url: '', date: '' });
      });
    }
    if (!out.length) out.push({ title: '星图待索引', url: '', date: '' });
    return out;
  }

  /* ---------- 1. 雷达区：随机标题星群 ---------- */
  function buildRadarTitles(posts) {
    var radar = document.getElementById('radarView') || document.querySelector('.radar-view');
    if (!radar || !posts.length) return;

    var layer = radar.querySelector('.radar-titles');
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'radar-titles';
      radar.appendChild(layer);
    } else {
      layer.innerHTML = '';
    }

    var total = Math.min(30, Math.max(14, Math.round(posts.length / 6)));
    var gold = Math.PI * (3 - Math.sqrt(5));

    for (var i = 0; i < total; i++) {
      var item = posts[Math.floor(Math.random() * posts.length)];
      var color = pick(PALETTE);
      var shape = pick(SHAPES);

      var ring = i < total / 2 ? 1 : 2;
      var radiusPct = ring === 1 ? rnd(0.42, 0.66) : rnd(0.7, 0.94);
      var angle = i * gold + rnd(-0.08, 0.08);

      var node = document.createElement('div');
      node.className = 'rt-node';
      node.style.left = (50 + Math.cos(angle) * radiusPct * 46) + '%';
      node.style.top = (50 + Math.sin(angle) * radiusPct * 46) + '%';
      node.style.setProperty('--rt-c', color);
      node.style.animationDuration = rnd(5.5, 11).toFixed(2) + 's';
      node.style.animationDelay = (-rnd(0, 6)).toFixed(2) + 's';
      node.title = item.title + (item.date ? ' · ' + item.date : '');
      /* 把来源文章信息挂到节点上：radar-core.js 靠它把星点吸附到对应轨道 / 标签 */
      node.setAttribute('data-url', item.url || '');
      node.setAttribute('data-date', item.date || '');

      var glyph = document.createElement('span');
      glyph.className = 'rt-shape rt-shape-' + shape;

      var label = document.createElement('span');
      label.className = 'rt-label';
      var shown = stripPrefix(item.title);
      label.textContent = shown.length > 9 ? shown.slice(0, 9) + '…' : shown;

      node.appendChild(glyph);
      node.appendChild(label);
      layer.appendChild(node);

      (function (data) {
        // click：雷达图上的文章标题点一下 → 调 StarmapReader 就地打开正文（不跳页）。
        // 只认左键；stopPropagation 是为了拦住外层雷达容器的点击，避免弹出别的面板
        node.addEventListener('click', function (e) {
          if (e.button !== 0) return;
          e.preventDefault();
          e.stopPropagation();
          if (data.url && window.StarmapReader) {
            window.StarmapReader.open({
              url: data.url,
              title: data.title,
              meta: data.date ? ('ARCHIVED ' + data.date) : ''
            });
          }
        });
      })(item);
    }
  }

  /* ---------- 2. 星图频谱：K 线图 + 标题随烛滚动 ---------- */
  function buildKline(posts) {
    var box = document.querySelector('.spectrum-box');
    if (!box) return;
    box.innerHTML = '';

    var sample = posts.slice();
    if (sample.length > 22) {
      sample = [];
      var step = posts.length / 22;
      for (var s = 0; s < 22; s++) sample.push(posts[Math.floor(s * step)]);
    }
    if (!sample.length) {
      sample = [{ title: '星图待索引', date: '' }];
    }

    var track = document.createElement('div');
    track.className = 'kline-track';
    track.style.animationDuration = Math.max(26, sample.length * 1.7).toFixed(1) + 's';

    var price = 50;
    function buildRun() {
      sample.forEach(function (p, idx) {
        var open = price;
        price = Math.max(8, Math.min(94, price + rnd(-16, 16)));
        var close = price;
        var up = close >= open;
        var top = Math.min(open, close);
        var bodyH = Math.max(3, Math.abs(close - open));
        var wickTop = Math.max(2, top - rnd(2, 8));
        var wickH = Math.min(96 - wickTop, bodyH + rnd(4, 14));

        /* 标题沉到底部，K 线主体在区域正中上下居中，整体按区域高度等比放大 */
        var boxH = box.clientHeight || 108;
        var titleSpace = 22;                       /* 底部标题占位 */
        var padTop = 8;
        var area = Math.max(30, boxH - padTop - titleSpace);
        var bodyPx = Math.max(10, Math.round(area * (0.42 + (bodyH / 100) * 0.40)));
        var centerY = titleSpace + area / 2;       /* 距区域底部的中心线 */
        var bodyBottom = Math.max(0, Math.round(centerY - bodyPx / 2));
        var wickPx = Math.max(bodyPx + 6, Math.round(area * (0.55 + (wickH / 100) * 0.35)));
        var wickBottom = Math.max(0, Math.round(centerY - wickPx / 2));

        var item = document.createElement('div');
        item.className = 'kline-item';

        var label = document.createElement('span');
        label.className = 'kline-title';
        var shown = stripPrefix(p.title);
        label.textContent = shown.length > 6 ? shown.slice(0, 6) : shown;
        label.title = p.title;

        var wick = document.createElement('span');
        wick.className = 'kline-wick';
        wick.style.bottom = wickBottom + 'px';
        wick.style.height = wickPx + 'px';

        var body = document.createElement('span');
        body.className = 'kline-body ' + (up ? 'up' : 'down');
        body.style.height = bodyPx + 'px';
        body.style.marginBottom = bodyBottom + 'px';

        item.appendChild(label);
        item.appendChild(wick);
        item.appendChild(body);
        track.appendChild(item);
      });
    }

    buildRun();
    buildRun(); /* 复制一份，配合 translateX(-50%) 无缝循环 */

    box.appendChild(track);

    // mouseenter / mouseleave：鼠标进入频谱区就暂停自动滚动（.is-paused 由 CSS 停掉 animation），
    // 移出即恢复——否则用户想看清某根蜡烛时内容一直在走
    box.addEventListener('mouseenter', function () { box.classList.add('is-paused'); });
    box.addEventListener('mouseleave', function () { box.classList.remove('is-paused'); });
  }

  /* ---------- 3. 信息日志：自上而下滚动 + 严重级别 ---------- */
  function buildLog(posts) {
    var list = document.querySelector('.log-list');
    if (!list) return;

    var items = Array.prototype.slice.call(list.querySelectorAll('.log-item'));
    if (!items.length) return;

    var first = posts[0] ? posts[0].title : '未知记录';

    var critical = document.createElement('div');
    critical.className = 'log-item log-item-critical';
    critical.innerHTML =
      '<span class="log-time"></span>' +
      '<span class="log-tag">严重</span>' +
      '<span class="log-text">索引偏移超限，已冻结当前批次：' + (first.length > 10 ? first.slice(0, 10) : first) + '</span>';

    var scroller = document.createElement('div');
    scroller.className = 'log-scroller';
    scroller.style.animationDuration = Math.max(22, items.length * 2.4).toFixed(1) + 's';

    items.forEach(function (el) { scroller.appendChild(el.cloneNode(true)); });
    scroller.appendChild(critical.cloneNode(true));
    items.forEach(function (el) { scroller.appendChild(el.cloneNode(true)); });
    scroller.appendChild(critical.cloneNode(true));

    list.innerHTML = '';
    list.appendChild(scroller);

    var box = list.closest('.log-box');
    if (box) {
    // mouseenter / mouseleave：鼠标停在日志框上时挂 .is-hovering，CSS 借此停掉自动滚动，
    // 让用户能安心读某一条日志；移出后继续往下走
    box.addEventListener('mouseenter', function () { box.classList.add('is-hovering'); });
    box.addEventListener('mouseleave', function () { box.classList.remove('is-hovering'); });
    }

    /* 时间戳：第一行（系统）用电脑本机时间，往下每行依次减 5 秒，形成「逐条发生」的时序 */
    var times = list.querySelectorAll('.log-time');
    var perRun = Math.max(1, Math.round(times.length / 2)); // 日志跑两遍做无缝循环，按单轮编号算时差
    function stamp() {
      var base = new Date();
      function p(n) { return n < 10 ? '0' + n : '' + n; }
      Array.prototype.forEach.call(times, function (el, i) {
        var d = new Date(base.getTime() - (i % perRun) * 5000);
        el.textContent = d.getFullYear() + '.' + p(d.getMonth() + 1) + '.' + p(d.getDate()) +
          ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
      });
    }
    stamp();
    // 每秒刷新一次时间戳（stamp 只改文本，不重建节点），关掉页面时随 DOM 一起回收
    setInterval(stamp, 1000);
  }

  /* ---------- 4. 轨道数据带：小圆球改小星星 + 按篇数比例标注标题 ---------- */
  function buildOrbital(posts) {
    var track = document.querySelector('.orbital-track');
    if (!track) return;

    track.querySelectorAll('.orbital-star').forEach(function (el) { el.remove(); });

    var rails = [20, 40, 60, 80];
    var count = Math.min(20, Math.max(10, Math.round(posts.length / 7)));
    var hasPos = window.getComputedStyle(track).position;
    if (hasPos === 'static') track.style.position = 'relative';

    for (var i = 0; i < count; i++) {
      var item = posts[Math.floor(Math.random() * posts.length)];
      var rail = rails[i % rails.length];
      var dur = rnd(20, 34);
      var color = pick(PALETTE);

      var star = document.createElement('div');
      star.className = 'orbital-star';
      star.style.top = rail + '%';
      star.style.animationDuration = dur.toFixed(1) + 's';
      star.style.animationDelay = (-rnd(0, dur)).toFixed(1) + 's';
      star.style.setProperty('--os-c', color);

      var shape = document.createElement('span');
      shape.className = 'orbital-star-shape';

      var label = document.createElement('span');
      label.className = 'orbital-star-label';
      var shown = stripPrefix(item.title);
      label.textContent = shown.length > 8 ? shown.slice(0, 8) : shown;

      star.appendChild(shape);
      star.appendChild(label);
      track.appendChild(star);

      (function (data) {
        star.style.pointerEvents = 'auto';
        star.style.cursor = 'pointer';
        // click：轨道星点上的文章名点一下 → 交给 StarmapReader 就地打开（与雷达标题同一套行为）。
        // 星点本身只做视觉，靠这里显式打开 pointerEvents，否则会被 .orbital-track 的遮罩挡住
        star.addEventListener('click', function (e) {
          if (e.button !== 0) return;
          e.preventDefault();
          if (data.url && window.StarmapReader) {
            window.StarmapReader.open({
              url: data.url,
              title: data.title,
              meta: data.date ? ('ARCHIVED ' + data.date) : ''
            });
          }
        });
      })(item);
    }
  }

  /* ---------- 5. 侧栏热门标签 ----------
     排序与点击计数已统一挪到 source/js/theme/sidebar.js（Sidebar.njk 全站引入），
     这里不再重复绑定，避免同一页面点击被计两次。 */

  // DOMContentLoaded：等整份 HTML 解析完再收集文章卡片（collectPosts 依赖 .post-item 上的 data-*），
  // 然后依次搭出雷达标题、K 线频谱、日志流、轨道星点四个面板
  document.addEventListener('DOMContentLoaded', function () {
    var posts = collectPosts();
    buildRadarTitles(posts);
    buildKline(posts);
    buildLog(posts);
    buildOrbital(posts);
  });
})();
