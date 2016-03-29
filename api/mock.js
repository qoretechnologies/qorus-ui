'use strict';


const express = require('express');

const config = require('./config');


const router = new express.Router();

if (config.env !== 'test') {
  router.use(require('morgan')('dev'));
}

router.use('/system', require('./system'));
router.use('/users', require('./users'));
router.use('/errors', require('./errors'));
router.use('/workflows', require('./workflows'));
router.use('/steps', require('./steps'));
router.use('/services', require('./services'));


module.exports = router;
