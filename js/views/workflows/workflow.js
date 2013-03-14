define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'models/workflow',
  'text!/templates/workflow/detail.html',
  'views/workflows/instances',
  'views/workflows/orders',
], function($, _, Backbone, Workflow, Template, InstanceListView, OrderListView){
  var ModelView = Backbone.View.extend({
    url: function() {
     return '#/workflows/view/' + this.opts.id;  
    },
    initialize: function(opts){
      this.opts = opts;
  	  _.bindAll(this, 'render');
      this.model = new Workflow({ id: opts.id });
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
      if (!this.opts.inst) {
    		var ilv = new InstanceListView({ date: this.date, workflowid: this.model.id, url: this.url() });
        $('#instances').html(ilv.el);        
      } else if (this.opts.inst == 'orders'){
    		var ilv = new OrderListView({ date: this.date, workflowid: this.model.id, statuses: this.opts.filter, url: this.url() });
        $('#instances').html(ilv.el);                
      } 
  	}
  });
  return ModelView;
});
