define(function (require) {
  var _ = require('underscore'),
      Qorus = require('qorus/qorus'),
      Template = require('tpl!templates/notifications/list.html'),
      Notifications = require('collections/notifications'),
      View;
  
  View = Qorus.View.extend({ 
    template: Template,
    collection: Notifications,

    initialize: function () {
      _.bindAll(this);
      View.__super__.initialize.apply(this, arguments);
      
      this.setElement($('#notifications-list'));
      this.listenTo(this.collection, 'sync add remove', this.render);
      this.on('prerender', this.updateContext);
      
      this.render();
    },
    
    updateContext: function () {
      this.context.groups = this.collection.createGroupList();
    },

    off: function () {
      this.stopListening();
      this.undelegateEvents();
      this.$el.empty();
    }
  });
  
  return new View();
});