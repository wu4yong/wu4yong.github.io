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

  /* 音乐专区不再是文章分类，矩阵括号里的数字改成歌单曲目数（读 /fun/music/playlist.json） */
  (function fillMusicCount() {
    var slot = document.querySelector('[data-music-count]');
    var item = document.querySelector('#funGrid .coord-item[data-sector="music"]');
    fetch('/fun/music/playlist.json', { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var n = Array.isArray(data) ? data.length : (data && data.length) || 0;
        if (!n) return;
        if (slot) slot.textContent = '(' + n + ')';
        if (item) item.setAttribute('data-count', n);
      })
      .catch(function () { if (slot) slot.textContent = ''; });
  })();

})();
