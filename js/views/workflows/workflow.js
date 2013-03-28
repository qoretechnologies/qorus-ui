define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'models/workflow',
  'text!/templates/workflow/detail.html',
  'views/workflows/instances',
  'views/workflows/orders',
  'views/common/bottom_bar',
  'views/workflows/orders_toolbar',
], function($, _, Qorus, Workflow, Template, InstanceListView, OrderListView, BottomBarView, OrdersToolbar){
  var ModelView = Qorus.View.extend({
    url: function() {
     return '#/workflows/view/' + this.opts.id; 
    },
    additionalEvents: {
      'click tbody tr': 'loadInfo'
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
      // render instance/order data grid with toolbar
      var dataview = this.currentDataView();
      var toolbar = this.subviews['toolbar'];
      if (dataview){
        this.assign('#instances', dataview);
        // update toolbar url with current order/instance url
        toolbar.updateUrl(dataview.url, dataview.options.statuses);
        this.assign('#toolbar', toolbar);
      }
      this.assign('#bottom-bar', this.subviews['bottombar']);
  	},
    currentDataView: function(){
      var inst  = this.opts.inst || null;
      if (_.indexOf(this.subviews, inst)){
        return this.subviews[inst];
      }
      return null;
    },
    createSubviews: function(){
      this.subviews['instances'] = new InstanceListView({ 
          date: this.opts.date, workflowid: this.model.id, url: this.url() 
        });
      this.subviews['orders'] = new OrderListView({ 
          date: this.opts.date, workflowid: this.model.id, statuses: this.opts.filter, url: this.url() 
        });
      this.subviews['bottombar'] = new BottomBarView({});
      this.subviews['toolbar'] = new OrdersToolbar(this.opts);
    },
    loadInfo: function(e){
      var el = $(e.currentTarget);
      e.stopPropagation();
      
      var dataview = this.currentDataView();
      
      var m = dataview.collection.get(el.data('id'));
      var _this = this;
      
      m.fetch().done(function (){
        var bar = _this.subviews['bottombar'];
        bar.render();
        $('.bottom-bar').show();
        var txt = $('<ul />');
        for (var obj in m.attributes){
          txt.append('<li><strong>' + obj + '</strong>: ' + m.get(obj) + '</li>');
        }
        $('#bottom-content', bar.$el).html(txt.html());
        $('tr', el.parent()).removeClass('info');
        $('tr[data-id='+ m.id +']').addClass('info')
      });
    }
  });
  return ModelView;
});
