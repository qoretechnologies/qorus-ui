define(function (require) {
  var Backbone   = require('backbone'),
      Model      = require('models/notification');
  
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
        this.set('session-id', obj.session_id);
      }
    },
    
    setSessionID: function (id) {
      this.set('session-id', id);
    }
    
  });
  
  return new Model();
});
