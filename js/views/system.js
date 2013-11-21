define(function(require){
  var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    utils = require('utils'),
    Qorus = require('qorus/qorus'),
    System = require('models/system'),
    Template = require('text!templates/system/detail.html'),
    LogView = require('views/log'),
    OptionsView = require('views/system/options'),
    DatasourceView = require('views/system/datasources'),
    PropView = require('views/system/prop'),
    HttpServicesView = require('views/system/http'),
    AlertView = require('views/system/alerts'),
    DashboardView = require('views/system/dashboard'),
    SystemInfoView;  


  SystemInfoView = Qorus.View.extend({
    additionalEvents: {
      'click .nav-tabs a': 'tabToggle'
    },
    
    initialize: function (opts) {
      _.bindAll(this);
      this.opts = opts || {};
      this.info = System.Info;
      
      this.listenTo(this.info, 'sync', this.render);
      this.template = Template;
      
      if (!this.info.id) this.info.fetch();
    },
    
    preRender: function () {
      this.setView(new DashboardView(), '#performance');
      this.setView(new LogView({ socket_url: "/system", parent: this }), '#log');
      this.setView(new LogView({ socket_url: "/audit", parent: this, auto_reconnect: false }), '#audit-log');
      this.setView(new LogView({ socket_url: "/http", parent: this, auto_reconnect: false }), '#http-log');
      this.setView(new LogView({ socket_url: "/alert", parent: this, auto_reconnect: false }), '#alert-log');
      this.setView(new LogView({ socket_url: "/mon", parent: this, auto_reconnect: false }), '#mon-log');
      this.setView(new OptionsView(), '#options');
      this.setView(new DatasourceView(), '#datasources');
      this.setView(new PropView(), '#prop');
      this.setView(new HttpServicesView(), '#http');
      this.setView(new AlertView(), '#alerts');
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
