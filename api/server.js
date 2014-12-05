var fs = require('fs');
var express = require('express');
var cors = require('cors')
var app = express();
var _ = require('lodash')._;

app.use(cors());


function resource_list(dir) {
  var resources = [];

  fs.readdir('./res/'+dir, function (err, files) {
    files.forEach(function (f) {
      if ((/^[^.](.*)\.json$/).test(f)) {
        resources.push(require('./res/'+dir+'/'+f));
      }
    });
  });
  
  return resources;
}

var resources = {};

var resource_defs = [
  {
    name: 'workflows',
    idAttribute: 'workflowid'
  },
  {
    name: 'steps',
    idAttribute: 'stepid'
  }
];

resource_defs.forEach(function (r) {
  resources[r.name] = resource_list(r.name);
});


app.get('/api/system', function (req, res) {
  var wfl = require('./res/system/system.json');
  res.json(wfl);
});

app.get('/api/:resource', function (req, res) {
  if (resources[req.params.resource]) {
    res.json(resources[req.params.resource]);
  } else {
    res.status(404).send('Resource ' + req.params.resource + ' not found');
  }
});

app.get('/api/:resource/:id', function (req, res) {
  var resource = req.params.resource;
  if (resources[resource]) {
    var id = req.params.id;
    var idAttribute = _.find(resource_defs, { name: resource }).idAttribute || 'id';
    var obj = _.find(resources[resource], function (r) { return r[idAttribute] == id; });
    res.json(resources[req.params.resource]);
  } else {
    res.status(404).send('Resource ' + req.params.resource + '/' + req.params.id + ' not found');
  }
});


app.listen(3030);