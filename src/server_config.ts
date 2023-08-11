const getWindow = () => {
  if (process.env.NODE_ENV === 'development') {
    return undefined;
  }

  return window;
};

const API_PORT: string =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_API_PORT || getWindow()?.location?.port
    : getWindow()?.location?.port;
export const LOCAL_PORT: number | string = process.env.REACT_APP_LOCAL_PORT || 3004;
export const LOCAL_HOST: string = process.env.REACT_APP_LOCAL_HOST || 'localhost';
const PROTO: string =
  process.env.REACT_APP_PROTO || getWindow()?.location?.protocol?.replace(':', '') || 'https';
const WS_PROTO: string = PROTO === 'https' ? 'wss' : 'ws';
const API_HOST: string = process.env.REACT_APP_NETLIFY
  ? 'sandbox.qoretechnologies.com'
  : getWindow()
  ? getWindow()?.location?.hostname
  : process.env.REACT_APP_API_HOST || 'hq.qoretechnologies.com';

export const SERVER_URL = `${PROTO}://${LOCAL_HOST}:${LOCAL_PORT}`;
export const API_URL = `${PROTO}://${API_HOST}${API_PORT ? `:${API_PORT}` : ''}`;
export const SERVER_WS_URL = `${WS_PROTO}://${LOCAL_HOST}:${LOCAL_PORT}`;
export const API_WS_URL = `${WS_PROTO}://${API_HOST}${API_PORT ? `:${API_PORT}` : ''}`;
export const WEB_IDE_URL = '/ide/';
export const IS_SECURE = window?.location?.protocol === 'https:';
