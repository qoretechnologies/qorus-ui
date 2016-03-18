'use strict';


/**
 * @module api/rest
 */


const express = require('express');


/**
 * Generates common rest handler for specific resource type.
 *
 * @param {!Array<!Object>} data
 * @param {function(string, !Object): boolean} selector
 * @return {!express.Router}
 */
function rest(data, selector) {
  const router = new express.Router();

  router.get('/', (req, res) => res.json(data));
  router.get('/:id', (req, res) => {
    const item = data.find(selector.bind(null, req.params.id));
    res.status(item ? 200 : 404).json(item);
  });

  return router;
}


module.exports = rest;
