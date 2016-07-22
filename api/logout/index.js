'use strict';


/**
 * @module api/logout
 */


const express = require('express');

module.exports = () => {
  const router = new express.Router();

  router.post('/', (req, res) => {
    res.status(200).send('');
  });

  return router;
};
