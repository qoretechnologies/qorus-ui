define([
  'libs/backbone.rpc',
  'qorus/qorus'
], function(Backbone, Qorus){
  var Model = Qorus.Model.extend({
	idAttribute: "workflowid",
  	methods: {
  		read: ['omq.system.service.webapp.getWorkflowDetail', 'id'],
		start: ['omq.system.start-workflow', 'params'],
		stop: ['omq.system.stop-workflow', 'name', 'version'],
		reset: ['omq.system.reset-workflow', 'name', 'version'],
  	}
  });
  // Return the model for the module
  return Model;
});