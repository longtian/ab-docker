var server = require('http').createServer();
var app = require('./app');
server.on('request', app);
server.listen(3001);
