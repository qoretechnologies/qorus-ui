define(function (require) {
  var _             = require('underscore'),
      Qorus         = require('qorus/qorus'),
      Template      = require('tpl!templates/notifications/list.html'),
      Notifications = require('collections/notifications'),
      GroupView     = require('views/notifications/group'),
      View;
  
  View = Qorus.View.extend({
    template: Template,
    collection: Notifications,

    initialize: function () {
      View.__super__.initialize.apply(this, arguments);
      
      this.setElement($('#notifications-list'));
      this.listenTo(this.collection, 'sync', this.addNotifications);
      this.listenTo(this.collection, 'add', this.addNotification);
      // this.on('prerender', this.updateContext);
      
      this.render();
    },
    
    addGroup: function (group) {
      var group_id = '#group-' + group,
          view = this.getView(group_id);
          
      if (!view) {
        view = this.setView(new GroupView({ group: group }), group_id);
        this.$el.append(view.render().$el);
        this.listenToOnce(view, 'destroy',  function () {
          delete this.views[group_id];
        });
      }

      return view;
    },
    
    addNotification: function (notification) {
      var view = this.addGroup(notification.get('group'));
      view.createModelView(notification);
    },
    
    addNotifications: function (notifications) {
      if (!notifications) return;
      var self = this;
      _.each(notifications.models, function (n) {
        self.addNotification(n);
      });
    },
    
    show: function () {
      this.$el.toggleClass('show');
    },

    off: function () {
      this.stopListening();
      this.undelegateEvents();
      this.$el.empty();
    }
  });
  
  return new View();
});