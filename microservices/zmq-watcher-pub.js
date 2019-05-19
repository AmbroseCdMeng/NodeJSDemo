
/*
    zeromq 模块实现 pub/sub 模式中的 发布者 部分
    pub/sub 发布/订阅模式
*/

'use strict';

const fs = require('fs');

/* 引入 zeromq 模块 */
const zmp = require('zeromq');
const filename = process.argv[2];

//创建消息发布节点
const publisher = zmp.socket('pub');

//开启监听
fs.watch(filename, () => {

    //发布者的 send 方法，会将消息发送给所有订阅者。zeromq 只会发送数据，消息的序列化和反序列化需要手动处理
    publisher.send(JSON.stringify({
        type:'changed',
        file:filename,
        timestamp:Date.now()
    }));
});

//监听 TCP 端口 60300
publisher.bind('tcp://*:60300', err => {
    if(err){
        console.log(err);
        throw err;
    }
    console.log('Listening for zmq subscribers ... ');
})


//node zmq-watcher-pub.js target.txt