/**
 * ============================================
 * 侧边栏交互脚本
 * 文件：_js/sidebar.js
 * 作用：搜索功能、粉丝数点击 +1、关注数点击 +1、侧边栏折叠展开
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
      this.style.transform = 'scale(1.3)';
      this.style.color = '#ff6b6b';
      setTimeout(function() {
        followEl.style.transform = 'scale(1)';
        followEl.style.color = '#00eeff';
      }, 300);
    });
  }


  // =========侧边栏折叠展开逻辑=========
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.querySelector('.main-content');

  // 首页、归档、分类页面没有元素直接退出
  if(!toggleBtn || !sidebar || !mainContent){
    return;
  }

  let isCollapsed = localStorage.getItem('sidebarCollapsed') === '1';

  function setUi(collapsed){
    if(collapsed){
      document.body.classList.add('sidebar-collapsed');
    }else{
      document.body.classList.remove('sidebar-collapsed');
    }
    localStorage.setItem('sidebarCollapsed', collapsed ? '1':'0');
  }

  setUi(isCollapsed);

  toggleBtn.addEventListener('click',function(e){
    e.stopPropagation();
    isCollapsed = !isCollapsed;
    setUi(isCollapsed);
  });

});


// 搜索弹窗逻辑
document.addEventListener('DOMContentLoaded', function () {
  const searchModal = document.getElementById('searchModal');
  const openBtn = document.getElementById('searchModalOpen');
  const closeBtn = document.getElementById('searchModalClose');

  openBtn.addEventListener('click', () => {
    searchModal.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    searchModal.classList.remove('active');
  });

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
      searchModal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      searchModal.classList.remove('active');
    }
  });
});