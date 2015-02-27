var app       = require('express')(),
//    ws        = require('express-ws')(app),
    request   = require('request'),
    host      = 'localhost',
    user      = 'admin',
    password  = 'admin',
    protocol  = 'http',
    port      = 8001;
//    host = 'isepl.it.internal',
//    port = 7900,
//    protocol = "https",
//    user = 'seplmon',
//    pass = 'sepl4READ';


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(function(req, res, next) {
  var url = [protocol, '://', user, ':', pass, '@', host, ':', port, req.url].join('');
  console.log(url);
  req.pipe(request({ url: url, rejectUnauthorized : false })).pipe(res);
});

module.exports = app;