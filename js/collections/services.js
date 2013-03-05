define([
  'underscore',
  'qorus/qorus',
  // Pull in the Model module from above
  'models/service'
], function(_, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    model: Model,
  	methods: {
  		read: [
        ['omq.system.service.webapp.getAllServiceInfo'],
  		]
  	}
  });
  return Collection;
});
