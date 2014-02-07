define(function (require) {
  var settings = require('settings'),
      Qorus    = require('qorus/qorus'),
      Collection;
      
  Collection = Qorus.Collection.extend({
    url: function () {
      return [settings.REST_API_PREFIX, 'remote', this.resource_type].join('/');
    },
    
    initialize: function (options) {
      console.log(options);
      this.options = options || {};
      this.resource_type = this.options.resource_type;
    }
  });
  
  return Collection;
});
