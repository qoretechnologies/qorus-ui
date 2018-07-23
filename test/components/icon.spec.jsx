import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Icon from '../../src/js/components/icon';

describe('Icon from components/icon', () => {
  it('renders the Icon with the correct glyph', () => {
    const Component = mount(
      <Icon iconName="remove" />
    );

    expect(Component.find('i').hasClass('fa')).to.eql(true);
    expect(Component.find('i').hasClass('fa-remove')).to.eql(true);
  });

  it('renders the Icon with custom classnames', () => {
    const Component = mount(
      <Icon iconName="remove" className="test" />
    );

    expect(Component.find('i').hasClass('fa')).to.eql(true);
    expect(Component.find('i').hasClass('fa-remove')).to.eql(true);
    expect(Component.find('i').hasClass('test')).to.eql(true);
  });
});
