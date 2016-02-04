const location = window && window.location ? window.location : {
  protocol: 'http:',
  host: 'localhost',
};

export default {
  REST_API_PREFIX: process.env.REST_API_BASE_URL || '/api',
  WS_API_PREFIX: process.env.WS_API_BASE_URL ||
    `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}`,
  DEFAULT_REST_HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};
