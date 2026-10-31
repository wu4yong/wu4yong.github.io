---
title: 图形化界面工具
date: 2026-06-06 01:00:00
categories:
  - database
tags:
  - MySQL数据库
---
<div class="essay-banner essay-image3">
   Mysql GUI Tools & Installation
</div>

# 图形化界面工具

- Workbench(免费): <http://dev.mysql.com/downloads/workbench/>
- navicat(收费，试用版30天): <https://www.navicat.com/en/download/navicat-for-mysql>
- Sequel Pro(开源免费，仅支持Mac OS): <http://www.sequelpro.com/>
- HeidiSQL(免费): <http://www.heidisql.com/>
- phpMyAdmin(免费): <https://www.phpmyadmin.net/>
- SQLyog: <https://sqlyog.en.softonic.com/>

# 安装

# 小技巧

1. 在SQL语句之后加上`\G`会将结果的表格形式转换成行文本形式
2. 查看Mysql数据库占用空间：

```plaintext
SELECT table_schema "Database Name", SUM(data_length + index_length) / (1024 * 1024) "Database Size in MB"
FROM information_schema.TABLES
GROUP BY table_schema;
```
