var server = require('http').createServer();
var config = require('rc')('ab-docker');
var app = require('./app');

console.log('config');
console.log(JSON.stringify(config, null, 2));

server.on('request', app);
server.listen(config.ADMIN_PORT);

['SIGINT', 'SIGTERM'].forEach(sig=> {
  process.on(sig, ()=> {
    console.log(sig);
    process.exit(0);
  });
});