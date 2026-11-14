/*
  ============================================
  首页正文打字机入场组件
  文件：pc-typewriter.js
  适用终端：电脑端首页
  作用：正文由下往上依次入场——区域1 打字机逐字打完 → 区域2 再逐字打完 →
        最后标题淡入上浮；上一块没打完时，上面那块保持隐藏
  最后修改：2026-11-11
  ============================================
*/
(function () {
  var left = document.querySelector('.pc-hero-left');
  if (!left) return;

  var l1 = document.querySelector('.pc-lead-dim');
  var l2 = document.querySelector('.pc-lead:not(.pc-lead-dim)');
  var title = document.querySelector('.pc-title');
  if (!l1 || !l2 || !title) return;

  /* 是否播放入场动画：首次进入 / 浏览器刷新 → 播；
     已经逛过别的页面再回首页 → 直接给最终画面（sessionStorage 打标记） */
  var seenKey = 'starry_home_intro_done';
  var navType = 'navigate';
  try {
    var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    if (nav && nav.type) navType = nav.type;
  } catch (e) {}
  var seenBefore = false;
  try { seenBefore = sessionStorage.getItem(seenKey) === '1'; } catch (e) {}
  var shouldAnimate = navType === 'reload' || !seenBefore;
  try { sessionStorage.setItem(seenKey, '1'); } catch (e) {}

  /* 区域1 原文里用 <br> 换行，统一转成 \n，靠 white-space: pre-line 还原 */
  var txt1 = l1.innerHTML
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/[ \t]*\n[ \t]*/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  var txt2 = l2.textContent.replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '').trim();

  var reduce = false;
  try {
    reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (e) {}

  // escapeHtml：打字过程中要不断把已打的片段重新塞回 innerHTML，
  // 先把 & < > 转义，避免正文里的尖括号被当成标签解析
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* 标题入场：先在雷达区域正中央放大亮出（全屏中部），逐字揭完后
     再沿斜线慢慢缩小、滑回左栏原位。计算全程用 transform，不影响布局。 */
  function revealTitle(noAnim) {
    left.classList.remove('pc-typing');
    title.style.opacity = '1';
    if (noAnim) return;
    /* 一次性闸门：标题打字只允许跑一次，任何情况下都不重播 */
    if (title.dataset.typedOnce === '1') return;
    title.dataset.typedOnce = '1';

    // 局部变量原本叫 l1，与外层 l1（.pc-lead-dim 文案块）同名但指向完全不同，改名避免误用
    var titleLine1 = document.querySelector('.pc-title-line1');
    var art = document.querySelector('.pc-title-art');

    /* 1. 量出「可见笔画」的外框（line1 + 字形图），以及雷达中心，
         按可见外框算放大倍数，避免整块透明余白把标题顶出屏幕 */
    var box = title.getBoundingClientRect();
    var vw = window.innerWidth, vh = window.innerHeight;
    var radar = document.querySelector('.pc-notice-radar');
    var rr = radar ? radar.getBoundingClientRect() : null;
    var cx = rr && rr.width ? rr.left + rr.width / 2 : vw * 0.55;
    var cy = rr && rr.height ? rr.top + rr.height / 2 : vh * 0.5;

    var visLeft = Infinity, visRight = -Infinity, visTop = Infinity, visBottom = -Infinity;
    function addBox(l, t, r, b) {
      if (!(r > l) || !(b > t)) return;
      if (l < visLeft) visLeft = l;
      if (r > visRight) visRight = r;
      if (t < visTop) visTop = t;
      if (b > visBottom) visBottom = b;
    }
    /* line1 的元素盒被左栏撑到整列宽，只有字是真的；量文字本身的范围，
       否则整列空白会被算进放大倍数，标题也会偏左 */
    if (titleLine1) {
      try {
        var range = document.createRange();
        range.selectNodeContents(titleLine1);
        var lr = range.getBoundingClientRect();
        if (lr && lr.width) addBox(lr.left, lr.top, lr.right, lr.bottom);
      } catch (e) {}
    }
    if (art) {
      /* 现在这里是纯文字，元素盒被左栏拉宽会失真，同样只量文字本身 */
      try {
        var arange = document.createRange();
        arange.selectNodeContents(art);
        var arr = arange.getBoundingClientRect();
        if (arr && arr.width) addBox(arr.left, arr.top, arr.right, arr.bottom);
      } catch (e2) {
        var ar = art.getBoundingClientRect();
        addBox(ar.left, ar.top, ar.right, ar.bottom);
      }
    }
    if (!isFinite(visLeft)) addBox(box.left, box.top, box.right, box.bottom);
    var visW = Math.max(1, visRight - visLeft);
    var visH = Math.max(1, visBottom - visTop);
    var visCx = (visLeft + visRight) / 2;
    var visCy = (visTop + visBottom) / 2;

    /* 中屏占屏宽约 54%，同时不超过屏高 60%、不超出视口 88% 宽度，最小 2 倍 */
    var scale = Math.min((vw * 0.54) / visW, (vh * 0.60) / visH, (vw * 0.88) / visW, 5.2);
    scale = Math.max(scale, 2);

    var dx = cx - visCx;
    var dy = cy - visCy;

    title.style.position = 'relative';
    title.style.zIndex = '60';
    /* 飞行途中标题盖在页面中部，别让它拦住底下的链接点击 */
    title.style.pointerEvents = 'none';
    title.style.transformOrigin = (visCx - box.left) + 'px ' + (visCy - box.top) + 'px';
    title.style.transition = 'none';
    /* 不做任何倾斜，只做平移+缩放 */
    title.style.transform =
      'translate(' + dx + 'px,' + dy + 'px) scale(' + scale.toFixed(2) + ')';

    /* 2. 放大态下打字：整段只跑一次 —— WELCOME TO 打完立刻接「时空秘境！」 */
    if (titleLine1) {
      titleLine1.style.animation = 'pcTitleType 0.74s steps(10, end) both';
      window.setTimeout(function () {
        titleLine1.style.animation = 'none';
        titleLine1.style.clipPath = 'none';
        titleLine1.style.webkitClipPath = 'none';
      }, 780);
    }
    if (art) {
      window.setTimeout(function () {
        art.style.animation = 'pcTitleType 0.70s steps(5, end) both';
        /* 揭字结束后必须清掉 clip-path：clip-path 与 mask 叠加时
           Chrome 会按未缩放的盒算遮罩，放大态右侧会被切掉一截 */
        window.setTimeout(function () {
          art.style.animation = 'none';
          art.style.clipPath = 'none';
          art.style.webkitClipPath = 'none';
        }, 740);
      }, 760);
    }

    /* 3. 打完停一小拍，慢慢缩小、平移归位（约 2.6s，无旋转） */
    var flyDelay = 760 + 700 + 460;
    window.setTimeout(function () {
      title.style.transition =
        'transform 2.6s cubic-bezier(0.24, 0.66, 0.26, 1)';
      title.style.transform = 'translate(0px,0px) scale(1)';
    }, flyDelay);

    /* 4. 落地后清掉临时样式，避免残留层叠上下文 */
    window.setTimeout(function () {
      title.style.transition = 'none';
      title.style.transform = '';
      title.style.zIndex = '';
      title.style.position = '';
      title.style.pointerEvents = '';
    }, flyDelay + 2800);
  }

  // typeInto：把 text 逐字写进 el（speed 为基准间隔 ms）。
  // 每帧用「已打片段 + 闪烁光标」重建 innerHTML，打完回调 done；
  // 中文标点后停留 speed*2.4，模拟真人打字的呼吸，不至于匀速到机械
  function typeInto(el, text, speed, done) {
    el.style.opacity = '1';
    el.classList.add('is-typing');
    var i = 0;
    function step() {
      el.innerHTML = escapeHtml(text.slice(0, i)) + '<span class="pc-caret" aria-hidden="true"></span>';
      if (i >= text.length) {
        el.classList.remove('is-typing');
        el.innerHTML = escapeHtml(text);
        if (done) window.setTimeout(done, 280);
        return;
      }
      /* 顿号、逗号处略作停顿，读起来更像真人打字 */
      var ch = text.charAt(i);
      i++;
      var pause = (/[，。！？、]/.test(ch) ? speed * 2.4 : speed);
      window.setTimeout(step, pause);
    }
    step();
  }

  /* 回访态 / 动效偏好：一次性把画面推到最终状态，不留任何打字或淡入 */
  function finishInstant() {
    left.classList.add('pc-no-intro');
    left.classList.remove('pc-typing');
    l1.classList.remove('is-typing');
    l2.classList.remove('is-typing');
    l1.style.opacity = '1';
    l2.style.opacity = '1';
    title.style.opacity = '1';
    revealTitle(true);
  }

  // start：入场总调度。回访（本次会话已看过）或系统开了「减少动态效果」时直接跳到终态，
  // 否则区域1 先打（52ms/字），完成后区域2 用稍慢的 62ms/字接上，最后交给 revealTitle
  function start() {
    if (!shouldAnimate || reduce) {
      finishInstant();
      return;
    }
    typeInto(l1, txt1, 52, function () {
      typeInto(l2, txt2, 62, revealTitle);
    });
  }

  window.setTimeout(start, 460);
})();
