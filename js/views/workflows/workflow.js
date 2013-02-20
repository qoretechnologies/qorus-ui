define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'models/workflow',
  'text!/gui/templates/workflow/detail.html',
  'views/workflows/instances'
], function($, _, Backbone, Workflow, Template, InstanceListView){
  var ModelView = Backbone.View.extend({
    el: $("#content"), 
    initialize: function(id){
	  _.bindAll(this, 'render');
      this.model = new Workflow({id: id});
	  this.model.fetch()
	  this.model.on('change', this.render);
	  this.on('render', this.onRender);
    },
	render: function(){
      var compiledTemplate = _.template( Template, { item: this.model } );
      this.$el.html(compiledTemplate);
	  this.trigger('render');
	  return this;
	},
	onRender: function(){
		var ilv = new InstanceListView({ workflowid: this.model.id });
		ilv.setElement('#instances');
	}
	
  });
  // Returning instantiated views can be quite useful for having "state"
  return ModelView;
});