/**
 * ============================================================
 * 星野歌单 · 雷达区播放器
 * 文件：themes/butterfly/source/js/theme/star-jukebox.js
 * 适用终端：电脑端 /archives/（星图手记）与 /tags/（星迹索引）
 * 作用：
 *   1) 点侧栏「星野歌单」→ 中间雷达区就地展开播放器（不跳页）
 *   2) 两种视图：背景歌词（stage）/ 左封面右歌词（split）
 *   3) 三种播放模式：列表循环 / 单曲循环 / 随机
 *   4) canvas 绘制星图雷达背景：同心轨道 + 旋转扫描 + 星座连线 + 漂浮粒子
 *   5) 播放时 Web Audio 取真实频谱驱动扫描亮度，取不到就按时间呼吸
 * 数据：
 *   - 曲目：/fun/music/playlist.json（name / artist / url / key）
 *   - 歌词：/fun/music/lyrics/<key>.lrc（缺省自动降级，不报错）
 * 依赖：star-jukebox.css
 * 最后修改：2026-11-14
 * ============================================================
 */
/* 注意：不要写成 window.StarJukebox = (function(){...})()，
   IIFE 没有 return，外层赋值会用 undefined 覆盖内部挂好的全局对象 */
(function () {
  'use strict';

  var PLAYLIST_URL = '/fun/music/playlist.json';
  var LYRIC_DIR = '/fun/music/lyrics/';
  var THEME = [99, 224, 255];

  var root, stageEl, titleEl, artistEl, lyricsEl, listEl;
  var progressEl, fillEl, dotEl, curEl, durEl, playBtn, modeBtn, viewBtn;
  var canvas, ctx2d;

  var list = [];
  var idx = 0;
  var mode = 'loopAll';
  var playing = false;
  var opened = false;
  var lyricLines = [];
  var lyricEls = [];
  var curLyric = -1;
  var audio = null;
  var energy = 0;

  /* ---------------- 工具 ---------------- */

  function fmt(s) {
    if (!isFinite(s) || s < 0) s = 0;
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function $(id) { return document.getElementById(id); }

  /* ---------------- 歌单加载 ---------------- */

  function loadList(cb) {
    if (!window.fetch) return cb([]);
    fetch(PLAYLIST_URL, { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) { list = Array.isArray(data) ? data : []; cb(list); })
      .catch(function (err) {
        console.warn('[star-jukebox] 歌单读取失败：', err);
        cb([]);
      });
  }

  /* ---------------- 歌词解析 ---------------- */

  function parseLrc(text) {
    var out = [];
    if (!text) return out;
    var re = /\[(\d{1,2}):(\d{2})(?:\.[\d]{1,3})?\]/g;
    text.split(/\r?\n/).forEach(function (line) {
      var tags = [];
      var m;
      re.lastIndex = 0;
      while ((m = re.exec(line)) !== null) {
        tags.push(parseInt(m[1], 10) * 60 + parseInt(m[2], 10));
      }
      if (!tags.length) return;
      var body = line.replace(re, '').trim();
      if (!body) return;
      tags.forEach(function (t) { out.push({ t: t, s: body }); });
    });
    out.sort(function (a, b) { return a.t - b.t; });
    return out;
  }

  function loadLyric(item, cb) {
    var key = item.key || '';
    if (!key || !window.fetch) return cb([]);
    fetch(LYRIC_DIR + encodeURIComponent(key) + '.lrc', { cache: 'force-cache' })
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (t) { cb(parseLrc(t)); })
      .catch(function () { cb([]); });
  }

  /* ---------------- 歌词渲染 ---------------- */

  function renderLyric(lines) {
    lyricLines = lines || [];
    lyricEls = [];
    curLyric = -1;
    lyricsEl.innerHTML = '';

    if (!lyricLines.length) {
      var empty = document.createElement('div');
      empty.className = 'sj-lyric-empty';
      empty.textContent = '这首歌还没有歌词文件，去 source/fun/music/lyrics/ 里加一个同名 .lrc 就能滚动';
      lyricsEl.appendChild(empty);
      return;
    }

    lyricLines.forEach(function (ln, i) {
      var p = document.createElement('p');
      p.className = 'sj-lyric-line';
      p.textContent = ln.s;
      p.dataset.i = i;
      p.addEventListener('click', function () { seek(ln.t); });
      lyricsEl.appendChild(p);
      lyricEls.push(p);
    });
  }

  function syncLyric(currentTime) {
    if (!lyricLines.length) return;
    var i = -1;
    for (var k = 0; k < lyricLines.length; k++) {
      if (currentTime >= lyricLines[k].t) i = k;
      else break;
    }
    if (i === curLyric) return;
    curLyric = i;

    lyricEls.forEach(function (el, n) {
      el.classList.toggle('is-on', n === i);
      el.classList.toggle('is-past', n < i);
    });

    var on = lyricEls[i];
    if (on) {
      /* 让当前行停在歌词框垂直中线附近，和酷狗那种滚动手感一致 */
      var box = lyricsEl;
      var target = on.offsetTop - box.clientHeight * 0.42;
      box.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
    }
  }

  /* ---------------- 渲染歌单抽屉 ---------------- */

  function renderListRows() {
    listEl.innerHTML = '';
    list.forEach(function (item, i) {
      var row = document.createElement('button');
      row.type = 'button';
      row.className = 'sj-row';
      row.dataset.i = i;

      var no = document.createElement('span');
      no.className = 'sj-row-no';
      no.textContent = (i + 1 < 10 ? '0' : '') + (i + 1);

      var bars = document.createElement('span');
      bars.className = 'sj-row-bars';
      bars.innerHTML = '<i></i><i></i><i></i>';

      var name = document.createElement('span');
      name.className = 'sj-row-name';
      name.textContent = item.name;

      var ar = document.createElement('span');
      ar.className = 'sj-row-artist';
      ar.textContent = item.artist || '';

      row.appendChild(no);
      row.appendChild(bars);
      row.appendChild(name);
      row.appendChild(ar);
      row.addEventListener('click', function () { switchTo(i, true); });

      listEl.appendChild(row);
    });
    syncActive();
  }

  function syncActive() {
    if (!listEl) return;
    var rows = listEl.querySelectorAll('.sj-row');
    for (var i = 0; i < rows.length; i++) {
      rows[i].classList.toggle('is-active', i === idx);
    }
  }

  /* ---------------- 切歌 ---------------- */

  function switchTo(i, autoplay) {
    if (!list.length) return;
    idx = ((i % list.length) + list.length) % list.length;
    var item = list[idx];
    audio.src = item.url;
    titleEl.textContent = item.name;
    artistEl.textContent = item.artist || '';
    durEl.textContent = '00:00';
    curEl.textContent = '00:00';
    fillEl.style.width = '0%';
    dotEl.style.left = '0%';
    lyricsEl.scrollTop = 0;
    renderLyric([]);
    loadLyric(item, function (lines) {
      if (list[idx] === item) renderLyric(lines);
    });
    syncActive();
    if (autoplay) play();
    else pause();
    /* 换歌后若已经接上 Web Audio，重新绑定一次（src 变了不会自动接） */
    attachAnalyser();
  }

  /* ---------------- 播放控制 ---------------- */

  function play() {
    if (!list.length) return;
    /* 先把全站迷你播放器掐掉，避免两路同时发声 */
    var mini = document.querySelector('#star-mini audio');
    if (mini && !mini.paused) mini.pause();

    var p = audio.play();
    if (p && p.catch) p.catch(function (e) { console.warn('[star-jukebox] 播放失败：', e); });
    playing = true;
    root.classList.add('is-playing');
    playBtn.textContent = '❚❚';
  }

  function pause() {
    audio.pause();
    playing = false;
    root.classList.remove('is-playing');
    playBtn.textContent = '▶';
  }

  function toggle() { playing ? pause() : play(); }

  function seek(t) {
    if (!isFinite(audio.duration)) return;
    audio.currentTime = Math.max(0, Math.min(t, audio.duration - 0.05));
  }

  function next(auto) {
    if (mode === 'shuffle') {
      var n = list.length > 1 ? (idx + 1 + Math.floor(Math.random() * (list.length - 1))) % list.length : idx;
      switchTo(n, true);
      return;
    }
    if (auto && mode === 'single') {
      audio.currentTime = 0;
      play();
      return;
    }
    if (idx === list.length - 1 && mode === 'loopAll') { switchTo(0, true); return; }
    if (idx === list.length - 1 && auto) { pause(); return; }
    switchTo(idx + 1, true);
  }

  function prev() {
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    switchTo(idx - 1, playing);
  }

  /* ---------------- Web Audio 频谱（拿不到就以时间呼吸） ---------------- */

  var actx = null, analyser = null, freqData = null, srcNode = null;

  function attachAnalyser() {
    if (!audio) return;
    if (actx && srcNode && srcNode.mediaElement === audio) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!actx) {
        actx = new AC();
        analyser = actx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.78;
      }
      /* 每次换 src 都要重新建 source（旧 source 绑在老元素状态上） */
      if (srcNode) { try { srcNode.disconnect(); } catch (e) {} }
      srcNode = actx.createMediaElementSource(audio);
      srcNode.connect(analyser);
      analyser.connect(actx.destination);
      freqData = new Uint8Array(analyser.frequencyBinCount);
    } catch (err) {
      actx = null;
      console.warn('[star-jukebox] 频谱不可用，改用呼吸效果：', err);
    }
  }

  function readEnergy() {
    if (analyser && freqData && playing) {
      analyser.getByteFrequencyData(freqData);
      var sum = 0;
      for (var i = 0; i < freqData.length; i++) sum += freqData[i];
      var avg = sum / freqData.length / 255;
      energy += (avg - energy) * 0.18;
    } else {
      var t = Date.now() / 1000;
      var target = playing ? 0.32 + Math.sin(t * 2.1) * 0.08 : 0.06;
      energy += (target - energy) * 0.1;
    }
  }

  /* ---------------- 雷达 canvas ---------------- */

  var dots = [];
  var scanAngle = -Math.PI / 2;
  var rafId = 0;
  var w = 0, h = 0, cx = 0, cy = 0, R = 0;

  function buildDots() {
    dots = [];
    var count = 64;
    for (var i = 0; i < count; i++) {
      var a = Math.random() * Math.PI * 2;
      var r = 0.24 + Math.random() * 0.7;
      dots.push({
        a: a,
        r: r,
        size: 0.6 + Math.random() * 1.5,
        tw: Math.random() * Math.PI * 2,
        twSpeed: 0.4 + Math.random() * 1.4
      });
    }
  }

  function resizeCanvas() {
    if (!canvas) return;
    var rect = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = w / 2;
    cy = h / 2;
    R = Math.min(w, h) * 0.46;
  }

  function drawRadar() {
    if (!ctx2d) return;
    ctx2d.clearRect(0, 0, w, h);

    var t = Date.now() / 1000;
    var boost = 0.55 + energy * 1.1;

    /* 同心轨道：3 圈低亮虚线 */
    ctx2d.lineWidth = 1;
    for (var ring = 1; ring <= 3; ring++) {
      var rr = R * (ring / 3);
      ctx2d.beginPath();
      ctx2d.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx2d.strokeStyle = 'rgba(0, 238, 255, ' + (0.26 + ring * 0.035) + ')';
      ctx2d.setLineDash(ring === 2 ? [6, 10] : [2, 14]);
      ctx2d.stroke();
    }
    ctx2d.setLineDash([]);

    /* 十字刻度线 */
    ctx2d.strokeStyle = 'rgba(0, 238, 255, 0.14)';
    ctx2d.beginPath();
    ctx2d.moveTo(cx - R, cy); ctx2d.lineTo(cx + R, cy);
    ctx2d.moveTo(cx, cy - R); ctx2d.lineTo(cx, cy + R);
    ctx2d.stroke();

    /* 旋转扫描扇形 */
    scanAngle += 0.012 + energy * 0.02;
    if (scanAngle > Math.PI * 2) scanAngle -= Math.PI * 2;
    var sweep = 0.62;
    /* 用多段扇形模拟 conic 渐变，兼容性最好 */
    ctx2d.save();
    ctx2d.translate(cx, cy);
    ctx2d.rotate(scanAngle);
    for (var s = 0; s < 18; s++) {
      var a0 = -(sweep * (s + 1)) / 18;
      var a1 = -(sweep * s) / 18;
      var alpha = (0.26 * boost) * (1 - s / 18);
      ctx2d.beginPath();
      ctx2d.moveTo(0, 0);
      /* a0 < a1，必须用顺时针（false）才能画出 a0→a1 这一小段；
         写成 true 会逆时针绕一整圈，18 段叠满整个圆 */
      ctx2d.arc(0, 0, R, a0, a1, false);
      ctx2d.closePath();
      ctx2d.fillStyle = 'rgba(0, 238, 255, ' + alpha + ')';
      ctx2d.fill();
    }
    /* 扫描前沿那道亮线 */
    ctx2d.beginPath();
    ctx2d.moveTo(0, 0);
    ctx2d.lineTo(R, 0);
    ctx2d.strokeStyle = 'rgba(160, 250, 255, ' + (0.35 * boost) + ')';
    ctx2d.lineWidth = 1.4;
    ctx2d.stroke();
    ctx2d.restore();

    /* 星座点 + 邻近连线 */
    var pts = [];
    dots.forEach(function (d) {
      var x = cx + Math.cos(d.a) * R * d.r;
      var y = cy + Math.sin(d.a) * R * d.r;
      pts.push([x, y]);
      var tw = 0.5 + Math.sin(t * d.twSpeed + d.tw) * 0.5;
      var alpha = (0.35 + tw * 0.45) * (0.6 + energy * 0.6);
      ctx2d.beginPath();
      ctx2d.arc(x, y, d.size, 0, Math.PI * 2);
      ctx2d.fillStyle = 'rgba(190, 245, 255, ' + alpha + ')';
      ctx2d.fill();
    });

    /* 只连距离足够近的点，别画成一团蜘蛛网 */
    ctx2d.strokeStyle = 'rgba(0, 238, 255, ' + (0.16 + energy * 0.18) + ')';
    ctx2d.lineWidth = 0.8;
    for (var i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var dx = pts[i][0] - pts[j][0];
        var dy = pts[i][1] - pts[j][1];
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < R * 0.22) {
          ctx2d.beginPath();
          ctx2d.moveTo(pts[i][0], pts[i][1]);
          ctx2d.lineTo(pts[j][0], pts[j][1]);
          ctx2d.stroke();
        }
      }
    }

    /* 中心核：跟着能量呼吸 */
    var coreR = 5 + energy * 10;
    var cg = ctx2d.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3);
    cg.addColorStop(0, 'rgba(220, 255, 255, ' + (0.75 + energy * 0.25) + ')');
    cg.addColorStop(0.35, 'rgba(99, 224, 255, ' + (0.45 + energy * 0.3) + ')');
    cg.addColorStop(1, 'rgba(99, 224, 255, 0)');
    ctx2d.beginPath();
    ctx2d.arc(cx, cy, coreR * 3, 0, Math.PI * 2);
    ctx2d.fillStyle = cg;
    ctx2d.fill();

    rafId = requestAnimationFrame(drawRadar);
  }

  /* ---------------- 视图 / 面板切换 ---------------- */

  function setView(v) {
    root.dataset.view = v === 'split' ? 'split' : 'stage';
    viewBtn.textContent = v === 'split' ? '背景' : '分栏';
    viewBtn.title = v === 'split' ? '切换成背景歌词' : '切换成左封面右歌词';
  }

  var pane = 'both';

  // both = 左歌单 / 右歌词，两个同时显示；stage / list = 单栏占满
  function setPane(p) {
    pane = p;
    root.dataset.pane = p;
    root.querySelectorAll('.sj-tab').forEach(function (b) {
      b.classList.toggle('is-on', b.dataset.pane === p);
    });
    stageEl.hidden = (p === 'list');
    listEl.hidden = (p === 'stage');
  }

  /* ---------------- 打开 / 收起 ---------------- */

  function open(i) {
    opened = true;
    root.dataset.open = 'true';
    root.setAttribute('aria-hidden', 'false');
    var main = document.querySelector('.starmap-main');
    if (main) main.classList.add('is-jukebox');
    resizeCanvas();
    if (!list.length) {
      artistEl.textContent = '歌单还没加载出来，检查 /fun/music/playlist.json 是否能访问';
      return;
    }
    if (typeof i === 'number') switchTo(i, true);
    else if (!audio.src) switchTo(0, false);
  }

  function close() {
    opened = false;
    pause();
    root.dataset.open = 'false';
    root.setAttribute('aria-hidden', 'true');
    var main = document.querySelector('.starmap-main');
    if (main) main.classList.remove('is-jukebox');
  }

  function isOpen() { return opened; }

  /* ---------------- 事件绑定 ---------------- */

  function bindUi() {
    playBtn.addEventListener('click', toggle);
    $('sjPrev').addEventListener('click', prev);
    $('sjNext').addEventListener('click', function () { next(false); });
    $('sjCloseBtn').addEventListener('click', close);

    viewBtn.addEventListener('click', function () {
      var toStage = root.dataset.view === 'split';
      setView(toStage ? 'stage' : 'split');
      setPane(toStage ? 'stage' : 'both');
    });

    modeBtn.addEventListener('click', function () {
      mode = mode === 'loopAll' ? 'single' : (mode === 'single' ? 'shuffle' : 'loopAll');
      modeBtn.dataset.mode = mode;
      modeBtn.textContent = mode === 'loopAll' ? '列表循环' : (mode === 'single' ? '单曲循环' : '随机播放');
    });

    root.querySelectorAll('.sj-tab').forEach(function (b) {
      b.addEventListener('click', function () { setPane(b.dataset.pane); });
    });

    /* 进度条：点 + 拖 */
    var dragging = false;
    function ratioFromEvent(e) {
      var rect = progressEl.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      return Math.max(0, Math.min(1, x / rect.width));
    }
    function applyPreview(r) {
      fillEl.style.width = (r * 100) + '%';
      dotEl.style.left = (r * 100) + '%';
      if (isFinite(audio.duration)) curEl.textContent = fmt(r * audio.duration);
    }
    progressEl.addEventListener('mousedown', function (e) {
      dragging = true;
      applyPreview(ratioFromEvent(e));
    });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      applyPreview(ratioFromEvent(e));
    });
    window.addEventListener('mouseup', function (e) {
      if (!dragging) return;
      dragging = false;
      seek(ratioFromEvent(e) * audio.duration);
    });

    audio = new Audio();
    /* crossOrigin 必须在设 src 之前，否则第一次请求不带 CORS 头，
       AnalyserNode 只会拿到一堆 0，频谱就退化成假呼吸 */
    audio.crossOrigin = 'anonymous';
    audio.preload = 'none';
    audio.addEventListener('loadedmetadata', function () {
      durEl.textContent = fmt(audio.duration);
    });
    audio.addEventListener('timeupdate', function () {
      var d = audio.duration;
      if (!isFinite(d) || d <= 0) return;
      var r = audio.currentTime / d;
      if (!dragging) {
        fillEl.style.width = (r * 100) + '%';
        dotEl.style.left = (r * 100) + '%';
        curEl.textContent = fmt(audio.currentTime);
      }
      syncLyric(audio.currentTime);
    });
    audio.addEventListener('ended', function () { next(true); });
    audio.addEventListener('play', function () {
      playing = true;
      root.classList.add('is-playing');
      playBtn.textContent = '❚❚';
      attachAnalyser();
      if (actx && actx.state === 'suspended') actx.resume();
    });
    audio.addEventListener('pause', function () {
      playing = false;
      root.classList.remove('is-playing');
      playBtn.textContent = '▶';
    });

    window.addEventListener('resize', function () {
      if (opened) resizeCanvas();
    });

    /* 键盘：J 开关播放器、空格暂停、左右切歌、Esc 收起 */
    document.addEventListener('keydown', function (e) {
      var tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if ((e.key === 'j' || e.key === 'J') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        if (opened) { close(); } else { open(); }
        return;
      }
      if (!opened) return;
      if (e.key === 'Escape') { close(); }
      else if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); toggle(); }
      else if (e.key === 'ArrowRight') { next(false); }
      else if (e.key === 'ArrowLeft') { prev(); }
    });
  }

  /* ---------------- 侧栏入口拦截 ---------------- */

  function hookSidebar() {
    var links = document.querySelectorAll('.links-card a[href="/fun/music/"], .links-card a[href$="/fun/music/"]');
    links.forEach(function (a) {
      a.setAttribute('data-jukebox-trigger', '1');
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        if (opened) close(); else open();
      });
    });
  }

  /* ---------------- 启动 ---------------- */

  function boot() {
    root = $('starJukebox');
    if (!root) return;

    stageEl = $('sjStage');
    titleEl = $('sjTitle');
    artistEl = $('sjArtist');
    lyricsEl = $('sjLyrics');
    listEl = $('sjList');
    progressEl = $('sjProgress');
    fillEl = $('sjFill');
    dotEl = $('sjDot');
    curEl = $('sjCur');
    durEl = $('sjDur');
    playBtn = $('sjPlay');
    modeBtn = $('sjMode');
    viewBtn = $('sjViewBtn');
    canvas = $('sjRadar');
    if (!canvas || !canvas.getContext) return;
    ctx2d = canvas.getContext('2d');

    buildDots();
    bindUi();
    hookSidebar();

    /* 雷达与视图先就位，跟歌单能不能读出来无关 */
    setView('split');
    /* 打开默认分栏：左边歌单、右边歌词，不再一进来就是一片背景歌词 */
    setPane('both');
    resizeCanvas();
    drawRadar();

    loadList(function (data) {
      if (!data.length) {
        artistEl.textContent = '歌单读取失败：/fun/music/playlist.json';
        return;
      }
      renderListRows();
      /* 不自动播放，先把封面信息摆好，点了才出声 */
      var item = list[0];
      titleEl.textContent = item.name;
      artistEl.textContent = item.artist || '';
      loadLyric(item, function (lines) {
        if (idx === 0) renderLyric(lines);
      });
      audio.src = item.url;
      resizeCanvas();
      drawRadar();
      /* 直接访问 /archives/#jukebox 或 /tags/#jukebox 也能直接展开播放器 */
      if (location.hash === '#jukebox') open();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* 对外接口：给控制台调试和外部按钮复用 */
  window.StarJukebox = {
    open: open,
    close: close,
    isOpen: isOpen
  };
})();
