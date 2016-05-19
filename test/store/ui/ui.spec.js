import { expect } from 'chai';
import ui from '../../../src/js/store/ui';
import * as actions from '../../../src/js/store/ui/actions';

import { createStore } from 'redux';

const store = createStore(ui);

describe('UI redux store', () => {
  it('returns the default state', () => {
    store.subscribe(() => {
      expect(store.getState().workflows).to.be.an('object');
      expect(store.getState().workflows.sortBy).to.equal('id');
      expect(store.getState().workflows.sortByKey.direction).to.equal(-1);
      expect(store.getState().workflows.historySortBy).to.equal('name');
      expect(store.getState().workflows.historySortByKey.direction).to.equal(1);
    });

    store.dispatch(
      actions.workflows.sort(
        { sortBy: 'id', sortByKey: { ignoreCase: true, direction: -1 } }
      )
    );
  });
});
