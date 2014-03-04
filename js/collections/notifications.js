define(function (require) {
  var _           = require('underscore'),
      Backbone    = require('backbone'),
      Model       = require('models/notification'),
      Dispatcher  = require('qorus/dispatcher'),
      SettingsCol = require('models/settings'),
      Collection, notifications;
  
  // init localstorage
  require('localstorage');
    
  Collection = Backbone.Collection.extend({
    model: Model,
    localStorage: new Backbone.LocalStorage('Notifications'),
    
    dispatch: function (obj, ev) {
      var alert, alert_type, alert_event;

      if (ev === 'system') {
        if (obj.eventstr === 'SYSTEM_SHUTDOWN') {
          this.clear();
        }        
      } else if (ev === 'session:changed') {
        this.clear();
      } else if (ev === 'alert') {
        alert_event = obj.eventstr.split('_');
        alert = obj.info;
        alert_type = alert_event[1];
        
        if (alert_event[2] === 'RAISED') {
          this.create({
            id: "alert-" + alert.id,
            group: 'alerts-' + alert_type,
            title: alert.alert,
            type: 'error',
            description: alert.name,
            url: sprintf("/system/alerts/%s/%s", alert_type, alert.id)
          });          
        } else if (alert_event[2] === 'CLEARED') {
          alert = this.get("alert-"+ alert.id);
          if (alert) alert.destroy();
        }
      }
    },
    
    createGroupList: function () {
      var group_names = this.pluck('group'), 
          groups      = {},
          self        = this;

      _.each(group_names, function (group) {
        var ntfc = self.where({ group: group });
        groups[group] = {
          name: group,
          notifications: _.invoke(ntfc, 'toJSON')
        };
      });
      return groups;
    }, 
    
    clear: function (group) {
      // ongoing alerts can't be cleared manually
      if (group === 'alerts-ongoing') return false;
      
      if (group) {
        _.each(this.where({ group: group}), function (model) {
          model.destroy({ silent: true });
        });
        this.trigger(sprintf('cleared:%s', group));
      } else {
        _(this.models).each(function (model) {
          model.destroy({ silent: true });
        });
        this.reset();
      }
      this.trigger('sync');
    }, 
    
    empty: function () {
      console.log('emptying', this.size());
      this.clear();
      console.log('after emptying', this.size());
    }
  });
  
  notifications = new Collection();
  
  notifications.listenTo(Dispatcher, 'system session:changed alert', notifications.dispatch);
  notifications.listenTo(SettingsCol, 'change:session-id', notifications.empty);
  
  return new Collection();
});
