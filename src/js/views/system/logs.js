define(function (require) {
  var $ = require('jquery'),
    _ = require('underscore'),
    Qorus = require('qorus/qorus'),
    LogView = require('views/log'),
    Template = require('tpl!templates/system/logs.html'),
    View;

  View = Qorus.TabView.extend({
    url: '/logs',
    template: Template,
    tabs: {
      'log-main': {
        view: LogView,
        options: {
          socket_url: "/system"
        }
      },
      'log-audit': {
        view: LogView,
        options: {
          socket_url: "/audit",
          auto_reconnect: false
        }
      },
      'log-http': {
        view: LogView,
        options: {
          socket_url: "/http",
          auto_reconnect: false
        }
      },
      'log-alert': {
        view: LogView,
        options: {
          socket_url: "/alert",
          auto_reconnect: false
        }
      },
      'log-monitor': {
        view: LogView,
        options: {
          socket_url: "/mon",
          auto_reconnect: false
        }
      }
    }
  });

  return View;
});
