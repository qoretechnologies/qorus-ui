define(function (require) {
  var $                = require('jquery'),
      _                = require('underscore'),
      Qorus            = require('qorus/qorus'),
      Workflow         = require('models/workflow'),
      Template         = require('text!templates/workflow/detail.html'),
      InstanceListView = require('views/workflows/instances'),
      OrderListView    = require('views/workflows/orders'),
      OrderView        = require('views/workflows/order'),
      Modal            = require('views/workflows/modal'),
      ChartsView       = require('views/workflows/charts'),
      helpers          = require('views/workflows/helpers'),
      LogView          = require('views/log'),
      HeaderTpl        = require("tpl!templates/workflow/detail_header.html"),
      AutostartView    = require('views/workflows/autostart'),
      HeaderView, ModelView;
      
      
  HeaderView = Qorus.View.extend({
    template: HeaderTpl,
    initialize: function (options) {
      this.views = {};
      this.model = options.model;
      this.options = options;
    },
    preRender: function () {
      _.extend(this.context, this.options);
      this.context.item = this.model.toJSON();
      this.context._item= this.model;
      this.context.pull_right = true;
      this.context.show_groups = true;
      this.setView(new AutostartView({ model: this.model }), '.autostart');
    }
  });


  // TODO; rewrite to Qorus.TabView

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
      _.bindAll(this, 'render', 'search');
      // this.path = window.location.pathname.replace("/workflows/view/"+opts.id+"/", "");
      ModelView.__super__.initialize.call(this, opts);
      this.opts = opts;
      
      this.template = Template;
      
      // init model
      this.model = new Workflow({ workflowid: opts.id });
      this.listenToOnce(this.model, 'sync', this.render);
      this.listenTo(this.model, 'fetch', this.updateViews);
      this.model.fetch();
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
      var detail_view = this.getView('#detail');
      if (detail_view) detail_view.render();
    },
    
    preRender: function () {
      var url = '/workflows/' + this.model.id;
      
      if (this.opts.inst === 'instances') {
        this.setView(new InstanceListView({ 
            date: this.opts.date, workflowid: this.opts.id, url: this.url() 
          }), '#instances');
      } else {
        this.setView(new OrderListView({ 
            date: this.opts.date, workflowid: this.opts.id, statuses: this.opts.filter, url: this.url() 
          }), '#instances');
      }
      
      console.log('date', this.opts.date);
      this.setView(new HeaderView({ model: this.model, date: this.opts.date }), '#detail');  
      this.setView(new LogView({ socket_url: url, parent: this }), '#log');
      this.setView(new ChartsView({ model_id: this.model.id }), '#stats');
    },
    
    
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
          if (bar) {
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
      }
    },
    
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
        
    clean: function () {
      this.undelegateEvents();
      this.stopListening();
    }
  });
  return ModelView;
});
