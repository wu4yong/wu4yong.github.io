/*
  ============================================
  手机端页面路由生成器
  文件：scripts/phone-routes.js
  适用终端：手机端（/phone/ 前缀）
  作用：为手机端生成独立的列表页、标签页、关于页、文章原文页，
        让手机菜单点击后不再落进电脑端的三栏雷达控制台
        产出路由：
          /phone/c/<分类>/     分类文章列表（layout: phone/list）
          /phone/t/<标签>/     标签文章列表（layout: phone/list）
          /phone/tags/         星迹索引标签云（layout: phone/tags）
          /phone/about/        秘境主人（layout: phone/about）
          /phone/p/<slug>/     文章原文（layout: phone/post）

        两点构建期事实：Hexo 的 generator 把 data 赋给模板里的 page；
        categories/tags 里的 posts 是纯文档对象（没有 moment 的 format 方法）。
        所以标题 / 日期 / 链接都在生成期算成普通字符串再交给模板。
  依赖：themes/butterfly/layout/phone/post.njk、list.njk、tags.njk、about.njk
  最后修改：2026-11-11
  ============================================
*/
'use strict';

function slugify(str) {
  return String(str || '').replace(/[^\w\u4e00-\u9fa5-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'untitled';
}

function postSlug(post) {
  if (!post) return 'untitled';
  return post.slug || slugify(post.title);
}

function dayStr(date) {
  try {
    var d = date ? new Date(date) : null;
    if (!d || isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  } catch (e) {
    return '';
  }
}

/* 标签名 → 手机端路径片段：优先用 hexo 生成的 tag.path 末段 */
function tagSlug(tag) {
  if (!tag) return '';
  var p = String(tag.path || '').replace(/^tags\//, '').replace(/\/$/, '');
  if (!p) p = slugify(tag.name);
  try { p = decodeURIComponent(p); } catch (e) { /* 保留原样 */ }
  return p;
}

/* 分类名 → 手机端路径片段 */
function catSlug(cat) {
  if (!cat) return '';
  var p = String(cat.path || '').replace(/^categories\//, '').replace(/\/$/, '');
  return p ? p.split('/').pop() : slugify(cat.name);
}

hexo.extend.helper.register('phone_tag_url', function (tag) {
  return '/phone/t/' + encodeURIComponent(tagSlug(tag)) + '/';
});

hexo.extend.helper.register('phone_cat_slug', catSlug);

hexo.extend.helper.register('phone_post_url', function (post) {
  return '/phone/p/' + postSlug(post) + '/';
});

hexo.extend.generator.register('phone_pages', function (locals) {
  var routes = [];

  /* 1. 文章原文页 */
  locals.posts.sort('-date').each(function (post) {
    var cats = [];
    if (post.categories) post.categories.each(function (c) { cats.push(c.name); });
    var tags = [];
    if (post.tags) post.tags.each(function (t) { tags.push(t.name); });

    routes.push({
      path: 'phone/p/' + postSlug(post) + '/index.html',
      layout: ['phone/post'],
      data: {
        item: {
          title: post.title,
          dateStr: dayStr(post.date),
          content: post.content,
          cats: cats.join(' · '),
          tags: tags.join(' · ')
        }
      }
    });
  });

  /* 2. 分类列表页 */
  locals.categories.sort('name').each(function (cat) {
    var items = [];
    cat.posts.sort('-date').each(function (p) {
      items.push({ t: p.title, u: '/phone/p/' + postSlug(p) + '/', d: dayStr(p.date) });
    });
    routes.push({
      path: 'phone/c/' + catSlug(cat) + '/index.html',
      layout: ['phone/list'],
      data: { title: cat.name, sub: '分类档案', items: items }
    });
  });

  /* 3. 标签列表页 */
  locals.tags.sort('name').each(function (tag) {
    var items = [];
    tag.posts.sort('-date').each(function (p) {
      items.push({ t: p.title, u: '/phone/p/' + postSlug(p) + '/', d: dayStr(p.date) });
    });
    routes.push({
      /* 路径里不能预先 encodeURIComponent：Hexo 会原样当作目录名，
         生成出 %E5%A4%A7... 这种百分号目录，浏览器再请求时被解码成中文
         反而找不到目录（表现为点标签跳回首页/404）。目录用原始名，
         链接里再编码即可。 */
      path: 'phone/t/' + tagSlug(tag) + '/index.html',
      layout: ['phone/list'],
      data: { title: '#' + tag.name, sub: '标签档案', items: items }
    });
  });

  /* 4. 星迹索引（标签云） */
  var chips = [];
  locals.tags.sort('-length').each(function (tag) {
    chips.push({ n: tag.name, c: tag.length, u: '/phone/t/' + encodeURIComponent(tagSlug(tag)) + '/' });
  });
  routes.push({
    path: 'phone/tags/index.html',
    layout: ['phone/tags'],
    data: { chips: chips }
  });

  /* 5. 秘境主人（复用 source/about 正文） */
  var aboutPage = null;
  locals.pages.each(function (p) {
    if (!aboutPage && /(^|\/)about\/index\.md$/.test(p.source || '')) aboutPage = p;
  });
  /* 手机端流量敏感：正文配图全部改成懒加载 + 异步解码，首屏不必等 8 张照片 */
  var aboutHtml = aboutPage ? String(aboutPage.content || '') : '';
  aboutHtml = aboutHtml.replace(/<img\s+/g, '<img loading="lazy" decoding="async" ');
  routes.push({
    path: 'phone/about/index.html',
    layout: ['phone/about'],
    data: { aboutHtml: aboutHtml }
  });

  return routes;
});
