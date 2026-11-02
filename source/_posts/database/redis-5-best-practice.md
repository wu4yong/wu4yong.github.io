---
title: Redis-最佳实践
date: 2025-09-05 01:00:00
categories:
  - database
tags:
  - redis
---
<div class="essay-banner essay-image3"></div>

# 五、Redis最佳实践

## 1.Redis键值设置

### 1.1 优雅的key结构

Redis的Key虽然可以自定义，但最好遵循以下约定：

遵循基本格式：[业务名称]:[数据名]:[id]

长度不超过44字节

不包含特殊字符

例如登录业务（login），保存用户信息（user），其key就可以设计为login:user:10。这样设计有以下几点好处：

可读性强

避免key冲突

方便管理

更节省内存

key的本质是字符串，会被存储在字典结构，每个key对应字典结构中的一个键值对节点，所以key底层编码包含int、embstr和raw三种：

embstr在小于44字节使用，采用连续内存空间，内存占用更小；

当字节数大于44字节时，会转为raw模式存储，在raw模式下，内存空间不是连续的，而是采用一个指针指向了另外一段内存空间，在这段空间里存储SDS内容，这样空间不连续，访问的时候性能也就会收到影响，还有可能产生内存碎片。

由于string类型的key-value结构类似键值对节点，所以可以用string类型模拟不同的编码，需要的命令：

TYPE key：查询指定key的数据类型

OBJECT ENCODING key：查看指定key对应的底层编码方式

### 1.2 BigKey

BigKey通常以Key的大小和Key中成员的数量来综合判定，判断标准（不唯一）：

Key本身的数据量过大：一个String类型的Key，它的值为5 MB

Key中的成员数过多：一个ZSET类型的Key，它的成员数量为10,000个

Key中成员的数据量过大：一个Hash类型的Key，成员数量虽然只有1,000个但这些成员的Value（值）总大小为100 MB

寻找BigKey需要用到如下几个命令：

MEMORY USAGE key：查询指定key及其对应的值在Redis中**实际占用的内存字节数**（不是简单的key和值所占字节数之和）

STRLEN key：只适用于string类型，查询key对应的**value的字节长度**（不包含key本身的字节）

LLEN key：只适用于list类型，查询列表中的**元素个数**（即列表长度），key不存在返回0

|                                              |
| -------------------------------------------- |
| **建议**：单个key的value小于10KB，集合类型的key元素数量小于1000。 |

*由于MEMORY USAGE key对CPU使用率比较高，所以不建议使用*

BigKey带来的危害：

网络阻塞：对BigKey执行读请求时，少量的QPS就可能导致带宽使用率被占满，导致Redis实例，乃至所在物理机变慢

数据倾斜：BigKey所在的Redis实例内存使用率远超其他实例，无法使数据分片的内存资源达到均衡

Redis阻塞：对元素较多的hash、list、zset等做运算会耗时较旧，使主线程被阻塞

CPU压力：对BigKey的数据序列化和反序列化会导致CPU的使用率飙升，影响Redis实例和本机其它应用

目前有四种方式可以发现BigKey：redis-cli --bigkeys、scan扫描、第三方工具、网络监控。

*QPS：每秒查询率，是衡量系统每秒能处理请求次数的核心指标，直接反映 Redis 等数据库或缓存的吞吐量与性能上限*

### 1.2.1 redis-cli --bigkeys

利用redis-cli提供的--bigkeys参数可以遍历分析所有key，并返回Key的整体统计信息与每个类型数据的Top1的big key。

命令：redis-cli -a 密码 --bigkeys

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/5/image132.png" alt="image132.png"></div>

**说明**：这种方式仅仅能统计每个类型数据占用内存最大的key，但这个key不一定是BigKey

### 1.2.2 scan扫描

Redis提供了SCAN命令用于迭代遍历数据库中所有key，命令格式：SCAN cursor [MATCH pattern] [COUNT count] [TYPE type]

cursor：迭代游标，用于标记迭代位置，首次调用必须传入0开启新的迭代，后续调用使用上一次返回的游标值，直到返回游标为0表示迭代结束

MATCH pattern：可选，用于过滤key的匹配模式，支持通配符，如*匹配任意字符，?匹配单个字符

COUNT count：可选，提示Redis每次迭代应返回的大约数量（非精确值），默认为10

TYPE type：可选，Redis6.0+支持，只返回指定类型的key，如string、hash、list

SCAN命令会返回两个元素，第一个是下一次迭代的光标，第二个是List，存放一个匹配的key的数组。

我们可以自己编程，利用SCAN扫描Redis中的所有key，利用strlen、hlen等命令判断key的长度：

```java
package com.heima.item.test;

import com.heima.jedis.util.JedisConnectionFactory;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.ScanResult;
import java.util.List;

public class JedisTest {
private Jedis jedis;

@BeforeEach
void setUp() {
// 1.建立连接
jedis = JedisConnectionFactory.getJedis();
// 2.设置密码，如果没有密码不需要设置
jedis.auth("123321");
// 3.选择库
jedis.select(0);
}

//string类型的阈值长度，单位：字节
final static int STR_MAX_LEN = 10 * 1024;
//hash、list、set、zset的长度阈值
final static int HASH_MAX_LEN = 500;

@Test
void testScan() {
int maxLen = 0;
long len = 0;

String cursor = "0";
do {
// 扫描并获取一部分key
ScanResult<String> result = jedis.scan(cursor);
// 记录cursor
cursor = result.getCursor();
List<String> list = result.getResult();
if (list == null || list.isEmpty()) {
break;
}
// 遍历
for (String key : list) {
// 判断key的类型
String type = jedis.type(key);
switch (type) {
case "string":
len = jedis.strlen(key);
maxLen = STR_MAX_LEN;
break;
case "hash":
len = jedis.hlen(key);
maxLen = HASH_MAX_LEN;
break;
case "list":
len = jedis.llen(key);
maxLen = HASH_MAX_LEN;
break;
case "set":
len = jedis.scard(key);
maxLen = HASH_MAX_LEN;
break;
case "zset":
len = jedis.zcard(key);
maxLen = HASH_MAX_LEN;
break;
default:
break;
}
if (len >= maxLen) {
System.out.printf("Found big key : %s, type: %s, length or size: %d %n", key, type, len);
}
}
} while (!cursor.equals("0"));
}

@AfterEach
void tearDown() {
if (jedis != null) {
jedis.close();
}
}

}
```

