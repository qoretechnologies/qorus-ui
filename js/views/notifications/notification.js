define(function (require) {
  var _     = require('underscore'),
      Qorus = require('qorus/qorus'),
      Template = require('tpl!templates/notifications/notification.html'),
      View;
  
  View = Qorus.View.extend({
    template: Template,
    
    initialize: function (opts) {
      _.bindAll(this);
      this.model = opts.model;
      this.opts = opts;
      this.on('prerender', this.updateContext);
    },
    
    updateContext: function () {
      this.context.item = this.model.toJSON();
    }
  });
  
  return View;
});
