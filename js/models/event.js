define([
  'jquery',
  'backbone',
  'qorus/qorus',
  'sprintf',
  'jquery.rest'
], function($, Backbone, Qorus){
  var Model = Qorus.Model.extend({
    dateAttributes: ['time',],
    set: function(attributes, options){
      var attr = this.parse(attributes);
      Model.__super__.set.call(this, attr, options);
    }
  });
  // Return the model for the module
  return Model;
});