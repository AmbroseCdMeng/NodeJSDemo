
/*
    zeromq 模块整合 req/rep。搭建 node.js 集群
        ROUTER socket 可以简单的理解为 REP socket 的并发版
        DEALER socket 可以简单的理解为 REQ socket 的并发版

        使用多进程整个 请求/响应 模式，搭建基本的 node.js 集群

    主进程是这个架构中最稳定的部分，它负责绑定系统资源。
    工作进程和客户端都会连接到主进程绑定的节点。
    需要注意的是，消息传输的方向是由 socket 消息模式决定的，而不是由具体的客户端节点决定。
*/

'use strict';

/* 引入 cluster 模块创建子进程 */
/* 之前用来创建子进程的 spawn 方法只能用来创建非 node.js 进程 */
/* cluster 模块的 fork 方法是 spawn 方法的特殊形式，可以用于创建 node.js 进行的副本 */
const cluster = require('cluster');
const fs = require('fs');
const zmq = require('zeromq');

/* node.js 内置的 os 模块获取 cpu 数量 */
/* 一般实际使用中，会根据 cpu 数量分配相应的工作进程，以便于充分利用 cpu 资源又不给操作系统带来负担 */
const numWorkers = require('os').cpus().length;

if (cluster.isMaster) {

    //用 ROUTER 监听 60300 端口，准备接收 tcp 连接
    const router = zmq.socket('router').bind('tcp://127.0.0.1:60300');
    //用 DEALER 绑定进行进程间通信节点 IPC， filer-dealer.ipc 文件保存在工作目录下
    const dealer = zmq.socket('dealer').bind('ipc://filer-dealer.ipc');

    //监听 message 事件
    router.on('message', (...frames) => dealer.send(frames));
    dealer.on('message', (...frames) => router.send(frames));

    //监听 workers 上线事件
    cluster.on('online', worker => console.log(`Worker ${worker.process.pid} is online`));

    //为没一个 CPU fork 一个子进程
    for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
    }
} else {
    //创建 REP 请求并连接
    const responder = zmq.socket('rep').connect('ipc://filer-dealer.ipc');
    responder.on('message', data => {
        const request = JSON.parse(data);
        console.log(`${process.pid} received request for: ${request.path}`);
        fs.readFile(request.path, (err, content) => {
            console.log(`${process.pid} sending response`);
            responder.send(JSON.stringify({
                content: content.toString(),
                timestamp: Date.now(),
                pid: process.pid
            }));
        });
    });
}