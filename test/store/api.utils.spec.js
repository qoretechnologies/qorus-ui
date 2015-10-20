import { expect } from 'chai';
import { createResourceActions, combineResourceActions, createApiActions }
  from '../../src/js/store/api/utils.js';

describe('Testing API utils', () => {
  const resources = [
    {
      name: 'workflows',
      url: 'api/workflows',
      actions: {
        GET: url => id => `${url}-${id}`
      }
    },
    {
      name: 'services',
      url: 'api/services',
      actions: {
        GET: url => id => `${url}-${id}`
      }
    }
  ];
  const actions = {
    FETCH: url => id => `${url}-${id}`
  };

  const defaultActions = createResourceActions(resources, actions);
  const resourceActions = createResourceActions(resources, r => r);

  const combinedActions = combineResourceActions(
    defaultActions,
    resourceActions
  );

  it('workflowDefaultActions should have property workflows', () => {
    expect(defaultActions).to.include.keys('workflows');
  });

  it('workflowDefaultActions.workflows should have property fetch', () => {
    expect(defaultActions.workflows).to.have.property('fetch');
  });

  it('workflowOwnActions.workflows should have property get', () => {
    expect(defaultActions.workflows).to.have.property('get');
  });

  it('combinedActions should have keys workflows, services', () => {
    expect(combinedActions).to.have.keys('workflows', 'services');
  });

  it('combinedActions.workflows should have keys get, fetch', () => {
    expect(combinedActions.workflows).to.have.keys('get', 'fetch');
  });

});
