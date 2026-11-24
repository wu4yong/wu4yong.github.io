---
title: Mysql运维篇
date: 2021-08-09 23:46:40
categories:
  - database
tags:
  - MySQL数据库
---
<div class="essay-banner essay-database"></div>

## 日志

### 错误日志

错误日志是 MySQL 中最重要的日志之一，它记录了当 mysqld 启动和停止时，以及服务器在运行过程中发生任何严重错误时的相关信息当数据库出现任何故障导致无法正常使用时，建议首先查看此日志。

该日志是默认开启的，默认存放目录 /var/log/，默认的日志文件名为 mysqld.log 。查看日志位置：

`show variables like '%log_error%'`

### 二进制日志

### 介绍

二进制日志(BINLOG)记录了所有的 DDL(数据定义语言)语句和 DML(数据操纵语言)语句，但不包括数据查询(SELECT、SHOW)语句。

作用：

1. 灾难时的数据恢复；
2. MySQL的主从复制。

在MVSOL8版本中，默认二进制日志是开启着的，涉及到的参数如下：

`show variables like '%log_bin%'`

### 日志格式

MySQL服务器中提供了多种格式来记录二进制记录，具体格式及特点如下：

{% autogrid data-grid-link-table nofix %}
日志格式|含义
statement|基于SQL语句的日志记录，记录的是SQL语句，对数据进行修改的SQL都会记录在日志文件中。
row|基于行的日志记录，记录的是每一行的数据变更。(默认)
mined|混合了STATEMENT和ROW两种格式，默认采用STATEMENT，在某些特殊情况下会自动切换为ROW进行记录。
{% endautogrid %}

查看参数方式：`show variables like '%binlog_format%';`

### 日志查看

由于日志是以二进制方式存储的，不能直接读取，需要通过二进制日志查询工具 mysqlbinlog 来查看，具体语法：

```plaintext
mysqlbinlog[参数选项]logfilename

参数选项：
    -d    指定数据库名称，只列出指定的数据库相关的操作。
    -o    忽略掉日志中的前n行命令。
    -v    将行事件(数据变更)重构为SOL语句。
    -w    将行事件(数据变更)重构为SQL语句，并输出注释信息
```

### 日志删除

对于比较繁忙的业务系统，每天生成的binlog数据巨大，如果长时间不清除，将会占用大量磁盘空间。可以通过以下几种方式清理日志：

{% autogrid data-grid-link-table nofix %}
指令|含义
reset master|删除全部 binlog 日志，删除之后，日志编号，将从 binlog.000001重新开始
purge master logs to ‘binlog.\*\*\*’|删除 \*\*\* 编号之前的所有日志
purge master logs before ‘yyyy-mm-dd hh24:mi:ss’|删除日志为”yyyy-mm-dd hh24:mi:ss”之前产生的所有日志
{% endautogrid %}

也可以在mysql的配置文件中配置二进制日志的过期时间，设置了之后，二进制日志过期会自动删除.

`show variables like '%binlog_expire_logs_seconds%'`

### 查询日志

查询日志中记录了客户端的所有操作语句，而二进制日志不包含查询数据的SQL语句。默认情况下，查询日志是未开启的。如果需要开启查询日志，可以设置一下配置：

修改MySQL的配置文件 /etc/my.cnf 文件，添加如下内容：

```plaintext
#该选项用来开启查询日志，可选值：0或者1；0代表关闭，1代表开启
general_log=1
#设置日志的文件名 ， 如果没有指定，默认的文件名为 host_name.log
general_log_file=mysql_query.log
```

### 慢查询日志

慢查询日志记录了所有执行时间超过参数 long\_query\_time 设置值并且扫描记录数不小于 min\_examined\_row\_limit的所有的SQL语句的日志，默认未开启。long\_query\_time 默认为 10 秒，最小为0，精度可以到微秒。

```sql
#慢查询日志
slow_query_log=1
#执行时间参数
long_query_time=2
```

默认情况下，不会记录管理语句，也不会记录不使用索引进行查找的查询。可以使用log\_slow\_admin\_statements和更改此行为log\_queries\_not\_using\_indexes，如下所述。

