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
      this.fetch();
    },
    
    dispatch: function (obj, ev) {
      if (ev === 'session:changed') {
        model.set('session-id', obj.session_id);
      }
    },
    
    setSessionID: function (id) {
      this.set('session-id', id);
    }
    
  });
  
  return new Model();
});
