define([
  'settings',
  'underscore',
  'backbone',
  'qorus/qorus',
  'models/workflow'
], function(settings, _, Backbone, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    url: settings.REST_API_PREFIX + '/workflows/',
    date: null,
    model: Model,
    
  	initialize: function(opts){
      this.sort_key = 'exec_count';
      this.sort_order = 'des';
      this.sort_history = ['name',];
      this.opts = {};
      this.opts.deprecated = false;

      if (opts) {
          this.date = opts.date;
          if (opts.opts) {
            this.opts.deprecated = (opts.opts.deprecated == 'hidden'); 
          }
      }
      
      debug.log("deprecated",this.opts.deprecated, this.opts);
  	}
  });
  return Collection;
});