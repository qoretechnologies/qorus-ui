import '../jsdom';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';

describe('Testing UserInfo Component', function () {
  it('should contain text: temnoregg', function () {
    const Component = require('../../src/js/components/userInfo.js');

    const comp = TestUtils.renderIntoDocument(
      <Component currentUser={{ name: 'temnoregg' }} />
    );

    const el = TestUtils.findRenderedDOMComponentWithTag(comp, 'button');

    expect(el.textContent.trim()).to.equal('temnoregg');
  });
});
