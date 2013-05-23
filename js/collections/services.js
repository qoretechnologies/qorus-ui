define([
  'underscore',
  'qorus/qorus',
  // Pull in the Model module from above
  'models/service'
], function(_, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    limit: 1000,
    url: "/rest/services/",
    model: Model
  });
  return Collection;
});
