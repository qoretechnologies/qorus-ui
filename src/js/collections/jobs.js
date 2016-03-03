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
      this.sort_key = 'name';
      this.sort_order = 'asc';
      this.sort_history = ['-version'];
      this.opts = opts || {};
    }
  });
  // You don't usually return a collection instantiated
  return Collection;
});
