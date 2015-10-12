import { expect } from 'chai';
import { createDefaultActions, prepareApiActions }
  from '../../src/js/store/api/utils.js';

describe('Testing API utils', () => {
  const resources = [
    {
      name: 'workflows',
      url: 'api/workflows',
      actions: {
        GET: url => id => `${url}-${id}`
      }
    }
  ];
  const actions = {
    FETCH: url => id => `${url}-${id}`
  };

  const defaultActions = createDefaultActions(resources, actions);
  const resourceActions = resources.map(r => {
    return prepareApiActions(r.url, r.actions);
  });

  it('createDefaultActions should have property workflows', () => {
    expect(defaultActions[0]).to.have.property('workflows');
  });

  it('createDefaultActions.workflows should have property fetch', () => {
    expect(defaultActions[0].workflows).to.have.property('fetch');
  });

  it('createDefaultActions.workflows should have property fetch', () => {
    expect(defaultActions[0].workflows).to.have.property('fetch');
  });
});
