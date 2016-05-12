'use strict';

/**
 * Services data.
 *
 * Based on `NODE_ENV` exports either fixtures or generated data.
 *
 * @module api/orders/data
 * @see module:api/data.getData
 */

/**
 * @return {!Array<!module:types.Order>}
 */
module.exports = () => require('../data').getData('orders');
