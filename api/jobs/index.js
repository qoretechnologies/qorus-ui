'use strict';

/**
 * @module api/jobs
 */

const findJob = (id, s) => s.jobid === parseInt(id, 10);
const express = require('express');
const rest = require('../rest');
const moment = require('moment');

module.exports = () => {
  const data = require('./data')();

  const router = new express.Router();
  router.use(rest(data, findJob));

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
          const item = data.find(w => findJob(id, w));
          item.enabled = false;
          return item;
        });
        break;
      case 'enable':
        result = ids.map(id => {
          const item = data.find(w => findJob(id, w));
          item.enabled = true;
          return item;
        });
        break;
      case 'run':
        result = ids.map(id => {
          const item = data.find(w => findJob(id, w));
          item.last_executed = moment().format('YYYY-MM-DD HH:mm:ss');
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
