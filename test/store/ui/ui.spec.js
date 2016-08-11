/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import { createStore } from 'redux';

import ui from '../../../src/js/store/ui';
import * as actions from '../../../src/js/store/ui/actions';
import { statuses } from '../../../src/js/constants/bubbles';


describe('UI redux store', () => {
  let store;

  beforeEach(() => {
    store = createStore(ui);
  });

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

  describe('bubbles', () => {
    it('add bubble', () => {
      store.subscribe(() => {
        const state = store.getState();
        const bubbleList = state.bubbles.list;
        expect(bubbleList).to.be.instanceOf(Array);
        expect(bubbleList.length).to.equals(1);
      });

      store.dispatch(
        actions.bubbles.success('test')
      );
    });

    it('Newest bubble at first', () => {
      store.dispatch(
        actions.bubbles.error('something goes wrong')
      );

      store.subscribe(() => {
        const state = store.getState();
        const bubbleList = state.bubbles.list;

        expect(bubbleList[0].type).to.equals(statuses.SUCCESS);
        expect(bubbleList[1].type).to.equals(statuses.ERROR);
      });

      store.dispatch(
        actions.bubbles.success('good news')
      );
    });

    Object.keys(statuses).forEach(item => {
      const name = item.toLowerCase();
      it(`add ${name} bubble`, () => {
        store.subscribe(() => {
          const state = store.getState();
          const bubbleList = state.bubbles.list;
          const bubble = bubbleList[0];
          expect(bubble.type).to.equals(item);
        });

        store.dispatch(
          actions.bubbles[name]('test')
        );
      });
    });

    it('Delete bubble', () => {
      store.dispatch(actions.bubbles.success('1'));
      store.dispatch(actions.bubbles.success('2'));
      store.dispatch(actions.bubbles.success('3'));

      const state = store.getState();
      const bubbleId = state.bubbles.list[1].id;

      store.subscribe(() => {
        const updatedState = store.getState();
        const bubbleList = updatedState.bubbles.list;
        expect(bubbleList.length).to.equals(2);
      });

      store.dispatch(
        actions.bubbles.deleteBubble(bubbleId)
      );
    });
  });

  describe('sort', () => {
    it('Change sort for table', () => {
      const tableName = 'test';

      store.subscribe(() => {
        const updatedState = store.getState();

        const tableInfo = updatedState.sort[tableName];

        expect(tableInfo.sortBy).to.equals('field');
        expect(tableInfo.sortByKey.direction).to.equals(-1);
        expect(tableInfo.sortByKey.ignoreCase).to.be.true;
      });

      store.dispatch(
        actions.sort.changeSort(tableName, 'field', -1)
      );
    });
  });
});
