define([
  'underscore',
  'qorus/qorus'
], function(_, Qorus){
  var Model = Qorus.Model.extend({
    idAttribute: "stepid",
    urlRoot: '/rest/steps/',
    dateAttributes: ['last_executed']
  });
  // Return the model for the module
  return Model;
});