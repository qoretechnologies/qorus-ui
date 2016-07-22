import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Alert from '../../src/js/components/alert';

describe.only('Alert from components/alert', () => {
  it('render without specified bsStyle', () => {
    const wrapper = shallow(<Alert>test</Alert>);
    expect(wrapper.find('.alert').length).to.equal(1);
  });

  it('render with specified bsStyle', () => {
    const wrapper = shallow(<Alert bsStyle="warning">test</Alert>);
    expect(wrapper.find('.alert-warning').length).to.equal(1);
  });
});
