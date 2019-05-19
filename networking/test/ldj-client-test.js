
/*
    安装 Mocha 测试框架后。新建 test 目录，将测试代码放置在此目录下
    这是 Node.js 的约定。Mocha 会自动在该目录下查找测试代码。
*/

'use strict';

/* 引入 assert 模块 */
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;
const LDJClient = require('../lib/ldj-client');

/* Mocha 的 describe 创建测试 LDJClient 的上下文环境 */
/* 第一个参数：测试的名称；第二个参数：函数，包含测试的内容 */
describe('LDJClient', () => {

    let stream = null;
    let client = null;

    /* 每一次测试都将新的实例复制给变量 */
    beforeEach(() => {
        stream = new EventEmitter();
        client = new LDJClient(stream);
    });

    /* it 方法进行实际测试 */
    /* 由于代码是异步的。所以需要通过 done 方法告诉 Mocha 测试结束 */
    /* 箭头函数监听 message 事件 */
    it('shoule emit a message event from a single data event', done => {
        client.on('message', message => {
            /* deepEqual 方法对测试数据和正式数据进行比较 */
            assert.deepEqual(message, { foo: 'bar' });
            /* 测试结束 */
            done();
        });
        /* 触发 stream 的 data 事件，引发 message 的回调方法 */
        stream.emit('data', '{"foo":"bar"}\n');
    });


    /* 拆分消息测试 */
    it('shoule emit a message event from a split data events', done => {
        client.on('message', message => {
            assert.deepEqual(message, { foo: 'bar' });
            done();
        });
        stream.emit('data', '{"foo":');
        process.nextTick(() => stream.emit('"bar"}\n')) ;
    }).timeout(5000);
    /* Mocha 的 it 方法返回值包含 timeout 方法，可以设置本次测试的超时时间，默认 2 秒。设置为 0 时禁用超时 */
    /* describe 方法返回的对象也包含 timeout 方法，可以设置其内一组测试的超时时间 */
});