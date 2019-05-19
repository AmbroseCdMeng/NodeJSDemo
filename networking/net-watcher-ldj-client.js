
/*
    导入自定义的模块。处理如 test-json-service.js 中数据拆分返回后解析报错情况
*/

'use strict';

/* 导入 net 模块并创建与端口 60300 的连接 */
const netClient = require('net').connect({ port: 60300 });
/* 导入自定义的 ldj-client 模块并传入 netClient 参数初始化 */
const ldjClient = require('./lib/ldj-client').connect(netClient);

ldjClient.on('message', message => {
    if (message.type === 'watching') {
        console.log(`Now watching: ${message.file}`);
    } else if (message.type === 'changed') {
        console.log(`File changed: ${new Date(message.timestamp)}`);
    } else {
        throw Error(`Unrecognized message type: ${message.type}`);
    }
})

