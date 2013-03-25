define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'models/workflow',
  'text!/templates/workflow/detail.html',
  'views/workflows/instances',
  'views/workflows/orders',
], function($, _, Qorus, Workflow, Template, InstanceListView, OrderListView){
  var ModelView = Qorus.View.extend({
    url: function() {
     return '#/workflows/view/' + this.opts.id;  
    },
    initialize: function(opts){
      this.opts = opts;
  	  _.bindAll(this, 'render');
      
      this.template = Template;
      
      // init model
      this.model = new Workflow({ id: opts.id });
  	  this.model.fetch()
  	  this.model.on('change', this.render);
      
      this.createSubviews();
    },
  	render: function(ctx){
      var mctx = { item: this.model };
      if (ctx){
        _.extend(mctx, ctx);
      }
      ModelView.__super__.render.call(this, mctx);
      this.onRender();
  	  return this;
  	},
  	onRender: function(){
      var inst  = this.opts.inst || null;
      
      if (_.indexOf(this.subviews, inst)){
        this.assign('#instances', this.subviews[inst]);
      }
  	},
    createSubviews: function(){
      this.subviews['instances'] = new InstanceListView({ 
          date: this.opts.date, workflowid: this.model.id, url: this.url() 
        });
      this.subviews['orders'] = new OrderListView({ 
          date: this.opts.date, workflowid: this.model.id, statuses: this.opts.filter, url: this.url() 
        });
    }
  });
  return ModelView;
});
