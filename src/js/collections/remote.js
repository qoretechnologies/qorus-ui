define(function (require) {
  var _        = require('underscore'),
      settings = require('settings'),
      Qorus    = require('qorus/qorus'),
      Model    = require('models/remote'),
      Collection;

  Collection = Qorus.Collection.extend({
    model: Model,
    url: function () {
      return [settings.REST_API_PREFIX, 'remote', this.resource_type].join('/');
    },
    
    initialize: function (models, options) {
      this.opts = options || {};
      this.resource_type = this.opts.resource_type;
    },
    
    parse: function (response) {
      // add resource_type to each model
      _(response.results).each(function (result) {
        result.resource_type = this.options.resource_type;
      }, this);
      
      return response;
    }
  });
  
  return Collection;
});
