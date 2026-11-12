/*
 * ============================================================
 * gate.js｜手机端雷达待机页的显示与跳转
 * 文件：source/js/theme/phone/gate.js
 * 作用：手机 UA 或窄屏时启用 #mGate（盖住电脑版布局），
 *      触碰/点击待机层任意位置 → 进入 /phone/ 移动菜单
 * 依赖：phone/gate.css（结构见 layout/index.njk 的 #mGate）
 * 约定：带 ?mobile=1 时由 index.njk 内联脚本直接跳转，这里不重复处理
 * 最后修改：2026-11-12
 * ============================================================
 */
(function () {
  'use strict';

  var gate = document.getElementById('mGate');
  if (!gate) return;

  var ENTER_URL = '/phone/';
  var UA_MOBILE = /Android|iPhone|iPod|HarmonyOS|Windows Phone|MicroMessenger|Mobile Safari|iPad/i;
  var MQ = window.matchMedia ? window.matchMedia('(max-width: 900px)') : null;

  var isMobileUA = UA_MOBILE.test(navigator.userAgent || '');
  var narrowScreen = MQ ? MQ.matches : window.innerWidth <= 900;
  var entered = false;

  /* ---- 显示 / 隐藏待机层：同时给 body 打标记，让电脑版布局不参与渲染 ---- */
  function apply(show) {
    gate.setAttribute('aria-hidden', show ? 'false' : 'true');
    gate.style.display = show ? 'flex' : 'none';
    gate.style.opacity = show ? '1' : '0';
    document.body.classList.toggle('is-mg-gate', show);
  }

  /* ---- 进入移动菜单：加一点淡出，避免生硬切换 ---- */
  function enter() {
    if (entered) return;
    entered = true;
    gate.style.transition = 'opacity .22s ease';
    gate.style.opacity = '0';
    setTimeout(function () {
      window.location.href = ENTER_URL;
    }, 200);
  }

  /* ---- 点击整层（含触摸）都算进入；pointerdown 响应更快 ---- */
  gate.addEventListener('click', function (e) {
    e.preventDefault();            /* 容器是 <a href="/phone/">，拦掉原生跳转，统一走淡出 */
    enter();
  });
  gate.addEventListener('pointerup', function (e) {
    if (e.pointerType === 'touch') enter();
  });

  /* 键盘可达性：Enter / Space 也能进入 */
  gate.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      enter();
    }
  });

  apply(isMobileUA || narrowScreen);

  /* ---- 旋屏 / 拖动窗口宽度时重判一次 ---- */
  var t = null;
  function onResize() {
    clearTimeout(t);
    t = setTimeout(function () {
      var show = isMobileUA || (MQ ? MQ.matches : window.innerWidth <= 900);
      apply(show);
    }, 120);
  }
  if (MQ && MQ.addEventListener) MQ.addEventListener('change', onResize);
  else if (MQ && MQ.addListener) MQ.addListener(onResize);
  window.addEventListener('resize', onResize);

  /* ---- 已生效时阻止背景滚动（待机层本身不滚动，避免 iOS 橡皮筋） ---- */
  if (isMobileUA || narrowScreen) {
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('touchmove', function (e) {
      if (gate.contains(e.target)) e.preventDefault();
    }, { passive: false });
  }
})();
