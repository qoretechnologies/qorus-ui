define([
  'settings',
  'underscore',
  'qorus/qorus',
  // Pull in the Model module from above
  'models/service'
], function(settings, _, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    limit: 1000,
    url: settings.REST_API_PREFIX + '/services/',
    model: Model,
    
  	initialize: function(opts){
      this.sort_key = 'threads';
      this.sort_order = 'des';
      this.sort_history = ['name',];
      this.opts = opts;

      if (opts) {
        this.date = opts.date;
      }
  	}
  });
  return Collection;
});
