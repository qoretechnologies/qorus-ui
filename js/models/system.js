define([
  'underscore',
  'qorus/qorus'
], function(_, Qorus){
    var System = {};
  System.Info = Qorus.Model.extend({
    url: '/rest/system'
  });
  System.User = Qorus.Model.extend({
    url: '/rest/users'
  });
  return System;
});