define(function (require) {
  var $ = require('jquery'),
    _ = require('underscore'),
    Qorus = require('qorus/qorus'),
    LogView = require('views/log'),
    Template = require('tpl!templates/system/logs.html'),
    View;
  
  View = Qorus.View.extend({
    template: Template,
    preRender: function () {
      this.setView(new LogView({ socket_url: "/system", parent: this }), '#log-main');
      this.setView(new LogView({ socket_url: "/audit", parent: this, auto_reconnect: false }), '#log-audit');
      this.setView(new LogView({ socket_url: "/http", parent: this, auto_reconnect: false }), '#log-http');
      this.setView(new LogView({ socket_url: "/alert", parent: this, auto_reconnect: false }), '#log-alert');
      this.setView(new LogView({ socket_url: "/mon", parent: this, auto_reconnect: false }), '#log-monitor');
    }
  });
  
  return View;
});