import { API_URL, API_WS_URL } from '../../server_config';

const location =
  window && window.location
    ? window.location
    : {
        protocol: 'http:',
        host: 'localhost',
      };

const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
const settings = {
  REST_BASE_URL:
    process.env.TESTINST || process.env.NODE_ENV === 'dev_fix'
      ? `${API_URL}/api`
      : `${API_URL}/api/latest`,
  OAUTH_URL: `${API_URL}/oauth2/v1`,
  WS_BASE_URL: `${API_WS_URL}`,
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
  IS_HTTP: location.protocol === 'http:',
};

export default settings;
