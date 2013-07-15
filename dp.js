module.exports = DP;

var util = require('util');
var debug = util.debuglog ? util.debuglog('db') :
    /\bdb\b/i.test(process.env.NODE_DEBUG || '') ? console.error :
    function() {};

var assert = require('assert')
var stream = require('stream');
var Duplex = stream.Duplex;
var PassThrough = stream.PassThrough;

util.inherits(DP, Duplex);
function DP(stream, options) {
  if (!(this instanceof DP))
    return new DP(options);


  this._reader = new PassThrough(options);
  this._writer = new PassThrough(options);
  Duplex.call(this, options);

  if (stream)
    this.wrapStream(stream);

  this._reader.on('error', this.emit.bind(this));
  this._writer.on('error', this.emit.bind(this));

  this._readableState = this._reader._readableState;
  this._writableState = this._writer._writableState;
}

DP.prototype.wrapStream = function(stream) {
  assert(stream instanceof Duplex, 'Can only wrap duplexes');
  this._stream = stream;
  this._writer.pipe(stream).pipe(this._reader);
  this._reader.read(0);
  this._writer.read(0);
  stream.read(0);
};

DP.prototype.on = DP.prototype.addListener = function(ev, fn) {
  switch (ev) {
    case 'data':
    case 'end':
    case 'readable':
      return this._reader.on(ev, fn);
    case 'drain':
    case 'finish':
      return this._writer.on(ev, fn);
    default:
      return Duplex.prototype.on.call(this, ev, fn);
  }
};

DP.prototype.pipe = function(dest, opts) {
  return this._reader.pipe(dest, opts);
};

DP.prototype.setEncoding = function(enc) {
  return this._reader.setEncoding(enc);
};

DP.prototype.read = function(size) {
  return this._reader.read(size);
};

DP.prototype.end = function(chunk, enc, cb) {
  debug('end', chunk, enc);
  return this._writer.end(chunk, enc, cb);
};

DP.prototype.write = function(chunk, enc, cb) {
  debug('write', chunk, enc);
  return this._writer.write(chunk, enc, cb);
};
