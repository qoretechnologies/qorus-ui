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
        firstBy(req.query.sort, { ignoreCase: true, direction: (req.query.desc) ? -1 : 1 })
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

  return router;
};
