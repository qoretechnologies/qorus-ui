'use strict';

/**
 * @module api/workflows
 */

const express = require('express');

const config = require('../config');
const rest = require('../rest');

function findWorkflow(id, s) {
  return s.workflowid === parseInt(id, 10);
}

module.exports = () => {
  const data = require('./data')();

  const router = new express.Router();
  router.use(rest(data, findWorkflow));
  router.put('/:id', (req, res) => {
    const item = data.find(findWorkflow.bind(null, req.params.id));

    switch (req.body.action) {
      case 'disable':
      case 'enable':
        item.enabled = !!req.body.enabled;
        item.exec_count = parseInt(req.body.exec_count, 10);
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
        break;
    }

    res.json(result);
  });

  return router;
};
