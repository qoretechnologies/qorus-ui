import { expect } from 'chai';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import { getItem } from '../../utils';
import api from '../../../src/js/store/api';
import * as events from '../../../src/js/store/apievents/actions';
import { updateDone } from '../../../src/js/store/api/resources/groups/actions/specials';

describe('Groups apievents from store/api/apievents & store/api/resources/groups', () => {
  let store;

  beforeEach(() => {
    store = createStore(
      api,
      {
        groups: {
          data: [
            {
              name: 'testgroup',
              enabled: true,
            },
            {
              name: 'anothergroup',
              enabled: false,
            },
          ],
          sync: true,
        },
      },
      applyMiddleware(
        thunk,
        promise,
      )
    );
  });

  describe('Groups: ', () => {
    it('disables the group', () => {
      store.subscribe(() => {
        const group = getItem(store, 'groups', 'testgroup', 'name');

        expect(group.enabled).to.eql(false);
        expect(group._updated).to.eql(true);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'GROUP_STATUS_CHANGED',
            info: {
              name: 'testgroup',
              enabled: false,
            },
          }])
        )
      );
    });

    it('enables the group', () => {
      store.subscribe(() => {
        const group = getItem(store, 'groups', 'anothergroup', 'name');

        expect(group.enabled).to.eql(true);
        expect(group._updated).to.eql(true);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'GROUP_STATUS_CHANGED',
            info: {
              name: 'anothergroup',
              enabled: true,
            },
          }])
        )
      );
    });

    it('sets _updated to null', () => {
      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'GROUP_STATUS_CHANGED',
            info: {
              name: 'anothergroup',
              enabled: true,
            },
          }])
        )
      );

      store.subscribe(() => {
        const group = getItem(store, 'groups', 'anothergroup', 'name');

        expect(group._updated).to.eql(null);
      });

      store.dispatch(
        updateDone('anothergroup')
      );
    });
  });
});
