define(function (require) {
  var Qorus     = require('qorus/qorus'),
      settings  = require('settings'),
      Model     = require('models/error'),
      Collection;
  
  Collection = Qorus.SortedCollection.extend({
    sort_key: 'error',
    model: Model,
    url: function () {
      if (this.opts.workflowid) {
        return [settings.REST_API_PREFIX, 'errors', 'workflow', this.opts.workflowid].join('/');
      } 
      
      var type = this.opts.type || ''; 
      return [settings.REST_API_PREFIX, 'errors', type].join('/');
    }
  });
  
  return Collection;
});