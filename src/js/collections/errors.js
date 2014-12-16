define(function (require) {
  var Qorus     = require('qorus/qorus'),
      settings  = require('settings'),
      Collection;
  
  Collection = Qorus.SortedCollection.extend({
    url: function () {
      var type = this.opts.type || ''; 
      return [settings.REST_API_PREFIX, 'errors', type].join('/');
    }
  });
  
  return Collection;
});