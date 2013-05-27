define([
  'settings',
  'underscore',
  'qorus/qorus',
  // Pull in the Model module from above
  'models/step'
], function(settings, _, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    url: settings.REST_API_PREFIX + '/steps/',
    model: Model
  });
  // You don't usually return a collection instantiated
  return Collection;
});
