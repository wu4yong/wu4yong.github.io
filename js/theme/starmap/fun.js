/*
  ============================================
  星屿乐园（/fun/）第二层矩阵交互
  文件：source/js/theme/fun.js
  适用终端：电脑端（/fun/）
  作用：左侧专区矩阵 → 点专区在「该专区下面」就地展开子菜单（文章清单，逻辑同索引页坐标矩阵），
        点子菜单里的一篇 → 交给 InplaceReader（StarmapReader.open）在雷达区按文章逻辑展开
  依赖：fun.css、InplaceReader.njk（window.StarmapReader）、radar-core.js、StarJukebox
  最后修改：2026-11-15
  ============================================
*/
(function () {
  'use strict';

  var board = document.getElementById('funBoard');
  var center = document.querySelector('.starmap-center');
  var main = document.querySelector('.starmap-main');
  var grid = document.getElementById('funGrid');
  if (!board || !grid) return;

  /* 分区清单只当数据源：结构仍然留在 .fun-board 里，永远不显示，
     视觉上文章清单是「左栏坐标矩阵的子项」，跟 /tags/ 点分类展开一模一样 */
  if (board) board.hidden = true;
  if (center) center.classList.remove('is-fun-sector');

  var items = grid.querySelectorAll('.coord-item');
  var nodes = document.querySelectorAll('#radarView .stargate-node');
  /* 正在打开的那篇文章的画册版式（book / fill / scroll），reader-open 时据此决定布局 */
  var pendingAlbum = '';

  function markActive(key) {
    Array.prototype.forEach.call(items, function (i) {
      i.classList.toggle('is-active', !!key && i.getAttribute('data-sector') === key);
    });
    /* 节点用 is-active 而不是 is-reading：阅读器关闭时会清掉所有 .is-reading，
       用它会导致分区选中态在读完一篇后被抹掉 */
    Array.prototype.forEach.call(nodes, function (n) {
      n.classList.toggle('is-active', !!key && n.getAttribute('data-sector') === key);
    });
    /* 选中哪个区，左栏日志与右栏星域仪就跟着切到哪个区 */
    switchSectorLog(key || null);
    updateGlobe(key || null);
    /* 雷达底下的线稿场景也换台（音乐群舞 / 赛道 / 取景框 / 放映机 / 纸页） */
    if (window.SectorScene) window.SectorScene.set(key || null);
  }

  /* 音乐专区 = 播放器：不列文章子菜单，直接在雷达区展开星野歌单
     （播放器自己会给 .starmap-main 挂 is-jukebox，左右栏与底部轨道自动让位） */
  function openJukebox() {
    if (!window.StarJukebox || typeof window.StarJukebox.open !== 'function') return false;
    if (window.StarmapReader && window.StarmapReader.isOpen()) window.StarmapReader.close();
    markActive('music');
    window.StarJukebox.open();
    return true;
  }

  /* ---------- 左栏子菜单 ---------- */

  function clearSubs() {
    var old = grid.querySelectorAll('.coord-sub-list');
    Array.prototype.forEach.call(old, function (n) {
      n.parentNode.removeChild(n);
    });
  }

  function buildSubs(row, key) {
    var sector = board.querySelector('.fun-sector[data-sector="' + key + '"]');
    if (!sector) return false;
    var posts = sector.querySelectorAll('.fun-post');
    var list = document.createElement('div');
    list.className = 'coord-sub-list';
    list.setAttribute('data-sector', key);
    Array.prototype.forEach.call(posts, function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'coord-sub';
      b.setAttribute('data-url', p.getAttribute('data-url') || '');
      b.setAttribute('data-title', p.getAttribute('data-title') || '');
      b.setAttribute('data-date', p.getAttribute('data-date') || '');
      b.setAttribute('data-album', p.getAttribute('data-album') || '');
      b.setAttribute('data-bgm', p.getAttribute('data-bgm') || '');
      var d = document.createElement('span');
      d.className = 'coord-sub-date';
      d.textContent = p.getAttribute('data-date') || '';
      var t = document.createElement('span');
      t.className = 'coord-sub-title';
      t.textContent = p.getAttribute('data-title') || '';
      b.appendChild(d);
      b.appendChild(t);
      list.appendChild(b);
    });
    row.parentNode.insertBefore(list, row.nextSibling);
    return true;
  }

  /* 点专区：展开 / 收起它自己的子菜单（再点一次同一个专区 = 收起） */
  function toggleSector(row, key) {
    if (!key) return;
    var opened = grid.querySelector('.coord-sub-list[data-sector="' + key + '"]');
    var wasOpen = !!opened;
    clearSubs();
    if (window.StarmapReader && window.StarmapReader.isOpen()) window.StarmapReader.close();

    if (wasOpen) {
      markActive(null);
      if (window.StarJukebox && window.StarJukebox.isOpen()) window.StarJukebox.close();
      return;
    }

    if (key === 'music' && openJukebox()) return;
    /* 从音乐专区切到别的专区：先把播放器收掉，否则 is-jukebox 的规则会把布局压掉 */
    if (window.StarJukebox && window.StarJukebox.isOpen()) window.StarJukebox.close();

    markActive(key);
    if (row) buildSubs(row, key);
  }

  function rowOf(key) {
    var out = null;
    Array.prototype.forEach.call(items, function (i) {
      if (i.getAttribute('data-sector') === key) out = i;
    });
    return out;
  }

  /* ---------- 打开一篇文章（雷达区就地读） ---------- */

  function openPost(el) {
    var url = el.getAttribute('data-url');
    if (!url || !window.StarmapReader) return;
    /* 记下这篇的画册版式：scroll（游戏横向长卷）打开后留在雷达格里看，不吃满、不给全屏 */
    pendingAlbum = el.getAttribute('data-album') || '';
    window.StarmapReader.open({
      url: url,
      title: el.getAttribute('data-title') || '',
      meta: el.getAttribute('data-date') || '',
      album: el.getAttribute('data-album') || '',
      bgm: el.getAttribute('data-bgm') || ''
    });
  }

  grid.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var sub = e.target.closest('.coord-sub');
    if (sub) { e.preventDefault(); openPost(sub); return; }
    var row = e.target.closest('.coord-item');
    if (!row) return;
    e.preventDefault();
    toggleSector(row, row.getAttribute('data-sector'));
  });

  var radar = document.getElementById('radarView');
  if (radar) {
    radar.addEventListener('click', function (e) {
      var node = e.target.closest ? e.target.closest('.stargate-node') : null;
      if (!node) return;
      e.preventDefault();
      var key = node.getAttribute('data-sector');
      toggleSector(rowOf(key), key);
    });
  }

  /* 阅读态联动：InplaceReader 只负责开合，is-reading 由页面自己加（与 /tags/ /archives/ 一致），
     不加的话 .starmap-main 的 grid-area 不会切到「正文吃满」。
     画册与文字文章走同一条路——索引页点标签时也不区分。
     唯一例外是游戏（album: scroll 横向长卷）：它像音乐专区一样留在雷达格内看，
     额外挂 is-inline，把吃满的布局按回中间那一格。 */
  document.addEventListener('starmap:reader-open', function () {
    if (!main) return;
    main.classList.add('is-reading');
    main.classList.toggle('is-inline', pendingAlbum === 'scroll');
  });
  document.addEventListener('starmap:reader-close', function () {
    if (main) {
      main.classList.remove('is-reading');
      main.classList.remove('is-inline');
    }
    pendingAlbum = '';
  });

  /* Esc：阅读器自己会处理关闭；没有阅读器时把子菜单收起（等同再点一次专区） */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (window.StarmapReader && window.StarmapReader.isOpen()) return;
    var open = grid.querySelector('.coord-sub-list');
    if (!open) return;
    if (window.StarJukebox && window.StarJukebox.isOpen()) window.StarJukebox.close();
    clearSubs();
    markActive(null);
  });

  /* ============================================================
     左栏「星屿日志 / SECTOR LOG」 + 右栏「星域仪 / ORBIT GLOBE」
     左栏排完 5 个专区就空掉一大片，右栏 GUIDE 下面也空着。
     这里各补一块：日志跟着「当前点开的专区」滚真实数据（曲名、篇数、日期），
     球体给一行一直在变的读数。两块都是页面自带，不拉外部接口。
     ============================================================ */

  var logBox = document.getElementById('funLog');
  var logState = document.getElementById('funLogState');
  var fgLine1 = document.getElementById('fgLine1');
  var fgLine2 = document.getElementById('fgLine2');
  var fgLine3 = document.getElementById('fgLine3');

  var playlist = [];
  var logTimer = null;
  var globeTimer = null;
  var curSector = null;
  var bankCursor = 0;
  var musicCursor = 0;
  var LOG_MAX = 60;

  var SECTOR_META = {
    music: { code: '01', tag: 'MUS', name: '音乐专区', unit: '首' },
    movie: { code: '02', tag: 'MOV', name: '电影专区', unit: '篇' },
    photo: { code: '03', tag: 'PHO', name: '摄影专区', unit: '篇' },
    game:  { code: '04', tag: 'GAM', name: '游戏专区', unit: '篇' },
    essay: { code: '05', tag: 'ESS', name: '随笔杂谈', unit: '篇' }
  };

  function stamp() {
    var d = new Date();
    function p(v) { return (v < 10 ? '0' : '') + v; }
    /* 左栏窄，秒数省掉，把宽度留给正文 */
    return p(d.getHours()) + ':' + p(d.getMinutes());
  }

  function sectorPosts(key) {
    var sec = board ? board.querySelector('.fun-sector[data-sector="' + key + '"]') : null;
    if (!sec) return [];
    return Array.prototype.map.call(sec.querySelectorAll('.fun-post'), function (p) {
      return {
        title: p.getAttribute('data-title') || '',
        date: p.getAttribute('data-date') || ''
      };
    });
  }

  function sectorCount(key) {
    var it = grid.querySelector('.coord-item[data-sector="' + key + '"]');
    if (!it) return 0;
    return parseInt(it.getAttribute('data-count'), 10) || 0;
  }

  function addLog(tag, text, dim) {
    if (!logBox) return;
    var row = document.createElement('div');
    row.className = 'fun-log-item' + (dim ? ' is-dim' : '');
    var t = document.createElement('span');
    t.className = 'fl-time';
    t.textContent = stamp();
    var g = document.createElement('span');
    g.className = 'fl-tag';
    g.textContent = tag;
    var x = document.createElement('span');
    x.className = 'fl-text';
    x.textContent = text;
    row.appendChild(t);
    row.appendChild(g);
    row.appendChild(x);
    logBox.appendChild(row);
    while (logBox.children.length > LOG_MAX) logBox.removeChild(logBox.firstChild);
    logBox.scrollTop = logBox.scrollHeight;
  }

  /* 每个专区一套「人格」文案：真实数据（最新一篇标题 / 日期 / 篇数）优先，
     氛围句垫在后面，循环播放，看起来像这台机器真在盯着这几个区 */
  function buildBank(key) {
    var meta = SECTOR_META[key];
    var posts = sectorPosts(key);
    var n = sectorCount(key);
    var newest = posts[0] || {};
    var bank = [];

    bank.push([meta.tag, 'SECTOR ' + meta.code + ' 锁定 · 链路正常']);
    bank.push([meta.tag, meta.name + ' 在册 ' + n + ' ' + meta.unit]);

    if (newest.title) {
      bank.push([meta.tag, '最新一篇《' + newest.title + '》· ' + (newest.date || '')]);
    }

    if (key === 'music') {
      bank.push([meta.tag, '星野歌单挂载完成 · 共 ' + playlist.length + ' 首']);
      bank.push([meta.tag, '人声通道校准 · 歌词逐行跟随']);
      bank.push([meta.tag, '轨道扫描 11s 一圈 · 与其它专区同速']);
      bank.push([meta.tag, '切歌先静旧轨 · 双重出声已拦下']);
      bank.push([meta.tag, '唱片钉在左下角半透明 · 不挡歌单']);
      bank.push([meta.tag, '音量刻度已记忆 · 下次打开还是这个值']);
    } else if (key === 'movie') {
      bank.push([meta.tag, '胶片库归档 · ' + n + ' 卷待映']);
      bank.push([meta.tag, '投影灯预热 · 色温 5600K']);
      bank.push([meta.tag, '画幅 2.35:1 · 上下留黑，不裁人']);
      bank.push([meta.tag, '片头字幕轨已对齐 · 误差 0.2s']);
      bank.push([meta.tag, '放映顺序按日期倒排 · 最新的先放']);
    } else if (key === 'photo') {
      bank.push([meta.tag, '画册 ' + n + ' 组 · 原片无损']);
      bank.push([meta.tag, '光圈 f/2.8 · 快门 1/125 · ISO 100']);
      bank.push([meta.tag, '暗房显影 3 分钟 · 定影 5 分钟']);
      bank.push([meta.tag, '白平衡 5500K · 色卡已校']);
      bank.push([meta.tag, '缩略图全部 webp · 首屏不卡']);
    } else if (key === 'game') {
      bank.push([meta.tag, '长卷 ' + n + ' 帧 · 横向展开']);
      bank.push([meta.tag, '行会频道在线 · 信号满格']);
      bank.push([meta.tag, '帧率 60 · 延迟 12ms']);
      bank.push([meta.tag, '存档点已写入 · 随时可以读档']);
      bank.push([meta.tag, '手柄就位 · 等一个开局']);
    } else if (key === 'essay') {
      bank.push([meta.tag, '随笔 ' + n + ' 篇 · 按日期铺开']);
      bank.push([meta.tag, '灵感缓存 87% · 还能再写一段']);
      bank.push([meta.tag, '今夜月色 0.34 · 适合落笔']);
      bank.push([meta.tag, '一句一句攒着 · 不急']);
      bank.push([meta.tag, '错字已校 · 标点都归位']);
    }

    return bank;
  }

  function nextFrom(bank) {
    if (!bank.length) return ['SYS', '本区暂无数据'];
    var line = bank[bankCursor % bank.length];
    bankCursor++;
    return line;
  }

  function switchSectorLog(key) {
    if (logTimer) { clearInterval(logTimer); logTimer = null; }
    bankCursor = 0;
    if (!logBox) return;
    logBox.innerHTML = '';
    curSector = key;

    if (logState) {
      logState.textContent = key ? '追踪中' : '待命';
      logState.classList.toggle('is-live', !!key);
    }

    if (!key) {
      addLog('SYS', '矩阵待命 · 请选择左侧分区');
      addLog('SYS', '轨道扫描周期 11s · 已锁定', true);
      /* 没点专区时也别让这块干着：先把前几个区铺出来，之后每 3.8 秒继续往下轮 */
      var patrol = ['music', 'movie', 'photo', 'game', 'essay'];
      var pi = 0;
      function patrolLine() {
        var pk = patrol[pi % patrol.length];
        pi++;
        var pm = SECTOR_META[pk];
        /* 歌单数是异步取的，还没回来时先用矩阵里的占位数，回来了以 playlist 为准 */
        var cnt = (pk === 'music' && playlist.length) ? playlist.length : sectorCount(pk);
        addLog(pm.tag, pm.name + ' · ' + cnt + ' ' + pm.unit + ' · 链路正常');
      }
      patrolLine();
      patrolLine();
      patrolLine();
      logTimer = setInterval(function () {
        if (curSector) return;
        patrolLine();
      }, 3800);
      return;
    }

    var bank = buildBank(key);
    for (var i = 0; i < 5; i++) {
      var seed = nextFrom(bank);
      addLog(seed[0], seed[1], true);
    }
    addLog(SECTOR_META[key].tag, '进入 ' + SECTOR_META[key].name + ' · 开始追踪');

    logTimer = setInterval(function () {
      if (curSector === 'music' && playlist.length) {
        var c = playlist[musicCursor % playlist.length];
        musicCursor++;
        /* 歌单字段是 name / artist，不是 title（写错就会滚出《undefined》） */
        addLog('PLY', '《' + (c.name || '未命名') + '》待命 · ' + (c.artist || ''));
      } else if (curSector) {
        var l2 = nextFrom(buildBank(curSector));
        addLog(l2[0], l2[1]);
      }
    }, 2800);
  }

  function refreshGlobeSync() {
    if (!fgLine3) return;
    fgLine3.textContent = 'ORBIT 11s · SYNC ' + (94 + Math.floor(Math.random() * 7)) + '%';
  }

  function updateGlobe(key) {
    if (!fgLine1) return;
    if (globeTimer) { clearInterval(globeTimer); globeTimer = null; }
    if (!key) {
      fgLine1.textContent = 'SECTOR · CORE';
      fgLine2.textContent = 'STANDBY';
      fgLine3.textContent = 'ORBIT 11s · LOCKED';
      return;
    }
    var m = SECTOR_META[key];
    fgLine1.textContent = 'ZONE ' + m.code + ' · ' + m.name;
    if (key === 'music') {
      var playing = !!(window.StarJukebox && window.StarJukebox.isOpen && window.StarJukebox.isOpen());
      fgLine2.textContent = (playlist.length || 0) + ' TRACKS · ' + (playing ? 'PLAYING' : 'READY');
    } else {
      fgLine2.textContent = sectorCount(key) + ' ' + m.unit + ' · IN SYNC';
    }
    refreshGlobeSync();
    globeTimer = setInterval(refreshGlobeSync, 3000);
  }

  /* 音乐专区不再是文章分类，矩阵括号里的数字改成歌单曲目数（读 /music/playlist.json） */
  (function fillMusicCount() {
    var slot = document.querySelector('[data-music-count]');
    var item = document.querySelector('#funGrid .coord-item[data-sector="music"]');
    fetch('/music/playlist.json', { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        playlist = Array.isArray(data) ? data : [];
        var n = playlist.length;
        if (!n) return;
        if (slot) slot.textContent = '(' + n + ')';
        if (item) item.setAttribute('data-count', n);
        /* 右栏「分区速览」那一行也要跟着歌单数走，而且单位是「首」不是「篇」 */
        var stat = document.querySelector('[data-music-stat]');
        if (stat) stat.textContent = n + ' 首';
        /* 歌单到了就重算一次：日志里的「共 N 首」与球体的「N TRACKS」都要是真数 */
        if (curSector === 'music') {
          switchSectorLog('music');
          updateGlobe('music');
        } else if (!curSector) {
          /* 待命态首屏那几行是用占位数写的，歌单回来后重铺一遍，别把「10 首」留在屏上 */
          switchSectorLog(null);
        }
      })
      .catch(function () { if (slot) slot.textContent = ''; });
  })();

  /* 右栏「星屿漫游」：随机挑一篇就地展开。
     池子直接取 fun-board 里已渲染好的四区文章按钮（音乐区是播放器，不参与），
     所以不需要额外拉接口；跳到哪一篇就把左栏日志与右栏球体一起带过去。 */
  (function bindWarp() {
    var btn = document.getElementById('funWarpBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var pool = Array.prototype.slice.call(document.querySelectorAll('.fun-board .fun-post'));
      if (!pool.length) {
        addLog('WARP', '暂无可用坐标');
        return;
      }
      var pick = pool[Math.floor(Math.random() * pool.length)];
      var sec = pick.closest ? pick.closest('.fun-sector') : null;
      var key = sec ? sec.getAttribute('data-sector') : '';
      if (key && key !== curSector) toggleSector(rowOf(key), key);
      var title = pick.getAttribute('data-title') || '未命名';
      addLog('WARP', '随机跳跃 · ' + title);
      openPost(pick);
    });
  })();

  /* 首屏就把两块点亮：日志先给「待命」，球体给 STANDBY，
     不等用户点专区也不会留一块死白 */
  switchSectorLog(null);
  updateGlobe(null);

})();
