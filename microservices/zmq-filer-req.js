
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
console.log(`Sending a request for ${filename}`);
requester.send(JSON.stringify({
    path: filename
}));


// node zmq-filer-req.js target.txt
