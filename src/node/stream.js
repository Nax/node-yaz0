const Yaz0StreamNode = require('./yaz0_node').Yaz0Stream;
const { Transform } = require('stream');

class Yaz0Stream extends Transform {
  constructor(mode, size, level) {
    super();
    this._nativeStream = new Yaz0StreamNode(mode, size, level);
    this._eof = false;
  }

  _transform(chunk, encoding, callback) {
    if (this._eof) {
      callback(new Error("Data after EOF"));
    }

    this._nativeStream.transform(chunk, encoding, (err, res) => {
      if (err) {
        callback(err);
      } else if (res === null) {
        this._eof = true;
        callback(null, null);
      } else if (res) {
        this.push(res);
      } else {
        callback();
      }
    });
  }

  _flush(callback) {
    if (!this._eof) {
      callback(new Error("Abrupt end of file"));
    } else {
      callback();
    }
  }
}

module.exports = Yaz0Stream;
