---
title: Redis-快速入门
date: 2025-09-01 01:00:00
categories:
  - database
tags:
  - redis
---
<div class="essay-banner essay-image4"></div>

# 一、快速入门

## 1.初始Redis

### 1.1 认识NoSQL

NoSQL是一种非关系型数据库，是一种相对于传统关系型数据库而言，有很大差异的一种数据库。具体差异如下：

**结构化与非结构化**：传统的关系型数据库每张表都有严格的约束条件，如字段名、字段数据类型、字段约束；而NoSQL较为松散，没有严格的约束，可以是键值型、文档型、图类型等

**关联和非关联**：传统的关系型数据库表与表之间往往存在关联，如外键；而非关系型数据库不存在关联，维护关系可以通过业务逻辑或数据间的耦合。

**查询方式**：传统的关系型数据库基于SQL进行查询；而非关系型数据库查询语法五花八门，如Redis和MongoDB的查询语法就不一样

**事务**：传统的关系型数据库能满足事务的ACID特性；而非关系型数据库往往不支持事务，只能维持基本的数据一致性

**存储方式**：传统的关系型数据库数据存储在磁盘，性能收到影响；而非关系型数据库数据存储在内存，性能高

**扩展性**：关系型数据库集群模式一般是主从，主从数据一致，起到数据备份的作用，称为垂直扩展；而非关系型数据库可以将数据拆分到不同服务器，可以保存海量数据，成为水平扩展；关系型数据库如果想水平扩展，会因为关联带来麻烦。

|  | SQL | NoSQL |
| --- | --- | --- |
| 数据结构 | 结构化 | 非结构化 |
| 数据关联 | 关联的 | 无关联的 |
| 查询方式 | SQL查询 | 非SQL |
| 事务特性 | ACID | BASE |
| 存储方式 | 磁盘 | 内存 |
| 扩展性 | 垂直 | 水平 |
| 使用场景 | 1）数据结构固定<br />2）对数据安全性、一致性要求较高 | 1）数据结构不固定<br />2）对数据安全性、一致性要求不高<br />3）对性能要求 |

### 1.2 认识Redis

Redis诞生于2009年，是一个基于内存的键值型NoSQL数据库。有如下特征：

键值型（key-value），value支持多种不同数据结构，功能丰富

单线程，每个命令具备原子性

低延迟，速度快（基于内存、IO多路复用、良好的编码）

支持数据持久化

支持主从集群、分片集群

支持多语言客户端

官网地址：

**[该类型的内容暂不支持下载]**

### 1.3 安装Redis

由于Redis官方没有提供Windows版本的安装包，所以在Linux操作系统上安装Redis。

### 1.3.1 安装依赖

安装Redis所需要的gcc依赖：

```powershell
yum install -y gcc tcl
```

### 1.3.2 上传并解压安装包

将资料提供的Redis安装包上传到虚拟机的任意目录（这里用/usr/local/src目录），并解压缩：

```powershell
tar -xzf /usr/local/src/redis-6.2.6.tar.gz
```

进入redis目录：

```powershell
cd /usr/local/src/redis-6.2.6
```

运行编译命令：

```powershell
make && make install
```

如果没有出错，应该就安装成功了。默认的安装路径是 /usr/local/bin目录：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/1/image1.png" alt="image1.png"></div>

此时，任意目录下都能运行如下指令：

redis-cli：是redis提供的命令行客户端

redis-server：是redis的服务端启动脚本

redis-sentinel：是redis的哨兵启动脚本

### 1.3.3 启动

redis的启动方式有很多种：

### 默认启动

安装完成后，在任意目录输入redis-server命令即可启动Redis：

```powershell
redis-server
```

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/1/image2.png" alt="image2.png"></div>

这种启动属于前台启动，会阻塞整个会话窗口，窗口关闭或者按下Ctrl + C则Redis停止。不推荐使用。

### 指定配置启动

如果要让Redis以后台方式启动，则必须修改Redis配置文件redis.conf。

找到配置文件：

```powershell
cd /usr/local/src/redis-6.2.6
```

备份配置文件redis.conf：

```powershell
cp redis.conf redis.conf.bck
```

修改redis.conf文件中的配置：

```properties
# 允许访问的地址，默认是127.0.0.1，会导致只能在本地访问。修改为0.0.0.0则可以在任意IP访问，生产环境不要设置为0.0.0.0
bind 0.0.0.0
# 守护进程，修改为yes后即可后台运行
daemonize yes
# 密码，设置后访问Redis必须输入密码
requirepass 123321

# 监听的端口
port 6379
# 工作目录，默认是当前目录，也就是运行redis-server时的命令，日志、持久化等文件会保存在这个目录
dir .
# 数据库数量，设置为1，代表只使用1个库，默认有16个库，编号0~15
databases 1
# 设置redis能够使用的最大内存
maxmemory 512mb
# 日志文件，默认为空，不记录日志，可以指定日志文件名
logfile "redis.log"
```

