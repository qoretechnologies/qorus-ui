require('../testdom.js')('<html><body></body></html>');

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import jsdom from 'mocha-jsdom';
import { expect } from 'chai';


import StatusIcon from '../../src/js/components/statusIcon';


describe("StatusIcon from 'components/statusIcon'", () => {
  jsdom({ skipWindowCheck: true });

  it('renders green check circle if value prop is truthy', () => {
    const comp = TestUtils.renderIntoDocument(
      <StatusIcon value={'truthy'} />
    );

    const el = TestUtils.findRenderedDOMComponentWithTag(comp, 'i');
    expect(Array.from(el.classList)).to.include('fa-check-circle');
    expect(Array.from(el.classList)).to.include('icon-success');
  });

  it('renders red minus circle if value prop is falsy or undefined', () => {
    const comp = TestUtils.renderIntoDocument(
      <StatusIcon />
    );

    const el = TestUtils.findRenderedDOMComponentWithTag(comp, 'i');
    expect(Array.from(el.classList)).to.include('fa-minus-circle');
    expect(Array.from(el.classList)).to.include('icon-error');
  });
});
