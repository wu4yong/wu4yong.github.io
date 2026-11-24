/*
  ============================================
  侧栏热门标签排序（首帧前执行）
  文件：_js/hot-tags.js
  引入位置：_components/Sidebar.njk 里 .tag-cloud 闭合标签之后（紧跟着写死）
  作用：按点击次数排序、只露前 5 个、点一下立刻重排
  为什么单独拆出来：以前放在 sidebar.js 的 DOMContentLoaded 里，首帧渲染的还是
  模板顺序的 20 个标签，等脚本跑完才收成 5 个；配合跨页淡入（View Transition）
  会出现「新旧两套标签叠在一起、影子跳一下」。紧跟标签节点内联执行就没有中间态。
  最后修改：2026-11-12
  ============================================
*/
(function () {
  var cloud = document.querySelector('.tag-cloud');
  if (!cloud) return;
  var links = Array.prototype.slice.call(cloud.querySelectorAll('.tag-link'));
  if (!links.length) return;

  var KEY = 'starry_tag_visits'; // 标签名 -> 点击次数
  var TOP = 5;
  var visits = {};

  try {
    var raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    visits = (raw && typeof raw === 'object') ? raw : {};
  } catch (e) {
    visits = {};
  }

  links.forEach(function (link) {
    var name = link.dataset.tag || (link.textContent || '').trim();
    link.dataset.tag = name;
    if (!link.dataset.count) link.dataset.count = '0';
  });

  // 排序：点击次数降序 → 文章数降序 → 名字，保证同分时顺序稳定不来回跳
  function order() {
    return links.slice().sort(function (a, b) {
      var va = visits[a.dataset.tag] || 0;
      var vb = visits[b.dataset.tag] || 0;
      if (vb !== va) return vb - va;
      var ca = Number(a.dataset.count) || 0;
      var cb = Number(b.dataset.count) || 0;
      if (cb !== ca) return cb - ca;
      return String(a.dataset.tag).localeCompare(String(b.dataset.tag), 'zh');
    });
  }

  // 重排 DOM：按名次 append，超出 5 个的 hidden（仍留在 DOM，等名次升上来再显示）
  function render() {
    order().forEach(function (link, i) {
      link.dataset.visits = visits[link.dataset.tag] || 0;
      cloud.appendChild(link);
      link.hidden = i >= TOP;
    });
  }

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      var name = link.dataset.tag;
      visits[name] = (visits[name] || 0) + 1;
      try { localStorage.setItem(KEY, JSON.stringify(visits)); } catch (e) { /* 忽略配额错误 */ }
      render(); // 当前页立刻看到「谁被点多了谁上前」
    });
  });

  render();
})();
