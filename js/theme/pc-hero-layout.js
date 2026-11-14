/* ============================================================
 * 首页左栏版式同步（第十五轮）
 * ------------------------------------------------------------
 * 目标：让副标题「星辰大海，代码为舟。」的总宽度 = 标题「时空秘境！」的宽度，
 *       再由 CSS 的 text-align-last: justify 把字距均匀撑满这条宽度。
 * 为什么用脚本：标题是 clamp 字号，不同视口宽度不同，纯 CSS 无法在宽度上
 *       跟随另一行文字的实测宽度（只能用 justify 撑满容器，而容器不是标题宽）。
 * 兼容：标题带打字机动画时宽度会逐帧变化，这里用 2px 阈值过滤抖动；
 *       优先用 ResizeObserver，不支持时退回 resize 监听。
 * ============================================================ */
(function () {
  var host = document.querySelector('.pc-hero-left');
  if (!host) return;

  var title = host.querySelector('.pc-title-art');
  var lead = host.querySelector('.pc-lead:not(.pc-lead-dim)');
  if (!title || !lead) return;

  var lastWidth = 0;
  var range = document.createRange();

  /* 用 Range 取标题「实际绘制」的文本宽度，而不是元素盒宽度：
     元素盒会把尾随 letter-spacing 的空白也算进去，导致副标题框比标题字面更长一截。
     全角「！」字形只占字宽的左侧约 40%，右侧 60% 是空白，这里补回一半，
     让副标题的右端与标题可见笔画的右端对齐（不补会多出约 96px）。 */
  function measure() {
    var node = title.firstElementChild || title.firstChild;
    var fs = parseFloat(getComputedStyle(title).fontSize) || 0;
    var w;
    try {
      if (node && node.nodeType === 3 && node.textContent.length > 1) {
        range.setStart(node, 0);
        range.setEnd(node, node.textContent.length - 1);
        w = range.getBoundingClientRect().width;
      }
    } catch (e) { w = 0; }
    if (!w) {
      range.selectNodeContents(title);
      w = range.getBoundingClientRect().width;
    }
    return Math.round(w + fs * 0.6);
  }

  /* sync：把副标题的定宽改成标题实测宽度。2px 阈值过滤打字机逐帧的微抖，
     避免每帧都写一次 style.width 触发重排 */
  function sync() {
    var w = measure();
    if (!w || Math.abs(w - lastWidth) < 2) return;
    lastWidth = w;
    lead.style.width = w + 'px';
  }

  sync();

  // 观察目标：标题宽度一变就同步。ResizeObserver 覆盖 clamp 字号随视口变化、
  // 以及打字机过程中宽度增长；老浏览器退回 window resize（只覆盖视口变化那种场景）
  if (window.ResizeObserver) {
    new ResizeObserver(sync).observe(title);
  } else {
    window.addEventListener('resize', sync);
  }

  /* 字体迟加载会改变标题宽度，等字体就绪再补一次 */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(sync);
  }
})();
