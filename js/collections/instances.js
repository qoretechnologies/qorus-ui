define([
  'underscore',
  'qorus/qorus',
  'models/instance'
], function(_, Qorus, Model){
  var Collection = Qorus.Collection.extend({
    initialize: function(date, opts){
      this.opts = opts;
      this.opts = opts.workflowid;
      Collection.__super__.initialize.call(this, date, opts);
    },
    model: Model,
  	methods: {
  		read: ['omq.system.service.info.getWorkflowInstances', 'opts']
  	}
  });
  // You don't usually return a collection instantiated
  return Collection;
});