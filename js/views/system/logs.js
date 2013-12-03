define(function (require) {
  var $ = require('jquery'),
    _ = require('underscore'),
    Qorus = require('qorus/qorus'),
    LogView = require('views/log'),
    Template = require('tpl!templates/system/logs.html'),
    View;
  
  View = Qorus.View.extend({
    additionalEvents:  {
      'click .nav a': 'tabToggle'
    },
    template: Template,
    
    initialize: function () {
      View.__super__.initialize.apply(this, arguments);
      this.on('show', this.onShow);
    },
    
    preRender: function () {
      this.setView(new LogView({ socket_url: "/system", parent: this }), '#log-main');
      this.setView(new LogView({ socket_url: "/audit", parent: this, auto_reconnect: false }), '#log-audit');
      this.setView(new LogView({ socket_url: "/http", parent: this, auto_reconnect: false }), '#log-http');
      this.setView(new LogView({ socket_url: "/alert", parent: this, auto_reconnect: false }), '#log-alert');
      this.setView(new LogView({ socket_url: "/mon", parent: this, auto_reconnect: false }), '#log-monitor');
    },
    
    tabToggle: function (e) {
      var $target = $(e.currentTarget),
        view;
      
      e.preventDefault();
      
      target_name = $target.data('target') || $target.attr('href');
      $target.tab('show');
      
      view = this.getView(target_name);
      if (view) view.trigger('show');
    },
    
    onShow: function () {
      var $target, target_name, view;
      
      $target = this.$('.nav .active a');
      target_name = $target.data('target') || $target.attr('href');
      view = this.getView(target_name);
      if (view) view.trigger('show');
    }
  });
  
  return View;
});