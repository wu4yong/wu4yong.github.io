/*
  ============================================
  手机端首页视差脚本
  文件：source/js/theme/phone/home-parallax.js
  适用终端：手机端（/phone/ 移动入口首页）
  作用：指针移动时的轻量视差与星空层次感
  最后修改：2026-11-11
  ============================================
*/
(function() {
  // 只在首页生效
  if (!document.querySelector('.center-box')) return;

  var centerBox = document.querySelector('.center-box');
  var dialog = document.querySelector('.dialog');
  var buttons = document.querySelectorAll('.choice-btn, .collapse-trigger, .normal-btn');

  // mousemove：把指针位置换算成 [-1,1] 的偏移量，对话框同向轻移（最大 6px），
  // 按钮反向移动（4px 起、按序数递增）并各加 0.02s 递延，做出前后分层、先后跟随的视差感。
  // 手机上不会触发（无指针），只有电脑浏览 /phone/ 时才有这份效果
  document.addEventListener('mousemove', function(e) {
    // 计算鼠标在视口中的百分比位置 (0~1)
    var x = e.clientX / window.innerWidth;
    var y = e.clientY / window.innerHeight;

    // 中心偏移量 (-1 ~ 1)
    var moveX = (x - 0.5) * 2;
    var moveY = (y - 0.5) * 2;

    // 对话框：轻微偏移 (最大 12px)
    if (dialog) {
      dialog.style.transform = 'translate(' + (moveX * 6) + 'px, ' + (moveY * 6) + 'px)';
      dialog.style.transition = 'transform 0.1s ease-out';
    }

    // 按钮：反向偏移，产生视差 (最大 8px)
    buttons.forEach(function(btn, index) {
      var delay = index * 0.02;
      var offsetX = moveX * (4 + index * 1.5);
      var offsetY = moveY * (4 + index * 1.5);
      btn.style.transform = 'translate(' + (-offsetX) + 'px, ' + (-offsetY) + 'px)';
      btn.style.transition = 'transform 0.15s ease-out';
      btn.style.transitionDelay = delay + 's';
    });
  });

  // mouseleave：指针离开视口时把所有 transform 归零，否则元素会停在最后一帧的偏移上回不来
  document.addEventListener('mouseleave', function() {
    if (dialog) {
      dialog.style.transform = 'translate(0, 0)';
    }
    buttons.forEach(function(btn) {
      btn.style.transform = 'translate(0, 0)';
    });
  });

})();
