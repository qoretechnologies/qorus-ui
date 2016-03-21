const location = window && window.location ? window.location : {
  protocol: 'http:',
  host: 'localhost',
};
const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:';

export default {
  REST_API_PREFIX: '/api',
  WS_API_PREFIX: `${wsProtocol}//${location.host}`,
  DEFAULT_REST_HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};
