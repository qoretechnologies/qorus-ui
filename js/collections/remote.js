define(function (require) {
  var settings = require('settings'),
      Qorus    = require('qorus/qorus'),
      Collection;
      
  Collection = Qorus.Collection.extend({
    model: Qorus.ModelWithAlerts,
    url: function () {
      return [settings.REST_API_PREFIX, 'remote', this.resource_type].join('/');
    },
    
    initialize: function (models, options) {
      this.opts = options || {};
      this.resource_type = this.opts.resource_type;
    }
  });
  
  return Collection;
});
