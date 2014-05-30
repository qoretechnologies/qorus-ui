define(function (require) {
  var Qorus    = require('qorus/qorus'),
      settings = require('settings'),
      Model    = require('models/class'),
      Collection;
  
  Collection = Qorus.Collection.extend({
    url: settings.REST_API_PREFIX + '/classes',
    model: Model
  });
  
  return new Collection();
});
