define([
  'settings',
  'underscore',
  'qorus/qorus',
  // Pull in the Model module from above
  // 'models/extension'
], function(settings, _, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    url: settings.REST_API_PREFIX + '/system/ui/extensions',
    sort_key: 'group',
    sort_order: 'asc',
    sort_history: ['menuname'],
    
    initialize: function (opts) {
      this.opts = opts || {};
    },
    
    // parse: function (response) {
    //   var keys = _.keys(response);
    //   var models = [];
    //   
    //   _.each(keys, function(key) {
    //     var model = { name: key, properties: response[key] };
    //     models.push(model);
    //   });
    //   
    //   return models;
    // }
    getGroups: function () {
      return _.uniq(this.pluck('group'));
    },
    
    grouped: function () {
      var models = this;
      var groups = this.getGroups();
      var glist = {};
      
      _.each(groups, function (group) {
        glist[group] = models.where({ group: group });
      });
      debug.log(glist);
      return glist;
    }
  });
  // You don't usually return a collection instantiated
  return Collection;
});
