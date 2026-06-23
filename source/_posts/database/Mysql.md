---
title: Mysql基础
date: 2026-06-02 08:00:00
categories:
  - database
tags:
  - Mysql
  - 数据库基础
top_img: /assets/img/database.png
cover: /assets/img/mysql/basic.png
---
# 基础篇

## 通用语法及分类
- DDL：数据定义语言，用来定义数据库对象（数据库、表、字段）
- DML：数据操作语言，用来对数据库表中的数据进行增删改
- DQL：数据查询语言，用来查询数据库中表的记录
- DCL：数据控制语言，用来创建数据库用户、控制数据库的控制权限
  
# DDL（数据定义语言）

## 数据定义语言
### 数据库操作

- 查询所有数据库：
    ```sql
    SHOW DATABASES;
- 查询当前数据库
    ```sql
    SELECT DATABASE();
- 创建数据库：
    ```sql
    CREATE DATABASE [ IF NOT EXISTS ] 数据库名 [ DEFAULT CHARSET 字符集] [COLLATE 排序规则 ];
- 删除数据库：
    ```sql
    DROP DATABASE [ IF EXISTS ] 数据库名;
- 使用数据库：
    USE 数据库名;
