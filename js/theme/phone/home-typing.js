/*
  ============================================
  手机端首页交互脚本
  文件：source/js/theme/phone/home-typing.js
  适用终端：手机端（/phone/ 移动入口首页）
  作用：标题打字机循环、折叠菜单展开/收起、菜单动效
  依赖：phone/_components/home-content.njk 的 .dialog / .menu 结构
  最后修改：2026-11-11
  ============================================
*/
// ===== 打字机动画（对话框内） =====
const story = "时空裂隙已开启，你降临在无垠星海之中.";
let index = 0;

function typeWriter() {
  if (index < story.length) {
    document.getElementById("storyText").innerText += story.charAt(index);
    index++;
    setTimeout(typeWriter, 60);
  }
}

setTimeout(typeWriter, 800);

// ===== 折叠/展开通用函数 =====
function setupCollapse(triggerId, submenuId, arrowId) {
  const trigger = document.getElementById(triggerId);
  const submenu = document.getElementById(submenuId);
  const arrow = document.getElementById(arrowId);
  if (!trigger || !submenu || !arrow) return;

  trigger.addEventListener("click", function (e) {
    submenu.classList.toggle("show");
    arrow.classList.toggle("rotate");
    e.preventDefault();
  });
}

// 初始化两个折叠组件
setupCollapse("techTrigger", "techSubmenu", "techArrow");
setupCollapse("funTrigger", "funSubmenu", "funArrow");
