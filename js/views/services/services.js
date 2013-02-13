define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'collections/services',
  'text!/gui/templates/service/list.html'
], function($, _, Backbone, ServiceCollection, servicesTemplate){
  var ServiceListView = Backbone.View.extend({
    el: $("#content"),
    initialize: function(){
      this.collection = new ServiceCollection();
      // Compile the template using Underscores micro-templating
	  var view = this;
	  this.collection.fetch({
		  success: function(collection){
		      var compiledTemplate = _.template( servicesTemplate, { services: collection.models } );
		      view.$el.html(compiledTemplate);
		  }
	  });
    }
  });
  // Returning instantiated views can be quite useful for having "state"
  return ServiceListView;
});