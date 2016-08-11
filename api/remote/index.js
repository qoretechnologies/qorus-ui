'use strict';

/**
 * @module api/services
 */

const express = require('express');

module.exports = () => {
  const data = require('./data')();
  const router = new express.Router();

  router.get('/', (req, res) => {
    if (req.query.action === 'all') {
      res.json(data[0]);
    }
  });

  router.put('/:remote', (req, res) => {
    if (req.params.remote === 'falsetest') {
      res.json(
        {
          name: 'omq',
          desc: 'oracle:omq@xbox{min=3,max=10}',
          url: 'oracle:omq@xbox{min=3,max=10}',
          opts: null,
          ok: true,
          time: '0000-00-00 00:00:00.002527Z',
          info: 'OK',
        }
      );
    } else if (req.params.remote === 'failtest') {
      res.status(409).json({ message: 'There was an error' });
    } else {
      res.json(
        {
          name: 'omq',
          desc: 'oracle:omq@xbox{min=3,max=10}',
          url: 'oracle:omq@xbox{min=3,max=10}',
          opts: null,
          ok: true,
          time: '0000-00-00 00:00:00.002527Z',
          info: 'OK',
        }
      );
    }
  });

  return router;
};
