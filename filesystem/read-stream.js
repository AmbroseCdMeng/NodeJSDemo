/*
    读文件。创建读写流的方式读取文件
*/

'use strict'

/* node.js 的链式编程 */
/* on 方法返回的也是 Emitter 对象 */
require('fs').createReadStream(process.argv[2]).
    on('data', chunk => process.stdout.write(chunk)).
    on('error', err => process.stderr.write(`ERROR:${err.message}\n`));


// node read-stream.js target.txt


/* 扩展：
    以上所讨论的都是异步操作。需要考虑回调方法，当事件发生时，触发回调方法。

    当调用的方法名以后缀 Sync 结尾时。便是该方法的同步版本。
    同步处理，执行 IO 时，进程会阻塞。消耗更多的资源。
    
    同步处理不需要考虑回调方法。因为在执行 IO 时，其他代码是不会执行的。
    所以，IO 如果执行成功，则继续运行，如果执行失败，则抛出异常，程序中止。

    一般情况下。大多使用异步操作，因为不但可以节约资源，还可以减小对其他代码的影响。

    但是，当初始化阶段，也就是说，某一段代码对后面要执行的代码起到决定性作用时，就需要同步操作了。
    因为此时即使使用异步，一旦执行失败了，后面的代码也无法执行，或者说没有执行的必要了，使用同步反而可以尽快的退出程序返回错误。

    另外，文件操作中，除了 read、write 之外。
    其他的 
        copy -- 复制、unlink -- 删除、chmod -- 变更权限、mkdir -- 创建文件夹 
    等方法的使用也类似，回调函数的参数也一样。
*/