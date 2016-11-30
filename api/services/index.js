'use strict';

/**
 * @module api/services
 */

const findService = (id, s) => s.serviceid === parseInt(id, 10);
const config = require('../config');
const express = require('express');

module.exports = () => {
  const data = require('./data')();

  const router = new express.Router();

  router.get('/', (req, res) => setTimeout(() => res.json(data), 200));
  router.get('/:id', (req, res) => {
    const item = data.find(d => findService(req.params.id, d));
    res.status(item ? 200 : 404).json(item);
  });

  router.put('/:id', (req, res) => {
    const item = data.find(s => findService(req.params.id, s));

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

  /**
   * Handles calling batch action
   * such as enable, disable, reset
   * etc
   */
  router.put('/', (req, res) => {
    const action = req.query.action;
    const ids = req.query.ids.split(',');
    let result = [];

    switch (action) {
      case 'disable':
        result = ids.map(id => {
          const item = data.find(s => findService(id, s));
          item.enabled = false;
          return item;
        });
        break;
      case 'enable':
        result = ids.map(id => {
          const item = data.find(s => findService(id, s));
          item.enabled = true;
          return item;
        });
        break;
      case 'load':
        result = ids.map(id => {
          const item = data.find(s => findService(id, s));
          item.status = 'loaded';
          return item;
        });
        break;
      case 'unload':
        result = ids.map(id => {
          const item = data.find(s => findService(id, s));
          item.status = 'unloaded';
          return item;
        });
        break;
      default:
        break;
    }

    res.json(result);
  });

  return router;
};
