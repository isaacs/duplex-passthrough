var assert = require('assert');

var DP = require('./dp.js');
var stream = require('stream');
var PassThrough = stream.PassThrough;

var p = new PassThrough();

var d = new DP();

d.write('hello, ');
d.write('world.');
d.end('\n');

d.setEncoding('utf8');
var out = '';
d.on('data', function(c) {
  out += c;
});


setTimeout(function() {
  d.wrapStream(p);
});

process.on('exit', function() {
  assert.equal(out, 'hello, world.\n');
  console.log('ok');
});
