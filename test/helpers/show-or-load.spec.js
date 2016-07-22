/* eslint no-unused-expressions: 0 */
import React, { PropTypes } from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import spies from 'chai-spies';

import showOrLoad from '../../src/js/helpers/show-or-load';

describe('showOrLoad from \'helpers/show-or-load\'', () => {
  const FakeComponent = () => <div />;
  const Component = showOrLoad('someProp', PropTypes.string)(FakeComponent);

  before(() => {
    chai.use(spies);
  });

  it('Load if someProp is undefined', () => {
    const load = chai.spy();

    const wrapper = mount(<Component load={load} />);

    expect(load).to.have.been.called;
    expect(wrapper.find('div').length).to.equals(0);
  });

  it('Do not load if someProps passed', () => {
    const load = chai.spy();

    const wrapper = mount(<Component load={load} someProps="test" />);

    expect(load).to.not.have.been.called;
    expect(wrapper.find('div').length).to.equals(1);
  });
});