启动Redis：

```powershell
# 进入redis安装目录
cd /usr/local/src/redis-6.2.6
# 启动
redis-server redis.conf
```

停止服务：

```powershell
# 利用redis-cli来执行 shutdown 命令，即可停止 Redis 服务，
# 因为之前配置了密码，因此需要通过 -u 来指定密码
redis-cli -u 123321 shutdown
```

### 开机自启

首先，新建一个系统服务文件：

```powershell
vi /etc/systemd/system/redis.service
```

内容如下：

```properties
[Unit]
Description=redis-server
After=network.target

[Service]
Type=forking
ExecStart=/usr/local/bin/redis-server /usr/local/src/redis-6.2.6/redis.conf
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

然后重载系统服务：

```powershell
systemctl daemon-reload
```

执行下面的命令，让redis开机自启：

```bash
systemctl enable redis
```

此时redis就成为了系统服务，可以用systemctl命令控制：

```powershell
# 启动
systemctl start redis
# 停止
systemctl stop redis
# 重启
systemctl restart redis
# 查看状态
systemctl status redis
```

### 1.4 Redis客户端

### 1.4.1 命令行客户端

Redis安装完成后就自带了命令行客户端redis-cli：

```powershell
redis-cli [options] [commonds]
```

常见的options有：

-h 127.0.0.1：指定要连接的redis节点的IP地址，默认是127.0.0.1

-p 6379：指定要连接的redis节点的端口，默认是6379

-a 123321：指定redis的访问密码

其中的commonds就是Redis的操作命令，例如：

ping：与redis服务端做心跳测试，服务端正常会返回pong

不指定commond时，会进入redis-cli的交互控制台：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/1/image3.png" alt="image3.png"></div>

### 1.4.2 图形化客户端

Redis的图形化桌面客户端的windows安装包：

**[该类型的内容暂不支持下载]**

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/1/image4.png" alt="image4.png"></div>

### 1.4.3 安装和使用

双击资料中可执行文件rdm-2021.9.4.0.0.exe按照顺序安装即可。

安装后双击打开rdm，点击左上角的连接到Redis服务器按钮，在弹出的窗口中填写Redis服务信息：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/1/image5.png" alt="image5.png"></div>

点击确定后，在左侧菜单会出现这个链接：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/1/image6.png" alt="image6.png"></div>

点击即可建立连接：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/1/image7.png" alt="image7.png"></div>

Redis默认有16个仓库，编号从0至15. 通过配置文件可以设置仓库数量，但是不超过16，并且不能自定义仓库名称。

如果是基于redis-cli连接Redis服务，可以通过select命令来选择数据库：

```powershell
# 选择 0号库
select 0
```

*如果连接不上redis数据库，需要关闭Linux的防火墙：systemctl stop firewalld*

## 2.Redis常见命令

Redis是典型的key-value数据库，key一般是字符串，而value包含很多不同的数据类型：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/1/image8.png" alt="image8.png"></div>

不同类型的命令称为一个group，通过help命令可以查看各种不同group的命令，如以下命令可以查看通用命令：

```powershell
help @generic
```

### 2.1 Redis通用命令

**通用命令**是任何数据类型都能使用的命令，常见的有：

KEYS：查看符合模板的所有key，*代表任意个字符，如a*表示以a开头的所有key

DEL：删除一个指定的key

EXISTS：判断key是否存在

EXPIRE：给一个key设置有效期，有效期到期时该key会被自动删除（需要键已经存在）

TTL：查看一个KEY的剩余有效期

通过help [command]命令可以查看一个命令的具体用法：

```powershell
# 查看keys命令的帮助信息：
127.0.0.1:6379> help keys

