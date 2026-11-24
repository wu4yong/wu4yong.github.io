/*
  ============================================
  原文页悬浮按钮脚本
  文件：post-float-btn.js
  适用终端：电脑端
  作用：返回顶部按钮的显示与点击行为
  最后修改：2026-11-11
  ============================================
*/
var backToTopBtn = document.getElementById('back-to-top');
var mainContent = document.querySelector('.main-content');
if (backToTopBtn && mainContent) {
  // scroll：正文区滚动超过 300px 才亮出「返回顶部」按钮，回到顶部再收起，避免首屏就挂一个按钮
  mainContent.addEventListener('scroll', function () {
    if (mainContent.scrollTop > 300)
      backToTopBtn.classList.add('show');
    else
      backToTopBtn.classList.remove('show');
  });
  // click：平滑滚回正文区顶部（滚的是 .main-content 而不是 window，本页滚动容器不是 body）
  backToTopBtn.addEventListener('click', function () {
    mainContent.scrollTo({top: 0, behavior: 'smooth'});
  });
}