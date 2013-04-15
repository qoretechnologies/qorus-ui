// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
  'router',
  'bootstrap',
  'models/system'
], function($, _, Backbone, Router, _bootstrap, System){
  var initialize = function(){	
    Router.initialize();
  }

  return {
    initialize: initialize
  };
});