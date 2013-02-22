define([
  'underscore',
  'backbone',
  'libs/backbone.rpc',
  // Pull in the Model module from above
  'models/service'
], function(_, Backbone, Rpc, Model){
  var Collection = Backbone.Collection.extend({
  	url: '/JSON',
  	rpc: new Backbone.Rpc({
  		 namespaceDelimiter: ''
  	}),	
    model: Model,
	methods: {
		read: [
			['omq.system.service.webapp.getServiceMetadata'],
			// ['omq.system.service.webapp.getServiceOverview'],
		]
		// read: ['omq.system.list-all-services']
	}
  });
  // You don't usually return a collection instantiated
  return Collection;
});