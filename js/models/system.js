define([
  'underscore',
  'qorus/qorus'
], function(_, Qorus){
    var System = {};
  System.Info = Qorus.Model.extend({
  	methods: {
  		read: ['omq.system.get-status']
  	}
  });
  System.User = Qorus.Model.extend({
  	methods: {
  		read: ['omq.system.get-current-user-info']
  	}
  });
  return System;
});