---
title: Redis-网络模型
date: 2025-09-07 01:00:00
categories:
  - database
tags:
  - redis
---
<div class="essay-banner essay-image4"></div>

# 七、Redis网络模型

## 1.用户空间和内核空间

ubuntu和Centos都是Linux的发行版，发行版可以看成对linux包了一层壳，任何Linux发行版，其系统内核都是Linux。

Redis、MySQL等用户应用无法直接执行访问系统硬件，需要通过发行版的这个壳子访问内核，再通过内核访问计算机硬件。

计算机硬件包括CPU、内存、网卡等，内核通过寻址空间可以操作硬件，但是内核需要不同设备的**驱动**，有了这些驱动后就可以对计算机硬件进行内存管理，文件系统管理，进程管理等等。

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image192.png" alt="image192.png"></div>

用户应用想要访问计算机硬件，计算机就必须对外暴露的一些**接口**才能访问到，从而间接实现对内核的操控，但是内核本身也是一个应用，也需要一些内存、CPU等设备资源，用户应用也在消耗这些资源。为了避免了用户程序随意操作系统资源，错误或恶意执行危险指令（如清空内存、修改时钟），就需要把用户和内核隔离开。所以进程的寻址空间被划分成**内核空间**和**用户空间**，也就是内核态和用户态。

用户空间和内核空间都无法直接访问物理内存，而是通过分配**虚拟内存**映射到物理内存，通过虚拟内存可以将内核空间与用户空间隔离开来，避免用户程序错误地或恶意地访问内核空间。在32位Linux操作系统中，虚拟内存空间大小为 4GB，高位的1G空间作为内核空间，低位的3G空间作为用户空间。

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image193.png" alt="image193.png"></div>

在linux中权限分成两个等级，0和3，用户空间只能执行受限的命令（Ring3），不能直接调用系统资源，必须通过内核提供的接口来访问。内核空间可以执行特权命令（Ring0），调用一切系统资源。一般情况下，用户操作运行在用户空间，内核运行的数据在内核空间，而有些情况下，应用程序需要调用一些特权资源，去调用一些内核空间的操作，此时需要在用户态和内核态之间进行切换。

## 2.Linux IO模型

Linux系统为了提高IO效率，会在用户空间和内核空间都加入缓冲区：

写数据时，把用户缓冲数据拷贝到内核缓冲区，然后写入设备

读数据时，从设备读取数据到内核缓冲区，然后拷贝到用户缓冲区

用户读数据时，向内核态申请读取内核的数据，而内核数据要等待驱动程序从硬件上读取数据，当从磁盘上加载到数据之后，内核会将数据写入到内核的缓冲区中，然后再将数据拷贝到用户态的缓冲区中，返回给应用程序：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image194.png" alt="image194.png"></div>

该过程主要的时间花费在用户等待数据就绪以及用户态和内核态数据缓冲区之间的数据拷贝。为了提高IO效率，Linux的五种不同的IO模型就是在等待数据就绪和读取数据这两个阶段做了不同的处理：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image195.png" alt="image195.png"></div>

五种IO模型：

阻塞IO（Blocking IO）

非阻塞IO（Nonblocking IO）

IO多路复用（IO Multiplexing）

信号驱动IO（Signal Driven IO）

异步IO（Asynchronous IO）

### 2.1 阻塞IO

阻塞IO分为两个阶段，数据从硬件读取到内核缓冲区 和 内核拷贝缓冲区数据到用户缓冲区，阻塞IO的这两个阶段都是阻塞的：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image196.png" alt="image196.png"></div>

当应用程序调用IO函数（如read或write）时，如果数据没有准备好，用户进程会被阻塞，直到数据准备好并被复制到应用程序的缓冲区中。在阻塞期间，进程无法执行其他任务，阻塞 IO 的阻塞期间不会占用 CPU 资源。

### 2.2 非阻塞IO

非阻塞IO的recvfrom操作会立即返回结果而不是阻塞用户进程，如果数据没有准备好，函数会立即返回一个错误码（如EWOULDBLOCK），表示当前没有数据可读或可写。用户程序需要不断轮询内核，检查数据是否准备好，这会导致CPU资源的浪费：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image197.png" alt="image197.png"></div>

非阻塞IO模型中，用户进程第一个阶段是非阻塞，第二个阶段是阻塞状态。虽然是非阻塞，但性能并没有得到提高。而且忙等机制会导致CPU空转，CPU使用率暴增。

### 2.3 IO多路复用

