'use strict';

/**
 * @module api/workflows
 */

const findWorkflow = (id, s) => s.workflowid === parseInt(id, 10);
const express = require('express');
const config = require('../config');
const rest = require('../rest');

module.exports = () => {
  const data = require('./data')();

  const router = new express.Router();
  router.use(rest(data, findWorkflow));
  router.put('/:id', (req, res) => {
    const item = data.find(w => findWorkflow(req.params.id, w));

    switch (req.body.action) {
      case 'disable':
      case 'enable':
        item.enabled = !!req.body.enabled;
        item.exec_count = parseInt(req.body.exec_count, 10);
        break;
      case 'setAutostart':
        item.autostart = req.body.autostart;
        item.exec_count = req.body.exec_count;
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
          const item = data.find(w => findWorkflow(id, w));
          item.enabled = false;
          return item;
        });
        break;
      case 'enable':
        result = ids.map(id => {
          const item = data.find(w => findWorkflow(id, w));
          item.enabled = true;
          return item;
        });
        break;
      case 'setDeprecated':
        result = ids.map(id => {
          const item = data.find(w => findWorkflow(id, w));
          item.deprecated = req.query.deprecated === 'true';
          return item;
        });
        break;
      default:
        if (config.env !== 'test') {
          process.stderr.write(`Unknown action ${req.body.action}.\n`);
        }
        break;
    }

    res.json(result);
  });

  return router;
};
