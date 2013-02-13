define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'collections/workflows',
  'text!/gui/templates/workflow/list.html'
], function($, _, Backbone, WorkflowCollection, workflowsTemplate){
  var WorkflowListView = Backbone.View.extend({
    el: $("#content"),
    initialize: function(){
      this.collection = new WorkflowCollection();
      // Compile the template using Underscores micro-templating
	  var view = this;
	  this.collection.fetch({
		  success: function(collection){
		      var compiledTemplate = _.template( workflowsTemplate, { workflows: collection.models } );
		      view.$el.html(compiledTemplate);
		  }
	  });
    }
  });
  // Returning instantiated views can be quite useful for having "state"
  return WorkflowListView;
});