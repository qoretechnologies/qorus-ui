'use strict';

/**
 * @module api/groups
 */

const findGroup = (name, g) => g.name === name;
const express = require('express');
const rest = require('../rest');

module.exports = () => {
  const data = require('./data')();

  const router = new express.Router();
  router.use(rest(data, findGroup));

  router.put('/:id', (req, res) => {
    const group = data.find(d => findGroup(req.params.id, d));

    switch (req.body.action) {
      case 'enable':
        group.enabled = true;
        break;
      case 'disable':
        group.enabled = false;
        break;
      default:
        // Nothing
        break;
    }

    res.json(group);
  });

  /**
   * Handles calling batch action
   * such as enable, disable, reset
   * etc
   */
  router.put('/', (req, res) => {
    const action = req.query.action;
    const ids = req.query.groups.split(',');
    let result = [];

    switch (action) {
      case 'setStatus':
        result = ids.map(id => {
          const item = data.find(w => findGroup(id, w));
          item.enabled = req.query.enabled === 'true';
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
