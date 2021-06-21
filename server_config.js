const getWindow = () => {
  if (process.env.NODE_ENV === 'development') {
    return undefined;
  }

  return window;
};

// @ flow
const API_PORT: number = process.env.API_PORT || getWindow()?.location?.port;
const LOCAL_PORT: number = process.env.LOCAL_PORT || 3004;
const LOCAL_HOST: string = process.env.LOCAL_HOST || 'localhost';
const PROTO: string = process.env.PROTO || 'https';
const WS_PROTO: string = PROTO === 'https' ? 'wss' : 'ws';
const API_HOST: string =
  process.env.API_HOST || getWindow()
    ? getWindow()?.location?.hostname
    : 'hq.qoretechnologies.com';

module.exports = {
  SERVER_URL: `${PROTO}://${LOCAL_HOST}:${LOCAL_PORT}`,
  API_URL: `${PROTO}://${API_HOST}${API_PORT ? `:${API_PORT}` : ''}`,
  SERVER_WS_URL: `${WS_PROTO}://${LOCAL_HOST}:${LOCAL_PORT}`,
  API_WS_URL: `${WS_PROTO}://${API_HOST}${API_PORT ? `:${API_PORT}` : ''}`,
  LOCAL_HOST,
  LOCAL_PORT,
  WEB_IDE_URL: '/ide/',
  IS_SECURE: PROTO === 'https',
};
