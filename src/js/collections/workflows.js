define(function (require) {
  var settings = require('settings'),
      Qorus    = require('qorus/qorus'),
      Model    = require('models/workflow'),
      Collection, defaults;
  
  defaults = {
    'IN-PROGRESS': 0,
    'READY': 0,
    'SCHEDULED': 0,
    'COMPLETE': 0,
    'INCOMPLETE': 0,
    'ERROR': 0,
    'CANCELED': 0,
    'RETRY': 0,
    'WAITING': 0,
    'ASYNC-WAITING': 0,
    'EVENT-WAITING': 0,
    'BLOCKED': 0,
    'CRASH': 0,
    'TOTAL': 0
  };
  
  Collection = Qorus.SortedCollection.extend({
    __name__: 'WorkflowCollection',
    url: settings.REST_API_PREFIX + '/workflows/',
    date: null,
    model: Model,
    pagination: false,
    
    initialize: function (models, opts) {
      this.sort_key = 'exec_count';
      this.sort_order = 'des';
      this.sort_history = ['name'];
      this.opts = {};
      this.opts.deprecated = false;
      

      if (opts) {
          this.opts = opts;
          this.opts.deprecated = (opts.deprecated === 'hidden'); 
      }
    },
    
    parse: function (response, options) {
      _.map(response, function (model) { 
        _.defaults(model, defaults);
      });
      return response;
    }
  });

  return Collection;
});
