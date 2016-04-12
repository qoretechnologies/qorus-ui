import { WORKFLOW_FILTERS } from '../constants/filters';
import { includes } from 'lodash';

/**
 * Helpers for workflows manipulations
 */
export default {
  /**
   * Checks if the filter is currently set,
   * returns array with 'all' if not
   * otherwise returns an array from the url filter
   *
   * @param {String} filter
   * @returns {Array}
   */
  filterArray(filter) {
    return typeof filter === 'undefined' ? [WORKFLOW_FILTERS.ALL] : filter.split(',');
  },
  /**
   * Handles the workflow filter change
   * Removes the current filter or adds it
   *
   * @param {Array} filter
   * @param {String} target
   * @returns {Array}
   */
  handleFilterChange(filter, target) {
    if (includes(filter, target)) {
      filter.splice(filter.indexOf(target), 1);
    } else {
      filter.push(target);
    }

    return filter;
  },
};
