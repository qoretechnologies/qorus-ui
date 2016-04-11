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
      req.url = `/${data[0].username}`; // eslint-disable-line no-param-reassign
    }

    next();
  });
  router.use(rest(data, (id, u) => u.username === id));

  return router;
};