无论是阻塞IO还是非阻塞IO，用户应用在第一阶段都需要调用recvfrom获取数据，差别在于无数据时的处理方案：

如果调用recvfrom时，恰好没有数据，阻塞IO使CPU阻塞，非阻塞IO使CPU空转，都不能充分发挥CPU的作用

如果调用recvfrom时，恰好有数据，则用户进程可以直接进入第二阶段，读取并处理数据

比如服务端处理客户端Socket请求时，单线程情况下只能依次处理每一个socket，如果正在处理的socket恰好未就绪（数据不可读或不可写），线程就会被阻塞，所有其它客户端socket都必须等待，性能自然会很差。解决方式是利用单个线程监听多个socket，当socket就绪时用户应用再读取数据，监听过程线程处于休眠状态。

文件描述符：简称**FD**，是一个从0开始递增的无符号整数，用来关联Linux中的一个文件。在Linux中，一切皆文件，例如常规文件、视频、硬件设备等，当然也包括网络套接字socket。

**IO多路复用**是利用单个线程同时监听多个FD，并在某个FD可读、可写时得到通知，从而避免无效的等待，充分利用CPU资源

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image198.png" alt="image198.png"></div>

Linux系统监听FD的方式、通知的方式有多种实现，常见的有**select**、**poll**和**epoll**，它们是Linux提供的用于监听多个文件描述符状态的系统调用，这些系统调用允许程序将一组文件描述符注册到监听队列中，当其中任何一个文件描述符的状态发生变化时（如可读、可写或发生错误），系统调用会返回并通知应用程序。

### 2.3.1 select实现IO多路复用

select是Linux中最早的I/O多路复用实现方案，源码如下：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image199.png" alt="image199.png"></div>

数组fds_bits每个元素占用4 * 8 = 32个bit，数组长度为32，所以数组可以表示32 * 32 = 1024bit，其中每个比特位监听一个FD文件，将来要监听哪个FD，就把对应位置（自低位从1开始）比特为置为1，如1,2,5要监听对应的就是...00010011。

select方式进行IO多路复用的流程如下：

假设现在的IO都是读操作，创建fd_set rfds（rfds是readfds简写），初始时将所有比特位都置为零

假如要监听 fd = 1，2，5，将rfds中对应的比特位置为1

调用select函数（这里执行 select(5 + 1, rfds, null, null, 3) ）将这些fd信息拷贝到内核空间，内核负责对这些fd进行监听

内核遍历rfds，从最低位开始，到传入的最大值 nfds - 1 为止，判断这个范围内被标记的fd是否已经就绪

若当前没有就绪的fd，休眠等待数据就绪被唤醒或超时

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image200.png" alt="image200.png"></div>

当有fd就绪时，内核遍历rfds找到被监听的fd，将其与已就绪的fd比较，相同则保留，其余的fd置为0，之后内核将自己的rfds拷贝回用户空间的rfds，此时rfds中保存的是已就绪的fd，并且select函数返回已就绪fd的数量

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image201.png" alt="image201.png"></div>

最后用户进程遍历fd_set，找到就绪的fd，读取其中的数据

如果还有未就绪的fd或者其他数据，线程按照上述流程将要读取的fd添加到rfds中（一个fd可能循环拷贝多次）传到内核中进行监听，再次执行一次上述流程，循环往复处理读写数据请求。

select模式存在的问题：

需要将整个fd_set从用户空间拷贝到内核空间，select结束还要再次拷贝回用户空间

select无法得知具体是哪个fd就绪，需要遍历整个fd_set fd_set

监听的fd数量不能超过1024

### 2.3.2 poll实现IO多路复用

poll模式对select模式做了简单改进，但性能提升不明显，源码如下：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image202.png" alt="image202.png"></div>

poll方式实现IO多路复用的流程如下：

用户进程调用poll()函数：

用户进程通过调用poll()函数，将需要监听的fd及其关注的事件类型（如读就绪、写就绪等）传递给内核

传递给poll()函数的是一个pollfd结构体数组，每个结构体中包含了一个文件描述符和该文件描述符所关注的事件类型

内核处理poll()请求：

内核接收到poll()调用后，会将这些文件描述符和事件类型注册到内核内部的监听列表中（转链表存储，无上限）

内核会监视这些文件描述符的状态，当其中一个或多个文件描述符的事件就绪时，内核会进行相应的处理

内核通知用户进程：

当内核检测到某个fd的事件已经就绪时，它会修改该fd的pollfd结构体中的revents为已就绪，并将pollfd结构体数组从内核空间拷贝回用户空间，并返回就绪fd数量