代码需要用到JedisConnectionFactory类：

```java
package com.heima.jedis.util;

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
jedisPool = new JedisPool(poolConfig, "192.168.88.130", 6379, 1000);
}

public static Jedis getJedis() {
return jedisPool.getResource();
}
}
```

还需要引入Jedis的依赖：

```xml
<dependency>
<groupId>redis.clients</groupId>
<artifactId>jedis</artifactId>
<version>3.7.0</version>
</dependency>
<dependency>
<groupId>org.junit.jupiter</groupId>
<artifactId>junit-jupiter</artifactId>
<version>5.7.0</version>
<scope>test</scope>
</dependency>
```

### 1.2.3 第三方工具

利用第三方工具，如 Redis-Rdb-Tools 分析RDB快照文件，全面分析内存使用情况。

Redis-Rdb-Tools的Github网址：

**[该类型的内容暂不支持下载]**

### 1.2.4 网络监控

自定义工具，监控进出Redis的网络数据，超出预警值时主动告警。一般阿里云搭建的云服务器就有相关监控页面：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/5/image133.png" alt="image133.png"></div>

### 1.2.5 删除BigKey

BigKey内存占用较多，即便是删除这样的key也需要耗费很长时间，导致Redis主线程阻塞，引发一系列问题。

Redis 3.0 之前：如果是集合类型，则遍历BigKey的元素，先逐个删除子元素，最后删除BigKey

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/5/image134.png" alt="image134.png"></div>

Redis 4.0 以后：Redis在4.0后提供了异步删除的命令UNLINK key [key ...]，它会开启新线程进行删除

### 1.3 恰当的数据类型

存储一个User对象，可以有三种存储方式：

### 方式一：json字符串

|        |                          |
| ------ | ------------------------ |
| user:1 | {"name":"Jack","age":21} |

优点：实现简单粗暴

缺点：数据耦合，不够灵活

### 方式二：字段打散

|             |            |
| ----------- | ---------- |
| user:1:name | user:1:age |
| Jack        | 21         |

优点：可以灵活访问对象任意字段

缺点：占用空间大、没办法做统一控制

### 方式三：hash（推荐）

|        |      |      |
| ------ | ---- | ---- |
| user:1 | name | jack |
|        | age  | 21   |

优点：底层使用ziplist，空间占用小，可以灵活访问对象的任意字段

缺点：代码相对复杂

但是，如果hash类型的key其中有100万对field和value，field是自增id，如下：

|         |           |             |
| ------- | --------- | ----------- |
| key     | field     | value       |
| someKey | id:0      | value0      |
|         | .....     | .....       |
|         | id:999999 | value999999 |

这时hash的entry数量超过500，会使用哈希表而不是ZipList，内存占用较多：

可以通过MEMORY USAGE key命令查看内存占用，课程中提供的info memory会统计整个Redis服务器的指标，包含内存使用量used_memory_human，结果不只限于单个hash

entry使用哈希表的上限500可以通过config set hash-max-ziplist-entries maxLen命令进行修改（不建议超过1000），也可以通过config get hash-max-ziplist-entries命令查看

结果hash类型内存占用大的方案有两个：

**方案一**：拆分为string类型

|           |             |
| --------- | ----------- |
| key       | value       |
| id:0      | value0      |
| .....     | .....       |
| id:999999 | value999999 |

这种方案spring底层没有太多内存优化，可能内存占用更大，而且获取数据也麻烦。

**方案二**：拆分为小的hash，将 id / 100 作为key， 将id % 100 作为field，这样每100个元素为一个Hash

|          |       |             |
| -------- | ----- | ----------- |
| key      | field | value       |
| key:0    | id:00 | value0      |
|          | ..... | .....       |
|          | id:99 | value99     |
| key:1    | id:00 | value100    |
|          | ..... | .....       |
|          | id:99 | value199    |
| ....     |       |             |
| key:9999 | id:00 | value999900 |
|          | ..... | .....       |
|          | id:99 | value999999 |

在JedisTest中新增以下几个测试单元，通过info memory命令比较各种方案的区别：

```java
@Test
void testSetBigKey() {
Map<String, String> map = new HashMap<>();
for (int i = 1; i <= 650; i++) {
map.put("hello_" + i, "world!");
}
jedis.hmset("m2", map);
}

@Test
void testBigHash() {
Map<String, String> map = new HashMap<>();
for (int i = 1; i <= 100000; i++) {
map.put("key_" + i, "value_" + i);
}
jedis.hmset("test:big:hash", map);
}

@Test
void testBigString() {
for (int i = 1; i <= 100000; i++) {
jedis.set("test:str:key_" + i, "value_" + i);
}
}

@Test
void testSmallHash() {
int hashSize = 100;
Map<String, String> map = new HashMap<>(hashSize);
for (int i = 1; i <= 100000; i++) {
int k = (i - 1) / hashSize;
int v = i % hashSize;
map.put("key_" + v, "value_" + v);
if (v == 0) {
jedis.hmset("test:small:hash_" + k, map);
}
}
}
```

最后可以发现方案二的内存占用少了很多，而方案一内存占用反而增加了。

### 1.4 总结

Key的最佳实践

固定格式：[业务名]:[数据名]:[id]

足够简短：不超过44字节

不包含特殊字符

Value的最佳实践：

合理的拆分数据，拒绝BigKey

选择合适数据结构

Hash结构的entry数量不要超过1000

设置合理的超时时间

## 2.批处理优化

