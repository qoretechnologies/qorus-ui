define([
  'jquery',
  'underscore',
  'backbone',
  'utils',
  'qorus/qorus',
  'models/system',
  'text!../../templates/system/detail.html',
  'views/log',
  'views/system/options',
  'views/system/datasources',
  'views/system/prop',
], function($, _, Backbone, utils, Qorus, System, Template, LogView, OptionsView, DatasourceView, PropView){
  var SystemInfoView = Qorus.View.extend({
    additionalEvents: {
      'click .nav-tabs a': 'tabToggle'
    },
    
    initialize: function (opts) {
      this.opts = opts || {};
      this.info = System.Info;
      
      this.listenTo(this.info, 'sync', this.render);
      this.template = Template;
      
      this.createSubviews();
      this.info.fetch();
    },
    
    createSubviews: function () {
      this.subviews.log = new LogView({ socket_url: "/system", parent: this });
      this.subviews.audit = new LogView({ socket_url: "/audit", parent: this, auto_reconnect: false });
      this.subviews.options = new OptionsView();
      this.subviews.datasources = new DatasourceView();
      this.subviews.props = new PropView();
    },
    
    onRender: function () {
      this.assign('#options', this.subviews.options);
      this.assign('#log', this.subviews.log);
      this.assign('#audit-log', this.subviews.audit);
      this.assign('#datasources', this.subviews.datasources);
      this.assign('#prop', this.subviews.props);
      
      console.log("Props el", 
        this.subviews.props.el, 
        this.subviews.props.$el, 
        this.subviews.props.events(),
        $._data(this.subviews.props.el, 'events')
      );
      
      if (_.has(this.opts, 'query')) {
        $('a[href=#'+ this.opts.query +']').tab('show');
      } 
    },
     
    tabToggle: function(e){
      var $target = $(e.currentTarget);
      e.preventDefault();

      var active = $('.tab-pane.active');
      $target.tab('show');

      this.active_tab = $target.attr('href');
      
      Backbone.history.navigate(utils.getCurrentLocationPath() + $target.attr('href'));
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
  return SystemInfoView;
});
