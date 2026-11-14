/* ============================================================
 * 首页中缝布局同步（第十九轮）
 * ------------------------------------------------------------
 * 目标：公告 / 雷达面板始终落在「时空秘境！」标题与右侧人物之间的中缝里，
 *       左缘距标题墨迹右缘 30px、右缘距人物可见左缘 30px，并在这条中缝里
 *       尽量放大。窗口尺寸变化时实时重算（低分辨率随之等比缩小）。
 *
 * 为什么必须用脚本：标题是 clamp 字号、人物是 clamp 高度，两侧边缘都是
 *   运行时算出来的，纯 CSS 拿不到「人物可见左缘」这个值。
 *
 * 两个输入：
 *   1) 标题墨迹右缘 —— 用 Range 取 .pc-title-art / .pc-title-line1 的文字
 *      实际绘制范围。不能直接取元素盒：这两个 span 的盒子会被撑到整行宽，
 *      盒右缘比字面右缘大出 200~480px（早期版本的错位就是踩了这一点）。
 *   2) 人物可见左缘 —— .pc-hero-art 是 object-fit: contain + 贴右下，
 *      绘制框宽 = min(元素宽, 元素高 × 原图宽高比)，绘制框左 = element.right − 绘制宽。
 *      素材左缘还有 34% 的 mask 渐隐（linear-gradient(to right, transparent 0, #000 34%)），
 *      所以「看得见」的起点要靠 canvas 采样：逐列算 alpha × mask 系数，
 *      取第一列加权可见度 > 阈值的列（实测约在整图 16% 处），采样一次后缓存。
 *
 * 结果写成 .pc-hero 上的三个自定义属性，交给 CSS 用：
 *   --pnr-frame-cx  面板中心（相对 .pc-hero 的 px）
 *   --pnr-frame-w   面板宽度（中缝 − 两侧各 30px）
 *   --pnr-size      待机雷达直径（再受主视觉可用高度约束）
 * ============================================================ */
