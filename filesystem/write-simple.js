
/*
    写文件。一次性写入文件
*/

'use strict';
const fs = require('fs');
/* 写入文件。1、文件路径；2、文件内容；3、回调方法，参数为 Error 对象，如果成功，则为 null */
/* 如果文件不存在，会创建。如果已存在，会覆盖。（覆盖，不是追加） */
fs.writeFile('target.txt', 'hello KKK', (err) => {
    if(err){
        throw err;
    }
    console.log('file saved !');
})


// node write-simple.js