用户进程处理就绪事件：

用户进程通过调用poll()函数，阻塞等待直到有文件描述符就绪或者超时

当poll()函数返回时，用户进程通过遍历pollfd结构体数组中的revents成员，可以得知哪些文件描述符的事件已经就绪，进而可以读取对应fd的数据

poll和select对比：

select模式中的fd_set大小固定为1024，而pollfd在内核中采用链表，理论上无上限

poll()函数在内核中是通过轮询方式来检查文件描述符的状态，监听FD越多，每次遍历消耗时间也越久，性能反而会下降

### 2.3.3 epoll实现IO多路复用

### epoll工作原理和实现流程

epoll是对select和poll的改进，能够显著减少数据复制的开销并提高系统资源的利用率，工作原理如下：

**事件驱动**：epoll采用事件通知机制，只有文件描述符FD有事件发生时（比如FD就绪）才会被通知，与select和poll的轮询机制相比，epoll避免了无效轮询，提高了处理效率

**数据结构**：epoll使用红黑树和就绪链表管理文件描述符FD，红黑树用于快速查找和管理注册的文件描述符，就绪列表则用于存储已经就绪的文件描述符

**回调机制**：epoll通过回调函数来通知用户进程文件描述符的事件状态，当事件发生时，内核会调用相应的回调函数，将事件信息添加到就绪链表中

epoll方式实现IO多路复用的流程如下：

epoll_create：在内核创建eventpoll结构体，返回对应的句柄epfd，即该eventpoll的唯一标识。每一个句柄epfd对应一个eventpoll

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image203.png" alt="image203.png"></div>

epoll_ctl：将一个FD添加到eventpoll的红黑树中并对其进行监听，但不会等待FD就绪，而是对该FD设置事件发生时的回调函数ep_poll_callback，当要监听的事件发生时，自动调用该回调函数，把对应的FD加入到就绪链表list_head中

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image204.png" alt="image204.png"></div>

epoll_wait：将FD添加到红黑树中后，调用epoll_wait 检查就绪链表是否为空，不为空则返回就绪的FD的数量，同时将就绪链表中的FD拷贝到用户空间的events数组中（只拷贝就绪的FD），如果epoll_wait为空就等待FD就绪

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image205.png" alt="image205.png"></div>

小总结：

select模式存在的三个问题：

能监听的FD最大不超过1024

每次select都需要把所有要监听的FD都拷贝到内核空间

每次都要遍历所有FD来判断就绪状态

poll模式的问题：

poll利用链表解决了select中监听FD上限的问题，但依然要遍历所有FD，如果监听较多，性能会下降

epoll模式中如何解决这些问题的？

基于epoll实例中的红黑树保存要监听的FD，理论上无上限，而且增删改查效率都非常高

每个FD只需要执行一次epoll_ctl添加到红黑树，以后每次epol_wait无需传递任何参数，无需重复拷贝FD到内核空间

利用ep_poll_callback机制来监听FD状态，无需遍历所有FD，因此性能不会随监听的FD数量增多而下降

### 事件通知机制

在IO多路复用中，事件通知机制主要有两种触发模式LT和ET，它们定义了当文件描述符上的事件发生时（如FD就绪），内核如何通知用户进程，并且用户进程应该如何处理这些事件：

水平触发LT：

工作原理：当FD有数据可读时，每次调用epoll_wait都会返回该事件（**会重复通知多次**），直至数据处理完成，是Epoll的默认模式

特点：LT模式相对简单直观，用户进程可以在每次调用epoll_wait时处理一部分数据，而不必担心遗漏事件，但如果事件处理不及时，可能会导致事件堆积，增加处理复杂度

边缘触发ET：

工作原理：当FD有数据可读时，**只会被通知一次**，不管数据是否处理完成，用户进程必须确保接收到通知后一次性处理完所有就绪的事件，否则可能会遗漏后续的事件

特点：ET模式要求用户进程对事件进行高效处理，以避免遗漏，通常与非阻塞IO结合使用，可以提高系统的吞吐量和响应速度，但实现起来相对复杂，需要用户进程仔细管理事件的处理逻辑

在epoll模式中，将就绪链表list_head中的FD拷贝到用户空间events数组之前，会先将就绪的FD从list_head移除，假设第一次没有拷贝完FD的数据，若采用LT模式拷贝完会将这些FD重新添加回list_head，若采用ET模式则不会添加回list_head。

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image206.png" alt="image206.png"></div>

例如：

假设一个客户端socket对应的FD已经注册到了epoll实例中

