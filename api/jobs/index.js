'use strict';

/**
 * @module api/jobs
 */

const findJob = (id, s) => s.jobid === parseInt(id, 10);
const config = require('../config');
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

  router.get('/:id', (req, res) => {
    const item = data.find(findJob('jobid').bind(null, req.params.id));
    res.json(item);
  });

  router.put('/:id', (req, res) => {
    const item = data.find(findJob('jobid').bind(null, req.params.id));

    switch (req.body.action) {
      case 'disable':
      case 'enable':
        item.enabled = !item.enabled;
        break;
      case 'setActive':
        item.active = !!req.body.active;
        break;
      case 'setExpiry':
        item.expiry_date = req.body.expiry_date;
        break;
      case 'schedule': {
        const cron = req.body.schedule.split(' ');
        const cronAttr = ['minute', 'hour', 'day', 'month', 'wday'];
        item.schedule = req.body.schedule;

        cronAttr.forEach((el, i) => { item[el] = cron[i]; });
        break;
      }
      case 'run':
      case 'reset':
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
