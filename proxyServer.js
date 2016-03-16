var httpProxy = require('http-proxy');
var proxy = httpProxy.createServer({});
proxy.on('error', error=>console.error(error));
proxy.on('proxyReq', function (proxyReq, req, res, options) {
  proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
});
module.exports = proxy;