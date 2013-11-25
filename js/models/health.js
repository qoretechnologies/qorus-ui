define(function (require) {
  var settings = require('settings'),
    Qorus = require('qorus/qorus'),
    Model;
    
  Model = Qorus.Model.extend({
    url: settings.REST_API_PREFIX + "/system/health"
  });
  
  return Model;
});