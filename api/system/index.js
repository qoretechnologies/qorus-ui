'use strict';

/**
 * @module api/system
 */

const express = require('express');
const updateProp = require(
  '../../src/js/store/api/resources/system/props/actions/helper'
).updateProp;
const deleteProp = require(
  '../../src/js/store/api/resources/system/props/actions/helper'
).deleteProp;

module.exports = () => {
  const data = require('./data')();

  const router = new express.Router();
  router.get('/', (req, res) => res.json(data.system));
  router.get('/:attr', (req, res) => (
    res.status(data[req.params.attr] ? 200 : 404).json(data[req.params.attr])
  ));

  router.put('/props/:domain/:key', (req, res) => {
    data.props = updateProp(data.props, {
      domain: req.params.domain,
      key: req.params.key,
      value: req.body.parse_args,
    });

    res.json(data.props);
  });

  router.delete('/props/:domain', (req, res) => {
    data.props = deleteProp(data.props, {
      domain: req.params.domain,
    });

    res.json(data.props);
  });

  router.delete('/props/:domain/:key', (req, res) => {
    data.props = deleteProp(data.props, {
      domain: req.params.domain,
      key: req.params.key,
    });

    res.json(data.props);
  });

  router.put('/api', (req, res) => {
    const action = req.body.action;
    const method = req.body.method;

    if (action === 'call') {
      switch (method) {
        case 'help':
          res.json(data.api);
          break;
        default:
          res.status(409).json({ callstack: { desc: 'Error' } });
          break;
      }
    }
  });

  return router;
};
