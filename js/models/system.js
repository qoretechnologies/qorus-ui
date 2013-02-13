define([
  'underscore',
  'backbone',
  'libs/backbone.rpc'
], function(_, Backbone, Rpc){
  var Model = Backbone.Model.extend({
  	url: '/JSON',
  	rpc: new Backbone.Rpc({
  		 namespaceDelimiter: ''
  	}),
  	methods: {
  		read: ['omq.system.get-status']
  	}
  });
  // Return the model for the module
  return Model;
});