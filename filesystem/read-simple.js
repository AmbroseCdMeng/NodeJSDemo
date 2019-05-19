
/*
    读文件。一次性读取文件
*/

'use strict';
const fs = require('fs');
/* 回调函数的两个参数。*/
/* 1、Error 对象。如果执行成功，返回null，如果执行失败，返回 Error 对象 */
/* 2、Buffer 对象。文件内容的二进制。 */
fs.readFile('target.txt', (err, data) => {
    if (err) {
        throw err;
    }
    console.log(data.toString());
});


// node read-simple.js