### 2.1 Pipeline

当客户端一次需要操作多次Redis时（即执行多个Redis命令），可以请求多次Redis，每次执行一个命令，也可以请求一次Redis，一次执行所有命令。

单个命令的执行流程：一次命令的响应时间 = 1次往返的网络传输耗时 + 1次Redis执行命令耗时

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/5/image135.png" alt="image135.png"></div>

N条命令的执行流程：N次命令的响应时间 = N次往返的网络传输耗时 + N次Redis执行命令耗时

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/5/image136.png" alt="image136.png"></div>

由于Redis执行命令很快，所以命令响应时间往往只取决于网络传输耗时，所以可以一次发送N条命令，这时N条命令的执行流程就变化成：N次命令的响应时间 = 1次往返的网络传输耗时 + N次Redis执行命令耗时

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/5/image137.png" alt="image137.png"></div>

### 2.1.1 MSET

Redis提供了很多Mxxx这样的命令，可以实现批量插入数据，例如：

MSET key value [key value ...]：仅支持string类型

HMSET key field value [field value ...]：仅支持hash类型，而且只能添加一个key

利用MSET批量插入10万条数据：

```java
@Test
void testMxx() {
String[] arr = new String[2000];
int j;
long b = System.currentTimeMillis();
for (int i = 1; i <= 100000; i++) {
//每1000条命令发送一次请求，避免造成CPU一次插入10万数据的压力
j = (i % 1000) << 1;
arr[j] = "test:key_" + i;
arr[j + 1] = "value_" + i;
if (j == 0) {
jedis.mset(arr);
}
}
long e = System.currentTimeMillis();
System.out.println("time: " + (e - b));
}
```

### 2.1.2 Pipeline

MSET命令只能操作string类型，其他类型如果想要一次操作多个key，就需要用到Pipeline。

Pipeline即管道，允许客户端一次发送多个命令给Redis服务器，然后Redis依次执行这些命令，最后将结果按顺序打包响应给客户端。但是遇到执行异常的命令会跳过执行下一条，所以**Pipeline不保证数据的原子性**。

```java
@Test
void testPipeline() {
// 创建管道
Pipeline pipeline = jedis.pipelined();
long b = System.currentTimeMillis();
for (int i = 1; i <= 100000; i++) {
// 放入命令到管道
pipeline.set("test:key_" + i, "value_" + i);
if (i % 1000 == 0) {
// 每放入1000条命令，批量执行，不建议一次携带太多命令
pipeline.sync();
}
}
long e = System.currentTimeMillis();
System.out.println("time: " + (e - b));
}
```

### 2.2 集群下的批处理

在Redis集群模式下，MSET或Pipeline中的命令所有的key必须要落在**同一个插槽**，否则会执行失败，但这是很难保证的（不建议使用{}使大量key在同一个插槽）。

目前有4种解决方案（slot表示插槽）：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/5/image138.png" alt="image138.png"></div>

### 2.2.1 串行化执行代码实践

JedisClusterTest测试类：

```java
public class JedisClusterTest {

private JedisCluster jedisCluster;

@BeforeEach
void setUp() {
// 配置连接池
JedisPoolConfig poolConfig = new JedisPoolConfig();
poolConfig.setMaxTotal(8);
poolConfig.setMaxIdle(8);
poolConfig.setMinIdle(0);
poolConfig.setMaxWaitMillis(1000);
HashSet<HostAndPort> nodes = new HashSet<>();
nodes.add(new HostAndPort("192.168.150.101", 7001));
nodes.add(new HostAndPort("192.168.150.101", 7002));
nodes.add(new HostAndPort("192.168.150.101", 7003));
nodes.add(new HostAndPort("192.168.150.101", 8001));
nodes.add(new HostAndPort("192.168.150.101", 8002));
nodes.add(new HostAndPort("192.168.150.101", 8003));
jedisCluster = new JedisCluster(nodes, poolConfig);
}

/* 测试集群模式下MSET是否成功 */
@Test
void testMSet() {
jedisCluster.mset("name", "Jack", "age", "21", "sex", "male");
}

/* 串行slot测试 */
@Test
void testMSet2() {
Map<String, String> map = new HashMap<>(3);
map.put("name", "Jack");
map.put("age", "21");
map.put("sex", "Male");
//对Map数据进行分组。根据相同的slot放在一个分组
//key就是slot，value就是一个组
Map<Integer, List<Map.Entry<String, String>>> result = map.entrySet()
.stream()
.collect(Collectors.groupingBy(
entry -> ClusterSlotHashUtil.calculateSlot(entry.getKey())) //自定义工具类计算插槽
);
//串行的去执行mset的逻辑
for (List<Map.Entry<String, String>> list : result.values()) {
String[] arr = new String[list.size() * 2];
int j = 0;
for (int i = 0; i < list.size(); i++) {
j = i << 1;
Map.Entry<String, String> e = list.get(i);
arr[j] = e.getKey();
arr[j + 1] = e.getValue();
}
jedisCluster.mset(arr);
}
}

@AfterEach
void tearDown() {
if (jedisCluster != null) {
jedisCluster.close();
}
}
}
```

ByteUtils：

