define(function (require) {
  var localstorage = require('localstorage'),
      Model = require('models/notification'),
      Collection;
    
  Collection = Backbone.Collection.extend({
    model: Model,
    localStorage: new Backbone.LocalStorage('Notifications')
  });
  
  return new Collection();
});