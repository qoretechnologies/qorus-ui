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
).delProp;

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

    res.json('Successfuly updated');
  });

  router.delete('/props/:domain', (req, res) => {
    data.props = deleteProp(data.props, {
      domain: req.params.domain,
    });

    res.json('Successfuly deleted');
  });

  router.delete('/props/:domain/:key', (req, res) => {
    data.props = deleteProp(data.props, {
      domain: req.params.domain,
      key: req.params.key,
    });

    res.json('Successfuly deleted');
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

  router.put('/options/:option', (req, res) => {
    const option = req.params.option;
    const action = req.body.action;
    const value = req.body.value;
    const item = data.options.find(d => d.name === option);

    switch (action) {
      case 'set':
        item.value = value;
        break;
      default:
        break;
    }

    res.json(item);
  });

  router.put('/sqlcache', (req, res) => {
    if (req.body.action === 'clearCache') {
      if (req.body.name) {
        delete data.sqlcache[req.body.datasource].tables[req.body.name];
      } else if (req.body.datasource) {
        delete data.sqlcache[req.body.datasource];
      } else {
        data.sqlcache = {};
      }
    }

    res.json(data.sqlcache);
  });

  return router;
};
