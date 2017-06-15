import moment from 'moment';
import { DATES, DATE_FORMATS } from '../constants/dates';

/**
 * Formats date string to a moment.js object
 *
 * @param {String} date
 * @returns {Object} moment.js object
 */
export const formatDate = (date) => {
  switch (date) {
    case DATES.ALL:
      return moment(new Date(DATE_FORMATS.ALL));
    case DATES.WEEK:
      return moment().add(-1, 'weeks');
    case DATES.NOW:
      return moment();
    case DATES.MONTH:
      return moment().startOf('month');
    case DATES.THIRTY:
      return moment().add(-30, 'days');
    case DATES.PREV_DAY:
    case undefined:
      return moment().add(-1, 'days');
    case DATES.TODAY:
      return moment().startOf('day');
    default:
      return moment(date, DATE_FORMATS.URL_FORMAT);
  }
};