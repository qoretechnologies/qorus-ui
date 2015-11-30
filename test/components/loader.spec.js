import '../jsdom';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';

describe('Testing Loader Component', function () {
  it('should contain text: Loading!', function () {
    const Component = require('../../src/js/components/loader.js');


    const nodeEl = TestUtils.renderIntoDocument(
      <Component />
    );

    const divText = TestUtils.findRenderedDOMComponentWithTag(nodeEl, 'p');

    expect(divText.textContent).to.equal(' Loading');
  });
});
