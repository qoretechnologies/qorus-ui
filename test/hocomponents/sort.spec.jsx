import React, { PropTypes } from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import sort from '../../src/js/hocomponents/sort';
import ui from '../../src/js/store/ui';
import api from '../../src/js/store/api';

describe('sort from \'hocomponents/sort\'', () => {
  const incomeData = [
    { a: 2, b: 'a' },
    { a: 1, b: 'c' },
    { a: 3, b: 'b' },
  ];

  let store;
  let renderedData;

  beforeEach(() => {
    renderedData = null;
    store = createStore(
      combineReducers({ ui, api }),
      {
        api: {
          currentUser: {
            data: {
              storage: {},
            },
          },
        },
      },
      applyMiddleware(
        thunk,
        promise
      )
    );
  });

  const FakeComponent = ({ data, onSortChange: handleSortChange }) => {
    renderedData = data;
    return (
      <div>
        <button
          className="first-field"
          onClick={() => handleSortChange({ sortBy: 'a' })}
        >
          sort by a
        </button>
        <button
          className="second-field"
          onClick={() => handleSortChange({ sortBy: 'b' })}
        >
          sort by b
        </button>
      </div>
    );
  };
  FakeComponent.propTypes = {
    data: PropTypes.array,
    onSortChange: PropTypes.func,
  };

  it('without sort', () => {
    const Component = sort('error', 'data')(FakeComponent);

    mount(
      <Provider store={store}>
        <Component data={incomeData} />
      </Provider>
    );

    expect(renderedData).to.deep.equals(incomeData);
  });

  it('with default sort', () => {
    const Component = sort(
      'error',
      'data',
      {
        sortBy: 'a',
        sortByKey: {
          direction: -1,
          ignoreCase: true,
        },
      }
    )(FakeComponent);

    mount(
      <Provider store={store}>
        <Component data={incomeData} />
      </Provider>
    );

    expect(
      renderedData
    ).to.deep.equal(
      [
        { a: 3, b: 'b' },
        { a: 2, b: 'a' },
        { a: 1, b: 'c' },
      ]
    );
  });

  it('change sort a field asc', () => {
    const Component = sort(
      'error',
      'data',
      {
        sortBy: 'a',
        sortByKey: {
          direction: -1,
          ignoreCase: true,
        },
      }
    )(FakeComponent);

    const wrapper = mount(
      <Provider store={store}>
        <Component data={incomeData} />
      </Provider>
    );

    wrapper.find('.first-field').simulate('click');

    expect(
      renderedData
    ).to.deep.equal(
      [
        { a: 1, b: 'c' },
        { a: 2, b: 'a' },
        { a: 3, b: 'b' },
      ]
    );
  });

  it('change sort b field desc', () => {
    const Component = sort(
      'error',
      'data',
      {
        sortBy: 'b',
        sortByKey: {
          direction: 1,
          ignoreCase: true,
        },
      }
    )(FakeComponent);

    const wrapper = mount(
      <Provider store={store}>
        <Component data={incomeData} />
      </Provider>
    );

    wrapper.find('.second-field').simulate('click');

    expect(
      renderedData
    ).to.deep.equal(
      [
        { a: 1, b: 'c' },
        { a: 3, b: 'b' },
        { a: 2, b: 'a' },
      ]
    );
  });

  it('sort with default history key', () => {
    const Component = sort(
      'something',
      'data',
      {
        sortBy: 'b',
        sortByKey: {
          direction: -1,
        },
      }
    )(FakeComponent);

    const initialData = [
      { a: 1, b: 'a' },
      { a: 1, b: 'b' },
      { a: 2, b: 'c' },
    ];

    const wrapper = mount(
      <Provider store={store}>
        <Component data={initialData} />
      </Provider>
    );

    wrapper.find('.first-field').simulate('click');

    expect(renderedData).to.deep.equal([
      { a: 2, b: 'c' },
      { a: 1, b: 'b' },
      { a: 1, b: 'a' },
    ]);
  });
});
