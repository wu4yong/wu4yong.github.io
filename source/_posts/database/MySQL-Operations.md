---
title: Mysql运维篇
date: 2026-10-26 03:00:00
categories:
  - database
tags:
  - MySQL数据库
---
<div class="essay-banner essay-image3">
   Mysql Operations & Maintenance
</div>

## 日志

### 错误日志

错误日志是 MySQL 中最重要的日志之一，它记录了当 mysqld 启动和停止时，以及服务器在运行过程中发生任何严重错误时的相关信息当数据库出现任何故障导致无法正常使用时，建议首先查看此日志。

该日志是默认开启的，默认存放目录 /var/log/，默认的日志文件名为 mysqld.log 。查看日志位置：

`show variables like '%log_error%'`

### 二进制日志

#### 介绍

二进制日志(BINLOG)记录了所有的 DDL(数据定义语言)语句和 DML(数据操纵语言)语句，但不包括数据查询(SELECT、SHOW)语句。

作用：

1. 灾难时的数据恢复；
2. MySQL的主从复制。

在MVSOL8版本中，默认二进制日志是开启着的，涉及到的参数如下：

`show variables like '%log_bin%'`

#### 日志格式

MySQL服务器中提供了多种格式来记录二进制记录，具体格式及特点如下：

| 日志格式 | 含义 |
| --- | --- |
| statement | 基于SQL语句的日志记录，记录的是SQL语句，对数据进行修改的SQL都会记录在日志文件中。 |
| row | 基于行的日志记录，记录的是每一行的数据变更。(默认) |
| mined | 混合了STATEMENT和ROW两种格式，默认采用STATEMENT，在某些特殊情况下会自动切换为ROW进行记录。 |

查看参数方式：`show variables like '%binlog_format%';`

#### 日志查看

由于日志是以二进制方式存储的，不能直接读取，需要通过二进制日志查询工具 mysqlbinlog 来查看，具体语法：

```plaintext
mysqlbinlog[参数选项]logfilename

参数选项：
    -d    指定数据库名称，只列出指定的数据库相关的操作。
    -o    忽略掉日志中的前n行命令。
    -v    将行事件(数据变更)重构为SOL语句。
    -w    将行事件(数据变更)重构为SQL语句，并输出注释信息
```

#### 日志删除

对于比较繁忙的业务系统，每天生成的binlog数据巨大，如果长时间不清除，将会占用大量磁盘空间。可以通过以下几种方式清理日志：

| 指令 | 含义 |
| --- | --- |
| reset master | 删除全部 binlog 日志，删除之后，日志编号，将从 binlog.000001重新开始 |
| purge master logs to ‘binlog.\*\*\*’ | 删除 \*\*\* 编号之前的所有日志 |
| purge master logs before ‘yyyy-mm-dd hh24:mi:ss’ | 删除日志为”yyyy-mm-dd hh24:mi:ss”之前产生的所有日志 |

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

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/58131011726.png" alt="58131011726.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/4454682776.png" alt="4454682776.png"></div>

### 原理

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/7410105910882.png" alt="7410105910882.png"></div>

### 搭建实现

#### 主库配置

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/21103533211.png" alt="21103533211.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/24794193710.png" alt="24794193710.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/91294866110.png" alt="91294866110.png"></div>

#### 从库配置

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/10617439921.png" alt="10617439921.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/21053341798.png" alt="21053341798.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/6153782135.png" alt="6153782135.png"></div>

#### 测试

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

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/4765397657.png" alt="4765397657.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/35239910325.png" alt="35239910325.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/106169108266.png" alt="106169108266.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/4616215143.png" alt="4616215143.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/86213810658.png" alt="86213810658.png"></div>

### Mycat概述

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/81010325101039.png" alt="81010325101039.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/6382138721.png" alt="6382138721.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/101795210673.png" alt="101795210673.png"></div>

### Mycat入门

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/96457210797.png" alt="96457210797.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/1891042610310.png" alt="1891042610310.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/qwe1324t14t.png" alt="qwe1324t14t.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/10197188896.png" alt="10197188896.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/59710648531.png" alt="59710648531.png"></div>

### Mycat配置

#### schema.xml

schema.xml作为MyCat中最重要的配置文件之一,涵盖了MyCat的逻辑库 、逻辑表 、分片规则、分片节点及数据源的配置.

主要包含以下三组标签:

- schema标签
- datanode标签
- datahost标签

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/32368131027.png" alt="32368131027.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/7484479134.png" alt="7484479134.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/10769359339.png" alt="10769359339.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/91315810623.png" alt="91315810623.png"></div>

#### rule.xml

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/951010415971.png" alt="951010415971.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/84271093639.png" alt="84271093639.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/3853211256.png" alt="3853211256.png"></div>

### Mycat分片

#### 垂直分库

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/9325751819.png" alt="9325751819.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/21931016227.png" alt="21931016227.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/9852726692.png" alt="9852726692.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/58109378671.png" alt="58109378671.png"></div>

#### 水平分表

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/1269361453.png" alt="1269361453.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/9977715254.png" alt="9977715254.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/131081045236.png" alt="131081045236.png"></div>

#### 分片规则

##### 范围分片

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/34510781883.png" alt="34510781883.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/2654319698.png" alt="2654319698.png"></div>

##### 取模分片

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/22173110191.png" alt="22173110191.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/7347361194.png" alt="7347361194.png"></div>

##### 一致性hash算法

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/73610917872.png" alt="73610917872.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/3171425417.png" alt="3171425417.png"></div>

##### 枚举分片

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/667103121103.png" alt="667103121103.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/11088699372.png" alt="11088699372.png"></div>

##### 应用指定算法

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/2632725279.png" alt="2632725279.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/1452119317.png" alt="1452119317.png"></div>

##### 固定hash算法

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/2375113118.png" alt="2375113118.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/1368697562.png" alt="1368697562.png"></div>

##### 字符串hash解析

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/53710618932.png" alt="53710618932.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/8619959324.png" alt="8619959324.png"></div>

##### 按天分片

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/1010769110977.png" alt="1010769110977.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/109109981999.png" alt="109109981999.png"></div>

##### 按自然月分片

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/4762746916.png" alt="4762746916.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/22673141012.png" alt="22673141012.png"></div>

### Mycat管理及监控

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/73451065142.png" alt="73451065142.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/7348156477.png" alt="7348156477.png"></div>

## 读写分离

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/52510452433.png" alt="52510452433.png"></div>

### 介绍

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/10918829811.png" alt="10918829811.png"></div>

### 一主一从读写分离

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/52287271210.png" alt="52287271210.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/4564143383.png" alt="4564143383.png"></div>

### 双主双从

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/245101066682.png" alt="245101066682.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/6338368756.png" alt="6338368756.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/2677654314.png" alt="2677654314.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/105101448841.png" alt="105101448841.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/7237222812.png" alt="7237222812.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/6246592973.png" alt="6246592973.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/12919109752.png" alt="12919109752.png"></div>

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

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/8536419478.png" alt="8536419478.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/mysql/15610682864.png" alt="15610682864.png"></div>

测试：

登录MyCat，测试查询及更新操作，判定是否能够进行读写分离，以及读写分离的策略是否正确。

当主库挂掉一个之后，是否能够自动切换。
