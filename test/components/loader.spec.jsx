import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';

import Loader from '../../src/js/components/loader';


describe("Loader from 'components/loader'", () => {
  it('renders text "Loading..." with a spinner next to it', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <Loader />
    );
    const result = renderer.getRenderOutput();

    expect(result.props.children[2]).to.eql('Loading...');
    expect(result.props.children[0].props.className.split(/\s+/)).
      to.have.members(['fa', 'fa-spinner', 'fa-spin']);
  });

  it('renders custom text "Waiting" with a spinner next to it', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <Loader message="Waiting" />
    );
    const result = renderer.getRenderOutput();

    expect(result.props.children[2]).to.eql('Waiting');
    expect(result.props.children[0].props.className.split(/\s+/)).
      to.have.members(['fa', 'fa-spinner', 'fa-spin']);
  });
});
