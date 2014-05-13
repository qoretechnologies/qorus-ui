define(function (require) {
  var settings = require('settings'),
      Qorus    = require('qorus/qorus'),
      Model    = require('models/option'),
      Collection;
  
  Collection = Qorus.SortedCollection.extend({
    url: settings.REST_API_PREFIX + '/system/options',
    model: Model,
    sort_key: 'status',
    sort_order: 'des',
    sort_history: ['name'],
    
    initialize: function (opts) {
      this.opts = opts || {};
    }
  });
  // You don't usually return a collection instantiated
  return Collection;
});
