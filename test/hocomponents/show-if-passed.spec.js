import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import showIfPassed from '../../src/js/hocomponents/show-if-passed';

describe('showIfPassed from hocomponents/show-if-passed', () => {
  const OtherComp = () => <div className="other">other</div>;
  const ActualComp = () => <div className="actual">actual</div>;

  const Comp = showIfPassed(
    ({ value }) => value === 'show',
    <OtherComp />
  )(
    ActualComp
  );

  it('value is show', () => {
    const wrapper = mount(<Comp value="show" />);
    expect(wrapper.find('.actual').length).to.equals(1);
    expect(wrapper.find('.other').length).to.equals(0);
  });


  it('value isn`t show', () => {
    const wrapper = mount(<Comp />);
    expect(wrapper.find('.actual').length).to.equals(0);
    expect(wrapper.find('.other').length).to.equals(1);
  });
});
