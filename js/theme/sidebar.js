/*
  ============================================
  侧栏交互脚本
  文件：sidebar.js
  适用终端：电脑端
  作用：侧栏折叠/展开、滚动行为；全局搜索（/search.json 索引 → 雷达区结果面板，无结果播「内容走丢 → 404」动画）
  最后修改：2026-11-11
  ============================================
*/document.addEventListener('DOMContentLoaded', function () {
  /* ===== 全局搜索：侧栏输入 → 雷达区结果面板 / 无结果 404 动画 =====
     索引 /search.json 由 hexo-generator-searchdb 在构建期生成，文章新增即生效，不写死数据 */
  var spPanel = document.getElementById('searchPanel');
  var spMask = document.getElementById('searchMask');
  var spCloseBtn = document.getElementById('searchPanelClose');
  var spList = document.getElementById('spList');
  var spEmpty = document.getElementById('spEmpty');
  var spLoading = document.getElementById('spLoading');
  var spMeta = document.getElementById('spMeta');
  var searchInput = document.getElementById('search-input');
  var searchBtn = document.getElementById('searchModalOpen');
  var searchIndex = null;
  var indexLoading = null;
  var searchTimer = 0;

  function spEsc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* 文章日期从 url 里取：/2026/07/02/xxx/ → 2026-07-02 */
  function spDateOf(url) {
    var m = /^\/?(\d{4})\/(\d{2})\/(\d{2})\//.exec(url || '');
    return m ? m[1] + '-' + m[2] + '-' + m[3] : '';
  }

  function spHighlight(text, terms) {
    var out = spEsc(text);
    terms.forEach(function (t) {
      if (!t) return;
      var safe = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      out = out.replace(new RegExp('(' + safe + ')', 'gi'), '<mark>$1</mark>');
    });
    return out;
  }

  function loadIndex() {
    if (searchIndex) return Promise.resolve(searchIndex);
    if (indexLoading) return indexLoading;
    indexLoading = fetch('/search.json', { cache: 'force-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('index ' + res.status);
        return res.json();
      })
      .then(function (list) {
        searchIndex = (list || []).map(function (p) {
          var plain = String(p.content || '')
            .replace(/<[^>]*>/g, ' ')
            .replace(/&[a-z#0-9]+;/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          return {
            title: p.title || '',
            url: p.url || '#',
            date: spDateOf(p.url),
            titleL: String(p.title || '').toLowerCase(),
            textL: plain.toLowerCase()
          };
        });
        indexLoading = null;
        return searchIndex;
      })
      .catch(function () {
        indexLoading = null;
        return null;
      });
    return indexLoading;
  }

  function spShowEmpty() {
    spList.innerHTML = '';
    spEmpty.hidden = false;
    spEmpty.classList.remove('is-play');
    void spEmpty.offsetWidth; /* 强制回流，重复搜索时动画能重播 */
    spEmpty.classList.add('is-play');
  }

  function spReset() {
    spList.innerHTML = '';
    spEmpty.hidden = true;
    spEmpty.classList.remove('is-play');
    spMeta.textContent = '';
    spLoading.hidden = false;
    spLoading.textContent = '输入关键词开始检索（支持空格分词）';
  }

  function spSearch(q) {
    var terms = String(q || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return;
    if (searchTimer) { window.clearTimeout(searchTimer); searchTimer = 0; }
    spList.innerHTML = '';
    spEmpty.hidden = true;
    spEmpty.classList.remove('is-play');
    spMeta.textContent = '';
    spLoading.hidden = !searchIndex;
    spLoading.textContent = '正在扫描星图索引…';
    loadIndex().then(function (idx) {
      if (!idx) {
        spLoading.hidden = false;
        spLoading.textContent = '索引加载失败，请刷新页面后重试';
        spMeta.textContent = '0 篇';
        return;
      }
      spLoading.hidden = true;
      var hits = [];
      idx.forEach(function (d) {
        var score = 0;
        for (var i = 0; i < terms.length; i++) {
          var t = terms[i];
          var ti = d.titleL.indexOf(t);
          var xi = d.textL.indexOf(t);
          if (ti < 0 && xi < 0) return; /* 少一个词就不算命中 */
          if (ti >= 0) score += 8 + (ti === 0 ? 5 : 0);
          if (xi >= 0) score += 2;
        }
        hits.push({ d: d, score: score });
      });
      hits.sort(function (a, b) {
        return b.score - a.score || (b.d.date > a.d.date ? 1 : -1);
      });
      spMeta.textContent = hits.length ? '命中 ' + hits.length + ' 篇 / 共 ' + idx.length + ' 篇' : '0 篇';
      if (!hits.length) { spShowEmpty(); return; }
      spList.innerHTML = hits.slice(0, 30).map(function (h, i) {
        return '<li class="sp-item">' +
          '<span class="sp-date">' + spEsc(h.d.date || '—') + '</span>' +
          '<a class="sp-link" href="' + spEsc(h.d.url) + '">' +
          '<span class="sp-no">' + (i + 1) + '.</span>' +
          '<span class="sp-name">' + spHighlight(h.d.title, terms) + '</span>' +
          '</a></li>';
      }).join('');
    });
  }

  /* ---------- 弹窗开合转场：百叶窗 / 电影幕布 / 淡入，三种轮换，关闭为同一效果的逆播 ---------- */
  var DOCK_FX = ['blinds', 'cinema', 'fade'];
  var dockFxIdx = 0;

  function dockFxPlay(panel, dir) {
    var fx = panel.querySelector('.dock-fx');
    if (!fx) return 320;
    if (dir === 'in') {
      panel._fxName = DOCK_FX[dockFxIdx % DOCK_FX.length];
      dockFxIdx++;
    }
    var name = panel._fxName || DOCK_FX[0];
    fx.className = 'dock-fx is-on fx-' + dir + '-' + name;
    if (panel._fxTimer) window.clearTimeout(panel._fxTimer);
    panel._fxTimer = window.setTimeout(function () {
      panel._fxTimer = 0;
      fx.className = 'dock-fx';
    }, dir === 'in' ? 760 : 640);
    // 返回关闭时要等的时间（等逆播动画铺满整块面板）
    return name === 'fade' ? 480 : 560;
  }

  /* ---------- 雷达区弹窗通用外壳：搜索 / 星语传书 / 星芒赠礼共用 ---------- */
  function mountPanel(panel) {
    var host = document.querySelector('.starmap-center') || document.querySelector('.article-panel');
    // 雷达区太矮时放不下整块面板，退化为屏幕居中浮层，避免内容被压成一小条
    // 传书/赠礼内容更高，要求更高的雷达区高度
    var need = panel.classList.contains('dock-panel') ? 640 : 460;
    if (host && host.getBoundingClientRect().height < need) host = null;
    if (host) {
      if (panel.parentNode !== host) host.appendChild(panel);
      panel.classList.add('sp-in-radar');
    } else {
      if (panel.parentNode !== document.body) document.body.appendChild(panel);
      panel.classList.remove('sp-in-radar');
    }
  }

  function openDock(panel) {
    if (!panel) return;
    if (panel._closeTimer) { window.clearTimeout(panel._closeTimer); panel._closeTimer = 0; }
    mountPanel(panel);
    panel.hidden = false;
    void panel.offsetWidth;
    panel.classList.add('is-open');
    if (panel.classList.contains('dock-panel')) dockFxPlay(panel, 'in');
  }

  function closeDock(panel) {
    if (!panel || panel.hidden) return;
    if (panel._closeTimer) { window.clearTimeout(panel._closeTimer); panel._closeTimer = 0; }
    var isDock = panel.classList.contains('dock-panel');
    var wait = 320;
    if (isDock) {
      wait = dockFxPlay(panel, 'out');
    } else {
      panel.classList.remove('is-open');
    }
    panel._closeTimer = window.setTimeout(function () {
      panel._closeTimer = 0;
      panel.classList.remove('is-open');
      panel.hidden = true;
    }, wait);
  }

  /* 面板落到雷达区（无雷达的详情页 / 独立页退化为屏幕居中） */
  function spOpen() {
    openDock(spPanel);
  }

  function spClose() {
    closeDock(spPanel);
  }

  function spSubmit() {
    if (!searchInput) return;
    var q = searchInput.value.trim();
    if (!q) { searchInput.focus(); return; }
    spOpen();
    spSearch(q);
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', function (e) {
      e.preventDefault();
      spSubmit();
    });
  }
  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); spSubmit(); }
    });
    /* 面板已开时继续编辑就实时重搜（220ms 防抖） */
    searchInput.addEventListener('input', function () {
      if (!spPanel || spPanel.hidden) return;
      var v = searchInput.value;
      if (searchTimer) window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(function () {
        if (v.trim()) spSearch(v);
        else spReset();
      }, 220);
    });
  }
  if (spCloseBtn) spCloseBtn.addEventListener('click', spClose);
  if (spMask) spMask.addEventListener('click', spClose);

  // ========== 星语传书 / 星芒赠礼：同一套雷达区弹窗 ==========
  [
    ['.contact-trigger', 'contactModal'],
    ['.donate-trigger', 'donateModal']
  ].forEach(function (pair) {
    var trigger = document.querySelector(pair[0]);
    var panel = document.getElementById(pair[1]);
    if (!trigger || !panel) return;
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      openDock(panel);
    });
    panel.querySelectorAll('[data-dock-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        closeDock(panel);
      });
    });
  });

  // ===== 带锚点直达：#contact / #donate 自动打开对应面板（首页公告里的「星语传书」走这里） =====
  function openByHash() {
    var h = (location.hash || '').replace('#', '');
    var map = { contact: 'contactModal', donate: 'donateModal', search: 'searchPanel' };
    var id = map[h];
    if (!id) return;
    var panel = document.getElementById(id);
    if (!panel) return;
    if (id === 'searchPanel') { spOpen(); return; }
    openDock(panel);
  }
  openByHash();
  window.addEventListener('hashchange', openByHash);

  // ===== ESC 一键关闭全部弹窗 =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      spClose();
      closeDock(document.getElementById('contactModal'));
      closeDock(document.getElementById('donateModal'));
    }
  });

  // ===== 粉丝数：只由「关注」按钮驱动，起点 1088，不落任何存储（刷新即还原） =====
  var fansEl = document.getElementById('fans-count');
  var followBtn = document.getElementById('followBtn');
  if (fansEl && followBtn) {
    var baseFans = parseInt(fansEl.getAttribute('data-base'), 10) || 1088;
    var isFollowing = false;
    fansEl.textContent = baseFans;
    followBtn.addEventListener('click', function () {
      isFollowing = !isFollowing;
      fansEl.textContent = baseFans + (isFollowing ? 1 : 0);
      /* 数字只闪一下，不把颜色留住 */
      fansEl.classList.remove('is-bump');
      void fansEl.offsetWidth;
      fansEl.classList.add('is-bump');
      setTimeout(function () { fansEl.classList.remove('is-bump'); }, 420);
      followBtn.classList.toggle('is-following', isFollowing);
      followBtn.textContent = isFollowing ? '已关注' : '+ 关注';
      followBtn.setAttribute('aria-pressed', isFollowing ? 'true' : 'false');
    });
  }

  // ===== 关注数点击 +1（起始 66） =====
  var followEl = document.getElementById('follow-count');
  if (followEl) {
    followEl.addEventListener('click', function () {
      var current = parseInt(this.textContent);
      this.textContent = current + 1;
      this.style.transform = 'scale(1.3)';
      this.style.color = '#ff6b6b';
      setTimeout(function () {
        followEl.style.transform = 'scale(1)';
        followEl.style.color = '#00eeff';
      }, 300);
    });
  }


  // ===== 连点保护：切换途中再点侧栏菜单只认第一次 =====
  // 猛点同一条菜单会连续发起多次导航，每次导航都会重新抓一次首帧画面，
  // 叠在一起看起来就是「跳一下」。这里 400ms 内只放行第一次点击；
  // 时间戳存 sessionStorage，所以跳到新页之后紧接着的连点同样会被挡掉。
  (function guardRapidNav() {
    var KEY = 'sb_nav_ts';
    function isLocked() {
      try { return Date.now() - (parseInt(sessionStorage.getItem(KEY) || '0', 10) || 0) < 400; } catch (e) { return false; }
    }
    function lock() { try { sessionStorage.setItem(KEY, String(Date.now())); } catch (e) { /* 忽略 */ } }
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('#sidebar a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (href.indexOf('javascript:') === 0 || href.charAt(0) === '#') return; // 弹窗类跳过
      if (isLocked()) { e.preventDefault(); return; }
      lock();
    }, true);
  })();

  // ===== 侧栏自己的滚动位置：换页后恢复，避免每次点菜单侧栏都跳回顶部 =====
  (function rememberSidebarScroll() {
    var sb = document.getElementById('sidebar');
    if (!sb) return;
    try {
      var saved = sessionStorage.getItem('sidebarScrollTop');
      if (saved) sb.scrollTop = parseInt(saved, 10) || 0;
    } catch (e) { /* 忽略隐私模式报错 */ }
    sb.addEventListener('scroll', function () {
      try { sessionStorage.setItem('sidebarScrollTop', String(sb.scrollTop)); } catch (e) { /* 忽略 */ }
    }, { passive: true });
  })();

  // ===== 站内链接预取：鼠标悬停时就把目标页拉进缓存，点下去是秒开，不再有“刷新”的等待感 =====
  (function prefetchLinks() {
    var seen = {};
    function prefetch(raw) {
      if (!raw || raw.indexOf('javascript:') === 0 || raw.charAt(0) === '#') return;
      var abs;
      try { abs = new URL(raw, location.href); } catch (e) { return; }
      if (abs.origin !== location.origin) return;         // 只预取本站
      if (abs.pathname === location.pathname) return;     // 当前页不用预取
      var key = abs.pathname;
      if (seen[key]) return;
      seen[key] = 1;
      var l = document.createElement('link');
      l.rel = 'prefetch';
      l.as = 'document';
      l.href = abs.href;
      document.head.appendChild(l);
    }
    // mouseover 会冒泡，pointerenter 不会，所以用 mouseover 统一兜住
    document.addEventListener('mouseover', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (a) prefetch(a.getAttribute('href'));
    }, { passive: true });
  })();

  // =========侧边栏折叠展开逻辑=========
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.querySelector('.main-content');
  if (!toggleBtn || !sidebar || !mainContent) {
    return;
  }
  let isCollapsed = localStorage.getItem('sidebarCollapsed') === '1';
  function setUi(collapsed) {
    if (collapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
    localStorage.setItem('sidebarCollapsed', collapsed ? '1' : '0');
  }
  setUi(isCollapsed);
  toggleBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    isCollapsed = !isCollapsed;
    setUi(isCollapsed);
  });
});
