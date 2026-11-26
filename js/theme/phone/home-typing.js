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
// story：要逐字吐出的开场白；index 记录已经写到第几个字（不受 DOM 影响，刷新即归零）
const story = "时空裂隙已开启，你降临在无垠星海之中.";
let index = 0;

// typeWriter：每 60ms 往 #storyText 里追加一个字，写完自然停止（不再递归），
// 想改速度只调这里的 60；想改文案只改 story，别去动 njk 里的初始文本
function typeWriter() {
  if (index < story.length) {
    document.getElementById("storyText").innerText += story.charAt(index);
    index++;
    setTimeout(typeWriter, 60);
  }
}

// 首屏延迟 800ms 再开口，让入场动画（home-animation.css 的 fadeInUp）先跑完再打字
setTimeout(typeWriter, 800);

// ===== 折叠/展开通用函数 =====
// setupCollapse：把一个「标题行 + 子菜单 + 箭头」组成折叠组件。
// 触发元素点一下：子菜单切换 .show（显隐由 home.css 控制），箭头切换 .rotate（180° 翻转），
// preventDefault 是为了拦掉 <a href="#"> 的跳转，避免点了菜单页面滚回顶部
function setupCollapse(triggerId, submenuId, arrowId) {
  const trigger = document.getElementById(triggerId);
  const submenu = document.getElementById(submenuId);
  const arrow = document.getElementById(arrowId);
  if (!trigger || !submenu || !arrow) return;

  // click：一次点击同时切子菜单显隐与箭头朝向，两个 class 必须同进同退，否则会出现「菜单开了箭头没转」
  trigger.addEventListener("click", function (e) {
    submenu.classList.toggle("show");
    arrow.classList.toggle("rotate");
    e.preventDefault();
  });
}

// 初始化两个折叠组件：技术分类 / 娱乐分类（id 与 phone/_components/home-content.njk 里的结构一一对应）
setupCollapse("techTrigger", "techSubmenu", "techArrow");
setupCollapse("funTrigger", "funSubmenu", "funArrow");
