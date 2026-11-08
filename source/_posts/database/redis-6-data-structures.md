---
title: Redis-数据结构
date: 2025-09-06 01:00:00
categories:
  - database
tags:
  - redis
---
<div class="essay-banner essay-image4"></div>

# 六、Redis数据结构

## 1.动态字符串SDS

Redis的key本质是一个字符串，value也往往是字符串或字符串的集合，可见字符串是Redis最常用的数据结构。

C语言的字符串存在如下问题：

没有内置的字符串类：C语言并没有提供字符串类型，字符串在C语言中是以空字符0结尾的字符数组

获取字符串长度的需要通过运算：C语言并没有提供字符数组的长度字段，要获取字符串（字符数组）的长度必须遍历整个数组

非二进制安全：由于字符串以空字符0结尾，所以字符串不能包含0，这限制了字符串保存二进制数据（图片、视频等）的能力

所以Redis设计了新的字符串结构，即简单动态字符串，简称SDS。例如执行set name jack，Redis会创建两个SDS，分别是包含name的SDS和包含jack的SDS。

SDS是一个结构体，源码如下：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image142.png" alt="image142.png"></div>

初始时alloc和len相同，但随着动态扩容，两者会有差异

字符数组buf[]用于保存字符串，末尾有一个结束标识0

为了适应不同长度的字符串，Redis设计了五种SDS头部结构，这些结构的主要区别在于它们能够表示的字符串长度的范围不同：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image143.png" alt="image143.png"></div>

例如保存一个"hi"字符串的SDS结构为：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image144.png" alt="image144.png"></div>

SDS还具备动态扩容能力，比如在"hi"字符串后追加 “,Amy” ，首先申请内存空间：

如果新字符串小于1M，则新空间为 扩展后字符串长度的两倍+1

如果新字符串大于1M，则新空间为 扩展后字符串长度+1M+1 ，称为内存预分配

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image145.png" alt="image145.png"></div>

SDS的优点：

获取字符串长度的时间复杂度为O(1)

支持动态扩容

减少内存分配次数

二进制安全

*当Redis需要存储一个字符串时，会根据字符串的实际长度来选择合适的SDS头部结构。*

*当Redis中存储的字符串长度发生变化超出当前SDS（简单动态字符串）结构存储上限时，SDS会进行动态扩容，而不是切换到其他SDS结构存储。*

*SDS还采用了内存预分配和惰性空间释放策略来优化内存使用：*

当字符串需要扩容时，SDS会根据一定的规则分配新的内存空间

当字符串缩短时，SDS并不会立即回收多余的内存空间，而是将其记录下来，以便将来使用。这种惰性空间释放策略减少了内存分配和释放的次数，提高了性能

## 2.IntSet

IntSet是Redis中set集合的一种实现方式，基于整数数组来实现，并且具备长度可变、有序等特征。 结构如下：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image146.png" alt="image146.png"></div>

其中的encoding包含三种模式，表示存储的整数大小不同：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image147.png" alt="image147.png"></div>

为了方便查找，Redis会将intset中所有的整数按照**升序**依次保存在contents数组中。例如存放数据[5，10，20]，采用INTSET_ENC_INT16编码，插入后的intset结构：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image148.png" alt="image148.png"></div>

现在，数组中每个数字都在int16_t的范围内，因此采用的编码方式是INTSET_ENC_INT16，每部分占用的字节大小：

encoding：4字节

length：4字节

contents：2字节 * 3 = 6字节

数组中每个数字采用相同的编码方式，即占用空间大小相同，结合数组起始地址和数组下标可以快速定位到每个元素的物理地址：startPtr + (sizeof(int16) * index)，所以数组下标也表示当前元素到数组起始地址间隔了多少个元素。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image149.png" alt="image149.png"></div>

现在向数组[5，10，20]中添加元素50000，这个数字已经超出INTSET_ENC_INT16的范围，intset将自动升级编码方式到合适的大小：

升级编码为INTSET_ENC_INT32，每个整数占4字节，并按照新的编码方式及元素个数扩容数组

