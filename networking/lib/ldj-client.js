
/*
    实现 LDJ 缓存模块解决 JSON 分块消息问题
*/

const EventEmitter = require('events').EventEmitter;

/* 定义 LDJClient 类继承 EventEmitter 类 */
class LDJClient extends EventEmitter {
    /* 构造函数，执行父类的构造函数 */
    constructor(stream) {
        super();

        /* 缓存数据 */
        let buffer = '';
        stream.on('data', data => {
            /* 接收原始数据，添加到 buffer */
            buffer += data;
            /* 查找消息结束符 */
            let boundary = buffer.indexOf('\n');
            console.log(boundary);
            /* 如果存在结束符 */
            while (boundary !== -1) {
                /* 获取一条消息 */
                const input = buffer.substring(0, boundary);
                /* 获取剩余的信息 */
                buffer = buffer.substring(boundary + 1);
                /* 发送获取到的完整信息 */
                this.emit('message', JSON.parse(input));
                /* 继续处理剩余的信息 */
                boundary = buffer.indexOf('\n');
            }
        });
    }

    /* 添加外部可以直接调用的静态方法 */
    static connect(stream){
        return new LDJClient(stream);
    }
}

/* module.exports 对象是 Node.js 模块和外界的桥梁。添加在 exports 上的属性都能被外部访问。相当于将该类完全暴露 */
module.exports = LDJClient;

