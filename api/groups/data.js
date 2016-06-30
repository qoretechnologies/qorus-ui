'use strict';

/**
 * Services data.
 *
 * Based on `NODE_ENV` exports either fixtures or generated data.
 *
 * @module api/services/data
 * @see module:api/data.getData
 */

/**
 * @return {!Array<!module:types.Workflow>}
 */
module.exports = () => require('../data').getData('groups');
