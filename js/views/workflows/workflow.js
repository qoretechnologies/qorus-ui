define(function (require) {
  var $                = require('jquery'),
      _                = require('underscore'),
      Qorus            = require('qorus/qorus'),
      Workflow         = require('models/workflow'),
      Dispatcher       = require('qorus/dispatcher'),
      Template         = require('text!templates/workflow/detail.html'),
      InstanceListView = require('views/workflows/instances'),
      OrderListView    = require('views/workflows/orders'),
      BottomBarView    = require('views/common/bottom_bar'),
      OrderView        = require('views/workflows/order'),
      Modal            = require('views/workflows/modal'),
      ChartsView       = require('views/workflows/charts'),
      helpers          = require('views/workflows/helpers'),
      LogView          = require('views/log'),
      HeaderTpl = require("tpl!templates/workflow/detail_header.html"),
      HeaderView, ModelView;
      
      
  HeaderView = Qorus.View.extend({
    template: HeaderTpl,
    initialize: function (options) {
      this.model = options.model;
    },
    preRender: function () {
      this.context.item = this.model.toJSON();
    }
  });

  ModelView = Qorus.TabView.extend({
    helpers: helpers, 
    url: function () {
     return '/workflows/view/' + this.opts.id; 
    },
    
    title: function () {
      return this.model.get('name');
    },
    
    additionalEvents: {
      'click #instances tbody tr': 'loadInfo',
      'submit .form-search': 'search',
      'keyup .search-query': 'search',
      'click .action-modal': 'openModal',
      'click [data-action]': 'runAction'
    },
    
    initialize: function (opts) {
      // debug.log("workflow opts", this.opts);
      this.path = window.location.pathname.replace("/workflows/view/"+opts.id+"/", "");
      ModelView.__super__.initialize.call(this, opts);
      this.opts = opts;
      
      this.template = Template;
      
      // init model
      this.model = new Workflow({ id: opts.id });;
      this.listenToOnce(this.model, 'sync', this.render);
      this.listenTo(this.model, 'fetch', this.updateViews);
      this.listenTo(Dispatcher, this.model.api_events, this.dispatch);
      this.model.fetch();
    },
    
    dispatch: function () {
      this.model.dispatch.apply(this.model, arguments);
    },
    
    render: function (ctx) {
      var mctx = { item: this.model };
      if (ctx){
        _.extend(mctx, ctx);
      }
      ModelView.__super__.render.call(this, mctx);
      return this;
    },
    
    updateViews: function () {
      console.log('hello', this);
      var detail_view = this.getView('#detail');
      if (detail_view) detail_view.render();
    },
    
    preRender: function () {
      var url = '/workflows/' + this.model.id;
      
      if (this.opts.inst == 'instances') {
        this.setView(new InstanceListView({ 
            date: this.opts.date, workflowid: this.model.id, url: this.url() 
          }), '#instances');
      } else {
        this.setView(new OrderListView({ 
            date: this.opts.date, workflowid: this.model.id, statuses: this.opts.filter, url: this.url() 
          }), '#instances');
      }
      
      this.setView(new HeaderView({ model: this.model }), '#detail')  
      this.setView(new BottomBarView({}), '#bottom-bar');
      this.setView(new LogView({ socket_url: url, parent: this }), '#log');
      this.setView(new ChartsView({ model_id: this.model.id }), '#stats');
    },
    
    // onRender: function () {
    //   this.$el.tooltip();
    // },
    
    // onRender: function() {
    //   var view = this.getView('#instances').getView('#order-list');
    //   // this.$('.pane').on('scroll', view.scroll);
    // },
    
    // opens the bottom bar with detail info about the Instance/Order
    loadInfo: function (e) {
      var self = this,
        el = $(e.currentTarget),
      // var dataview = this.currentDataView();
        bar = this.getView('#bottom-bar'),
        oview;
      
      if (e.target.localName == 'tr' || e.target.localName == 'td') {
        debug.log('load info stop propagation');
        e.stopPropagation();
        e.preventDefault();

        if (el.hasClass('info')) {
          bar.hide();
          el.removeClass('info');
        } else {
          oview = self.setView(new OrderView({ id: el.data('id'), workflow: this.model, show_header: false }), '#bottom-content');
      
          oview.listenTo(oview.model, 'change', function () {
            bar.render();
            self.renderView('#bottom-content');
            bar.show();

            // highlite/unhighlite selected row
            $('tr', el.parent()).removeClass('info');
            $('tr[data-id='+ el.data('id') +']').addClass('info');
          });        
        }
      }
    },
    
    // orderDetail: function (m) {
    //   var tpl = _.template(OrderDetailTemplate, { item: m, workflow: this.model });
    //   return tpl;
    // },
    
    // delegate search to current dataview
    search: function (e) {
      var dataview = this.currentDataView();
      dataview.search(e);
    },
    
    // starts workflow
    runAction: function (e) {
      var data = e.currentTarget.dataset;
      if (data.action) {
        this.model.doAction(data.action);
        e.preventDefault();
      }
    },
    
    // edit action with Modal window form
    openModal: function (e) {
      e.preventDefault();
      e.stopPropagation();
      
      var $target = $(e.currentTarget);
      
      if ($target.data) {
        this.removeView('#modal');
        var view = this.setView(new Modal({ workflow: this.model }), '#modal', true);
        view.open();
      }

    },
    
    // updateUrl: function () {},
        
    clean: function () {
      this.undelegateEvents();
      this.stopListening();
    }
  });
  return ModelView;
});
