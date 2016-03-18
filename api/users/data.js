'use strict';


/**
 * Users data.
 *
 * Based on `NODE_ENV` exports either fixtures or generated data.
 *
 * @module api/users/data
 * @see module:api/data.getData
 */


/**
 * @type {!Array<!module:types.User>}
 */
module.exports = require('../data').getData('users');
