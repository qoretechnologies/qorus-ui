define(function () {
  var host = window.location.host;
  var wshost = host;
  var protocol = window.location.protocol;
  var ws_protocol = (protocol == 'https:') ? "wss://" : "ws://";
  
  var settings = {
      DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss.SSS ddd ZZ',
      DATE_DISPLAY_CONDENSED: 'YYYYMMDDHHmmss',
      DATE_DISPLAY: 'YYYY-MM-DD HH:mm:ss',
      DATE_TSEPARATOR: 'YYYY-MM-DDTHH:mm:ss',      
      DATE_FROM: '1970-01-01',
      SEARCH_SEPARATOR: /[ ,]+/,
      PROTOCOL: protocol,
      REST_API_PREFIX:  protocol + '//'+ host + '/api',
      WS_PREFIX: '',
      WS_HOST: ws_protocol + '//' + wshost,
      EVENTS_WS_URL: ws_protocol + host + '/apievents',
      DEBUG: false,
      HOST: host
    };
  
  if (settings.DEBUG && window.console && console.log) {
    window.debug = window.console;
  } else {
    window.debug = {
      'log': function () {},
      'error': function () {
        console.log.call(console, arguments);
      }
    };
  }
  
  return settings;
});