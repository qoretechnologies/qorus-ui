define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'collections/workflows',
  'text!/templates/workflow/list.html'
], function($, _, Backbone, WorkflowCollection, workflowsTemplate){
  var ListView = Backbone.View.extend({
    el: $("#content"),
	events: {
		'click .start': 'start',
		'click .check': 'highlight',
		'click .check-all': 'checkall',
		'click .uncheck-all': 'checkall',
	},
    initialize: function(){
	  _.bindAll(this, 'render');
      this.collection = new WorkflowCollection();
	  this.collection.on('reset', this.render);
	  this.collection.fetch()
    },
	render: function(){
        var compiledTemplate = _.template( workflowsTemplate, { workflows: this.collection.models } );
        this.$el.html(compiledTemplate);
		return this;
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
	},
	// toggle select row
	highlight: function(e){
		var el = e.currentTarget;
		$(el).toggleClass('icon-box').toggleClass('icon-check');
		$(el).parents('.workflow-row').toggleClass('warning');
	},
	// toggle select on all rows
	checkall: function(e){
		var el = e.currentTarget;

		// behaviour switcher
		if ($(el).hasClass('check-all')){
			$(el).toggleClass('icon-box').toggleClass('icon-check')
				.toggleClass('check-all').toggleClass('uncheck-all');
			$('.workflow-row').addClass('warning').addClass('checked');
			$('.workflow-row .check').removeClass('icon-box').addClass('icon-check');
		} else {
			$(el).toggleClass('icon-box').toggleClass('icon-check')
				.toggleClass('check-all').toggleClass('uncheck-all');
			$('.workflow-row').removeClass('warning').removeClass('checked');
			$('.workflow-row .check').removeClass('icon-check').addClass('icon-box');
		}
	}
  });
  // Returning instantiated views can be quite useful for having "state"
  return ListView;
});
