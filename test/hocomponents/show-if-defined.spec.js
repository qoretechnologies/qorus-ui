import React, { PropTypes } from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import showIfDefined from '../../src/js/hocomponents/show-if-defined';

describe('showIfDefined from \'helpers/show-if-defined\'', () => {
  const FakeComponent = ({ someProp }) => (
    <div>{someProp}</div>
  );
  FakeComponent.propTypes = {
    someProp: PropTypes.string,
  };

  const Component = showIfDefined('someProp', PropTypes.string)(FakeComponent);

  it('Property passed', () => {
    const wrapper = mount(<Component someProp="test" />);
    expect(wrapper.find('div').length).to.equals(1);
  });

  it('Property does not passed', () => {
    const wrapper = mount(<Component />);
    expect(wrapper.find('div').length).to.equals(0);
  });
});
