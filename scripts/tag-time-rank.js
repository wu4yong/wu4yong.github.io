/**
 * 坐标矩阵 / 星迹索引的「时间排序」依据。
 *
 * starmap_tag_time_ranks(): 为每个标签算一个时间位次。
 *   取该标签名下「最新一篇文章」的日期作为排序键，越新位次越小，
 *   于是 2026 年的分类排在最上面、2018 年的沉到最下面；
 *   前端 coord-grid 仍按 data-rank 升序、同年内按篇数倒序排。
 *
 * 与 menu-order.js 的 starmap_tag_ranks()（按 _config.butterfly.yml 菜单顺序）
 * 并存：后者只作兜底，站点想改回「按菜单分类」时换回即可。
 */
let cache = null;

hexo.extend.helper.register('starmap_tag_time_ranks', function () {
  if (cache) return cache;

  const newest = {};
  const posts = hexo.locals.get('posts');

  posts.forEach(function (post) {
    if (!post.tags || !post.tags.length) return;
    const t = post.date ? post.date.valueOf() : 0;
    post.tags.forEach(function (tag) {
      const name = tag.name;
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
