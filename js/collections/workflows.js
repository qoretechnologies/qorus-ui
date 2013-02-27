define([
  'underscore',
  'libs/backbone.rpc',
  'qorus/qorus',
  'models/workflow'
], function(_, Backbone, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    date: null,
    model: Model,
	methods: {
		read: ['omq.system.service.webapp.getWorkflows', 'date'],
	},
	initialize: function(date){
		this.sort_by = 'name';
		this.sort_order = 'asc';
        this.sort_history = ['',];
        if(date){
            this.date = date;
        }
	}
  });
  // You don't usually return a collection instantiated
  return Collection;
});