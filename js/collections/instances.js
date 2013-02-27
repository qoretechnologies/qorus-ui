define([
  'underscore',
  'qorus/qorus',
  'models/instance'
], function(_, Qorus, Model){
  var Collection = Qorus.Collection.extend({
    model: Model,
	methods: {
		read: ['omq.system.service.info.getWorkflowInstances', 'workflowid']
	}
  });
  // You don't usually return a collection instantiated
  return Collection;
});