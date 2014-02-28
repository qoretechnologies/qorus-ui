define(function (require) {
  var settings = require('settings'),
      Qorus    = require('qorus/qorus'),
      Model    = require('models/workflow'),
      Collection;
  
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
          this.date = opts.date;
          if (opts.opts) {
            this.opts.deprecated = (opts.opts.deprecated == 'hidden'); 
          }
      }

      debug.log("deprecated",this.opts.deprecated, this.opts);
    }
  });

  return Collection;
});
