---
title: Redis-分布式缓存
date: 2025-09-03 01:00:00
categories:
  - database
tags:
  - redis
---
<div class="essay-banner essay-image4"></div>

# 三、分布式缓存

单机的Redis存在的问题与解决方案：

|        |                                     |                       |
| ------ | ----------------------------------- | --------------------- |
|        | 问题描述                                | 解决方案                  |
| 数据丢失问题 | Redis是内存存储，服务重启可能会丢失数据              | 实现Redis数据持久化          |
| 并发能力问题 | 单节点Redis并发能力虽然不错，但也无法满足如618这样的高并发场景 | 搭建主从集群，实现读写分离         |
| 存储能力问题 | Redis基于内存，单节点能存储的数据量是难以满足海量数据需求     | 搭建分片集群，利用插槽机制实现动态扩容   |
| 故障恢复问题 | 如果Redis宕机，则服务不可用，需要一种自动的故障恢复手段      | 利用Redis哨兵，实现健康检测和自动恢复 |

## 1.Redis持久化

### 1.1 RDB持久化

RDB即Redis数据备份文件，也被叫做Redis数据快照。将内存中的所有数据都记录到磁盘中，当Redis实例故障重启后，从磁盘读取快照文件，恢复数据。快照文件称为RDB文件，默认是保存在当前运行目录。

### 1.1.1 执行时机

RDB持久化在四种情况下会执行：

执行save命令：save命令立马执行RDB持久化，但是主线程会被阻塞，期间其他命令无法执行，只有数据迁移时可能用到

执行bgsave命令：bgsave命令开启一个新线程执行RDB持久化，主线程不会被阻塞，不影响主进程处理用户请求

Redis停机时：Redis停机时会自动执行一次save命令，实现RDB持久化

触发RDB条件时：在redis.conf文件中可以配置RDB触发条件

```properties
# 如save 900 1表示：900秒内如果至少有1个key被修改，则执行bgsave
# save ""则表示禁用RDB
save 900 1
save 300 10
save 60 10000

# 是否压缩，建议设置no不开启，压缩也会消耗cpu，磁盘的话不值钱
rdbcompression yes

# RDB文件名称，默认是dump.rdb
dbfilename dump.rdb

# rdb文件保存的路径目录，./表示当前目录
dir ./
```

### 1.1.2 RDB原理

bgsave开始时会fork主进程得到子进程，子进程共享主进程的内存数据。完成fork后读取内存数据并写入 RDB 文件。

fork采用的是copy-on-write技术：

当主进程执行读操作时，访问共享内存

当主进程执行写操作时，则会拷贝一份数据，执行写操作

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image82.png" alt="image82.png"></div>

Redis并不会直接操作内存，而是为进程设置一个虚拟内存，并通过页表保存虚拟内存和物理内存的映射关系，bgsave开始fork主进程得到一个子进程，同时将物理内存中的数据标记为read-only，仅仅复制页表，子进程根据页表读取内存中的数据写一个新的rdb文件替换旧的rdb文件，如果复制页表或写rdb文件时主进程执行写操作，会将内存中的原数据拷贝一个副本，修改并读取副本的数据。

RDB的缺点：执行间隔时间长，两次RDB之间写入数据有丢失的风险；fork子进程、压缩、写出RDB文件都比较耗时。

### 1.2 AOF持久化

### 1.2.1 AOF原理

AOF即追加文件。Redis处理的每一个写命令都会记录在AOF文件，可以看做是命令日志文件：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image83.png" alt="image83.png"></div>

### 1.2.2 AOF配置

AOF默认是关闭的，需要修改redis.conf配置文件开启AOF：

```properties
# 是否开启AOF功能，默认是no
appendonly yes
# AOF文件的名称
appendfilename "appendonly.aof"
```

AOF的命令记录的频率也可以通过redis.conf文件来配置：

