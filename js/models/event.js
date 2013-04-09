define([
  'jquery',
  'backbone',
  'qorus/qorus',
  'sprintf',
  'jquery.rest'
], function($, Backbone, Qorus){
  var Model = Qorus.Model.extend({
    urlRoot: "/"
  });
  // Return the model for the module
  return Model;
});