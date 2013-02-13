define([
  'underscore',
  'backbone',
  'libs/backbone.rpc'
], function(_, Backbone, Rpc){
  var WorkflowModel = Backbone.Model.extend({
  	url: '/JSON',
  	rpc: new Backbone.Rpc({
  		 namespaceDelimiter: ''
  	}),
  	methods: {
  		read: ['omq.system.service.info.getWFIAllInfo']
  	}
  });
  // Return the model for the module
  return WorkflowModel;
});