```properties
# 表示每执行一次写命令，立即记录到AOF文件
appendfsync always
# 写命令执行完先放入AOF缓冲区，然后表示每隔1秒将缓冲区数据写到AOF文件，是默认方案
appendfsync everysec
# 写命令执行完先放入AOF缓冲区，由操作系统决定何时将缓冲区内容写回磁盘，不建议
appendfsync no
```

|          |        |              |                |
| -------- | ------ | ------------ | -------------- |
| 配置项      | 刷盘时机   | 优点           | 缺点             |
| Always   | 同步刷盘   | 可靠性高，几乎不丢失数据 | 性能影响大          |
| everysec | 每秒刷盘   | 性能适中         | 最多丢失1秒数据       |
| no       | 操作系统控制 | 性能最好         | 可靠性较差，可能丢失大量数据 |

### 1.2.3 AOF文件重写

因为AOF文件记录命令，往往比RDB文件大得多。对同一条数据的两次修改只有最后一条命令有效，但是会记录两次命令，通过bgrewriteaof命令可以对AOF文件进行重写，节省空间：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image84.png" alt="image84.png"></div>

Redis也会在触发阈值时自动去重写AOF文件，阈值可以在redis.conf中配置：

```properties
# AOF文件比上次文件 增长超过多少百分比则触发重写
auto-aof-rewrite-percentage 100
# AOF文件体积最小多大以上才触发重写
auto-aof-rewrite-min-size 64mb
```

### 1.3 RDB与AOF对比

RDB和AOF各有自己的优缺点，如果对数据安全性要求较高，在实际开发中往往会**结合**两者来使用。

|             |                        |                                  |
| ----------- | ---------------------- | -------------------------------- |
|             | RDB                    | AOF                              |
| **持久化方式**   | 定时对整个内存做快照             | 记录每一次执行的命令                       |
| **数据完整性**   | 不完整，两次备份之间会丢失          | 相对完整，取决于刷盘策略                     |
| **文件大小**    | 会有压缩，文件体积小             | 记录命令，文件体积很大                      |
| **宕机恢复速度**  | 很快                     | 慢                                |
| **数据恢复优先级** | 低，因为数据完整性不如AOF         | 高，因为数据完整性更高                      |
| **系统资源占用**  | 高，大量CPU和内存消耗           | 低，主要是磁盘IO资源，但AOF重写时会占用大量CPU和内存资源 |
| **使用场景**    | 可以容忍数分钟的数据丢失，追求更快的启动速度 | 对数据安全性要求较高要求                     |

## 2.Redis主从

单节点Redis的并发能力是有上限的，要进一步提高Redis的并发能力，就需要搭建主从集群，实现读写分离。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image85.png" alt="image85.png"></div>

### 2.1 Redis主从环境搭建

以在同一台虚拟机开启多个Redis实例为例进行主从集群搭建：

|                 |      |        |
| --------------- | ---- | ------ |
| IP              | PORT | 角色     |
| 192.168.150.101 | 7001 | master |
| 192.168.150.101 | 7002 | slave  |
| 192.168.150.101 | 7003 | slave  |

### 2.1.1 准备实例和配置

创建三个文件夹，名字分别叫7001、7002、7003：

```powershell
# 进入/tmp目录
cd /tmp
# 创建目录
mkdir 7001 7002 7003
```

修改redis-6.2.4/redis.conf文件，将持久化模式改为RDB模式，关闭AOF模式：

```properties
# 开启RDB
# save ""
save 3600 1
save 300 100
save 60 10000

# 关闭AOF
appendonly no
```

将redis-6.2.4/redis.conf文件拷贝到三个目录中（在/tmp下执行）：

```powershell
# 方式一：逐个拷贝
cp redis-6.2.4/redis.conf 7001
cp redis-6.2.4/redis.conf 7002
cp redis-6.2.4/redis.conf 7003

# 方式二：管道组合命令，一键拷贝
echo 7001 7002 7003 | xargs -t -n 1 cp redis-6.2.4/redis.conf
```

修改每个文件夹内的配置文件，将端口分别修改为7001、7002、7003，将rdb文件保存位置修改为自己所在目录（在/tmp下执行）：

