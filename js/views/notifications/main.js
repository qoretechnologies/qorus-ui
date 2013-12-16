define(function (require) {
  var _                 = require('underscore'),
      Qorus             = require('qorus/qorus'),
      Notifications     = require('collections/notifications'),
      IconView          = require('views/notifications/icon'),
      NotificationsView = require('views/notifications/notifications'),
      View;
  
  View = Qorus.View.extend({
    initialize: function () {
      this.collection = Notifications;
    },
        
    preRender: function () {
      this.setView(new IconView(), '#notification-icon');
    },
    
    showNotifications: function () {
      
    }
  });
});
