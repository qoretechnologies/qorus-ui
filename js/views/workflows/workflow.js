define([
  'jquery',
  'underscore',
  'utils',
  'qorus/qorus',
  'models/workflow',
  'text!../../../templates/workflow/detail.html',
  'views/workflows/instances',
  'views/workflows/orders',
  'views/common/bottom_bar',
  'views/workflows/order',
  'views/workflows/modal',
  'collections/stats',
  'views/common/chart',
  'views/log'
], function ($, _, utils, Qorus, Workflow, Template, InstanceListView, OrderListView, 
  BottomBarView, OrderView, Modal, StatsCollection, ChartView, LogView) {

  var ModelView = Qorus.View.extend({
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
      'click .action': 'runAction',
      'click .nav a': 'tabToggle'
    },
    
    initialize: function (opts) {
      // debug.log("workflow opts", this.opts);
      ModelView.__super__.initialize.call(this, opts);
      _.bindAll(this);

      this.opts = opts;
      
      this.template = Template;
      
      // init model
      this.model = new Workflow({ id: opts.id });
      this.listenTo(this.model, 'change', this.render);
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
        
      this.setView(new BottomBarView({}), '#bottom-bar');
      this.setView(new LogView({ socket_url: url, parent: this }), '#log');
    },
    
    onRender: function() {
      var view = this.getView('#instances').getView('#order-list');
      // this.$('.pane').on('scroll', view.scroll);
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
          var oview = self.setView(new OrderView({ id: el.data('id'), workflow: this.model, show_header: false }), '#bottom-content');
      
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
      e.preventDefault();
      var data = e.currentTarget.dataset;
      if (data.id && data.action) {
        var wfl = this.model;
        wfl.doAction(data.action); 
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
    
    tabToggle: function(e){
      var $target = $(e.currentTarget);
      e.preventDefault();

      var active = $('.tab-pane.active');
      $target.tab('show');

      if ($target.attr('href') == '#stats') {
        this.drawCharts();
      }

      this.active_tab = $target.attr('href');
    },
    
    drawCharts: function () {
      // add performance chart subviews
      
      if (!this.getView('#stats-day')) {
        this.setView(
          new ChartView.LineChart(
            { width: 600, height: 200 }, 
            new StatsCollection({ id: this.id })
          ), 
          '#stats-day', 
          true
        );

        this.setView(
          new ChartView.DoughnutChart(
            { width: 200, height: 200 }, 
            this.model
          ), 
          '#stats-day-donut',
          true
        );        

        this.setView(
          new ChartView.LineChart(
            { width: 600, height: 200 }, 
            new StatsCollection({ id: this.id, step: 7 })
          ),
          '#stats-week', true
        );
          
        this.setView(
          new ChartView.DoughnutChart(
            { width: 200, height: 200 }, 
            new Workflow({ id: this.model.id, date: utils.formatDate(moment().days(-6)) })
          ), 
          '#stats-week-donut', 
          true
        );
        
        this.setView(
          new ChartView.LineChart(
            { width: 600, height: 200 }, 
            new StatsCollection({ id: this.id, step: 30 })
          ),
          '#stats-month', 
          true
        );
        
        this.setView(
          new ChartView.DoughnutChart(
            { width: 200, height: 200 }, 
            new Workflow({ id: this.model.id, date: utils.formatDate(moment().days(-30)) })
          ), 
          '#stats-month-donut', 
          true
        );
      }
    },
        
    clean: function () {
      this.undelegateEvents();
      this.stopListening();
    }
  });
  return ModelView;
});