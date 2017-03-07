import { expect } from 'chai';
import { getAlertObjectLink } from '../../src/js/helpers/system';

describe("getAlertObjectLink from 'helpers/search'", () => {
  it('returns a correct url chunk using id', () => {
    const url = getAlertObjectLink('SERVICE', { id: 20, name: 'Irellevant' });

    expect(url).to.eql('/services?paneId=20');
  });

  it('returns a correct url chunk using name', () => {
    const url = getAlertObjectLink('GROUP', { id: 20, name: 'group_name' });

    expect(url).to.eql('/groups?group=group_name');
  });

  it('returns a correct url chunk with suffix', () => {
    const url = getAlertObjectLink('WORKFLOW', { id: 20 });

    expect(url).to.eql('/workflow/20/list?filter=All');
  });
});
