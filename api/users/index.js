'use strict';


/**
 * @module api/users
 */


const express = require('express');

const rest = require('../rest');


module.exports = () => {
  const data = require('./data')();

  const router = new express.Router();
  router.get('/', (req, res, next) => {
    if (req.query.action === 'current') {
      const user = data.find(u => (
        u.token === req.headers['qorus-token']
      ));
      req.url = `/${user.username}`; // eslint-disable-line no-param-reassign
    }

    next();
  });
  router.use(rest(data, (id, u) => u.username === id));

  return router;
};
