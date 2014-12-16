define(function (require) {
  var Qorus     = require('qorus/qorus'),
      settings  = require('settings'),
      Collection;
  
  Collection = Qorus.SortedCollection.extend({
    url: settings.REST_API_PREFIX + '/errors'
  });
  
  return Collection;
});