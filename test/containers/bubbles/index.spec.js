import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { Bubbles } from '../../../src/js/containers/bubbles';

const store = createStore(() => {});

describe('import { Bubbles } from \'containers/bubbles\'', () => {
  it('Empty array', () => {
    const bubbleList = [];
    const wrapper = mount(
      <Provider store={store}>
        <div>
          <Bubbles {...{ bubbleList }} />,
        </div>
      </Provider>
    );

    expect(wrapper.find('.bubbles').length).to.equals(0);
  });

  it('Not empty array', () => {
    const bubbleList = [
      { id: 'asdf', type: 'SUCCESS', message: 'test' },
      { id: 'asdf1', type: 'SUCCESS', message: 'test' },
    ];

    const wrapper = mount(
      <Provider store={store}>
        <div>
          <Bubbles {...{ bubbleList }} />
        </div>
      </Provider>
    );

    expect(wrapper.find('.bubble').length).to.equals(2);
  });
});