KEYS pattern
summary: Find all keys matching the given pattern
since: 1.0.0
group: generic
```

### 2.2 String类型

String类型即字符串类型，是Redis中最简单的存储类型。根据字符串的格式不同，value又可以分为3类：

string：普通字符串

int：整数类型，可以做自增、自减操作

float：浮点类型，可以做自增、自减操作

不管是哪种格式，底层都是字节数组形式存储，只不过是编码方式不同。

**String的常见命令有**：

SET：添加或者修改已经存在的一个String类型的键值对

GET：根据key获取String类型的value

MSET：批量添加多个String类型的键值对

MGET：根据多个key获取多个String类型的value

INCR：让一个整型的key自增1

INCRBY：让一个整型的key自增并指定步长，例如：incrby num 2 让num值自增2

INCRBYFLOAT：让一个浮点类型的数字自增并指定步长

SETNX：添加一个String类型的键值对，前提是这个key不存在，否则不执行

SETEX：添加一个String类型的键值对，并且指定有效期

### 2.3 Key结构

Redis的key允许由多个单词形成层级结构，多个单词之间用:隔开，格式如下：

```text
项目名:业务名:类型:id
```

这个格式并不固定，也可以根据自己的需求来删除或添加词条，例如项目名称iheima，有user和product两种不同类型的数据，定义key：

user相关的key：**iheima:user:1**

product相关的key：**iheima:product:1**

String类型还可以存储JSON格式字符串，如set itheima:user:1 '{"id":1, "name": "Jack", "age": 21}'

### 2.4 Hash类型

String类型存放JSON数据时，操作某个字段很不方便，此时Hash类型的优势就体现出来了。

Hash类型也叫散列，其value是一个无序字典，类似于Java中的HashMap结构：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/1/image9.png" alt="image9.png"></div>

**Hash的常见命令有**：

HSET key field value：添加或者修改hash类型key的field的值

HGET key field：获取一个hash类型key的field的值

HMSET：批量添加多个hash类型key的field的值

HMGET：批量获取多个hash类型key的field的值

HGETALL：获取一个hash类型的key中的所有的field和value

HKEYS：获取一个hash类型的key中的所有的field

HINCRBY：让一个hash类型key的字段值自增并指定步长

HSETNX：添加一个hash类型的key的field值，前提是这个field不存在，否则不执行

### 2.5 List类型

List类型与Java中的LinkedList类似，可看作一个双向链表结构，支持正向检索和反向检索，特点如下：

有序

元素可以重复

插入和删除快

查询速度一般

**List的常见命令有**：

LPUSH key element ... ：向列表左侧插入一个或多个元素

LPOP key：移除并返回列表左侧的第一个元素，没有则返回nil

RPUSH key element ... ：向列表右侧插入一个或多个元素

RPOP key：移除并返回列表右侧的第一个元素

LRANGE key star end：返回一段角标范围内的所有元素

BLPOP和BRPOP：与LPOP和RPOP类似，只不过在没有元素时等待指定时间，而不是直接返回nil

List类型的正向索引从0开始，反向索引从-1开始，如果想要正向获取列表所有内容，可以使用lrange key 0 -1实现。

**List模拟数据结构**（了解即可）：

用List模拟栈：入口和出口在同一边

用List模拟队列：入口和出口在不同边

用List模拟阻塞队列：入口和出口在不同边，并且出队时采用BLPOP或BRPOP

### 2.6 Set类型

Set类型与Java中的HashSet类似，可看作是一个value为null的HashMap，特点如下：

无序

元素不可重复

查找快

支持交集、并集、差集等功能

**Set的常见命令有**：

SADD key member ... ：向set中添加一个或多个元素

SREM key member ... ：移除set中的指定元素

SCARD key：返回set中元素的个数

SISMEMBER key member：判断一个元素是否存在于set中

SMEMBERS：获取set中的所有元素

SINTER key1 key2 ... ：求key1与key2的交集

SDIFF key1 key2 ... ：求key1与key2的差集

SUNION key1 key2 ...：求key1和key2的并集

### 2.7 SortedSet类型

SortedSet是一个可排序set集合，与Java中的TreeSet类似，但底层数据结构却差别很大，SortedSet中的每一个元素都有一个score属性，用于元素排序，底层是实现一个跳表（SkipList）加 hash表。特点如下：

可排序

元素不重复

查询速度快

**SortedSet的常见命令有**：

ZADD key score member：添加一个或多个元素到sorted set ，如果已经存在则更新其score值

ZREM key member：删除sorted set中的一个指定元素

ZSCORE key member : 获取sorted set中的指定元素的score值

ZRANK key member：获取sorted set 中的指定元素的排名

ZCARD key：获取sorted set中的元素个数

ZCOUNT key min max：统计score值在给定范围内的所有元素的个数

ZINCRBY key increment member：让sorted set中的指定元素自增，步长为指定的increment值

ZRANGE key min max：按照score排序后，获取指定排名范围内的元素

ZRANGEBYSCORE key min max：按照score排序后，获取指定score范围内的元素

ZDIFF、ZINTER、ZUNION：求差集、交集、并集

SortedSet的排序排名是从0开始的，依次递增。

SortedSet默认是采用**升序**排序，如果想要降序，只需要在命令的Z后加上REV即可，如：

升序：ZRANK key member

降序：Z**REV**RANK key member

## 3.Redis的Java客户端

Redis官网提供了各种语言的客户端：

**[该类型的内容暂不支持下载]**

Java的客户端有很多，比较推荐的有三种：

|          |                                                                                       |
| -------- | ------------------------------------------------------------------------------------- |
| Redis客户端 | 描述                                                                                    |
| Jedis    | 以Redis命令作为方法名称，学习成本低，简单实用。但是Jedis实例是线程不安全的，多线程环境下需要基于连接池来使用                           |
| lettuce  | Lettuce是基于Netty实现的，支持同步、异步和响应式编程方式，并且是线程安全的。支持Redis的哨兵模式、集群模式和管道模式                    |
| Redisson | Redisson是一个基于Redis实现的分布式、可伸缩的Java数据结构集合。包含了诸如Map、Queue、Lock、Semaphore、AtomicLong等强大功能 |

Jedis和Lettuce：提供了Redis命令对应的API，方便我们操作Redis。**SpringDataRedis**对这两种做了抽象和封装，后期会直接以SpringDataRedis来学习。

Redisson：在Redis基础上实现了分布式的可伸缩的java数据结构，例如Map、Queue等，而且支持跨进程的同步机制：Lock、Semaphore等待，适合实现特殊的功能需求。

### 3.1 Jedis客户端

Jedis的官网地址：

**[该类型的内容暂不支持下载]**

### 3.1.1 快速入门

### 引入依赖

新建一个maven项目后，引入如下依赖：

```xml
<!--jedis-->
<dependency>
<groupId>redis.clients</groupId>
<artifactId>jedis</artifactId>
<version>3.7.0</version>
</dependency>
<!--单元测试-->
<dependency>
<groupId>org.junit.jupiter</groupId>
<artifactId>junit-jupiter</artifactId>
<version>5.7.0</version>
<scope>test</scope>
</dependency>
```

### 建立连接

新建一个单元测试类：

```java
private Jedis jedis;

