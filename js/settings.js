define([
  'jquery',     // lib/jquery/jquery
  'underscore', // lib/underscore/underscore
  'backbone'    // lib/backbone/backbone
], function($, _, Backbone){
  var host = window.location.host;
  
  var settings = {
      DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss.SSS ddd ZZ',
      DATE_DISPLAY: 'YYYY-MM-DD HH:mm:ss',
      DATE_TSEPARATOR: 'YYYY-MM-DDTHH:mm:ss',      
      DATE_FROM: '1970-01-01',
      SEARCH_SEPARATOR: /[ ,]+/,
      REST_API_PREFIX: '/api',
      WS_PREFIX: '',
      EVENTS_WS_URL: 'ws://' + host + '/apievents'
  };
  
  return settings;
});
