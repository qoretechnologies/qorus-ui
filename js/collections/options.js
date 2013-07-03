define([
  'settings',
  'underscore',
  'qorus/qorus',
  // Pull in the Model module from above
  'models/option'
], function(settings, _, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    url: settings.REST_API_PREFIX + '/system/options',
    model: Model,
    sort_key: 'status',
    sort_order: 'des',
    
  	initialize: function(opts){
      this.sort_key = 'status';
      this.sort_order = 'des';
      this.sort_history = ['name',];
      this.opts = opts || {};
      console.log("Sorting:", this.sort_key, opts);
    }
  });
  // You don't usually return a collection instantiated
  return Collection;
});
