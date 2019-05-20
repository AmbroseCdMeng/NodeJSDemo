
/*
    利用之前完善的数据提取 rdf-to-json.js 和 parse-rdf-test.js
    可以快速的提取其他的 RDF 文件
*/

const fs = require('fs');
const parseRDF = require('./lib/parse-rdf');
const rdf = fs.readFileSync(process.argv[2]);
const book = parseRDF(rdf);

console.log(JSON.stringify(book, null, '  '));