```java
package com.heima.JedisUtil;

import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
* 一些处理{@code byte}数组的实用方法。
*
* @author Christoph Strobl
* @author Mark Paluch
* @since 1.7
*/
public final class ByteUtils {

private ByteUtils() {}

/**
* 将给定的{@code byte}数组连接成一个数组，重叠的数组元素会被包含两次。
* <p />
* 原始数组中元素的顺序会被保留。
*
* @param array1 第一个数组。
* @param array2 第二个数组。
* @return 新的数组。
*/
public static byte[] concat(byte[] array1, byte[] array2) {
byte[] result = Arrays.copyOf(array1, array1.length + array2.length);
System.arraycopy(array2, 0, result, array1.length, array2.length);

return result;
}

/**
* 将给定的{@code byte}数组连接成一个数组，重叠的数组元素会被包含两次。
* 如果{@code arrays}为空，则返回一个新的空数组；如果{@code arrays}只包含一个数组，则返回该数组。
* <p />
* 原始数组中元素的顺序会被保留。
*
* @param arrays 要连接的数组。
* @return 新的数组。
*/
public static byte[] concatAll(byte[]... arrays) {
if (arrays.length == 0) {
return new byte[] {};
}
if (arrays.length == 1) {
return arrays[0];
}

byte[] cur = concat(arrays[0], arrays[1]);
for (int i = 2; i < arrays.length; i++) {
cur = concat(cur, arrays[i]);
}
return cur;
}

/**
* 使用分隔符{@code c}将{@code source}分割成多个子数组。
*
* @param source 源数组。
* @param c 分隔符。
* @return 分割后的子数组。
*/
public static byte[][] split(byte[] source, int c) {
if (ObjectUtils.isEmpty(source)) {
return new byte[][] {};
}

List<byte[]> bytes = new ArrayList<>();
int offset = 0;
for (int i = 0; i <= source.length; i++) {

if (i == source.length) {

bytes.add(Arrays.copyOfRange(source, offset, i));
break;
}

if (source[i] == c) {
bytes.add(Arrays.copyOfRange(source, offset, i));
offset = i + 1;
}
}
return bytes.toArray(new byte[bytes.size()][]);
}

/**
* 将多个{@code byte}数组合并成一个二维数组
*
* @param firstArray 不能为{@literal null}
* @param additionalArrays 不能为{@literal null}
* @return 合并后的二维数组
*/
public static byte[][] mergeArrays(byte[] firstArray, byte[]... additionalArrays) {
Assert.notNull(firstArray, "第一个数组不能为null");
Assert.notNull(additionalArrays, "附加数组不能为null");

byte[][] result = new byte[additionalArrays.length + 1][];
result[0] = firstArray;
System.arraycopy(additionalArrays, 0, result, 1, additionalArrays.length);

return result;
}

/**
* 从{@link ByteBuffer}中提取字节数组，不消耗缓冲区内容。
*
* @param byteBuffer 不能为{@literal null}。
* @return 提取的字节数组
* @since 2.0
*/
public static byte[] getBytes(ByteBuffer byteBuffer) {
Assert.notNull(byteBuffer, "ByteBuffer不能为null!");

ByteBuffer duplicate = byteBuffer.duplicate();
byte[] bytes = new byte[duplicate.remaining()];
duplicate.get(bytes);
return bytes;
}

/**
* 测试{@code haystack}是否以给定的{@code prefix}开头。
*
* @param haystack 要扫描的源数组。
* @param prefix 要查找的前缀。
* @return 如果{@code haystack}在{@code offset}位置以{@code prefix}开头，则返回{@literal true}。
* @since 1.8.10
* @see #startsWith(byte[], byte[], int)
*/
public static boolean startsWith(byte[] haystack, byte[] prefix) {
return startsWith(haystack, prefix, 0);
}

/**
* 测试从指定{@code offset}位置开始的{@code haystack}是否以给定的{@code prefix}开头。
*
* @param haystack 要扫描的源数组。
* @param prefix 要查找的前缀。
* @param offset 开始查找的偏移量。
* @return 如果{@code haystack}在{@code offset}位置以{@code prefix}开头，则返回{@literal true}。
* @since 1.8.10
*/
public static boolean startsWith(byte[] haystack, byte[] prefix, int offset) {
int to = offset;
int prefixOffset = 0;
int prefixLength = prefix.length;

if ((offset < 0) || (offset > haystack.length - prefixLength)) {
return false;
}


while (--prefixLength >= 0) {
if (haystack[to++] != prefix[prefixOffset++]) {
return false;
}
}

return true;
}

/**
* 在指定的字节数组中搜索指定的值。返回{@code haystack}中第一个匹配值的索引，
* 如果未找到{@code needle}，则返回{@code -1}。
*
* @param haystack 要扫描的源数组。
* @param needle 要搜索的值。
* @return 第一个匹配项的索引，如果未找到则返回-1。
* @since 1.8.10
*/
public static int indexOf(byte[] haystack, byte needle) {
for (int i = 0; i < haystack.length; i++) {
if (haystack[i] == needle) {
return i;
}
}

return -1;
}

/**
* 使用{@link StandardCharsets#UTF_8}将{@link String}转换为{@link ByteBuffer}。
*
* @param theString 不能为{@literal null}。
* @return 转换后的ByteBuffer
* @since 2.1
*/
public static ByteBuffer getByteBuffer(String theString) {
return getByteBuffer(theString, StandardCharsets.UTF_8);
}

/**
* 使用给定的{@link Charset}将{@link String}转换为{@link ByteBuffer}。
*
* @param theString 不能为{@literal null}。
* @param charset 不能为{@literal null}。
* @return 转换后的ByteBuffer
* @since 2.1
*/
public static ByteBuffer getByteBuffer(String theString, Charset charset) {
Assert.notNull(theString, "字符串不能为null!");
Assert.notNull(charset, "字符集不能为null!");
return charset.encode(theString);
}

/**
* 通过复制缓冲区并获取其内容，从给定的{@link ByteBuffer}中提取/传输字节到数组中。
*
* @param buffer 不能为{@literal null}。
* @return 提取的字节数组
* @since 2.1
*/
public static byte[] extractBytes(ByteBuffer buffer) {
ByteBuffer duplicate = buffer.duplicate();
byte[] bytes = new byte[duplicate.remaining()];
duplicate.get(bytes);
return bytes;
}
}
```

ObjectUtils：

