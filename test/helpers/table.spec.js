import { expect } from 'chai';
import { getCSVHeaders } from '../../src/js/helpers/table';

describe('getCSVHeaders from helpers/table', () => {
  it('returns the workflows headers used for CSV export', () => {
    const headers = getCSVHeaders('workflows');

    expect(Object.keys(headers)).to.have.length(18);
    expect(Object.keys(headers)[0]).to.equal('exec_count');
    expect(Object.keys(headers)[17]).to.equal('total');
  });

  it('returns the services headers used for CSV export', () => {
    const headers = getCSVHeaders('services');

    expect(Object.keys(headers)).to.have.length(5);
    expect(Object.keys(headers)[0]).to.equal('type');
    expect(Object.keys(headers)[4]).to.equal('desc');
  });

  it('returns the jobs headers used for CSV export', () => {
    const headers = getCSVHeaders('jobs');

    expect(Object.keys(headers)).to.have.length(9);
    expect(Object.keys(headers)[0]).to.equal('name');
    expect(Object.keys(headers)[8]).to.equal('CRASHED');
  });
});
