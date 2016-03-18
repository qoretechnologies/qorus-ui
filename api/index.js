'use strict';


const express = require('express');
const morgan = require('morgan');


const router = new express.Router();

if (process.env.NODE_ENV !== 'test') {
  router.use(morgan('dev'));
}

router.use('/system', require('./system'));
router.use('/users', require('./users'));
router.use('/errors', require('./errors'));
router.use('/workflows', require('./workflows'));
router.use('/steps', require('./steps'));


module.exports = router;
