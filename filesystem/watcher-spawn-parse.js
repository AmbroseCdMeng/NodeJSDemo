
/*
    EventEmitter 类。可以通过它触发事件或者响应事件。
    node.js 中很多类都继承自 EventEmitter 类。如 Stream
*/

'use strict'
const fs = require('fs');
const spawn = require('child_process').spawn;
const filename = process.argv[2];

if(!filename){
    throw Error('A file to watch must be specified !');
}

/*
//将 watch 方法改写为下面的代码
fs.watch(filename, ()=>{
    const ls = spawn('dir', ['/w',filename], {shell:process.platform === 'win32'});
    ls.stdout.pipe(process.stdout);
});
*/

fs.watch(filename, () => {
    const ls = spawn('dir', ['/w', filename], {shell:process.platform === 'win32'});
    let output = '';//let 类似 var。但 let 是块级作用域，var 会产生变量提升
    /* on 方法用于给指定事件添加监听 */
    /* data 表示监听数据。因为这里要获取的是输出流数据 */
    /* chunk 回调箭头函数的参数。data 事件会将 Buffer 对象作为参数传回，可以通过该参数拿到数据 */
    /* Buffer 是二进制数据。由 node.js 内核管理。不能修改，且需要编码解码才能转换为 JS 字符串 */
    /* Buffer 和 string 相加时，会将 Buffer 数据复制到 node.js 堆栈，使用默认方式（UTF-8）编码。但该操作非常耗时，一般不建议 */
    ls.stdout.on('data', chunk => output += chunk);

    /* ChildProcess 也继承了 EventEmiter，所以也可以对它添加指定事件的监听。如 close 事件 */
    ls.on('close', () => {
        const parts = output.split(/\s+/);// 正则 \s 匹配任何空白字符。包括空格、制表符、换页符
        console.log([parts[0], parts[4], parts[8]]);
    });
});
console.log(`Now watching ${filename} for changed...`);


// cmd 中 执行 node watcher-spawn-parse.js target.txt 开启监听。