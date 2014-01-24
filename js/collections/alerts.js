define(function (require) {
  var _             = require('underscore'), 
      settings      = require('settings'),
      Qorus         = require('qorus/qorus'),
      Model         = require('models/alert'),
      Notifications = require('collections/notifications'),
      Collection;
       
  Collection = Qorus.SortedCollection.extend({
    limit: 100,
    model: Model,
    url: function () {
      var url = settings.REST_API_PREFIX + '/system/alerts/';
      if (!this.type) return url;
      return url + this.type;
    },
    
    initialize: function (models, opts) {
      Collection.__super__.initialize.apply(this, arguments);
      this.sort_key = 'type';
      this.sort_order = 'des';
      this.sort_history = ['when'];
      
      if (opts) {
        this.type = opts.type;
      }
      
      this.on('add', this.notify);
    },
    
    hasNextPage: function () {
      return false;
    },
    
    notify: function (model) {
      Notifications.create({
        id: "alert-" + model.id,
        group: 'alerts-' + model.get('alerttype'),
        title: model.get('alert'),
        type: 'error',
        description: model.get('name'),
        url: sprintf("/system/alerts/%s/%s", model.get('alerttype'), model.id)
      });
    }
  });
  // You don't usually return a collection instantiated
  return Collection;
});
