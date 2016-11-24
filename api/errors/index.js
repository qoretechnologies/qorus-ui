'use strict';
import remove from 'lodash/remove';

const express = require('express');


module.exports = () => {
  const data = require('./data')()[0];

  const router = new express.Router();
  router.get('/global', (req, res) => {
    const errors = data.filter(e => e.type === 'global');

    res.json(errors);
  });

  router.get('/workflow/:id', (req, res) => {
    const errors = data.filter(e => (
      e.type === 'workflow' && e.workflowid === parseInt(req.params.id, 10)
    ));

    res.json(errors);
  });

  router.delete('/workflow/:id/:error', (req, res) => {
    remove(data, error => error.type === 'workflow' && error.error === req.params.error);

    res.json('OK');
  });

  router.delete('/global/:error', (req, res) => {
    remove(data, error => error.type === 'global' && error.error === req.params.error);

    res.json('OK');
  });

  return router;
};
