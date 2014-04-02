define([
  'settings',
  'underscore',
  'qorus/qorus',
  'models/order'
], function(settings, _, Qorus, Model){
  
  var Collection = Qorus.SortedCollection.extend({
    model: Model,
    url: function () {
      return settings.REST_API_PREFIX + '/workflows/'+ this.workflowid + '/orders/';
    },
    
    initialize: function (models, opts) {
      Collection.__super__.initialize.call(this, arguments);
      
      if (!opts.date) {
        opts.date = this.date;
      }
      
      this.opts = opts;
      this.opts.sort = 'started';
      
      console.log(this.opts);
      
      if (opts.workflowid) {
        this.workflowid = opts.workflowid; 
        delete this.opts.workflowid;
      } else {
        this.url = settings.REST_API_PREFIX + '/orders/';
      }

      if (this.opts.statuses == 'all' || !this.opts.statuses) {
        delete this.opts.statuses;
      }
      
      // parse search values
      if (this.opts.search) {
        var ids = this.opts.search.ids ? this.opts.search.ids.split(/[, ]+/) : '';
        var keyvalues = this.opts.search.keyvalues ? this.opts.search.keyvalues.split(/[, ]+/) : '';
        
        if (ids.length > 0)
          this.opts.ids = ids.join(',');
        
        if (keyvalues.length > 0) 
          this.opts.keyvalue = keyvalues.join(',');
        
        delete this.opts.search;
      }

      delete this.opts.url;
    }
  });
  return Collection;
});