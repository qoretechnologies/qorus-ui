define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'models/workflow',
  'text!/gui/templates/workflow/detail.html',
  'collections/instances'
], function($, _, Backbone, Workflow, Template, InstanceCollection){
  var ModelView = Backbone.View.extend({
    el: $("#content"), 
    initialize: function(id){
      this.model = new Workflow({id: id});
      // Compile the template using Underscores micro-templating
	  var view = this;
	  this.model.fetch({
		  success: function(model){
		      var compiledTemplate = _.template( Template, { item: model } );
		      view.$el.html(compiledTemplate);
			  var instances = new InstanceCollection({ workflowid: model.id });
		  }
	  });
    }
  });
  // Returning instantiated views can be quite useful for having "state"
  return ModelView;
});