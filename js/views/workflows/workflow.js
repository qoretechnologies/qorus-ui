define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'models/workflow',
  'text!../../../templates/workflow/detail.html',
  'views/workflows/instances',
  'views/workflows/orders',
  'views/common/bottom_bar',
  'views/workflows/order',
  'views/workflows/modal',
  'views/log'
], function ($, _, Qorus, Workflow, Template, InstanceListView, OrderListView, 
  BottomBarView, OrderView, Modal, LogView) {
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
      'click .tab': 'tabToggle'
    },
    
    initialize: function (opts) {
      // console.log("workflow opts", this.opts);
      _.bindAll(this);

      this.opts = opts;
      
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
      return this;
    },
    
    onRender: function () {
      // render instance/order data grid with toolbar
      var dataview = this.currentDataView();
      this.assign('#instances', dataview);
      this.assign('#bottom-bar', this.subviews.bottombar);
      this.assign('#log', this.subviews.log);
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
      var url = '/workflows/' + this.model.id;
      this.subviews.log = new LogView({ socket_url: url, parent: this });
    },
    
    // opens the bottom bar with detail info about the Instance/Order
    loadInfo: function (e) {
      var el = $(e.currentTarget);
      // var dataview = this.currentDataView();
      var bar = this.subviews.bottombar;
      
      if (e.target.localName == 'tr' || e.target.localName == 'td') {
        e.stopPropagation();
        e.preventDefault();
        if (el.hasClass('info')) {
          bar.hide();
          el.removeClass('info');
        } else {
          var oview = new OrderView({ id: el.data('id'), workflow: this.model, show_header: false });
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
        this.subviews.modal = new Modal({ workflow: this.model });
        this.assign('#modal', this.subviews.modal);
        this.subviews.modal.open();
      }

    },
    
    tabToggle: function(e){
      var $target = $(e.currentTarget);
      e.preventDefault();

      var active = $('.tab-pane.active');
      $target.tab('show');

      this.active_tab = $target.attr('href');
    },
    
    clean: function () {
      console.log("Cleaning", this, this.subviews, this.subviews.log, this.subviews.log.sss);
      if (this.subviews.log) {
        this.subviews.log.clean();
      }
      this.undelegateEvents();
      this.stopListening();
    }
    
  });
  return ModelView;
});