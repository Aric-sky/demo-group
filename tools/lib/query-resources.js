const cheerio = require('cheerio');

/**
* query string dom script and link 
* @param htmlStr: html contents
* @param domSelector
**/
module.exports = function(htmlStr, domSelector) {
  const $ = cheerio.load(htmlStr);
  const resource = [];
  $(domSelector).each(function(index, item) {
    const attrObject = item.attribs;
    if (attrObject.href && (!/\/\/\w/.test(attrObject.href))) {
      return resource.push(attrObject.href);
    }
    if (attrObject.src && (!/\/\/\w/.test(attrObject.src))) {
      return resource.push(attrObject.src);
    }
  });
  return resource;
};