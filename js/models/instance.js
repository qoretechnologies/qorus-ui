define([
  'qorus/qorus'
], function(Qorus){
  var Model = Qorus.Model.extend({
    urlRoot: '/rest/instances/',
    idAttribute: "executionID",
  });
  return Model;
});