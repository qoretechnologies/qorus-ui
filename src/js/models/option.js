define(function(require) {
  var settings = require('settings'),
      _        = require('underscore'),
      $        = require('jquery'),
      Qorus    = require('qorus/qorus'),
      Model;

  Model = Qorus.Model.extend({
    urlRoot: settings.REST_API_PREFIX + '/system/options',
    idAttribute: 'name',
    
    defaults: {
      system: true
    },
    
    parse: function  (response, options) {
      var interval = [];
      response = Model.__super__.parse.call(this, response, options);      
      
      _.each(response.interval, function (inter) {
        if (inter == -1) {
          inter = "&#8734";
        }
        interval.push(inter);
      });
      
      response.interval = interval;
      
      return response;
    },
    
    setValue: function (value) {
      var self = this;
      $.put(this.url(), { action: 'set', value: value })
        .done(function () {
          self.set({ value: value });
        });
    }
  });
  // Return the model for the module
  return Model;
});
