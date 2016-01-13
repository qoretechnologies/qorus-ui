import '../jsdom';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';


import Loader from '../../src/js/components/loader.js';


describe('Testing Loader Component', function () {
  it('should contain text: Loading!', function () {
    const nodeEl = TestUtils.renderIntoDocument(
      <Loader />
    );

    const divText = TestUtils.findRenderedDOMComponentWithTag(nodeEl, 'p');

    expect(divText.textContent).to.equal(' Loading');
  });
});
