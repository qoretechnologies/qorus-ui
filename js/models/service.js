define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'sprintf'
], function($, _, Qorus){
  var ServiceModel = Qorus.Model.extend({
    urlRoot: '/rest/services/',
    idAttribute: "serviceid",
    // initialize: function(){
    //   this.on('change', console.log(sprintf('changed %s', this.id)));
    // }
  });
  return ServiceModel;
});