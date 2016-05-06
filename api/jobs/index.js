'use strict';


/**
 * @module api/jobs
 */

const findModel = (idAttr) => (id, s) => s[idAttr] === parseInt(id, 10);
const config = require('../config');
const express = require('express');

const rest = require('../rest');

module.exports = () => {
  const data = require('./data')();

  const router = new express.Router();
  router.use(rest(data, findModel('jobid')));

  router.put('/:id', (req, res) => {
    const item = data.find(findModel('jobid').bind(null, req.params.id));

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