@BeforeEach
void setUp() {
// 1.建立连接
// jedis = new Jedis("192.168.150.101", 6379);
jedis = JedisConnectionFactory.getJedis();
// 2.设置密码
jedis.auth("123321");
// 3.选择库
jedis.select(0);
}
```

### 测试单元

```java
@Test
void testString() {
// 存入数据
String result = jedis.set("name", "虎哥");
System.out.println("result = " + result);
// 获取数据
String name = jedis.get("name");
System.out.println("name = " + name);
}

@Test
void testHash() {
// 插入hash数据
jedis.hset("user:1", "name", "Jack");
jedis.hset("user:1", "age", "21");

// 获取
Map<String, String> map = jedis.hgetAll("user:1");
System.out.println(map);
}
```

### 释放资源

```java
@AfterEach
void tearDown() {
if (jedis != null) {
jedis.close();
}
}
```

### 3.1.2 连接池

Jedis本身是线程不安全的，并且频繁的创建和销毁连接会有性能损耗，因此推荐使用Jedis连接池代替Jedis的直连方式

```java
package com.heima.jedis.util;

import redis.clients.jedis.*;

public class JedisConnectionFactory {

private static JedisPool jedisPool;

static {
// 配置连接池
JedisPoolConfig poolConfig = new JedisPoolConfig();
poolConfig.setMaxTotal(8);
poolConfig.setMaxIdle(8);
poolConfig.setMinIdle(0);
poolConfig.setMaxWaitMillis(1000);
// 创建连接池对象，参数：连接池配置、服务端ip、服务端端口、超时时间、密码
jedisPool = new JedisPool(poolConfig, "192.168.150.101", 6379, 1000, "123321");
}

public static Jedis getJedis(){
return jedisPool.getResource();
}
}
```

### 改造原始代码

```java
@BeforeEach
void setUp(){
//建立连接
/*jedis = new Jedis("127.0.0.1",6379);*/
jedis = JedisConnectionFacotry.getJedis();
//选择库
jedis.select(0);
}

