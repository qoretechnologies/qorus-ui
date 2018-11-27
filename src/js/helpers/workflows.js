import { includes } from 'lodash';
import { WORKFLOW_FILTERS } from '../constants/filters';
import { DATES } from '../constants/dates';
import { formatDate } from '../helpers/date';

/**
 * Checks if the filter is currently set,
 * returns empty array if not
 * otherwise returns an array from the url filter
 *
 * @param {String} filter
 * @returns {Array}
 */
const filterArray = filter => {
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

const buildOrderStatsDisposition = (
  orderStats: Object,
  band: string
): Object => {
  const stats: Object = {
    completed: orderStats
      .find(stat => stat.label === band)
      .l.find(disp => disp.disposition === 'C').count,
    automatically: orderStats
      .find(stat => stat.label === band)
      .l.find(disp => disp.disposition === 'A').count,
    manually: orderStats
      .find(stat => stat.label === band)
      .l.find(disp => disp.disposition === 'M').count,
    completedPct: orderStats
      .find(stat => stat.label === band)
      .l.find(disp => disp.disposition === 'C').pct,
    automaticallyPct: orderStats
      .find(stat => stat.label === band)
      .l.find(disp => disp.disposition === 'A').pct,
    manuallyPct: orderStats
      .find(stat => stat.label === band)
      .l.find(disp => disp.disposition === 'M').pct,
  };

  return {
    ...stats,
    ...{ total: stats.automatically + stats.completed + stats.manually },
  };
};

const buildOrderStatsSLA: Function = (
  orderStats: Object,
  band: string
): Object => {
  const stats: Object = {
    ['In SLA']: orderStats
      .find(stat => stat.label === band)
      .sla.find(sla => sla.in_sla).count,
    ['Out of SLA']: orderStats
      .find(stat => stat.label === band)
      .sla.find(sla => sla.in_sla === false).count,
    ['In SLA %']: orderStats
      .find(stat => stat.label === band)
      .sla.find(sla => sla.in_sla).pct,
    ['Out of SLA %']: orderStats
      .find(stat => stat.label === band)
      .sla.find(sla => sla.in_sla === false).pct,
  };

  return {
    ...stats,
    ...{ total: stats['In SLA'] + stats['Out of SLA'] },
  };
};

export {
  filterArray,
  handleFilterChange,
  formatDate,
  getFetchParams,
  buildOrderStatsDisposition,
  buildOrderStatsSLA,
};