客户端socket发送了2kb的数据

服务端调用epoll_wait，得到通知说FD就绪

服务端从FD读取了1kb数据回到步骤3

再次调用epoll_wait，形成循环

若采用LT模式，因为FD中仍有1kb数据，第5步依然返回结果并得到通知

若采用ET模式，因为第3步已经消费了FD，第5步FD状态并没有变化，因此epoll_wait不会返回，数据无法读取，客户端响应超时

在实际应用中，应根据应用场景和需求选择LT模式还是ET模式：

LT模式适用于可以容忍一定延迟，但希望简化事件处理逻辑的应用场景

ET模式适用于需要高效处理大量并发事件，对延迟敏感的应用场景，如高性能网络服务器

### 基于epoll的服务器端流程

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image207.png" alt="image207.png"></div>

服务器启动时，在服务端调用epoll_create创建epoll实例，即在内核中创建红黑树（管理监听FD）和就绪链表（存储就绪FD）

创建serverSocket，得到一个服务端监听套接字的文件描述符，记为ssfd

ssfd专门用于监听客户端的连接请求，有客户端连接服务器时才会被唤醒

调用epoll_ctl将ssfd添加到红黑树中，并指定监听的事件类型（通常是读就绪事件EPOLLIN），同时注册FD就绪时的回调函数ep_poll_callback

进入事件循环，调用epoll_wait函数等待ssfd上有事件发生（其实就是等待有客户端连接服务器）

等待指定时间后若无事件发生（一段时间内无客户端连接服务器），则再次调用epoll_wait

当被监听的fd上有事件发生时（有客户端连接服务器），根据epoll_wait返回的事件类型，进行相应的处理

如果是读就绪事件EPOLLIN，判断是不是ssfd可读

如果ssfd发生读就绪事件，即有客户端进行连接，调用accpt()函数接收客户端socket，得到客户端socket的FD，并调用epoll_ctl为客户端socket添加监听

如果不是ssfd发生读就绪事件，即发生的是客户端socket的读就绪事件，代表客户端socket发送了命令，使用read()或recv()函数读取客户端发送的数据，进行处理后返回响应

如果客户端连接关闭或发生错误（EPOLLERR事件），则使用close()函数关闭客户端套接字，并从epoll树中删除这个客户端socket的FD

循环处理事件，重复步骤4-9，继续等待并处理下一个事件，直到服务器进程被终止

### 2.4 信号驱动IO

信号驱动IO允许用户进程通过注册一个 信号处理函数 来异步接收数据可用的通知。当设备数据可用时，内核会向用户进程发送一个SIGIO信号，触发用户进程预先注册的信号处理函数，进而执行相应的IO操作，期间用户应用可以执行其它业务，无需阻塞等待：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image208.png" alt="image208.png"></div>

与其他IO模型的比较：

与阻塞IO相比，信号驱动IO避免了用户进程在IO操作完成前的阻塞，提高了IO效率

与非阻塞IO相比，信号驱动IO不需要用户进程通过轮询方式不断尝试读写文件描述符，减少了CPU资源的浪费

与IO复用（select、poll、epoll）相比，信号驱动IO通过信号机制实现IO操作的异步通知，不需要进程主动调用轮询函数来检查IO状态

与异步IO相比，信号驱动IO仍然需要用户进程在信号处理函数中执行IO操作，而异步IO则完全由内核处理IO操作，并在完成后通知用户进程

当有大量IO操作时，信号较多，SIGIO处理函数不能及时处理可能导致信号队列溢出而且内核空间与用户空间的频繁信号交互性能也较低。

### 2.5 异步IO

异步IO的整个过程都是非阻塞的，用户进程调用完异步API后就可以去做其它事情，内核等待数据就绪并拷贝到用户空间后才会递交信号，通知用户进程：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image209.png" alt="image209.png"></div>

### 优点

高性能：异步IO能够在IO操作进行的同时，让CPU去执行其他任务，从而提高系统的整体性能

资源利用率高：异步IO可以让一个线程同时处理多个IO操作，避免了频繁的线程切换，从而提高了CPU和内存的利用率

提高响应速度：由于异步IO不需要等待IO操作完成，可以立即返回执行其他任务，因此可以提高系统的响应速度

高并发处理能力：异步IO可以处理大量的并发IO请求，使得系统能够更有效地处理多个IO操作

### 缺点

编程复杂度增加：异步编程模型相对于同步编程模型更加复杂，因为它涉及到事件循环、回调函数等概念，可能会增加代码的编写和维护成本

