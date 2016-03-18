'use strict';


/**
 * @module api/system
 */


const express = require('express');

const data = require('./data');


const router = new express.Router();
router.get('/', (req, res) => res.json(data.system));
router.get('/:attr', (req, res) => (
  res.status(data[req.params.attr] ? 200 : 404).json(data[req.params.attr])
));


module.exports = router;
