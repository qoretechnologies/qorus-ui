define(function (require) {
  var settings  = require('settings'),
      Qorus     = require('qorus/qorus'),
      Model     = require('models/permission'),
      Collection;
  
  Collection = Qorus.SortedCollection.extend({
    model: Model,
    url: settings.REST_API_PREFIX + '/system/rbac/permissions'
  });

  return Collection;
});