```java
package com.heima.JedisUtil;

import com.sun.istack.internal.Nullable;
import java.lang.reflect.Array;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;

public class ObjectUtils {
public static boolean isEmpty(@Nullable Object obj) {
if (obj == null) {
return true;
}

if (obj instanceof Optional) {
return !((Optional<?>) obj).isPresent();
}
if (obj instanceof CharSequence) {
return ((CharSequence) obj).length() == 0;
}
if (obj.getClass().isArray()) {
return Array.getLength(obj) == 0;
}
if (obj instanceof Collection) {
return ((Collection<?>) obj).isEmpty();
}
if (obj instanceof Map) {
return ((Map<?, ?>) obj).isEmpty();
}
// else
return false;
}
}
```

Assert：

```java
package com.heima.JedisUtil;

public class Assert {
public static void notNull(Object obj, String msg){
if (obj == null) {
throw new RuntimeException(msg);
}
}
public static void hasText(String str, String msg){
if (str == null) {
throw new RuntimeException(msg);
}
if (str.trim().isEmpty()) {
throw new RuntimeException(msg);
}
}
}
```

ClusterSlotHashUtil：

```java
package com.heima.JedisUtil;

import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.Collection;

/**
* Redis集群槽位哈希工具类，用于计算key所属的集群哈希槽位，判断多个key是否在同一槽位
*
* @author Christoph Strobl
* @since 1.7
*/
public final class ClusterSlotHashUtil {

// Redis集群的总槽位数量，固定为16384个
private static final int SLOT_COUNT = 16384;

// 用于提取key中哈希计算部分的起始字符（'{'），遵循Redis集群key标签规则
private static final byte SUBKEY_START = '{';
// 用于提取key中哈希计算部分的结束字符（'}'），遵循Redis集群key标签规则
private static final byte SUBKEY_END = '}';

// CRC16校验算法的 lookup table（查表法），用于快速计算CRC16值
private static final int[] LOOKUP_TABLE = { 0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50A5, 0x60C6, 0x70E7, 0x8108,
0x9129, 0xA14A, 0xB16B, 0xC18C, 0xD1AD, 0xE1CE, 0xF1EF, 0x1231, 0x0210, 0x3273, 0x2252, 0x52B5, 0x4294, 0x72F7,
0x62D6, 0x9339, 0x8318, 0xB37B, 0xA35A, 0xD3BD, 0xC39C, 0xF3FF, 0xE3DE, 0x2462, 0x3443, 0x0420, 0x1401, 0x64E6,
0x74C7, 0x44A4, 0x5485, 0xA56A, 0xB54B, 0x8528, 0x9509, 0xE5EE, 0xF5CF, 0xC5AC, 0xD58D, 0x3653, 0x2672, 0x1611,
0x0630, 0x76D7, 0x66F6, 0x5695, 0x46B4, 0xB75B, 0xA77A, 0x9719, 0x8738, 0xF7DF, 0xE7FE, 0xD79D, 0xC7BC, 0x48C4,
0x58E5, 0x6886, 0x78A7, 0x0840, 0x1861, 0x2802, 0x3823, 0xC9CC, 0xD9ED, 0xE98E, 0xF9AF, 0x8948, 0x9969, 0xA90A,
0xB92B, 0x5AF5, 0x4AD4, 0x7AB7, 0x6A96, 0x1A71, 0x0A50, 0x3A33, 0x2A12, 0xDBFD, 0xCBDC, 0xFBBF, 0xEB9E, 0x9B79,
0x8B58, 0xBB3B, 0xAB1A, 0x6CA6, 0x7C87, 0x4CE4, 0x5CC5, 0x2C22, 0x3C03, 0x0C60, 0x1C41, 0xEDAE, 0xFD8F, 0xCDEC,
0xDDCD, 0xAD2A, 0xBD0B, 0x8D68, 0x9D49, 0x7E97, 0x6EB6, 0x5ED5, 0x4EF4, 0x3E13, 0x2E32, 0x1E51, 0x0E70, 0xFF9F,
0xEFBE, 0xDFDD, 0xCFFC, 0xBF1B, 0xAF3A, 0x9F59, 0x8F78, 0x9188, 0x81A9, 0xB1CA, 0xA1EB, 0xD10C, 0xC12D, 0xF14E,
0xE16F, 0x1080, 0x00A1, 0x30C2, 0x20E3, 0x5004, 0x4025, 0x7046, 0x6067, 0x83B9, 0x9398, 0xA3FB, 0xB3DA, 0xC33D,
0xD31C, 0xE37F, 0xF35E, 0x02B1, 0x1290, 0x22F3, 0x32D2, 0x4235, 0x5214, 0x6277, 0x7256, 0xB5EA, 0xA5CB, 0x95A8,
0x8589, 0xF56E, 0xE54F, 0xD52C, 0xC50D, 0x34E2, 0x24C3, 0x14A0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405, 0xA7DB,
0xB7FA, 0x8799, 0x97B8, 0xE75F, 0xF77E, 0xC71D, 0xD73C, 0x26D3, 0x36F2, 0x0691, 0x16B0, 0x6657, 0x7676, 0x4615,
0x5634, 0xD94C, 0xC96D, 0xF90E, 0xE92F, 0x99C8, 0x89E9, 0xB98A, 0xA9AB, 0x5844, 0x4865, 0x7806, 0x6827, 0x18C0,
0x08E1, 0x3882, 0x28A3, 0xCB7D, 0xDB5C, 0xEB3F, 0xFB1E, 0x8BF9, 0x9BD8, 0xABBB, 0xBB9A, 0x4A75, 0x5A54, 0x6A37,
0x7A16, 0x0AF1, 0x1AD0, 0x2AB3, 0x3A92, 0xFD2E, 0xED0F, 0xDD6C, 0xCD4D, 0xBDAA, 0xAD8B, 0x9DE8, 0x8DC9, 0x7C26,
0x6C07, 0x5C64, 0x4C45, 0x3CA2, 0x2C83, 0x1CE0, 0x0CC1, 0xEF1F, 0xFF3E, 0xCF5D, 0xDF7C, 0xAF9B, 0xBFBA, 0x8FD9,
0x9FF8, 0x6E17, 0x7E36, 0x4E55, 0x5E74, 0x2E93, 0x3EB2, 0x0ED1, 0x1EF0 };

// 私有构造方法，防止工具类被实例化
private ClusterSlotHashUtil() {}

/**
* 判断集合中所有ByteBuffer类型的key是否属于同一集群槽位
*
* @param keys 待判断的key集合，不能为null
* @return true：所有key在同一槽位；false：存在key在不同槽位
* @since 2.0
*/
public static boolean isSameSlotForAllKeys(Collection<ByteBuffer> keys) {
Assert.notNull(keys, "Keys must not be null!"); // 断言：key集合不能为null
if (keys.size() <= 1) { // 若key数量≤1，默认属于同一槽位
return true;
}
// 将ByteBuffer类型的key转换为byte数组，调用重载方法判断
return isSameSlotForAllKeys((byte[][]) keys.stream() //
.map(ByteBuffer::duplicate) // 复制ByteBuffer（避免修改原缓冲区）
.map(ByteUtils::getBytes) // 调用ByteUtils工具类提取byte数组
.toArray(byte[][]::new));
}

/**
* 判断可变参数中所有ByteBuffer类型的key是否属于同一集群槽位
*
* @param keys 待判断的key可变参数，不能为null
* @return true：所有key在同一槽位；false：存在key在不同槽位
* @since 2.0
*/
public static boolean isSameSlotForAllKeys(ByteBuffer... keys) {
Assert.notNull(keys, "Keys must not be null!"); // 断言：key数组不能为null
return isSameSlotForAllKeys(Arrays.asList(keys)); // 转换为集合，调用上面的集合重载方法
}

/**
* 判断可变参数中所有byte数组类型的key是否属于同一集群槽位
*
* @param keys 待判断的key可变参数（byte数组），不能为null
* @return true：所有key在同一槽位；false：存在key在不同槽位
*/
public static boolean isSameSlotForAllKeys(byte[]... keys) {
Assert.notNull(keys, "Keys must not be null!"); // 断言：key数组不能为null
if (keys.length <= 1) { // 若key数量≤1，默认属于同一槽位
return true;
}

// 计算第一个key的槽位，作为基准槽位
int slot = calculateSlot(keys[0]);
// 遍历剩余key，判断是否与基准槽位一致
for (int i = 1; i < keys.length; i++) {
if (slot != calculateSlot(keys[i])) {
return false;
}
}
return true;
}

/**
* 根据字符串类型的key，计算其所属的Redis集群槽位
*
* @param key 待计算的key，不能为null或空字符串
* @return key所属的集群槽位（0~16383之间的整数）
*/
public static int calculateSlot(String key) {
Assert.hasText(key, "Key must not be null or empty!"); // 断言：key不能为null或空
return calculateSlot(key.getBytes()); // 转换为byte数组，调用byte数组重载方法
}

/**
* 根据byte数组类型的key，计算其所属的Redis集群槽位
* 遵循Redis集群key标签规则：若key包含"{}"，则仅用"{}"内的内容计算槽位；否则用整个key计算
*
* @param key 待计算的key（byte数组），不能为null
* @return key所属的集群槽位（0~16383之间的整数）
*/
public static int calculateSlot(byte[] key) {
Assert.notNull(key, "Key must not be null!"); // 断言：key不能为null

byte[] finalKey = key; // 最终用于计算槽位的key（默认是原key）
// 查找key中'{'的位置（起始索引）
int start = indexOf(key, SUBKEY_START);
if (start != -1) { // 若找到'{'
// 从'{'的下一个位置开始，查找'}'的位置（结束索引）
int end = indexOf(key, start + 1, SUBKEY_END);
// 若找到'}'，且'{'和'}'之间有内容（不是空的"{}"）
if (end != -1 && end != start + 1) {
// 提取"{}"内的子串作为最终计算槽位的key
finalKey = new byte[end - (start + 1)];
System.arraycopy(key, start + 1, finalKey, 0, finalKey.length);
}
}
// 对最终key计算CRC16值，再对总槽位数量取模，得到槽位
return crc16(finalKey) % SLOT_COUNT;
}

/**
* 在byte数组中查找指定字节（needle）的第一次出现位置，从数组起始处开始查找
*
* @param haystack 待查找的byte数组（干草堆）
* @param needle 要查找的目标字节（针）
* @return 目标字节的索引；若未找到，返回-1
*/
private static int indexOf(byte[] haystack, byte needle) {
return indexOf(haystack, 0, needle); // 调用带起始索引的重载方法，从0开始查找
}

/**
* 在byte数组中查找指定字节（needle）的第一次出现位置，从指定起始索引（start）开始查找
*
* @param haystack 待查找的byte数组（干草堆）
* @param start 查找的起始索引（包含）
* @param needle 要查找的目标字节（针）
* @return 目标字节的索引；若未找到，返回-1
*/
private static int indexOf(byte[] haystack, int start, byte needle) {
// 从起始索引遍历到数组末尾
for (int i = start; i < haystack.length; i++) {
if (haystack[i] == needle) { // 找到目标字节，返回当前索引
return i;
}
}
return -1; // 遍历结束未找到，返回-1
}

/**
* 计算byte数组的CRC16校验值（使用查表法，基于LOOKUP_TABLE）
* CRC16算法是Redis集群用于计算key槽位的核心算法
*
* @param bytes 待计算的byte数组
* @return 16位CRC校验值（0~65535之间的整数）
*/
private static int crc16(byte[] bytes) {
int crc = 0x0000; // CRC初始值


// 遍历byte数组中的每个字节，更新CRC值
for (byte b : bytes) {
// 查表法计算CRC：(当前CRC左移8位) XOR (从LOOKUP_TABLE中获取对应值)
crc = ((crc << 8) ^ LOOKUP_TABLE[((crc >>> 8) ^ (b & 0xFF)) & 0xFF]);
}
return crc & 0xFFFF; // 确保结果是16位整数（只保留低16位）
}
}
```

