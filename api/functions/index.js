'use strict';

/**
 * @module api/users
 */

const express = require('express');
const rest = require('../rest');
const findFunction = (id, c) => c.function_instanceid === parseInt(id, 10);

module.exports = () => {
  const data = require('./data')();
  const router = new express.Router();

  router.use(rest(data, findFunction));

  return router;
};
