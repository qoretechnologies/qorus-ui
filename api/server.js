var fs = require('fs');
var express = require('express');
var cors = require('cors')
var app = express();
var _ = require('lodash')._;
var colors = require('colors');
var path = require('path');

app.use(cors());

app.qorus = app.qorus || {};

app.qorus.resource_list = function resource_list(dir) {
  var resources = [];

  fs.readdir(path.resolve(__dirname, './res/', dir), function (err, files) {
    files.forEach(function (f) {
      if ((/^[^.](.*)\.json$/).test(f)) {
        var fpath = path.resolve(__dirname, './res/', dir, f);
        resources.push(require(fpath));
      }
    });
  });
  
  return resources;
};

app.qorus.resources = {};

app.qorus.resource_defs = [
  {
    name: 'workflows',
    idAttribute: 'workflowid'
  },
  {
    name: 'steps',
    idAttribute: 'stepid'
  },
  {
    name: 'system'
  },
  {
    name: 'remote'
  },
  {
    name: 'jobs',
    idAttribute: 'jobid'
  }
];

app.qorus.resource_defs.forEach(function (r) {
  app.qorus.resources[r.name] = app.qorus.resource_list(r.name);
});


app.get('/api/system$', function (req, res) {
  var wfl = require('./res/system/system.json');
  res.json(wfl);
});

app.get('/api/:resource', function (req, res, next) {
  if (app.qorus.resources[req.params.resource]) {
    res.json(app.qorus.resources[req.params.resource]);
  } else {
    next();
  }
  
});

app.get('/api/:resource/:id', function (req, res, next) {
  var resource = req.params.resource;
  if (app.qorus.resources[resource]) {
    var id = req.params.id;
    var idAttribute = _.find(app.qorus.resource_defs, { name: resource }).idAttribute || 'id';
    var obj = _.find(app.qorus.resources[resource], function (r) { return r[idAttribute] == id; });
    if (!obj) {
      obj = require(['.', 'res', req.params.resource, req.params.id].join('/') + '.json');
    }
    res.json(obj);
  } else {
    next();
//    res.status(404).send('Resource ' + req.params.resource + '/' + req.params.id + ' not found');
  }
});

app.get('/api/*', function (req, res) {
  var path = req.params[0];
  var resource = ['.', 'res', path.replace(/\/$/, '')].join('/') + '.json';
  try {
    res.json(require(resource));
  } catch (err) {
//    console.log(path + " not found".red);
    res.status(404).send('Resource ' + path + ' not found');
  }
});


// app.listen(3030);

module.exports = app;