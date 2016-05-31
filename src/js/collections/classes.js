define(function (require) {
  var Qorus    = require('qorus/qorus'),
      settings = require('settings'),
      Model    = require('models/class'),
      Collection;

  Collection =  Qorus.SortedCollection.extend({
    url: settings.REST_API_PREFIX + '/classes',
    model: Model,
    pagination: false
  });

  return new Collection();
});
