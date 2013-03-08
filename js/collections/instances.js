define([
  'underscore',
  'qorus/qorus',
  'models/instance'
], function(_, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    url: function() {
      return '/rest/workflows/'+ this.workflowid + '/instances/'
    },
    initialize: function(opts){
      this.opts = opts;
      this.workflowid = opts.workflowid;
      Collection.__super__.initialize.call(this, opts);
    },
    model: Model,
  });
  return Collection;
});