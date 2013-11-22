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
      this.listenTo(this.model, 'change', this.render);
    },
    
    render: function (ctx) {
      this.context.item = this.model.toJSON();
      View.__super__.render.call(this, ctx);
    }
  });
  
  return View;
});