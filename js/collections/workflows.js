define([
  'underscore',
  'libs/backbone.rpc',
  'qorus/qorus',
  'models/workflow'
], function(_, Backbone, Qorus, Model){
  var Collection = Qorus.SortedCollectionBase.extend({
    url: '/rest/workflows/',
    date: null,
    model: Model,
  	initialize: function(opts){
  		this.sort_by = 'name';
  		this.sort_order = 'asc';
      this.sort_history = ['',];
      if(opts){
          this.date = opts.date;
      }
  	}
  });
  return Collection;
});