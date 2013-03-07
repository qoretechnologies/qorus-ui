define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'models/workflow',
  'text!/templates/workflow/detail.html',
  'views/workflows/instances'
], function($, _, Backbone, Workflow, Template, InstanceListView){
  var ModelView = Backbone.View.extend({
    el: $("#content"), 
    initialize: function(id){
  	  _.bindAll(this, 'render');
      this.model = new Workflow(id);
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
  		var ilv = new InstanceListView(this.date, { workflowid: this.model.id });
  		ilv.setElement('#instances');
  	}
  });
  return ModelView;
});
