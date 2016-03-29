import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';


import StatusIcon from '../../src/js/components/status_icon';


describe("StatusIcon from 'components/status_icon'", () => {
  it('renders green check circle if value prop is truthy', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <StatusIcon value={'truthy'} />
    );
    const result = renderer.getRenderOutput();

    expect(result.props.className.split(/\s+/)).to.include('fa-check-circle');
    expect(result.props.className.split(/\s+/)).to.include('text-success');
  });


  it('renders red minus circle if value prop is falsy or undefined', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <StatusIcon />
    );
    const result = renderer.getRenderOutput();

    expect(result.props.className.split(/\s+/)).to.include('fa-minus-circle');
    expect(result.props.className.split(/\s+/)).to.include('text-danger');
  });
});
