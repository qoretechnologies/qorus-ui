define(function (require) {
  var $      = require('jquery'),
    _        = require('underscore'),
    Qorus    = require('qorus/qorus'),
    Template = require('text!templates/users/user.html'),
    View;
    
  var View = Qorus.View.extend({
    template: Template,
    
    initialize: function (opts) {
      this.context = {};
      this.views = {};
      this.options = {};
      this.model = opts.model;
      this.listenTo(this.model, 'change', this.render);
    },
    
    render: function (ctx) {
      this.context.item = this.model.toJSON();
      View.__super__.render.call(this, ctx);
    },
    
    off: function () {
      this.stopListening();
      this.undelegateEvents();
      this.$el.empty();
    }
  });
  
  return View;
});
