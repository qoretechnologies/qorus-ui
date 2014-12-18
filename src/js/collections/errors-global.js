define(function (require) {
  var settings  = require('settings'),
      Errors    = require('collections/errors'),
      Collection;
  
  Collection = Errors.extend({
    url: [settings.REST_API_PREFIX, 'errors', 'global'].join('/')
  });
  
  return new Collection().fetch();
});