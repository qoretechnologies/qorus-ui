import { expect } from 'chai';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import { getItem } from '../../utils';
import api from '../../../src/js/store/api';
import * as events from '../../../src/js/store/apievents/actions';
import { updateDone } from '../../../src/js/store/api/resources/remotes/actions';

describe('Remotes apievents from store/api/apievents & store/api/resources/remotes', () => {
  let store;

  beforeEach(() => {
    store = createStore(
      combineReducers({ api }),
      {
        api: {
          remotes: {
            data: [
              {
                name: 'test',
                up: true,
              },
              {
                name: 'anothertest',
                up: false,
              },
            ],
            sync: true,
          },
        },
      },
      applyMiddleware(
        thunk,
        promise,
      )
    );
  });

  describe('Remotes: ', () => {
    it('sets up to false', () => {
      store.subscribe(() => {
        const remote = getItem(store, 'remotes', 'test', 'name');

        expect(remote.up).to.eql(false);
        expect(remote._updated).to.eql(true);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'CONNECTION_DOWN',
            info: {
              name: 'test',
            },
          }])
        )
      );
    });

    it('sets up to true', () => {
      store.subscribe(() => {
        const remote = getItem(store, 'remotes', 'anothertest', 'name');

        expect(remote.up).to.eql(true);
        expect(remote._updated).to.eql(true);
      });

      store.dispatch(
        events.message(
          'test',
          JSON.stringify([{
            eventstr: 'CONNECTION_UP',
            info: {
              name: 'anothertest',
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
            eventstr: 'CONNECTION_UP',
            info: {
              name: 'anothertest',
            },
          }])
        )
      );

      store.subscribe(() => {
        const remote = getItem(store, 'remotes', 'anothertest', 'name');

        expect(remote._updated).to.eql(null);
      });

      store.dispatch(
        updateDone('anothertest')
      );
    });
  });
});
