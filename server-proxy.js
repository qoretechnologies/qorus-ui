var app       = require('express')(),
//    ws        = require('express-ws')(app),
    request   = require('request'),
    host      = 'localhost',
    port      = 8001;


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(function(req, res, next) {
  var url = 'http://admin:admin@' + host + ':' + port + req.url;
  req.pipe(request(url)).pipe(res);
});

module.exports = app;