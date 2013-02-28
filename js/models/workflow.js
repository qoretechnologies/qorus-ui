define([
  'libs/backbone.rpc',
  'qorus/qorus'
], function(Backbone, Qorus){
  var Model = Qorus.Model.extend({
	idAttribute: "workflowid",
  date: null,
  wflid: function(){
    return [this.id,];
  },
	methods: {
  	read: ['omq.system.service.webapp.getWorkflows', 'date', 'wflid'],
  	start: ['omq.system.start-workflow', 'params'],
  	stop: ['omq.system.stop-workflow', 'name', 'version'],
  	reset: ['omq.system.reset-workflow', 'name', 'version'],
	}
  });
  // Return the model for the module
  return Model;
});