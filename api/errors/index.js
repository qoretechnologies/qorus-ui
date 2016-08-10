'use strict';


/**
 * @module api/errors
 */


const express = require('express');


module.exports = () => {
  const data = require('./data')();

  const router = new express.Router();
  router.get('/', (req, res) => {
    res.json(data[1]);
  });

  router.get('/global', (req, res) => {
    res.json(data[0]);
  });

  router.get('/workflow/:id', (req, res) => {
    const start = Math.round(Math.random() * (data.length));
    const end = Math.round(Math.random() * (data.length - start) + start);

    res.json(data.slice(start, end));
  });

  return router;
};
