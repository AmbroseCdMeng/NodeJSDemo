
/*
    创建网络服务连接，绑定端口，将之前监听文件内容的监听程序作为数据源。
    数据采用 JSON 格式传输
    服务端
*/

'usr strict';
const fs = require('fs');
/* 引入 net 模块。提供绑定端口和建立连接的能力 */
const net = require('net');
const filename = process.argv[2];

if (!filename) {
    throw Error('Error : No filename specified');
}

/* net.createServer 方法接收回调函数作为参数。返回 server 对象 */
/* 连接建立成功后，执行回调函数，并传递 Socket 对象给 connection 参数 */
net.createServer(connection => {
    /* 建立连接成功 */
    console.log('Subscriber connected');

    /* 向客户端发送数据 JSON.stringify 对对象进行序列化 */
    connection.write(JSON.stringify({ type: 'watching', file: filename }) + '\n');

    /* 监听目标文件变化，将变化内容发送给客户端 */
    const watcher = fs.watch(filename, () => connection.write(JSON.stringify({ type: 'changed', timestamp: Date.now() }) + '\n'));

    /* 监听连接 close 事件。连接关闭时，停止监听 */
    connection.on('close', () => {
        console.log(`Subscriber disconnected`);
        watcher.close();
    });
    /* 由于 createServer 方法返回 Server 对象。所以可以直接链式调用，绑定指定端口 */
}).listen(60300, () => console.log(`Listening for subscibers ...`));