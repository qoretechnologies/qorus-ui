/* eslint no-unused-expressions: 0 */
import React, { PropTypes } from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import spies from 'chai-spies';

import loadIfUndefined from '../../src/js/hocomponents/load-if-undefined';

describe('loadIfundefined from \'helpers/load-if-undefined\'', () => {
  const FakeComponent = () => <div />;
  const Component = loadIfUndefined('someProp', PropTypes.string)(FakeComponent);

  before(() => {
    chai.use(spies);
  });

  it('Load if someProp is undefined', () => {
    const load = chai.spy();

    mount(<Component load={load} />);

    expect(load).to.have.been.called;
  });

  it('Do not load if someProps passed', () => {
    const load = chai.spy();

    mount(<Component load={load} someProps="test" />);

    expect(load).to.not.have.been.called;
  });
});
