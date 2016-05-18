'use strict';

/**
 * @module api/services
 */

const findOrder = (id, s) => s.workflow_instanceid === parseInt(id, 10);
const config = require('../config');
const express = require('express');
const moment = require('moment');
const firstBy = require('thenby');

module.exports = () => {
  const data = require('./data')();
  const router = new express.Router();

  router.get('/', (req, res) => {
    let filteredData = data;

    if (req.query.workflowid) {
      filteredData = filteredData.filter(o => (
        o.workflowid === parseInt(req.query.workflowid, 10)
      ));
    }

    if (req.query.date) {
      filteredData = filteredData.filter(o => (moment(req.query.date) <= moment(o.started)));
    }

    if (req.query.sort) {
      filteredData = filteredData.sort(
        firstBy((v1, v2) => {
          const prev = v1[req.query.sort];
          const cur = v2[req.query.sort];

          if (moment(prev).isValid() && moment(cur).isValid()) {
            return moment(prev).isBefore(cur) ? -1 : 1;
          }

          return prev.toLowerCase() < cur.toLowerCase() ? -1 : 1;
        }, -1)
      );
    }

    if (req.query.limit) {
      const start = parseInt(req.query.offset, 10) || 0;
      filteredData = filteredData.slice(start, start + parseInt(req.query.limit, 10));
    }

    res.json(filteredData);
  });

  router.get('/:id', (req, res) => {
    const item = data.find(s => findOrder(req.params.id, s));
    res.status(item ? 200 : 404).json(item);
  });

  router.put('/:id', (req, res) => {
    const order = data.find(o => findOrder(req.params.id, o));

    switch (req.body.action) {
      case 'cancel':
      case 'uncancel':
      case 'block':
      case 'unblock':
      case 'retry':
        order.workflowstatus = req.body.workflowstatus;
        break;
      default:
        if (config.env !== 'test') {
          process.stderr.write(`Unknown action ${req.body.action}.\n`);
        }
        break;
    }

    res.json(order);
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
      case 'block':
        result = ids.map(id => {
          const item = data.find(w => findOrder(id, w));
          item.workflowstatus = 'BLOCKING';
          return item;
        });
        break;
      case 'retry':
        result = ids.map(id => {
          const item = data.find(w => findOrder(id, w));
          item.workflowstatus = 'RETRYING';
          return item;
        });
        break;
      case 'cancel':
        result = ids.map(id => {
          const item = data.find(w => findOrder(id, w));
          item.workflowstatus = 'CANCELING';
          return item;
        });
        break;
      case 'unblock':
        result = ids.map(id => {
          const item = data.find(w => findOrder(id, w));
          item.workflowstatus = 'UNBLOCKING';
          return item;
        });
        break;
      case 'uncancel':
        result = ids.map(id => {
          const item = data.find(w => findOrder(id, w));
          item.workflowstatus = 'UNCANCELING';
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
