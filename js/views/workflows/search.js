define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'settings',
  'models/workflow',
  'text!../../../templates/search/detail.html',
  'views/workflows/instances',
  'views/workflows/orders',
  'views/common/bottom_bar',
  'views/toolbars/search_toolbar',
  'text!../../../templates/workflow/orders/detail.html'
], function ($, _, Qorus, settings, Workflow, Template, InstanceListView, 
  OrderListView, BottomBarView, OrdersToolbar, OrderDetailTemplate) {
    
  var ModelView = Qorus.View.extend({
    url: function () {
     return '#/search'; 
    },
    additionalEvents: {
      'click #instances tbody tr': 'loadInfo',
      'submit .form-search': 'search',
      // 'keyup .search-query': 'search'
    },
    initialize: function (opts){
      this.opts = opts || {};
      this.opts.date = this.opts.date || settings.DATE_FROM;
      
      _.bindAll(this, 'render');
      
      this.template = Template;
      this.createSubviews();
      
      _.defer(this.render);
    },
    render: function (ctx){
      var mctx = { item: this.model };
      if (ctx){
        _.extend(mctx, ctx);
      }
      ModelView.__super__.render.call(this, mctx);
      this.onRender();
      return this;
    },
    onRender: function (){
      // render instance/order data grid with toolbar
      var dataview = this.currentDataView();
      var toolbar = this.subviews.toolbar;

      // // update toolbar url with current order/instance url
      // toolbar.updateUrl(dataview.url, dataview.options.statuses);

      this.assign('#instances', dataview);
      this.assign('#toolbar', toolbar);
      this.assign('#bottom-bar', this.subviews.bottombar);
    },
    currentDataView: function (){
      return this.subviews.orders;
    },
    createSubviews: function (){
      // this.subviews.instances = new InstanceListView({ 
      //     date: this.opts.date, workflowid: this.model.id, url: this.url() 
      //   });

      this.subviews.orders = new OrderListView({ date: this.opts.date, search: this.opts.search });
      this.subviews.bottombar = new BottomBarView({});
      this.subviews.toolbar = new OrdersToolbar(this.opts);
    },
    
    // opens the bottom bar with detail info about the Instance/Order
    loadInfo: function (e){
      var el = $(e.currentTarget);
      e.stopPropagation();
      
      var dataview = this.currentDataView();
      
      var m = dataview.collection.get(el.data('id'));
      var _this = this;
      
      m.fetch().done(function (){
        var bar = _this.subviews.bottombar;
        bar.render();
        
        $('#bottom-content', bar.$el).html(_this.orderDetail(m));
        bar.show();
        
        if (bar.activeTab){
          $('a[href="#'+ bar.activeTab +'"]').tab('show');
        }
        
        $('#bottom-content .nav-tabs a').click(function (e){
          e.preventDefault();
          $(this).tab('show');
          var active = $('.tab-pane.active');
          bar.activeTab = active.attr('id');
        });
        
        // highlite/unhighlite selected row
        $('tr', el.parent()).removeClass('info');
        $('tr[data-id='+ m.id +']').addClass('info');
      });
    },
    orderDetail: function (m) {
      var tpl = _.template(OrderDetailTemplate, { item: m, workflow: this.model });
      return tpl;
    },
    // delegate search to current dataview
    search: function (e) {
      e.preventDefault();
      var $target = $(e.currentTarget);
      var ids = $target.hasClass('.search-query-ids') ? $target.val() : $target.find('.search-query-ids').val();
      var keyvalues = $target.hasClass('.search-query-keyvalues') ? $target.val() : $target.find('.search-query-keyvalues').val();
      Backbone.history.navigate([this.url(), ids, keyvalues].join("/"));
    }
  });
  return ModelView;
});