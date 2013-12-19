define(function (require) { 
  var Backbone = require('backbone'),
      Qorus    = require('qorus/qorus'),
      Model;
  
  require('localstorage');
  
  Model = Qorus.Model.extend({
    localStorage: new Backbone.LocalStorage('Notifications')
  });

  return Model;
});