倒序依次将数组中的元素拷贝到扩容后的正确位置

将待添加的元素放入数组末尾

最后，将inset的encoding属性改为INTSET_ENC_INT32，将length属性改为4

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image150.png" alt="image150.png"></div>

添加元素的源码如下：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image151.png" alt="image151.png"></div>

总结下来，Intset可以看做是特殊的整数数组，具备如下特点：

Redis会确保Intset中的元素唯一、有序

具备类型升级机制，可以节省内存空间

底层采用二分查找方式来查询

## 3.Dict

### 3.1 Dict的结构

Redis是一个键值型数据库，可以根据键实现快速的增删改查。而键与值的映射关系正是通过Dict实现的。

Dict由三部分组成，分别是：哈希表（DictHashTable）、哈希节点（DictEntry）、字典（Dict）

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image152.png" alt="image152.png"></div>

哈希表实际上是一个数组，其中：

dictEntry **table：一个DictEntry类型的数组指针，数组内保存的是指向一个个DictEntry对象的指针

size：哈希表数组的大小，默认为4，总是2的幂次方

siezmask：哈希表大小的掩码，总等于size - 1

used：哈希表数组中已存在的entry的个数

向Dict添加键值对时，Redis首先根据key计算出hash值h，然后利用h & sizemask（等同于h对size求余）计算元素应该存储到数组中的哪个索引位置。

*h & sizemask相当于 h % size，由于size总是2的幂次方，对应二进制总是一位为1，其余位为0，所以size - 1即siezmask的二进制就是1后面所有位是1（不包含原来的1），其余位是0，而h % size就是得到size中1后面所有低位对应h二进制中的数据，恰好是h & sizemask：*

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image153.png" alt="image153.png"></div>

若此时要插入两个键值对k1-v1、k2-v2，加入k1计算出的hash值h = 1，1 & 3 = 1，所以存储在数组索引为1的位置，假如k2计算出也要存放在数组索引为1的位置，就会发生Hash冲突，Redis会将两个哈希结点形成链表，把k2-v2采用头插法插入链表头部（table指向链表第一个哈希节点，采用尾插法需要遍历找到最后一个节点再插入，效率低）：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image154.png" alt="image154.png"></div>

接下来看看字典的结构：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image155.png" alt="image155.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image156.png" alt="image156.png"></div>

### 3.2 Dict的扩容

Dict中的HashTable就是数组结合单向链表的实现，当集合中元素较多时，必然导致哈希冲突增多，链表过长，则查询效率会大大降低。

Dict在每次新增键值对时都会检查负载因子（LoadFactor = used/size） ，以下两种情况都会触发哈希表扩容：

哈希表的 LoadFactor >= 1，并且服务器没有执行 BGSAVE 或者 BGREWRITEAOF 等后台进程

哈希表的 LoadFactor > 5

扩容的源码如下：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image157.png" alt="image157.png"></div>

### 3.3 Dict的收缩

Dict除了扩容以外，每次删除元素时，也会对负载因子做检查，当LoadFactor < 0.1时，会做哈希表收缩：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image158.png" alt="image158.png"></div>

扩容和收缩都会调用dictExpand方法，其源码如下：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image159.png" alt="image159.png"></div>

### 3.4 Dict的rehash

不管是扩容还是收缩，必定会创建新的哈希表，导致哈希表的size和sizemask变化，而key的查询与sizemask有关。因此必须对哈希表中的每一个key重新计算索引，插入新的哈希表，这个过程称为rehash。rehash的流程如下：

计算新hash表的realeSize，值取决于当前要做的是扩容还是收缩：

如果是扩容，则新size为第一个大于等于dict.ht[0].used + 1的2^n

如果是收缩，则新size为第一个小于等于dict.ht[0].used的2^n （不得小于4）

按照新的realeSize申请内存空间，创建dictht，并赋值给dict.ht[1]

设置dict.rehashidx = 0，标示开始rehash

将dict.ht[0]中的每一个dictEntry都rehash到dict.ht[1]

将dict.ht[1]赋值给dict.ht[0]，给dict.ht[1]初始化为空哈希表，释放原来的dict.ht[0]的内存