错误处理困难：异步编程中可能存在回调地狱(Callback Hell)等问题，导致代码难以理解和调试，容易出现逻辑错误和内存泄漏等问题

调试困难：异步程序中的事件顺序可能比较随机，因此在调试时可能会很难追踪代码的执行流程，特别是当存在大量异步操作时更加困难

资源竞争：如果异步操作涉及共享资源的读写，可能会导致资源竞争和数据一致性问题，需要额外的同步机制来解决

在IO操作中，同步和异步 与 阻塞和非阻塞没有直接关系。IO操作是同步还是异步，关键看数据在内核空间与用户空间的拷贝过程（数据读写的IO操作），也就是阶段二是同步还是异步：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image210.png" alt="image210.png"></div>

## 3.Redis网络模型

### 3.1 Redis为什么使用单线程

### Redis是单线程还是多线程？

Redis的核心业务部分（命令处理）使用的是单线程，但是整个Redis又使用多线程。

Redis版本迭代过程中在两个重要的时间节点上引入了多线程的支持：

Redis v4.0：引入多线程异步处理一些耗时较长的任务，例如异步删除命令unlink

Redis v6.0：在核心网络模型中引入多线程，进一步提高对于多核CPU的利用率

### 为什么Redis要选择单线程？

抛开持久化不谈，Redis是纯内存操作，执行速度非常快，它的性能瓶颈是网络延迟而不是执行速度，因此多线程并不会带来巨大的性能提升

多线程会导致过多的上下文切换，带来不必要的开销

引入多线程会面临线程安全问题，必然要引入线程锁这样的安全手段，实现复杂度增高，而且性能也会大打折扣

### 3.2 Redis单线程网络模型执行流程

Redis通过IO多路复用来提高网络性能，支持各种不同的多路复用实现，Redis将这些实现进行封装，提供了统一的高性能事件库API库 AE：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image211.png" alt="image211.png"></div>

在ae.c中根据当前系统支持的多路复用方式，引入对应响应的API库，之后调用API时就会调用对应文件中的函数：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image212.png" alt="image212.png"></div>

在Linux系统下，Redis底层使用epoll实现多路复用，分析Redis单线程网络模型的源码：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image213.png" alt="image213.png"></div>

Redis单线程网络模型的代码执行流程如下：

server.c中的main方法是整个服务器的入口，服务器启动时执行main方法

首先，执行initServer()方法初始化服务：先调用aeApiCreate（类似epoll_create）创建epoll实例（红黑树和就绪链表），然后监听TCP端口创建服务端监听套接字ServerSocket并得到FD（就是ssfd），之后注册Socket连接处理器，该处理器内部会调用aeApiAddEvent（类似epoll_ctl）监听ServerSocket的读事件，并为其绑定事件触发（有客户端连接）时的处理器acceptTcpHandler

在acceptTcpHandler中处理ServerSocket上的读事件：接收客户端socket连接，获取客户端FD，将FD关联到客户端连接实例conn上，然后监听客户端socket的读事件，并为其绑定读事件触发时的处理器readQueryFromClient

readQueryFromClient负责处理客户端发来的命令请求：

获取当前客户端实例（客户端的所有内容都在这个实例中），读取客户端的请求数据（可以理解为redis命令）到客户端的读缓冲区 c->querybuf

现在读缓冲区中的内容是一个个字节，需要解析这些字节转为Redis命令参数存入 c->argv 数组

redis将各种命令都封装成xxxCommand函数，并建立了命令和对应函数的字典，通过命令如set可以得到对应的处理函数如setCommand，所以下一步要从argv数组中得到命令名称，然后根据名称找到对应的command，执行command得到响应结果

之后将响应结果写到客户端写缓冲区 c->buf，如果c->buf满了写不下，就写到c->reply，这是一个链表，容量无上限

最后将客户端添加到server.clients_pending_write这个队列，等待被写出给到客户端

绑定事件触发处理器acceptTcpHandler后，不会立即进行epoll_wait，而是先注册一个ae_api_poll前的处理器，处理器触发时会执行beforeSleep

初始化服务后，执行aeMain方法开始循环监听事件，等待FD就绪，不过在休眠等待FD就绪前，会先调用一次前置处理器beforeSleep，对clients_pending_write这个队列中等待写出的客户端进行处理，依次将其中的数据返回给客户端

最后开始监听FD，执行aeApiPoll（类似以epoll_wait），当有FD就绪时，返回就绪FD的数量，调用对应的处理器处理就绪的FD

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image214.png" alt="image214.png"></div>

