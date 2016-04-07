'use strict';


/**
 * @module api/workflows
 */


const express = require('express');

const config = require('../config');
const rest = require('../rest');
const data = require('./data');


function findWorkflow(id, s) {
  return s.workflowid === parseInt(id, 10);
}


const router = new express.Router();
router.use(rest(data, findWorkflow));
router.put('/:id', (req, res) => {
  const item = data.find(findWorkflow.bind(null, req.params.id));

  switch (req.body.action) {
    case 'disable':
    case 'enable':
      item.enabled = !!req.body.enabled;
      item.exec_count = parseInt(req.body.exec_count, 10);
      break;
    default:
      if (config.env !== 'test') {
        process.stderr.write(`Unknown action ${req.body.action}.\n`);
      }
      break;
  }

  res.json(item);
});


module.exports = router;
