define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'collections/jobs',
  'text!/templates/job/list.html'
], function($, _, Backbone, Collection, Template){
  var ListView = Backbone.View.extend({
    el: $("#content"),
    initialize: function(){
      this.collection = new Collection();
      // Compile the template using Underscores micro-templating
	  var view = this;
	  this.collection.fetch({
		  success: function(collection){
		      var compiledTemplate = _.template( Template, { jobs: collection.models } );
		      view.$el.html(compiledTemplate);
		  }
	  });
    }
  });
  // Returning instantiated views can be quite useful for having "state"
  return ListView;
});
