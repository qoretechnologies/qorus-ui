define(function(require) {
  var settings = require('settings'),
      _        = require('underscore'),
      $        = require('jquery'),
      Qorus    = require('qorus/qorus'),
      Model;

  Model = Qorus.Model.extend({
    urlRoot: settings.REST_API_PREFIX + '/mappers',
    idAttribute: 'mapperid'    
  });

  return Model;
});