```powershell
sed -i -e 's/6379/7001/g' -e 's/dir .//dir /tmp/7001//g' 7001/redis.conf
sed -i -e 's/6379/7002/g' -e 's/dir .//dir /tmp/7002//g' 7002/redis.conf
sed -i -e 's/6379/7003/g' -e 's/dir .//dir /tmp/7003//g' 7003/redis.conf
```

在redis.conf文件中指定每一个实例的绑定ip信息（在/tmp下执行）：

```powershell
# 逐一执行
sed -i '1a replica-announce-ip 192.168.150.101' 7001/redis.conf
sed -i '1a replica-announce-ip 192.168.150.101' 7002/redis.conf
sed -i '1a replica-announce-ip 192.168.150.101' 7003/redis.conf

# 或者一键修改
printf '%sn' 7001 7002 7003 | xargs -I{} -t sed -i '1a replica-announce-ip 192.168.150.101' {}/redis.conf
```

### 2.1.2 启动Redis

打开3个ssh窗口，分别启动3个redis实例：

```powershell
# 第1个
redis-server 7001/redis.conf
# 第2个
redis-server 7002/redis.conf
# 第3个
redis-server 7003/redis.conf
```

运行以下命令可以一键停止（在/tmp下执行），当然，也可以在三个窗口中一个个停止：

```powershell
printf '%sn' 7001 7002 7003 | xargs -I{} -t redis-cli -p {} shutdown
```

### 2.1.3 开启主从关系

现在三个实例还没有任何关系，要配置主从可以使用replicaof或者slaveof（5.0以前）命令。有临时和永久两种模式：

修改配置文件（永久生效）

在redis.conf中添加一行配置：slaveof <masterip> <masterport>

使用redis-cli客户端连接到redis服务，执行slaveof命令（重启后失效）：

```powershell
slaveof <masterip> <masterport>
masterauth master_password #若主节点有密码，必须配置此项，否则可以不配置
```

|                                          |
| ---------------------------------------- |
| **注意**：在5.0以后新增命令replicaof，与salveof效果一致。 |

这里以临时修改为例开启主从关系：

通过redis-cli命令连接7002，执行下面命令：

```powershell
# 连接 7002
redis-cli -p 7002
# 执行slaveof
slaveof 192.168.150.101 7001
```

通过redis-cli命令连接7003，执行下面命令：

```powershell
# 连接 7003
redis-cli -p 7003
# 执行slaveof
slaveof 192.168.150.101 7001
```

然后连接 7001节点，查看集群状态（可选）：

```powershell
# 连接 7001
redis-cli -p 7001
# 查看状态
info replication
```

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image86.png" alt="image86.png"></div>

> **注意**：
> 如果主节点设置了密码，执行slaveof命令后还需要执行命令config set masterauth password指定password密码
> 如果是不同的主机进行搭建主从环境，只需要执行slaveof命令并指定密码即可，准备实例和配置可以略过

### 2.1.4 测试

分别在三个Redis的客户端运行命令set num 123和get num，最后可以看到，只有7001可以执行写操作，7002和7003只能执行读操作。

### 2.2 主从数据同步原理

### 2.2.1 全量同步

主从第一次建立连接时，会执行**全量同步**，将master节点的所有数据都拷贝给slave节点：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image87.png" alt="image87.png"></div>

第一次建立连接时，slave执行replicaof命令并建立连接，请求master进行数据同步，master判断是否是第一次同步，是第一次同步，返回master的数据版本信息，slave收到并保存版本信息，然后master执行bgsave命令生成RDB文件并发送RDB文件到slave，slave清空本地数据并加载收到的RDB文件，但是RDB期间可能有新的命令执行，master会记录这些命令缓存到repl_baklog中，RDB结束后master再发送repl_baklog中的命令给slave，slave在执行收到的命令，如果期间再有命令，还是缓存到repl_baklog，然后不断地发送执行，从而保证主从数据同步。

