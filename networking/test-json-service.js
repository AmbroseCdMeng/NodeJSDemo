
/*
    测试服务器。模拟将消息拆分成多份输入数据、不合格的数据等情况
*/

'use strict';
const server = require('net').createServer(connection => {
    console.log('Subsriber connected');

    //Two message chunks that together make a whole message.
    const firstChunk = '{"type":"changed", "timesta';
    const secondChunk = 'mp":1450694370094}\n';

    //Send the first chunk immediaterly
    connection.write(firstChunk);

    //After a short delay, send the other chunk
    const timer = setTimeout(() => {
        connection.write(secondChunk);
        connection.end();
    }, 100);

    //Clear timer when the connection ends.
    connection.on('end', () => {
        clearTimeout(timer);
        console.log('Subscriber disconnected');
    });
});

server.listen(60300, () => console.log('Test server listening for subscribers ... '));