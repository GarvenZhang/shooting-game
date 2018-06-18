import Astar from './Astar'

// === 进程: 一个具有一定独立功能的程序在一个数据集合上的依次动态执行过程 === //

// === 1 组成: 包含了正在运行的一个程序的所有状态信息 === //
// === 1.1 程序的代码 === //
// === 1.2 程序处理的数据 === //
// === 1.3 程序计算器的值，指示下一跳将运行的指令 === //
// === 1.4 一组通用的寄存器的当前值，堆，栈 === //
// === 1.5 一组系统资源 === //

// === 2 特点: === //
// === 2.1 动态性: 可动态创建,结束 === //
// === 2.2 并发性: 可被独立调度并占用处理机运行 === //
// === 2.2.a 并发: 一段时间内有多个进程运行，实际上是排序的，因时间间隔很少给人错觉是同时执行的(单核CPU) === //
// === 2.2.b 并行: 同一时刻有多个进程执行(多核CPU) === //
// === 2.3 独立性：不同进程的工作不相互影响(内存管理中的列表) === //
// === 2.4 制约性: 因访问共享数据/资源或进程间同步而产生制约 === //

// === 3 进程控制结构(process control block): 描述进程的数据结构, 操作系统为每个进程都维护了一个PCB，用来保存于该进程有关的各种状态信息, 是进程存在的唯一标志 === //
// === 3.1 包含: === //
// === 3.1.a 进程标志信息: 如本进程标识, 父进程标识, 用户标识 === //
// === 3.1.b 处理机状态信息保存区: 保存进程的运行现场信息 === //
// === > 用户可见寄存器：用户程序可以使用的数据，地址等寄存器 === //
// === > 控制和状态寄存器: 如程序计数器(PC)，程序状态字(PSW) === //
// === > 栈指针: 过程调用/系统调用/中断处理和返回时需要用到它 === //
// === 3.1.c 进程控制信息: === //
// === > 调度和状态信息: 用户操作系统调度进程并占用处理机使用 === //
// === > 进程间通信信息: 为支持进程间的与通信相关的各种标识，信号，信件等，这些信息存在接收方的进程控制块中 === //
// === > 存储管理信息: 包含有指向本进程映像存储空间的数据结构 === //
// === > 进程所用资源: 说明由今晨刚打开，使用的系统资源 === //
// === > 有关数据结构连接信息: 进程可以连接到一个进程队列中, 或连接到相关的其它进程的PCB === //
// === 3.2 PCB的组织方式: 链表 === //

// === 4 状态(State): === //
// === 4.1 生命周期: 创建 -> 运行 -> 等待 -> 唤醒 -> 结束 === //
// === 4.1.a 创建: 系统初始化 -> 用户请求创建一个新进程 -> 正在运行的进程执行了创建进程的系统调用 === //
// === 4.1.b 运行：内核选择(为何选择?如何选择?)一个就绪的进程, 让它占用处理机并执行 === //
// === 4.1.c 等待(阻塞): 进程只能自己阻塞自己，因为只要进程自身才能知道合适需要等待某种事件的发生 === //
// === > 请求并等待系统服务，无法马上完成 === //
// === > 启动某种操作，无法马上完成 === //
// === > 需要的数据没有到达 === //
// === 4.1.d 唤醒：进程只能被别的进程或操作系统唤醒 === //
// === > 被阻塞进程需要的资源可悲满足 === //
// === > 被阻塞进程等待的事件到达 === //
// === > 将该进程的PCB插入到就绪队列 === //
// === 4.1.e 结束： === //
// === > 正常退出(自愿的) === //
// === > 错误退出(自愿的) === //
// === > 致命错误(强制性的) === //
// === > 被其他进程所杀(强制性的) === //
// === 4.2 状态变化模型 === //
// === 4.2.a 进程的基本状态： === //
// === > 创建状态: === //
// === > 运行状态(running): 当一个进程正在处理机上运行时 === //
// === > 就绪状态(ready): 一个进程获得了除处理机之外的一切所需资源，一旦得到处理机即可运行 === //
// === > 等待状态/阻塞状态(blocked): 一个进程正在等待某一事件而暂停运行时，如等待某资源，等待输入/输出完成 === //
// === > 结束状态: === //
/* 状态变化图：

    进入就绪队列           被调度                结束
new ----------> ready ----------> running -------------> exit
                  |                   |
                  <------时间片完------<
                  |                   |等待事件
                  |                   v
                  <------事件发生---blocked
*/
// === 4.3 挂起模型: 把一个进程从内存转到外存 === //

// === 6 与程序的关系: === //
// === 6.1 例子: 科学家按照食谱买了些原料给女儿做生日蛋糕，后来儿子跑来说被蜜蜂蜇了, 只好把蛋糕放一边在食谱上做好标记，把状态信息记录起来，再根据医疗手册处理儿子伤口，处理好后继续做蛋糕 === //
// === 6.1 解释: 食谱 -> 程序, 科学家 -> CPU, 原料 -> 数据, 做蛋糕 -> 进程, CUP从一个进程(做蛋糕)切换到另一个进程(医疗救护) === //
// === 6.2 联系： === //
// === 6.2.a 程序是产生进程的基础 === //
// === 6.2.b 程序的每次运行构成不同的进程 === //
// === 6.2.c 进程是程序功能的体现 === //
// === 6.2.d 通过多次执行，一个程序可对应多个进程; 通过调用关系, 一个程序可包括多个程序 === //
// === 6.3 区别: === //
// === 6.3.a 进程是动态的, 程序是动态的，程序是有序代码的集合，进程是程序的执行，进程有核心态/用户态 === //
// === 6.3.b 进程是暂时的，程序是永久的，进程是一个状态变化的过程，程序可长久保存 === //
// === 6.3.c 进程与程序的组成不同：进程的组成包括程序，数据和进程控制块(进程状态信息) === //

// === 线程(Thread): 进程当中的一条执行流程 === //
// === 1 与线程关系： === //
// === 1.1 进程：进程 = 线程 + 共享资源 === //
// === 1.2 进程是资源分配单位，线程是CPU调度单位 === //
// === 1.3 进程拥有一个完成的资源平台，而线程只独享必不可少的资源，如寄存器和栈 === //
// === 1.4 线程同样具有就绪，阻塞和执行三种基本状态，同样具有状态间的转换关系 === //
// === 1.5 线程能减少并发执行的时间和空间开销： === //
// === 1.5.a 线程创建时间比进程短 === //
// === 1.5.b 线程终止时间比进程短 === //
// === 1.5.c 同一进程内的线程切换时间比进程短 === //
// === 1.5.d 由于同一进程的个线程间共享内存和文件资源，可直接进程不通过内核的通信 === //
// === 2 优点： === //
// === 2.1 一个进程可以同时存在多个线程 === //
// === 2.2 各个线程之间可并发进行 === //
// === 2.3 各个线程之间可以共享地址空间和文件等资源 === //
// === 3 缺点: 一个线程崩溃, 会导致其所属进程的所有线程崩溃 === //
// === 4 体现：chrome每个网页为一个进程，网页间不会相互影响；网页内会有多个线程，共享资源也相互影响 === //
// === 5 实现方式: === //
// === 5.1 用户线程:在用户空间实现, 操作系统看不到，由专门的用户线程库来管理 === //
// === 5.2 内核线程: 在内核中实现 === //
// === 5.3 轻量级进程: 在内核中实现，支持用户线程 === //

self.onmessage = function (e) {
  const path = Astar(e.data, {
    x: 975,
    y: 0
  })
  console.log(path)
  self.postMessage(path)
}