整体来讲，Redis使用了IO多路复用技术，允许单个线程同时监听多个文件描述符（包括服务端的ServerSocket和客户端的socket），并在有数据可读或可写时将任务派发给不同的处理器进行处理。具体来说：

当服务端的ServerSocket发生读事件时，说明有客户端进行连接，将对应的任务分配给连接应答处理器**tcpAcceptHandler**，获取客户端socket对应的fd，并为其注册监听

当客户端socket发生读事件时，说明有客户端命令请求到达，将对应的任务分配给命令请求处理器**readQueryFromClient**，从客户端读缓冲区c->queryBuf中读取命令字符串并解析为Redis命令进行处理，将处理结果写到客户端写缓冲区buf或reply，并将该客户端放入clients_pending_write队列等待数据写回

在每次循环监听fd之前，通过beforesleep方法调用命令回复处理器**sendReplyToClient**处理clients_pending_write队列中的客户端，将存储在客户端输出缓冲区（buf字段）或输出链表（reply字段）中的响应数据发送给客户端

对于redis，监听fd和命令执行单线程完全足够，真正影响性能的永远是IO：

处理客户端命令请求时需从客户端Socket中读出命令，此过程涉及网络IO的读操作，会受到网络带宽等影响

将服务端处理结果写回客户端Socket中也涉及到了网络IO的写操作，这又是一个性能瓶颈

所以Redis 6.0引入了多线程以提高IO读写效率，因此在解析客户端命令、写响应结果时采用了多线程。核心的命令执行、IO多路复用模块依然是由主线程执行：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image215.png" alt="image215.png"></div>

## 4.Redis通信协议

Redis是一个CS架构的软件，通信一般分两步（不包括pipeline和PubSub）：

客户端（client）向服务端（server）发送一条命令

服务端解析并执行命令，返回响应结果给客户端

因此客户端发送命令的格式、服务端响应结果的格式必须有一个规范，这个规范就是**通信协议**。

### 4.1 RESP协议

在Redis中采用的是RESP协议：

Redis 1.2版本引入了RESP协议

Redis 2.0版本中成为与Redis服务端通信的标准，称为RESP2

Redis 6.0版本中，从RESP2升级到了RESP3协议，增加了更多数据类型并且支持6.0的新特性——客户端缓存

但目前默认使用的依然是RESP2协议，下面通称RESP。

在RESP中，通过首字节的字符来区分不同数据类型，常用的数据类型包括5种：

单行字符串：首字节是+，后面跟上单行字符串，以CRLF（rn）结尾，例如字符串OK为+OKrn

单行字符串的数据中只能包含普通字符串，不允许包含rn，是非二进制安全的，通常用于服务端返回的信息

错误（Errors）：首字节是-，后用空格和异常信息隔开，以CRLF结尾，例如-Error messagern异常信息是message

数值：首字节是:，后面跟上数字格式的字符串，以CRLF结尾。例如:10rn表示数字10

多行字符串：首字节是$，表示二进制安全的字符串，记录时保存**字符串长度**和**字符串本身**，最大支持512MB：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image216.png" alt="image216.png"></div>

如果大小为0，则代表空字符串："$0rnrn"

如果大小为-1，则代表不存在："$-1rn"

数组：首字节是*，后面跟上数组元素个数，再跟上元素，元素数据类型不限：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image217.png" alt="image217.png"></div>

### 4.2 自定义Redis客户端

Redis支持TCP通信，因此可以使用Socket来模拟客户端，与Redis服务端建立连接：

