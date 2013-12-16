define(function (require) {
  var _             = require('underscore'),
      Qorus         = require('qorus/qorus'),
      Notifications = require('collections/notifications'),
      Template      = require('tpl!templates/notifications/header_icon.html'),
      View;
  
  View = Qorus.View.extend({
    template: Template,
    
    initialize: function () {
      _.bindAll(this);
      View.__super__.initialize.call(this, arguments);
      this.collection = Notifications;
      this.collection.fetch();

      this.listenTo(this.collection, 'sync', this.addTest);
      this.listenTo(this.collection, 'sync', this.render);
      this.listenTo(this.collection, 'add', this.render);
    },
        
    addTest: function () {
      if (this.collection.size() === 0)
        this.collection.create({ group: "system", level: 1, title: "test", description: "popis" });
    },
    
    preRender: function () {
      this.context.count = this.collection.size();
    },
    
    off: function () {
      this.stopListening();
      this.undelegateEvents();
      this.$el.empty();
    }
  });
  
  return View;
});
