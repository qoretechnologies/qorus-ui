import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import DetailButton from '../../src/js/components/detail_button';

chai.use(spies);

describe('DetailButton from "components/detail_button"', () => {
  it('renders Detail button and runs the provided action', () => {
    const action = chai.spy();
    const wrapper = mount(
      <DetailButton onClick={action} />
    );

    expect(wrapper.find('button').hasClass('btn-success')).to.equal(true);
    expect(wrapper.find('button').text()).to.equal(' Detail');

    wrapper.find('button').simulate('click');

    expect(action).to.have.been.called();
  });

  it('renders Close button and runs the provided action', () => {
    const action = chai.spy();
    const wrapper = mount(
      <DetailButton active onClick={action} />
    );

    expect(wrapper.find('button').hasClass('btn-danger')).to.equal(true);
    expect(wrapper.find('button').text()).to.equal(' Close');

    wrapper.find('button').simulate('click');

    expect(action).to.have.been.called();
  });
});
