const path = require('path');
const fs = require('fs');

module.exports = function(dir, check) {
  function filter(file) {
    if (typeof file !== 'string') {
      return false;
    }
    if(file.substr(0, 1) === '.') {
      return false;
    }
    if(/min\.js$/.test(file)) {
      return false;
    }
    if (typeof check === 'string') {
      return file === check;
    } else {
      return  check(file);
    }
  }
  
  const fileList = [];
  fs.readdirSync(dir).filter(function(file) {
    const filename = path.basename(file);
    if (filter(filename)) {
      fileList.push(file);  
    } 
  });
  
  return fileList;
  
};
