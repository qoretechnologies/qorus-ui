define(function (require) {
  var $ = require('jquery'),
    _ = require('underscore'),
    Qorus = require('qorus/qorus'),
    HealthView = require('views/system/health'),
    UserView = require('views/system/user'),
    Template = require('text!templates/common/header.html'),
    View;
  
  View = Qorus.View.extend({
    views: {},
    template: Template,
    
    initialize: function (opts) {
      // View.__super__.initialize.call(this, opts);      
      _.bindAll(this);
      this.model = opts.info;
      this.user = opts.user;
    },
    
    render: function (ctx) {
      this.context.item = this.model.toJSON();
      View.__super__.render.call(this, ctx);
    },
    
    onRender: function () {
      this.setView(new HealthView(), '#health', true);
      this.setView(new UserView({ model: this.user }), '#user-info', true);
    }
  });
  
  return View;
});