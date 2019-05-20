
/*
    使用 chai 声明断言。测试文件
*/

'use strict';

const fs = require('fs');

/* 引入 chai 的 expect 函数 */
const expect = require('chai').expect;

/* 引入后期创建的自定义模块，以便于通过 test */
const parseRDF = require('../lib/parse-rdf');

/* 加载 RDF 文件。因为本例需要等文件完全读取后才能正确测试，所以使用同步读取文件 */
const rdf = fs.readFileSync(`${__dirname}/pg132.rdf`);

/* Mocha 的 describe 和 it 函数 声明尚未实现的 parseRDF 函数行为。断言 parseRDF 是一个函数 */
describe('parseRDF', () => {
    it('shoule be a function', () => {
        expect(parseRDF).to.be.a('function');
    });

    /* 当调用 parseRDF 方法时，断言将得到一个对象 */
    it('shoule parse RDF content', () => {
        const book = parseRDF(rdf);
        expect(book).to.be.an('object');
    });

    /* 断言返回的对象的 id 包含数字 132 */
    it('shoule parse RDF content', () => {
        const book = parseRDF(rdf);
        expect(book).to.be.an('object');
        expect(book).to.be.have.a.property('id', 132);
        /* 测试标题属性 */
        expect(book).to.have.a.property('title', 'The Art of War');

        /* 测试作者数组 */
        expect(book).to.have.a.property('authors')
            .that.is.an('array')
            .with.lengthOf(2)
            .and.contains('Sunzi, active 6th century B.C.')
            .and.contains('Giles, Lionel');

        /* 测试主题列表 */    
        expect(book).to.have.a.property('subjects')
        .that.is.an('array')
        .with.lengthOf(2)
        .and.contains('Military art and science -- Early works to 1800')
        .and.contains('War -- Early works to 1800');
    });
})


//运行之前，需要将 pg132.rdf 测试文件复制到 test 目录下
//npm test

//npm run test:watch    持续监听