define(function (require) {
  var localstorage = require('localstorage'),
      Model = require('models/notification'),
      Collection;
    
  Collection = Backbone.Collection.extend({
    model: Model,
    localStorage: new Backbone.LocalStorage('Notifications'),
    
    createGroupList: function () {
      var group_names = this.pluck('group'), 
          groups      = {},
          self        = this;

      _.each(group_names, function (group) {
        var ntfc = self.where({ group: group });
        groups[group] = {
          name: group,
          notifications: _.invoke(ntfc, 'toJSON')
        }
      });
      return groups;
    }
  });
  
  return new Collection();
});
