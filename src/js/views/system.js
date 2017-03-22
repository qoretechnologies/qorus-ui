define(function(require){
  var $                = require('jquery'),
      _                = require('underscore'),
      Backbone         = require('backbone'),
      utils            = require('utils'),
      Qorus            = require('qorus/qorus'),
      System           = require('models/system'),
      Template         = require('tpl!templates/system/detail.html'),
      LogView          = require('views/log'),
      OptionsView      = require('views/system/options'),
      ConnectionsView  = require('views/system/connections'),
      PropView         = require('views/system/prop'),
      HttpServicesView = require('views/system/http'),
      AlertView        = require('views/system/alerts'),
      DashboardView    = require('views/system/dashboard'),
      LogsView         = require('views/system/logs'),
      RbacView         = require('views/system/rbac'),
      SystemInfoView;


  SystemInfoView = Qorus.TabView.extend({
    url: '/system',
    views: {},
    cls: 'SystemInfoView',
    tabs: {
      'dashboard': {
        view: DashboardView,
        // options: {
        //   model: this.info
        // }
      },
      'logs': {
        view: LogsView
      },
      'options': {
        view: OptionsView
      },
      'remote': {
        view: ConnectionsView
      },
      'prop': {
        view: PropView
      },
      'http': {
        view: HttpServicesView
      },
      'alerts': {
        view: AlertView
      },
      'rbac': {
        view: RbacView
      }
    },

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
    }
  });
  return SystemInfoView;
});