```sql
#记录执行较慢的管理语句
log_slow_admin_statements = 1
#记录执行较慢的未使用索引的语句
log_queries_not_using_indexes = 1
```

## 主从复制

![58131011726.png](@@CDN@@/assets/img/mysql/58131011726.webp)

![4454682776.png](@@CDN@@/assets/img/mysql/4454682776.webp)

### 原理

![7410105910882.png](@@CDN@@/assets/img/mysql/7410105910882.webp)

### 搭建实现

### 主库配置

![21103533211.png](@@CDN@@/assets/img/mysql/21103533211.webp)

![24794193710.png](@@CDN@@/assets/img/mysql/24794193710.webp)

![91294866110.png](@@CDN@@/assets/img/mysql/91294866110.webp)

### 从库配置

![10617439921.png](@@CDN@@/assets/img/mysql/10617439921.webp)

![21053341798.png](@@CDN@@/assets/img/mysql/21053341798.webp)

![6153782135.png](@@CDN@@/assets/img/mysql/6153782135.webp)

### 测试

1、在主库上创建数据库、表，并插入数据

```sql
create database db01;
use db01;
create table tb_use(
	id int(11) primary key not null auto_increment,
	name varchar(50) not null,
	sex varchar(1)
)engine=innodb default charset=utf8mb4;
insert into tb_user(id, name, sex) valurs (null, 'Tom', '1'), (null, 'Trigger', '0'), (null, 'Dawn', '1');
```

2、在从库中查询数据，验证主从是否同步。

## 分库分表

### 介绍

![4765397657.png](@@CDN@@/assets/img/mysql/4765397657.webp)

![35239910325.png](@@CDN@@/assets/img/mysql/35239910325.webp)

![106169108266.png](@@CDN@@/assets/img/mysql/106169108266.webp)

![4616215143.png](@@CDN@@/assets/img/mysql/4616215143.webp)

![86213810658.png](@@CDN@@/assets/img/mysql/86213810658.webp)

### Mycat概述

![81010325101039.png](@@CDN@@/assets/img/mysql/81010325101039.webp)

![6382138721.png](@@CDN@@/assets/img/mysql/6382138721.webp)

![101795210673.png](@@CDN@@/assets/img/mysql/101795210673.webp)

### Mycat入门

![96457210797.png](@@CDN@@/assets/img/mysql/96457210797.webp)

![1891042610310.png](@@CDN@@/assets/img/mysql/1891042610310.webp)

![qwe1324t14t.png](@@CDN@@/assets/img/mysql/qwe1324t14t.webp)

![10197188896.png](@@CDN@@/assets/img/mysql/10197188896.webp)

![59710648531.png](@@CDN@@/assets/img/mysql/59710648531.webp)

### Mycat配置

### schema.xml

schema.xml作为MyCat中最重要的配置文件之一,涵盖了MyCat的逻辑库 、逻辑表 、分片规则、分片节点及数据源的配置.

主要包含以下三组标签:

- schema标签
- datanode标签
- datahost标签

![32368131027.png](@@CDN@@/assets/img/mysql/32368131027.webp)

![7484479134.png](@@CDN@@/assets/img/mysql/7484479134.webp)

![10769359339.png](@@CDN@@/assets/img/mysql/10769359339.webp)

![91315810623.png](@@CDN@@/assets/img/mysql/91315810623.webp)

### rule.xml

![951010415971.png](@@CDN@@/assets/img/mysql/951010415971.webp)

![84271093639.png](@@CDN@@/assets/img/mysql/84271093639.webp)

![3853211256.png](@@CDN@@/assets/img/mysql/3853211256.webp)

### Mycat分片

### 垂直分库

![9325751819.png](@@CDN@@/assets/img/mysql/9325751819.webp)

![21931016227.png](@@CDN@@/assets/img/mysql/21931016227.webp)

![9852726692.png](@@CDN@@/assets/img/mysql/9852726692.webp)

![58109378671.png](@@CDN@@/assets/img/mysql/58109378671.webp)

### 水平分表

![1269361453.png](@@CDN@@/assets/img/mysql/1269361453.webp)

![9977715254.png](@@CDN@@/assets/img/mysql/9977715254.webp)

