import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import csv from '../../src/js/hocomponents/csv';

chai.use(spies);

describe('csv from hocomponents/csv', () => {
  const ActualComp = ({ onCSVClick }: { onCSVClick: Function }) => (
    <div onClick={onCSVClick} />
  );

  it('adds the csv function to props', () => {
    const Comp = csv('test', 'test')(ActualComp);
    const wrapper = mount(<Comp test={{ a: 20, b: 30 }} />);

    expect(wrapper.find(ActualComp).first().props().onCSVClick).to.be.a('function');
  });
});
