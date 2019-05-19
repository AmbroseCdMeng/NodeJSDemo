
/*
    zeromq 模块实现 pub/sub 模式中的 订阅者 部分
    pub/sub 发布/订阅模式
*/

'usr strict';
const zmq = require('zeromq');

//创建 subscriber 节点
const subscriber = zmq.socket('sub');//小写 socket

//通知 zeromq 开始接收所有消息。如果只接受特定类型消息，可以传入字符串前缀过滤。空字符串表示接收所有消息。
subscriber.subscribe('');

//subscriber 对象继承自 EventEmitter 类。所以使用 on 监听 message 事件
subscriber.on('message', data => {
    const message = JSON.parse(data);
    const date = new Date(message.timestamp);
    console.log(`File "${message.file}" changed at ${date}`);
});

//subsciber 建立连接
subscriber.connect('tcp://localhost:60300');