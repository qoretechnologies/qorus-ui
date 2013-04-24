define([
  'underscore',
  'qorus/qorus',
  'models/order'
], function(_, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    url: function () {
      return '/rest/workflows/'+ this.workflowid + '/orders/';
    },
    initialize: function (opts) {
      this.opts = opts;
      this.opts.sort = 'started';
      
      if (opts.workflowid) {
        this.workflowid = opts.workflowid; 
        delete this.opts.workflowid;
      } else {
        this.url = '/rest/orders/';
      }

      if (this.opts.statuses == 'all') {
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
      console.log("Orders optinons -> ", this.opts);
      Collection.__super__.initialize.call(this, opts);
    },
    model: Model,
  });
  return Collection;
});