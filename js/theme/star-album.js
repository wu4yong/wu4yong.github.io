/**
 * ============================================================
 * 雷达区「画册 / 影片」播放
 * 文件：star-album.js
 * 适用终端：电脑端（星迹索引 / 星图手记）
 * 作用：
 *   1) 图片类文章（front-matter 里写了 album: book / album: scroll）
 *      在阅读器里改成画册：
 *        book   = 一次一页、左右翻页（努力的理由）
 *        scroll = 横向一张挨一张，可拖动/滑动（学普通话）
 *      打开即循环播放轻音乐，关闭即停。
 *   2) 电影 / 音乐类文章正文里有 iframe / video 时，
 *      由 InplaceReader 自动铺满雷达区播放（本文件只管画册与音乐）。
 * 依赖：window.StarmapReader 的 open / close 事件（starmap:reader-*）
 * ============================================================
 */
window.StarAlbum = (function () {
  var BGM_SRC = '/assets/audio/light-piano.mp3';
  var VOLUME = 0.3;        /* 背景音乐音量 30，与视频播放器同一档 */
  var audio = null;
  var muted = false;
  var mode = '';
  var albumEl = null;
  var current = 0;
  var total = 0;

  function ensureAudio() {
    if (audio) return audio;
    audio = new Audio(BGM_SRC);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = muted ? 0 : VOLUME;
    /* 挂到 body（不设 controls，界面上看不到任何控件），便于调试与统一回收 */
    document.body.appendChild(audio);
    return audio;
  }

  /* 必须在用户点击的那一次手势任务里同步调用，否则自动播放会被浏览器拦 */
  function begin(m) {
    mode = m || '';
    if (!mode) return;
    try {
      var a = ensureAudio();
      var p = a.play();
      if (p && p.catch) p.catch(function () { /* 被拦就静音等用户点 ♪ */ });
    } catch (e) { /* 静默降级 */ }
  }

  /* 摘掉画册 DOM（关闭动画被打断、连续开两篇时都不会残留旧画册） */
  function detach() {
    var host = document.getElementById('readerBody');
    if (host) host.classList.remove('has-album');
    if (albumEl && albumEl.parentNode) albumEl.parentNode.removeChild(albumEl);
    albumEl = null;
  }

  function stop() {
    if (audio) {
      try { audio.pause(); audio.currentTime = 0; } catch (e) {}
    }
    detach();
    document.removeEventListener('keydown', keyHandler);
    mode = '';
    current = 0;
    total = 0;
  }

  /* 从正文里按文档顺序收集「图 + 图注」：h2/h3 当图注，图片当页。
     ★ 坑：md 里连着写的多行 ![]() 会被 marked 并进同一个 <p>，
       段落里其实躺着好几张图，必须逐图收，不能只取段内第一张。 */
  function collect(content) {
    var items = [];
    var caption = '';
    var seen = [];

    function add(img) {
      if (!img || (img.closest && img.closest('.essay-banner'))) return;
      var src = img.getAttribute('src') || img.getAttribute('data-src') || '';
      if (!src || seen.indexOf(src) > -1) return;
      seen.push(src);
      items.push({ src: src, note: caption, alt: img.getAttribute('alt') || '' });
    }

    Array.prototype.forEach.call(content.querySelectorAll('h2, h3, p'), function (node) {
      var tag = node.tagName;
      if (tag === 'H2' || tag === 'H3') {
        caption = (node.textContent || '').trim();
        return;
      }
      Array.prototype.forEach.call(node.querySelectorAll('img'), add);
    });
    /* 不在 <p> 里的裸图（HTML <img> 或 flex 块里的图）也收进来 */
    Array.prototype.forEach.call(content.querySelectorAll('img'), function (img) {
      if (!img.parentElement || !img.parentElement.closest('p')) add(img);
    });

    return items;
  }

  function build(kind, items, title) {
    var box = document.createElement('div');
    box.className = 'album album-' + (kind === 'scroll' ? 'scroll' : 'book');
    box.setAttribute('data-total', items.length);

    var viewport = document.createElement('div');
    viewport.className = 'album-viewport';
    var track = document.createElement('div');
    track.className = 'album-track';

    /* 字幕只认 md 里的 alt：alt 写成一句画面解说就当字幕用；
       若 alt 恰好是文章标题（旧 md 通篇都这么写），那就是噪音，不当字幕。 */
    var ttl = (title || '').trim();

    items.forEach(function (it, i) {
      var fig = document.createElement('figure');
      fig.className = 'album-slide';
      fig.setAttribute('data-i', i);
      var img = document.createElement('img');
      img.src = it.src;
      img.alt = it.note || it.alt || ('第 ' + (i + 1) + ' 页');
      img.loading = i > 1 ? 'lazy' : 'eager';
      img.decoding = 'async';
      fig.appendChild(img);
      /* 图注只用 h2/h3 的小标题：md 里 alt 千篇一律（都写「努力的理由」），照搬会很吵 */
      if (it.note) {
        var cap = document.createElement('figcaption');
        cap.textContent = it.note;
        fig.appendChild(cap);
      }
      var subText = (it.alt || '').trim();
      if (subText && subText !== img.alt && ttl && subText === ttl) subText = '';
      if (subText && subText !== it.note) {
        var sub = document.createElement('div');
        sub.className = 'album-sub';
        sub.setAttribute('data-text', subText);
        fig.appendChild(sub);
      }
      track.appendChild(fig);
    });

    viewport.appendChild(track);
    box.appendChild(viewport);

    /* 左上角画册信息条：版式 + 当前序号（底部 HUD 是页码 + 进度条，两个层次） */
    var info = document.createElement('div');
    info.className = 'album-info';
    var kicker = document.createElement('span');
    kicker.className = 'album-kicker';
    kicker.textContent = (kind === 'scroll' ? 'PHOTO SCROLL' : 'PHOTO BOOK') + ' · ' + items.length + ' 页';
    var count = document.createElement('span');
    count.className = 'album-count';
    count.textContent = '01 / ' + (items.length < 10 ? '0' : '') + items.length;
    info.appendChild(kicker);
    info.appendChild(count);
    box.appendChild(info);

    /* 放大层：雷达区内看细节（竖长图在画册里被缩得太小，点一下能滚着看全） */
    var zoom = document.createElement('div');
    zoom.className = 'album-zoom';
    zoom.hidden = true;
    var zoomInner = document.createElement('div');
    zoomInner.className = 'album-zoom-inner';
    var zoomImg = document.createElement('img');
    zoomImg.alt = '';
    var zoomClose = document.createElement('button');
    zoomClose.className = 'album-zoom-close';
    zoomClose.type = 'button';
    zoomClose.title = '关闭（Esc）';
    zoomClose.textContent = '×';
    zoomInner.appendChild(zoomImg);
    zoom.appendChild(zoomInner);
    zoom.appendChild(zoomClose);
    box.appendChild(zoom);

    var prev = document.createElement('button');
    prev.className = 'album-nav album-prev';
    prev.type = 'button';
    prev.title = '上一页';
    prev.textContent = '‹';
    var next = document.createElement('button');
    next.className = 'album-nav album-next';
    next.type = 'button';
    next.title = '下一页';
    next.textContent = '›';
    box.appendChild(prev);
    box.appendChild(next);

    var hud = document.createElement('div');
    hud.className = 'album-hud';
    var idx = document.createElement('span');
    idx.className = 'album-idx';
    idx.textContent = '1 / ' + items.length;
    var bar = document.createElement('i');
    bar.className = 'album-bar';
    bar.style.width = (100 / items.length) + '%';
    hud.appendChild(idx);
    hud.appendChild(bar);
    box.appendChild(hud);

    var mute = document.createElement('button');
    mute.className = 'album-mute';
    mute.type = 'button';
    mute.title = '背景音乐';
    mute.textContent = '♪';
    if (muted) mute.classList.add('is-off');
    box.appendChild(mute);

    return {
      el: box, viewport: viewport, track: track, prev: prev, next: next,
      idx: idx, bar: bar, mute: mute, items: items,
      count: count, zoom: zoom, zoomImg: zoomImg, zoomClose: zoomClose
    };
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function openZoom(ui, i) {
    var it = ui.items[i];
    if (!it) return;
    ui.zoomImg.src = it.src;
    ui.zoomImg.alt = it.note || it.alt || '';
    ui.zoom.hidden = false;
    ui.zoom.scrollTop = 0;
  }

  function closeZoom(ui) {
    ui.zoom.hidden = true;
    ui.zoomImg.src = '';
  }

  /* 字幕：一行一句画面解说，逐字打出来（换页会先清掉上一页没打完的计时器） */
  function typeSub(sub, slide, idx) {
    var text = sub.getAttribute('data-text') || '';
    window.clearTimeout(sub.__timer);
    sub.textContent = '';
    var i = 0;
    (function step() {
      if (!sub.isConnected || current !== idx) return;
      sub.textContent = text.slice(0, i);
      if (i >= text.length) { sub.classList.add('is-done'); return; }
      i += 1;
      sub.__timer = window.setTimeout(step, 62);
    })();
  }

  function playSub(ui) {
    var slide = ui.track.children[current];
    if (!slide) return;
    var sub = slide.querySelector('.album-sub');
    if (!sub) return;
    /* 已经打完的不重播，来回翻页也不会刺眼 */
    if (sub.classList.contains('is-done')) return;
    sub.classList.remove('is-done');
    typeSub(sub, slide, current);
  }

  function paint(ui, i) {
    var n = ui.items.length;
    /* 首尾循环：点左箭头从第 1 张退到末张，点右箭头从末张回到第 1 张 */
    current = ((i % n) + n) % n;
    if (ui.el.classList.contains('album-scroll')) {
      var slide = ui.track.children[current];
      if (slide) {
        ui.viewport.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
      }
    } else {
      ui.track.style.transform = 'translateX(' + (-current * 100) + '%)';
    }
    ui.idx.textContent = (current + 1) + ' / ' + n;
    ui.bar.style.width = ((current + 1) / n * 100) + '%';
    if (ui.count) ui.count.textContent = pad2(current + 1) + ' / ' + (n < 10 ? '0' : '') + n;
    playSub(ui);
    /* scroll 用原生滚动，字幕的 playSub 由滚动同步处调用 */
  }

  function bind(ui) {
    var n = ui.items.length;

    /* 自动播放被浏览器拦掉时的兜底：用户在画册里点第一次（翻页/点图/拖一下）
       就是新的手势，这里立刻补一次 play()，之后不再打扰 */
    function resumeOnce() {
      ui.el.removeEventListener('pointerdown', resumeOnce);
      ui.el.removeEventListener('click', resumeOnce);
      if (!muted && audio && audio.paused) {
        try { var p = audio.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
      }
    }
    ui.el.addEventListener('pointerdown', resumeOnce);
    ui.el.addEventListener('click', resumeOnce);

    ui.prev.addEventListener('click', function (e) { e.stopPropagation(); paint(ui, current - 1); });
    ui.next.addEventListener('click', function (e) { e.stopPropagation(); paint(ui, current + 1); });

    ui.mute.addEventListener('click', function (e) {
      e.stopPropagation();
      muted = !muted;
      if (audio) {
        audio.volume = muted ? 0 : VOLUME;
        if (!muted && audio.paused) {
          try { var p = audio.play(); if (p && p.catch) p.catch(function () {}); } catch (err) {}
        }
      }
      ui.mute.classList.toggle('is-off', muted);
    });

    /* 点图放大（雷达区内看细节）；book 靠点半屏翻页、scroll 靠拖动，
       拖动过的不算点击，用按下与抬起的位移差过滤 */
    var downX = 0, downY = 0;
    ui.viewport.addEventListener('pointerdown', function (e) {
      downX = e.clientX; downY = e.clientY;
    }, true);
    ui.viewport.addEventListener('click', function (e) {
      if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 12) return;
      if (e.target && e.target.tagName === 'IMG') { openZoom(ui, current); return; }
      if (ui.el.classList.contains('album-scroll')) return;
      var r = ui.viewport.getBoundingClientRect();
      paint(ui, current + (e.clientX - r.left > r.width / 2 ? 1 : -1));
    });
    ui.zoomClose.addEventListener('click', function (e) {
      e.stopPropagation();
      closeZoom(ui);
    });
    ui.zoom.addEventListener('click', function (e) {
      if (e.target === ui.zoom) closeZoom(ui);
    });

    /* book：滚轮也翻页 */
    if (!ui.el.classList.contains('album-scroll')) {
      ui.viewport.addEventListener('wheel', function (e) {
        if (!ui.zoom.hidden) return;
        if (Math.abs(e.deltaY) < 4 && Math.abs(e.deltaX) < 4) return;
        e.preventDefault();
        paint(ui, current + ((e.deltaY || e.deltaX) > 0 ? 1 : -1));
      }, { passive: false });
    }

    /* scroll：横向滚动后同步 HUD（原生滑动/拖拽手感保留） */
    var raf = 0;
    ui.viewport.addEventListener('scroll', function () {
      if (raf) return;
      raf = window.requestAnimationFrame(function () {
        raf = 0;
        var w = ui.viewport.clientWidth || 1;
        var i = Math.round(ui.viewport.scrollLeft / w);
        if (i !== current && i >= 0 && i < n) {
          current = i;
          ui.idx.textContent = (current + 1) + ' / ' + n;
          ui.bar.style.width = ((current + 1) / n * 100) + '%';
          if (ui.count) ui.count.textContent = pad2(current + 1) + ' / ' + (n < 10 ? '0' : '') + n;
          playSub(ui);
        }
      });
    }, { passive: true });

    /* 键盘：← → 翻页（只在本画册处于阅读态时生效） */
    document.addEventListener('keydown', keyHandler);
  }

  function keyHandler(e) {
    if (!albumEl) return;
    var ui = albumEl.__ui;
    if (!ui) return;
    if (e.key === 'Escape' && ui.zoom && !ui.zoom.hidden) {
      e.preventDefault();
      closeZoom(ui);
      return;
    }
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    paint(ui, current + (e.key === 'ArrowRight' ? 1 : -1));
  }

  /* InplaceReader 内容就绪后调用（title 用来区分「alt 是字幕」还是「alt 就是标题」） */
  function render(kind, content, title) {
    if (!kind || !content) return;
    var items = collect(content);
    if (items.length < 2) return;
    detach();
    content.innerHTML = '';
    var ui = build(kind, items, title);
    var host = document.getElementById('readerBody') || content;
    host.appendChild(ui.el);
    host.classList.add('has-album');
    albumEl = ui.el;
    albumEl.__ui = ui;
    bind(ui);
    paint(ui, 0);
    if (!muted && audio && audio.paused) {
      try { var p = audio.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
    }
  }

  document.addEventListener('starmap:reader-close', function () {
    stop();
  });

  return { begin: begin, render: render, stop: stop };
})();
