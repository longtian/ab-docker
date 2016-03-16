var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var config = require('rc')('ab-docker');
var request = require('request');
var url = require('url');
var http = require('http');
var errorHandler = err=>console.error(err);
var proxy = require('./proxyServer');

var MODES = {
  PROXY: "proxy",
  REDIRECT: "redirect"
}
/**
 * static
 */
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));
app.use(express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

/**
 * middlewares
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var dockers = [];
var target = null;
var mode = "proxy";

if (config.DOCKER) {
  // 读取默认配置
  dockers = dockers.concat(config.DOCKER.split(",").map(url.parse));

  console.log('default docker hosts:');
  console.log(dockers);

}

if (config.MODE) {
  mode = config.MODE;
}

app.post('/docker', function (req, res) {
  if (req.body.href && req.body.href.length) {
    dockers.push(url.parse(req.body.href));
    res.end('ok');
  } else {
    res.statusCode = 400;
    res.end('wrong format');
  }
});

app.get('/dockers', function (req, res) {
  res.json(dockers);
});

app.get('/dockers/:id', function (req, res) {
  if (!req.params.id) {
    res.statusCode = 400;
    return res.end("id is not provided");
  }
  var href = dockers[req.params.id].href;
  var r = request.get(`${href}/containers/json`);
  r.on('error', errorHandler);
  r.pipe(res);
})


app.put('/target', function (req, res) {
  if (req.body.target) {
    target = req.body.target
  }
  res.end();
});

app.get('/target', function (req, res) {
  res.json(target);
});

app.put('/mode', function (req, res) {
  if (req.body.mode) {
    mode = req.body.mode
  }
  res.end();
});

app.get('/mode', function (req, res) {
  res.json(mode);
});


var server = http.createServer(function (req, res) {
  if (!target) {
    res.statusCode = 400;
    return res.end('proxy not ready,tell Lao Wang please.');
  }

  if (mode == MODES.REDIRECT) {
    res.writeHead(302, { 'Location': target + req.url });
    res.end();
  } else if (mode == MODES.PROXY) {
    proxy.web(req, res, { target: target });
  } else {
    res.statusCode = 400;
    return res.end('mode not defined,tell Lao Wang please.');
  }
});
server.listen(config.PORT);

module.exports = app;