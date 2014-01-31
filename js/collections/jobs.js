define([
  'settings',
  'underscore',
  'qorus/qorus',
  // Pull in the Model module from above
  'models/job'
], function(settings, _, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    url: settings.REST_API_PREFIX + '/jobs/',
    model: Model,
    pagination: false,
    
    initialize: function (opts) {
      this.sort_key = 'active';
      this.sort_order = 'des';
      this.sort_history = ['name',];
      this.opts = {};
    }
  });
  // You don't usually return a collection instantiated
  return Collection;
});