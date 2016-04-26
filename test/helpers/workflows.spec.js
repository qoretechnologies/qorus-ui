import { expect } from 'chai';
import { filterArray, handleFilterChange, getFetchParams } from '../../src/js/helpers/workflows';
import { DATE_FORMATS } from '../../src/js/constants/dates';
import moment from 'moment';

describe("Workflow Helpers from 'helpers/worklfows'", () => {
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
