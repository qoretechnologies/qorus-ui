define(function (require) {
  var Qorus    = require('qorus/qorus'),
      settings = require('settings'),
      Model;
  
  Model = Qorus.Model.extend({
    idAttribute: 'role',
    urlRoot: settings.REST_API_URL + '/roles/'
  });

  return Model;
});