### 2.2.2 Spring集群环境下批处理代码

```java
@Test
void testMSetInCluster() {
Map<String, String> map = new HashMap<>(3);
map.put("name", "Rose");
map.put("age", "21");
map.put("sex", "Female");
stringRedisTemplate.opsForValue().multiSet(map); //MSET

List<String> strings = stringRedisTemplate.opsForValue().multiGet(Arrays.asList("name", "age", "sex")); //MGET
strings.forEach(System.out::println);
}
```

最终运行会发现并没有报错，这是因为Spring提供的客户端已经解决了集群模式下的批处理问题，原理如下：

```java
@Override
public RedisFuture<String> mset(Map<K, V> map) {
Map<Integer, List<K>> partitioned = SlotHash.partition(codec, map.keySet());

if (partitioned.size() < 2) {
return super.mset(map);
}

Map<Integer, RedisFuture<String>> executions = new HashMap<>();

for (Map.Entry<Integer, List<K>> entry : partitioned.entrySet()) {
Map<K, V> op = new HashMap<>();
entry.getValue().forEach(k -> op.put(k, map.get(k)));

RedisFuture<String> mset = super.mset(op);
executions.put(entry.getKey(), mset);
}

return MultiNodeExecution.firstOfAsync(executions);
}
```

底层的RedisAdvancedClusterAsyncCommandsImpl类首先根据slotHash算出来一个partitioned的map，map中的key就是slot，而他的value就是对应的相同slot的key对应的数据，然后通过RedisFuture<String> mset = super.mset(op)进行异步slot的消息发送。

