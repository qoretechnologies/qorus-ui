/* eslint no-unused-expressions: 0 */
import React from 'react';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { mount } from 'enzyme';

import { BubbleList, Bubble } from '../../src/js/components/bubbles';

chai.use(spies);

describe('{ BubbleList, Bubble } from \'components/bubbles\'', () => {
  it('Show different bubble types', () => {
    const wrapper = mount(
      <BubbleList>
        <Bubble type="success">Success</Bubble>
        <Bubble type="warning">Warning</Bubble>
        <Bubble type="error">Error</Bubble>
      </BubbleList>
    );

    expect(wrapper.find('.bubble').length).to.equals(3);
    expect(wrapper.find('.success').length).to.equals(1);
    expect(wrapper.find('.warning').length).to.equals(1);
    expect(wrapper.find('.error').length).to.equals(1);
  });

  it('Handle bubble click', () => {
    const handleClick = chai.spy();

    const wrapper = mount(
      <Bubble
        type="success"
        onClick={handleClick}
      >
        Success
      </Bubble>
    );

    wrapper.find(Bubble).simulate('click');

    expect(handleClick).to.have.been.called();
  });
});
