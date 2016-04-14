import { expect } from 'chai';
import workflowHelpers from '../../src/js/helpers/workflows';

describe("Workflow Helpers from 'helpers/worklfows'", () => {
  it('transforms filter string to an array', () => {
    const filterString = 'running,hidden,last';
    const filterArray = workflowHelpers.filterArray(filterString);

    expect(filterArray).to.be.an('array');
    expect(filterArray).to.have.length(3);
  });

  it('returns array with "all" value when filter is empty', () => {
    const filterString = '';
    const filterArray = workflowHelpers.filterArray(filterString);

    expect(filterArray).to.be.an('array');
    expect(filterArray).to.have.length(1);
    expect(filterArray[0]).to.equal('all');
  });

  it('adds a new URL filter',  () => {
    const filterString = 'running,hidden';
    const filterAfter = workflowHelpers.handleFilterChange(filterString, 'last');

    expect(filterAfter).to.be.an('array');
    expect(filterAfter).to.have.length(3);
    expect(filterAfter[2]).to.equal('last');
  });

  it('removes a filter if it is already set',  () => {
    const filterString = 'running,hidden';
    const filterAfter = workflowHelpers.handleFilterChange(filterString, 'running');

    expect(filterAfter).to.be.an('array');
    expect(filterAfter).to.have.length(1);
    expect(filterAfter[0]).to.equal('hidden');
  });
});