**Replication Id**：简称replid，是数据集的标记，id一致则说明是同一数据集。每一个master都有唯一的replid，slave则会继承master节点的replid

**offset**：偏移量，随着记录在repl_baklog中的数据增多而逐渐增大。slave完成同步时也会记录当前同步的offset。如果slave的offset小于master的offset，说明slave数据落后于master，需要更新。

slave做数据同步必须向master声明自己的replid和offset，master才可以判断是否是第一次同步、同步哪些数据：初始时slave有自己的replid和offset，建立连接时，master发现slave发送来的replid与自己的不一致，需要做全量同步，并将自己的replid和offset都发送给这个slave，slave保存这些信息，以后slave的replid就与master一致了。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image88.png" alt="image88.png"></div>

### 2.2.2 增量同步

全量同步是在master与slave第一次建立连接时执行的，其他情况、slave重启时都是进行的**增量同步**，所谓增量同步，即只更新slave与master存在差异的部分数据：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image89.png" alt="image89.png"></div>

当slave重启后，携带replid和offset向master请求数据同步，master判断请求的replid与自己的一致，则不是第一次，回复continue给slave，然后获取repl_baklog中offset偏移量之后的数据（命令）并发送给slave，slave执行收到的命令保证主从数据一致。

### 2.2.3 repl_backlog原理

repl_backlog是一个固定大小的环形数组，即角标到达数组末尾后，会再次从0开始读写。repl_baklog中会记录Redis处理过的命令日志及offset，包括master当前的offset，和slave已经拷贝到的offset：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image90.png" alt="image90.png"></div>

进行增量同步时，仅仅是拷贝slave偏移量和master偏移量有差别的部分（即红色区域），随着不断地拷贝，slave也在不断追赶master，即使数组已经满了进行覆盖旧数据，由于这部分旧数据已经被slave同步，所以并不会有影响。

但是，如果slave宕机时间太长，以至于master偏移量超过了slave偏移量（如下图），此时slave重启发现自己的slave偏移量已经没有了，无法进行增量同步，就只能进行**全量同步**。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image91.png" alt="image91.png"></div>

### 总结

全量同步执行场景：

主从第一次建立连接时

从节点宕机时间太长，导致repl_backlog中尚未同步的数据被覆盖，无法基于log做增量同步

增量同步执行场景：

主从第一次建立后，即全量同步后都执行增量同步

从节点宕机重启，且repl_backlog中没有尚未同步的数据

### 2.3 主从同步优化

如果主从集群规模比较大，这时进行数据同步就会比较麻烦，可以从如下方面进行优化：

在master配置文件中配置repl-diskless-sync yes启用无磁盘复制，避免全量同步时的磁盘IO，但要保证网络情况良好

Redis单节点上的内存占用不要太大，减少RDB导致的过多磁盘IO

适当提高master配置文件中repl_baklog的大小，发现slave宕机时尽快实现故障恢复，尽可能避免全量同步

限制一个master上的slave节点数量，如果实在是太多slave，则可以采用主-从-从链式结构，减少master压力

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image92.png" alt="image92.png"></div>

## 3.Redis哨兵

Redis的哨兵机制用来实现主从集群的自动故障恢复：

**监控**：Sentinel 会不断检查master和slave是否按预期工作

**自动故障恢复**：如果master故障，Sentinel会将一个slave提升为master。当故障实例恢复后也以新的master为主

**通知**：Sentinel充当Redis客户端的服务发现来源，当集群发生故障转移时，会将最新信息推送给Redis的客户端

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image93.png" alt="image93.png"></div>

### 3.1 集群监控原理

Sentinel是怎么判断Redis服务器是否发生故障？答案是基于**心跳机制**监测服务状态，每隔1秒向集群的每个实例发送ping命令：

主观下线：如果某Sentinel节点发现某实例未在规定时间响应，则认为该实例**主观下线**

客观下线：若超过指定数量（quorum）的sentinel都认为该实例主观下线，则该实例**客观下线**。quorum值最好超过Sentinel实例数量的一半

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image94.png" alt="image94.png"></div>

