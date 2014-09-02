define(function (require) {
  var settings = require('settings'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Model    = require('models/group'),
      Collection;
  
  Collection = Qorus.SortedCollection.extend({
    url: settings.REST_API_PREFIX + '/groups/',
    date: null,
    model: Model,
    pagination: false,
    
  	initialize: function(opts) {
      this.sort_key = 'enabled';
      this.sort_order = 'asc';
      this.sort_history = ['name',];
      this.opts = {};
  	}
  });
  return Collection;
});
