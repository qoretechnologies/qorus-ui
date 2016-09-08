import { expect } from 'chai';
import { createStore } from 'redux';

import log from '../../../src/js/store/log';
import * as actions from '../../../src/js/store/log/actions';

describe('Log store from "store/log"', () => {
  let store;

  beforeEach(() => {
    store = createStore(log);
  });

  it('initializes the log with default state', () => {
    store.subscribe(() => {
      const { data } = store.getState();

      expect(data).to.eql({
        testlog: {
          messages: [],
        },
      });
    });

    store.dispatch(actions.init('testlog'));
  });

  it('saves messages', () => {
    store.dispatch(actions.init('testlog'));
    store.dispatch(actions.onMessage('testlog', 'This is a test message 1'));

    store.subscribe(() => {
      const { data } = store.getState();

      expect(data).to.eql({
        testlog: {
          messages: [
            'This is a test message 1',
            'This is a test message 2',
          ],
        },
      });
    });

    store.dispatch(actions.onMessage('testlog', 'This is a test message 2'));
  });

  it('clears messages', () => {
    store.dispatch(actions.init('testlog'));
    store.dispatch(actions.onMessage('testlog', 'This is a test message 1'));
    store.dispatch(actions.onMessage('testlog', 'This is a test message 2'));

    store.subscribe(() => {
      const { data } = store.getState();

      expect(data).to.eql({
        testlog: {
          messages: [],
        },
      });
    });

    store.dispatch(actions.clear('testlog'));
  });
});
