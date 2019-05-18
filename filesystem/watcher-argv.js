
/*
    改进 watch.js 。让其可以接收文件名作为参数。
*/

const fs = require('fs');
//process 全局对象。 argv：argument vector 的缩写。
//process.args 访问命令行输入的参数。其值为数组。[0]为node的绝对路径，[1]为watcher-argv.js 的绝对路径，[2]为目标文件名
const filename = process.argv[2];
if (!filename) {
    throw Error('A file to watch must be specified !');
}
//开启监听。指定文件名，空参的回调方法
fs.watch(filename, () => console.log(`File ${filename} changed !`));
console.log(`Now watching ${filename} for changes...`);


// cmd 中 执行 node watcher-argv.js target.txt 开启监听。
// 如果没有传入参数 target.txt 则会抛出 A File to watch must be specified 异常