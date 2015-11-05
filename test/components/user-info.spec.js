require('../testdom.js')('<html><body></body></html>');

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import jsdom from 'mocha-jsdom';
import { expect } from 'chai';

describe('Testing UserInfo Component', function () {
  jsdom({ skipWindowCheck: true });

  it('should contain text: temnoregg', function () {
    const Component = require('../../src/js/components/user-info.js');

    const comp = TestUtils.renderIntoDocument(
      <Component currentUser={{ name: 'temnoregg' }} />
    );

    const el = TestUtils.findRenderedDOMComponentWithTag(comp, 'button');

    expect(el.textContent.trim()).to.equal('temnoregg');
  });
});
