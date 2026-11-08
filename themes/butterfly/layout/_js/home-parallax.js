/**
 * ============================================
 * 首页视差效果
 * 文件：_js/home-parallax.js
 * 作用：鼠标移动时，元素产生轻微偏移
 * ============================================
 */

(function() {
  // 只在首页生效
  if (!document.querySelector('.center-box')) return;

  var centerBox = document.querySelector('.center-box');
  var dialog = document.querySelector('.dialog');
  var buttons = document.querySelectorAll('.choice-btn, .collapse-trigger, .normal-btn');

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

  // 鼠标离开窗口时复位
  document.addEventListener('mouseleave', function() {
    if (dialog) {
      dialog.style.transform = 'translate(0, 0)';
    }
    buttons.forEach(function(btn) {
      btn.style.transform = 'translate(0, 0)';
    });
  });

})();
