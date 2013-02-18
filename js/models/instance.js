define([
  'libs/backbone.rpc'
], function(Backbone){
  var Model = Backbone.Model.extend({
	idAttribute: "instanceid",
  	url: '/JSON',
  	rpc: new Backbone.Rpc({
  		 namespaceDelimiter: ''
  	}),
  	methods: {
  		read: ['omq.system.service.info.getWorkflowInstances', 'workflowid'],
  	},

  });
  // Return the model for the module
  return Model;
});