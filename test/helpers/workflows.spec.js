import { expect } from 'chai';
import { filterArray, handleFilterChange } from '../../src/js/helpers/workflows';

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
});
