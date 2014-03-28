define(function(require) {
  var settings = require('settings'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Model;
  
  Model = Qorus.Model.extend({
    idAttribute: 'job_instanceid',
    urlRoot: settings.REST_API_PREFIX + '/jobresults/',
    url: function () {
      return _.result(this, 'urlRoot') + _.result(this, 'id');
    },
    dateAttributes: ['started', 'modified', "errors.created", "audit.created"]
  });

  return Model;
});
