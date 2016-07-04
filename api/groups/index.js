'use strict';

/**
 * @module api/groups
 */

const findGroup = (name, g) => g.name === name;
const express = require('express');

module.exports = () => {
  const data = require('./data')();
  const router = new express.Router();

  router.get('/', (req, res) => {
    let filteredData = data;

    if (req.query.limit) {
      const start = parseInt(req.query.offset, 10) || 0;
      const end = parseInt(req.query.limit, 10);

      filteredData = filteredData.slice(start, start + end);
    }

    res.json(filteredData);
  });

  router.get('/:id', (req, res) => {
    const item = data.find(d => findGroup(req.params.id, d));
    res.status(item ? 200 : 404).json(item);
  });

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
