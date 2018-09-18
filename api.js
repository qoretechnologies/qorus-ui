'use strict';

import express from 'express';
import proxyMiddleware from 'http-proxy-middleware';
import serveStatic from 'serve-static';

const config = require('./server_config');

module.exports = () => {
  const router = new express.Router();

  router.use(proxyMiddleware(config.restBaseUrl));
  router.use(proxyMiddleware(config.extensionProxy));
  router.use(proxyMiddleware(config.dbProxy));
  router.use(proxyMiddleware(`${config.wsBaseUrl}/log`));
  router.use(proxyMiddleware(`${config.wsBaseUrl}/apievents`));

  return router;
};
