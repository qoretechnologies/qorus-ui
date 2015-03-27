define(function(require){
  var Qorus             = require('qorus/qorus'),
      System            = require('models/system'),
      Template          = require('tpl!templates/system/detail.html'),
      OptionsView       = require('views/system/options'),
      ConnectionsView   = require('views/system/connections'),
      PropView          = require('views/system/prop'),
      HttpServicesView  = require('views/system/http'),
      AlertView         = require('views/system/alerts'),
      DashboardView     = require('views/system/dashboard'),
      LogsView          = require('views/system/logs'),
      RbacView          = require('views/system/rbac'),
      ErrorsView        = require('views/system/errors'),
      _ = require('underscore'),
      SystemInfoView;  


  SystemInfoView = Qorus.TabView.extend({
    url: '/system',
    views: {},
    cls: 'SystemInfoView',
    
    initialize: function (opts) {
      this.path = opts.path;
      SystemInfoView.__super__.initialize.call(this, arguments);
      this.opts = opts || {};
      this.info = System.Info;
      
      this.listenTo(this.info, 'sync', this.render);
      this.template = Template;
      
      if (!this.info.id) this.info.fetch();
    },
    
    preRender: function () {
      this.context.item = this.info.toJSON();
      this.setView(new DashboardView({ model: this.info }), '#dashboard');
      this.setView(new LogsView(), '#logs');
      this.setView(new OptionsView(), '#options');
      this.setView(new ConnectionsView(), '#remote');
      this.setView(new PropView(), '#prop');
      this.setView(new HttpServicesView(), '#http');
      this.setView(new AlertView(), '#alerts');
      this.setView(new RbacView(), '#rbac');
      this.setView(new ErrorsView(), '#errors');
    }
  });
  return SystemInfoView;
});
