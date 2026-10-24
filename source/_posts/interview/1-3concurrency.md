---
title: 1-3  并发编程 并发编程连环问
date: 2026-10-23 13:00:00
categories:
  - interview
tags:
  - interview
---
<div class="essay-image ">
    Java 并发全套连环问（线程安全、synchronized vs Lock、乐观悲观锁、线程池、线程池耗尽、死锁）
</div>

## 第 1-3 题　Java 并发全套连环问（线程安全、synchronized vs Lock、乐观悲观锁、线程池、线程池耗尽、死锁）

**候选人浅层回答：** 

加锁就能保证线程安全；线程池调大参数就能扛住流量；死锁避开就行。

## 核心拆解一句话结论

并发问题的一切现象都能归到原子性、可见性、有序性三条根因上；解决手段按成本从低到高是「无锁 → 悲观锁 → 资源隔离」，线程池与死锁是这套体系的工程落地与事故面。

## 一、线程安全表现、解决手段

线程安全问题三大根源：原子性、可见性、有序性被破坏；对应的现象：

1. 原子性破坏：计数错乱、金额扣减不对（i++）；
2. 可见性破坏：一个线程修改变量，其他线程一直读到旧值（缓存、寄存器）；
3. 有序性破坏：指令重排，出现意料之外的执行顺序（DCL 双重检查锁经典坑）。

解决思路（不是只有加锁）：

1. 无锁方案（优先）
   - 不可变对象（final）、线程私有（ThreadLocal）；
   - CAS：Atomic 系列、LongAdder（乐观锁）。
2. 锁方案
   - synchronized（内置锁、悲观）；
   - ReentrantLock（显式 Lock、悲观）。
3. 工具类：CountDownLatch、Semaphore、CyclicBarrier。
4. 并发容器：ConcurrentHashMap、CopyOnWriteArrayList，避开同步容器 Hashtable。

原则：优先无锁、隔离；锁是兜底，锁会带来竞争、阻塞、死锁风险。

## 二、synchronized 和 ReentrantLock 本质区别

1. **底层实现**：synchronized 是 JVM 内置，靠对象头 MarkWord，锁状态偏向锁 → 轻量级锁 → 重量级锁自动升级，解锁自动释放；ReentrantLock 基于 AQS 队列同步器，在 Java 代码层面实现。
2. **可中断**：synchronized 阻塞之后不可中断；Lock 的 lockInterruptibly() 支持中断等待。
3. **公平锁**：synchronized 只能非公平；Lock 支持公平 / 非公平自选。
4. **条件队列**：synchronized 只有一个 wait 队列；Lock 可以多个 Condition，精准唤醒，避免「叫醒错人」。
5. **释放**：synchronized 代码块结束 / 异常自动释放；Lock 必须手动 unlock()，一般放在 finally，忘记释放直接死锁。
6. **可重入**：两者都支持可重入。

一句话总结：synchronized 简单省心，Lock 能力更强、粒度更灵活，代价是手动管理。

## 三、乐观锁、悲观锁，适用场景

- 悲观锁：默认一定会发生竞争，访问前先上锁，阻塞其他线程。代表：synchronized、ReentrantLock、数据库 select ... for update。适合写多、竞争激烈、冲突概率很高的场景。
- 乐观锁：默认竞争很少，不上锁；修改时校验版本，失败重试。代表：CAS、版本号 version、时间戳。适合读多写少、冲突概率低；冲突多了重试风暴，不适合。

注意：CAS 有 ABA 问题，要用版本号、AtomicStampedReference 解决。

## 四、线程池七大参数、拒绝策略选型
七大参数：

1. corePoolSize：核心线程数，创建后常驻（默认空闲不回收；若设置 allowCoreThreadTimeOut=true，核心线程空闲超时也会被回收）；
2. maximumPoolSize：最大线程数；
3. keepAliveTime：非核心线程空闲存活时间；
4. unit：时间单位；
5. workQueue：阻塞队列，存放待执行任务；
6. threadFactory：线程工厂，自定义线程名、优先级，方便排查；
7. handler：拒绝策略。

4 种拒绝策略：

1. AbortPolicy（默认）：抛 RejectedExecutionException，业务感知明显；适合核心任务，不能静默丢失；
2. DiscardPolicy：直接丢任务，无异常；不推荐，丢任务无感知；
3. DiscardOldestPolicy：丢掉队列最老任务，放新任务；适合非核心、可丢弃的消息；
4. CallerRunsPolicy：交给提交任务的调用线程自己跑；削峰，减缓提交速度；适合允许主线程变慢、不能丢任务。

生产禁止直接用 Executors 快捷创建（无界队列 / OOM 风险），必须手动 new ThreadPoolExecutor。

线程池参数配置思路分两类：

1. CPU 密集（计算为主）：核心≈CPU 核心数 + 1，队列短；避免大量上下文切换；
2. IO 密集（DB、RPC、Redis 等待）：核心数可以给到 2~4×CPU 核；大量时间线程在等待、CPU 空闲，可以多开线程。

不要无脑调大 maxPoolSize，线程太多会上下文切换爆炸、OOM、打满下游连接。

## 五、线上线程池耗尽：排查 + 除了调大参数之外的优化
排查步骤：

1. 先看监控：线程池活跃线程、队列堆积、拒绝次数；
2. jstack 导出线程栈，看线程卡在什么地方：RPC 超时、DB 慢查询、锁等待、外部接口阻塞；
3. 区分：是任务来得太快，还是任务执行太慢卡住。

