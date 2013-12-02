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
      this.sort_key = 'name';
      this.sort_history = ['default',];
      this.opts = {};
  	}
  });
  return Collection;
});