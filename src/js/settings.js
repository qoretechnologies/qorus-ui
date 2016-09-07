const location = window && window.location ? window.location : {
  protocol: 'http:',
  host: 'localhost',
};

const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:';

export default {
  REST_BASE_URL: '/api',
  WS_BASE_URL: `${wsProtocol}//${location.host}`,
  DEFAULT_REST_HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  NOTIFICATION_TIMEOUT: 5000,
};
