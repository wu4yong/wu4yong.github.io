/*
  ============================================
  分类名展示助手
  文件：scripts/display-name.js
  适用终端：电脑端 + 手机端
  作用：注册模板助手 displayName(name)，统一分类名的展示写法。
        原因：Nunjucks 的 `| capitalize` 会把整串转小写再首字母大写，
              品牌型分类名（llmheima）会被渲染成 `Llmheima`，与文章卡片上的写法不一致。
        规则：全小写的分类名沿用旧习惯首字母大写（langchain -> Langchain）；
              含大写字母的自定义命名原样输出；
              品牌白名单（llmheima）强制原样小写输出，保证分类页与文章卡片一致。
  依赖：themes/butterfly/layout/category.njk、categories.njk
  最后修改：2026-11-26
  ============================================
*/

hexo.extend.helper.register('displayName', function (name) {
  var s = String(name == null ? '' : name);
  if (!s) return s;
  // 品牌白名单：小写即正式写法，不做首字母大写
  var keepAsIs = ['llmheima'];
  if (keepAsIs.indexOf(s) >= 0) return s;
  // 全小写：保留首字母大写的展示习惯
  if (s === s.toLowerCase()) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  // 自带头部大写的命名：原样展示
  return s;
});
