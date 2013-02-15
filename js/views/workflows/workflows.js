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
	events: {
		'click .start': 'start'
	},
    initialize: function(){
      this.collection = new WorkflowCollection();
      // Compile the template using Underscores micro-templating
	  var view = this;
	  this.collection.fetch({
		  success: function(collection){
		      var compiledTemplate = _.template( workflowsTemplate, { workflows: collection.models } );
		      view.$el.html(compiledTemplate);
			  // set params as a workaround for backbone.rpc call of actions 
			  _.each(collection.models, function(el){
				  el.set('params', {'name': el.get('name'), 'version': el.get('version')});
			  })
		  }
	  });
    },
	// starts workflow
	start : function(e){
		e.preventDefault();
		var workflowid = e.currentTarget.dataset.id;
		var wfl = this.collection.get(workflowid);
		wfl.start({
			success: function(el, xhr){
				console.log(xhr)
				$('#alert-info').children('.alert-heading').html('Workflow: '+el.get('name') + ' started');
				$('#alert-info').alert().addClass('in');
				window.setTimeout(function(){
					$('#alert-info').removeClass('in');	
				}, 2000);
			}
		});
	},
	// stops workflow
	stop : function(e){
		e.preventDefault();
		var workflowid = e.currentTarget.dataset.id;
		var wfl = this.collection.get(workflowid);
		wfl.stop();
	},
	// reset workflow
	reset : function(e){
		e.preventDefault();
		var workflowid = e.currentTarget.dataset.id;
		var wfl = this.collection.get(workflowid);
		wfl.reset();
	}
  });
  // Returning instantiated views can be quite useful for having "state"
  return WorkflowListView;
});