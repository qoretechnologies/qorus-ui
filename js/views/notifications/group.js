define(function (require) {
  var _             = require('underscore'),
      Qorus         = require('qorus/qorus'),
      Notifications = require('collections/notifications'),
      Template      = require('tpl!templates/notifications/group.html'),
      NView         = require('views/notifications/notification'),
      View;

  View = Qorus.View.extend({
    tagName: 'section',
    className: 'group',
    
    template: Template,
    additionalEvents: {
      "click .clear": 'clear'
    },
    
    initialize: function (opts) {
      _.bindAll(this);
      this.views = {};
      this.group = opts.group;
      this.on('prerender', this.updateContext);
    },

    clear: function () {
      Notifications.clear(this.group);
      this.off();
    },

    createModelView: function (model) {
      this.insertView(new NView({ model: model }), '.notifications', true);
    },
    
    updateContext: function () {
      this.context.name = this.group;
    }
  });
  
  return View;
});
