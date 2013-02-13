define([
  'underscore',
  'backbone',
  'libs/backbone.rpc',
  // Pull in the Model module from above
  'models/workflow'
], function(_, Backbone, Rpc, WorkflowModel){
  var WorkflowCollection = Backbone.Collection.extend({
  	url: '/JSON',
  	rpc: new Backbone.Rpc({
  		 namespaceDelimiter: ''
  	}),	
    model: WorkflowModel,
	methods: {
		read: ['omq.system.service.webapp.getWorkflowOverview']
	}
  });
  // You don't usually return a collection instantiated
  return WorkflowCollection;
});