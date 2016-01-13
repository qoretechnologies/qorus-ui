import '../jsdom';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';


import Header from '../../src/js/components/header.js';


describe('Testing Header Component', function () {
  it('should contain text: test-1!', function () {
    const myDiv = TestUtils.renderIntoDocument(
      <Header
        info={{ 'instance-key': 'test-1' }}
        currentUser={{ username: 'panda' }}
      />
    );

    const divText = TestUtils.findRenderedDOMComponentWithTag(myDiv, 'h2');

    expect(divText.textContent).to.equal('test-1');
  });
});
