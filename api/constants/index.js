'use strict';

/**
 * @module api/users
 */

const express = require('express');
const rest = require('../rest');
const findConstant = (id, c) => c.constantid === parseInt(id, 10);

module.exports = () => {
  const data = require('./data')();
  const router = new express.Router();

  router.use(rest(data, findConstant));

  return router;
};
