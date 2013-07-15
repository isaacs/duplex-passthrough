# duplex-passthrough

For when a single passthrough stream is not enough.

## USAGE

```javascript
var dp = new DuplexPassThrough(stream, options);
```

Or, if the stream is not available yet:

```javascript
var dp = new DuplexPassThrough(null, options);

// some time later..
dp.wrapStream(stream);
```

This is useful if you have to buffer up both sides of a duplex stream
for some reason, like if you want to read some bits of a socket, but
then send it somewhere else, or do other crazy stuff.
