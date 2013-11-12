define([
  'settings',
  'underscore',
  'qorus/qorus'
], function(settings, _, Qorus){
  var Model = Qorus.Model.extend({
    dateAttributes: ['when'],
  });
  // Return the model for the module
  return Model;
});