define([
  'underscore',
  'libs/backbone.rpc',
  'qorus/qorus',
  'models/workflow'
], function(_, Backbone, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    url: '/rest/workflows/',
    date: null,
    model: Model,
  	initialize: function(opts){
  		this.sort_key = 'exec_count';
  		this.sort_order = 'des';
      this.sort_history = ['name',];
      if(opts){
          this.date = opts.date;
      }
  	}
  });
  return Collection;
});