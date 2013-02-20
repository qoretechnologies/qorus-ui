define([
  'underscore',
  'backbone',
  'libs/backbone.rpc',
  // Pull in the Model module from above
  'models/job'
], function(_, Backbone, Rpc, Model){
  var Collection = Backbone.Collection.extend({
  	url: '/JSON',
  	rpc: new Backbone.Rpc({
  		 namespaceDelimiter: ''
  	}),	
    model: Model,
	methods: {
		// read: ['omq.system.service.webapp.getJobOverview']
  		read: ['omq.system.service.info.getJobOverview']
		// read: ['omq.system.service.webapp.getJobOverview']
	}
  });
  // You don't usually return a collection instantiated
  return Collection;
});