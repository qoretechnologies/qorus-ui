define([
  'underscore',
  'backbone',
  'libs/backbone.rpc'
], function(_, Backbone, Rpc){
  var ServiceModel = Backbone.Model.extend({
	idAttribute: "serviceid",
  	url: '/JSON',
  	rpc: new Backbone.Rpc({
  		 namespaceDelimiter: ''
  	}),
  	methods: {
  		read: ['omq.system.service.webapp.getServiceMetadata']
  	}
  });
  // Return the model for the module
  return ServiceModel;
});