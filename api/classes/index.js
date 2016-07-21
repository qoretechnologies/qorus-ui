'use strict';

/**
 * @module api/users
 */

const express = require('express');
const rest = require('../rest');
const findClass = (id, c) => c.classid === parseInt(id, 10);

module.exports = () => {
  const data = require('./data')();
  const router = new express.Router();

  router.use(rest(data, findClass));

  return router;
};