将rehashidx赋值为-1，代表rehash结束

执行过程截图：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image160.png" alt="image160.png"></div>

但是rehash是在执行增删操作时判断是否要执行rehash，而这些操作是在Redis的主进程中进行的，若一次迁移太多的entry会导致主进程阻塞，直至完成rehash后才能处理新命令。

因此，Dict的rehash并不是一次性完成的，如果entry太多，rehash就可能导致主进程阻塞，因此实际Dict的rehash是分多次、渐进式的完成，因此称为**渐进式rehash**。渐进式rehash相比rehash的流程变化：

计算新hash表的realeSize，值取决于当前要做的是扩容还是收缩：

如果是扩容，则新size为第一个大于等于dict.ht[0].used + 1的2^n

如果是收缩，则新size为第一个小于等于dict.ht[0].used的2^n（不得小于4）

按照新的realeSize申请内存空间，创建dictht，并赋值给dict.ht[1]

设置dict.rehashidx = 0，标示开始rehash

*~~将dict.ht[0]中的每一个dictEntry都rehash到dict.ht[1]~~*

每次执行增删改查时，都检查一下 dict.rehashidx 是否大于-1，如果是则将dict.ht[0].table[rehashidx]的entryl链表rehash到dict.ht[1]，并且将rehashidx++，直至dict.ht[0]的所有数据都rehash到dict.ht[1]

将dict.ht[1]赋值给dict.ht[0]，给dict.ht[1]初始化为空哈希表，释放原来的dict.ht[0]的内存

将rehashidx赋值为-1，代表rehash结束

在rehash过程中，新增操作，则直接写入ht[1]，查询、修改和删除由于不确定数据在dict.ht[0]还是dict.ht[1]，会在dict.ht[0]和dict.ht[1]依次查找并执行命令，这样可以确保ht[0]的数据只减不增，随着rehash最终为空

## 4.ZipList

### 4.1 ziplist结构

dict由数组 + 单向链表实现，数据存储不连续，需要使用指针相互关联，这种方式主要问题是内存浪费，容易产生内存碎片，而且指针本身也需要字节空间。

ziplist是一种压缩存储结构，用于存储字符串或整数，它使用一系列特殊编码的连续内存块存储数据，可以把它看做特殊的双端链表（类似数组，但是每个节点长度不一致）。ziplist需要通过记录结点长度来推算出前后节点的位置，它可以在任一端进行压入/弹出操作，并且该操作时间复杂度为O(1)。

ziplist结构如下：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image161.png" alt="image161.png"></div>

zlbytes：类型uint32_t，长度4 字节，记录整个压缩列表占用的内存字节数

zltail：类型uint32_t，长度4 字节，记录压缩列表表尾节点距离压缩列表的起始地址有多少字节，通过这个偏移量，可以确定表尾节点的地址

zllen：类型uint16_t，长度2 字节，记录了压缩列表包含的节点数量。最大值为UINT16-MAX（65534），如果超过这个值，此处会记录为65535，但节点的真实数量需要遍历整个压缩列表才能计算得出

entry：压缩列表包含的各个节点，节点的长度由节点保存的内容决定，长度不定

zlend：类型uint8_t，长度1 字节，特殊值0xFF（十进制255），用于标记这是压缩列表的末端

### 4.2 ZipListEntry结构

ZipList 中的Entry并不像普通链表那样记录前后节点的指针，因为记录两个指针要占用16个字节，浪费内存。而是采用了下面的结构：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image162.png" alt="image162.png"></div>

previous_entry_length：前一个节点的长度，占1个或5个字节

如果前一节点的长度小于254字节，则采用1个字节来保存这个长度值

如果前一节点的长度大于254字节，则采用5个字节来保存这个长度值，第一个字节为0xfe，后四个字节才是真实长度数据

encoding：编码属性，记录content的数据类型（字符串还是整数）以及长度，占用1个、2个或5个字节

contents：负责保存节点的数据，可以是字符串或整数

要获得下一节点的地址，只需用 当前节点的地址 + entry 的长度即可；

