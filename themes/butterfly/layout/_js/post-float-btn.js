/**
 * ============================================
 * 页面归属：post.njk 文章详情页
 * 功能说明：监听页面滚动，控制返回顶部按钮显示/隐藏、点击返回顶部平滑滚动
 * 引入位置：post.njk script 内部抽取
 * ============================================
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