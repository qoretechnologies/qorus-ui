'use strict';


/**
 * @module api/jobs
 */


const express = require('express');

const rest = require('../rest');


module.exports = () => {
  const data = require('./data')();

  const router = new express.Router();
  router.use(rest(data, (id, s) => s.jobid === parseInt(id, 10)));

  return router;
};
