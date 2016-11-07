import React, { PropTypes } from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import compose from 'recompose/compose';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { Server, WebSocket } from 'mock-socket';

import ws from '../../src/js/store/websockets';
import websocket from '../../src/js/hocomponents/websocket';

global.WebSocket = WebSocket;

describe('websocket hoc from "hocomponents/websocket"', () => {
  let store;

  beforeEach(() => {
    store = createStore(
      combineReducers(
        { ws }
      ),
      applyMiddleware(
        thunk,
        promise,
      )
    );
  });

  const EnhancedComponent = ({
    wsConnect,
    wsDisconnect,
  }) => (
    <div id="enhanced">
      <button id="connect" onClick={wsConnect} />
      <button id="disconnect" onClick={wsDisconnect} />
    </div>
  );

  EnhancedComponent.propTypes = {
    wsConnect: PropTypes.func,
    wsDisconnect: PropTypes.func,
  };

  it('renders the component', (done) => {
    const server = new Server('ws://qorus.example.com/test');

    const Component = compose(
      websocket({})
    )(EnhancedComponent);

    const wrapper = mount(
      <Provider store={store}>
        <Component
          url="test"
          connected
          loading={false}
        />
      </Provider>
    );

    setTimeout(() => {
      expect(Object.keys(wrapper.find(EnhancedComponent).first().props())).to.eql([
        'wsConnect',
        'wsDisconnect',
        'wsPause',
        'wsResume',
        'url',
        'paused',
      ]);

      server.stop();
      done();
    }, 100);
  });

  it('runs the websockets functions', (done) => {
    const server = new Server('ws://qorus.example.com/test1');

    const connectAction = chai.spy();
    const resumeAction = chai.spy();
    const disconnectAction = chai.spy();
    const pauseAction = chai.spy();

    const Component = compose(
      websocket({
        onOpen: connectAction,
        onClose: disconnectAction,
        onPause: pauseAction,
        onResume: resumeAction,
      })
    )(EnhancedComponent);

    const wrapper = mount(
      <Provider store={store}>
        <Component
          url="test1"
        />
      </Provider>
    );

    setTimeout(() => {
      wrapper.find('#connect').simulate('click');

      expect(connectAction).to.have.been.called().with('test1');

      wrapper.find('#disconnect').simulate('click');

      expect(disconnectAction).to.have.been.called().with('test1');

      server.stop();
      done();
    }, 100);
  });
});
