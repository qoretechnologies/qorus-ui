define(function (require) {
  var Qorus    = require('qorus/qorus'),
      settings = require('settings'),
      Model;
  
  Model = Qorus.Model.extend({
    idAttribute: "username",
    urlRoot: settings.REST_API_PREFIX + '/users/',
    hasPermissions: function (perm) {
      if (typeof perm === 'string')
        return this.get('permissions').indexOf(perm) > -1;
      
      return false;
    }
  });

  return Model;
});
