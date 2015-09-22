define(function (require) {
  var Qorus         = require('qorus/qorus'),
      Notifications = require('collections/notifications'),
      Template      = require('tpl!templates/notifications/header_icon.html'),
      NView         = require('views/notifications/notifications'),
      currentUser   = require('models/system').User,
      View;

  require('messenger');

  View = Qorus.View.extend({
    template: Template,
    additionalEvents: {
      'click': 'showNotifications'
    },

    initialize: function () {
      View.__super__.initialize.call(this, arguments);
      this.collection = Notifications;

      // this.listenTo(this.collection, 'all', function () { console.log(arguments); } );
      // this.listenTo(this.collection, 'sync', this.addTest);
      this.listenTo(this.collection, 'sync', this.render);
      this.listenTo(this.collection, 'add', this.render);
      this.listenTo(this.collection, 'add', this.showMessage);
      this.collection.fetch({ silent: true });
    },

    showNotifications: function () {
      NView.show();
    },

    addTest: function () {
      if (this.collection.size() === 0)
        this.collection.create({ group: "system", type: 1, title: "test", description: "popis" });
    },

    preRender: function () {
      this.context.count = this.collection.size();
    },

    showMessage: function (model) {
      var msg = model.get('title'),
          type = model.get('type');

      if (currentUser.getPreferences('ui.notifications.show')) {
        $.globalMessenger().post({ message: msg, type: type || 'info', showCloseButton: true });
      }
    },

    getLevelCSS: function () {
      // if (level )
    },

    close: function () {
      this.stopListening();
      this.undelegateEvents();
      this.$el.empty();
    }
  });

  return View;
});
