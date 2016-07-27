import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Label from '../../src/js/components/label';

describe('Label from components/label', () => {
  it('Show success label', () => {
    const wrapper = shallow(<Label style="success">Success</Label>);
    expect(wrapper.find('.label-success').length).to.equals(1);
  });

  it('Show label', () => {
    const wrapper = shallow(<Label>Success</Label>);
    expect(wrapper.find('.label').length).to.equals(1);
  });
});