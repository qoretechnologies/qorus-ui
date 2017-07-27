import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import fill from 'lodash/fill';

import api from '../../src/js/store/api';
import loadMore from '../../src/js/hocomponents/loadMore';

const getItems: Function = () => ([
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
]);

describe('loadMore from hocomponents/loadMore', () => {
  const ActualComp = ({ items }: { items: Array<number> }) => (
    <div>
      {items.map((item: number): React.Element<any> => (
        <p>{item}</p>
      ))}
    </div>
  );

  let store;

  beforeEach(() => {
    store = createStore(
      combineReducers({ api }),
      {
        api: {
          orders: {
            data: fill(Array(50), 'a'),
            sync: true,
            offset: 0,
            limit: 50,
          },
        },
      },
      applyMiddleware(
        thunk,
        promise,
      )
    );
  });

  describe('local load more using local state', () => {
    it('passes all props, displays the data, does not display laod more', () => {
      const Comp = loadMore('items', 'workflows', true, 20)(ActualComp);
      const wrapper = mount(
        <Provider store={store}>
          <Comp items={getItems()} />
        </Provider>
      );

      expect(wrapper.find(ActualComp).props().changeLocalOffset).to.be.a('function');
      expect(wrapper.find(ActualComp).props().localOffset).to.eql(0);
      expect(wrapper.find(ActualComp).props().canLoadMore).to.eql(false);
      expect(wrapper.find(ActualComp).props().handleLoadMore).to.be.a('function');
      expect(wrapper.find('p')).to.have.length(10);
    });

    it('displays only the amount of data specified in limit, shows load more', () => {
      const Comp = loadMore('items', 'workflows', true, 3)(ActualComp);
      const wrapper = mount(
        <Provider store={store}>
          <Comp items={getItems()} />
        </Provider>
      );

      expect(wrapper.find('p')).to.have.length(3);
      expect(wrapper.find(ActualComp).props().canLoadMore).to.eql(true);
    });

    it('displays more data when the load more button is clicked', () => {
      const Comp = loadMore('items', 'workflows', true, 3)(ActualComp);
      const wrapper = mount(
        <Provider store={store}>
          <Comp items={getItems()} />
        </Provider>
      );

      wrapper.find(ActualComp).props().handleLoadMore();

      expect(wrapper.find('p')).to.have.length(6);
      expect(wrapper.find(ActualComp).props().localOffset).to.eql(3);
      expect(wrapper.find(ActualComp).props().offsetLimit).to.eql(6);
    });

    it('displays all data when the load all button is clicked', () => {
      const Comp = loadMore('items', 'workflows', true, 3)(ActualComp);
      const wrapper = mount(
        <Provider store={store}>
          <Comp items={getItems()} />
        </Provider>
      );

      wrapper.find(ActualComp).props().handleLoadAll();

      expect(wrapper.find('p')).to.have.length(10);
      expect(wrapper.find(ActualComp).props().localOffset).to.eql(10);
      expect(wrapper.find(ActualComp).props().offsetLimit).to.eql(13);
      expect(wrapper.find(ActualComp).props().canLoadMore).to.eql(false);
    });

    it('load more is hidden when all data are displayed', () => {
      const Comp = loadMore('items', 'workflows', true, 3)(ActualComp);
      const wrapper = mount(
        <Provider store={store}>
          <Comp items={getItems()} />
        </Provider>
      );

      wrapper.find(ActualComp).props().handleLoadMore();
      wrapper.find(ActualComp).props().handleLoadMore();
      wrapper.find(ActualComp).props().handleLoadMore();

      expect(wrapper.find('p')).to.have.length(10);
      expect(wrapper.find(ActualComp).props().localOffset).to.eql(9);
      expect(wrapper.find(ActualComp).props().offsetLimit).to.eql(12);
      expect(wrapper.find(ActualComp).props().canLoadMore).to.eql(false);
    });
  });

  describe('global load more using store', () => {
    it('passes all props, displays the data', () => {
      const Comp = compose(
        connect(
          (state: Object): Object => ({
            items: state.api.orders.data,
          })
        ),
        loadMore('items', 'orders')
      )(ActualComp);
      const wrapper = mount(
        <Provider store={store}>
          <Comp />
        </Provider>
      );

      expect(wrapper.find(ActualComp).props().changeOffset).to.be.a('function');
      expect(wrapper.find(ActualComp).props().handleLoadMore).to.be.a('function');
      expect(wrapper.find(ActualComp).props().offset).to.eql(0);
      expect(wrapper.find(ActualComp).props().loadMoreTotal).to.eql(50);
      expect(wrapper.find('p')).to.have.length(50);
    });

    it('clicking load more button changes the offset in store', () => {
      const Comp = compose(
        connect(
          (state: Object): Object => ({
            items: state.api.orders.data,
          })
        ),
        loadMore('items', 'orders')
      )(ActualComp);
      const wrapper = mount(
        <Provider store={store}>
          <Comp />
        </Provider>
      );

      wrapper.find(ActualComp).props().handleLoadMore();

      expect(wrapper.find(ActualComp).props().offset).to.eql(50);
      expect(wrapper.find(ActualComp).props().offsetLimit).to.eql(100);
    });
  });
});
