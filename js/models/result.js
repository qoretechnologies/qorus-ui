define([
  'settings',
  'underscore',
  'qorus/qorus'
], function(settings, _, Qorus){
  var Model = Qorus.Model.extend({
    idAttribute: 'job_instanceid',
    urlRoot: settings.REST_API_PREFIX + '/jobresults/',
    dateAttributes: ['started', 'modified'],
  });
  // Return the model for the module
  return Model;
});