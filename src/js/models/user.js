define(function (require) {
  var Qorus    = require('qorus/qorus'),
      settings = require('settings'),
      Model;
  
  Model = Qorus.Model.extend({
    idAttribute: "username",
    urlRoot: settings.REST_API_PREFIX + '/users/',
  });

  return Model;
});
