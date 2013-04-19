define([
  'underscore',
  'qorus/qorus',
  // Pull in the Model module from above
  'models/step'
], function(_, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    url: '/rest/steps/',
    model: Model
  });
  // You don't usually return a collection instantiated
  return Collection;
});
