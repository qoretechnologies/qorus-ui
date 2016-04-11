'use strict';


/**
 * @module api/services
 */


const express = require('express');

const rest = require('../rest');


module.exports = () => {
  const data = require('./data')();

  const router = new express.Router();
  router.use(rest(data, (id, s) => s.workflowid === parseInt(id, 10)));

  return router;
};
