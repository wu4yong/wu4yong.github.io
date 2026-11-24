const fs = require('fs');
const path = require('path');
const SRC_IMG = path.join(__dirname, '../source/assets/img');
const DST = path.join('E:\\devSoft\\Microsoft VS Code\\workspace2026\\starry-images','assets','img');

if (!fs.existsSync(SRC_IMG)) throw '源图片目录不存在';
fs.cpSync(SRC_IMG, DST, { recursive:true, force:false });
console.log('✅复制完成，同名文件不会覆盖');
