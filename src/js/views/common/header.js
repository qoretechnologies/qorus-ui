define(function (require) {
  require('backbone');
  
  var $                 = require('jquery'),
      Qorus             = require('qorus/qorus'),
      HealthView        = require('views/system/health'),
      UserView          = require('views/system/user'),
      Template          = require('text!templates/common/header.html'),
      NotificationsView = require('views/notifications/icon'),
      View;
  
  View = Qorus.View.extend({
    template: Template,
    
    initialize: function (opts) {
      View.__super__.initialize.apply(this, arguments);
      this.model = opts.info;
      this.user = opts.user;
      this.setElement($('#header'));
      this.render();
    },
    
    render: function (ctx) {
      this.context.item = this.model.toJSON();
      View.__super__.render.call(this, ctx);
      return this;
    },
    
    preRender: function () {
      this.setView(new HealthView(), '#health');
      this.setView(new UserView({ model: this.user }), '#user-info');
      this.setView(new NotificationsView(), '#notifications-icon');
    }
  });
  
  return View;
});
