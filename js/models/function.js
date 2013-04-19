define([
  'underscore',
  'qorus/qorus'
], function(_, Qorus){
  var Model = Qorus.Model.extend({
    idAttribute: "function_instanceid",
    urlRoot: '/rest/functions/',
    dateAttributes: ['created', 'modified']
  });
  // Return the model for the module
  return Model;
});