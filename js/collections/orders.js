define([
  'underscore',
  'qorus/qorus',
  'models/order'
], function(_, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    url: function() {
      return '/rest/workflows/'+ this.workflowid + '/orders/'
    },
    initialize: function(opts){
      this.opts = opts;
      this.workflowid = opts.workflowid;

      if(this.opts.statuses == 'all'){
        delete this.opts.statuses;
      }
      
      delete this.opts.workflowid;
      delete this.opts.url;
      Collection.__super__.initialize.call(this, opts);
    },
    model: Model,
  });
  return Collection;
});