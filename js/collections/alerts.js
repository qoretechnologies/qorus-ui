define([
  'settings',
  'underscore',
  'qorus/qorus',
  'models/alert'
], function(settings, _, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    model: Model,
    url: function () {
      return settings.REST_API_PREFIX + '/system/alerts/' + this.type;
    },
    
    initialize: function (models, opts) {
      Collection.__super__.initialize.call(this, models, opts);
      if (opts.type) {
        this.type = opts.type;
      }
    },
    
    hasNextPage: function () {
      return false;
    }
  });
  // You don't usually return a collection instantiated
  return Collection;
});
