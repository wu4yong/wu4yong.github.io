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
  mainContent.addEventListener('scroll', function () {
    if (mainContent.scrollTop > 300)
      backToTopBtn.classList.add('show');
    else
      backToTopBtn.classList.remove('show');
  });
  backToTopBtn.addEventListener('click', function () {
    mainContent.scrollTo({top: 0, behavior: 'smooth'});
  });
}