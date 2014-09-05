define(function (require) {
  var settings = require('settings'),
      Qorus    = require('qorus/qorus'),
      Collection;
  
  Collection = Qorus.SortedCollection.extend({
    model: Qorus.Model,
    url: settings.REST_API_PREFIX + '/system/rbac/permissions'
  });

  return Collection;
});
