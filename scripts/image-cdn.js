/**
 * ============================================
 * 图床地址注入
 * 文件：scripts/image-cdn.js
 * 适用：全站文章（source/_posts 下所有 .md）
 * 作用：把文章里的占位符 @@CDN@@ 替换成 _config.yml 中 image_cdn.base 的实际地址，
 *       让「换图床」变成只改一行配置，而不是全文搜替 1700 多处链接。
 *
 * 数据流：
 *   md 源文件   ![说明](@@CDN@@/assets/img/java/x.webp)
 *     ↓ before_post_render（本文件第 1 个 filter，处理 markdown 原文）
 *   渲染输入   ![说明](https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/java/x.webp)
 *     ↓ marked 渲染
 *   页面 HTML  <img src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/java/x.webp">
 *
 * 兜底：历史文章可能残留硬编码的 jsDelivr 绝对地址（改造前的存量），
 *       由 after_post_render 在 HTML 上把「属性里的」旧前缀改写成当前 base，
 *       只匹配 src= / href= / url( 三种上下文，不碰正文纯文本与代码块里展示的示例地址。
 *
 * 注意：after_post_render 只在「文章重新渲染」时执行；hexo 有 db.json 缓存，
 *       改完 base 必须 hexo clean 再 generate，否则已缓存的页面不会重跑 filter。
 * ============================================
 */
'use strict';

// 占位符：刻意用不常见符号，避免与文章正文里的普通文本冲突
const PLACEHOLDER = '@@CDN@@';

// 读取 base，去掉结尾多余的斜杠，保证与 @@CDN@@/assets/... 拼接后不会出现 //
function getBase() {
  const cfg = (hexo.config && hexo.config.image_cdn) || {};
  return String(cfg.base || '').trim().replace(/\/+$/, '');
}

// 历史硬编码前缀（改造前的存量地址），只用于兜底归一化
const LEGACY_PREFIX = 'https://cdn.jsdelivr.net/gh/wu4yong/starry-images@';

/**
 * 第 1 道：markdown 原文里替换占位符
 * 时机 before_post_render —— 在 marked 渲染前拿到纯 markdown，替换对 HTML 语法无副作用
 */
hexo.extend.filter.register('before_post_render', function (data) {
  const base = getBase();
  if (!base || typeof data.content !== 'string' || !data.content.includes(PLACEHOLDER)) {
    return data;
  }
  // split/join 而非 replaceAll：老版本 Node 无 replaceAll，且不需要正则转义
  data.content = data.content.split(PLACEHOLDER).join(base);
  return data;
});

/**
 * 第 2 道：渲染后的 HTML 兜底
 * 只改属性上下文里的旧前缀，避免误伤《换图床说明》里展示的示例文本
 */
hexo.extend.filter.register('after_post_render', function (data) {
  const base = getBase();
  if (!base || typeof data.content !== 'string') {
    return data;
  }

  // src="...@xxx/...""" 与 href="...@xxx/..."，把 @版本号 前缀整体换成 base
  data.content = data.content.replace(
    /((?:src|href)=")(https:\/\/cdn\.jsdelivr\.net\/gh\/wu4yong\/starry-images)@[0-9a-zA-Z._-]+/g
    , (m, p1) => p1 + base
  );

  // CSS 内联背景图 url("...") —— 少数文章用 HTML 块写背景图
  data.content = data.content.replace(
    /(url\(\s*["']?)(https:\/\/cdn\.jsdelivr\.net\/gh\/wu4yong\/starry-images)@[0-9a-zA-Z._-]+/g
    , (m, p1) => p1 + base
  );

  return data;
});
