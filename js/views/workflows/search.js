define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'settings',
  'models/workflow',
  'collections/orders',
  'text!../../../templates/search/detail.html',
  'text!../../../templates/workflow/orders/table.html',
  'text!../../../templates/workflow/orders/row.html',
  'views/workflows/instances',
  'views/workflows/orders',
  'views/common/bottom_bar',
  'views/toolbars/search_toolbar',
  'views/workflows/order'
], function ($, _, Qorus, settings, Workflow, Collection, Template, TableTpl, RowTpl, InstanceListView, 
  OrderListView, BottomBarView, OrdersToolbar, OrderView) {
  var context = {
    action_css: {
      'block': 'btn-inverse',
      'cancel': 'btn-danger',
      'retry': 'btn-success'
    }
  };
    
  var View = Qorus.ListView.extend({
    context: context,
    url: function () {
     return '/search'; 
    },
    
    title: function () {
      var title = "Search";
      
      if (this.opts.search) {
        title += ": ";
        title += this.opts.search.ids;
      }
      
      return title;
    },
    
    additionalEvents: {
      'click #instances tbody tr': 'loadInfo',
      'submit .form-search': 'search',
      // 'keyup .search-query': 'search'
    },
    
    initialize: function (opts) {
      this.opts = opts || {};
      this.opts.date = this.opts.date || settings.DATE_FROM;
      
      _.bindAll(this, 'render');
      
      this.collection = new Collection({ date: this.opts.date, search: this.opts.search });
      this.template = Template;
      this.collection.on('sync', this.updateContext, this);
      this.collection.fetch();
      this.createSubviews();
      
      _.extend(this.options, this.opts);
      _.extend(this.context, this.opts);
      _.defer(this.render);
    },
    
    render: function (ctx) {
      var mctx = { item: this.model };
      if (ctx){
        _.extend(mctx, ctx);
      }
      View.__super__.render.call(this, mctx);
      
      this.setTitle();
      this.onRender();
      return this;
    },
    
    onRender: function () {
      this.assign('#instances', this.subviews.table);
      this.assign('#toolbar', this.subviews.toolbar);
      this.assign('#bottom-bar', this.subviews.bottombar);
    },
    
    runAction: function (e) {
      e.stopPropagation();
      var data = e.currentTarget.dataset;
      if (data.id && data.action) {
        var inst = this.collection.get(data.id);
        inst.doAction(data.action); 
      }
    },
    
    nextPage: function () {
      this.collection.loadNextPage();
    },
    
    updateContext: function () {
      // update actual pages
      this.context.page = {
        current_page: this.collection.page,
        has_next: this.collection.hasNextPage()
      };
      this.render();
    },

    // fetches the collection from server presorted by key
    fetchSorted: function (e) {
      var el = e.currentTarget;
      // var sort = el.data('sort');
      // console.log("Fetching sorted", sort);
      e.stopPropagation();
    },
    
    scroll: function () {
      var pos = this.$el.height() + this.$el.offset().top - $(window).height();
      if (pos < 100) {
        this.nextPage(); 
        this.$el.children('button[data-pagination]').html("Loading...");
      }
    },    
    
    createSubviews: function () {
      // this.subviews.instances = new InstanceListView({ 
      //     date: this.opts.date, workflowid: this.model.id, url: this.url() 
      //   });

      // this.subviews.orders = new OrderListView({ date: this.opts.date, search: this.opts.search });
      
      this.subviews.table = new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: this.helpers,
          context: { url: this.url },
          dispatcher: Dispatcher
      });
      this.subviews.bottombar = new BottomBarView({});
      this.subviews.toolbar = new OrdersToolbar(this.opts);
    },
    
    // opens the bottom bar with detail info about the Instance/Order
    loadInfo: function (e) {
      var el = $(e.currentTarget);
      var dataview = this.currentDataView();
      var bar = this.subviews.bottombar;
      
      if (el.hasClass('info')) {
        bar.hide();
        el.removeClass('info');
      } else {
        var oview = new OrderView({ id: el.data('id') });
        var _this = this;
      
        e.stopPropagation();
      
        // this.subviews.order = oview;
      
        oview.model.on('change', function () {
          bar.render();
          _this.assign('#bottom-content', oview);
          bar.show();

          // highlite/unhighlite selected row
          $('tr', el.parent()).removeClass('info');
          $('tr[data-id='+ el.data('id') +']').addClass('info');
        });        
      }
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
      Backbone.history.navigate([this.url(), ids, keyvalues].join("/"), { trigger: true });
    },
    
    helpers: {
      action_css: context.action_css
    }
    
  });
  return View;
});