define([
  'libs/backbone.rpc'
], function(Backbone){
  var WorkflowModel = Backbone.Model.extend({
	idAttribute: "workflowid",
  	url: '/JSON',
  	rpc: new Backbone.Rpc({
  		 namespaceDelimiter: ''
  	}),
	mrdat: function () {
		return 'calimero';
	},
  	methods: {
  		read: ['omq.system.service.info.getWFIAllInfo'],
		start: ['omq.system.start-workflow', 'params'],
		stop: ['omq.system.stop-workflow', 'name', 'version'],
		reset: ['omq.system.reset-workflow', 'name', 'version']
  	},

  });
  // Return the model for the module
  return WorkflowModel;
});