// Filename: app.js
define([
  'settings',
  'router'
], function(settings, Router){  
  
  var initialize = function(){
    debug.log('initializing router');
    Router.initialize();
  }

  return {
    initialize: initialize
  };
});