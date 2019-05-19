
/*
    zeromq 模块实现 rep/req 模式中的 响应 部分
    req/rep  请求/响应模式
*/

'use strict';
const fs = require('fs');
const zmq = require('zeromq');

//创建 responder 节点
const responder = zmq.socket('rep');

//监听 message 事件
responder.on('message', data => {

    //转换原始数据为对象
    const request = JSON.parse(data);
    console.log(`Received request to get: ${request.path}`);

    //异步方法读取文件内容
    fs.readFile(request.path, (err, content) => {
        console.log('Sending response content');

        //send 方法发送 JSON 字符串
        responder.send(JSON.stringify({
            content:content.toString(),
            timestamp:Date.now(),
            pid:process.pid
        }));
    });
});

//响应器绑定本地地址的 TCP 60300 端口，等待请求
//这里的地址。由于服务器会读取本地文件并返回给任意请求，所以为了避免风险，需要设置为127.0.0.1
responder.bind('tcp://127.0.0.1:60300', err => {
    console.log(`Listening for zmq requesters ...`);
});

//监听 node.js 的 SIGNT 事件。表示系统接收到用户的关闭指令
process.on('SIGINT', ()=>{
    console.log('Shuting down ...');
    responder.close();
});


//node zmq-filer-rep.js