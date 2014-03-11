define(function (require) {
  var settings = require('settings'),
      Qorus    = require('qorus/qorus'),
      Model    = require('models/function'),
      Collection;
  
  Collection = Qorus.SortedCollection.extend({
    url: settings.REST_API_PREFIX + '/functions',
    model: Model
  });
  
  return new Collection();
});
