import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import Checkbox from '../../src/js/components/checkbox';

describe("Checkbox from 'components/checkbox'", () => {
  before(() => {
    chai.use(spies);
  });

  it('renders unchecked checkbox', () => {
    const wrapper = mount(
      <Checkbox checked="UNCHECKED" />
    );

    expect(wrapper.find('i')).to.have.length(1);
    expect(wrapper.find('i').first().props().className).to.equal('fa fa-square-o');
  });

  it('renders half-checked checkbox', () => {
    const wrapper = mount(
      <Checkbox checked="HALFCHECKED" />
    );

    expect(wrapper.find('i').first().props().className).to.equal('fa fa-minus-square-o');
  });

  it('renders checked chechbox', () => {
    const wrapper = mount(
      <Checkbox checked="CHECKED" />
    );

    expect(wrapper.find('i').first().props().className).to.equal('fa fa-check-square-o');
  });

  it('changes the checkbox on click', () => {
    const wrapper = mount(
      <Checkbox checked="UNCHECKED" />
    );

    wrapper.find('i').first().simulate('click');

    expect(wrapper.find('i').first().props().className).to.equal('fa fa-check-square-o');
  });
});
