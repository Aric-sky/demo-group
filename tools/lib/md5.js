/**
* get file md5
**/
const Buffer = require("buffer").Buffer;
module.exports = function(data) {
  const buf = new Buffer(data);
  const str = buf.toString("binary");
  const crypto = require("crypto");
  return crypto.createHash("md5").update(str).digest("hex").substr(0,10);
};
