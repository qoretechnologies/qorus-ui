define(function (require) {
  var _          = require('underscore'),
      Backbone   = require('backbone'),
      Model      = require('models/notification'),
      Dispatcher = require('qorus/dispatcher'),
      Collection;
  
  // init localstorage
  require('localstorage');
    
  Model = Backbone.Model.extend({
    id: 'local-settings',
    
    idAttribute: this.id,
    
    localStorage: new Backbone.LocalStorage('Settings'),

    initialize: function () {
      this.id = 'local-settings';
    },
    
    dispatch: function (obj, ev) {
      if (ev === 'session:changed') {
        var model = this.get('session-id');
        model.set()
      }
    }
    
  });
  
  return new Model();
});
