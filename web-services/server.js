
/**
 *  Express 是 Node.js 的 web 应用程序框架
 */

'use strict';

const http = require('http');
const server = http.createServer((req, res) => {
    // 回调函数根据 HTTP 请求(req) 获得的信息进行相应(res)
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
});

// 绑定 TCP 套接字进行监听
server.listen(60700, () => console.log('Ready !'));

/**
 * URL 路由
 * cookie 管理 session
 * 解析传入的请求（表单数据，JSON数据）
 * 拒绝非法请求
 */
//以上很多功能都是直接由 Express 框架来完成的