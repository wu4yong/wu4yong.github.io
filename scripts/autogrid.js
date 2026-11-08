// scripts/autogrid.js 支持 nofix / 自定义class
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

  const header = lines[0].split('|').map(s => s.trim());
  // 外层容器增加自定义 class
  let html = `<div class="data-grid${customClass}"><div class="grid-header">`;
  header.forEach((txt, idx) => {
    if (!noFix && idx === 0) {
      html += `<div class="grid-cell grid-cell--fixed-sm">${txt}</div>`;
    } else {
      html += `<div class="grid-cell">${txt}</div>`;
    }
  });
  html += `</div>`;

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('|').map(s => s.trim());
    html += `<div class="grid-row">`;
    cols.forEach((txt, idx) => {
      if (!noFix && idx === 0) {
        html += `<div class="grid-cell grid-cell--fixed-sm">${txt}</div>`;
      } else {
        html += `<div class="grid-cell">${txt}</div>`;
      }
    });
    html += `</div>`;
  }
  html += `</div>`;
  return html;
}, { ends: true });