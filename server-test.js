var express = require('express'),
    app     = express(),
    fs      = require('fs'),
    path    = require('path');


app.use(function(req, res, next) {
  var url = req.path.replace(/^\/|\/$/g, '');
  var fpath = path.resolve(__dirname, 'src', url);

  fs.stat(fpath, function (err, stats) {
    if (err) {
      next();
    } else {
      if (stats.isFile()) {
        res.status(200).sendFile(fpath);
      } else {
        next();
      }      
    }
  });
});

app.use(function (req, res, next) {
  res.status(200).sendFile(path.resolve(__dirname, 'src', 'index.html'));
});

module.exports = app;