const path = require('path');
const src = path.join(__dirname, '../../source');
const destBuildPath = path.join(__dirname, '../../build');
const mtopPath = path.join(src, 'mtop');
module.exports = {
  src,
  destBuildPath,
  mtopPath,
};