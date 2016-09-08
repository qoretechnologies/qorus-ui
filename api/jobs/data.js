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
export default () => require('../data').getData('jobs');
export const jobResults = () => require('../data').getData('job_results');
export const getSystemData = () => require('../system/data')();
