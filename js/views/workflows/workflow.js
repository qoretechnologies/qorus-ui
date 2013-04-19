define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'models/workflow',
  'text!../../../templates/workflow/detail.html',
  'views/workflows/instances',
  'views/workflows/orders',
  'views/common/bottom_bar',
  'views/toolbars/orders_toolbar',
  'views/workflows/order',
  'views/steps/function'
], function ($, _, Qorus, Workflow, Template, InstanceListView, OrderListView, 
  BottomBarView, OrdersToolbar, OrderView, FunctionView) {
  var ModelView = Qorus.View.extend({
    url: function () {
     return '#/workflows/view/' + this.opts.id; 
    },
    additionalEvents: {
      'click #instances tbody tr': 'loadInfo',
      'submit .form-search': 'search',
      'keyup .search-query': 'search'
    },
    initialize: function (opts) {
      this.opts = opts;
      _.bindAll(this, 'render');
      
      this.template = Template;
      
      // init model
      this.model = new Workflow({ id: opts.id });
      this.model.fetch();
      this.model.on('change', this.render);
      
      this.createSubviews();
    },
    render: function (ctx) {
      var mctx = { item: this.model };
      if (ctx){
        _.extend(mctx, ctx);
      }
      ModelView.__super__.render.call(this, mctx);
      this.onRender();
      return this;
    },
    onRender: function () {
      // render instance/order data grid with toolbar
      var dataview = this.currentDataView();
      var toolbar = this.subviews.toolbar;
      if (dataview){
        this.assign('#instances', dataview);
        // update toolbar url with current order/instance url
        toolbar.updateUrl(dataview.url, dataview.options.statuses);
        this.assign('#toolbar', toolbar);
      }
      this.assign('#bottom-bar', this.subviews.bottombar);
    },
    currentDataView: function () {
      var inst  = this.opts.inst || null;
      if (_.indexOf(this.subviews, inst)){
        return this.subviews[inst];
      }
      return null;
    },
    createSubviews: function () {
      this.subviews.instances = new InstanceListView({ 
          date: this.opts.date, workflowid: this.model.id, url: this.url() 
        });
      this.subviews.orders = new OrderListView({ 
          date: this.opts.date, workflowid: this.model.id, statuses: this.opts.filter, url: this.url() 
        });
      this.subviews.bottombar = new BottomBarView({});
      this.subviews.toolbar = new OrdersToolbar(this.opts);
    },
    
    // opens the bottom bar with detail info about the Instance/Order
    loadInfo: function (e) {
      var el = $(e.currentTarget);
      var dataview = this.currentDataView();
      var bar = this.subviews.bottombar;
      var oview = new OrderView({ id: el.data('id') });
      var _this = this;
      
      e.stopPropagation();
      
      // this.subviews.order = oview;
      
      oview.model.on('change', function () {
        bar.render();
        _this.assign('#bottom-bar', oview);
        bar.show();

        // highlite/unhighlite selected row
        $('tr', el.parent()).removeClass('info');
        $('tr[data-id='+ el.data('id') +']').addClass('info');
      });
    },
    orderDetail: function (m) {
      var tpl = _.template(OrderDetailTemplate, { item: m, workflow: this.model });
      return tpl;
    },
    // delegate search to current dataview
    search: function (e) {
      var dataview = this.currentDataView();
      console.log("Delegating search to ", dataview);
      dataview.search(e);
    }
  });
  return ModelView;
});