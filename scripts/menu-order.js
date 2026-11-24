/**
 * 星图控制台「坐标矩阵」的排序依据：_config.butterfly.yml 的 menu 顺序。
 *
 * starmap_menu_order(): 返回 menu 里所有 /categories/ 分类路径（父级 → 子级顺序）。
 * starmap_tag_ranks():  按上面的顺序，为每个标签算出它在菜单里的位次
 *                       （取该标签下所有文章中最早出现的分类位次）。
 */
/* 菜单里的部分分类路径与站内实际分类 slug 不一致，这里做别名映射，
   保证「随笔」「音乐/电影/图片/游戏」也能落到正确位次 */
const MENU_ALIASES = {
  '/categories/story/': '/categories/essay/',
  '/categories/fun/movie/': '/categories/movie/',
  '/categories/fun/photo/': '/categories/photo/',
  '/categories/fun/game/': '/categories/game/'
};
function toPath(value) {
  if (typeof value === 'string') return value.split('||')[0].trim();
  if (value && typeof value === 'object' && typeof value.path === 'string') {
    return value.path.split('||')[0].trim();
  }
  return '';
}

function normalize(path) {
  return '/' + String(path || '').replace(/^\/+/, '').replace(/\/+$/, '') + '/';
}

function menuPaths() {
  const menu = (hexo.theme.config && hexo.theme.config.menu) || {};
  const out = [];

  Object.keys(menu).forEach(function (key) {
    const value = menu[key];
    const submenu = value && typeof value === 'object' && value.submenu ? value.submenu : null;

    if (submenu) {
      Object.keys(submenu).forEach(function (subKey) {
        const path = toPath(submenu[subKey]);
        if (path.indexOf('/categories/') === 0) out.push(normalize(path));
      });
      return;
    }

    const path = toPath(value);
    if (path.indexOf('/categories/') === 0) out.push(normalize(path));
  });

  return out;
}

let rankCache = null;

hexo.extend.helper.register('starmap_menu_order', function () {
  return menuPaths();
});

hexo.extend.helper.register('starmap_tag_ranks', function () {
  if (rankCache) return rankCache;

  const paths = menuPaths();
  const ranks = {};
  const posts = hexo.locals.get('posts');

  function rankOfCategory(path) {
    const p = normalize(path);
    const direct = paths.indexOf(p);
    if (direct >= 0) return direct;
    const aliasKey = Object.keys(MENU_ALIASES).filter(function (k) { return MENU_ALIASES[k] === p; })[0];
    return aliasKey ? paths.indexOf(aliasKey) : -1;
  }

  posts.forEach(function (post) {
    if (!post.tags || !post.categories) return;

    let rank = -1;
    post.categories.forEach(function (cat) {
      const idx = rankOfCategory(cat.path);
      if (idx >= 0 && (rank === -1 || idx < rank)) rank = idx;
    });

    post.tags.forEach(function (tag) {
      const name = tag.name;
      if (!(name in ranks) || (rank >= 0 && (ranks[name] < 0 || rank < ranks[name]))) {
        ranks[name] = rank;
      }
    });
  });

  rankCache = ranks;
  return ranks;
});
