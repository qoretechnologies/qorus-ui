import { includes } from 'lodash';
import { WORKFLOW_FILTERS } from '../constants/filters';
import { DATES, DATE_FORMATS } from '../constants/dates';
import moment from 'moment';

/**
 * Checks if the filter is currently set,
 * returns empty array if not
 * otherwise returns an array from the url filter
 *
 * @param {String} filter
 * @returns {Array}
 */
const filterArray = (filter) => {
  if (typeof filter === 'undefined' || filter === '') {
    return [WORKFLOW_FILTERS.ALL];
  }

  return filter.split(',');
};

/**
 * Handles the workflow filter change
 * Removes the current filter or adds it
 *
 * @param {Array} filter
 * @param {String} target
 * @returns {Array}
 */
const handleFilterChange = (filter, target) => {
  const filterArr = filterArray(filter);

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
};

/**
 * Formats date string to a moment.js object
 *
 * @param {String} date
 * @returns {Object} moment.js object
 */
const formatDate = (date) => {
  switch (date) {
    case DATES.ALL:
      return moment(new Date(DATE_FORMATS.ALL));
    case DATES.NOW:
      return moment();
    case DATES.PREV_DAY:
    case undefined:
      return moment().add(-1, 'days');
    case DATES.TODAY:
      return moment().startOf('day');
    default:
      return moment(date, DATE_FORMATS.URL_FORMAT);
  }
};

/**
 * Creates the object based on the
 * filters in the URL that is sent to
 * the FETCH redux action
 *
 * @param {String} filter
 * @param {!String} date
 * @return {Object}
 */
const getFetchParams = (filter, date = DATES.PREV_DAY) => {
  const params = { deprecated: false };

  if (includes(filterArray(filter), WORKFLOW_FILTERS.DEPRECATED)) {
    params.deprecated = true;
  }

  if (date) {
    params.date = formatDate(date).format();
  }

  return params;
};

export {
  filterArray,
  handleFilterChange,
  formatDate,
  getFetchParams,
};

