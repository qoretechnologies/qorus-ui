'use strict';

/**
 * @module api/services
 */

const findModel = (idAttr) => (id, s) => s[idAttr] === parseInt(id, 10);
const config = require('../config');

const express = require('express');

const rest = require('../rest');

module.exports = () => {
  const data = require('./data')();

  const router = new express.Router();
  router.use(rest(data, findModel('serviceid')));

  router.put('/:id', (req, res) => {
    const item = data.find(findModel('serviceid').bind(null, req.params.id));

    switch (req.body.action) {
      case 'disable':
      case 'enable':
        item.enabled = !!req.body.enabled;
        break;
      case 'setAutostart':
        item.autostart = !!req.body.autostart;
        break;
      case 'load':
        item.status = 'loaded';
        break;
      case 'unload':
        item.status = 'unloaded';
        break;
      default:
        if (config.env !== 'test') {
          process.stderr.write(`Unknown action ${req.body.action}.\n`);
        }
        break;
    }

    res.json(item);
  });

  return router;
};