### 3.2 集群故障恢复原理

Sentinel判断出master发生故障后，是怎么进行故障恢复的？

首先是选择一个新的slave作为master，选择机制如下：

首先判断slave节点与master节点断开时间长短，如果超过指定值down-after-milliseconds * 10则会排除该slave节点

然后判断slave节点的slave-priority值，越小优先级越高，如果是0则永不参与选举

如果slave-prority一样，则判断slave节点的offset值，越大说明数据越新，优先级越高

最后是判断slave节点的运行id大小，越小优先级越高

选出一个新的master后，该如何实现切换：

sentinel给备选的slave1节点发送slaveof no one命令，让该节点成为master

sentinel给所有其它slave发送slaveof 192.168.150.101 7002（新master的IP和端口）命令，让这些slave成为新master的从节点，开始从新的master上同步数据

最后，sentinel将故障节点标记为slave（修改配置文件添加slaveof），当故障节点恢复后会自动成为新的master的slave节点

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image95.png" alt="image95.png"></div>

### 3.3 哨兵集群环境搭建

三个sentinel实例信息如下：

|    |                 |       |
| -- | --------------- | ----- |
| 节点 | IP              | PORT  |
| s1 | 192.168.150.101 | 27001 |
| s2 | 192.168.150.101 | 27002 |
| s3 | 192.168.150.101 | 27003 |

### 3.3.1 准备实例和配置

创建三个文件夹，名字分别叫s1、s2、s3：

```powershell
# 进入/tmp目录
cd /tmp
# 创建目录
mkdir s1 s2 s3
```

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image96.png" alt="image96.png"></div>

在s1目录创建一个sentinel.conf文件，添加如下内容：

```properties
# 当前sentinel实例的端口
port 27001
# 当前sentinel实例的IP
sentinel announce-ip 192.168.150.101
# 指定master信息：
# mymaster: 主节点名称，任意写
# 192.168.150.101 7001: master的IP和端口
# 2: 选举master时的quorum值，2表示至少两个sentinel认为master下线才进行故障恢复
sentinel monitor mymaster 192.168.150.101 7001 2
# 判定master主观下线的超时时间，5000表示5秒内未ping通就认为master发生故障
sentinel down-after-milliseconds mymaster 5000
# 故障转移超时时间，60000表示60秒内未进行完故障转移重新进行
sentinel failover-timeout mymaster 60000
# 哨兵节点的工作目录
dir "/tmp/s1"
```

然后将s1/sentinel.conf文件拷贝到s2、s3两个目录中（在/tmp下执行）：

```powershell
# 方式一：逐个拷贝
cp s1/sentinel.conf s2
cp s1/sentinel.conf s3
# 方式二：管道组合命令，一键拷贝
echo s2 s3 | xargs -t -n 1 cp s1/sentinel.conf
```

修改s2、s3两个文件夹内的配置文件，将端口分别修改为27002、27003：

```powershell
sed -i -e 's/27001/27002/g' -e 's/s1/s2/g' s2/sentinel.conf
sed -i -e 's/27001/27003/g' -e 's/s1/s3/g' s3/sentinel.conf
```

### 3.3.2 启动Sentinel

打开3个ssh窗口，分别启动3个redis实例（在/tmp下执行）：

```powershell
# 第1个
redis-sentinel s1/sentinel.conf
# 第2个
redis-sentinel s2/sentinel.conf
# 第3个
redis-sentinel s3/sentinel.conf
```

### 3.3.3 测试

尝试让master节点7001宕机，查看sentinel日志：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image97.png" alt="image97.png"></div>

查看7003的日志：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image98.png" alt="image98.png"></div>

查看7002的日志：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image99.png" alt="image99.png"></div>

### 3.4 RedisTemplate

在Sentinel集群监管下的Redis主从集群，其节点会因为自动故障转移而发生变化，Redis的客户端必须感知这种变化并及时更新连接信息。Spring的RedisTemplate底层利用lettuce实现了节点的感知和自动切换。

