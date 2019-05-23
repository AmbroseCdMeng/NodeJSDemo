
/**
 * 基于 Express 的简单应用
 */

'use strict';

// 引入 express 框架
const express = require('express');
// 引入 morgan 日志工具
const morgan = require('morgan');

// 调用 express 函数创建上下文
const app = express();
// 使用 Morgan 作为中间件。dev 模式：会将所有请求记录在控制台
app.use(morgan('dev'));

// GET 请求访问 /hello/:name路径。路径中 name 为路由参数，
app.get('/hello/:name', (req, res) => {
    // API 调用时，Express 将该部分作为属性存储到 req.params 中
    res.status(200).json({ 'Hello': req.params.name });
});

// TCP 端口 60700 上监听 HTTP 入站请求，并在控制台提示
app.listen(60700, () => console.log('Ready !'))


/**
 * 1、node server.js                        运行监听
 * 2、curl -i localhost:60700/hello/jimbo   发送 HTTP 请求测试
 */