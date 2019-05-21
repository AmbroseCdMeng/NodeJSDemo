
/**
 * Commander 创建基本命令行程序
 * 
 * 定义命令行参数。检查输入对象。
 */


'use strict';

const fs = require('fs');
const request = require('request');
const program = require('commander');
const pkg = require('./pachage.json');

program.version(pkg.version)
    .description(pkg.description)
    .usage('[options]<command>[...]')
    .option('-o, --host <hostname>', 'hostname [localhost]', 'localhost')
    .option('-p, --port <number>', 'port number [9200]', '9200')
    .option('-j, --json', 'format output as JSON')
    .option('-i, --index <name>', 'which index to use')
    .option('-t, --type <type>', 'default type for bulk operations');

program.parse(process.argv);

if (!program.args.filter(arg => typeof arg == 'object').length) {
    program.help();
}


//因在 esclu.bat 文件中调用了该文件。所以在 windows 中可以直接运行 esclu.bat 
//如果是 linux 系统。需要用 #!  来声明可执行文件，并使用 chmod 命令赋予可执行权限。

//esclu.bat