**导入Demo工程**：导入以下redis-demo项目到Idea中

**[redis-demo.zip]**

**引入依赖**：

```xml
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

**配置Redis地址**：在配置文件application.yml中指定redis的sentinel相关信息

```yaml
spring:
redis:
sentinel:
master: mymaster
nodes:
- 192.168.150.101:27001
- 192.168.150.101:27002
- 192.168.150.101:27003
```

**配置读写分离**：在启动类中或新建一个配置类中添加一个新的bean

```java
@Bean
public LettuceClientConfigurationBuilderCustomizer clientConfigurationBuilderCustomizer(){
return clientConfigurationBuilder -> clientConfigurationBuilder.readFrom(ReadFrom.REPLICA_PREFERRED);
}
```

ReadFrom是配置Redis的读取策略，是一个枚举：

MASTER：从主节点读取

MASTER_PREFERRED：优先从master节点读取，master不可用才读取replica

REPLICA：从slave（replica）节点读取

REPLICA _PREFERRED：优先从slave（replica）节点读取，所有的slave都不可用才读取master

然后测试Controller中的接口并查看sentinel的控制台即可，最终可以发现即使master宕机也不会影响写操作。

## 4.Redis分片集群

分片集群就是由多个主从搭建的Redis集群模式，可以解决海量数据存储和高并发问题：

集群中有多个master，每个master保存不同数据

每个master都可以有多个slave节点

master之间通过ping监测彼此健康状态

客户端请求可以访问集群任意节点，最终都会被转发到正确节点

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image100.png" alt="image100.png"></div>

### 4.1 分片集群环境搭建

每个Redis的信息如下：

|                 |      |        |
| --------------- | ---- | ------ |
| IP              | PORT | 角色     |
| 192.168.150.101 | 7001 | master |
| 192.168.150.101 | 7002 | master |
| 192.168.150.101 | 7003 | master |
| 192.168.150.101 | 8001 | slave  |
| 192.168.150.101 | 8002 | slave  |
| 192.168.150.101 | 8003 | slave  |

### 4.1.2 准备实例和配置

删除之前的7001、7002、7003目录，重新创建出7001、7002、7003、8001、8002、8003目录：

```powershell
# 进入/tmp目录
cd /tmp
# 删除旧的，避免配置干扰
rm -rf 7001 7002 7003
# 创建目录
mkdir 7001 7002 7003 8001 8002 8003
```

在/tmp下准备一个新的redis.conf文件，内容如下：

```properties
port 6379
# 开启集群功能
cluster-enabled yes
# 集群的配置文件名称，不需要我们创建，由redis自己维护
cluster-config-file /tmp/6379/nodes.conf
# 节点心跳失败的超时时间
cluster-node-timeout 5000
# 持久化文件存放目录
dir /tmp/6379
# 绑定地址
bind 0.0.0.0
# 让redis后台运行
daemonize yes
# 注册的实例ip
replica-announce-ip 192.168.150.101
# 保护模式
protected-mode no
# 数据库数量
databases 1
# 日志
logfile /tmp/6379/run.log
```

将配置文件拷贝到每个目录下：

```powershell
# 进入/tmp目录
cd /tmp
# 执行拷贝
echo 7001 7002 7003 8001 8002 8003 | xargs -t -n 1 cp redis.conf
```

修改每个目录下的redis.conf，将其中的6379修改为与所在目录一致：

```powershell
# 进入/tmp目录
cd /tmp
# 修改配置文件
printf '%sn' 7001 7002 7003 8001 8002 8003 | xargs -I{} -t sed -i 's/6379/{}/g' {}/redis.conf
```

### 4.1.2 启动

因为已经配置了后台启动模式，所以可以直接启动服务：

```powershell
# 进入/tmp目录
cd /tmp
# 一键启动所有服务
printf '%sn' 7001 7002 7003 8001 8002 8003 | xargs -I{} -t redis-server {}/redis.conf
```

通过ps查看状态：

```powershell
ps -ef | grep redis
```

发现服务都已经正常启动：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image101.png" alt="image101.png"></div>

如果要关闭所有进程，可以执行命令：

```powershell
ps -ef | grep redis | awk '{print $2}' | xargs kill
```

或者（推荐这种方式）：

```powershell
printf '%sn' 7001 7002 7003 8001 8002 8003 | xargs -I{} -t redis-cli -p {} shutdown
```

### 4.1.3 创建集群

现在每个Redis服务是相互独立的，没有任何关联，需要执行命令创建集群。

### Redis5.0之前

Redis5.0之前集群命令都是用redis安装包下的src/redis-trib.rb来实现的。因为redis-trib.rb是由ruby语言编写的所以需要安装ruby环境：

```powershell
# 安装依赖
yum -y install zlib ruby rubygems
gem install redis
```

然后通过命令来管理集群：

```powershell
# 进入redis的src目录
cd /tmp/redis-6.2.4/src
# 创建集群
./redis-trib.rb create --replicas 1 192.168.150.101:7001 192.168.150.101:7002 192.168.150.101:7003 192.168.150.101:8001 192.168.150.101:8002 192.168.150.101:8003
```

### Redis5.0以后

Redis5.0以后集群管理已经集成到了redis-cli中，格式如下：

```powershell
redis-cli --cluster create --cluster-replicas 1 192.168.150.101:7001 192.168.150.101:7002 192.168.150.101:7003 192.168.150.101:8001 192.168.150.101:8002 192.168.150.101:8003
```

### 命令说明

redis-cli --cluster或者./redis-trib.rb：代表集群操作命令

create：代表是创建集群

--replicas 1或者--cluster-replicas 1 ：指定集群中每个master的副本个数为1，此时节点总数 ÷ (replicas + 1) 得到的就是master的数量。因此节点列表中的前n个就是master，其它节点都是slave节点，随机分配到不同master

运行后的样子：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image102.png" alt="image102.png"></div>

这里输入yes，则集群开始创建：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image103.png" alt="image103.png"></div>

通过以下命令可以查看集群状态：

```powershell
redis-cli -p 7001 cluster nodes
```

### 4.1.4 测试

尝试连接7001节点，存储一个数据：

```powershell
# 连接，这里一定要加-c选项表示是集群模式，否则会出错
redis-cli -c -p 7001
# 存储数据
set num 123
# 读取数据
get num
# 再次存储
set a 1
```

### 4.2 散列插槽

Redis会把每一个master节点映射到0~16383共16384个插槽（hash slot）上，查看集群信息时就能看到：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image104.png" alt="image104.png"></div>

数据key不是与节点绑定，而是与插槽绑定。redis会根据key的**有效部分**计算插槽值：

key中包含"{}"，且“{}”中至少包含1个字符，“{}”中的部分是有效部分

key中不包含“{}”，整个key都是有效部分

例如key是num，那么就根据num计算，如果是{itcast}num，则根据itcast计算。计算方式是利用CRC16算法得到一个hash值，然后对16384取余，得到的结果就是slot值。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image105.png" alt="image105.png"></div>

*要想将一类数据固定的保存在同一个Redis实例，可以使它们的key都以{typeId}为前缀，从而保证key有效部分相同。*

### 4.3 集群伸缩

redis-cli --cluster提供了很多操作集群的命令，可以通过redis-cli --cluster help命令查看。

### 4.3.1 需求分析

向集群中添加一个新的master节点，并向其中存储 num = 10

启动一个新的redis实例，端口为7004

添加7004到之前的集群，并作为一个master节点

给7004节点分配插槽，使得num这个key可以存储到7004实例

### 4.3.2 创建新的redis实例

进入/tmp目录：cd /tmp

创建一个文件夹：mkdir 7004

拷贝配置文件：cp redis.conf /7004

修改配置文件：sed /s/6379/7004/g 7004/redis.conf

启动：redis-server 7004/redis.conf

### 4.3.3 添加新节点到redis

执行以下命令将7004添加到Redis集群：

```powershell
redis-cli --cluster add-node 192.168.150.101:7004 192.168.150.101:7001
```

通过命令查看集群状态：

```powershell
redis-cli -p 7001 cluster nodes
```

如图，7004加入了集群，并且默认是一个master节点：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image106.png" alt="image106.png"></div>

但是，7004节点的插槽数量为0，因此没有任何数据可以存储到7004上

### 4.3.4 转移插槽

通过get num命令可以看到num对应的插槽位置是2765：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image107.png" alt="image107.png"></div>

要想使num这个key存储到7004实例，可以将前3000个插槽从7001转移到7004，转移插槽的命令：

```powershell
redis-cli --cluster reshard 192.168.150.101:7001
```

执行命令后，首先会询问要移动多少个插槽，输入3000即可：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image108.png" alt="image108.png"></div>

然后，会询问哪个节点接收这些插槽，需要输入节点ID，7004节点的ID在4.3.3中的日志就可以看到，拷贝到控制台即可：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image109.png" alt="image109.png"></div>

之后会询问插槽是从哪里移动过来的，这里要从7001获取，因此填写7001的ID：

all：代表全部，也就是三个节点各转移一部分

具体的id：目标节点的id

done：没有了

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image110.png" alt="image110.png"></div>

最后会询问是否确认转移，输入yes就可以了。

通过以下命令查看结果：

```powershell
redis-cli -p 7001 cluster node
```

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image111.png" alt="image111.png"></div>

### 4.4 故障转移

### 4.4.1 自动故障转移

当集群中有一个master宕机时，会自动提升一个slave为master，即使master重新启动了，也会变成slave。

尝试让7002宕机：

```powershell
redis-cli -p 7002 shutdown
```

首先是该实例与其它实例失去连接

然后是疑似宕机：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image112.png" alt="image112.png"></div>

最后是确定下线，自动提升一个slave为新的master：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image113.png" alt="image113.png"></div>

当7002再次启动，就会变为一个slave节点：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image114.png" alt="image114.png"></div>

### 4.4.2 手动故障转移

如果需要更新或修复某个master节点，可以通过手动故障转移方式选一个slave代替这个master。

利用cluster failover命令可以手动让集群中的某个master宕机，切换到执行cluster failover命令的这个slave节点，实现无感知的数据迁移，具体流程如下：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/3/image115.png" alt="image115.png"></div>

failover命令可以指定三种模式：

缺省：默认的流程，如图1~6歩

force：省略了对offset的一致性校验，直接从第4步开始

takeover：直接执行第5步，忽略数据一致性、忽略master状态和其它master的意见

在自动故障转移中，7002节点成为了slave，如果想要让7002节点重新成为master，与其同步的master就会成为slave，实现方式：

利用redis-cli -p 7002连接7002这个节点

执行cluster failover命令

### 4.5 RedisTemplate访问分片集群

RedisTemplate底层同样基于lettuce实现了分片集群的支持，而使用的步骤与哨兵模式基本一致：

### 引入redis的starter依赖

```xml
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

### 配置分片集群地址

```yaml
spring:
redis:
cluster:
nodes:
- 192.168.150.101:7001
- 192.168.150.101:7002
- 192.168.150.101:7003
- 192.168.150.101:8001
- 192.168.150.101:8002
- 192.168.150.101:8003
```

*由于分片集群自带故障恢复（故障转移），所以原来的哨兵集群配置删除也没有影响*

### 配置读写分离

在启动类中或新建一个配置类中添加一个新的bean：

```java
@Bean
public LettuceClientConfigurationBuilderCustomizer clientConfigurationBuilderCustomizer(){
return clientConfigurationBuilder -> clientConfigurationBuilder.readFrom(ReadFrom.REPLICA_PREFERRED);
}
```

可以看到，分片集群的使用和哨兵模式的差别仅仅在于集群地址的配置（yaml文件），其他一模一样。
