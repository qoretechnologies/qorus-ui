define(function(require) {
  var settings = require('settings'),
      Qorus    = require('qorus/qorus'), 
      Collection;
      
  Collection = Qorus.SortedCollection.extend({
    url: function() {
      return settings.REST_API_PREFIX + '/logs/';
    },
    initialize: function (models, opts){
    this.opts = opts;
      
      Collection.__super__.initialize.apply(this, arguments);
    }
  });
  
  return new Collection();
});
