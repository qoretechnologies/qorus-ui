define([
  'underscore',
  'qorus/qorus',
  // Pull in the Model module from above
  'models/job'
], function(_, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    url: '/rest/jobs/',
    model: Model,
  });
  // You don't usually return a collection instantiated
  return Collection;
});