要获得前一结点的地址，只需用 当前节点的地址 - previous_entry_length 即可；

ZipList中所有存储长度的数值均采用**小端字节序**，即低位字节在前，高位字节在后。例如：数值0x1234，采用小端字节序后实际存储值为：0x3412（十六进制两位对应一个字节）；

如果列表数据过多，导致链表过长，查询中间的某个数据时要经过多次计算寻址，可能影响查询性能。

### 4.3 Encoding编码

ZipListEntry中的encoding编码分为字符串和整数两种：

**字符串**：如果encoding是以“00”、“01”或者“10”开头，则证明content是字符串

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image163.png" alt="image163.png"></div>

例如依次存储“ab”和“bc”，previous_entry_length = 0，对应二进制00000000，“a”和“b”的UTF-8编码分别是97、98，即01100001、01100010，“ab”长度为2bytes，所以采用00xxxxxx，对应encoding是00000010，所以ab的entry为：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image164.png" alt="image164.png"></div>

"bc"类似，所以插入“ab”和“bc”后最终ziplist结构为：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image165.png" alt="image165.png"></div>

**整数**：如果encoding是以“11”开始，则证明content是整数，且encoding固定只占用1个字节

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image166.png" alt="image166.png"></div>

整数的数据类型只有byte、short、int、long，对应的数据分别为1、2、4、8个字节，所以整数只要确定了类型，其content的长度就确定了，所以整数编码无需保存content的长度。

为了更加节省空间，将剩下的1111xxxx中后四位用来存放代替content存放数据，由于0000和1110已经被使用，所以这四位只能存放0001~1101范围的数据，减一后结果为实际值，这样在0~12范围内的整数不再需要content。

例如，一个ZipList中包含两个整数值："2"和"5"，其Entry结构和整个ZipList结构如下：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image167.png" alt="image167.png"></div>

### 4.4 连锁更新问题

ZipList的每个Entry都包含previous_entry_length字段来记录上一个节点的大小。这个字段的长度是1个或5个字节：

如果前一节点的长度小于254字节，则采用1个字节来保存这个长度值

如果前一节点的长度大于等于254字节，则采用5个字节来保存这个长度值，其中第一个字节为0xfe，后四个字节才是真实长度数据

假设有N个连续的、长度为250~253字节之间的entry，因此entry的previous_entry_length属性用1个字节即可表示，如图所示：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image168.png" alt="image168.png"></div>

若此时在表头插入一个长度为254字节的entry，原来表头entry的previous_entry_length就要从1个字节变为5个字节，那么这个entry的长度就变成254字节。原来第二个entry为了记录前面entry的长度，它的previous_entry_length也要从1个字节变为5个字节，它的长度也变成254字节，又会引起后面一个entry的previous_entry_length变大...：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image169.png" alt="image169.png"></div>

ZipList这种特殊情况下产生的连续多次空间扩展操作称之为连锁更新。新增、删除都可能导致连锁更新，但是连锁更新发生概率很低，所以不用在意。

如果接受不了连锁更新，可以更新Redis到7.0以上版本，在Redis 5版本中，引入了ZipList的替代版本ListPack。ListPack移除了prevlen字段，采用了不同的结构来存储数据，Redis 5只是将ListPack用于Stream，从7.0以后才全面替代 ZipList，从而解决了连锁更新的问题。

总结下来，ZipList具有以下特性：

压缩列表的可以看做一种连续内存空间的"双向链表"

列表的节点之间不是通过指针连接，而是记录上一节点和本节点长度来寻址，内存占用较低

如果列表数据过多，导致链表过长，可能影响查询性能

增或删较大数据时有可能发生连续更新问题

## 5.QuickList

由于ZipList申请的内存必须是连续的，如果内存占用较大，申请效率会很低，所以需要限制ZipList的长度和entry大小，若要存储大量数据，超出ZipList最佳上限，就需要使用多个ZipList分片存储数据，这时就要一个数据结构用来管理这些ZipList分片，QuickList就是用来管理多个ZipList，保证他们之间联系的数据结构。

