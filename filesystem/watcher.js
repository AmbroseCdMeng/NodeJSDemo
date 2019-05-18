
/*
    监听 target.txt 文件，如果文件内容发生变化，输入File changed
*/

//严格模式下执行
'use strict';
// require 方法：引入 node.js 模块，并将该模块作为返回值
const fs = require('fs');//建议只导入使用的方法。如 require('fs').watch 或 import { watch } from 'fs';
//调用 fs 模块的 watch 方法。接收两个参数，文件路径(含文件名)，当文件变化时需要执行的回调函数
fs.watch('target.txt', () => console.log('File changed!'));//箭头函数表达式。空括号表示不需要参数
/*箭头函数的优点：1、语法简单；2、不会创建新的this作用域*/
console.log('Now watching target.txt for changed...');


// cmd 中 执行 node watcher.js 开启监听
