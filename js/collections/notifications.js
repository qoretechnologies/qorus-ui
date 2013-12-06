define(function (require) {
  var $ = require('jquery'),
      _ = require('underscore'),
      Backbone = require('backbone'),
      localstorage = require('localstorage'),
      Qorus = require('qorus/qorus'),
      Model = require('models/notification'),
      Collection;
    
  Collection = Backbone.Collection.extend({
    model: Model,
    localStorage: new Backbone.LocalStorage('Qorus.Notifications')
  });
  
  return new Collection();
});