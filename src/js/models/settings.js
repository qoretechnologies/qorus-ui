define(function (require) {
  var Backbone   = require('backbone'),
      Model      = require('models/notification'),
      Dispatcher = require('qorus/dispatcher'),
      moment     = require('moment'),
      event_session_changed;
  
  // init localstorage
  require('localstorage');
  
  
  event_session_changed = { 
    "time" : moment().format("YYYY-MM-DD HH:mm:ss.SSS Z"), 
    "classstr" : "WEBAPP",
    "eventstr" : "SESSION_CHANGED", 
    "severity" : 0, 
    "severitystr" : "INFO", 
    "caller" : "<webapp>",
    "info": {
      "cls": "webapp",
      "name": "Session Changed"
    }
  };
    
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
        this.setSessionID(obj.session_id);
      }
    },
    
    setSessionID: function (id) {
      this.save({ 'session-id': id });
    }
    
  });
  
  return new Model();
});
