'use strict';


/**
 * Workflows data.
 *
 * Based on `NODE_ENV` exports either fixtures or generated data.
 *
 * @module api/workflows/data
 * @see module:api/data.getData
 */


/**
 * @type {!Array<!module:types.Workflow>}
 */
module.exports = require('../data').getData('workflows');
