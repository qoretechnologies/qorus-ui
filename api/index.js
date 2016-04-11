'use strict';


const express = require('express');
const proxyMiddleware = require('http-proxy-middleware');

const config = require('./config');


module.exports = () => {
  const router = new express.Router();

  if (config.restProxy) {
    router.use(proxyMiddleware(config.restBaseUrl));
  } else {
    router.use('/api', require('./mock')());
  }

  if (config.wsProxy) {
    router.use(proxyMiddleware(`${config.wsBaseUrl}/log`));
  } else if (config.env !== 'test') {
    process.stderr.write(
      'Mock WebSocket API not yet implemented.\n'
    );
  }

  return router;
};
