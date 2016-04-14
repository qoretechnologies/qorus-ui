import { includes } from 'lodash';
import { WORKFLOW_FILTERS } from '../constants/filters';
/**
 * Helpers for workflows manipulations
 */
export default {
  /**
   * Checks if the filter is currently set,
   * returns empty array if not
   * otherwise returns an array from the url filter
   *
   * @param {String} filter
   * @returns {Array}
   */
  filterArray(filter) {
    return typeof filter === 'undefined' || filter === '' ? [WORKFLOW_FILTERS.ALL] : filter.split(',');
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
    filter = this.filterArray(filter);

    if (includes(filter, target)) {
      filter.splice(filter.indexOf(target), 1);

      if (filter.length === 0) {
        filter.push(WORKFLOW_FILTERS.ALL);
      }
    } else {
      filter.push(target);

      if(includes(filter, WORKFLOW_FILTERS.ALL)) {
        filter.splice(filter.indexOf(WORKFLOW_FILTERS.ALL), 1);
      }
    }

    return filter;
  },
};
