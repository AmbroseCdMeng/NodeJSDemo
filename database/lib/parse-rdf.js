
/*
    模块实现.
*/

'use strict';

/* 引入 cheerio 模块 */
const cheerio = require('cheerio');

/* 将一个函数值复制给 module.exports。尽管这个函数只接受一个 rdf 参数且无返回值 */
module.exports = rdf => {

    /* 使用 cheerio 的 load 方法解析 rdf 内容，返回的 $ 函数类似于 JQuery 的 $ */
    const $ = cheerio.load(rdf);

    const book = {};

    /* 使用 cheerio 的 API 提取本书的编号并格式化 */
    /**
     * XML 内容：
     *  <pgerms:ebook rdf:about="ebooks/132">
     *      <...>
     *      </...>
     *  </pgerms:ebook> 
     * 
     * 选择器的含义：
     *  $('pgterms:ebook') 标签。因 : 是 CSS 的伪选择器，有特殊含义，所以用 \\  转义
     *  rdf:about。查找到的 pgterms:ebook 标签后提取 rdf:about 属性的值
     *  ebooks/。替换 rdf:about 属性的值中的 ebooks/ 字符串为空字符串，只保留数字
     *  + 在首位是为了确保将最终查找到的结果转为数字类型
     */
    book.id = +$('pgterms\\:ebook').attr('rdf:about').replace('ebooks/','');

    /**
     * 提取 XML 中的标题 title 属性
     * XML 内容
     *  <dcterms:title>The Art of War</dcterms:titles>
     */
    book.title = $('dcterms\\:title').text();

    /**
     * 提取作者数组
     * XML内容
     *  <dcterms:creator>
     *      <pgterms:agent rdf:about="2009/agents/4349">
     *          <pgterms:name>Sunzi, active 6th century B.C.</pgterms:name>
     *          <pgterms:webpage rdf:resource="http://zh.wikipedia.org/wiki/%E5%AD%99%E6%AD%A6"/>
     *          <pgterms:alias>Sun Tzu</pgterms:alias>
     *          <pgterms:alias>孙子</pgterms:alias>
     *          <pgterms:alias>孫子</pgterms:alias>
     *          <pgterms:webpage rdf:resource="http://en.wikipedia.org/wiki/Sun_Tzu"/>
     *      </pgterms:agent>
     *  </dcterms:creator>
     */

    //Cheerio 的 text 方法只会返回字符串。不会转成字符串数组。
    //book.authors = $('pgterms\\:agent pgterms\\:name').text();

    book.authors = $('pgterms\\:agent pgterms\\:name').toArray().map(elem => $(elem).text());


    /**
     * 提取主题数组
     * 
     */

     book.subjects = $('dcterms\\:subject rdf\\:value');// 但是这个选择器除了匹配到主题以外，还匹配到了其他不需要的标签
     /* [rdf\\:resource$="/LCSH"]   使用中括号引入 CSS 选择器。 $= 表示需要 rdf:resource 属性以 /LCSH 结尾的元素 */
     book.subjects = $('[rdf\\:resource$="/LCSH"]').parent().find('rdf\\:value').toArray().map(elem => $(elem).text());
    return book;
}