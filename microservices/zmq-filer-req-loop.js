
/*
    zeromq 模块实现 rep/req 模式中的 请求 部分
    req/rep  请求/响应模式
*/

'use strict';

const zmq = require('zeromq');
const filename = process.argv[2];

//创建请求 soket
const requester = zmq.socket('req');

//监听 message 事件
requester.on('message', data => {
    //将接收到的字符串解析为对象
    const response = JSON.parse(data);
    console.log('Receiven response ', response);
});

//连接请求 socket
requester.connect('tcp://localhost:60300');

//调用 send 方法发送请求。
//由于每次只处理一个问题。没有并行处理的能力，
//这里将发送请求的部分循环执行，可以看到，请求一个接一个发出，同时也接收到响应请求，发送和接收是交替输出的
//响应器是逐条执行，只有处理完上一条请求，才会接收下一条请求。也就是说，fs。readFile() 方法执行时，node.js 的事件循环不会触发新的事件
for (let i = 1; i <= 5; i++) {
    console.log(`Sending a request for ${filename}`);
    requester.send(JSON.stringify({
        path: filename
    }));
}

// node zmq-filer-req.js target.txt
