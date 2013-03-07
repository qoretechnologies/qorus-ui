define([
  'underscore',
  'backbone',
  'libs/backbone.rpc'
], function(_, Backbone, Rpc){
  var ServiceModel = Backbone.Model.extend({
    urlRoot: '/rest/services/',
    idAttribute: "serviceid",
  });
  return ServiceModel;
});