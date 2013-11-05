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
    pagination: false,
    
  	initialize: function (opts){
      debug.log('Service collection opts', opts);
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
