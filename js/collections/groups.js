define([
  'settings',
  'underscore',
  'qorus/qorus',
  'models/group'
], function(settings, _, Qorus, Model){
  var Collection = Qorus.SortedCollection.extend({
    url: settings.REST_API_PREFIX + '/groups/',
    date: null,
    model: Model,
    pagination: false,
    
  	initialize: function(opts){
      this.sort_key = 'enabled';
      this.sort_order = 'asc';
      this.sort_history = ['name',];
      this.opts = {};
  	}
  });
  return Collection;
});