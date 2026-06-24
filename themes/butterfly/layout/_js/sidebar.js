/**
 * ============================================
 * 侧边栏交互脚本
 * 文件：_js/sidebar.js
 * 作用：搜索功能、粉丝数点击 +1、关注数点击 +1
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function() {

  // ===== 搜索功能 =====
  var searchBtn = document.getElementById('search-btn');
  var searchInput = document.getElementById('search-input');
  
  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      var keyword = searchInput.value.trim();
      if (keyword) {
        window.location.href = '/search/?q=' + encodeURIComponent(keyword);
      }
    });
  }
  
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        var keyword = searchInput.value.trim();
        if (keyword) {
          window.location.href = '/search/?q=' + encodeURIComponent(keyword);
        }
      }
    });
  }

  // ===== 粉丝数点击 +1（起始 1088） =====
  var fansEl = document.getElementById('fans-count');
  if (fansEl) {
    fansEl.addEventListener('click', function() {
      var current = parseInt(this.textContent);
      this.textContent = current + 1;
      // 点击反馈动画
      this.style.transform = 'scale(1.3)';
      this.style.color = '#ff6b6b';
      setTimeout(function() {
        fansEl.style.transform = 'scale(1)';
        fansEl.style.color = '#00eeff';
      }, 300);
    });
  }

  // ===== 关注数点击 +1（起始 66） =====
  var followEl = document.getElementById('follow-count');
  if (followEl) {
    followEl.addEventListener('click', function() {
      var current = parseInt(this.textContent);
      this.textContent = current + 1;
      // 点击反馈动画
      this.style.transform = 'scale(1.3)';
      this.style.color = '#ff6b6b';
      setTimeout(function() {
        followEl.style.transform = 'scale(1)';
        followEl.style.color = '#00eeff';
      }, 300);
    });
  }

});
