'use strict';


/**
 * @module api/steps
 */


const express = require('express');

const rest = require('../rest');
const data = require('./data');


const router = new express.Router();
router.use(rest(data, (id, s) => s.stepid === parseInt(id, 10)));


module.exports = router;
