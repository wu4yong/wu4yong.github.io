/**
 * 星迹索引左栏「坐标矩阵」与雷达节点的时间排序依据（分类版）。
 *
 * starmap_category_time_ranks(): 为每个分类算一个时间位次。
 *   取该分类下「最新一篇文章」的日期作为排序键，越新位次越小，
 *   于是 2026 年的栏目排在最上面、2018 年的沉到最下面；
 *   前端 coord-grid 仍按 data-rank 升序、同年内按篇数倒序排。
 *
 * 与 tag-time-rank.js 的 starmap_tag_time_ranks() 并存：
 *   左栏改成按分类渲染（栏目 = categories），/tags/ 页仍是标签云，用 tag 版。
 */
let cache = null;

hexo.extend.helper.register('starmap_category_time_ranks', function () {
  if (cache) return cache;

  const newest = {};
  const posts = hexo.locals.get('posts');

  posts.forEach(function (post) {
    if (!post.categories || !post.categories.length) return;
    const t = post.date ? post.date.valueOf() : 0;
    post.categories.forEach(function (cat) {
      const name = cat.name;
      if (!(name in newest) || t > newest[name]) newest[name] = t;
    });
  });

  const ranks = {};
  Object.keys(newest)
    .sort(function (a, b) { return newest[b] - newest[a]; })
    .forEach(function (name, i) { ranks[name] = i; });

  cache = ranks;
  return ranks;
});
