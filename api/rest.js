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

  router.get('/', (req, res) => setTimeout(() => res.json(data), 200));
  router.get('/:id', (req, res) => {
    const item = data.find(d => selector(req.params.id, d));
    res.status(item ? 200 : 404).json(item);
  });

  return router;
}


module.exports = rest;
