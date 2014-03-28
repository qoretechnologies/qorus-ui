define(function (require) {
  var settings = require('settings'),
      Qorus    = require('qorus/qorus'),
      Model    = require('models/step'),
      Collection;
  
  Collection = Qorus.SortedCollection.extend({
    url: settings.REST_API_PREFIX + '/steps/',
    model: Model
  });

  return Collection;
});