```java
public class Main {

static Socket s;
static PrintWriter writer;
static BufferedReader reader;

public static void main(String[] args) {
try {
// 1.建立连接
String host = "192.168.150.101";
int port = 6379;
s = new Socket(host, port);
// 2.获取输出流、输入流
writer = new PrintWriter(new OutputStreamWriter(s.getOutputStream(), StandardCharsets.UTF_8));
reader = new BufferedReader(new InputStreamReader(s.getInputStream(), StandardCharsets.UTF_8));

// 3.发出请求
// 3.1.获取授权 auth 123321
sendRequest("auth", "123321");
Object obj = handleResponse();
System.out.println("obj = " + obj);

// 3.2.set name 虎哥
sendRequest("set", "name", "虎哥");
// 4.解析响应
obj = handleResponse();
System.out.println("obj = " + obj);

// 3.2.set name 虎哥
sendRequest("get", "name");
// 4.解析响应
obj = handleResponse();
System.out.println("obj = " + obj);

// 3.2.set name 虎哥
sendRequest("mget", "name", "num", "msg");
// 4.解析响应
obj = handleResponse();
System.out.println("obj = " + obj);
} catch (IOException e) {
e.printStackTrace();
} finally {
// 5.释放连接
try {
if (reader != null) reader.close();
if (writer != null) writer.close();
if (s != null) s.close();
} catch (IOException e) {
e.printStackTrace();
}
}
}

private static Object handleResponse() throws IOException {
// 读取首字节
int prefix = reader.read();
// 判断数据类型标示
switch (prefix) {
case '+': // 单行字符串，直接读一行
return reader.readLine();
case '-': // 异常，也读一行
throw new RuntimeException(reader.readLine());
case ':': // 数字
return Long.parseLong(reader.readLine());
case '$': // 多行字符串
// 先读长度
int len = Integer.parseInt(reader.readLine());
if (len == -1) {
return null;
}
if (len == 0) {
return "";
}
// 再读数据,读len个字节。我们假设没有特殊字符，所以读一行（简化）
return reader.readLine();
case '*':
return readBulkString();
default:
throw new RuntimeException("错误的数据格式！");
}
}

private static Object readBulkString() throws IOException {
// 获取数组大小
int len = Integer.parseInt(reader.readLine());
if (len <= 0) {
return null;
}
// 定义集合，接收多个元素
List<Object> list = new ArrayList<>(len);
// 遍历，依次读取每个元素
for (int i = 0; i < len; i++) {
list.add(handleResponse());
}
return list;
}

// set name 虎哥
private static void sendRequest(String ... args) {
writer.println("*" + args.length);
for (String arg : args) {
writer.println("$" + arg.getBytes(StandardCharsets.UTF_8).length);
writer.println(arg);
}
writer.flush();
}
}
```

## 5.Redis内存回收

Redis是基于内存存储的，单个节点的内存内存大小不宜太大，会影响持久化或主从同步性能。内存使用达到上限时Redis就无法存储更多数据，当然，可以修改配置文件的maxmemory配置修改Redis内存上限。

### 5.1 过期key处理

Redis通过expire命令可以为key设置一个有效期TTL，当key过期后，访问这个key会返回nil，代表key不存在，对应的内存也就会被回收。

在Redis中最多可以有16个数据库，每个数据库都被保存为一个redisDb实例。Redis所有数据都是以key-value的形式存在，在redisDb实例中，dict用于存放所有的key和value，expires用于存放所有key的有效期TTL（不包含value）：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image218.png" alt="image218.png"></div>

redisDb实例的结构示意图：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image219.png" alt="image219.png"></div>

当key的TTL到期后，key不是会被立即删除，删除情况有惰性删除和周期删除两种：

**惰性删除**：在访问一个key的时候，检查该key的存活时间，如果已经过期才执行删除

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image220.png" alt="image220.png"></div>

但是如果很多key过期后很长时间没有被访问，只采用惰性删除时，这些key就无法被释放，这就需要周期删除。

**周期删除**：通过一个定时任务，周期性地抽样部分过期的key，然后执行删除。执行周期有两种：

Redis服务初始化函数initServer()中设置定时任务，按照 server.hz 的频率执行过期key清理，模式为SLOW

Redis的每个事件循环前会调用beforeSleep()函数，执行过期key清理，模式为FAST

周期删除源码解析：

initServer初始化服务器时，会创建一个定时器关联serverCron函数，这个函数初始时1ms后会执行一次

serverCron先更新并获取当前时钟lruclock，lruclock可以理解为Redis内部维护的一个时钟，会不停更新记录时间，获取时钟后调用databasesCron进行过期数据清理（例如过期key处理）并返回下一次执行serverCron的时间（固定值100ms），用于第4步判断

databasesCron使用SLOW模式循环不断地尝试清理过期的key

初始化服务完成后，调用aeMain函数，aeMain函数会开启一个无限循环

循环内先调用beforeSleep函数使用FAST模式尝试清理过期的key，然后执行aeApiPoll等待FD就绪

有FD就绪处理完IO事件后，判断是否到可以调用serverCron使用SLOW模式清理（就是判断距离上次执行serverCron是否过去了100ms），如果可以清理就调用serverCron清理，否则下一次循环

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image221.png" alt="image221.png"></div>

SLOW模式规则：

执行频率受 server.hz 影响，默认为10，即每秒执行10次，每个执行周期100ms

执行清理耗时不超过一次执行周期的25%（默认slow模式耗时不超过25ms）

