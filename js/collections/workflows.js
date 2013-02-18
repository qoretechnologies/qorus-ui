define([
  'underscore',
  'libs/backbone.rpc',
  // Pull in the Model module from above
  'models/workflow'
], function(_, Backbone, Model){
  var Collection = Backbone.Collection.extend({
  	url: '/JSON',
  	rpc: new Backbone.Rpc({
  		 namespaceDelimiter: ''
  	}),	
    model: Model,
	methods: {
		read: ['omq.system.service.webapp.getWorkflowOverview']
	}
  });
  // You don't usually return a collection instantiated
  return Collection;
});