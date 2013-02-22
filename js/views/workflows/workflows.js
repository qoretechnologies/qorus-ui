define([
  'jquery',
  'underscore',
  'libs/backbone.rpc',
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
        'click th': 'sortView'
	},
    initialize: function(){
	  _.bindAll(this, 'render');
      this.collection = new WorkflowCollection();
      this.collection.on('reset add', this.render);
      this.collection.fetch();
      
      // TODO: find proper location
      this.on('render', function(c){
          var key = c.collection.sort_by;
          var order = c.collection.sort_order;
          var el = c.$el.find('th[data-sort="'+key+'"]');
          c.$el.find('th i').remove();

          if (order == 'des'){
            el.append('<i class="icon-chevron-up"></i>');
          }else{
            el.append('<i class="icon-chevron-down"></i>');
          }
      });
    },
	render: function(){
        var compiledTemplate = _.template( workflowsTemplate, { workflows: this.collection.models } );
        this.$el.html(compiledTemplate);
        this.trigger('render', this, {});
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
	},
    sortView: function(e){
        var el = $(e.currentTarget);
        if (el.data('sort')){
            this.collection.sortByKey(el.data('sort'));
        }
    }
  });
  // Returning instantiated views can be quite useful for having "state"
  return ListView;
});
