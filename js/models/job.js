define([
  'underscore',
  'backbone',
  'libs/backbone.rpc'
], function(_, Backbone, Rpc){
  var Model = Backbone.Model.extend({
    idAttribute: "jobid",
  	url: '/JSON',
  	rpc: new Backbone.Rpc({
  		 namespaceDelimiter: ''
  	}),
  	methods: {
  		read: ['omq.system.service.webapp.getJobOverview']
  	}
  });
  // Return the model for the module
  return Model;
});