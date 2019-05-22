
/**
 * Commander 创建基本命令行程序
 * 
 * 定义命令行参数。检查输入对象。
 */


'use strict';

const fs = require('fs');
const request = require('request');
const program = require('commander');
const pkg = require('./package.json');

/**
 * 加入方法 获取 ES 数据库的 url 地址
 */
const fullUrl = (path = '') => {
    let url = `http://${program.host}:${program.port}`;
    if (program.index) {
        url += program.index + '/';
        if (program.type) {
            url += program.type + '/';
        }
    }
    return url + path.replace(/^\/*/, '');//正则过滤路径的前斜杠，避免出现双斜杠
};

//命令配置
program.version(pkg.version)
    .description(pkg.description)
    .usage('[options] <command> [...]')
    .option('-o, --host <hostname>', 'hostname [localhost]', 'localhost')
    .option('-p, --port <number>', 'port number [9200]', '9200')
    .option('-j, --json', 'format output as JSON')
    .option('-i, --index <name>', 'which index to use')
    .option('-t, --type <type>', 'default type for bulk operations');

program.parse(process.argv);

/**
 * 添加命令 记录完整路径
 *  commander 命令需要完成三件事。1、命令和参数；2、描述信息；3、操作回调
 *  <> 为必备参数，[] 为可选参数，回调方法中设置path可选变量，默认值 /
 */
program
    .command('url [path]')
    .description('generate the URL for the options and path (default is /)')
    .action((path = '/') => console.log(fullUrl(path)));


/**
 * 使用 Request 模块简化 Http 请求
 * 
 * 添加一个 get 命令，接受名为 path 的可选参数。
 * 在 action 回调，使用 Request 模块提供的 request 方法来执行异步 HTTP 请求，并在完成时调用回调函数
 */
program
    .command('get [path]')
    .description('perform an HTTP GET request for path (default is /)')
    .action((path = '/') => {
        const options = {
            url: fullUrl(path),
            json: program.json,
        };
        request(options, (err, res, body) => {
            if (program.json) {
                console.log(JSON.stringify(err || body));
            } else {
                if (err) throw err;
                console.log(body);
            }
        });


    });

//接收 HTTP PUT 请求来创建索引
const handleResponse = (err, res, body) => {
    if (program.json) {
        console.log(JSON.stringify(err || body));
    } else {
        if (err) throw err;
        console.log(body);
    }
};

program
    .command('create-index')
    .description('create an index')
    .action(() => {
        //回调中，检查用户是否使用 --index 标志指定索引
        if (!program.index) {
            //如果没有，则根据指定的 --json 标志，抛出一个异常或以 JSON 格式输出一个错误
            const msg = 'No index specified ! User --index <name> ';
            if (!program.json) throw Error(msg);
            console.log(JSON.stringify({ error: msg }));
            return;
        }
        //发送 HTTP PUT 请求
        request.put(fullUrl(), handleResponse);
    });


//确保用户输入无法识别的命令时，调用 help 帮助   
if (!program.args.filter(arg => typeof arg == 'object').length) {
    program.help();
}


//因在 esclu.bat 文件中调用了该文件。所以在 windows 中可以直接运行 esclu.bat 
//如果是 linux 系统。需要用 #!  来声明可执行文件，并使用 chmod 命令赋予可执行权限。

//esclu.bat  但是这样运行在 windows 传参不方便。

//所以，运行 node index.js 加参数
//node index.js -V