@AfterEach
void tearDown() {
if (jedis != null) {
jedis.close();
}
}
```

### 3.2 SpringDataRedis客户端

SpringDataRedis官网地址：

**[该类型的内容暂不支持下载]**

SpringData是Spring中数据操作的模块，包含对各种数据库的集成，其中对Redis的集成模块就叫做SpringDataRedis。

提供了对不同Redis客户端的整合（Lettuce和Jedis）

提供了RedisTemplate统一API来操作Redis

支持Redis的发布订阅模型

支持Redis哨兵和Redis集群

支持基于Lettuce的响应式编程

支持基于JDK、JSON、字符串、Spring对象的数据序列化及反序列化

支持基于Redis的JDKCollection实现

SpringDataRedis提供了RedisTemplate工具类，其中封装了各种对Redis的操作，并且将不同数据类型的操作API封装到了不同的类型中：

|                             |                 |                 |
| --------------------------- | --------------- | --------------- |
| API                         | 返回值类型           | 说明              |
| redisTemplate.opsForValue() | ValueOperations | 操作String类型数据    |
| redisTemplate.opsForHash()  | HashOperations  | 操作Hash类型数据      |
| redisTemplate.opsForList()  | ListOperations  | 操作List类型数据      |
| redisTemplate.opsForSet()   | SetOperations   | 操作Set类型数据       |
| redisTemplate.opsForZSet()  | ZSetOperations  | 操作SortedSet类型数据 |
| redisTemplate               |                 | 通用的命令           |

### 3.2.1 快速入门

SpringBoot已经提供了对SpringDataRedis的支持。

新建一个SpringBoot项目，引入依赖：

```xml
<!--Redis依赖-->
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<!--连接池依赖-->
<dependency>
<groupId>org.apache.commons</groupId>
<artifactId>commons-pool2</artifactId>
</dependency>
```

### 配置Redis

```yaml
spring:
redis:
host: 192.168.150.101
port: 6379
password: 123321
lettuce:
pool:
max-active: 8 #最大连接
max-idle: 8 #最大空闲连接
min-idle: 0 #最小空闲连接
max-wait: 100ms #连接等待时间
```

### 注入RedisTemplate

SpringBoot已经自动装配，直接注入即可：

```java
@SpringBootTest
class RedisStringTests {

@Autowired
private RedisTemplate redisTemplate;
}
```

### 编写测试

```java
@SpringBootTest
class RedisStringTests {

@Autowired
private RedisTemplate redisTemplate;

@Test
void testString() {
// 写入一条String数据
redisTemplate.opsForValue().set("name", "虎哥");
// 获取string数据
Object name = redisTemplate.opsForValue().get("name");
System.out.println("name = " + name);
}
}
```

### 3.2.2 自定义序列化

RedisTemplate可以接收任意Object作为值写入Redis，只不过写入前会把Object序列化为字节形式，默认是采用JDK序列化：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/1/image10.png" alt="image10.png"></div>

但是JDK序列化后内存占用高、可读性差，所以自定义RedisTemplate的序列化方式：

```java
@Configuration
public class RedisConfig {

@Bean
public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory){
// 创建RedisTemplate对象
RedisTemplate<String, Object> template = new RedisTemplate<>();
// 设置连接工厂
template.setConnectionFactory(connectionFactory);
// 创建JSON序列化工具
GenericJackson2JsonRedisSerializer jsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
// 设置Key的序列化
template.setKeySerializer(RedisSerializer.string());
template.setHashKeySerializer(RedisSerializer.string());
// 设置Value的序列化
template.setValueSerializer(jsonRedisSerializer);
template.setHashValueSerializer(jsonRedisSerializer);
// 返回
return template;
}
}
```

这样采用JSON序列化代替JDK序列化，可读性大大提高：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/1/image11.png" alt="image11.png"></div>

但是会记录序列化时对应的class名称，以至于查询时实现自动反序列化。

### 3.2.3 StringRedisTemplate

为了更加节省内存，可以不使用JSON序列化器，统一使用String序列化器，要求只能存储String类型的key和value。如果要存对象，可以手动实现序列化和反序列化：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/1/image12.png" alt="image12.png"></div>

StringRedisTemplate是SpringDataRedis提供的RedisTemplate的子类，它的key和value的序列化方式默认就是String方式：

```java
@Autowired
private StringRedisTemplate stringRedisTemplate;
// JSON序列化工具
private static final ObjectMapper mapper = new ObjectMapper();

@Test
void testSaveUser() throws JsonProcessingException {
// 创建对象
User user = new User("虎哥", 21);
// 手动序列化
String json = mapper.writeValueAsString(user);
// 写入数据
stringRedisTemplate.opsForValue().set("user:200", json);

// 获取数据
String jsonUser = stringRedisTemplate.opsForValue().get("user:200");
// 手动反序列化
User user1 = mapper.readValue(jsonUser, User.class);
System.out.println("user1 = " + user1);
}
```
