define(function (require) {
  var settings = require('settings'),
      Qorus    = require('qorus/qorus'),
      Model    = require('models/mapper'),
      Collection;
  
  Collection = Qorus.SortedCollection.extend({
    url: settings.REST_API_PREFIX + '/mappers',
    model: Model,
    sort_key: 'name',
    
    initialize: function (models, opts) {
      this.opts = opts || {};
    }
  });

  return Collection;
});