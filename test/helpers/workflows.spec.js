import { expect } from 'chai';
import {
  filterArray,
  handleFilterChange,
  getFetchParams,
  formatDate,
} from '../../src/js/helpers/workflows';
import { DATES } from '../../src/js/constants/dates';
import moment from 'moment';

describe('filterArray,' +
  'handleFilterChange,' +
  'getFetchParams,' +
  'formatDate from "helpers/worklfows"', () => {
  describe('filterArray', () => {
    it('transforms filter string to an array', () => {
      const filterString = 'running,hidden,last';
      const filter = filterArray(filterString);

      expect(filter).to.be.an('array');
      expect(filter).to.have.length(3);
    });

    it('returns array with "all" value when filter is empty', () => {
      const filterString = '';
      const filter = filterArray(filterString);

      expect(filter).to.be.an('array');
      expect(filter).to.have.length(1);
      expect(filter[0]).to.equal('all');
    });
  });

  describe('handleFilterChange', () => {
    it('adds a new URL filter', () => {
      const filterString = 'running,hidden';
      const filter = handleFilterChange(filterString, 'last');

      expect(filter).to.be.an('array');
      expect(filter).to.have.length(3);
      expect(filter[2]).to.equal('last');
    });

    it('removes a filter if it is already set', () => {
      const filterString = 'running,hidden';
      const filter = handleFilterChange(filterString, 'running');

      expect(filter).to.be.an('array');
      expect(filter).to.have.length(1);
      expect(filter[0]).to.equal('hidden');
    });
  });

  describe('getFetchParams', () => {
    it('returns an object containing deprecated filter and a previous day date', () => {
      const filterString = 'running,hidden';
      const filter = getFetchParams(filterString);
      const date = moment().add(-1, 'days').format();

      expect(filter).to.be.an('object');
      expect(Object.keys(filter)).to.have.length(2);
      expect(filter.deprecated).to.equal(true);
      expect(filter.date).to.be.a('string');
      expect(filter.date).to.equal(date);
    });
  });

  describe('formatDate', () => {
    it('returns formatted moment object with yesterday when passed "24h"', () => {
      const str = DATES.PREV_DAY;
      const date = formatDate(str);
      const yesterday = moment().add(-1, 'days');

      expect(str).to.equal('24h');
      expect(date).to.be.an('object');
      expect(date.format('YYYYMMDD')).to.equal(yesterday.format('YYYYMMDD'));
    });

    it('returns formatted moment object with today from midnight when passed "today"', () => {
      const str = DATES.TODAY;
      const date = formatDate(str);
      const today = moment();

      expect(str).to.equal('today');
      expect(date).to.be.an('object');
      expect(date.format('YYYYMMDDHHmmss')).to.equal(`${today.format('YYYYMMDD')}000000`);
    });

    it('returns formatted moment object with current date and time when passed "week"', () => {
      const str = DATES.WEEK;
      const date = formatDate(str);
      const week = moment().add(-1, 'weeks');

      expect(str).to.equal('week');
      expect(date).to.be.an('object');
      expect(date.format('YYYYMMDDHHmmss')).to.equal(week.format('YYYYMMDDHHmmss'));
    });

    it('returns formatted moment object with "1970/01/01" when passed "all"', () => {
      const str = DATES.ALL;
      const date = formatDate(str);
      const all = moment(new Date('1970/01/01'));

      expect(str).to.equal('all');
      expect(date).to.be.an('object');
      expect(date.format('YYYYMMDDHHmmss')).to.equal(all.format('YYYYMMDDHHmmss'));
    });

    it('returns formatted moment object with the provided date', () => {
      const date = formatDate('19880809123456');

      expect(date).to.be.an('object');
      expect(date.format('YYYYMMDDHHmmss')).to.equal('19880809123456');
    });

    it('returns formatted moment object with yesterday when passed nothing', () => {
      const date = formatDate();
      const yesterday = moment().add(-1, 'days');

      expect(date).to.be.an('object');
      expect(date.format('YYYYMMDD')).to.equal(yesterday.format('YYYYMMDD'));
    });
  });
});
