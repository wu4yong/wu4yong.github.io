/*
  ============================================
  坐标矩阵网格标签插件
  文件：autogrid.js
  适用终端：电脑端
  作用：hexo-extend tag：autogrid，把「竖线分隔的纯文本行」渲染成矩阵网格容器
  最后修改：2026-11-14
  说明：单元格内容先做一次行内 Markdown 渲染（反引号、粗体、链接、斜体），
        再去掉外层 <p>，这样 autogrid 里的 `代码` 和 **强调** 不会裸露成字面量。
  ============================================
*/
// scripts/autogrid.js 支持 nofix / 自定义class

// 单元格行内渲染：Markdown → HTML，并剥掉单段落的外层 <p>
function renderCell(text) {
  var src = String(text == null ? '' : text).trim();
  if (!src) return '';
  try {
    var html = hexo.render.renderSync({ text: src, engine: 'markdown' }).trim();
    // 只有一段、且没有嵌套段落时剥壳；多段落保留原样
    if (html.indexOf('<p>') === 0 && html.indexOf('</p>') === html.length - 4 &&
        html.indexOf('<p>', 1) === -1) {
      html = html.slice(3, html.length - 4).trim();
    }
    return html;
  } catch (e) {
    return src;
  }
}

// 拆分一行单元格：只去掉与行首/行尾竖线对应的两个空元素，还原 \| 转义
// 注意不能循环删空——`|  | SQL | NoSQL |` 的首格是真实存在的空单元格，循环删会把它吞掉导致表头与数据错列
function splitRow(line) {
  var PH = '\u0001';
  var parts = line.replace(/\\\|/g, PH).split('|').map(function (s) { return s.trim(); });
  if (parts.length && parts[0] === '') parts.shift();
  if (parts.length && parts[parts.length - 1] === '') parts.pop();
  return parts.map(function (s) { return s.split(PH).join('|'); });
}

// 列清洗：先补齐到统一宽度，再删掉所有行都为空的整列
// 源表格常写成 |  | SQL | NoSQL |（首列空），不删就会在网格前后各留一条空栏
function normalizeRows(rowData) {
  var width = 0;
  rowData.forEach(function (r) { if (r.length > width) width = r.length; });
  if (width < 2) return rowData;
  var padded = rowData.map(function (r) {
    var a = r.slice();
    while (a.length < width) a.push('');
    return a;
  });
  var keep = [];
  for (var c = 0; c < width; c++) {
    if (padded.some(function (r) { return r[c] !== ''; })) keep.push(c);
  }
  if (keep.length === width) return padded;
  return padded.map(function (r) { return keep.map(function (c) { return r[c]; }); });
}

hexo.extend.tag.register('autogrid', function (args, content) {
  let noFix = false;
  let customClass = '';

  // 解析参数： nofix / data-grid-link-table
  args.forEach(arg => {
    if(arg === 'nofix'){
      noFix = true;
    }else{
      customClass += ' ' + arg;
    }
  });

  const lines = content.trim().split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return '';

  // 先全部拆成行列，统一做列清洗（去整列空白、补齐宽度）
  const rowData = normalizeRows(lines.map(splitRow));
  if (rowData.length === 0) return '';

  const header = rowData[0];
  // 外层容器增加自定义 class
  let html = `<div class="data-grid${customClass}">`;
  // 表头全为空（单列提示框写法）时不渲染表头条，避免出现一条空栏
  const headerEmpty = header.every(function (t) { return String(t).trim() === ''; });
  if (!headerEmpty) {
    html += `<div class="grid-header">`;
    header.forEach((txt, idx) => {
      if (!noFix && idx === 0) {
        html += `<div class="grid-cell grid-cell--fixed-sm">${renderCell(txt)}</div>`;
      } else {
        html += `<div class="grid-cell">${renderCell(txt)}</div>`;
      }
    });
    html += `</div>`;
  }

  for (let i = 1; i < rowData.length; i++) {
    const cols = rowData[i];
    html += `<div class="grid-row">`;
    cols.forEach((txt, idx) => {
      if (!noFix && idx === 0) {
        html += `<div class="grid-cell grid-cell--fixed-sm">${renderCell(txt)}</div>`;
      } else {
        html += `<div class="grid-cell">${renderCell(txt)}</div>`;
      }
    });
    html += `</div>`;
  }
  html += `</div>`;
  return html;
}, { ends: true });