import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import Checkbox from '../../src/js/components/checkbox';

describe("Checkbox from 'components/checkbox'", () => {
  before(() => {
    chai.use(spies);
  });

  it('renders unchecked checkbox', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <Checkbox checked={false} />
    );
    const result = renderer.getRenderOutput();

    expect(result.type).to.equal('i');
    expect(result.props.className).to.equal('fa fa-square-o');
  });

  it('renders checked chechbox', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <Checkbox checked />
    );
    const result = renderer.getRenderOutput();

    expect(result.type).to.equal('i');
    expect(result.props.className).to.equal('fa fa-check-square-o');
  });

  it('changes the checkbox on click', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <Checkbox checked={false} />
    );
    let result = renderer.getRenderOutput();

    result.props.onClick({ stopPropagation: () => {} });
    result = renderer.getRenderOutput();

    expect(result.props.className).to.equal('fa fa-check-square-o');
  });
});
