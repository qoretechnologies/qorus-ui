define(function (require) {
  var settings = require('settings'),
      Qorus    = require('qorus/qorus'),
      Collection;

  Model = Qorus.ModelWithAlerts.extend({
    __name__: 'RemoteModel',
    idAttribute: 'name',
    
    // TODO: add api events for alerts updates
    api_events_list: [],

    doPing: function () {
      var self = this;
      $.put(this.url(), { 'action': 'ping' })
        .done(function (response) {
          self.trigger('ping', response);
        });
    }
  });

  Collection = Qorus.Collection.extend({
    model: Model,
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
