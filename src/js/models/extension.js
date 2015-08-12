define([
  'settings',
  'underscore',
  'qorus/qorus'
], function(settings, _, Qorus){
  var Model = Qorus.Model.extend({
    urlRoot: settings.REST_API_PREFIX + '/system/options',
  });
  // Return the model for the module
  return Model;
});