(function () {
  var hero = document.querySelector('.pc-hero');
  if (!hero) return;
  var panel = hero.querySelector('.pc-notice-panel');
  var art = hero.querySelector('.pc-hero-art');
  if (!panel || !art) return;

  var GAP = 30;         /* 与标题、与人物各留的间距 */
  var FRAME_PAD = 112;  /* 面板内留给雷达的空间（与 CSS 的 +112px 对齐） */
  var MIN_NOTICE_W = 360; /* 公告面板再窄也不低于这个宽度 */
  var MASK_END = 0.34;  /* 与 .pc-hero-art 左缘 mask 渐隐终点一致 */
  var ALPHA_TH = 10;    /* 加权可见度阈值（0~255） */

  var visiblePct = null; /* 人物可见左缘占整图宽的比例，采样后缓存 */
  var lastKey = '';

  function sampleVisibleLeft(cb) {
    if (visiblePct !== null) { cb(visiblePct); return; }
    var img = new Image();
    img.onload = function () {
      try {
        var h = 240;
        var w = Math.max(2, Math.round(img.naturalWidth * (h / img.naturalHeight)));
        var cv = document.createElement('canvas');
        cv.width = w;
        cv.height = h;
        var ctx = cv.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        var data = ctx.getImageData(0, 0, w, h).data;
        var found = -1;
        for (var x = 0; x < w && found < 0; x++) {
          var sum = 0;
          for (var y = 0; y < h; y += 2) sum += data[(y * w + x) * 4 + 3];
          var alphaAvg = sum / (h / 2);
          var mask = Math.min(1, (x / w) / MASK_END);
          if (alphaAvg * mask > ALPHA_TH) found = x;
        }
        visiblePct = found > 0 ? found / w : MASK_END;
      } catch (e) {
        visiblePct = MASK_END; /* getImageData 被拦时退回 mask 终点 */
      }
      cb(visiblePct);
    };
    img.onerror = function () { visiblePct = MASK_END; cb(visiblePct); };
    img.src = art.currentSrc || art.src;
  }

  /* 标题墨迹右缘：只认「最后一个字」的真实落墨。
     整流 Range 的右缘会把结尾「！」字框右侧的大片空白算进去（1917 下多 93px），
     整串 measureText 又会少算字符间 letter-spacing（少 20px 左右），
     所以用「末字 Range 左边界 + canvas 量出的末字墨迹宽」。 */
  function inkRightOf(el) {
    var txt = (el.textContent || '').trim();
    if (!txt) return 0;
    var cs = getComputedStyle(el);
    var fs = parseFloat(cs.fontSize) || 0;
    var ctx = null;
    try {
      ctx = document.createElement('canvas').getContext('2d');
      ctx.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + fs + 'px ' + cs.fontFamily;
    } catch (e) { ctx = null; }

    /* 找到最后一个文本节点，取末字范围 */
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var lastNode = null;
    while (walker.nextNode()) {
      if (walker.currentNode.textContent.replace(/\s+$/, '').length) lastNode = walker.currentNode;
    }
    if (!lastNode) return 0;
    var t = lastNode.textContent.replace(/\s+$/, '');
    var lastChar = t.charAt(t.length - 1);
    var range = document.createRange();
    range.setStart(lastNode, t.length - 1);
    range.setEnd(lastNode, t.length);
    var cr = range.getBoundingClientRect();
    if (!cr.width) return 0;

    var inkChar = cr.width;
    if (ctx) {
      var m = ctx.measureText(lastChar);
      if (m.actualBoundingBoxRight > 0) inkChar = Math.min(cr.width, m.actualBoundingBoxRight);
    }
    return cr.left + inkChar;
  }

  function titleInkRight() {
    var right = 0;
    ['.pc-title-art', '.pc-title-line1'].forEach(function (sel) {
      var el = hero.querySelector(sel);
      if (!el) return;
      right = Math.max(right, inkRightOf(el));
    });
    return right;
  }

  function personVisibleLeft() {
    var ar = art.getBoundingClientRect();
    var nw = art.naturalWidth || 746;
    var nh = art.naturalHeight || 1120;
    var drawnW = Math.min(ar.width, ar.height * (nw / nh));
    return ar.right - drawnW + (visiblePct || MASK_END) * drawnW;
  }

  // apply：核心计算。取标题墨迹右缘 tr 与人物可见左缘 pl，中缝宽度 = pl-tr；
  // 面板宽 = 中缝减两侧各 30px，再用「52vh / 34vw」封顶（宽度封住后多余空间转成高度，
  // 于是面板是上下长大而不是无限变宽）；雷达直径取中缝可用宽度与可用高度中的较小值
  function apply() {
    var heroRect = hero.getBoundingClientRect();
    var tr = titleInkRight();
    var pl = personVisibleLeft();
    if (!tr || !pl || pl <= tr) return;

    var gapW = pl - tr;
    /* 中缝能塞下的最大宽度 */
    var fullW = Math.max(MIN_NOTICE_W, Math.round(gapW - GAP * 2));
    /* 公告面板不再横向撑满：宽度封在「52vh / 34vw」以内，正文自然换行，
       多出来的空间交给高度（CSS 里的 min-height），于是面板是上下变大而不是左右变宽 */
    var capW = Math.round(Math.min(window.innerHeight * 0.52, window.innerWidth * 0.34));
    var noticeW = Math.max(MIN_NOTICE_W, Math.min(fullW, capW));
    var cx = Math.round((tr + pl) / 2 - heroRect.left);

    /* 高度方向上限：主视觉可用高度减呼吸，避免被 .pc-shell 裁掉。
       待机雷达仍按中缝最大值撑满（用户口径：雷达两侧各 30px 并放到最大） */
    var limitH = Math.round(heroRect.height - 20) - FRAME_PAD;
    var pnr = Math.max(220, Math.round(Math.min(fullW - FRAME_PAD, limitH)));

    var key = noticeW + '/' + cx + '/' + pnr;
    if (key === lastKey) return;
    lastKey = key;

    hero.style.setProperty('--pnr-frame-w', noticeW + 'px');
    hero.style.setProperty('--pnr-frame-cx', cx + 'px');
    hero.style.setProperty('--pnr-size', pnr + 'px');
    window.__pnrDebug = { titleInk: Math.round(tr), personLeft: Math.round(personVisibleLeft()), frameW: noticeW, fullW: fullW, cx: cx, pnr: pnr };
  }

  function boot() { sampleVisibleLeft(apply); }

  boot();

  var raf = 0;
  function schedule() {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = 0; apply(); });
  }
  // resize：视口变化 → requestAnimationFrame 合帧后再算一次，避免拖拽窗口时每像素重排一次
  window.addEventListener('resize', schedule);
  // orientationchange：手机横竖屏切换（会先触发一次 resize，这里补一次防止中间态错位）
  window.addEventListener('orientationchange', schedule);
  if (window.ResizeObserver) new ResizeObserver(schedule).observe(hero);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot);
  // load：图片真正解码完成后再算一次（boot 里第一次算时人物图可能还是 0 尺寸）
  window.addEventListener('load', boot);
})();
