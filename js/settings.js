define([
  // These are path alias that we configured in our bootstrap
  'jquery',     // lib/jquery/jquery
  'underscore', // lib/underscore/underscore
  'backbone'    // lib/backbone/backbone
], function($, _, Backbone){
  var settings = {
      DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss.SSS ddd ZZ',
      DATE_DISPLAY: 'YYYY-MM-DD HH:mm:ss',    
      DATE_FROM: '1980-01-01'
  }
  return settings;
});