QuickList是Redis3.2引入的数据结构，它是一个双端链表，只不过链表中的每个节点都是一个ZipList。QuickList结合了ZipList和双向链表的优点，旨在提供高效的内存利用率和快速的插入、删除操作，其结构如下：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image170.png" alt="image170.png"></div>

为了避免QuickList中的每个ZipList的entry过多，Redis提供了配置项list-max-ziplist-size来限制：

正值代表ZipList的允许的entry个数的最大值

负值代表ZipList的最大内存大小，分5种情况：

-1：每个ZipList的内存占用不能超过4kb

-2：每个ZipList的内存占用不能超过8kb

-3：每个ZipList的内存占用不能超过16kb

-4：每个ZipList的内存占用不能超过32kb

-5：每个ZipList的内存占用不能超过64kb

可以通过config get|set list-max-ziplist-size查看或临时修改list-max-ziplist-size，也可以在配置文件中修改，默认值是 -2

除了控制ZipList的大小，QuickList还可以对节点的ZipList做压缩，通过配置项list-compress-depth来控制：

0：特殊值，代表不压缩

1：标示QuickList的首尾各有1个节点不压缩，中间节点压缩

2：标示QuickList的首尾各有2个节点不压缩，中间节点压缩

......以此类推

同样通过config get|set list-compress-depth查看或临时修改list-max-ziplist-size，也可以在配置文件中修改，默认值是 0

QuickList和QuickListNode的结构源码：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image171.png" alt="image171.png"></div>

QuickList和QuickListNode的结构内存图：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image172.png" alt="image172.png"></div>

*当向QuickList中插入1个元素时，Redis会根据一定的策略选择一个合适的quicklistNode，并将元素插入到该节点中。如果插入操作导致quicklistNode中的元素数量超过了一定的阈值（由list-max-ziplist-size参数决定），Redis会将该节点拆分成两个节点。同样，如果删除操作导致quicklistNode中的元素数量过少，Redis会将相邻的两个节点合并成一个节点。*

总结下来，QuickList的特点如下：

是一个节点为ZipList的双端链表

节点采用ZipList，解决了传统链表的内存占用问题

控制了ZipList大小，解决连续内存空间申请效率问题

中间节点可以压缩，进一步节省了内存

## 6.SkipList

SkipList即跳表，是为了解决有序集合的高效查找、插入和删除操作而设计的，它结合了平衡树和链表的优点，既保持了数据的有序性，又提供了快速的访问速度。

SkipList首先是链表，但与传统链表相比有几点差异：

元素按照升序排列存储

节点可能包含多个指针，指针跨度不同（多级指针）

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image173.png" alt="image173.png"></div>

SkipList结构定义如下：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image174.png" alt="image174.png"></div>

ele：结点的值，类型是动态字符串

score：结点的分数，按分数对结点升序排列存储，用于排序和查找

*backward：前一个结点的指针

level[]：多级索引数组，每个结点包含的指针数量不确定，首节点的最多，中间节点的较少，故用数组保存；这些指针分布在不同的层级上，用于实现多级索引；每个指针包括指向下一节点的指针和该指针的跨度

SkipList内存结构：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image175.png" alt="image175.png"></div>

**查找操作**：

从最高层开始，通过前进指针逐层向下查找

如果当前节点的下一个节点的值小于要查找的值，则向右移动；如果大于要查找的值，则向下移动

重复上述过程，直到找到目标节点或确定目标节点不存在

**插入操作**：

首先进行查找操作，找到插入位置

随机生成一个层数，根据这个层数在每一层插入新节点

更新相关节点的前进指针和跨度

*SkipList的一个关键特性是它允许节点在不同的层级上存在。为了确定新节点的层级，通常会使用一个概率模型来随机选择。例如，可以设置一个预设值p（通常是一个小于1的常数），然后生成一个0到1之间的随机数。如果这个随机数小于p，就将节点的层数加1，直到达到一个预设的最大层数或者随机数不再小于p为止。这个过程确保了节点层级的随机性，从而有助于保持SkipList的平衡性。*

**删除操作**：

