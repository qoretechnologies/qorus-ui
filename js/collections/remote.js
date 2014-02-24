define(function (require) {
  var settings = require('settings'),
      Qorus    = require('qorus/qorus'),
      Collection;

  Model = Qorus.ModelWithAlerts.extend({
    doPing: function () {}
  })

  Collection = Qorus.Collection.extend({
    model: Qorus.ModelWithAlerts,
    url: function () {
      return [settings.REST_API_PREFIX, 'remote', this.resource_type].join('/');
    },
    
    initialize: function (models, options) {
      this.opts = options || {};
      this.resource_type = this.opts.resource_type;
    },
    
    parse: function (response, options) {
      // add resource_type to each model
      _(response.results).each(function (result) {
        result.resource_type = this.options.resource_type;
      }, this);
      
      return response
    }
  });
  
  return Collection;
});
