// scripts/my-category-generator.js
hexo.extend.generator.register('my_category_page', function (locals) {
  const categoryDir = hexo.config.category_dir || 'categories';
  const result = [];

  locals.categories.forEach(cat => {
    // 取出文章，按日期降序排序
    const sortedPosts = cat.posts.toArray().sort((a, b) => {
      return a.date.valueOf() - b.date.valueOf();
    });

    result.push({
      path: `${categoryDir}/${cat.name}/index.html`,
      layout: 'categories',
      data: {
        category: cat.name,
        posts: sortedPosts // ✅ 排好序的数组，直接注入到 page.posts
      }
    });
  });
  return result;
});