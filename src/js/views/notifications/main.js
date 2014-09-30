define(function (require) {
  var Qorus             = require('qorus/qorus'),
      Notifications     = require('collections/notifications'),
      IconView          = require('views/notifications/icon'),
      NotificationsView = require('views/notifications/notifications'),
      Template          = require('tpl!templates/notifications/main.html'),
      View;
  
  View = Qorus.View.extend({
    template: Template,
    initialize: function () {
      this.collection = Notifications;
      this.collection.fetch();
    },
        
    onRender: function () {
      this.setView(new IconView(), '#notification-icon', true);
      this.setView(new NotificationsView(), '#notifications-list', true);
    },
    
    showNotifications: function () {
      var view = this.getView('#notifications-list');
      view.show();
    },
    
    close: function () {
      this.stopListening();
      this.undelegateEvents();
      this.$el.empty();
    }
  });
  
  return View;
});
