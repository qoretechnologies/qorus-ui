define([
  'libs/backbone.rpc',
  'qorus/qorus'
], function(Backbone, Qorus){
  var Model = Qorus.Model.extend({
    defaults: {
      'name': "Workflow name",
      'IN-PROGRESS': 0,
      'READY': 0,
      'SCHEDULED': 0,
      'COMPLETE': 0,
      'INCOMPLETE': 0,
      'ERROR': 0,
      'CANCELED': 0,
      'RETRY': 0,
      'WAITING': 0,
      'ASYNC-WAITING': 0,
      'EVENT-WAITING': 0,
      'IN-PROGRESS': 0,
      'BLOCKED': 0,
      'CRASH': 0
    },
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