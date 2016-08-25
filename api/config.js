'use strict';


const devConfig = require('../webpack.config/dev');


const isApiOverride =
  process.env.API_PROTO || process.env.API_HOST || process.env.API_PORT;
const isRestOverride = isApiOverride || process.env.REST_BASE_URL;
const isWsOverride = isApiOverride || process.env.WS_BASE_URL;

const apiProto = process.env.API_PROTO || 'http';
const apiHost = isApiOverride ?
  (process.env.API_HOST || 'localhost') :
  devConfig().host;
const apiPort = isApiOverride ?
  (process.env.API_PORT || 8001) :
  devConfig().port;

module.exports = {
  env: process.env.NODE_ENV || 'development',
  restProxy: isRestOverride,
  restBaseUrl: process.env.REST_BASE_URL ||
    `${apiProto}://${apiHost}:${apiPort}/api`,
  extensionProxy: `${apiProto}://${apiHost}:${apiPort}/UIExtension`,
  wsProxy: isWsOverride,
  wsBaseUrl: process.env.WS_BASE_URL ||
    `${apiProto === 'https' ? 'wss' : 'ws'}://${apiHost}:${apiPort}`,
};