## 3.服务器端优化

### 3.1 持久化配置

Redis的持久化虽然可以保证数据安全，但也会带来很多额外的开销，因此持久化请遵循下列建议：

用来做缓存的Redis实例尽量不要开启持久化功能

建议关闭RDB持久化功能，使用AOF持久化

利用脚本定期在slave节点做RDB，实现数据备份

设置合理的rewrite阈值，避免频繁的bgrewrite

配置no-appendfsync-on-rewrite = yes，禁止在rewrite期间做aof，避免因AOF引起的阻塞

主线程接收到写操作后，不仅将数据写到内存，还要将命令写到AOF缓冲区，根据刷盘策略（如每1秒刷盘）开启新线程同步进行刷盘，同时监听本次刷盘时间，如果刷盘超过2秒，主线程阻塞等待刷盘完成为止，否则通过正常执行指令：

> <div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/5/image139.png" alt="image139.png"></div>

部署有关建议：

Redis实例的物理机要预留足够内存，应对fork和rewrite

单个Redis实例内存上限不要太大，例如4G或8G。可以加快fork的速度、减少主从同步、数据迁移压力

不要与CPU密集型应用部署在一起

不要与高硬盘负载应用一起部署，例如：数据库、消息队列

### 3.2 慢查询优化

慢查询指那些Redis执行时耗时超过某个阈值的命令。

Redis是单线程的，客户端发出的指令都会进入到Redis底层的queue（队列）来执行，如果此时有一些慢查询的数据，就会导致大量请求阻塞，从而引起报错：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/5/image140.png" alt="image140.png"></div>

慢查询的阈值对应配置项slowlog-log-slower-than，单位微妙，默认是10000，建议1000，可以通过命令临时修改：

config get slowlog-log-slower-than：查看慢查询阈值

config set slowlog-log-slower-than 阈值：临时修改慢查询阈值

慢查询会被放在慢查询日志中，日志的长度（即可存慢查询个数）对应配置项slowlog-max-len，和慢查询日志一样，也可以通过config get|set slowlog-max-len [日志长度] 命令查询或临时设置。

|                                                                    |
| ------------------------------------------------------------------ |
| 如果想要永久设置，需要修改Redis配置文件中的配置项slowlog-log-slower-than或slowlog-max-len |

通过如下命令可以查看慢查询日志列表：

slowlog len：查询慢查询日志长度

slowlog get [n]：读取n条慢查询日志

slowlog reset：清空慢查询列表

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/5/image141.png" alt="image141.png"></div>

### 3.3 命令及安全配置

Redis会绑定在0.0.0.0:6379，这样将会将Redis服务暴露到公网上，而Redis如果没有做身份认证，会出现严重的安全漏洞。

漏洞重现方式：

**[该类型的内容暂不支持下载]**

为什么会出现不需要密码也能登录？Redis考虑到每次登录都比较麻烦，所以Redis就有一种ssh免秘钥登录的方式，生成一对公钥和私钥，私钥放在本地，公钥放在Redis端，当登录服务器时，服务器和本地进行公钥和私钥的认证，如果没有问题，则不需要利用Redis的登录也能访问，这种做法本身也很常见。但前提是公钥必须保存在服务器上，但是Redis的漏洞在于在不登录的情况下，也能把公钥送到Linux服务器，从而产生漏洞。

漏洞出现的核心原因：

Redis未设置密码

利用了Redis的config set命令动态修改Redis配置

使用了root账号权限启动Redis

为了避免这样的漏洞，尽量采用如下建议：

Redis一定要设置密码

禁止线上使用下面命令：keys、flushall、flushdb、config set等命令。可以利用rename-command禁用

bind：限制网卡，禁止外网网卡访问

开启防火墙

不要使用root账户启动Redis

尽量不使用默认的端口

### 3.4 内存划分和内存配置

当Redis内存不足时，可能导致Key频繁被删除、响应时间变长、QPS不稳定等问题。当内存使用率达到 90% 以上时就需要警惕，并快速定位到内存占用原因。

|       |                                                                                 |
| ----- | ------------------------------------------------------------------------------- |
| 内存占用  | 说明                                                                              |
| 数据内存  | 是Redis最主要的部分，存储Redis的键值信息。主要问题是BigKey问题、内存碎片问题                                  |
| 进程内存  | Redis主进程本身运⾏也需要占⽤内存，如代码、常量池等等；这部分内存⼤约⼏兆，在⼤多数⽣产环境中与Redis数据占⽤的内存相⽐可以忽略            |
| 缓冲区内存 | 一般包括客户端缓冲区、AOF缓冲区、复制缓冲区等。客户端缓冲区又包括输入缓冲区和输出缓冲区两种。这部分内存占用波动较大，不当使用BigKey，可能导致内存溢出 |

