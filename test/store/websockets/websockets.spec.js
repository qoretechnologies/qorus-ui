/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import { Server, WebSocket } from 'mock-socket';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import ws from '../../../src/js/store/websockets';
import * as actions from '../../../src/js/store/websockets/actions';

global.WebSocket = WebSocket;

// @TODO: The library is broken, closing server does not work, I've opened an issue on github
// It also does not support the close codes, which makes it impossible to test pausing the websocket
describe('Websockets store handlers', () => {
  let store;

  it('connects the websockets', (done) => {
    const checkMiddleware = str => next => action => {
      const result = next(action);
      const { data } = str.getState();

      if (action.type === 'WEBSOCKET_CONNECTING') {
        expect(data).to.eql({
          'log/main/1': {
            loading: true,
            connected: false,
            error: false,
            paused: false,
          },
        });
      } else if (action.type === 'WEBSOCKET_CONNECTED') {
        expect(data).to.eql({
          'log/main/1': {
            loading: false,
            connected: true,
            error: false,
            paused: false,
          },
        });

        done();
      }

      return result;
    };

    store = createStore(ws,
      applyMiddleware(
        thunk,
        promise,
        checkMiddleware
      )
    );

    const server = new Server('ws://qorus.example.com/log/main/1');

    store.dispatch(actions.connect('log/main/1'));

    server.stop();
  });

  it('disconnects the websockets', (done) => {
    const checkMiddleware = str => next => action => {
      const result = next(action);
      const { data } = str.getState();

      if (action.type === 'WEBSOCKET_DISCONNECTED') {
        expect(data).to.eql({
          'log/main/3': {
            loading: false,
            connected: false,
            error: false,
            paused: false,
          },
        });

        done();
      }

      return result;
    };

    store = createStore(ws,
      applyMiddleware(
        thunk,
        promise,
        checkMiddleware
      )
    );

    const server = new Server('ws://qorus.example.com/log/main/3');

    store.dispatch(actions.connect('log/main/3'));

    setTimeout(() => {
      store.dispatch(actions.disconnect('log/main/3'));
    }, 500);

    server.stop();
  });
});