首先进行查找操作，找到要删除的节点

然后在每一层删除这个节点，并调整相关节点的前进指针和跨度

总结下来，SkipList的特点：

跳跃表是一个双向链表，每个节点都包含score和ele值

节点按照score值排序，score值一样则按照ele字典排序

每个节点都可以包含多层指针，层数是1到32之间的随机数

不同层指针到下一个节点的跨度不同，层级越高，跨度越大

增删改查效率与红黑树基本一致，实现却更简单

## 7.RedisObject

Redis中的所有数据都是以key-value的形式存放的，存放一个key-value结构需要存储三个内容，key、value、key和value的映射关系，key使用一个存储结构SDS动态字符串就足够了，映射关系通过dict字典维护，但是value包含5种基本的类型（string、list、hash、set、sortedset），为了在同⼀个dict内能够存储不同类型的value，需要一个通用的数据类型，这就是**redisObject**，简写为robj，Redis中所有value都被存储为redisObject类型。

redisObject的结构源码：

```c
typedef struct redisObject {
unsigned type:4; // 数据类型，如字符串、列表、哈希等
unsigned encoding:4; // 编码方式，如int、raw、hashtable等
unsigned lru:LRU_BITS; // Least Recently Used，用于记录对象最近被访问的时间
int refcount; // 引用计数，用于自动内存管理
void *ptr; // 指向实际存储数据的指针
} robj;
```

type：表示数据对象的类型，用4bit位表示，对应着Redis的五基本数据类型，string、hash、list、set和zset

```c
#define OBJ_STRING 0
#define OBJ_LIST 1
#define OBJ_SET 2
#define OBJ_ZSET 3
#define OBJ_HASH 4
```

encoding：底层编码方式，共有11种，占4个bit位，不同的编码方式对应不同的存储结构

lru：记录对象最近被访问的时间，占用24个bit位，用于实现LRU策略（最近最少使用策略）的内存淘汰

refcount：对象引用计数器，通常占用4个字节，用于自动内存管理。当引用计数为0时，表示对象可以被释放。Redis通过引用计数来管理内存，避免内存泄漏

ptr：指向实际存储数据的指针，根据不同的数据类型和编码方式，指向不同的数据结构，32位系统占用4字节，64位系统占用8字节

*64位系统一个redisObject的头信息占用（4 + 4）/ 8 + 24 / 8 + 4 + 8 = 16字节，如果有n个字符串要存储，每个字符串都采用string类型存储，会造成大量空间浪费在头信息上，若采用List集合存储这些字符串，一个redisObject就可以，所以，当有大量数据存储时，尽量选择集合类型进行存储，避免内存浪费*

Redis中会根据存储的数据类型不同，选择不同的编码方式，共包含11种不同类型：

|        |                           |               |
| ------ | ------------------------- | ------------- |
| **编号** | **编码方式**                  | **说明**        |
| 0      | OBJ_ENCODING_RAW        | raw编码动态字符串    |
| 1      | OBJ_ENCODING_INT        | long类型的整数的字符串 |
| 2      | OBJ_ENCODING_HT         | hash表（字典dict） |
| 3      | OBJ_ENCODING_ZIPMAP     | 已废弃           |
| 4      | OBJ_ENCODING_LINKEDLIST | 双端链表          |
| 5      | OBJ_ENCODING_ZIPLIST    | 压缩列表          |
| 6      | OBJ_ENCODING_INTSET     | 整数集合          |
| 7      | OBJ_ENCODING_SKIPLIST   | 跳表            |
| 8      | OBJ_ENCODING_EMBSTR     | embstr的动态字符串  |
| 9      | OBJ_ENCODING_QUICKLIST  | 快速列表          |
| 10     | OBJ_ENCODING_STREAM     | Stream流       |

Redis有五种基本的数据类型，每种数据类型的使用的编码方式如下：

|             |                                            |
| ----------- | ------------------------------------------ |
| **数据类型**    | **编码方式**                                   |
| OBJ_STRING | int、embstr、raw                             |
| OBJ_LIST   | LinkedList和ZipList(3.2以前)、QuickList（3.2以后） |
| OBJ_SET    | intset、HT                                  |
| OBJ_ZSET   | ZipList、HT、SkipList                        |
| OBJ_HASH   | ZipList、HT                                 |

