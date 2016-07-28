import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import showIfLoaded from '../../src/js/hocomponents/show-if-loaded';

describe('showIfLoaded from hocomponents/show-if-loaded', () => {
  const ActualComp = () => <div className="actual">actual</div>;

  const Comp = showIfLoaded('value')(ActualComp);

  it('show actual', () => {
    const value = {
      loading: false,
      sync: true,
    };
    const wrapper = mount(<Comp {...{ value }} />);

    expect(wrapper.find('.actual').length).to.equals(1);
    expect(wrapper.find('.fa-spin').length).to.equals(0);
  });

  it('show loader', () => {
    const value = {
      loading: true,
      sync: true,
    };
    const wrapper = mount(<Comp {...{ value }} />);

    expect(wrapper.find('.actual').length).to.equals(0);
    expect(wrapper.find('.fa-spin').length).to.equals(1);
  });
});
