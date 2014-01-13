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
    LogsView = require('views/system/logs'),
    SystemInfoView;  


  SystemInfoView = Qorus.TabView.extend({
    url: '/system',
    views: {},
    cls: 'SystemInfoView',
    
    initialize: function (opts) {
      _.bindAll(this);
      this.path = opts.path;
      SystemInfoView.__super__.initialize.call(this, arguments);
      this.opts = opts || {};
      this.info = System.Info;
      
      this.listenTo(this.info, 'sync', this.render);
      this.template = Template;
      
      if (!this.info.id) this.info.fetch();

      this.processPath();
    },
    
    preRender: function () {
      this.setView(new DashboardView({ model: this.info }), '#dashboard');
      this.setView(new LogsView(), '#logs');
      this.setView(new OptionsView(), '#options');
      this.setView(new DatasourceView(), '#datasources');
      this.setView(new PropView(), '#prop');
      this.setView(new HttpServicesView(), '#http');
      this.setView(new AlertView(), '#alerts');
    }
  });
  return SystemInfoView;
});
