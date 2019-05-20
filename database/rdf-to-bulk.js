
/**
 * 遍历所有 RDF 文件，通过解析器解析
 */

 'use strict';

 const dir = require('node-dir');
 const parseRDF = require('./lib/parse-rdf');

 const dirname = process.argv[2];

 const options = {
     match:/\.rdf$/,//正则匹配
     exclude:['pg0.rdf'],//忽略 id = 0 的模板
 };

 dir.readFiles(dirname, options, (err, content, next) => {
     if(err) throw err;
     const doc = parseRDF(content);
     console.log(JSON.stringify({index:{_id:`pg${doc.id}`}}));
     console.log(JSON.stringify(doc));
     next();
 });


 //node rdf-to-bulk.js ../data/cache/epub/ | head