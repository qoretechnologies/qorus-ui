define(function (require) {
  var _        = require('underscore'),
      Backbone = require('backbone'),
      Qorus    = require('qorus/qorus'),
      Template = require('tpl!templates/notifications/notification.html'),
      View;
  
  View = Qorus.View.extend({
    template: Template,
    additionalEvents: {
      'click': 'navigate'
    },
    
    initialize: function (opts) {
      _.bindAll(this);
      this.model = opts.model;
      this.opts = opts;
      this.on('prerender', this.updateContext);
    },
    
    updateContext: function () {
      this.context.item = this.model.toJSON();
    },
    
    navigate: function () {
      var url = this.model.get('url');
      
      if (url) Backbone.history.navigate(url, { trigger: true });
    }
  });
  
  return View;
});