define([
  'libs/backbone.rpc'
], function(Backbone){
  var WorkflowModel = Backbone.Model.extend({
	idAttribute: "workflowid",
  	url: '/JSON',
  	rpc: new Backbone.Rpc({
  		 namespaceDelimiter: ''
  	}),
  	methods: {
  		read: ['omq.system.service.webapp.getWorkflowDetail', 'id'],
		start: ['omq.system.start-workflow', 'params'],
		stop: ['omq.system.stop-workflow', 'name', 'version'],
		reset: ['omq.system.reset-workflow', 'name', 'version'],
  	}
  });
  // Return the model for the module
  return WorkflowModel;
});