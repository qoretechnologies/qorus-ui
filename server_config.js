// @ flow
const isApiOverride =
  process.env.API_PROTO || process.env.API_HOST || process.env.API_PORT;
const isRestOverride = isApiOverride || process.env.REST_BASE_URL;
const isWsOverride = isApiOverride || process.env.WS_BASE_URL;
const apiProto = process.env.API_PROTO || 'http';
const apiHost = isApiOverride ? process.env.API_HOST : 'localhost';

const apiPort = isApiOverride ? process.env.API_PORT || 8001 : process.env.HOST;

module.exports = {
  env: process.env.NODE_ENV || 'development',
  restProxy: isRestOverride,
  restBaseUrl:
    process.env.REST_BASE_URL || `${apiProto}://${apiHost}:${apiPort}`,
  extensionProxy:
    isApiOverride && `${apiProto}://${apiHost}:${apiPort}/UIExtension`,
  dbProxy: isApiOverride && `${apiProto}://${apiHost}:${apiPort}/db`,
  wsProxy: isWsOverride,
  wsBaseUrl:
    process.env.WS_BASE_URL ||
    `${apiProto === 'https' ? 'wss' : 'ws'}://${apiHost}:${apiPort}`,
};
