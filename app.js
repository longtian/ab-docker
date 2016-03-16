var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var config = require('rc')('ab-docker');
var request = require('request');
var url = require('url');
var httpProxy = require('http-proxy');
var http = require('http');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));
app.use(express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/docker_machines.json', function (req, res) {

});

var dockers = [
  url.parse(config.DOCKER)
];

app.post('/docker', function (req, res) {
  if (req.body.href && req.body.href.length) {
    dockers.push(url.parse(req.body.href));
  }
  res.end('ok');
});

app.get('/dockers', function (req, res) {
  res.json(dockers);
});

app.get('/dockers/:id', function (req, res) {
  var href = dockers[req.params.id].href;
  request.get(`${href}/containers/json`).pipe(res)
})


var target = null;
var proxy = httpProxy.createServer({});
var server = http.createServer(function (req, res) {
  proxy.web(req, res, { target: "http://" + target });
});
app.put('/target', function (req, res) {
  var docker = dockers[req.body.docker];
  if (docker) {
    target = docker.hostname + ":" + req.body.port;
    return res.json(target);
  } else {
    res.statusCode = 404;
    res.end();
  }
});

app.get('/target', function (req, res) {
  res.json(target);
})

server.listen(config.PORT);

module.exports = app;