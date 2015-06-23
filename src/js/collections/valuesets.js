define(function (require) {
  var Qorus    = require('qorus/qorus'),
      settings = require('settings');

  var Collection = Qorus.Collection.extend({
    url: settings.REST_API_PREFIX + '/valuesets',
    dateAttributes: ['created', 'modified']
  });

  return Collection;
});
