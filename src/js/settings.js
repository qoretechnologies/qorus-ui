/* eslint no-console: 0 */

const window = window || {};
const hostname = window.location ? window.location.hostname : 'localhost';
// const hostname = '192.168.20.190';
const host = `${hostname}:3000`;
const wshost = `${hostname}:8001`;
const protocol = 'http:'; // window.location.protocol;
const wsProtocol = (protocol === 'https:') ? 'wss://' : 'ws://';

const settings = {
  DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss.SSS ddd ZZ',
  DATE_DISPLAY_CONDENSED: 'YYYYMMDDHHmmss',
  DATE_DISPLAY: 'YYYY-MM-DD HH:mm:ss',
  DATE_TSEPARATOR: 'YYYY-MM-DDTHH:mm:ss',
  DATE_FROM: '1970-01-01',
  SEARCH_SEPARATOR: /[ ,]+/,
  PROTOCOL: protocol,
  REST_API_PREFIX: protocol + '//' + host + '/api',
  WS_PREFIX: '',
  WS_HOST: wsProtocol + wshost,
  EVENTS_WS_URL: wsProtocol + wshost + '/apievents',
  HOST: host,
  DEBUG: false
};

if (settings.DEBUG && window.console && console.log) {
  window.debug = window.console;
} else {
  window.debug = {
    'log': function log() {
    },
    'error': function error() {
      console.log.call(console, arguments);
    }
  };
}

export default settings;
