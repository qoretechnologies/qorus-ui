define(function (require) {
  var settings = require('settings'),
      Qorus    = require('qorus/qorus'),
      Model    = require('models/role'),
      Collection;
  
  Collection = Qorus.SortedCollection.extend({
    url: settings.REST_API_PREFIX + '/roles/',
    model: Model
  });

  return Collection;
});
