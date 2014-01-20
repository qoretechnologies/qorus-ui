define(function () {
  var host = "localhost:8001";
  
  var settings = {
      DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss.SSS ddd ZZ',
      DATE_DISPLAY: 'YYYY-MM-DD HH:mm:ss',
      DATE_TSEPARATOR: 'YYYY-MM-DDTHH:mm:ss',      
      DATE_FROM: '1970-01-01',
      SEARCH_SEPARATOR: /[ ,]+/,
      REST_API_PREFIX: 'http://localhost:8001/api',
      WS_PREFIX: '',
      EVENTS_WS_URL: 'ws://' + host + '/apievents',
      DEBUG: false
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