RedisObject的作用：

统一对象管理：为Redis中的各种数据类型提供统一的接口，使得Redis能够以一致的方式处理不同类型的数据

内存优化：通过引用计数和LRU机制，实现了自动内存管理和淘汰策略，有效地节省了内存空间，提高了内存利用率

操作一致性：为不同类型的数据提供了统一的操作接口，如获取对象类型、编码方式、值等，保证了操作的一致性

Redis底层数据结构包括SDS、IntSet、Dict、ZipList、QuickList、SkipList，RedisObject对这些底层数据结构进行抽象和封装，其中ptr字段指向实际存储数据的指针，数据的结构由type和encoding共同决定，例如一个RedisObject的type属性为OBJ_LIST，encoding属性为OBJ_ENCODING_QUICKLIST，那么代表的就是一个List，它的值保存在QuickList数据结构，而ptr指针就指向QuickList的对象。

## 8.五种不同的数据类型

### 8.1 String类型

String是Redis中最常见的数据存储类型：

基本编码方式是**RAW**，基于简单动态字符串（SDS）实现，存储上限为512mb

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image176.png" alt="image176.png"></div>

如果存储的SDS长度小于44字节，则会采用**EMBSTR**编码，此时RedisObject对象头和SDS是一段连续空间，申请内存时只需要调用一次内存分配函数，效率更高

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image177.png" alt="image177.png"></div>

为什么是44字节？SDS头信息中len、alloc、flags各占一字节，字符结束符0占一字节，字符串内容44字节，整个SDS共占48字节，RedisObject头信息共占16字节，加起来是64字节，Redis中jemalloc是默认的内存分配器，Jemalloc会为不同大小的内存请求分配固定大小的块（这些块的大小通常是2的幂次），在分配内存时会尽量满足内存对齐的要求，以减少由于频繁的内存分配和释放操作导致的内存碎片。64字节刚好是Jemalloc的一个内存分配单位，能把这些数据存储在一个连续的内存块中而不产生内存碎片。

当存储的字符串是整数值，并且大小在LONG_MAX范围内，则会采用**INT**编码，直接将数据保存在RedisObject的ptr指针位置，不再需要SDS：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image178.png" alt="image178.png"></div>

如果整数值超过了LONG_MAX的范围，就会使用**ROW**编码方式，把整数当成字符串存储

最后看一下RAW、EMBSTR、INT三种编码对比加深印象：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image179.png" alt="image179.png"></div>

### 8.2 List类型

Redis的List类型需要从首、尾操作列表中的元素，而且支持根据索引查询，哪个数据结构满足这些要求？

LinkedList ：普通链表，可以从双端访问，内存占用较高，内存碎片较多

ZipList ：压缩列表，可以从双端访问，内存占用低，存储上限低

QuickList：LinkedList + ZipList，可以从双端访问，内存占用较低，包含多个ZipList，存储上限高

在3.2版本之前：Redis采用**ZipList和LinkedList**来实现List，当元素数量小于512并且元素大小小于64字节时采用**ZipList**编码，超过则采用LinkedList编码。

在3.2版本之后：Redis统一采用**QuickList**来实现List：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image180.png" alt="image180.png"></div>

### 8.3 Set类型

Set是Redis中的单列集合，满足下列特点：

不保证有序性

保证元素唯一（需要判断元素是否存在）

求交集、并集、差集

进行集合的操作要查询集合确定重复元素，保证元素唯一也需要查询集合确定是否存在，可以看到，Set集合对查询性能要求很高，很容易考虑到HashTable，对应Dict：

为了查询效率和唯一性，Set采用**HT编码**（Dict）。Dict中的key用来存储元素，value统一为null

当存储的所有数据都是整数，并且元素数量不超过set-max-intset-entries时，Set会采用**IntSet编码**，以节省内存

set-max-intset-entries可以在配置文件中设置，默认为512

