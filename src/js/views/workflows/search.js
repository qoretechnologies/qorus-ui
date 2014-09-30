define(function (require) {
  var $                = require('jquery'),
      _                = require('underscore'),
      Backbone         = require('backbone'),
      Qorus            = require('qorus/qorus'),
      settings         = require('settings'),
      Workflow         = require('models/workflow'),
      Collection       = require('collections/orders'),
      Template         = require('text!templates/search/detail.html'),
      TableTpl         = require('text!templates/workflow/orders/table.html'),
      RowTpl           = require('text!templates/workflow/orders/row.html'),
      InstanceListView = require('views/workflows/instances'),  
      OrderListView    = require('views/workflows/orders'),
      BottomBarView    = require('views/common/bottom_bar'),
      OrdersToolbar    = require('views/toolbars/search_toolbar'),
      OrderView        = require('views/workflows/order'),
      User             = require('models/system').User,
      Filters          = require('views/search/filters'),
      context, View, RowView, TableView;
      
  context = {
    action_css: {
      'block': {
        'style': 'label-inverse',
        'icon': 'icon-minus-sign'
      },
      'unblock': {
        'style': '',
        'icon': 'icon-ok-sign'
      },
      'cancel': {
        'style': 'label-danger',
        'icon': 'icon-remove-sign'
      },
      'uncancel': {
        'style': 'label-warning',
        'icon': 'icon-remove-sign'
      },
      'retry': {
        'style': 'label-success',
        'icon': 'icon-refresh'
      },
      'reschedule': {
        'style': 'label-warning',
        'icon': 'icon-calendar'
      }
    }
  };
  
  RowView = Qorus.RowView.extend({
    context: {
      user: User
    },
    template: RowTpl,
    additionalEvents: {
      "click .order-lock": 'lockOrder',
      "click .order-unlock": 'unlockOrder',
      "click .order-breaklock": 'breakLockOrder',
      "click [data-action]": "runAction"
    },
        
    lockOrder: function (e) {
      this.applyLock('lock', e);
    },
    
    unlockOrder: function (e) {
      this.applyLock('unlock', e);
    },
    
    breakLockOrder: function (e) {
      this.applyLock('breakLock', e);
    },
    
    applyLock: function (action) {
      this.setView(new ModalView({
        content_view: new OrderLockView({ action: action, model: this.model})
      }), '.order-lock-modal');
    },
    
    runAction: function (e) { 
      var data = e.currentTarget.dataset;
      if (data.action) {
        this.model.doAction(data.action);
        e.preventDefault(); 
      }
    },
  });
  
  TableView = Qorus.TableView.extend({
    close: function () {
      TableView.__super__.off.call(this, false);
      return this;
    }
  });
    
  View = Qorus.ListView.extend({
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
      // 'click #instances tbody tr': 'loadInfo',
      'submit .form-search': 'search',
      'submit .form-search-advanced': 'searchAdvanced',
      'click button[data-pagination]': 'nextPage',
      // 'keyup .search-query': 'search'
    },
    
    initialize: function (opts) {
      Qorus.ListView.__super__.initialize.apply(this, arguments);
      this.views = {};
      this.options = {};
      this.context =  {};
      this.opts = opts || {};
      this.opts.date = this.opts.date || settings.DATE_FROM;
            
      _.bindAll(this, 'render');
      
      this.template = Template;
      // this.listenTo(this.collection, 'sync', this.updateContext, this);
      this.stopListening(this.collection);
      this.listenTo(this.collection, 'reset', this.createOrdersTable);
            
      _.extend(this.options, this.opts);
      _.extend(this.context, this.opts);
      _.defer(this.render);
    },
    

    preRender: function () {
      var toolbar = this.setView(new OrdersToolbar(this.opts), '.toolbar');
      
      toolbar.stopListening(this.collection);
      
      this.createOrdersTable();
    },
    
    createOrdersTable: function () {
      this.setView(new TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          row_view: RowView,
          helpers: this.helpers,
          context: { url: this.url },
          // fixed: true
      }), '#instances');
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
    
    updateContext: function (render) {
      var view = this.getView('#instances');
      // update actual pages
      this.context.page = {
        current_page: this.collection.page,
        has_next: this.collection.hasNextPage()
      };

      if (view) view.render();
    },

    // fetches the collection from server presorted by key
    fetchSorted: function (e) {
      var el = e.currentTarget;
      // var sort = el.data('sort');
      // debug.log("Fetching sorted", sort);
      e.stopPropagation();
    },
    
    scroll: function (e) {
      var $target = $(e.currentTarget).find('#instances');
      var pos = this.$el.height() + $target.offset().top - $(window).height();
      debug.log(pos, $target.height(), $target.offset().top, $(window).height());
      // if (pos < 100) {
      //   this.nextPage(); 
      //   this.$el.children('button[data-pagination]').html("Loading...");
      // }
    },
    
    // opens the bottom bar with detail info about the Instance/Order
    loadInfo: function (e) {
      var self = this;
      var el = $(e.currentTarget);
      var dataview = this.getView('#instances');
      var bar = this.getView('#bottom-bar');
      
      if (el.hasClass('info')) {
        bar.hide();
        el.removeClass('info');
        this.removeView('#bottom-content');
      } else {
        e.stopPropagation();
        var oview = this.setView(new OrderView({ id: el.data('id') }), '#bottom-content');
      
        // this.subviews.order = oview;
      
        oview.listenTo(oview.model, 'change', function () {
          bar.render();
          oview.setElement(self.$('#bottom-content')).render();
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
    },
    
    searchAdvanced: function (e) {
      var $target = $(e.currentTarget).find('input'),
          data = Filters.process($target.val());

      e.preventDefault();
      _.extend(this.collection.opts, data);
      this.collection.reset();
      this.collection.fetch();
    }
    
  });
  return View;
});
