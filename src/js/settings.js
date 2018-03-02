const location = window && window.location ? window.location : {
  protocol: 'http:',
  host: 'localhost',
};

const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:';

export default {
  // eslint-disable-next-line
  REST_BASE_URL: process.env.TESTINST || process.env.NODE_ENV === 'dev_fix' ? '/api' : '/api/latest',
  WS_BASE_URL: `${wsProtocol}//${location.host}`,
  DEFAULT_REST_HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  YAML_REST_HEADERS: {
    Accept: 'application/x-yaml',
    'Content-Type': 'application/x-yaml',
  },
  NOTIFICATION_TIMEOUT: 5000,
  PROTOCOL: location.protocol,
};
