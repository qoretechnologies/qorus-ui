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
    return typeof filter === 'undefined' || filter === '' ?
      [WORKFLOW_FILTERS.ALL] : filter.split(',');
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
    const filterArr = this.filterArray(filter);

    if (includes(filterArr, target)) {
      filterArr.splice(filterArr.indexOf(target), 1);

      if (filterArr.length === 0) {
        filterArr.push(WORKFLOW_FILTERS.ALL);
      }
    } else {
      filterArr.push(target);

      if (includes(filterArr, WORKFLOW_FILTERS.ALL)) {
        filterArr.splice(filterArr.indexOf(WORKFLOW_FILTERS.ALL), 1);
      }
    }

    return filterArr;
  },
};
