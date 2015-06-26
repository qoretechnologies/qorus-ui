define(function (require) {
  var Qorus    = require('qorus/qorus'),
      settings = require('settings')
      Model    = require('cjs!models/valueset');

  var Collection = Qorus.Collection.extend({
    url: settings.REST_API_PREFIX + '/valuesets',
    model: Model
  });

  return Collection;
});
