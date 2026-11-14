/**
 * ============================================================
 * 星野歌单播放器
 * 文件：themes/butterfly/source/js/theme/star-player.js
 * 适用终端：电脑端（全站迷你播放器 + /fun/music/ 歌单页大播放器）
 * 作用：
 *   1) 页面里存在 #star-mini 时，渲染左下角固定迷你播放器（全站文章/独立页）
 *   2) 页面里存在 #star-player 时，渲染歌单页的完整播放器 + 环形频谱
 *   3) 歌单数据统一读 /fun/music/playlist.json —— 以后加歌只改那一个 JSON
 * 依赖：
 *   - APlayer：/js/third-party/aplayer/APlayer.min.js（必须先于本文件加载）
 *   - 样式：/css/theme/star-player.css
 * 频谱说明：
 *   图床（GitHub Pages）返回 Access-Control-Allow-Origin: *，
 *   因此可以把 <audio> 接到 Web Audio 的 AnalyserNode 画真实频谱。
 *   若因浏览器策略/CORS 拿不到数据（能量全为 0），自动降级为模拟波形，
 *   视觉一致、不影响播放。
 * ============================================================
 */
window.StarPlayer = (function () {
  'use strict';

  var PLAYLIST_URL = '/fun/music/playlist.json';
  var THEME = '#63e0ff';
  var cache = null;
  var booted = false;

  /* ---------------- 歌单加载 ---------------- */

  function fetchPlaylist(cb) {
    if (cache) return cb(cache);
    if (!window.fetch) return cb([]);
    fetch(PLAYLIST_URL, { cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (list) {
        cache = Array.isArray(list) ? list : [];
        cb(cache);
      })
      .catch(function (err) {
        console.warn('[star-player] 歌单读取失败：', err);
        cb([]);
      });
  }

  /* ---------------- APlayer 实例 ---------------- */

  function build(el, list, isPage) {
    if (!window.APlayer || !list.length) return null;

    var options = {
      container: el,
      audio: list,
      theme: THEME,
      loop: 'all',
      order: 'list',
      preload: 'none',      /* 不预下载，点了才拉音频 */
      volume: 0.6,
      mutex: true,          /* 同页多播放器只允许一个发声 */
      listFolded: !isPage,
      listMaxHeight: isPage ? '460px' : '240px'
    };

    if (!isPage) {
      options.fixed = true;
      options.mini = true;
    }

    var ap = new APlayer(options);

    /* 频谱要靠 Web Audio 读字节流，必须让 audio 以 CORS 方式请求。
       APlayer 建好元素后才方便拿引用，所以这里补设一次并重新加载。 */
    if (ap && ap.audio) {
      try {
        ap.audio.crossOrigin = 'anonymous';
      } catch (e) {}
    }
    return ap;
  }

  /* ---------------- 自建曲目列表（歌单页） ---------------- */

  function buildTrackList(ap, list, mount) {
    var rows = [];
    var current = 0;

    function sync() {
      for (var i = 0; i < rows.length; i++) {
        if (i === current) rows[i].classList.add('is-active');
        else rows[i].classList.remove('is-active');
      }
    }

    list.forEach(function (item, i) {
      var row = document.createElement('button');
      row.type = 'button';
      row.className = 'sp-track';
      row.setAttribute('aria-label', '播放 ' + item.name);

      var no = document.createElement('span');
      no.className = 'sp-no';
      no.textContent = (i + 1 < 10 ? '0' : '') + (i + 1);

      var title = document.createElement('span');
      title.className = 'sp-title';
      title.textContent = item.name;

      var artist = document.createElement('span');
      artist.className = 'sp-artist';
      artist.textContent = item.artist || '';

      /* 播放中的四根小跳线，暂停时静止 */
      var bars = document.createElement('span');
      bars.className = 'sp-bars';
      bars.innerHTML = '<i></i><i></i><i></i><i></i>';

      row.appendChild(no);
      row.appendChild(bars);
      row.appendChild(title);
      row.appendChild(artist);

      row.addEventListener('click', function () {
        ap.list.switch(i);
        ap.play();
      });

      mount.appendChild(row);
      rows.push(row);
    });

    sync();

    ap.on('listswitch', function (data) {
      if (data && typeof data.index === 'number') current = data.index;
      sync();
    });

    /* 未播放时停掉波形跳动 */
    function toggleBars(playing) {
      mount.classList.toggle('is-playing', !!playing);
    }
    ap.on('play', function () { toggleBars(true); });
    ap.on('pause', function () { toggleBars(false); });
  }

  /* ---------------- 频谱可视化 ---------------- */

  function initSpectrum(ap, canvas) {
    if (!canvas || !canvas.getContext) return;
    var ctx2d = canvas.getContext('2d');
    var analyser = null;
    var freqData = null;
    var real = false;
    var fakePhase = 0;
    var fake = [];

    /* 尝试接入真实频谱 */
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC && ap.audio && ap.audio.crossOrigin === 'anonymous') {
        var actx = new AC();
        var source = actx.createMediaElementSource(ap.audio);
        analyser = actx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);
        analyser.connect(actx.destination);
        freqData = new Uint8Array(analyser.frequencyBinCount);
        real = true;
        /* 用户首次交互后才能 resume（浏览器自动播放策略） */
        var resume = function () {
          if (actx.state === 'suspended') actx.resume();
        };
        document.addEventListener('click', resume, { once: false });
      }
    } catch (err) {
      console.warn('[star-player] 真实频谱不可用，改用模拟波形：', err);
    }

    var BARS = 56;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      ctx2d.clearRect(0, 0, w, h);

      var playing = ap && ap.audio && !ap.audio.paused;
      var values = [];

      if (real && analyser) {
        if (freqData) analyser.getByteFrequencyData(freqData);
        for (var i = 0; i < BARS; i++) {
          var idx = Math.floor((i / BARS) * (freqData ? freqData.length : 0));
          values.push(freqData ? freqData[idx] / 255 : 0);
        }
      } else {
        /* 模拟：播放时按正弦叠加缓慢起伏，暂停时留一条低矮的待机呼吸线 */
        fakePhase += 0.045;
        for (var j = 0; j < BARS; j++) {
          var base = Math.sin(fakePhase + j * 0.34) * 0.5 + 0.5;
          var base2 = Math.sin(fakePhase * 1.7 + j * 0.71) * 0.5 + 0.5;
          if (playing) {
            values.push(base * 0.55 + base2 * 0.45);
          } else {
            /* 待机时只留很低的起伏，避免看起来像一条死板的虚线 */
            var idle = Math.sin(j * 0.55) * 0.5 + 0.5;
            values.push(0.02 + idle * 0.055);
          }
        }
      }

      var gap = 2;
      var barW = (w - gap * (BARS - 1)) / BARS;

      for (var k = 0; k < BARS; k++) {
        var v = values[k] || 0;
        var barH = Math.max(2, v * h * 0.92);
        var x = k * (barW + gap);
        var y = h - barH;

        var grad = ctx2d.createLinearGradient(0, y, 0, h);
        grad.addColorStop(0, 'rgba(99, 224, 255, 0.95)');
        grad.addColorStop(0.55, 'rgba(120, 130, 255, 0.75)');
        grad.addColorStop(1, 'rgba(99, 224, 255, 0.08)');
        ctx2d.fillStyle = grad;
        ctx2d.fillRect(x, y, barW, barH);

        /* 顶部高光，让它有玻璃灯管的质感；暂停时压平就不点亮 */
        if (playing && barH > 3) {
          ctx2d.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx2d.fillRect(x, y, barW, Math.min(2, barH));
        }
      }

      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
  }

  /* ---------------- 启动 ---------------- */

  function boot() {
    if (booted) return;
    booted = true;

    var pageEl = document.getElementById('star-player');
    var miniEl = document.getElementById('star-mini');
    if (!pageEl && !miniEl) return;

    fetchPlaylist(function (list) {
      if (!list.length) {
        var tip = pageEl || miniEl;
        if (tip) {
          tip.innerHTML = '<p class="star-player-empty">歌单加载失败：请检查 /fun/music/playlist.json 是否存在</p>';
          tip.classList.add('star-player-empty-box');
        }
        return;
      }

      if (pageEl) {
        var ap = build(pageEl, list, true);
        var mount = document.getElementById('star-tracklist');
        if (ap && mount) buildTrackList(ap, list, mount);
        var canvas = document.getElementById('star-spectrum');
        if (ap && canvas) initSpectrum(ap, canvas);
        document.body.classList.add('has-star-page-player');
      }

      if (miniEl) {
        build(miniEl, list, false);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  return { reload: function () { cache = null; booted = false; boot(); } };
})();
