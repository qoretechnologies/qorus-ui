'use strict';

/**
 * @module api/jobs
 */
import getJobData, { jobResults } from './data';

const findJob = (id, s) => s.jobid === parseInt(id, 10);
const config = require('../config');
const express = require('express');
const rest = require('../rest');
const moment = require('moment');
import _ from 'lodash';

module.exports = () => {
  const data = getJobData();
  const jobResultsData = jobResults();

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

  router.get('/:id/results', (req, res) => {
    let results = jobResultsData[0];
    let { offset = '0', limit = '10' } = req.query;
    let normolizedStatuses = [];
    const { statuses, date: dateStr } = req.query;
    const normolizeStatus = item => item.toLowerCase();
    if (statuses) {
      normolizedStatuses = statuses.split(',').map(normolizeStatus);
    }
    offset = parseInt(offset, 10);
    limit = parseInt(limit, 10);

    let date;
    if (dateStr) {
      date = moment(dateStr).format();
    } else {
      date = moment().substract(1, 'days');
    }

    if (normolizedStatuses.length > 0 && !normolizedStatuses.find(status => status === 'all')) {
      const findByStatus = _.flowRight(
        resStatus => normolizedStatuses.find(status => status === resStatus),
        normolizeStatus,
        item => item.jobstatus
      );

      results = results.filter(findByStatus);
    }

    results = results.filter(o => moment(o.modified).isAfter(date));


    results = results.slice(offset, offset + limit);
    res.json(results);
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
