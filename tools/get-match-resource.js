const path = require('path');
const loopDir = require('./lib/loop-dir');
const fs = require('fs');

const buildpath = path.join(__diranme, 'build'); 
/**
* loop thhrough the dractory and find the same name js or css
* @param name: the file name
* @parma ext: the extension of the file you search
**/
module.exports = function(name, ext) {
  const targetSource = path.join(buildpath, ext);
  const list = loopDir(targetSource, function(file) {
    const filename = file.split('.')[0];
    if (filename === name) {
      return true;
    }
    return false;
  });
  return list[0]; 
};
