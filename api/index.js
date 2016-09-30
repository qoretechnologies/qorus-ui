'use strict';


import express from 'express';
import proxyMiddleware from 'http-proxy-middleware';
import serveStatic from 'serve-static';

const config = require('./config');


module.exports = () => {
  const router = new express.Router();

  if (config.restProxy) {
    router.use(proxyMiddleware(config.restBaseUrl));
  } else {
    router.use('/api', require('./mock')());
  }

  if (config.extensionProxy) {
    router.use(proxyMiddleware(config.extensionProxy));
  } else {
    router.use('/UIExtension', serveStatic('./UIExtension'));
  }

  if (config.dbProxy) {
    router.use(proxyMiddleware(config.dbProxy));
  }

  if (config.wsProxy) {
    router.use(proxyMiddleware(`${config.wsBaseUrl}/log`));
    router.use(proxyMiddleware(`${config.wsBaseUrl}/apievents`));
  } else {
    router.use('/log', require('./websockets/log')());
    router.use('/apievents', require('./websockets/apievents')());
  }

  return router;
};