![131081045236.png](@@CDN@@/assets/img/mysql/131081045236.webp)

### 分片规则

### 范围分片

![34510781883.png](@@CDN@@/assets/img/mysql/34510781883.webp)

![2654319698.png](@@CDN@@/assets/img/mysql/2654319698.webp)

### 取模分片

![22173110191.png](@@CDN@@/assets/img/mysql/22173110191.webp)

![7347361194.png](@@CDN@@/assets/img/mysql/7347361194.webp)

### 一致性hash算法

![73610917872.png](@@CDN@@/assets/img/mysql/73610917872.webp)

![3171425417.png](@@CDN@@/assets/img/mysql/3171425417.webp)

### 枚举分片

![667103121103.png](@@CDN@@/assets/img/mysql/667103121103.webp)

![11088699372.png](@@CDN@@/assets/img/mysql/11088699372.webp)

### 应用指定算法

![2632725279.png](@@CDN@@/assets/img/mysql/2632725279.webp)

![1452119317.png](@@CDN@@/assets/img/mysql/1452119317.webp)

### 固定hash算法

![2375113118.png](@@CDN@@/assets/img/mysql/2375113118.webp)

![1368697562.png](@@CDN@@/assets/img/mysql/1368697562.webp)

### 字符串hash解析

![53710618932.png](@@CDN@@/assets/img/mysql/53710618932.webp)

![8619959324.png](@@CDN@@/assets/img/mysql/8619959324.webp)

### 按天分片

![1010769110977.png](@@CDN@@/assets/img/mysql/1010769110977.webp)

![109109981999.png](@@CDN@@/assets/img/mysql/109109981999.webp)

### 按自然月分片

![4762746916.png](@@CDN@@/assets/img/mysql/4762746916.webp)

![22673141012.png](@@CDN@@/assets/img/mysql/22673141012.webp)

### Mycat管理及监控

![73451065142.png](@@CDN@@/assets/img/mysql/73451065142.webp)

![7348156477.png](@@CDN@@/assets/img/mysql/7348156477.webp)

## 读写分离

![52510452433.png](@@CDN@@/assets/img/mysql/52510452433.webp)

### 介绍

![10918829811.png](@@CDN@@/assets/img/mysql/10918829811.webp)

### 一主一从读写分离

![52287271210.png](@@CDN@@/assets/img/mysql/52287271210.webp)

![4564143383.png](@@CDN@@/assets/img/mysql/4564143383.webp)

### 双主双从

![245101066682.png](@@CDN@@/assets/img/mysql/245101066682.webp)

![6338368756.png](@@CDN@@/assets/img/mysql/6338368756.webp)

![2677654314.png](@@CDN@@/assets/img/mysql/2677654314.webp)

![105101448841.png](@@CDN@@/assets/img/mysql/105101448841.webp)

![7237222812.png](@@CDN@@/assets/img/mysql/7237222812.webp)

![6246592973.png](@@CDN@@/assets/img/mysql/6246592973.webp)

![12919109752.png](@@CDN@@/assets/img/mysql/12919109752.webp)

测试：

分别在两台主库Master1、Master2上执行DDL、DML语句，查看涉及到的数据库服务器的数据同步情况。

```plaintext
create database db01;
use db01;
create table tb_user(
	id in(11)not null primary key,
	name varchar(50) not null,
	sex varcahr(1)
)engine=innodb default charset=utf8mb4

insert into tb user(id,name,sex) values(l,'Tom','1');
insert into tb user(id,name,sex) values(2,'Trigger','0');
insert into tb user(id,name,sex) values(3,'Dawn','1');
insert into tb user(id,name,sex) values(4,"ack Ma','1');
insertinto tb user(id,name,sex) values(5,'Coco','0');
insert into tb user(id,name,sex) values(6,'erry','1');
```

### 双主双从读写分离

![8536419478.png](@@CDN@@/assets/img/mysql/8536419478.webp)

![15610682864.png](@@CDN@@/assets/img/mysql/15610682864.webp)

测试：

登录MyCat，测试查询及更新操作，判定是否能够进行读写分离，以及读写分离的策略是否正确。

当主库挂掉一个之后，是否能够自动切换。
