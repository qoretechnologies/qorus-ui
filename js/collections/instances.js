define([
  'underscore',
  'libs/backbone.rpc',
  // Pull in the Model module from above
  'models/instance'
], function(_, Backbone, Model){
  var Collection = Backbone.Collection.extend({
  	url: '/JSON',
  	rpc: new Backbone.Rpc({
  		 namespaceDelimiter: ''
  	}),	
    model: Model,
	methods: {
		read: ['omq.system.service.info.getWorkflowInstances', 'workflowid']
	}

  });
  // You don't usually return a collection instantiated
  return Collection;
});