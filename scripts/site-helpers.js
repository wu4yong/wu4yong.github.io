/**
 * ============================================
 * 站点级模板 helper
 * 文件：scripts/site-helpers.js
 * 适用：全站模板通用
 * 作用：提供 Nunjucks 里可直接调用的少量通用函数，避免模板里写不存在的 helper
 *   - current_year()  当前年份，用于版权行与 HUD 角标
 *   - is_mobile(ua)   根据 UA 判断是否手机端（页面内分流脚本的模板侧备选）
 * 最后修改：2026-11-11
 * ============================================
 */
'use strict';

hexo.extend.helper.register('current_year', function () {
  return String(new Date().getFullYear());
});

hexo.extend.helper.register('is_mobile', function (ua) {
  const agent = ua || '';
  return /Android|iPhone|iPod|HarmonyOS|Windows Phone|MicroMessenger|Mobile Safari/i.test(agent);
});