优化（重点：调大线程数只是临时应急，不是根治）：

1. 给阻塞调用加超时：RPC、HTTP、数据库必须设置超时，防止线程永久卡死；
2. 任务拆分、异步解耦：耗时任务丢 MQ 异步，不进同步线程池；
3. 资源隔离：不同业务、不同下游单独线程池，避免一个下游拖垮全部；
4. 限流：入口限流，控制任务流入速度；
5. 优化慢任务：索引、缓存，减少执行耗时；
6. 队列监控告警，堆积提前告警，而不是等耗尽；
7. 业务上做降级，非核心任务直接丢弃。

## 六、死锁：定位步骤、规避方案
死锁 4 必要条件（全部满足才会死锁）：互斥、持有并等待、不可剥夺、循环等待。打破任意一个即可。

定位步骤：

1. jps 拿到进程 pid；
2. jstack pid 打印线程栈；
3. 搜索 Found one Java-level deadlock，直接输出死锁线程、锁顺序；
4. 看两个线程各自持有的锁、等待的锁，定位代码位置。

规避方案（工程上最实用）：

1. 统一锁获取顺序（最有效），所有线程都按固定顺序拿锁，杜绝循环等待；
2. 加锁超时：tryLock(timeout)，拿不到直接放弃，避免永久阻塞；
3. 降低锁粒度，少同时持有多把锁；
4. 避免嵌套锁；
5. 不在线程持有锁的情况下调用外部未知方法、RPC。

## 连环追问要点整理

1. 线程安全到底在解决什么问题？
   - 原子性、可见性、有序性三条；现象是计数错乱、读到旧值、重排导致异常结果。
2. synchronized 和 ReentrantLock 怎么选？
   - 简单短临界区用 synchronized；需要超时、中断、公平锁、多条件唤醒用 Lock，并务必在 finally 释放。
3. 乐观锁和悲观锁怎么选？
   - 读多写少、冲突低用乐观锁（注意 ABA），写竞争激烈用悲观锁。
4. 线程池参数怎么定？
   - CPU 密集核心≈核数+1、队列短；IO 密集核心可到 2~4× 核数；按业务取舍拒绝策略，禁用 Executors。
5. 线程池耗尽先做什么？
   - 先 jstack 看线程卡在哪，再补超时、做隔离、限流、异步化，而不是先调大参数。
6. 死锁怎么根治？
   - 统一锁顺序最有效，其次 tryLock 超时、降低锁粒度、避免嵌套。

线程池创建与死锁排查:
```java
// 手动创建线程池：有界队列 + 命名线程工厂 + 明确拒绝策略
ThreadPoolExecutor pool = new ThreadPoolExecutor(
    8, 32,
    60L, TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(200),
    new ThreadFactoryBuilder().setNameFormat("order-pool-%d").build(),
    new ThreadPoolExecutor.CallerRunsPolicy());

// 死锁排查：先拿 pid，再导出线程栈
// jps -l
// jstack <pid> | grep -A 30 "Found one Java-level deadlock"

// 加锁超时，避免永久阻塞
if (lock.tryLock(500, TimeUnit.MILLISECONDS)) {
    try { doBusiness(); } finally { lock.unlock(); }
}
```

## 面试回答完整话术
  - 线程安全本质是原子性、可见性、有序性问题；现象是数据错乱、读到脏数据、诡异重排结果。优先用无锁方案：不可变、ThreadLocal、CAS；竞争高的时候再用悲观锁。
  - synchronized 是 JVM 内置锁，自动释放，能力简单；ReentrantLock 基于 AQS，可以中断、公平锁、多条件队列，但是必须手动 unlock。乐观锁适合读多写少、冲突低；悲观锁适合写竞争激烈的场景，CAS 要注意 ABA。
  - 线程池七大参数核心是核心线程、最大线程、阻塞队列、拒绝策略；CPU 密集少线程，IO 密集可以适当放大；拒绝策略按业务取舍，核心任务优先 Abort，削峰用 CallerRuns。生产不要用 Executors。
  - 线程池耗尽优先排查任务阻塞：RPC、DB 有没有超时，而不是盲目调大线程数；优化手段是超时控制、资源隔离、限流、异步 MQ、慢 SQL 优化。
  - 死锁四个条件，排查用 jstack；工程上最好的办法就是统一锁顺序，其次 tryLock 超时，尽量不要嵌套多锁。

  设计取舍：把并发问题当「性能问题」去调参会越调越坏，真正的抓手是把不可控的等待（锁、阻塞调用）变成可控的超时与隔离。

## 追问：本题考察核心是什么？
  参考答案：
  初级开发只会逐个背锁的用法和线程池参数，串不起「三条根因 → 无锁优先 → 锁兜底 → 资源隔离」的主线，遇到线程池耗尽第一反应是调大参数。

###  高级工程师要分清：
  1. 能把现象映射回原子性、可见性、有序性三条根因；
  2. 清楚 synchronized 与 Lock 的能力边界与释放风险；
  3. 线程池参数是取舍逻辑，不是套公式；
  4. 线程池耗尽先定位阻塞点，再做超时、隔离、限流、异步化；
  5. 死锁用统一锁顺序 + tryLock 超时双保险。
  核心思想：并发的稳定性来自「减少共享、减少等待、等待必超时」，而不是加更多锁、调更大池。

<div class="img-wrap-left">
    <img class="left-img" src="/assets/img/interview/1-3concurrency.png" alt="答题要点结构图">
</div>
