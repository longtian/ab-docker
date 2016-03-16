var server = require('http').createServer();
var app = require('./app');
var config = require('rc')('ab-docker');
server.on('request', app);
server.listen(config.ADMIN_PORT);
