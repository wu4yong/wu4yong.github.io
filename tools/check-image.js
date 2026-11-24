const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const BLOG_DIR  = path.join(__dirname, '..');   // 👈关键：向上跳出tools
const POST_DIR  = path.join(BLOG_DIR, 'source/_posts');
const SRC_ROOT  = path.join(BLOG_DIR, 'source');          // 站点根：/assets/img/x.png => source/assets/img/x.png
const time = new Date().toISOString().replace(/[:.]/g, '-');
const OUTPUT = path.join(BLOG_DIR, `img_check_${time}.csv`);

// 同时抓 <img ... src="..."> 和 ![](path)
const PATTERNS = [
  /<img[^>]*?src\s*=\s*["']([^"']+)["']/gi,
  /!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g
];

function normalize(raw, mdDir) {
  let p = raw.trim().replace(/\\/g, '/').split('?')[0].split('#')[0];
  if (/^(http|https|data|\/\/)/i.test(p)) return { lay: 'remote', file: null };
  p = p.replace(/\s+["'][^"']*["']\s*$/, '').trim();     // 去掉 md 标题残留
  if (p.startsWith('/'))  return { lay: 'root',   file: path.join(SRC_ROOT, p.slice(1)) };
  if (p.startsWith('../') || p.startsWith('./'))
    return { lay: 'relmd', file: path.resolve(mdDir, p) };
  return { lay: 'root', file: path.join(SRC_ROOT, p) };  // assets/img/... 无前导斜杠
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (e.name.toLowerCase().endsWith('.md')) out.push(f);
  }
  return out;
}

(async () => {
  const list = walk(POST_DIR);
  console.log(`扫描 ${list.length} 篇 md`);
  const res = [['文章', '图片地址', '路径基准', '解析路径', '类型', '是否缺失']];
  let miss = 0, ok = 0;
  for (const md of list) {
    const txt = await readFile(md, 'utf8');
    const seen = new Set();
    for (const re of PATTERNS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(txt)) !== null) {
        const raw = m[1].trim();
        if (!raw || seen.has(raw)) continue;
        seen.add(raw);
        const n = normalize(raw, path.dirname(md));
        if (n.lay === 'remote') { res.push([md, raw, '远程', '—', 'remote', '']); continue; }
        const exists = fs.existsSync(n.file);
        res.push([md, raw, n.lay, n.file, 'local', exists ? '否' : '是']);
        exists ? ok++ : miss++;
      }
    }
  }
  await writeFile(OUTPUT, res.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n'), 'utf8');
  console.log(`本地图片：正常 ${ok} 张，缺失 ${miss} 张`);
  console.log('报告：', OUTPUT);
})();
