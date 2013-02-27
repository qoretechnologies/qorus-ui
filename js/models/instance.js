define([
  'qorus/qorus'
], function(Qorus){
  var Model = Qorus.Model.extend({
	idAttribute: "instanceid",
  	methods: {
  		read: ['omq.system.service.info.getWorkflowInstances', 'workflowid'],
  	},

  });
  // Return the model for the module
  return Model;
});