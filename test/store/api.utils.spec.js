import { expect } from 'chai';
import { createResourceActions, combineResourceActions }
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

  const defaultActions = createResourceActions(resources, actions);
  const resourceActions = createResourceActions(resources, r => r);

  const workflowDefaultActions = defaultActions[0];
  const workflowOwnActions = resourceActions[0];
  const combinedActions = combineResourceActions(
    workflowOwnActions,
    workflowDefaultActions
  );

  it('workflowDefaultActions should have property workflows', () => {
    expect(workflowDefaultActions).to.include.keys('workflows');
  });

  it('workflowDefaultActions.workflows should have property fetch', () => {
    expect(workflowDefaultActions.workflows).to.have.property('fetch');
  });

  it('workflowOwnActions.workflows should have property get', () => {
    expect(workflowOwnActions.workflows).to.have.property('get');
  });

  it('combinedActions should have property workflows', () => {
    expect(combinedActions).to.have.property('workflows');
  });

  it('combinedActions.workflows should have keys get, fetch', () => {
    expect(combinedActions.workflows).to.have.keys('get', 'fetch');
  });

});
