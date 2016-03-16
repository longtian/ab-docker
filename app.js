var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var config = require('rc')('ab-docker');
var request = require('request');
var url = require('url');
var httpProxy = require('http-proxy');
var http = require('http');

var errorHandler = function (err) {
  if (err) {
    console.error(err);
  }
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));
app.use(express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var dockers = [];

if (config.DOCKER) {
  dockers.push(url.parse(config.DOCKER))
}

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
  var r = request.get(`${href}/containers/json`);
  r.on('error', errorHandler);
  r.pipe(res);
})

var target = null;
var proxy = httpProxy.createServer({});
proxy.on('error', errorHandler);

proxy.on('proxyReq', function (proxyReq, req, res, options) {
  proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
});

var server = http.createServer(function (req, res) {
  if (!target) {
    res.statusCode = 400;
    return res.end('proxy not ready,tell Lao Wang please.');
  }

  if (config.REDIRECT) {

    console.log(req.url);

    res.writeHead(302, { 'Location': target + req.url });
    res.end();
  } else {
    proxy.web(req, res, { target: target });
  }
});

app.put('/target', function (req, res) {
  var docker = dockers[req.body.docker];
  if (docker) {
    target = 'http://' + docker.hostname + ":" + req.body.port;
    return res.json(target);
  } else {
    res.statusCode = 404;
    res.end();
  }
});

app.get('/target', function (req, res) {
  res.json((config.REDIRECT ? "redirect" : "proxy") + " : " + target);
});

server.listen(config.PORT);

module.exports = app;