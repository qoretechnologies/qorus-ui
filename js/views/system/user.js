define(function (require) {
  var $ = require('jquery'),
    _ = require('underscore'),
    Qorus = require('qorus/qorus'),
    View;
    
  var View = Qorus.View.extend({
    views: {},
    
    initialize: function (opts) {
      this.model = opts.model;
      // this.listenTo(this.model, 'change', this.render);
      console.log(this.model);
    },
    
    render: function (ctx) {
      this.context.item = this.model.toJSON();
      View.__super__.render.call(this, ctx);
    }
  });
  
  return View;
});