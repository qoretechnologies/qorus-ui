define(function (require) {
  var $ = require('jquery'),
    _ = require('underscore'),
    Qorus = require('qorus/qorus'),
    Template = require('text!templates/users/user.html'),
    View;
    
  var View = Qorus.View.extend({
    views: {},
    template: Template,
    
    initialize: function (opts) {
      _.bindAll(this);
      this.model = opts.model;
      console.log(this.model, opts);
    },
    
    render: function (ctx) {
      console.log(this.model, this.el, this.$el);
      this.context.item = this.model.toJSON();
      View.__super__.render.call(this, ctx);
    }
  });
  
  return View;
});