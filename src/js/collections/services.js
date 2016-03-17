define(function (require) {
  var settings = require('settings'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Model    = require('models/service'),
      Collection;

  Collection = Qorus.SortedCollection.extend({
    limit: 1000,
    url: settings.REST_API_PREFIX + '/services/',
    model: Model,
    pagination: false,

    initialize: function (opts){
      debug.log('Service collection opts', opts);
      this.sort_key = 'type';
      this.sort_order = 'asc';
      this.sort_history = ['name'];
      this.opts = opts;

      if (opts) {
        this.date = opts.date;
      }
    }
  });
  
  return Collection;
});
