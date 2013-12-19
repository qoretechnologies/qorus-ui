define(function (require) {
  var _ = require('underscore'),
      Qorus = require('qorus/qorus'),
      Template = require('tpl!templates/notifications/list.html'),
      Notifications = require('collections/notifications'),
      View;
  
  View = Qorus.View.extend({
    template: Template,
    collection: Notifications,
    additionalEvents: {
      'click button.clear': 'clearGroup'
    },

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
    
    show: function () {
      this.$el.toggleClass('show');
    },

    off: function () {
      this.stopListening();
      this.undelegateEvents();
      this.$el.empty();
    },
    
    clearGroup: function (e) {
      var $target = $(e.currentTarget);
      
      if ($target.data('group')) {
        this.collection.clear($target.data('group'));
      }
    }
  });
  
  return new View();
});
