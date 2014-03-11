define(function (require) {
  var settings = require('settings'),
      Qorus    = require('qorus/qorus'),
      Model    = require('models/job'),
      Collection;

  
  Collection = Qorus.SortedCollection.extend({
    url: settings.REST_API_PREFIX + '/jobs/',
    model: Model,
    pagination: false,
    
    initialize: function (models, opts) {
      this.sort_key = 'active';
      this.sort_order = 'des';
      this.sort_history = ['name'];
      this.opts = opts || {};
    }
  });
  // You don't usually return a collection instantiated
  return Collection;
});