逐个遍历db，逐个遍历db中的bucket，抽取20个key判断是否过期

bucket：每个redisDb实例的expires字段数据结构其实是哈希表，哈希表每个table下标下都可以有dictEntry组成的链表，可以理解成每次依次遍历这些链表中的dictEntry，取20个dictEntry判断是否过期，并记录本次遍历的位置

如果清理时间没达到清理耗时上限（25ms）并且过期key比例大于10%，再进行一次抽样，否则结束

FAST模式规则（过期key比例小于10%不执行）：

执行频率受 beforesleep() 调用频率影响，但两次FAST模式间隔不低于2ms

执行清理耗时不超过1ms

逐个遍历db，逐个遍历db中的bucket，抽取20个key判断是否过期

如果清理时间没达到清理耗时上限（1ms）并且过期key比例大于10%，再进行一次抽样，否则结束

### 5.2 内存淘汰

内存淘汰就是当Redis内存使用达到设置的上限时，主动挑选部分key删除以释放更多的内存。

任何一条数据的写入操作都可能会导致内存溢出，因此Redis会在每一条命令执行前检查内存是否足够，如果不够会进行内存清理。

Redis会在处理客户端命令的方法 processCommand() 中尝试做内存淘汰：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image222.png" alt="image222.png"></div>

Redis支持8种不同策略来选择要删除的key：

noeviction： 不淘汰任何key，但是内存满时不允许写入新数据，默认就是这种策略

volatile-ttl： 对设置了TTL的key，比较key的剩余TTL值，TTL越小越先被淘汰

allkeys-random：对全体key ，随机进行淘汰，也就是直接从 db->dict 中随机挑选

volatile-random：对设置了TTL的key ，随机进行淘汰。也就是从 db->expires 中随机挑选

allkeys-lru： 对全体key，基于LRU算法进行淘汰

volatile-lru： 对设置了TTL的key，基于LRU算法进行淘汰

allkeys-lfu： 对全体key，基于LFU算法进行淘汰

volatile-lfu： 对设置了TTL的key，基于LFU算法进行淘汰

*LRU（Least Recently Used），最少最近使用。用当前时间减去最后一次访问时间，这个值越大则淘汰优先级越高*

*LFU（Least Frequently Used），最少频率使用。会统计每个key的访问频率，值越小淘汰优先级越高*

Redis的数据都会被封装为一个redisObject，其中的unsigned lru:LRU_BITS属性用来统计当前RedisObject对象的访问信息，根据配置文件中配置的淘汰策略会记录不同的值：

若采用LRU淘汰策略，该字段会以秒为单位记录最近一次访问时间，长度24bit

若采用LFU淘汰策略，该字段会用高16位 以分钟为单位记录最近一次访问时间，低8位记录逻辑访问次数

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image223.png" alt="image223.png"></div>

Redis会通过unsigned lru:LRU_BITS统计一个key最近一次的访问时间或最近一次访问的频率，其中LFU策略的逻辑访问次数并不是key的真实访问次数，而是通过计算得到：

生成0~1之间的随机数R

计算 1 / (旧次数 * lfu_log_factor + 1)，记录为P，lfu_log_factor默认为10

如果 R < P ，则计数器 + 1，且最大不超过255

访问次数会随时间衰减，距离上一次访问时间每隔 lfu_decay_time 分钟（默认为1），计数器 -1

随着该key的访问次数增多，得到的P越来越小，R<P的可能就越来越小，该key的逻辑访问次数增加的可能也会越来越小。如果长时间不访问，访问次数会随时间衰减。逻辑访问次数虽然不是真正访问次数，但是对所有key来说，这个次数还是能说明一个key的访问频率的高低。

Redis在执行每一条客户端命令前执行 processCommand() 进行内存淘汰，该函数根据设置的淘汰策略淘汰一部分key，执行流程如下：

<div class="img-wrap-left"><img class="left-img" src="https://cdn.jsdelivr.net/gh/wu4yong/starry-images@main/assets/img/redis/7/image224.png" alt="image224.png"></div>

执行 LRU|LFU|TTL 淘汰策略本质是比较key的过期时间进行淘汰，但数据库通常有成千上万的key，不可能遍历所有key进行比较，所以就创建一个淘汰池 evication_pool 从数据库（遍历所有DB）中随机找一部分key进行比较，池子的规则是按照某一种规则进行升序排列，排列后值越大的的越先淘汰，具体的算法根据淘汰策略不同进行调整使之可以适用越大越先淘汰的逻辑，池子中的数据删除时倒序值越大越应该删除。