*内存碎片：Redis底层分配并不是key有多大就会分配多大，而是有自己的分配策略，比如8, 16, 20等等，假定当前key只需10个字节，此时分配8不够，就会分配16个字节，多出来的6个字节就会空闲，成为内存碎片。*

通过一些命令可以查看Redis目前内存分配状态：

info memory：查看内存分配的情况

memory xxx：查看key的主要占用情况，如memory stats用于查看内存相关统计信息，其结果解释参考下面的Redis内存说明.txt文件

**[Redis内存说明.txt]**

内存缓冲区常见的有三种：

复制缓冲区：主从复制的repl_backlog_buf，如果太小可能导致频繁的全量复制，影响性能。通过replbacklog-size来设置，默认1mb

AOF缓冲区：AOF刷盘之前的缓存区域，AOF执行rewrite的缓冲区。无法设置容量上限

客户端缓冲区：分为输入缓冲区和输出缓冲区，输入缓冲区最大1G且不能设置。输出缓冲区可以设置

复制缓冲区和AOF缓冲区不会有问题，最关键就是**客户端缓冲区**问题。

客户端缓冲区：我们发送命令时，客户端用来缓存命令的一个缓冲区，也就是向Redis输入数据的输入端缓冲区和Redis向客户端返回数据的响应缓存区。输入缓冲区最大1G且不能设置，如果超过了这个空间，Redis会直接断开，我们需要担心的是输出端缓冲区。

client-output-buffer-limit是 Redis 用于限制客户端输出缓冲区大小的配置项，

格式：client-output-buffer-limit <class> <hard limit> <soft limit> <soft seconds>

<class>：客户端类型，normal为普通客户端、slave为从节点客户端、pubsub为发布订阅客户端

<hard limit>：若客户端输出缓冲区超过此值（字节），Redis会立即断开客户端连接

<soft limit>和<soft seconds>：若输出缓冲区在soft seconds秒内持续超过soft limit字节数，Redis会断开客户端连接

client-output-buffer-limit的默认配置如下：

```bash
client-output-buffer-limit normal 0 0 0 # 普通客户端没有限制
client-output-buffer-limit replica 256mb 64mb 60 # 早期版本为slave
client-output-buffer-limit pubsub 32mb 8mb 60
```

由于普通客户端输出缓冲区没有限制，如果突然处理大量的BigKey，会导致内存突然占满，就会导致Redis断开，解决方式有两个：

设置输出缓冲区大小，避免BigKey

增加服务器带宽大小，避免突然出现大量数据超过Redis的承受能力

定位出现问题的客户端需要使用到两个命令：

info clients：返回客户端连接的**统计性概览**，聚焦整体连接状态，不包含单个客户端的详细信息

```bash
connected_clients:10 # 当前已连接的客户端总数（包括普通客户端、从节点、发布订阅客户端等）
client_recent_max_input_buffer:2048 # 最近客户端输入缓冲区的最大大小（字节）
client_recent_max_output_buffer:4096 # 最近客户端输出缓冲区的最大大小（字节）
blocked_clients:2 # 被阻塞的客户端数量（如执行 BLPOP、BRPOP 等命令的客户端）
tracking_clients:0 # 开启键空间通知跟踪的客户端数量
clients_in_timeout_table:0 # 处于超时表中的客户端数量
```

client list：返回**每个客户端连接的详细信息**，包括客户端 ID、地址、状态、缓冲区大小等

id：客户端唯一标识

addr：客户端的 IP 和端口

flags：客户端类型（N= 普通客户端，S= 从节点，P= 发布订阅客户端）

**omem**：输出缓冲区大小（字节），若过大可能导致内存问题

cmd：客户端最近执行的命令

## 4.服务器端集群优化

集群虽然具备高可用特性，能实现自动故障恢复，但是如果使用不当，也会存在一些问题。

### 集群完整性问题

在Redis的默认配置中，如果发现任意一个插槽不可用，则整个集群都会停止对外服务。

为了保证高可用性，建议将配置文件中cluster-require-full-coverage配置为 no

### 集群带宽问题

集群节点之间会不断的互相Ping来确定集群中其它节点的状态。每次Ping携带的信息至少包括：插槽信息和集群状态信息。

集群节点越多，集群状态信息数据量也越大，10个节点的相关信息可能达到1kb，此时每次集群互通需要的带宽会非常高，导致集群大量的带宽都被ping占用。

解决途径：

避免大集群，集群节点数不要太多，最好少于1000，如果业务庞大，则建立多个集群

避免在单个物理机中运行太多Redis实例

配置合适的cluster-node-timeout值

### 数据倾斜问题

数据出现BigKey或集群批处理时使用了相同的hash_tag，都会造成数据倾斜问题。

### 客户端性能问题

一旦做了集群，将来客户端不管是利用Jedis还是lettuce，在访问集群的时候都需要在集群中做节点的选择、读写分离的判断、插槽的判断等等，势必会给客户端性能带来一些影响。

### 命令的集群兼容性问题

当使用批处理的命令时，redis要求key必须落在相同的slot上，然后大量的key同时操作是无法完成的，客户端必须要对这样的数据进行处理具体参考批处理优化部分。

### lua和事务问题

lua和事务都是要保证原子性，如果key不在一个节点，那么无法保证lua的执行和事务的特性，所以在集群模式无法执行lua和事务。

**集群和主从的选择**：单体Redis（主从Redis）已经能达到万级别的QPS，并且也具备很强的高可用特性。如果主从能满足业务需求，尽量使用主从。不到万不得已，尽量不要搭建Redis集群。
