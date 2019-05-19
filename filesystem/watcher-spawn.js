
/*
    继续优化 watcher.js 。让其在监听到文件变化后创建子进程。再用子进程执行系统命令
*/

'use strict';
const fs = require('fs');
//引入 node.js 的 child_process 模块。返回该模块下的 spawn 方法。
const spawn = require('child_process').spawn;
const filename = process.argv[2];

if(!filename){
    throw Error('A file to watch must be specified !');
}

fs.watch(filename, ()=>{
    /* spawn 方法需要两个参数。1、需要执行的命令；2、参数数组，包含需要执行的命令本身需要的参数 */
    /* spawn 方法返回的对象是 ChildProcess。其 stdin、stdout、stderr 属性都是 Stream，可以直接输出 */
    //const ls = spawn('ls', ['-l', '-h', filename]);//相当于执行：ls -l -h filename。这是 linux 命令
    const ls = spawn('dir', ['/w',filename], {shell:process.platform === 'win32'});//windows 下的 dir 命令。相当于 dir /q /tw
    //使用 pipe 方法将子进程的输出内容传送到标准输出流
    ls.stdout.pipe(process.stdout);
});
console.log(`Now watching ${filename} for changed...`);


// cmd 中 执行 node watcher-spawn.js target.txt 开启监听。