/* eslint no-unused-expressions: 0 */
import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import spies from 'chai-spies';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import api from '../../src/js/store/api';
import SearchContainer from '../../src/js/containers/search';

chai.use(spies);

describe('search from "containers/search"', () => {
  let store;

  beforeEach(() => {
    store = createStore(
      combineReducers({ api }),
      {
        api: {
          currentUser: {
            data: {
              username: 'filip',
              storage: {
                workflows: {
                  searches: ['Test'],
                },
              },
            },
          },
        },
      },
      applyMiddleware(thunk, promise)
    );
  });

  it('renders the search without resource defined', () => {
    const wrapper = mount(
      <Provider store={store}>
        <SearchContainer
          onSearchUpdate={() => true}
          defaultValue="test"
        />
      </Provider>
    );

    expect(wrapper.find('Search').props().onSearchUpdate).to.be.a('function');
    expect(wrapper.find('Search').props().defaultValue).to.eql('test');
  });

  it('runs the provided search function', () => {
    const action = chai.spy();
    const wrapper = mount(
      <Provider store={store}>
        <SearchContainer
          onSearchUpdate={action}
          defaultValue="test"
        />
      </Provider>
    );

    wrapper.find('Search').props().onSearchUpdate('test');

    expect(action).to.have.been.called().with('test');
  });

  it('passes null instead of an array, if the searches do not exist in the storage', () => {
    const action = chai.spy();
    const wrapper = mount(
      <Provider store={store}>
        <SearchContainer
          onSearchUpdate={action}
          defaultValue="test"
          resource="services"
        />
      </Provider>
    );

    expect(wrapper.find('Search').props().searches).to.be.null;
  });

  it('passes the search array if the resource has searches in the storage', () => {
    const action = chai.spy();
    const wrapper = mount(
      <Provider store={store}>
        <SearchContainer
          onSearchUpdate={action}
          defaultValue="test"
          resource="workflows"
        />
      </Provider>
    );

    expect(wrapper.find('Search').props().searches).to.be.an('array');
    expect(wrapper.find('Search').props().searches).to.have.length(1);
  });

  it('does not dispatch the store action if the resources are specified but save is false', () => {
    const action = chai.spy();
    const storeAction = chai.spy();
    const wrapper = mount(
      <Provider store={store}>
        <SearchContainer
          onSearchUpdate={action}
          storeSearch={storeAction}
          defaultValue="test"
          resource="workflows"
        />
      </Provider>
    );

    store.subscribe(() => {
      expect(store.getState().api.currentUser.data.storage.workflows.searches).to.have.length(1);
    });

    wrapper.find('Search').props().onSearchUpdate('topkek', false);
  });

  it('dispatches the store action if the resources are specified', () => {
    const action = chai.spy();
    const storeAction = chai.spy();
    const wrapper = mount(
      <Provider store={store}>
        <SearchContainer
          onSearchUpdate={action}
          storeSearch={storeAction}
          defaultValue="test"
          resource="workflows"
        />
      </Provider>
    );

    store.subscribe(() => {
      expect(store.getState().api.currentUser.data.storage.workflows.searches).to.have.length(2);
      expect(store.getState().api.currentUser.data.storage.workflows.searches[0]).to.eql('topkek');
      expect(store.getState().api.currentUser.data.storage.workflows.searches[1]).to.eql('Test');
    });

    wrapper.find('Search').props().onSearchUpdate('topkek', true);
  });
});
