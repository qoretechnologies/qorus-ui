'use strict';


/**
 * Steps data are from fixtures to provide meaningful structures.
 *
 * @module api/steps/data
 * @see module:api/data.fixtureData
 */


/**
 * @return {!Array<!module:types.Step>}
 */
module.exports = () => require('../data').fixtureData('steps');
