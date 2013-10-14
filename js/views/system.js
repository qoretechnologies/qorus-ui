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
  'views/system/http'
], function($, _, Backbone, utils, Qorus, System, Template, LogView, OptionsView, 
  DatasourceView, PropView, HttpServicesView){
  var SystemInfoView = Qorus.View.extend({
    additionalEvents: {
      'click .nav-tabs a': 'tabToggle'
    },
    
    initialize: function (opts) {
      this.opts = opts || {};
      this.info = System.Info;
      
      this.listenTo(this.info, 'sync', this.render);
      this.template = Template;
      
      this.info.fetch();
    },
    
    preRender: function () {
      this.setView(new LogView({ socket_url: "/system", parent: this }), '#log');
      this.setView(new LogView({ socket_url: "/audit", parent: this, auto_reconnect: false }), '#audit-log');
      this.setView(new LogView({ socket_url: "/http", parent: this, auto_reconnect: false }), '#http-log');
      this.setView(new OptionsView(), '#options');
      this.setView(new DatasourceView(), '#datasources');
      this.setView(new PropView(), '#prop');
      this.setView(new HttpServicesView(), '#http');
    },
    
    onRender: function () {
      if (_.has(this.opts, 'query')) {
        $('a[data-target=#'+ this.opts.query +']').tab('show');
      } 
    },
     
    tabToggle: function(e){
      var $target = $(e.currentTarget);
      e.preventDefault();

      var active = $('.tab-pane.active');
      $target.tab('show');

      this.active_tab = $target.attr('href');
      
      Backbone.history.navigate(utils.getCurrentLocationPath() + $target.attr('href'));
    }

  });
  return SystemInfoView;
});
