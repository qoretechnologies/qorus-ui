define([
  'settings',
  'underscore',
  'qorus/qorus'
], function(settings, _, Qorus){
  var Model = Qorus.Model.extend({
    urlRoot: settings.REST_API_PREFIX + '/system/options',
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
    }
  });
  // Return the model for the module
  return Model;
});