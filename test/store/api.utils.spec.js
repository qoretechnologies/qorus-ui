import { expect } from 'chai';
import { extendActions } from '../../src/js/store/api/utils.js';

describe('Testing API utils', () => {
  const actions = {
    UPDATE: id => id
  };
  const defaultActions = {
    FETCH: id => id
  };

  const extendedActions = extendActions('workflows', defaultActions, actions);

  it('extendedActions should have property workflows', () => {
    expect(extendedActions).to.have.property('workflows');
  });

  it('extendedActions.workflows should have length of 2', () => {
    expect(Object.keys(extendedActions.workflows)).to.have.length(2);
  });
});
