define(function (require) { 
  var Backbone = require('backbone'),
      Qorus    = require('qorus/qorus'),
      settings = require('settings'),
      moment   = require('moment'),
      Model;
  
  require('localstorage');
  
  Model = Qorus.Model.extend({
    localStorage: new Backbone.LocalStorage('Notifications'),
    defaults: {
      'date': moment().format(settings.DATE_DISPLAY)
    }
  });

  return Model;
});
