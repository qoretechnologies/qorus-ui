define([
  'settings',
  'underscore',
  'qorus/qorus',
  'models/function'
], function(settings, _, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    url: settings.REST_API_PREFIX + '/functions',
    model: Model,

    initialize: function(opts){      
      this.opts = opts;
      
      Collection.__super__.initialize.call(this, opts);
    },
  });
  return Collection;
});