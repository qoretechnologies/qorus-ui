define([
  'underscore',
  'qorus/qorus',
  'models/instance'
], function(_, Qorus, Model){
  var Collection = Qorus.Collection.extend({
    url: function() {
      return '/rest/workflows/'+ this.workflowid + '/instances/'
    },
    initialize: function(date, opts){
      this.opts = opts;
      this.workflowid = opts.workflowid;
      Collection.__super__.initialize.call(this, date, opts);
    },
    model: Model,
  });
  return Collection;
});