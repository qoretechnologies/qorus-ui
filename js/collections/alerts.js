define(function (require) {
  var settings      = require('settings'),
      _             = require('underscore'),
      Qorus         = require('qorus/qorus'),
      Model         = require('models/alert'),
      Notifications = require('collections/notifications'),
      Collection;
       
  Collection = Qorus.SortedCollection.extend({
    limit: 100,
    model: Model,
    url: function () {
      return settings.REST_API_PREFIX + '/system/alerts/' + this.type;
    },
    
    initialize: function (models, opts) {
      Collection.__super__.initialize.apply(this, arguments);
      this.sort_key = 'type';
      this.sort_order = 'des';
      this.sort_history = ['when'];
      
      if (opts.type) {
        this.type = opts.type;
      }
      
      this.on('add', this.notify);
    },
    
    hasNextPage: function () {
      return false;
    },
    
    notify: function (model) {
      Notifications.create({ id: "alert-" + model.id, group: 'alerts', title: model.get('alert'), type: 'error', description: model.get('name') });
    }
  });
  // You don't usually return a collection instantiated
  return Collection;
});