当第一次向set中添加元素时会创建新的set，会根据元素的值来决定采用什么编码，创建什么结构来存储？

如果该字符是数值类型，会采用IntSet编码，并创建IntSet存储元素

如果该字符不是数值类型，则会采用HT编码，创建Dict存储元素

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image181.png" alt="image181.png"></div>

在向set插入元素过程中（非第一次插入）：

若原来的编码类型是HT，则直接插入

若当前的编码是IntSet，需要进行判断。当目前插入的元素不是数值类型或者该元素是数值类型，但成功插入后Set中的元素个数超过了设定值时，该Set的编码会从IntSet切换为HT，并使用Dict存储当前IntSet中的值。若这两个条件都不满足，则继续在原来的IntSet中存储新元素。

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image182.png" alt="image182.png"></div>

通过内存图来理解IntSet编码切换为HT编码：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image183.png" alt="image183.png"></div>

### 8.4 ZSet类型

ZSet也就是SortedSet，其中每一个元素都需要指定一个score值和member值：

可以根据score值排序

member必须唯一

可以根据member查询分数

因此，zset底层数据结构必须满足键值存储、键必须唯一、可排序，哪种编码结构可以满足？

SkipList：可排序，并且可以同时存储score和ele值（member），但无法保证键的唯一性，也无法快速根据member找score（只能遍历）

HT（Dict）：可以键值存储，并且可以根据key找value，但无法排序

Zset底层同时使用了这两种编码结构，结合它们的功能满足Zset的需要，ZSet的结构定义如下，在创建ZsetObject对象时，先创建了Zset对象，再为Zset对象创建了Dict和SkipList，并将编码方式设置为**OBJ_ENCODING_SKIPLIST**：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image184.png" alt="image184.png"></div>

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image185.png" alt="image185.png"></div>

当元素数量不多时，HT和SkipList的优势不明显，而且更耗内存，同一份数据存储了两份。因此zset还会采用**ZipList**结构来节省内存，不过需要同时满足两个条件：

元素数量小于zset_max_ziplist_entries，默认值128

每个元素都小于zset_max_ziplist_value字节，默认值64

但是ziplist本身没有排序功能，而且没有键值对的概念，因此需要通过逻辑编码实现：

ZipList是连续内存，因此score和element是紧挨在一起的两个entry，element在前，score在后

score越小越接近队首，score越大越接近队尾，按照score值升序排列

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image186.png" alt="image186.png"></div>

**ZipList实现ZSet源码分析**：

创建Zset：在zadd添加元素时，先根据key找到zset，不存在则创建新的zset。创建时判断配置文件中zset_max_ziplist_entries值是否为0，设置为0就是禁用了zipList，或者value大小超过了zset_max_ziplist_value，此时采用HT和SKipList结合方案，否则采用ZipList：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image187.png" alt="image187.png"></div>

向Zset中添加元素时，首先判断编码方式，若本身是SKIPLIST编码，无序转换。否则，可能存在编码转换的可能：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image188.png" alt="image188.png"></div>

### 8.5 Hash类型

Redis中的Hash结构与Zset非常类似：键值存储、根据键获取值、键唯一，区别如下：

zset的键是member，值是score；hash的键和值都是任意值

zset要根据score排序；hash则无需排序

所以Hash底层采用的编码与Zset也基本一 致，只是没有SkipList。

Hash结构默认采用**ZipList**编码，用以节省内存，ZipList中相邻的两个entry分别保存field和value：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image189.png" alt="image189.png"></div>

当数据量较大时，Hash结构会转为**HT编码**，也就是Dict，触发条件有两种：

ZipList中的元素数量超过了hash-max-ziplist-entries（默认512）

ZipList中的任意entry大小超过了hash-max-ziplist-value（默认64字节）

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image190.png" alt="image190.png"></div>

**源码分析**：

创建Hash结构时默认采用ZipList编码，由于存在两种编码格式，在添加元素时可能会发生格式转换：

<div class="img-wrap-left"><img class="left-img" src="/assets/img/redis/6/image191.png" alt="image191.png"></div>
