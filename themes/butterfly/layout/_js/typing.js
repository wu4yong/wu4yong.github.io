/**
 * ============================================
 * 首页打字机动画 + 折叠菜单脚本
 * 文件：_js/typing.js
 * 作用：首页的打字机文字效果 + 分类折叠展开
 * ============================================
 */

// ===== 打字机动画 =====
const story = "时空裂隙已开启，你降临在无垠星海之中.";
let index = 0;

function typeWriter() {
  if (index < story.length) {
    document.getElementById("storyText").innerText += story.charAt(index);
    index++;
    setTimeout(typeWriter, 60);
  }
}

setTimeout(typeWriter, 300);

// ===== 折叠/展开通用函数（只折叠，不跳转） =====
function setupCollapse(triggerId, submenuId, arrowId) {
  const trigger = document.getElementById(triggerId);
  const submenu = document.getElementById(submenuId);
  const arrow = document.getElementById(arrowId);
  if (!trigger || !submenu || !arrow) return;

  trigger.addEventListener("click", function (e) {
    // 切换折叠状态
    submenu.classList.toggle("show");
    arrow.classList.toggle("rotate");
    e.preventDefault();
  });
}

// 初始化两个折叠组件
setupCollapse("techTrigger", "techSubmenu", "techArrow");
setupCollapse("funTrigger", "funSubmenu", "funArrow");
