import React from 'react';
import { mount } from 'enzyme';

import { BubbleItem } from '../../../src/js/containers/bubbles/item';

describe('{ BubbleItem } from \'containers/bubbles/item\'', () => {
  it('delete after timeout', done => {
    const deleteBubble = () => done();
    const bubble = {
      id: 'test',
      type: 'SUCCESS',
      message: 'test',
    };
    const timeout = 100;

    mount(
      <BubbleItem
        {...{ timeout, bubble, deleteBubble }}
      />
    );
  });
});
